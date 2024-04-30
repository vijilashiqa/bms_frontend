import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, RoleService, NasService, ResellerService } from '../../_service/indexService';
import { SmartTableData } from '../../../@core/data/smart-table';
import { LocalDataSource } from 'ngx-smart-table';
import { DatePipe } from '@angular/common';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from '../smart-table-datepicker/smart-table-datepicker.component';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'resel-packmapping',
  templateUrl: './resel-packmapping.component.html',
  providers: [DatePipe]
})

export class ResServiceMapComponent implements OnInit {
  submit: boolean = false; ResPackmapForm; id; editdatas; resell; busname; grup; pack; searchresell; reseldata: any = [];
  serassigndata; nasid; resid; state = ''; data = ''; mapdata; reselmaped; resellist; selectedRows;
  config; settings; v_status = []; type = []; time_unit = []; tax = []; ottplan = [];
  //   pack_price:any=[];time_unit:any=[];timeunit_type:any=[];subplan_name:any=[];
  subplandata;

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private router: Router,
    private alert: ToasterService,
    private ser: S_Service,
    private busser: BusinessService,
    private grupser: GroupService,
    private nasser: NasService,
    public role: RoleService,
    private resser: ResellerService,
    private datePipe: DatePipe,
    public activeModal: NgbModal,

  ) {
    this.v_status = [
      { value: '1', title: 'Disable' },
      { value: '2', title: 'Enable' }
    ],
      this.type = [
        { value: '0', title: 'Days' },
        { value: '1', title: 'Months' }
      ],
      this.tax = [
        { value: '0', title: 'Excluding Tax' },
        { value: '1', title: 'Including Tax' }
      ],
      this.ottplan = [
        { value: '0', title: 'Disable' },
        { value: '1', title: 'Enable' }
      ],
      this.settings = {

        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark" (click)="editConfirm($event)"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmSave: true,
        },
        delete: {
          deleteButtonContent: '<i class="nb-trash"></i>',
          confirmDelete: true,
        },
        actions: {
          add: false,
          edit: false,
          delete: false
        },
        selectMode: 'multi',

        columns: {
          // id: {
          //   title: 'ID',
          //   type: 'number',
          // },
          sub_plan: {
            title: 'Name',
            type: 'String',
          },
          amount: {
            title: 'Price',
            type: 'number',
          },
          tax_type: {
            title: 'Tax',
            valuePrepareFunction: (tax_type: any) => {
              return (tax_type == 0 ? 'Excluding Tax' : 'Including Tax');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.tax
              },
            },
            filter: true,
          },
          time_unit: {
            title: 'Time Unit',
            type: 'number',
          },
          type: {
            title: 'Type',
            valuePrepareFunction: (type: any) => {
              return (type == 0 ? 'Days' : 'Months');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.type,
              },
            },
            filter: true,
          },
          sottfrom: {
            title: 'OTTPlan',
            valuePrepareFunction: (sottfrom: any) => {
              return (sottfrom == 0 ? 'Disable' : 'Enable');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.ottplan,
              },
            },
            filter: true,
          },
          validity: {
            title: 'Validity',
            valuePrepareFunction: (validity: any) => {
              return (validity == 2 ? 'Enable' : 'Disable');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.v_status,

              },
            },
            filter: true,
          },
          startdate: {
            title: 'Start Date',
            // type: 'number',
            type: 'custom',
            renderComponent: SmartTableDatepickerRenderComponent,
            width: '250px',
            sortDirection: 'desc',
            valuePrepareFunction: (startdate: any) => {
              return this.datePipe.transform(startdate, 'dd MMM yyyy');
            },
            editor: {
              type: 'custom',
              component: SmartTableDatepickerComponent,
            }
          },
          enddate: {
            title: 'End Date',
            type: 'custom',
            renderComponent: SmartTableDatepickerRenderComponent,
            width: '250px',
            sortDirection: 'desc',
            valuePrepareFunction: (enddate: any) => {
              return this.datePipe.transform(enddate, 'dd MMM yyyy');
            },
            editor: {
              type: 'custom',
              component: SmartTableDatepickerComponent,
            }
          },

        },
      };
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onUserRowSelect(event) {
    this.selectedRows = event.selected;
  }

  async editConfirm(event) {
    event.confirm.resolve(event.newData);
  };

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async GroupName() {
    this.grup = await this.grupser.showGroupName({ bus_id: this.ResPackmapForm.value['bus_id'] });
    // console.log(res)
  }

  async resellername($event = '') {
    this.reseldata = await this.resser.showResellerName({ like: $event, bus_id: this.ResPackmapForm.value['bus_id'], groupid: this.ResPackmapForm.value['groupid'] ,except:1});
    // console.log("resell", this.reseldata);
  }

  async mapreseller($event = '') {
    this.resellist = await this.ser.showAssignReseller({
      like: $event, bus_id: this.ResPackmapForm.value['bus_id'], groupid: this.ResPackmapForm.value['groupid'],
      resel_id: this.ResPackmapForm.value['reseller'], srvid: this.ResPackmapForm.value['package']
    });
  }

  async service($event = '') {
    if (this.role.getroleid() >= 777) {
      this.pack = await this.ser.showService({ bus_id: this.ResPackmapForm.value['bus_id'], groupid: this.ResPackmapForm.value['groupid'],res_flag:1, resel_id: this.ResPackmapForm.value['reseller'], like: $event });
    }
    if (this.role.getroleid() <= 775) {
      this.pack = await this.ser.showService({ resel_id: this.ResPackmapForm.value['reseller'], res_flag: 1, like: $event });
    }
  }

  async subplanshow() {
    this.subplandata = await this.ser.showSubPlan({ edit_flag: 1, resel_id: this.ResPackmapForm.value['reseller'], srvid: this.ResPackmapForm.value['package'] });
    // console.log("subplan", this.subplandata);
    this.source.load(this.subplandata)
  }

  changevalid() {
    this.ResPackmapForm.controls.reseller.setValue('');
    this.ResPackmapForm.controls.package.setValue('');
  }

  async addNas() {
    if (this.ResPackmapForm.invalid) {
      this.submit = true;
      return;
    }
    // this.ResPackmapForm.value['resid'] = this.reselmaped;
    this.ResPackmapForm.value['plan'] = this.selectedRows
    let sermapdata = [this.ResPackmapForm.value]
    let result = await this.ser.priceMapping({ mapService: sermapdata });
    if (result) this.result_pop(result);
      // const toast: Toast = {
    //   type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
    //   title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
    //   body: result[0]['msg'],
    //   timeout: 5000,
    //   showCloseButton: true,
    //   bodyOutputType: BodyOutputType.TrustedHtml,
    // };
    // this.alert.popAsync(toast);
    if (result[0]['error_msg'] == 0) {
      await this.changevalid();
      this.ResPackmapForm.controls.to_reseller.setValue('');
    }
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.ResPackmapForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
    }
    if (this.role.getroleid() <= 666) {
      this.ResPackmapForm.get('groupid').setValue(this.role.getgrupid());
      this.ResPackmapForm.get('reseller').setValue(this.role.getresellerid());
      await this.resellername();
      await this.service();
    }
  }

  result_pop(item) {
    Object.assign(item, { plan: "1" });
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }


  createForm() {
    this.ResPackmapForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      reseller: new FormControl('', Validators.required),
      package: new FormControl('', Validators.required),
      to_reseller: new FormControl('', Validators.required),
    });
  }
}