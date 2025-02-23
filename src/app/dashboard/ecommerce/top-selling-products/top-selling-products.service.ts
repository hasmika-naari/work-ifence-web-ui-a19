import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TopSellingProductsService {

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
                            name: "Income",
                            data: [180, 2150, 4000, 3995, 5225]
                        }
                    ],
                    chart: {
                        type: "area",
                        height: 292,
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#3761EE"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: "straight",
                        width: [3]
                    },
                    markers: {
                        size: 5,
                        strokeWidth: 0,
                        hover: {
                            sizeOffset: 2
                        }
                    },
                    grid: {
                        show: false,
                        strokeDashArray: 1,
                        borderColor: "#edeff5"
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
                            show: false,
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
                            "May"
                        ]
                    },
                    yaxis: {
                        labels: {
                            show: true,
                            style: {
                                colors: "#262626",
                                fontSize: "13px"
                            }
                        },
                        axisBorder: {
                            show: false,
                            color: '#edeff5'
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(val:any) {
                                return "$" + val;
                            }
                        }
                      }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#ecommerce_top_selling_products_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}