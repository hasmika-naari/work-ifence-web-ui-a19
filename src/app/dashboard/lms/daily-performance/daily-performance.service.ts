import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DailyPerformanceService {

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
                    series: [72],
                    chart: {
                        height: 273,
                        type: "radialBar"
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: -135,
                            endAngle: 135,
                            dataLabels: {
                                name: {
                                    offsetY: 103
                                },
                                value: {
                                    offsetY: 60,
                                    formatter: function(val:any) {
                                        return val + "%";
                                    }
                                }
                            },
                            track: {
                                background: '#EFF7FF',
                            }
                        }
                    },
                    colors: [
                        "#EE368C"
                    ],
                    stroke: {
                        dashArray: 4
                    },
                    labels: ["Today"]
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#lms_daily_performance_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}