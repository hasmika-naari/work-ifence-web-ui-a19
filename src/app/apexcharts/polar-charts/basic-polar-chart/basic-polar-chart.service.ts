import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class BasicPolarChartService {

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
                        14, 23, 21, 17, 15, 10, 12, 17, 21
                    ],
                    chart: {
                        type: "polarArea"
                    },
                    stroke: {
                        colors: ["#ffffff"]
                    },
                    fill: {
                        opacity: 0.8
                    },
                    plotOptions: {
                        polarArea: {
                            rings: {
                                strokeWidth: 1,
                                strokeColor: '#edeff5',
                            },
                            spokes: {
                                strokeWidth: 1,
                                connectorColors: '#edeff5',
                            }
                        }
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200
                                },
                                legend: {
                                    position: "bottom"
                                }
                            }
                        }
                    ],
                    labels: [
                        'Bananas', 'Apples', 'Grapes', 'Papayas', 'Mangos', 'Blueberrys', 'Cherrys', 'Oranges', 'Pineapples'
                    ],
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#edeff5"
                    },
                    legend: {
                        offsetY: 0,
                        fontSize: "13px",
                        labels: {
                            colors: '#77838f'
                        },
                        itemMargin: {
                            horizontal: 0,
                            vertical: 7
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#basic_polar_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}