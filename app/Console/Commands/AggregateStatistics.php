<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SystemStatistic;
use App\Jobs\AggregateSystemStatistics;
use Carbon\Carbon;

class AggregateStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:aggregate-statistics {date? : The date to aggregate (YYYY-MM-DD format, default: yesterday)} {--force : Force overwrite existing statistics} {--queue : Dispatch to queue instead of running immediately}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Aggregate system statistics from LogVisitor and LogActivity tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->argument('date');
        $force = $this->option('force');
        $useQueue = $this->option('queue');

        // Validate date format
        if ($date) {
            try {
                $carbonDate = Carbon::createFromFormat('Y-m-d', $date);
            } catch (\Exception $e) {
                $this->error('Invalid date format. Please use YYYY-MM-DD format.');
                return 1;
            }
        } else {
            $carbonDate = Carbon::yesterday();
            $date = $carbonDate->toDateString();
        }

        $this->info("Aggregating statistics for date: {$date}");

        // Check if statistics already exist
        $existingStats = SystemStatistic::where('date', $date)->first();
        if ($existingStats && !$force) {
            if (!$this->confirm("Statistics already exist for {$date}. Do you want to overwrite them?")) {
                $this->info('Operation cancelled.');
                return 0;
            }
        }

        if ($useQueue) {
            // Dispatch to queue
            AggregateSystemStatistics::dispatch($date);
            $this->info("Statistics aggregation job dispatched for date: {$date}");
        } else {
            // Run immediately
            $this->withProgressBar(1, function () use ($date) {
                try {
                    $stats = SystemStatistic::createOrUpdateDailyStats($date);
                    
                    $this->newLine();
                    $this->info("✅ Statistics aggregation completed for date: {$date}");
                    $this->info("📊 Total Visitors: {$stats->total_visitors}");
                    $this->info("� Page Views: {$stats->page_views}");
                    $this->info("📱 Device Stats: " . json_encode($stats->device_stats));
                    $this->info("🌍 Geo Stats: " . json_encode($stats->geo_stats));
                    $this->info("📄 Page Stats: " . json_encode($stats->page_stats));
                    $this->info("🛒 Orders Count: {$stats->orders_count}");
                    $this->info("📧 Inquiries Count: {$stats->inquiries_count}");
                    
                } catch (\Exception $e) {
                    $this->newLine();
                    $this->error("❌ Failed to aggregate statistics: {$e->getMessage()}");
                    throw $e;
                }
            });
        }

        return 0;
    }
}
