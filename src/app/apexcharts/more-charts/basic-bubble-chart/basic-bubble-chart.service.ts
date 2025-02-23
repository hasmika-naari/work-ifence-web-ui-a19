import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class BasicBubbleChartService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    public generateData(baseval:any, count:any, yrange:any) {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
            var y =
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
            series.push([x, y, z]);
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
                            name: "Bubble 1",
                            data: this.generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
                                min: 10,
                                max: 60
                            })
                        },
                        {
                            name: "Bubble 2",
                            data: this.generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
                                min: 10,
                                max: 60
                            })
                        },
                        {
                            name: "Bubble 3",
                            data: this.generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
                                min: 10,
                                max: 60
                            })
                        },
                        {
                            name: "Bubble 4",
                            data: this.generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
                                min: 10,
                                max: 60
                            })
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "bubble",
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        opacity: 0.8
                    },
                    title: {
                        text: undefined
                    },
                    xaxis: {
                        tickAmount: 12,
                        type: "category",
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
                        max: 70,
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
                    },
                    legend: {
                        show: true,
                        offsetY: 10,
                        fontSize: '13px',
                        position: "bottom",
                        horizontalAlign: "center",
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 15,
                            vertical: 5
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#basic_bubble_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}