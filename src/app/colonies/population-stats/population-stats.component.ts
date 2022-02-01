import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-population-stats',
  templateUrl: './population-stats.component.html',
  styleUrls: ['./population-stats.component.scss']
})
export class PopulationStatsComponent implements OnInit, OnChanges  {
  @Input()
  chartMonoData;
  @Input()
  chartPolyMinorData;
  @Input()
  chartPolyMediumData;
  @Input()
  chartPolyMajorData;
  @Input()
  polyMorph: boolean;

  barChartLabels: Label[] = [
    'Population'
  ];

  barChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
      display: true,
        scaleLabel: {
          display: true,
          labelString: ''
        }
      }],
      yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Amount'
      },
      ticks: {
        beginAtZero: true,
        steps: 5,
        stepValue: 100,
      }
  }] }
  };

  polyChartData: ChartDataSets[];
  monoChartData: ChartDataSets[];


  public colors = [
  {
    borderColor: 'black',
    backgroundColor: '#62d744'
  },
  {
    borderColor: 'black',
    backgroundColor: '#44a4d7'
  },
  {
    borderColor: 'black',
    backgroundColor: '#d74444'
  }
  ];

  barChartLegend = true;
  barChartPlugins = [];
  barChartType = 'bar';


  constructor() { }

  ngOnInit(): void {
    if (this.polyMorph) {
      this.polyChartData = [
        {
          data: this.chartPolyMinorData,
          label: 'Minor'
        },
        {
          data: this.chartPolyMediumData,
          label: 'Media'
        },
        {
          data: this.chartPolyMajorData,
          label: 'Major'
        }
      ];
    }
    else {
      this.monoChartData = [
        {
          data: this.chartMonoData,
          label: 'Worker'
        }
      ];
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change detected', changes.prop);
    this.ngOnInit();
  }

}
