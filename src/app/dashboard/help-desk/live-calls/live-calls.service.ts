import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LiveCallsService {

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
                            name: "Incoming",
                            data: [30, 37, 32, 34, 35, 44, 20]
                        },
                        {
                            name: "Outgoing",
                            data: [28, 42, 42, 38, 50, 38, 42]
                        },
                        {
                            name: "Canceled",
                            data: [50, 53, 42, 56, 35, 54, 48]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 275,
                        stacked: true,
                        stackType: "100%",
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "12px",
                            borderRadius: 7,
                            borderRadiusWhenStacked: 'last'
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    colors: [
                        "#A9A9C8", "#2DB6F5", "#3761EE"
                    ],
                    grid: {
                        show: false,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
                    },
                    xaxis: {
                        axisBorder: {
                            show: true,
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
                            "S",
                            "S",
                            "M",
                            "T",
                            "W",
                            "T",
                            "F"
                        ]
                    },
                    yaxis: {
                        tickAmount: 4,
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
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        show: true,
                        position: 'bottom',
                        fontSize: '13px',
                        offsetY: 7,
                        horizontalAlign: 'center',
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 15,
                            vertical: 4
                        },
                        markers: {
                            radius: 12,
                            offsetY: -1
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#help_desk_live_calls_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}