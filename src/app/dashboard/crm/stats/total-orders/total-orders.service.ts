import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TotalOrdersService {

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
                        height: 150,
                        type: "radialBar"
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: -135,
                            endAngle: 135,
                            dataLabels: {
                                show: false
                            },
                            track: {
                                background: '#EFF7FF',
                            }
                        }
                    },
                    colors: [
                        "#2DB6F5"
                    ],
                    stroke: {
                        dashArray: 4
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_total_orders_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}