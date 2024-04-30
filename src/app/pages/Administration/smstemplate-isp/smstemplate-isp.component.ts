import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ngx-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { AdminuserService, BusinessService, RoleService } from '../../_service/indexService';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-smstemplate-isp',
  templateUrl: './smstemplate-isp.component.html',
  styleUrls: ['./smstemplate-isp.component.scss']
})
export class SmstemplateIspComponent implements OnInit {

  smsdata; bulkSms = []; count; bus_details; settings;
  addtemp = true; edittemp = true;deltemp = true;

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: SmartTableData,
    private admin: AdminuserService,
    private business: BusinessService,
    private alert: ToasterService,
    public activeModal: NgbActiveModal,
    public role : RoleService

  ) {
        
    if(this.role.getmenurole(42)){
      this.addtemp = false;
      console.log(this.addtemp);
      
    }
    if(this.role.getmenurole(43)){
      this.edittemp = false;
    }
    if(this.role.getmenurole(44)){
      this.deltemp = false;
    }

    this.settings = {
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark" (click)="addClient($event)"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmCreate: true,
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
        add: this.addtemp,
        edit: this.edittemp,
        delete: this.deltemp,
      },
      columns: {
        isp_id: {
          title: 'Business Name',
          valuePrepareFunction: (isp_id: any) => {
            if (this.bus_details && isp_id) {
              let bus_name = this.bus_details.find(x => x.value == isp_id)
              // console.log(bus_name)
              return bus_name.title;
            }
          },
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.bus_details,
            },
          },
          filter: true
        },
        templates_id: {
          title: 'Template ID',
          type: 'number',
        },
        templates_name: {
          title: 'Template Name',
          type: 'string',
        },
        templates: {
          title: 'Template Message',
          type: 'string',
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

  async addClient(event) {
    let result = await this.admin.addSMSTemplateBusiness({ bulkSms: [event.newData] })
    if (result) {
      this.toastalert(result[0]['msg'], result[0].error_msg);
      if (result[0].error_msg == 0) {
        this.closeModal();
        event.confirm.resolve(event.newData);
        await this.initiallist();
      }
    }
  }

  async editConfirm(event) {
    let result = await this.admin.editSMSTemplateBusiness({ bulkSms: [event.newData] });
    if (result) {
      this.toastalert(result[0]['msg'], result[0].error_msg);
      if (result[0].error_msg == 0) {
        this.closeModal();
        event.confirm.resolve(event.newData);
        await this.initiallist();
      }
    }
  };

  toastalert(msg, status) {
    const toast: Toast = {
      type: status == 0 ? 'success' : 'warning',
      title: status == 0 ? 'Success' : 'Failure',
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

  async initiallist() {
    this.smsdata = await this.admin.listSMSTemplateBusiness({});
    // this.business_id = await this.business.showBusName({});
    // this.smsdata[0].push(this.business_id);
    // console.log('this.smsdata', this.smsdata[0], this.smsdata);
    this.source.load(this.smsdata[0]);
    this.count = this.smsdata[1].count;
  }
  
  async business_name() {
    this.bus_details = await this.business.showBusName({ smart_table: 1 })
    // console.log(this.bus_details)
    this.settings.columns.isp_id.editor.config.list = this.bus_details;
    this.settings = Object.assign({}, this.settings);
  }

  async ngOnInit() {
    await this.initiallist();
    await this.business_name();
  }


}
