import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class RevenueOverviewService {

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
                            name: "Orders",
                            type: "column",
                            data: [217, 184, 284, 217, 184, 318, 184, 284, 236, 184, 184, 254]
                        },
                        {
                            name: "Revenue",
                            type: "line",
                            data: [183, 65, 70, 145, 125, 240, 145, 198, 195, 135, 140, 210]
                        }
                    ],
                    chart: {
                        height: 448,
                        type: "line",
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 6,
                            columnWidth: '34px'
                        }
                    },
                    stroke: {
                        width: [0, 5]
                    },
                    dataLabels: {
                        enabled: false
                    },
                    colors: [
                        "#EFF2FF", "#2DB6F5"
                    ],
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    },
                    xaxis: {
                        axisBorder: {
                            show: false,
                            color: '#a9a9c8'
                        },
                        axisTicks: {
                            show: true,
                            color: '#a9a9c8',
                            borderType: 'dotted'
                        },
                        labels: {
                            show: true,
                            style: {
                                colors: "#262626",
                                fontSize: "13px"
                            }
                        },
                        categories: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec"
                        ]
                    },
                    yaxis: [
                        {
                            labels: {
                                show: true,
                                style: {
                                    colors: "#a9a9c8",
                                    fontSize: "13px"
                                }
                            },
                            axisBorder: {
                                show: false,
                                color: '#edeff5'
                            }
                        }
                    ],
                    legend: {
                        show: true,
                        position: 'top',
                        fontSize: '13px',
                        horizontalAlign: 'center',
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 15,
                            vertical: 0
                        },
                        markers: {
                            offsetY: 0
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#ecommerce_revenue_overview_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}