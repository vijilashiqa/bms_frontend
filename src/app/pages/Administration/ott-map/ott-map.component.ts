import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService, BusinessService, S_Service, ResellerService, AdminuserService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ngx-smart-table';
import { AddSuccessComponent } from '../success/add-success.component';
 
@Component({
  selector: 'ngx-ott-map',
  templateUrl: './ott-map.component.html',
  styleUrls: ['./ott-map.component.scss']
})
export class OttMapComponent implements OnInit {
  submit: boolean = false; busdata; resell; AddOttMapForm; ottplans;
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
        { value: '1', title: 'Enable' },
        { value: '0', title: 'Disable' },
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
          ottplanid: {
            title: 'ID',
            type: 'number',
          },
          ottplan_name: {
            title: 'OTTPLAN',
            type: 'String',
          },
          ottplancode: {
            title: 'PLANCODE',
            type: 'String',
          },
          gltvplanid: {
            title: 'GLTVID',
            type: 'String',
          },
          otttaxtype: {
            title: 'Tax',
            valuePrepareFunction: (otttaxtype: any) => {
              return (otttaxtype == 0 ? 'Inclusive' : 'Exclusive');
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
          ottamount: {
            title: 'Price',
            type: 'number',
          },
          days: {
            title: 'Time Unit',
            type: 'number',
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
          status: {
            title: 'Status',
            valuePrepareFunction: (status: any) => {
              return (status == 0 ? 'Disable' : 'Enable');
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
      this.AddOttMapForm.get('isp_id').setValue(this.role.getispid())
      await this.showReseller();
      await this.showOttPlan();
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
    this.resell = await this.resel.showResellerName({ bus_id: this.AddOttMapForm.value['isp_id'], except: 1, like: $event });
  }

  async showOttPlan() {
    this.ottplans = await this.ser.showOTTPlans({ bus_id: this.AddOttMapForm.value['isp_id'], map: 1 });
    console.log('OttPlans-----', this.ottplans);
    this.source.load(this.ottplans)
  }

  async addottmap() {
    this.submit = true;
    console.log('Selected Value ----', this.selectedRows)
    if (this.AddOttMapForm.invalid || !this.selectedRows) {
      window.alert('Please fill the fields or Select Plan');
      return
    }
    this.AddOttMapForm.value['plan'] = this.selectedRows
    console.log('OttMap Value-------', this.AddOttMapForm.value)

    let result = await this.admin.ottMap(this.AddOttMapForm.value)
    console.log('After ottmap result', result)
    if (result) {
      this.result_pop(result);
      if (result[0].error_msg == 0) {
        this.AddOttMapForm.reset();
        this.source.reset();
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
    this.AddOttMapForm = new FormGroup({
      isp_id: new FormControl('', Validators.required),
      manid: new FormControl('', Validators.required),
    })
  }

}
