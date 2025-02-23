import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { data } from "./series-data";

@Injectable({
    providedIn: 'root'
})
export class DatetimeAreaChartService {

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
                            data: data
                        }
                    ],
                    chart: {
                        type: "area",
                        height: 350
                    },
                    annotations: {
                        yaxis: [
                            {
                                y: 30,
                                borderColor: "#999",
                                label: {
                                    text: "Support",
                                    style: {
                                        color: "#fff",
                                        background: "#00E396"
                                    }
                                }
                            }
                        ],
                        xaxis: [
                            {
                                x: new Date("14 Nov 2012").getTime(),
                                borderColor: "#999",
                                label: {
                                    text: "Rally",
                                    style: {
                                        color: "#fff",
                                        background: "#775DD0"
                                    }
                                }
                            }
                        ]
                    },
                    dataLabels: {
                        enabled: false
                    },
                    markers: {
                        size: 0
                    },
                    xaxis: {
                        type: "datetime",
                        min: new Date("01 Mar 2012").getTime(),
                        tickAmount: 6,
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
                    colors: [
                        "#3761ee"
                    ],
                    tooltip: {
                        x: {
                            format: "dd MMM yyyy"
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.9,
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
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#datetime_area_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}