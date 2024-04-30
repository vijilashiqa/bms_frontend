import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService, BusinessService, S_Service, ResellerService, AdminuserService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ngx-smart-table';
import { AddSuccessComponent } from '../success/add-success.component';

@Component({
  selector: 'ngx-updateottmap',
  templateUrl: './updateottmap.component.html',
  styleUrls: ['./updateottmap.component.scss']
})
export class UpdateottmapComponent implements OnInit {
  submit: boolean = false; busdata; resell; UpdateOttMapForm; ottplans;
  taxtype = []; days = []; ostatus = []; selectedRows;vendor=[];
  config; settings;
  pager;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  source: LocalDataSource = new LocalDataSource();
  constructor(
    private router: Router,
    private busser: BusinessService,
    public role: RoleService,
    private ser: S_Service,
    private activeModal: NgbModal,
    private resel: ResellerService,
    private admin: AdminuserService,
  ) {
    this.days = [
      { value: '1', title: 'Days' },
      { value: '2', title: 'Months' }
    ],
      this.taxtype = [
        { value: '0', title: 'Inclusive' },
        { value: '1', title: 'Exclusive' }
      ],
      this.ostatus = [
        { value: '0', title: 'Disable' },
        { value: '1', title: 'Enable' },
      ],
      this.vendor = [
        { value: '1', title: 'M2MIT' },
        { value: '2', title: 'PLAYBOX' }
      ],

      this.settings = {
        pager: {
          display: true,
          perPage: 25
        },
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
          edit: true,
          delete: false
        },
        selectMode: 'multi',

        columns: {
          omid: {
            title: 'ID',
            type: 'number',
            editable: false,
          },
          ottplanid: {
            title: 'OTTID',
            type: 'number',
            editable: false,
          },
          ottplan_name: {
            title: 'OTTPLAN',
            type: 'String',
            editable: false,
          },
          ottplancode: {
            title: 'PLANCODE',
            type: 'String',
            editable: false,
          },
          gltvplanid: {
            title: 'GLTVID',
            type: 'String',
            editable: false,
          },
          taxtype: {
            title: 'Tax',
            valuePrepareFunction: (taxtype: any) => {
              return (taxtype == 0 ? 'Inclusive' : 'Exclusive');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.taxtype
              },
            },
            filter: true,
          },
          ottamt: {
            title: 'Price',
            type: 'number',
          },
          days: {
            title: 'Time Unit',
            type: 'number',
            editable: false,
          },
          dayormonth: {
            title: 'Type',
            valuePrepareFunction: (dayormonth: any) => {
              return (dayormonth == 1 ? 'Days' : 'Months');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.days,
              },
            },
            filter: true,
            editable: false,
          },
          ott_vendor: {
            title: 'Vendor',
            valuePrepareFunction: (ott_vendor: any) => {
              return (ott_vendor == 1 ? 'M2MIT' : 'PLAYBOX');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.vendor,
              },
            },
            filter: true,
          },
          omstatus: {
            title: 'Status',
            valuePrepareFunction: (omstatus: any) => {
              return (omstatus == 0 ? 'Disable' : 'Enable');
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.ostatus,
              },
            },
            filter: true,
          },

        },
      };
  }

  async ngOnInit() {
    this.createForm();
    await this.showBusiness();
    if (this.role.getroleid() <= 777) {
      this.UpdateOttMapForm.get('isp_id').setValue(this.role.getispid())
      await this.showReseller();
     }
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


  async showBusiness($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event });
  }

  async showReseller($event = '') {
    this.resell = await this.resel.showResellerName({ bus_id: this.UpdateOttMapForm.value['isp_id'], except: 1, like: $event });
  }

  async showOttPlan() {
    if (this.role.getroleid() <= 777) {
      this.UpdateOttMapForm.get('isp_id').setValue(this.role.getispid())
      }
    this.ottplans = await this.admin.showOttMap({ bus_id: this.UpdateOttMapForm.value['isp_id'], resel_id: this.UpdateOttMapForm.value['manid'] });
    console.log('OttPlans-----', this.ottplans);
    this.source.load(this.ottplans)
  }

  async updateottmap() {
    this.submit = true;
    console.log('Selected Value ----', this.selectedRows)
    const invalid = [];
    const controls = this.UpdateOttMapForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    console.log('value',this.UpdateOttMapForm.value)
    if (this.UpdateOttMapForm.invalid || !this.selectedRows) {
      console.log('Invalid',invalid)

      window.alert('Please fill the fields or Select Plan');
      return
    }
    this.UpdateOttMapForm.value['plan'] = this.selectedRows
    console.log('OttMap Value-------', this.UpdateOttMapForm.value)

    let result = await this.admin.updateOttMap(this.UpdateOttMapForm.value)
    console.log('After ottmap result', result)
    if (result) {
      this.result_pop(result);
      if (result[0].error_msg == 0) {
        this.UpdateOttMapForm.reset();
      }
    }
  }

  result_pop(item) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }


  createForm() {
    this.UpdateOttMapForm = new FormGroup({
      isp_id: new FormControl('', Validators.required),
      manid: new FormControl('', Validators.required),
    })
  }

}
