import { Component } from '@angular/core';
import { LineAreaChartComponent } from './line-area-chart/line-area-chart.component';
import { LineColumnAreaChartComponent } from './line-column-area-chart/line-column-area-chart.component';
import { LineColumnChartComponent } from './line-column-chart/line-column-chart.component';
import { MultipleYaxisChartComponent } from './multiple-yaxis-chart/multiple-yaxis-chart.component';

@Component({
    selector: 'app-mixed-charts',
    imports: [LineAreaChartComponent, LineColumnAreaChartComponent, LineColumnChartComponent, MultipleYaxisChartComponent],
    templateUrl: './mixed-charts.component.html',
    styleUrl: './mixed-charts.component.scss'
})
export class MixedChartsComponent {}