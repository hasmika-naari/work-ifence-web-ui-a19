import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DataLabelsColumnChartService {

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
                            name: "Inflation",
                            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "bar",
                        toolbar: {
                            show: true
                        }
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                position: "top" // top, center, bottom
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function(val:any) {
                            return val + "%";
                        },
                        offsetY: -25,
                        style: {
                            fontSize: "12px",
                            colors: ["#304758"]
                        }
                    },
                    xaxis: {
                        categories: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec"
                        ],
                        position: "bottom",
                        labels: {
                            show: true,
                            style: {
                                colors: "#262626",
                                fontSize: "13px"
                            }
                        },
                        axisBorder: {
                            show: false,
                            color: '#a9a9c8'
                        },
                        axisTicks: {
                            show: true,
                            color: '#a9a9c8',
                            borderType: 'dotted'
                        },
                        tooltip: {
                            enabled: true,
                            offsetY: -35
                        }
                    },
                    colors: [
                        "#3761ee"
                    ],
                    yaxis: {
                        axisBorder: {
                            show: false,
                            color: '#edeff5'
                        },
                        axisTicks: {
                            show: false
                        },
                        labels: {
                            show: false,
                            formatter: function(val:any) {
                                return val + "%";
                            },
                            style: {
                                colors: "#a9a9c8",
                                fontSize: "13px"
                            }
                        }
                    },
                    title: {
                        text: "Monthly Inflation in Brazil, 2024",
                        align: "left",
                        offsetX: -9,
                        style: {
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#5b5b98'
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#data_labels_column_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}