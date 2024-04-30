import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService, RoleService, BusinessService, SelectService, NasService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
@Component({
	selector: 'edit-nas',
	templateUrl: './edit-nas.component.html'
})

export class editNasComponent implements OnInit {
	submit: boolean = false; editNasForm; data; busname; modalHeader;
	item; grup; id; editdata;
	public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
	public primaryColour = '#dd0031';
	public secondaryColour = '#006ddd';
	public loading = false;
	constructor(
		private activeModal: NgbActiveModal,
		private alert: ToasterService,
		private nas: NasService,
		private select: SelectService,
		private busser: BusinessService,
		private groupser: GroupService,
		public role: RoleService

	) { this.id = JSON.parse(localStorage.getItem('array')); }

	async business() {
		this.busname = await this.busser.showBusName({})
		// console.log(this.busname)
	}

	async GroupName() {
		this.grup = await this.groupser.showGroupName({ bus_id: this.editNasForm.value['bus_id'] })
		// console.log(res)
	}

	async ngOnInit() {
		this.createForm();
		await this.business();
		if (this.role.getroleid() <= 777) {
			this.editNasForm.controls['bus_id'].setValue(this.role.getispid())
			await this.GroupName();
		}
		await this.edit();
	}

	async edit() {
		let res = await this.nas.getnas({ id: this.id })
		this.editdata = res;
		// console.log(res);
		this.createForm();
		await this.GroupName();
	}

	async editNas() {
		// console.log(this.editNasForm.value)
		if (this.editNasForm.invalid) {
			this.submit = true;
			return;
		}
		if (this.editNasForm.value['type'] == "0") {
			this.editNasForm.controls['ciscobwmode'].setValue("0");
			this.editNasForm.controls['password'].setValue("");
		}
		else if (this.editNasForm.value['type'] == 1) {
			this.editNasForm.controls['ciscobwmode'].setValue("0");
			this.editNasForm.controls['apiusername'].setValue("");
			this.editNasForm.controls['apipassword'].setValue("");
		}
		else if (this.editNasForm.value['type'] == 3) {
			this.editNasForm.controls['coamode'].setValue("0");
			this.editNasForm.controls['apiusername'].setValue("");
			this.editNasForm.controls['password'].setValue("");
			this.editNasForm.controls['apipassword'].setValue("");
		} else {
			this.editNasForm.controls['password'].setValue("");
			this.editNasForm.controls['ciscobwmode'].setValue("0");
			this.editNasForm.controls['coamode'].setValue("0");
			this.editNasForm.controls['apiusername'].setValue("");
			this.editNasForm.controls['apipassword'].setValue("");
		}
		this.editNasForm.value['id'] = this.id;
		// console.log(this.item)
		// console.log(this.editNasForm.value)
		this.loading = true
		let result = await this.nas.editNas(this.editNasForm.value)
		this.loading = false;
		// this.data = result;
		// console.log(result)
		const toast: Toast = {
			type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
			title: result[0]['error_msg'] == 0 ? 'success' : 'warning',
			body: result[0]['msg'],
			timeout: 3000,
			showCloseButton: true,
			bodyOutputType: BodyOutputType.TrustedHtml,
		};
		this.alert.popAsync(toast);
		if (result[0]['error_msg'] == 0)
			this.closeModal();
	}

	closeModal() {
		this.activeModal.close();
	}

	pingchange(){
		this.editNasForm.value['ping_status']==1 ? this.editNasForm.get("port").setValidators(Validators.required):this.editNasForm.get('port').clearValidators();
		this.editNasForm.get('port').updateValueAndValidity();
	}

	onChange() {
		if (this.editNasForm.value['type'] == "0") {
			this.editNasForm.get("apiusername").setValidators(Validators.required);
		}else{
			this.editNasForm.get("apiusername").clearValidators();
			this.editNasForm.get('apiusername').updateValueAndValidity();
		}
		
	}

	createForm() {
		this.editNasForm = new FormGroup({
			bus_id: new FormControl(this.editdata ? this.editdata['isp_id'] : '', Validators.required),
			nasname: new FormControl(this.editdata ? this.editdata['shortname'] : '', Validators.required),
			ip: new FormControl(this.editdata ? this.editdata['nasname'] : '', [Validators.required, Validators.pattern('^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$')]),
			type: new FormControl(this.editdata ? this.editdata['type'] : '', Validators.required),
			ping_status : new FormControl(this.editdata ? this.editdata['ping']:'',Validators.required),
			port : new FormControl(this.editdata ? this.editdata['webport']:''),
			secret: new FormControl(''),
			password: new FormControl(''),
			coamode: new FormControl(this.editdata ? JSON.stringify(this.editdata['coamode']) : ''),
			api_ver: new FormControl(this.editdata ? JSON.stringify(this.editdata['apiver']) : ''),
			apiusername: new FormControl(this.editdata ? this.editdata['apiusername'] : ''),
			apipassword: new FormControl(''),
			ciscobwmode: new FormControl(this.editdata ? JSON.stringify(this.editdata['ciscobwmode']) : ''),
			descr: new FormControl(this.editdata ? this.editdata['description'] : ''),
			groupid: new FormControl(this.editdata ? this.editdata['groupid'] : '')
		});
		this.onChange();
	}
}