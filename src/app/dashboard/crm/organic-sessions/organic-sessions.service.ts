import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class OrganicSessionsService {

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
                    series: [50, 30, 25, 20, 15, 10],
                    chart: {
                        height: 383,
                        type: "donut"
                    },
                    labels: [
                        "USA - 50%", "Canada - 30%", "Japan - 25%", "Australia - 20%", "France - 15%", "UK - 10%"
                    ],
                    stroke: {
                        width: 2,
                        show: true,
                        curve: "smooth"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    colors: [
                        "#2DB6F5", "#6794DC", "#6771DC", "#8067DC", "#A367DC", "#C767DC"
                    ],
                    legend: {
                        offsetY: 0,
                        fontSize: "13px",
                        position: "bottom",
                        horizontalAlign: "left",
                        labels: {
                            colors: "#77838F",
                        },
                        itemMargin: {
                            horizontal: 12,
                            vertical: 8
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(val:any) {
                                return val + "%";
                            }
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#crm_organic_sessions_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}