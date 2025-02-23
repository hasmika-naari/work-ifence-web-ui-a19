import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class BasicColumnChartService {

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
                            name: "Net Profit",
                            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
                        },
                        {
                            name: "Revenue",
                            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
                        },
                        {
                            name: "Free Cash Flow",
                            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 350,
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#3761ee", "#00cae3", "#ffb264"
                    ],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: "60%",
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 4,
                        show: true,
                        colors: ["transparent"]
                    },
                    xaxis: {
                        categories: [
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct"
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
                        title: {
                            text: "$ (thousands)",
                            style: {
                                color: "#5b5b98",
                                fontSize: "14px",
                                fontWeight: 500
                            }
                        },
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
                    fill: {
                        opacity: 1
                    },
                    tooltip: {
                        y: {
                            formatter: function(val:any) {
                                return "$" + val;
                            }
                        }
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
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#basic_column_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}