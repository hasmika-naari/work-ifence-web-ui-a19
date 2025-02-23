import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StackedAreaChartService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    public generateDayWiseTimeSeries = function(baseval:any, count:any, yrange:any) {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = baseval;
            var y =
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            series.push([x, y]);
            baseval += 86400000;
            i++;
        }
        return series;
    };

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                // Dynamically import ApexCharts
                const ApexCharts = (await import('apexcharts')).default;

                // Define chart options
                const options = {
                    series: [
                        {
                            name: "South",
                            data: this.generateDayWiseTimeSeries(
                                new Date("11 Feb 2017 GMT").getTime(),
                                20,
                                {
                                    min: 10,
                                    max: 60
                                }
                            )
                        },
                        {
                            name: "North",
                            data: this.generateDayWiseTimeSeries(
                                new Date("11 Feb 2017 GMT").getTime(),
                                20,
                                {
                                    min: 10,
                                    max: 20
                                }
                            )
                        },
                        {
                            name: "Central",
                            data: this.generateDayWiseTimeSeries(
                                new Date("11 Feb 2017 GMT").getTime(),
                                20,
                                {
                                    min: 10,
                                    max: 15
                                }
                            )
                        }
                    ],
                    chart: {
                        type: "area",
                        height: 350,
                        stacked: true,
                        events: {
                            selection: function(chart:any, e:any) {
                                console.log(new Date(e.xaxis.min));
                            }
                        },
                        toolbar: {
                            show: true
                        }
                    },
                    colors: [
                        "#3761ee", "#0f79f3", "#00cae3"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            opacityFrom: 0.6,
                            opacityTo: 0.8
                        }
                    },
                    legend: {
                        show: true,
                        position: "top",
                        fontSize: '13px',
                        horizontalAlign: "left",
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 10,
                            vertical: 0
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
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#stacked_area_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}