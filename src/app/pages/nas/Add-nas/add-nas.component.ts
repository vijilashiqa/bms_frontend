import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
import { GroupService, RoleService, BusinessService, SelectService, NasService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
	selector: 'add-nas',
	templateUrl: './add-nas.component.html'
})

export class AddNasComponent implements OnInit {
	submit: boolean = false; AddNasForm; item; data; grup; busname; bulkdata = [];
	bulk = []; arrayBuffer: any; failure: any[]; s = 0; f = 0; file: any[]; bulkNas = []; id; modalHeader;
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
		public role: RoleService,
	) { }

	async business() {
		this.busname = await this.busser.showBusName({});
		// this.select.showBusName({}).subscribe(result => {
		// console.log(this.busname)
	}

	async GroupName() {
		this.grup = await this.groupser.showGroupName({ bus_id: this.AddNasForm.value['bus_id'] })
		// this.select.showGroupName({ bus_id: this.AddNasForm.value['bus_id'] }).subscribe(res => {
		// console.log(res)
	}

	bulkvalid() {
		if (this.AddNasForm.value['create_type'] == '1') {
			this.AddNasForm.get('bus_id').clearValidators()
			this.AddNasForm.get('bus_id').updateValueAndValidity()

			this.AddNasForm.get('nasname').clearValidators()
			this.AddNasForm.get('nasname').updateValueAndValidity()

			this.AddNasForm.get('groupid').clearValidators()
			this.AddNasForm.get('groupid').updateValueAndValidity()

			this.AddNasForm.get('ip').clearValidators()
			this.AddNasForm.get('ip').updateValueAndValidity()

			this.AddNasForm.get('type').clearValidators()
			this.AddNasForm.get('type').updateValueAndValidity()

			this.AddNasForm.get('secret').clearValidators()
			this.AddNasForm.get('secret').updateValueAndValidity()

			this.AddNasForm.get('password').clearValidators()
			this.AddNasForm.get('password').updateValueAndValidity()

			this.AddNasForm.get('CPassword').clearValidators();
			this.AddNasForm.get('CPassword').updateValueAndValidity();

			this.AddNasForm.get('api_ver').clearValidators()
			this.AddNasForm.get('api_ver').updateValueAndValidity()

			this.AddNasForm.get('apiusername').clearValidators()
			this.AddNasForm.get('apiusername').updateValueAndValidity()

			this.AddNasForm.get('apipassword').clearValidators()
			this.AddNasForm.get('apipassword').updateValueAndValidity()

			this.AddNasForm.get('ciscobwmode').clearValidators()
			this.AddNasForm.get('ciscobwmode').updateValueAndValidity()

		}
	}

	async addNas() {
		this.submit = true
		this.filereader(this.file, async res => {
			this.bulk = res;
			let bulkvald: boolean = false;
			for (var i = 0; i < this.bulk.length; i++) {
				if (!this.bulk[i].hasOwnProperty('Circle Name')) {
					this.toastalert('Please fill the Circle Name in Excel Sheet');
					bulkvald = true;
					break;
				}
				else {
					let groupType = this.bulk[i]['Circle Name']
					this.bulk[i].groupid = groupType;
				}
				if (!this.bulk[i].hasOwnProperty('Nas Name')) {
					this.toastalert('Please Fill the Nas Name in Excell Sheet')
				}
				else {
					let nasname = this.bulk[i]['Nas Name']
					this.bulk[i].nasname = nasname;
				}
				if (!this.bulk[i].hasOwnProperty('IP Address')) {
					this.toastalert('Please Fill the IP Address in Excell Sheet')
				}
				else {
					let ipaddr = this.bulk[i]['IP Address']
					this.bulk[i].ip = ipaddr;
				}
				if (!this.bulk[i].hasOwnProperty('Nas Type')) {
					this.toastalert('Please Fill the Nas Type in Excell Sheet')
				}
				else {
					let nastype = this.bulk[i]['Nas Type']
					// console.log('fhghgj',this.bulk[i]['Nas Type'])
					nastype = nastype == 'Mikrotik' ? 0 : nastype == 'StarOS' ? 1 : nastype == 'ChilliSpot' ? 2 : nastype == 'Cisco' ? 3 : nastype == 'pfSense' ? 4 : 255
					// console.log("Nas",nastype);
					this.bulk[i].type = nastype;
					// console.log(this.bulk)
				}
				if (!this.bulk[i].hasOwnProperty('Secret Password')) {
					this.toastalert('Please Fill the Secret Password in Excell Sheet')
				}
				else {
					let secpaswrd = this.bulk[i]['Secret Password']
					this.bulk[i].secret = secpaswrd;
				}

				this.bulk[i].hasOwnProperty('Star Password')
				let starpass = this.bulk[i]['Star Password']
				this.bulk[i].password = starpass

				this.bulk[i].hasOwnProperty('Dynamic Data Rate')
				let ddrate = this.bulk[i]['Dynamic Data Rate']
				ddrate = ddrate == 'Disabled' ? 0 : ddrate == ' Mikrotik API (< MT v6)' ? 1 : 2

				this.bulk[i].coamode = ddrate

				this.bulk[i].hasOwnProperty('API Version')
				let apiver = this.bulk[i]['API Version']
				apiver = apiver == 'Pre 6.45.1' ? 0 : 1
				this.bulk[i].api_ver = apiver

				this.bulk[i].hasOwnProperty('API Password')
				let apipass = this.bulk[i]['API Password']
				this.bulk[i].apipassword = apipass

				this.bulk[i].hasOwnProperty('API Username')
				let apiname = this.bulk[i]['API Username']
				this.bulk[i].apiusername = apiname

				this.bulk[i].hasOwnProperty('Cisco Bandwith Support')
				let cisco = this.bulk[i]['Cisco Bandwith Support']
				cisco = cisco == 'None' ? 0 : cisco == 'Rate limit' ? 1 : 2

				this.bulk[i].ciscobwmode = cisco


				this.bulk[i].hasOwnProperty('Description')
				let descrp = this.bulk[i]['Description']
				this.bulk[i].descr = descrp;

				this.bulk[i].bus_id = this.AddNasForm.value['bus_id']

			}
			this.s = 0; this.f = 0;
			let s = 0;
			this.failure = [];
			// console.log(this.AddNasForm.value)
			if (this.AddNasForm.invalid) {
				this.submit = true;
				return;
			}
			let method = 'addNas';
			if (this.AddNasForm.value['create_type'] == '0') {
				if (this.AddNasForm.value['type'] == "0") {
					this.AddNasForm.controls['ciscobwmode'].setValue("0");
					this.AddNasForm.controls['password'].setValue("");
				}
				else if (this.AddNasForm.value['type'] == "1") {
					this.AddNasForm.controls['ciscobwmode'].setValue("0");
					this.AddNasForm.controls['apiusername'].setValue("");
					this.AddNasForm.controls['apipassword'].setValue("");
				}
				else if (this.AddNasForm.value['type'] == "3") {
					this.AddNasForm.controls['coamode'].setValue("0");
					this.AddNasForm.controls['apiusername'].setValue("");
					this.AddNasForm.controls['password'].setValue("");
					this.AddNasForm.controls['apipassword'].setValue("");
				} else {
					this.AddNasForm.controls['password'].setValue("");
					this.AddNasForm.controls['ciscobwmode'].setValue("0");
					this.AddNasForm.controls['coamode'].setValue("0");
					this.AddNasForm.controls['apiusername'].setValue("");
					this.AddNasForm.controls['apipassword'].setValue("");
				}

				// console.log(this.AddNasForm.value)
				this.bulkdata = [this.AddNasForm.value]
				this.loading = true;
				let result = await this.nas[method]({ bulkNas: this.bulkdata });
				this.loading = false;
				this.data = result;
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
			if (this.AddNasForm.value['create_type'] == '1') {
				// console.log(this.bulk)
				this.loading = true;
				let result = await this.nas[method]({ bulkNas: this.bulk });
				this.loading = false;
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
		})
	}

	changeListener(file) {
		this.file = file;
		this.filereader(this.file, result => {
			this.bulk = result;
		});
	}

	filereader(file, callback) {
		if (file) {
			let fileReader = new FileReader(), filedata;
			fileReader.onload = (e) => {
				this.arrayBuffer = fileReader.result;
				var data = new Uint8Array(this.arrayBuffer);
				var arr = new Array();
				for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
				var bstr = arr.join("");
				var workbook = JSXLSX.read(bstr, { type: "binary" });
				var first_sheet_name = workbook.SheetNames[0];
				var worksheet = workbook.Sheets[first_sheet_name];
				// console.log(JSXLSX.utils.sheet_to_json(worksheet,{raw:true}));
				callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }))
			}
			fileReader.readAsArrayBuffer(file);
		} else {
			callback([])
		}
	}

	toastalert(msg, status = 0) {
		const toast: Toast = {
			type: status == 1 ? 'success' : 'warning',
			title: status == 1 ? 'Success' : 'Failure',
			body: msg,
			timeout: 5000,
			showCloseButton: true,
			bodyOutputType: BodyOutputType.TrustedHtml,
		};
		this.alert.popAsync(toast);
	}


	closeModal() {
		this.activeModal.close();
	}

	async ngOnInit() {
		await this.business();
		this.createForm();
		if (this.role.getroleid() <= 777) {
			this.AddNasForm.controls['bus_id'].setValue(this.role.getispid())
			await this.GroupName();
		}
		if(this.role.getroleid()<775){
			this.AddNasForm.get('create_type').setValue('0');
			this.AddNasForm.get('groupid').setValue(this.role.getgrupid());
		}
	}

	pingchange() {
		this.AddNasForm.value['ping_status'] == 1 ? this.AddNasForm.get("port").setValidators(Validators.required) : this.AddNasForm.get('port').clearValidators();
		this.AddNasForm.get('port').updateValueAndValidity();
	}

	onChange() {

		if (this.AddNasForm.value['type'] == "0") {
			this.AddNasForm.get("apiusername").setValidators(Validators.required);
			this.AddNasForm.get("apipassword").setValidators(Validators.required);
			this.AddNasForm.get("CPassword").setValidators(Validators.required);
		}
		else {
			this.AddNasForm.get("apiusername").clearValidators();
			this.AddNasForm.get('apiusername').updateValueAndValidity();

			this.AddNasForm.get("apipassword").clearValidators();
			this.AddNasForm.get('apipassword').updateValueAndValidity();

			this.AddNasForm.get('CPassword').clearValidators();
			this.AddNasForm.get('CPassword').updateValueAndValidity();

		}
		if (this.AddNasForm.value['type'] == "1") {
			this.AddNasForm.get("password").setValidators(Validators.required);

		} else {
			this.AddNasForm.get('password').clearValidators();
			this.AddNasForm.get('password').updateValueAndValidity();


		}
	}

	createForm() {
		this.AddNasForm = new FormGroup({
			bus_id: new FormControl('', Validators.required),
			create_type: new FormControl('', Validators.required),
			nasname: new FormControl('', Validators.required),
			ip: new FormControl('', [Validators.required, Validators.pattern('^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$')]),
			ping_status: new FormControl(0, Validators.required),
			port: new FormControl(''),
			type: new FormControl('0', Validators.required),
			secret: new FormControl('', Validators.required),
			password: new FormControl(''),
			CPassword: new FormControl(''),
			coamode: new FormControl('2'),
			api_ver: new FormControl('1'),
			apiusername: new FormControl(''),
			apipassword: new FormControl(''),
			ciscobwmode: new FormControl('0'),
			descr: new FormControl(''),
			groupid: new FormControl('', Validators.required)
		});
	}
}