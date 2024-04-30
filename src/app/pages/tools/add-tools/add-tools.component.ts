import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService, ToolService, } from '../../_service/indexService';
import { AddSuccessComponent } from '../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confrimation-dialog.service';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'add-tools',
  templateUrl: './add-tools.component.html',
  styleUrls: ['./add-tools.component.scss'],

})

export class AddToolsComponent implements OnInit {
  submit: boolean = false; ToolForm; groups; id; datas; editdatas;
  busname; grup; resell; config; radiusmsg;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private router: Router,
    public role: RoleService,
    private alert: ToasterService,
    private toolser: ToolService,
    public activeModal: NgbModal,
    private confirmser: ConfirmationDialogService,

  ) { }

  async ngOnInit() {
    this.createForm();
    await this.RadiusInfo();

  }

  async RadiusInfo() {
    let result = await this.toolser.radiusserver({ flag: 20 })
    this.radiusmsg = result[0]['msg'].replace('\\n', '<br />')
  }

  async toolsubmit(tflag) {
    if (this.ToolForm.invalid) {
      this.submit = true;
      return;
    }
    // window.confirm('Are Sure you want to complete the action!')
    this.confirmser.confirm('Please Confirm', 'Are you Sure Want to complete the action').then(async (confirmed) => {
      if (confirmed) {
        this.loading = true;
        let result = await this.toolser.radiusserver({ flag: tflag });
        if (result) {
          this.loading = false
          this.result_pop(result)
        }
      }
    }).catch();
  }

  result_pop(item) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }


  createForm() {
    this.ToolForm = new FormGroup({

    });
  }
}