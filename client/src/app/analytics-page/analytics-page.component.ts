import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import {Chart} from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'gain',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'order',
      color: 'rgb(54, 162, 235)'
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);

      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      // ** temp **
      // gainConfig.labels.push('02.01.19');
      // gainConfig.data.push(200);
      // ** temp **

      // ** temp **
      //  orderConfig.labels.push('17.12.18');
      //  orderConfig.data.push(5);
      // ** temp **

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      // tslint:disable-next-line:no-unused-expression
      new Chart(gainCtx, createChartConfig(gainConfig));
      // tslint:disable-next-line:no-unused-expression
      new Chart(orderCtx, createChartConfig(orderConfig));

      this.pending = false;
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  };
}
