import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AvgResponseTimeService {

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
                            name: "Session Duration",
                            data: [45, 52, 38, 24, 33, 26, 21]
                        },
                        {
                            name: "Page Views",
                            data: [35, 41, 62, 42, 13, 18, 29]
                        }
                    ],
                    chart: {
                        height: 457,
                        type: "line",
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
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
                            vertical: 2
                        },
                        markers: {
                            radius: 12,
                            offsetY: -1
                        }
                    },
                    colors: [
                        "#2DB6F5", "#FBE38E"
                    ],
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
                            "Jul"
                        ]
                    },
                    yaxis: {
                        tickAmount: 6,
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
                    tooltip: {
                        y: [
                            {
                                title: {
                                    formatter: function(val:any) {
                                        return val + " (mins)";
                                    }
                                }
                            },
                            {
                                title: {
                                    formatter: function(val:any) {
                                        return val + " per session";
                                    }
                                }
                            }
                        ]
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#hd_avg_response_time_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}