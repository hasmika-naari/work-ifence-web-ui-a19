import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SalesForecastService {

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
                            name: "Sales",
                            data: [187, 261, 335]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 401,
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            borderRadius: 10,
                            borderRadiusApplication: 'end',
                            borderRadiusWhenStacked: 'last',
                            barHeight: '56px'
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#EDEFF5",
                        xaxis: {
                            lines: {
                                show: true
                            }
                        },
                        yaxis: {
                            lines: {
                                show: true
                            }
                        }
                    },
                    colors: [
                        "#3761EE"
                    ],
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
                                colors: "#A9A9C8",
                                fontSize: "13px"
                            }
                        },
                        categories: [
                            "Pending",
                            "Revenue",
                            "Goal"
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
                            show: true,
                            color: '#edeff5'
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_sales_forecast_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}