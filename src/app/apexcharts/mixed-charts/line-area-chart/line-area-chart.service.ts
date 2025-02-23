import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LineAreaChartService {

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
                            name: "Team A",
                            type: "area",
                            data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47]
                        },
                        {
                            name: "Team B",
                            type: "line",
                            data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61]
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "line",
                        toolbar: {
                            show: false
                        }
                    },
                    stroke: {
                        curve: "smooth"
                    },
                    colors: [
                        "#EDEFF5", "#3761EE"
                    ],
                    fill: {
                        type: "solid",
                        gradient: {
                            opacityFrom: 0.45,
                            opacityTo: 0.05
                        }
                    },
                    labels: [
                        "Dec 01",
                        "Dec 02",
                        "Dec 03",
                        "Dec 04",
                        "Dec 05",
                        "Dec 06",
                        "Dec 07",
                        "Dec 08",
                        "Dec 09 ",
                        "Dec 10"
                    ],
                    markers: {
                        size: 0
                    },
                    yaxis: [
                        {
                            title: {
                                text: "Series A",
                                style: {
                                    color: "#475569",
                                    fontSize: "14px",
                                    fontWeight: 500
                                }
                            },
                            labels: {
                                style: {
                                    colors: "#a9a9c8",
                                    fontSize: "13px"
                                }
                            },
                            axisBorder: {
                                show: false,
                                color: '#edeff5'
                            }
                        },
                        {
                            opposite: true,
                            title: {
                                text: "Series B",
                                style: {
                                    color: "#475569",
                                    fontSize: "14px",
                                    fontWeight: 500
                                }
                            },
                            labels: {
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
                    tooltip: {
                        shared: true,
                        intersect: false,
                        y: {
                            formatter: function(y:any) {
                                if (typeof y !== "undefined") {
                                    return y.toFixed(0) + " points";
                                }
                                return y;
                            }
                        }
                    },
                    legend: {
                        show: true,
                        offsetY: 10,
                        fontSize: '13px',
                        position: "bottom",
                        horizontalAlign: "center",
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 15,
                            vertical: 5
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#line_area_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}