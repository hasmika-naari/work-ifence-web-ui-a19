import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SellerOverviewService {

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
                            name: "New Issues",
                            data: [77, 122, 53, 137, 174, 77, 69, 77, 122, 53, 137, 174]
                        },
                        {
                            name: "Fixed Issues",
                            data: [100, 54, 78, 51, 65, 42, 73, 100, 54, 78, 51, 65]
                        },
                        {
                            name: "Closed Issues",
                            data: [94, 60, 75, 74, 34, 124, 78, 94, 60, 75, 74, 34]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 400,
                        stacked: true,
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#9b56a2", "#ae8ff7", "#93aafd"
                    ],
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 7,
                            columnWidth: '22px',
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        axisBorder: {
                            show: false,
                            color: '#edeff5'
                        },
                        axisTicks: {
                            show: false,
                            color: '#edeff5'
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
                    yaxis: {
                        labels: {
                            show: true,
                            style: {
                                colors: "#a9a9c8",
                                fontSize: "13px"
                            }
                        },
                        axisBorder: {
                            show: true,
                            color: '#edeff5'
                        }
                    },
                    legend: {
                        show: false
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#ecommerce_seller_overview_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}