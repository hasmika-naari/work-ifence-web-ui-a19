import { Component } from '@angular/core';
import { BasicPieChartComponent } from './basic-pie-chart/basic-pie-chart.component';
import { PieDonutChartComponent } from './pie-donut-chart/pie-donut-chart.component';
import { PieMonochromeChartComponent } from './pie-monochrome-chart/pie-monochrome-chart.component';

@Component({
    selector: 'app-pie-charts',
    imports: [BasicPieChartComponent, PieDonutChartComponent, PieMonochromeChartComponent],
    templateUrl: './pie-charts.component.html',
    styleUrl: './pie-charts.component.scss'
})
export class PieChartsComponent {}