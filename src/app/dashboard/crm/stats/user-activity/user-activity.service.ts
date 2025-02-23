import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class UserActivityService {

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
                            name: "Users Activity",
                            data: [2, 3, 4, 10, 4, 3, 3]
                        }
                    ],
                    chart: {
                        height: 225,
                        type: "bar",
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 6,
                            columnWidth: '30px'
                        }
                    },
                    colors: [
                        "#3354F4"
                    ],
                    dataLabels: {
                        enabled: true,
                        formatter: function(val:any) {
                            return val + "k";
                        },
                        offsetY: 7,
                        style: {
                            fontSize: "12px",
                            fontWeight: '500',
                            colors: ["#ffffff"]
                        }
                    },
                    grid: {
                        show: true,
                        strokeDashArray: 0,
                        borderColor: "#edeff5",
                        xaxis: {
                            lines: {
                                show: true
                            }
                        },
                        yaxis: {
                            lines: {
                                show: true
                            }
                        }
                    },
                    fill: {
                        opacity: 1
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
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        },
                        labels: {
                            show: false,
                            formatter: function(val:any) {
                                return val + "%";
                            }
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_user_acticity_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}