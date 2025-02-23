import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SteplineLineChartService {

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
                            name: "Stepline Series",
                            data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58]
                        }
                    ],
                    chart: {
                        type: "line",
                        height: 350
                    },
                    stroke: {
                        curve: "stepline"
                    },
                    colors: [
                        "#3761ee"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    title: {
                        text: "Stepline Chart",
                        align: "left",
                        offsetX: -9,
                        style: {
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#5b5b98'
                        }
                    },
                    markers: {
                        hover: {
                            sizeOffset: 4
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
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#stepline_line_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}