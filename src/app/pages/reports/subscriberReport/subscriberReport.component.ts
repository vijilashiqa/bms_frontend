import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { PagerService, CustService, RoleService } from '../../_service/indexService';

@Component({
   selector: 'subscriberReport',
   templateUrl: './subscriberReport.component.html',
   styleUrls: ['./subscriberReport.component.scss'],
   encapsulation: ViewEncapsulation.None

})

export class SubscriberReportComponent implements OnInit {
   data: any = []; serid; trafficdata: any = []; trafcount; totdl; totul; overaltot;
   from_date = ''; to_date = ''; img_result;

   pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;

   constructor(
      public router: Router,
      public role: RoleService,
      private custser: CustService,
      public pageservice: PagerService,
      private alert: ToasterService,


   ) { }


   async ngOnInit() {
      await this.view();
      await this.trafficreport();
   }

   async view() {
      let result = await this.custser.ViewSubscriber({ id: this.role.getsubid() })
      this.data = result || [];
      this.data['addr'] = 1;
      this.serid = result['srvid'];
      // console.log("username",this.data.username)
      // console.log("view",this.data)

      this.data.lcdllimit = this.data.lcdllimit == 0 ? 0 : this.bytefunc(this.data.lcdllimit);
      this.data.lcuplimit = this.data.lcuplimit == 0 ? 0 : this.bytefunc(this.data.lcuplimit);
      this.data.lclimitcomb = this.data.lclimitcomb == 0 ? 0 : this.bytefunc(this.data.lclimitcomb);
   }

   async getImage() {
      // console.log("hit")
      var subsusername = this.data.username,
         profileid = this.data.cust_profile_id
      // console.log(subsusername)
      let result = await this.custser.getImage({ username: subsusername, profileid: profileid })
      this.img_result = result;
      if (this.img_result) {
         for (const key in result) {
            if (Object.prototype.hasOwnProperty.call(result, key)) {
               const element = result[key];
               this.img_result[key] = 'data:image/png;base64,' + element
               // console.log("image",this.img_result)

            }
         }
      }
   }


   async trafficreport() {
      let result = await this.custser.showdatatrafic({
         index: (this.page - 1) * this.limit,
         limit: this.limit, uid: this.role.getsubid(), stime: this.from_date, etime: this.to_date
      })
      this.trafficdata = result[0];
      this.trafcount = result[1]['count']
      var dltot = result[1]['totinput'],
         ultot = result[1]['totoutput'],
         totlimit = result[1]['total'];
      this.totdl = dltot == 0 ? '0 Bytes' : this.bytefunc(dltot);
      this.totul = ultot == 0 ? 'o Bytes' : this.bytefunc(ultot);
      this.overaltot = totlimit == 0 ? '0 Bytes' : this.bytefunc(totlimit);
      // console.log("traffic:", result)
      for (let i = 0; i < this.trafficdata.length; i++) {
         this.trafficdata[i]['time'] = this.secondconvert(this.trafficdata[i]['dhms']);
         this.trafficdata[i]['upload'] = this.trafficdata[i]['acctoutputoctets'] == 0 ? '0 Bytes' : this.bytefunc(this.trafficdata[i]['acctoutputoctets']);
         this.trafficdata[i]['download'] = this.trafficdata[i]['acctinputoctets'] == 0 ? '0 Bytes' : this.bytefunc(this.trafficdata[i]['acctinputoctets']);
         this.trafficdata[i]['total'] = this.trafficdata[i]['tot'] == 0 ? '0 Bytes' : this.bytefunc(this.trafficdata[i]['tot']);

         // console.log( "speed",this.trafficdata[i]['total'])
      }
      this.setPage();
   }

   getlist(page) {
      var total = Math.ceil(this.trafcount / this.limit);
      let result = this.pageservice.pageValidator(this.page, page, total);
      this.page = result['value'];
      if (result['result']) {
         this.trafficreport();
      }
   }

   setPage() {
      // console.log(this.data);
      this.pager = this.pageservice.getPager(this.trafcount, this.page, this.limit);
      this.pagedItems = this.trafficdata;
      // console.log('asdfg',this.pagedItems)
   }

   bytefunc(datam) {
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(datam) / Math.log(k));
      return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
   }

   secondconvert(data) {
      var seconds = data;
      var days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      var hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      var mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;
      // console.log(days+" days, "+hrs+" Hrs, "+mnts+" Minutes, "+seconds+" Seconds");
      return (days + " days, " + hrs + " Hrs, " + mnts + " Minutes, " + seconds + " Seconds")
   }

}