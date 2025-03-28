import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectOverviewService {

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
                            type: "rangeArea",
                            name: "Design",
                            data: [
                                {
                                    x: "Jan",
                                    y: [1100, 1900]
                                },
                                {
                                    x: "Feb",
                                    y: [1200, 1800]
                                },
                                {
                                    x: "Mar",
                                    y: [900, 2900]
                                },
                                {
                                    x: "Apr",
                                    y: [1400, 2700]
                                },
                                {
                                    x: "May",
                                    y: [2600, 3900]
                                },
                                {
                                    x: "Jun",
                                    y: [500, 1700]
                                },
                                {
                                    x: "Jul",
                                    y: [1900, 2300]
                                },
                                {
                                    x: "Aug",
                                    y: [1000, 1500]
                                }
                            ]
                        },
                        {
                            type: "rangeArea",
                            name: "Development",
                            data: [
                                {
                                    x: "Jan",
                                    y: [3100, 3400]
                                },
                                {
                                    x: "Feb",
                                    y: [4200, 5200]
                                },
                                {
                                    x: "Mar",
                                    y: [3900, 4900]
                                },
                                {
                                    x: "Apr",
                                    y: [3400, 3900]
                                },
                                {
                                    x: "May",
                                    y: [5100, 5900]
                                },
                                {
                                    x: "Jun",
                                    y: [5400, 6700]
                                },
                                {
                                    x: "Jul",
                                    y: [4300, 4600]
                                },
                                {
                                    x: "Aug",
                                    y: [2100, 2900]
                                }
                            ]
                        },
                        {
                            type: "line",
                            name: "Design",
                            data: [
                                {
                                    x: "Jan",
                                    y: 1500
                                },
                                {
                                    x: "Feb",
                                    y: 1700
                                },
                                {
                                    x: "Mar",
                                    y: 1900
                                },
                                {
                                    x: "Apr",
                                    y: 2200
                                },
                                {
                                    x: "May",
                                    y: 3000
                                },
                                {
                                    x: "Jun",
                                    y: 1000
                                },
                                {
                                    x: "Jul",
                                    y: 2100
                                },
                                {
                                    x: "Aug",
                                    y: 1200
                                },
                                {
                                    x: "Sep",
                                    y: 1800
                                },
                                {
                                    x: "Oct",
                                    y: 2000
                                }
                            ]
                        },
                        {
                            type: "line",
                            name: "Development",
                            data: [
                                {
                                    x: "Jan",
                                    y: 3300
                                },
                                {
                                    x: "Feb",
                                    y: 4900
                                },
                                {
                                    x: "Mar",
                                    y: 4300
                                },
                                {
                                    x: "Apr",
                                    y: 3700
                                },
                                {
                                    x: "May",
                                    y: 5500
                                },
                                {
                                    x: "Jun",
                                    y: 5900
                                },
                                {
                                    x: "Jul",
                                    y: 4500
                                },
                                {
                                    x: "Aug",
                                    y: 2400
                                },
                                {
                                    x: "Sep",
                                    y: 2100
                                },
                                {
                                    x: "Oct",
                                    y: 1500
                                }
                            ]
                        }
                    ],
                    chart: {
                        height: 444,
                        type: "rangeArea",
                        animations: {
                            speed: 500
                        },
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#3761EE", "#2DB6F5"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        opacity: [0.24, 0.24, 1, 1]
                    },
                    forecastDataPoints: {
                        count: 2,
                        dashArray: 4
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
                        }
                    },
                    yaxis: {
                        tickAmount: 5,
                        labels: {
                            style: {
                                colors: "#919aa3",
                                fontSize: "14px"
                            }
                        }
                    },
                    stroke: {
                        curve: "straight",
                        width: [0, 0, 2, 2]
                    },
                    legend: {
                        position: "top",
                        fontSize: '13px',
                        customLegendItems: ["Design", "Development"],
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 12,
                            vertical: 5
                        }
                    },
                    markers: {
                        hover: {
                            sizeOffset: 5
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#pm_project_overview_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}