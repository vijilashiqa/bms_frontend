import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from 'ng2-ckeditor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminuserService, BusinessService, RoleService } from '../../_service/indexService';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngx-emailtemplate-isp',
  templateUrl: './emailtemplate-isp.component.html',
  styleUrls: ['./emailtemplate-isp.component.scss']
})
export class EmailtemplateIspComponent implements OnInit {
  ckeConfig: CKEDITOR.config;
  submit: boolean = false;
  AddEmailIspForm; emailtemp; editorMail; subject; mailresult; bulkEmail; id;
  busname;
  constructor(
    private admin: AdminuserService,
    private bus: BusinessService,
    private alert: ToasterService,
    public activeModal: NgbActiveModal,
    public role : RoleService,
  ) { }

  onChange($event: any): void {
    // console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    // console.log("onPaste");
    //this.log += new Date() + "<br />";
  }
   
  async ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      // extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: 400 ,// Setting height
      width: 'auto'
    };
    this.createForm();
    await this.showEmailTemplateIsp();
    await this.business();
  }
  public isReadOnly = false;
  public editorData =
    `<p>{{ editorMail}} </p>`;

  // editors = ['Classic', 'Inline'];
  editors = ['Classic'];

  isHidden = false;

  isRemoved = false;

  public componentEvents: string[] = [];

  
  async afterSubmit() {
    console.log('value');
    if (this.AddEmailIspForm.invalid) {
      console.log('Invalid');
      this.submit = true;
      return;
    }
    this.AddEmailIspForm.value['id'] = this.id;
    let result = await this.admin.UpdateEmailTemplateIsp({ bulkEmail: [this.AddEmailIspForm.value], editordata: this.editorMail });
    if (result) {
      this.toastalert(result[0]['msg'], result[0].error_msg);
      if (result[0].error_msg == 0) {
        this.closeModal();
      }
    }
  }

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
  createForm() {
    this.AddEmailIspForm = new FormGroup({
      mailtemplate: new FormControl('', Validators.required),
      editor: new FormControl('', Validators.required),
      mailsubject: new FormControl('', Validators.required),
      template_id: new FormControl('', Validators.required),
      bus_id: new FormControl('', Validators.required),

    });
  }
  async showEmailTemplateIsp() {
    this.emailtemp = await this.admin.showEmailTemplateIsp({});
    // console.log(this.emailtemp);
  }
  async business() {
    this.busname = await this.bus.showBusName({})
    // console.log(this.busname)
  }

  async mailTemplates() {
    this.mailresult = await this.admin.showEmailTemplateIsp({ id: this.AddEmailIspForm.value['mailtemplate'] })
    // console.log('result',this.mailresult)
    this.id = this.mailresult[0].mailtid;
    this.editorMail = this.mailresult[0].mtemplates;
    this.subject = this.mailresult[0].mail_subject;
    this.AddEmailIspForm.get('mailsubject').setValue(this.subject);
    this.AddEmailIspForm.get('template_id').setValue(this.mailresult[0].mtemplates_id);
    this.AddEmailIspForm.get('bus_id').setValue(this.mailresult[0].isp_id);
  }
  resetfunc() {
    // console.log('Inside reset form'); 
    // this.AddEmailIspForm.get('mailtemplate').setValue(1);
    this.AddEmailIspForm.get('editor').setValue('');
    this.AddEmailIspForm.get('mailsubject').setValue('');
    this.AddEmailIspForm.get('template_id').setValue('');
    this.AddEmailIspForm.get('bus_id').setValue('');
  }



}
