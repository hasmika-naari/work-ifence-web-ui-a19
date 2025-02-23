import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CoursesOverviewService {

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
                            name: "Enrolled",
                            data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
                        },
                        {
                            name: "Courses Completed",
                            data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
                        }
                    ],
                    chart: {
                        height: 433,
                        type: "line",
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#edeff5",
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
                    stroke: {
                        width: 2,
                        curve: "straight",
                        dashArray: [0, 0]
                    },
                    colors: [
                        "#2DB6F5", "#EE368C"
                    ],
                    markers: {
                        size: 7,
                        strokeWidth: 0,
                        hover: {
                            sizeOffset: 2
                        }
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
                            show: false,
                            color: '#edeff5'
                        }
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
                            vertical: 0
                        },
                        markers: {
                            offsetY: -1
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#lms_courses_overview_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}