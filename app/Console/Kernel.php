<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Aggregate system statistics daily at 1:00 AM
        $schedule->job(new \App\Jobs\AggregateSystemStatistics())
            ->dailyAt('01:00')
            ->description('Aggregate daily visitor statistics')
            ->withoutOverlapping();

        // Cleanup old visitor logs daily at 2:00 AM (keep 7 days)
        $schedule->job(new \App\Jobs\CleanupLogVisitors(7))
            ->dailyAt('02:00')
            ->description('Clean up visitor logs older than 7 days')
            ->withoutOverlapping();

        // Alternative: Keep 30 days (uncomment below and comment above)
        // $schedule->job(new \App\Jobs\CleanupLogVisitors(30))
        //     ->dailyAt('02:00')
        //     ->description('Clean up visitor logs older than 30 days')
        //     ->withoutOverlapping();

        // Weekly cleanup on Sundays at 3:00 AM (additional maintenance)
        $schedule->job(new \App\Jobs\CleanupLogVisitors(30))
            ->weekly()
            ->sundays()
            ->at('03:00')
            ->description('Weekly deep cleanup of visitor logs')
            ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
