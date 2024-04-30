import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Socket } from 'ngx-socket-io';
import { Chart } from "chart.js";
import { nextTick } from 'process';
import { process } from 'ipaddr.js';
import { reduce } from 'rxjs/operators';
const router_data_flow = 'router_data_flow'

@Component({
  selector: 'livegraph',
  templateUrl: './livegraph.component.html',
  styleUrls: ['./livegraph.component.scss'],


})
export class LiveGraphComponent implements OnInit, OnDestroy {
  modalHeader; data; item; disconnect: any = []; img_result; GraphForm; gtime = ''; s_id;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname; gph; image: any = [];
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false; result;ul;dl;

  canvas; ctx;
  @ViewChild('mychart') mychart: ElementRef;

  constructor(
    private router: Router,
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private cust: CustService,
    private socket: Socket
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
     
  }

  clearSocket() {
    if (this.s_id) {
      this.socket.emit('stop')
    }
  }

  async getGraph() {
    this.clearSocket();
    this.s_id = Math.floor(100000 + Math.random() * 900000)
    this.getLiveGraph();

  }

  getLiveGraph() {
    // const socket = io("http://localhost:3000");
    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    let myChart: Chart = new Chart(this.ctx, {
      type: 'line',

      data: {
        datasets: [{
          label: 'Upload',
          backgroundColor: "rgba(255, 99, 132,0.4)",
          borderColor: "rgb(255, 99, 132)",
          fill: false,
          display: true,
          data: [],
        },

        {
          label: 'Download',
          backgroundColor: "rgba(3, 169, 252,0.4)",
          borderColor: "rgb(3, 169, 252)",
          fill: false,
          data: [],
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          labels: {
            fontColor: 'white',
          }
        },
        title: {
          display: true,
          fontColor: 'white',
          text: 'LIVE GRAPH'
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
               
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel + ' MB';
              return label;
            },
            title: function (tooltipItem) {
              // console.log(tooltipItem.xLabel, tooltipItem[0].xLabel);
              const t = new Date(tooltipItem[0].xLabel)
              return 'Time ' + [t.getHours(), t.getMinutes(), t.getSeconds()].join(':')

            }
          }
        },
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            ticks: {
              fontColor: 'white',
              // beginAtZero: true,
              userCallback: function (tick) {
                tick = new Date(tick)
                return [tick.getHours(), tick.getMinutes(), tick.getSeconds()].join(':');

              }
            },
            gridLines: {
              color: '#5a5c5c',

            },
            scaleLabel: {
              labelString: 'Time',
              display: true,
              fontColor: 'white',
            }
          }],
          yAxes: [{
            type: 'linear',
            ticks: {
              fontColor: 'white',
              beginAtZero: true,
              userCallback: function (tick) {
                return (tick) + ' MB';

              }
            },
            gridLines: {
              color: '#5a5c5c',
            },
            scaleLabel: {
              labelString: 'Bits Per Second',
              display: true,
              fontColor: 'white'
            }
          }]
        }
      }
    });
    this.startSocket(myChart)
  }

  startSocket(myChart) {
    this.socket.emit('start', { sessionID: this.s_id, duration: this.gtime, uid: this.item['id'] });
    // console.log(this.s_id);
    this.socket.on(router_data_flow, (data) => {
      // console.log(data);
      this.ul=data.rx;
      this.dl=data.tx;
      const t = new Date();
      myChart.data.datasets[0].data.push({ x: t, y: data.rx })
      myChart.data.datasets[1].data.push({ x: t, y: data.tx })
      myChart.update();
    });
  }


  ngOnDestroy() {
    this.clearSocket();
  }

  // createForm(){
  //   this.GraphForm = new FormGroup({
  //     gtime : new FormControl('',Validators.required)
  //   })
  // }

}