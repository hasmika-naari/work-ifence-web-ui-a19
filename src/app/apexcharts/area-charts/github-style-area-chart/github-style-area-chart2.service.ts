import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { githubData } from "./github-data";

@Injectable({
    providedIn: 'root'
})
export class GithubStyleAreaChart2Service {

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
                            name: "commits",
                            data: githubData.series
                        }
                    ],
                    chart: {
                        height: 200,
                        type: "area",
                        toolbar: {
                            autoSelected: "selection"
                        },
                        brush: {
                            enabled: true,
                            target: "chartyear"
                        },
                        selection: {
                            enabled: true,
                            xaxis: {
                                min: new Date("26 Jan 2014").getTime(),
                                max: new Date("29 Mar 2015").getTime()
                            }
                        }
                    },
                    colors: [
                        "#7bd39a"
                    ],
                    legend: {
                        position: "top",
                        horizontalAlign: "left"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        opacity: 1,
                        type: "solid"
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
                    stroke: {
                        width: 0,
                        curve: "smooth"
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
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
                const chart = new ApexCharts(document.querySelector('#github_style_area_chart2'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}