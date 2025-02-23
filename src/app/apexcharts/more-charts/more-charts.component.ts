import { Component } from '@angular/core';
import { BasicBoxplotChartComponent } from './basic-boxplot-chart/basic-boxplot-chart.component';
import { BasicBubbleChartComponent } from './basic-bubble-chart/basic-bubble-chart.component';
import { BasicCandlestickChartComponent } from './basic-candlestick-chart/basic-candlestick-chart.component';
import { BasicHeatmapChartComponent } from './basic-heatmap-chart/basic-heatmap-chart.component';
import { BasicRangeAreaChartComponent } from './basic-range-area-chart/basic-range-area-chart.component';
import { BasicScatterChartComponent } from './basic-scatter-chart/basic-scatter-chart.component';
import { BasicTimelineChartComponent } from './basic-timeline-chart/basic-timeline-chart.component';
import { BasicTreemapChartComponent } from './basic-treemap-chart/basic-treemap-chart.component';

@Component({
    selector: 'app-more-charts',
    imports: [BasicBoxplotChartComponent, BasicBubbleChartComponent, BasicCandlestickChartComponent, BasicHeatmapChartComponent, BasicRangeAreaChartComponent, BasicScatterChartComponent, BasicTimelineChartComponent, BasicTreemapChartComponent],
    templateUrl: './more-charts.component.html',
    styleUrl: './more-charts.component.scss'
})
export class MoreChartsComponent {}