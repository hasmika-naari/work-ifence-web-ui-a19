import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class BasicRangeAreaChartService {

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
                            name: "New York Temperature",
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
                        height: 350,
                        type: "rangeArea",
                        toolbar: {
                            show: true
                        }
                    },
                    stroke: {
                        curve: "straight"
                    },
                    title: {
                        text: "New York Temperature (all year round)",
                        align: "left",
                        offsetX: -9,
                        style: {
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#5b5b98'
                        }
                    },
                    colors: [
                        "#3761EE"
                    ],
                    markers: {
                        hover: {
                            sizeOffset: 5
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    yaxis: {
                        labels: {
                            show: true,
                            formatter: (val:any) => {
                                return val + "°C";
                            },
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
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#basic_range_area_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}