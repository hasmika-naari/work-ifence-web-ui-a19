import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TasksPerformanceService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                // Dynamically import ApexCharts
                const ApexCharts = (await import('apexcharts')).default;

                // Define chart options
                const options = {
                    series: [14, 20, 21, 23, 15],
                    chart: {
                        type: "polarArea",
                        height: 367
                    },
                    stroke: {
                        width: 4,
                        colors: ["#ffffff"]
                    },
                    fill: {
                        opacity: 1
                    },
                    labels: [
                        'Completed', 'Active', 'Assigned', 'Pending', 'In Progress '
                    ],
                    colors: [
                        "#ffa5cb", "#9378c9", "#ffcf9f", "#a5dfdf", "#82f0ff"
                    ],
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#f2f2f2"
                    },
                    legend: {
                        show: true,
                        offsetX: -40,
                        position: 'top',
                        fontSize: '13px',
                        horizontalAlign: 'left',
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 10,
                            vertical: 5
                        },
                        markers: {
                            offsetY: 1
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#pm_tasks_performance_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}