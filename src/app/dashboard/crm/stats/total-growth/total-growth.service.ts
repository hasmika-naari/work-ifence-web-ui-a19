import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TotalGrowthService {

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
                            name: "Morning Sales",
                            type: "column",
                            data: [44, 50, 41, 67, 22, 41]
                        },
                        {
                            name: "Evening Sales",
                            type: "line",
                            data: [42, 54, 43, 62, 24, 42]
                        }
                    ],
                    chart: {
                        type: "line",
                        height: 130,
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 0,
                            horizontal: false,
                            columnWidth: "8px"
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    markers: {
                        size: 6,
                        strokeWidth: 2,
                        hover: {
                            sizeOffset: 1
                        }
                    },
                    colors: [
                        "#ebeefd", "#3761ee"
                    ],
                    stroke: {
                        width: [0, 2],
                        curve: "smooth"
                    },
                    grid: {
                        show: false,
                        strokeDashArray: 0,
                        borderColor: "#edeff5"
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
                            show: false,
                            style: {
                                colors: "#262626",
                                fontSize: "13px"
                            }
                        },
                        categories: [
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul"
                        ]
                    },
                    yaxis: {
                        labels: {
                            show: false,
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
                                return "$" + val + "k";
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_total_growth_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}