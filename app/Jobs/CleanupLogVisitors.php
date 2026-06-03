<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\LogVisitor;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CleanupLogVisitors implements ShouldQueue
{
    use Queueable;

    /**
     * The number of days to keep visitor logs.
     *
     * @var int
     */
    public $daysToKeep;

    /**
     * Create a new job instance.
     */
    public function __construct($daysToKeep = 7)
    {
        $this->daysToKeep = $daysToKeep;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $cutoffDate = Carbon::now()->subDays($this->daysToKeep);
            
            // Count records to be deleted
            $recordsToDelete = LogVisitor::where('timestamp', '<', $cutoffDate)->count();
            
            if ($recordsToDelete > 0) {
                // Delete old visitor logs
                $deleted = LogVisitor::where('timestamp', '<', $cutoffDate)->delete();
                
                Log::info("Log visitors cleanup completed", [
                    'days_to_keep' => $this->daysToKeep,
                    'cutoff_date' => $cutoffDate->toDateString(),
                    'records_found' => $recordsToDelete,
                    'records_deleted' => $deleted,
                ]);
            } else {
                Log::info("No old visitor logs to clean up", [
                    'days_to_keep' => $this->daysToKeep,
                    'cutoff_date' => $cutoffDate->toDateString(),
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Failed to cleanup log visitors', [
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
        return ['cleanup', 'log-visitors', 'days:' . $this->daysToKeep];
    }
}
