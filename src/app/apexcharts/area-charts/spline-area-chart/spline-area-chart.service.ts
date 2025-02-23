import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SplineAreaChartService {

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
                            name: "Trinta",
                            data: [31, 40, 28, 51, 42, 70, 60]
                        },
                        {
                            name: "Social",
                            data: [11, 32, 45, 32, 34, 52, 41]
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "area",
                        toolbar: {
                            show: true
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: "smooth"
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            opacityFrom: 0.45,
                            opacityTo: 0.05
                        }
                    },
                    colors: [
                        "#EDEFF5", "#3761EE"
                    ],
                    xaxis: {
                        type: "datetime",
                        categories: [
                            "2018-09-19T00:00:00.000Z",
                            "2018-09-19T01:30:00.000Z",
                            "2018-09-19T02:30:00.000Z",
                            "2018-09-19T03:30:00.000Z",
                            "2018-09-19T04:30:00.000Z",
                            "2018-09-19T05:30:00.000Z",
                            "2018-09-19T06:30:00.000Z"
                        ],
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
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#spline_area_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}