import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ngx-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { AdminuserService } from '../../_service/indexService';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngx-smstemplates',
  templateUrl: './smstemplates.component.html',
  styleUrls: ['./smstemplates.component.scss']
})
export class SmstemplatesComponent implements OnInit {

  smsdata; bulkSms = []; count;
  settings = {
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
    // actions: {
    //   add: false,
    //   position: "left"
    // },
    columns: {
      // id: {
      //   title: 'ID',
      //   type: 'number',
      // },
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

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: SmartTableData,
    private admin: AdminuserService,
    private alert: ToasterService,
    public activeModal: NgbActiveModal,

  ) {
    // const data = this.service.getData();
    // console.log('Data', data, 'source', this.source)
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  async addClient(event) {
    let result = await this.admin.addSMSTemplate({ bulkSms: [event.newData] })
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
    let result = await this.admin.editSMSTemplate({ bulkSms: [event.newData] });
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
    this.smsdata = await this.admin.listSMSTemplate();
    this.source.load(this.smsdata[0]);
    this.count = this.smsdata[1].count;
  }
  async ngOnInit() {
    await this.initiallist();
  }

}
