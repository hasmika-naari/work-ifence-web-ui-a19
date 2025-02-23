import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class IssuesSummaryService {

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
                            name: "Pending Issues",
                            data: [280, 280, 280]
                        },
                        {
                            name: "Fixed Issues",
                            data: [240, 240, 240]
                        },
                        {
                            name: "Closed Issues",
                            data: [190, 190, 190]
                        },
                        {
                            name: "New Issues",
                            data: [170, 170, 170]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 427,
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "50px"
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    colors: [
                        "#74ABFF", "#AAE2FF", "#E4D4F6", "#CE93D8"
                    ],
                    stroke: {
                        width: 7,
                        show: true,
                        colors: ["transparent"]
                    },
                    grid: {
                        show: true,
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
                            show: true,
                            style: {
                                colors: "#262626",
                                fontSize: "13px"
                            }
                        },
                        categories: [
                            "Jan",
                            "Feb",
                            "Mar"
                        ]
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
                            show: true,
                            color: '#edeff5'
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        fontSize: '13px',
                        horizontalAlign: 'center',
                        labels: {
                            colors: '#77838f',
                        },
                        itemMargin: {
                            horizontal: 15,
                            vertical: 2
                        },
                        markers: {
                            radius: 12,
                            offsetY: -1
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#help_desk_issues_summary_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}