import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class OrderStatisticsService {

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
                    series: [80, 85, 80, 85],
                    chart: {
                        height: 249,
                        type: "radialBar"
                    },
                    plotOptions: {
                        radialBar: {
                            dataLabels: {
                                show: false
                            }
                        }
                    },
                    labels: [
                        "Orders", "Profit", "Payout", "Customer"
                    ],
                    colors: [
                        "#3354f4", "#74abff", "#3fb8f7", "#aae2ff"
                    ]
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#ecommerce_order_statistics_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}