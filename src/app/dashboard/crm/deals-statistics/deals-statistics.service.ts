import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DealsStatisticsService {

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
                    series: [
                        {
                            name: "Won",
                            data: [20, 100, 40, 30, 50, 80, 33]
                        }
                    ],
                    chart: {
                        height: 410,
                        type: "radar",
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: '11px',
                            fontWeight: '500',
                        }
                    },
                    plotOptions: {
                        radar: {
                            polygons: {
                                fill: {
                                    colors: ["#feeaf3", "#ffffff"]
                                }
                            }
                        }
                    },
                    colors: [
                        "#00B69B"
                    ],
                    markers: {
                        size: 4,
                        colors: ["#00B69B"],
                        strokeColors: ["#00B69B"],
                        strokeWidth: 2
                    },
                    tooltip: {
                        y: {
                            formatter: function(val:any) {
                                return val;
                            }
                        }
                    },
                    xaxis: {
                        labels: {
                            show: true,
                            style: {
                                colors: "#a9a9c8",
                                fontSize: "13px"
                            }
                        },
                        categories: [
                            "2021",
                            "2022",
                            "2023",
                            "2024",
                            "2018",
                            "2019",
                            "2020"
                        ]
                    },
                    yaxis: {
                        tickAmount: 5
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_deals_statistics_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}