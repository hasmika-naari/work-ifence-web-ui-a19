import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class BasicTimelineChartService {

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
                            data: [
                                {
                                    x: "Code",
                                    y: [
                                        new Date("2019-03-02").getTime(),
                                        new Date("2019-03-04").getTime()
                                    ]
                                },
                                {
                                    x: "Test",
                                    y: [
                                        new Date("2019-03-04").getTime(),
                                        new Date("2019-03-08").getTime()
                                    ]
                                },
                                {
                                    x: "Validation",
                                    y: [
                                        new Date("2019-03-08").getTime(),
                                        new Date("2019-03-12").getTime()
                                    ]
                                },
                                {
                                    x: "Deployment",
                                    y: [
                                        new Date("2019-03-12").getTime(),
                                        new Date("2019-03-18").getTime()
                                    ]
                                }
                            ]
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "rangeBar"
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true
                        }
                    },
                    xaxis: {
                        type: "datetime",
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
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    },
                    colors: [
                        "#3761EE"
                    ],
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#basic_timeline_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}