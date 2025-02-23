import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AnnualProfitService {

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
                            name: "Annual Profit",
                            data: [
                                {
                                    x: "Jan",
                                    y: [-2, 4]
                                },
                                {
                                    x: "Feb",
                                    y: [-1, 6]
                                },
                                {
                                    x: "Mar",
                                    y: [3, 10]
                                },
                                {
                                    x: "Apr",
                                    y: [8, 16]
                                },
                                {
                                    x: "May",
                                    y: [13, 22]
                                },
                                {
                                    x: "Jun",
                                    y: [18, 26]
                                },
                                {
                                    x: "Jul",
                                    y: [21, 29]
                                },
                                {
                                    x: "Aug",
                                    y: [21, 28]
                                },
                                {
                                    x: "Sep",
                                    y: [17, 24]
                                },
                                {
                                    x: "Oct",
                                    y: [11, 18]
                                },
                                {
                                    x: "Nov",
                                    y: [6, 12]
                                },
                                {
                                    x: "Dec",
                                    y: [1, 7]
                                }
                            ]
                        }
                    ],
                    chart: {
                        height: 130,
                        type: "rangeArea",
                        toolbar: {
                            show: false
                        }
                    },
                    stroke: {
                        curve: "straight"
                    },
                    colors: [
                        "#2DB6F5"
                    ],
                    markers: {
                        hover: {
                            sizeOffset: 5
                        }
                    },
                    grid: {
                        show: false,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        opacity: 1
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
                        }
                    },
                    yaxis: {
                        labels: {
                            show: false,
                            style: {
                                colors: "#a9a9c8",
                                fontSize: "13px"
                            },
                            formatter: (val:any) => {
                                return "$" + val + "k";
                            }
                        },
                        axisBorder: {
                            show: false,
                            color: '#edeff5'
                        }
                    },
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_annual_profit_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}