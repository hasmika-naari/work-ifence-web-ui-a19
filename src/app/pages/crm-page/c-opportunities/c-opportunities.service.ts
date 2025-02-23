import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class COpportunitiesService {

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
                    series: [80, 70, 60, 50],
                    chart: {
                        height: 350,
                        type: "radialBar"
                    },
                    plotOptions: {
                        radialBar: {
                            dataLabels: {
                                show: false
                            },
                            track: {
                                margin: 10,
                            },
                            hollow: {
                                size: '35%',
                            }
                        }
                    },
                    labels: [
                        "Won", "In Progress", "Lost", "Hot"
                    ],
                    colors: [
                        "#2db6f5", "#c767dc", "#6771dc", "#a367dc"
                    ]
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_opportunities_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}