import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service } from '../../_service/indexService';
@Component({
	selector: 'add-service',
	templateUrl: './addService.component.html',
	styles: ['hr{border: 0px;}']
})

export class AddServiceComponent implements OnInit {
	submit: boolean = false; ServiceForm; config;
	showser: any;
	shownas: any;
	showloc: any;
	constructor(
		private alert: ToasterService,
		private ser: S_Service,
		private router: Router
	) { }

	async addService() {
		// console.log(this.ServiceForm.value)
		this.submit = true;
		if (this.ServiceForm.invalid) {
			return;
		}

		this.ServiceForm.controls['srvtype'].setValue(this.ServiceForm.value['srvtype'] == '' ? 0 : this.ServiceForm.value['srvtype']);
		this.ServiceForm.controls['downrate'].setValue(this.ServiceForm.value['downrate'] == '' ? 0 : this.ServiceForm.value['downrate']);
		this.ServiceForm.controls['uprate'].setValue(this.ServiceForm.value['uprate'] == '' ? 0 : this.ServiceForm.value['uprate']);
		this.ServiceForm.controls['dlquota'].setValue(this.ServiceForm.value['dlquota'] == '' ? 0 : this.ServiceForm.value['dlquota']);
		this.ServiceForm.controls['ulquota'].setValue(this.ServiceForm.value['ulquota'] == '' ? 0 : this.ServiceForm.value['ulquota']);
		this.ServiceForm.controls['dlburstthreshold'].setValue(this.ServiceForm.value['dlburstthreshold'] == '' ? 0 : this.ServiceForm.value['dlburstthreshold']);
		this.ServiceForm.controls['ulburstlimit'].setValue(this.ServiceForm.value['ulburstlimit'] == '' ? 0 : this.ServiceForm.value['ulburstlimit']);
		this.ServiceForm.controls['combquota'].setValue(this.ServiceForm.value['combquota'] == '' ? 0 : this.ServiceForm.value['combquota']);
		this.ServiceForm.controls['dlburstlimit'].setValue(this.ServiceForm.value['dlburstlimit'] == '' ? 0 : this.ServiceForm.value['dlburstlimit']);
		this.ServiceForm.controls['ulburstlimit'].setValue(this.ServiceForm.value['ulburstlimit'] == '' ? 0 : this.ServiceForm.value['ulburstlimit']);
		this.ServiceForm.controls['ulburstthreshold'].setValue(this.ServiceForm.value['ulburstthreshold'] == '' ? 0 : this.ServiceForm.value['ulburstthreshold']);
		this.ServiceForm.controls['dlbursttime'].setValue(this.ServiceForm.value['dlbursttime'] == '' ? 0 : this.ServiceForm.value['dlbursttime']);
		this.ServiceForm.controls['ulbursttime'].setValue(this.ServiceForm.value['ulbursttime'] == '' ? 0 : this.ServiceForm.value['ulbursttime']);
		this.ServiceForm.controls['timeaddmodeexp'].setValue(this.ServiceForm.value['timeaddmodeexp'] == '' ? 0 : this.ServiceForm.value['timeaddmodeexp']);
		this.ServiceForm.controls['timeaddmodeonline'].setValue(this.ServiceForm.value['timeaddmodeonline'] == '' ? 0 : this.ServiceForm.value['timeaddmodeonline']);
		this.ServiceForm.controls['trafficaddmode'].setValue(this.ServiceForm.value['trafficaddmode'] == '' ? 0 : this.ServiceForm.value['trafficaddmode']);
		this.ServiceForm.controls['timeunitexp'].setValue(this.ServiceForm.value['timeunitexp'] == '' ? 0 : this.ServiceForm.value['timeunitexp']);
		this.ServiceForm.controls['inittimeexp'].setValue(this.ServiceForm.value['inittimeexp'] == '' ? 0 : this.ServiceForm.value['inittimeexp']);
		this.ServiceForm.controls['timeunitonline'].setValue(this.ServiceForm.value['timeunitonline'] == '' ? 0 : this.ServiceForm.value['timeunitonline']);
		this.ServiceForm.controls['inittimeonline'].setValue(this.ServiceForm.value['inittimeonline'] == '' ? 0 : this.ServiceForm.value['inittimeonline']);
		this.ServiceForm.controls['timebaseonline'].setValue(this.ServiceForm.value['timebaseonline'] == '' ? 0 : this.ServiceForm.value['timebaseonline']);
		this.ServiceForm.controls['trafficunitdl'].setValue(this.ServiceForm.value['trafficunitdl'] == '' ? 0 : this.ServiceForm.value['trafficunitdl']);
		this.ServiceForm.controls['initdl'].setValue(this.ServiceForm.value['initdl'] == '' ? 0 : this.ServiceForm.value['initdl']);
		this.ServiceForm.controls['trafficunitul'].setValue(this.ServiceForm.value['trafficunitul'] == '' ? 0 : this.ServiceForm.value['trafficunitul']);
		this.ServiceForm.controls['initul'].setValue(this.ServiceForm.value['initul'] == '' ? 0 : this.ServiceForm.value['initul']);
		this.ServiceForm.controls['trafficunitcomb'].setValue(this.ServiceForm.value['trafficunitcomb'] == '' ? 0 : this.ServiceForm.value['trafficunitcomb']);
		this.ServiceForm.controls['inittotal'].setValue(this.ServiceForm.value['inittotal'] == '' ? 0 : this.ServiceForm.value['inittotal']);
		this.ServiceForm.controls['priority'].setValue(this.ServiceForm.value['priority'] == '' ? 8 : this.ServiceForm.value['priority']);

		this.ServiceForm.controls['unitprice'].setValue(this.ServiceForm.value['unitprice'] == '' ? "0.000000" : this.ServiceForm.value['unitprice']);
		this.ServiceForm.controls['unitpricetax'].setValue(this.ServiceForm.value['unitpricetax'] == '' ? "0.000000" : this.ServiceForm.value['unitpricetax']);
		this.ServiceForm.controls['unitpriceadd'].setValue(this.ServiceForm.value['unitpriceadd'] == '' ? "0.000000" : this.ServiceForm.value['unitpriceadd']);
		this.ServiceForm.controls['unitpriceaddgross'].setValue(this.ServiceForm.value['unitpriceaddgross'] == '' ? "0.000000" : this.ServiceForm.value['unitpriceaddgross']);
		this.ServiceForm.controls['unitpriceaddtax'].setValue(this.ServiceForm.value['unitpriceaddtax'] == '' ? "0.000000" : this.ServiceForm.value['unitpriceaddtax']);

		this.ServiceForm.controls['timequota'].setValue(this.ServiceForm.value['timequota'] == '' ? "00:00:00" : this.ServiceForm.value['timequota']);

		this.ServiceForm.controls['minamount'].setValue(this.ServiceForm.value['minamount'] == '' ? "1" : this.ServiceForm.value['minamount']);
		this.ServiceForm.controls['addamount'].setValue(this.ServiceForm.value['addamount'] == '' ? "1" : this.ServiceForm.value['addamount']);
		this.ServiceForm.controls['minamountadd'].setValue(this.ServiceForm.value['minamountadd'] == '' ? "1" : this.ServiceForm.value['minamountadd']);

		console.log(this.ServiceForm.value)

		let msg = await this.ser.addService(this.ServiceForm.value)
		console.log(msg);
		const toast: Toast = {
			type: msg['msg']['status'] == 1 ? 'success' : 'warning',
			title: msg['msg']['status'] == 1 ? 'Success' : 'Failure',
			body: msg['msg']['msg'],
			timeout: 5000,
			showCloseButton: true,
			bodyOutputType: BodyOutputType.TrustedHtml,
		};
		this.alert.popAsync(toast);
		if (msg['msg']['status'] == 1)
			this.router.navigate(['/pages/service/service-list'])
	}

	async ngOnInit() {
		this.createForm();
		await this.showService();
		await this.showNas();
		await this.showLoc();
	}

	async showService() {
		this.showser = await this.ser.showServiceName({})
	}

	async showNas() {
		this.shownas = await this.ser.showNas();
	}

	async showLoc() {
		this.showloc = await this.ser.showLoc();
	}

	createForm() {
		this.ServiceForm = new FormGroup({
			planname: new FormControl('', Validators.required),
			availucp: new FormControl(false),
			enableservice: new FormControl(true),
			limitdl: new FormControl(false),
			limitul: new FormControl(false),
			limitcomb: new FormControl(false),
			limitexp: new FormControl(true),
			limituptime: new FormControl(false),
			srvtype: new FormControl("0"),
			descr: new FormControl(''),
			downrate: new FormControl("0"),
			uprate: new FormControl("0"),
			policymapdl: new FormControl(''),
			policymapul: new FormControl(''),
			dlquota: new FormControl("0"),
			ulquota: new FormControl("0"),
			combquota: new FormControl("0"),
			timequota: new FormControl("00:00:00", Validators.pattern('^[0-9]{1,2}[:][0-9]{1,2}[:][0-9]{1,2}$')),
			enableburst: new FormControl(false),
			dlburstlimit: new FormControl("0"),
			ulburstlimit: new FormControl("0"),
			dlburstthreshold: new FormControl("0"),
			ulburstthreshold: new FormControl("0"),
			dlbursttime: new FormControl("0"),
			ulbursttime: new FormControl("0"),
			priority: new FormControl("8"),
			poolname: new FormControl(''),
			disnextsrvid: new FormControl("-1"),
			nextsrvid: new FormControl("-1"),
			dailynextsrvid: new FormControl("-1"),
			ignstatip: new FormControl(false),
			custattr: new FormControl(''),
			allowednases: new FormControl([], Validators.required),
			allowedmanagers: new FormControl([], Validators.required),
			pricecalcdownload: new FormControl(false),
			pricecalcupload: new FormControl(false),
			pricecalcuptime: new FormControl(false),
			monthly: new FormControl(false),
			renew: new FormControl(false),
			carryover: new FormControl(false),
			resetctrdate: new FormControl(true),
			resetctrneg: new FormControl(false),
			enaddcredits: new FormControl(false),
			unitprice: new FormControl("0.000000"),
			unitpricegross: new FormControl(),
			unitpricetax: new FormControl("0.000000"),
			unitpriceadd: new FormControl("0.000000"),
			unitpriceaddgross: new FormControl("0.000000"),
			unitpriceaddtax: new FormControl("0.000000"),
			timeaddmodeexp: new FormControl("0"),
			timeaddmodeonline: new FormControl("0"),
			trafficaddmode: new FormControl("0"),
			timeunitexp: new FormControl("0"),
			inittimeexp: new FormControl("0"),
			timebaseexp: new FormControl("2"),
			timeunitonline: new FormControl("0"),
			inittimeonline: new FormControl("0"),
			timebaseonline: new FormControl("0"),
			trafficunitdl: new FormControl("0"),
			initdl: new FormControl("0"),
			trafficunitul: new FormControl("0"),
			initul: new FormControl("0"),
			trafficunitcomb: new FormControl("0"),
			inittotal: new FormControl("0"),
			minamount: new FormControl("1"),
			addamount: new FormControl("1"),
			minamountadd: new FormControl("1")
		});
	}
}