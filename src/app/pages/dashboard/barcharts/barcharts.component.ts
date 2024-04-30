import { Component, OnInit, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { reduce } from 'bluebird';
import { DashboardService, RoleService, BusinessService } from '../../_service/indexService';
import { formatDate } from '@angular/common';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-barcharts',
  templateUrl: './barcharts.component.html',
  styleUrls: ['./barcharts.component.scss']
})
export class BarchartsComponent implements OnInit {
  options: any = {}; chartcount: any; arr: any = []; arr1: any = []; arr2: any = []; arr3: any = [];
  themeSubscription: any; bus_name; busid; data1: any = []; data2: any = []; data3: any = []; data4: any = [];
  private alive = true;
  now: any = new Date();
  yesterday: any = new Date();
  daybefore: any = new Date();
  daybefore2: any = new Date();
  daybefore3: any = new Date();
  daybefore4: any = new Date();
  daybefore5: any = new Date();
  @Output() periodChange = new EventEmitter<string>();

  // @Input() type: string = 'week';

  // types: string[] = ['Limras Test', 'Limras Live'];
  currentTheme: string;
  constructor(
    private theme: NbThemeService,
    private bus: BusinessService,
    public role: RoleService,
    public dash: DashboardService) {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
    this.now = formatDate(this.now.getTime(), 'dd-MM', 'en-US', '+0530');
    this.yesterday = formatDate(this.yesterday.getTime() - 24 * 60 * 60 * 1000, 'dd-MM', 'en-US', '+0530');
    this.daybefore = formatDate(this.daybefore.getTime() - 48 * 60 * 60 * 1000, 'dd-MM', 'en-US', '+0530');
    this.daybefore2 = formatDate(this.daybefore2.getTime() - 72 * 60 * 60 * 1000, 'dd-MM', 'en-US', '+0530');
    this.daybefore3 = formatDate(this.daybefore3.getTime() - 96 * 60 * 60 * 1000, 'dd-MM', 'en-US', '+0530');
    this.daybefore4 = formatDate(this.daybefore4.getTime() - 120 * 60 * 60 * 1000, 'dd-MM', 'en-US', '+0530');
    this.daybefore5 = formatDate(this.daybefore5.getTime() - 144 * 60 * 60 * 1000, 'dd-MM', 'en-US', '+0530');
  }
  // changePeriod(period: string): void {
  //   this.type = period;
  //   this.periodChange.emit(period);
  // }
  barCharts() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      // console.log("chart value ", this.chartcount)
      let count = this.chartcount ? this.chartcount : 0;
      // count.length ? count.length:0;
      // console.log("chart count",count.length)
      if (count.length == 7) {
        this.data4 = [this.chartcount[0].active_count, this.chartcount[1].active_count, this.chartcount[2].active_count, this.chartcount[3].active_count, this.chartcount[4].active_count, this.chartcount[5].active_count, this.chartcount[6].active_count],
          this.data3 = [this.chartcount[0].online_count, this.chartcount[1].online_count, this.chartcount[2].online_count, this.chartcount[3].online_count, this.chartcount[4].online_count, this.chartcount[5].online_count, this.chartcount[6].online_count],
          this.data2 = [this.chartcount[0].new_count, this.chartcount[1].new_count, this.chartcount[2].new_count, this.chartcount[3].new_count, this.chartcount[4].new_count, this.chartcount[5].new_count, this.chartcount[6].new_count],
          this.data1 = [this.chartcount[0].expiry_count, this.chartcount[1].expiry_count, this.chartcount[2].expiry_count, this.chartcount[3].expiry_count, this.chartcount[4].expiry_count, this.chartcount[5].expiry_count, this.chartcount[6].expiry_count];
      }

      if (count.length != 7 && count.length > 0) {
        let len = 7 - count.length
        for (let i = 1; i <= len; i++) {
          this.arr.push(0)
        }
        for (let i = 1; i <= len; i++) {
          this.arr1.push(0)
        }
        for (let i = 1; i <= len; i++) {
          this.arr2.push(0)
        }
        for (let i = 1; i <= len; i++) {
          this.arr3.push(0)
        }

        let len1 = (count.length - 1)
        for (let i = len1; i >= 0; i--) {
          this.arr.push(count[i].active_count)
        }
        for (let i = len1; i >= 0; i--) {
          this.arr1.push(count[i].online_count)
        }
        for (let i = len1; i >= 0; i--) {
          this.arr2.push(count[i].new_count)
        }
        for (let i = len1; i >= 0; i--) {
          this.arr3.push(count[i].expiry_count)
        }


        //  console.log('check',this.arr);
        //  console.log('check1',this.arr1);
        //  console.log('check2',this.arr2);
        //  console.log('check3',this.arr3);


        this.data4 = [this.arr[0], this.arr[1], this.arr[2], this.arr[3], this.arr[4], this.arr[5], this.arr[6]],
          this.data3 = [this.arr1[0], this.arr1[1], this.arr1[2], this.arr1[3], this.arr1[4], this.arr1[5], this.arr1[6]],
          this.data2 = [this.arr2[0], this.arr2[1], this.arr2[2], this.arr2[3], this.arr2[4], this.arr2[5], this.arr2[6]],
          this.data1 = [this.arr3[0], this.arr3[1], this.arr3[2], this.arr3[3], this.arr3[4], this.arr3[5], this.arr3[6]];

      }
      if (count.length == 0) {
        this.data1 = [0, 0, 0, 0, 0, 0, 0],
          this.data2 = [0, 0, 0, 0, 0, 0, 0],
          this.data3 = [0, 0, 0, 0, 0, 0, 0],
          this.data4 = [0, 0, 0, 0, 0, 0, 0];
      }

      const xAxisData = [this.daybefore5, this.daybefore4, this.daybefore3, this.daybefore2, this.daybefore, this.yesterday, this.now];



      // const data1 =[0,0,0,0,count[2].active_count,count[1].active_count,count[0].active_count];  
      // const data2 =[0,0,0,0,count[2].online_count,count[1].online_count,count[0].online_count];
      // const data3=[0,0,0,0,count[2].new_count,count[1].new_count,count[0].new_count];
      // const data4=[0,0,0,0,count[2].expiry_count,count[1].expiry_count,count[0].expiry_count];
      // if(count.length >0){

      //  this.data4 = [0,this.arr[6],this.arr[5],this.arr[4],this.arr[3],this.arr[2],this.arr[1]],
      //  this.data3= [0,this.arr1[6],this.arr1[5],this.arr1[4],this.arr1[3],this.arr1[2],this.arr1[1]],
      //  this.data2 = [0,this.arr2[6],this.arr2[5],this.arr2[4],this.arr2[3],this.arr2[2],this.arr2[1]],
      //  this.data1 = [0,this.arr3[6],this.arr3[5],this.arr3[4],this.arr3[3],this.arr3[2],this.arr3[1]];
      // }else{
      //   this.data1 =[0,0,0,0,0,0,0],  
      //   this.data2 =[0,0,0,0,0,0,0],
      //   this.data3=[0,0,0,0,0,0,0],
      //   this.data4=[0,0,0,0,0,0,0];  
      // }
      // console.log("data1",this.data1)
      // console.log("data2",this.data2)
      // console.log("data3",this.data3)
      // console.log("data4",this.data4)


      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.dangerLight],

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          // data: ['Active', 'bar2' , 'bar3' , 'bar4'],
          data: ['Active', 'Online', 'New', 'Expired'],
          align: 'right',
          textStyle: {
            color: 'red',
          },
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Active',
            type: 'bar',
            barWidth: '15%',
            color: '#6699FF',
            data: this.data4,

          },
          {
            name: 'Online',
            type: 'bar',
            barWidth: '15%',
            color: '#66CC00',
            data: this.data3,

          },
          {
            name: 'New',
            type: 'bar',
            barWidth: '15%',
            color: '#66FFFF',
            data: this.data2,

          },
          {
            name: 'Expired',
            type: 'bar',
            barWidth: '15%',
            color: '#ff9900',
            data: this.data1,

          },
        ],
      };
    });
  }

  async ngOnInit() {
    await this.barCharts();
    if (this.role.getroleid() > 777) {
      this.bus_name = 11
    }
    await this.getChart();
    await this.showBusName();
  }

  async showBusName() {
    let result = await this.bus.showBusName({})
    // console.log("Business name", result)
    this.busid = result;
  }

  async getChart() {
    if (this.role.getroleid() > 777) {
      // console.log("select option", this.bus_name)
      this.chartcount = await this.dash.chart({ bus_id: this.bus_name })
      // console.log("Chart Result",result)
      await this.barCharts();

    }
    if (this.role.getroleid() <= 777) {
      this.chartcount = await this.dash.chart({})
      // console.log("Chart Result",result)
      await this.barCharts();

    }
  }

  async changebus() {
    await this.getChart();

  }
}
