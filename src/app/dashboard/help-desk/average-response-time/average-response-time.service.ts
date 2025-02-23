import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AverageResponseTimeService {

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
                            name: "Morning Pick",
                            type: "column",
                            data: [440, 505, 414, 671, 227, 413]
                        },
                        {
                            name: "Evening Pick",
                            type: "line",
                            data: [423, 542, 435, 627, 243, 422]
                        }
                    ],
                    chart: {
                        height: 288,
                        type: "line",
                        toolbar: {
                            show: false
                        }
                    },
                    stroke: {
                        width: [0, 2],
                        curve: "smooth"
                    },
                    markers: {
                        size: 5,
                        strokeWidth: 0,
                        hover: {
                            sizeOffset: 1
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    colors: [
                        "#fcdceb", "#EE368C"
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
                            "00.00",
                            "01.30",
                            "05.00",
                            "07.30",
                            "14.00",
                            "17.30"
                        ]
                    },
                    yaxis: [
                        {
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
                        }
                    ],
                    legend: {
                        show: false,
                        position: 'bottom',
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
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#help_desk_average_response_time_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}