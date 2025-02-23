import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SyncingLineChartService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    public generateDayWiseTimeSeries(baseval:any, count:any, yrange:any): any[] {
        let i = 0;
        let series = [];
        while (i < count) {
            var x = baseval;
            var y =
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            series.push([x, y]);
            baseval += 86400000;
            i++;
        }
        return series;
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
                            name: "chart1",
                            data: this.generateDayWiseTimeSeries(
                                new Date("11 Feb 2017").getTime(),
                                20,
                                {
                                    min: 10,
                                    max: 60
                                }
                            )
                        }
                    ],
                    chart: {
                        id: "fb",
                        group: "social",
                        type: "line",
                        height: 160
                    },
                    colors: [
                        "#3761ee"
                    ],
                    yaxis: {
                        tickAmount: 2,
                        labels: {
                            minWidth: 40,
                            style: {
                                colors: "#a9a9c8",
                                fontSize: "13px"
                            }
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
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: "straight"
                    },
                    toolbar: {
                        tools: {
                            selection: false
                        }
                    },
                    markers: {
                        size: 6,
                        hover: {
                            size: 10
                        }
                    },
                    tooltip: {
                        followCursor: false,
                        x: {
                            show: false
                        },
                        marker: {
                            show: false
                        },
                        y: {
                            title: {
                                formatter: function() {
                                    return "";
                                }
                            }
                        }
                    },
                    grid: {
                        clipMarkers: false,
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5",
                        row: {
                            colors: ["#f4f6fc", "transparent"], // takes an array which will be repeated on columns
                            opacity: 0.5
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#syncing_line_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}