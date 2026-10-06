<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\SystemStatistic;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AggregateSystemStatistics implements ShouldQueue
{
    use Queueable;

    /**
     * The date to aggregate statistics for.
     *
     * @var string|null
     */
    public $date;

    /**
     * Create a new job instance.
     */
    public function __construct($date = null)
    {
        $this->date = $date ?: Carbon::yesterday()->toDateString();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Starting system statistics aggregation for date: ' . $this->date);

            // Create or update daily statistics
            $stats = SystemStatistic::createOrUpdateDailyStats($this->date);

            Log::info('System statistics aggregation completed for date: ' . $this->date, [
                'total_visitors' => $stats->total_visitors,
                'unique_visitors' => $stats->unique_visitors,
                'page_views' => $stats->page_views,
                'total_activities' => $stats->total_activities,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to aggregate system statistics for date: ' . $this->date, [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    /**
     * Get the tags that should be assigned to the job.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return ['statistics', 'aggregation', 'date:' . $this->date];
    }
}
