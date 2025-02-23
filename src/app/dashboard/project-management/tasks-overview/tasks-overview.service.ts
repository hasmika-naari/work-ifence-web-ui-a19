import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TasksOverviewService {

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
                            name: "Revenue",
                            type: "column",
                            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 34]
                        },
                        {
                            name: "Number of Project",
                            type: "area",
                            data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 34]
                        },
                        {
                            name: "Active Project",
                            type: "line",
                            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 34]
                        }
                    ],
                    chart: {
                        height: 434,
                        type: "line",
                        stacked: false,
                        toolbar: {
                            show: false
                        }
                    },
                    stroke: {
                        width: [0, 2, 2],
                        curve: "smooth"
                    },
                    grid: {
                        show: false,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 5,
                            borderRadiusApplication: 'end',
                            columnWidth: "18px"
                        }
                    },
                    colors: [
                        "#90acd6", "#ee368c", "#3761ee"
                    ],
                    fill: {
                        opacity: [1, 0.10, 1]
                    },
                    xaxis: {
                        axisBorder: {
                            show: true,
                            color: '#edeff5'
                        },
                        axisTicks: {
                            show: true,
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
                const chart = new ApexCharts(document.querySelector('#pm_tasks_overview_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}