import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class GradientLineChartService {

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
                            name: "Likes",
                            data: [0, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "line",
                        toolbar: {
                            show: true
                        }
                    },
                    stroke: {
                        width: 7,
                        curve: "smooth"
                    },
                    xaxis: {
                        type: "datetime",
                        categories: [
                            "1/11/2000",
                            "2/11/2000",
                            "3/11/2000",
                            "4/11/2000",
                            "5/11/2000",
                            "6/11/2000",
                            "7/11/2000",
                            "8/11/2000",
                            "9/11/2000",
                            "10/11/2000",
                            "11/11/2000",
                            "12/11/2000",
                            "1/11/2001",
                            "2/11/2001",
                            "3/11/2001",
                            "4/11/2001",
                            "5/11/2001",
                            "6/11/2001"
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
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    },
                    title: {
                        text: "Social Media",
                        align: "left",
                        offsetX: -9,
                        style: {
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#5b5b98'
                        }
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            gradientToColors: ["#FDD835"],
                            type: "horizontal",
                            shadeIntensity: 1,
                            opacityFrom: 1,
                            shade: "dark",
                            opacityTo: 1,
                        }
                    },
                    markers: {
                        size: 4,
                        strokeWidth: 2,
                        colors: ["#FFA41B"],
                        strokeColors: "#ffffff",
                        hover: {
                            size: 7
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
                const chart = new ApexCharts(document.querySelector('#gradient_line_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}