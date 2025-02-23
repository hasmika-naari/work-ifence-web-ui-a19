import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class VisitsByWeekService {

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
                            name: "Total Visited",
                            data: [
                                {
                                    x: "Mon",
                                    y: [1, 5]
                                },
                                {
                                    x: "Tue",
                                    y: [4, 6]
                                },
                                {
                                    x: "Wed",
                                    y: [5, 8]
                                },
                                {
                                    x: "Thu",
                                    y: [3, 11]
                                },
                                {
                                    x: "Fri",
                                    y: [4, 6]
                                },
                                {
                                    x: "Sat",
                                    y: [5, 8]
                                },
                                {
                                    x: "Sun",
                                    y: [2, 6]
                                }
                            ]
                        }
                    ],
                    chart: {
                        type: "rangeBar",
                        height: 277,
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "16px",
                            borderRadius: 8,
                            dataLabels: {
                                hideOverflowingLabels: false,
                            }
                        }
                    },
                    colors: [
                        "#ff8a54"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
                    },
                    legend: {
                        show: false,
                        fontSize: '14px',
                        labels: {
                            colors: "#262626"
                        },
                        itemMargin: {
                            horizontal: 10,
                            vertical: 0
                        }
                    },
                    xaxis: {
                        axisBorder: {
                            show: false,
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
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun"
                        ]
                    },
                    yaxis: {
                        tickAmount: 3,
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
                    tooltip: {
                        y: {
                            formatter: function(val:any) {
                                return "$" + val + "k";
                            }
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#ecommerce_visits_by_week_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}