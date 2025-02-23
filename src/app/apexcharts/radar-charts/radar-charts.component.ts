import { Component } from '@angular/core';
import { BasicRadarChartComponent } from './basic-radar-chart/basic-radar-chart.component';
import { MultipleRadarChartComponent } from './multiple-radar-chart/multiple-radar-chart.component';
import { PolygonRadarChartComponent } from './polygon-radar-chart/polygon-radar-chart.component';

@Component({
    selector: 'app-radar-charts',
    imports: [BasicRadarChartComponent, MultipleRadarChartComponent, PolygonRadarChartComponent],
    templateUrl: './radar-charts.component.html',
    styleUrl: './radar-charts.component.scss'
})
export class RadarChartsComponent {}