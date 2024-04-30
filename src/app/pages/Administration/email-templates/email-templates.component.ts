import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from 'ng2-ckeditor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminuserService } from '../../_service/indexService';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  


@Component({
  selector: 'ngx-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit {
  submit: boolean = false;
  AddEmailForm; emailtemp; editorMail; subject; mailresult; bulkEmail; id;
  ckeConfig: CKEDITOR.config;

  constructor(
    private admin: AdminuserService,
    private alert: ToasterService,
    public activeModal: NgbActiveModal,
   ) { }

  onChange($event: any): void {
    // console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    // console.log("onPaste");
    //this.log += new Date() + "<br />";
  }
  onReady(event: any){
    event.editor.focus();
  }
   
  async ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      // extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      uiColor: '##CCEAEE',
      height: 400, // Setting height
      width: 'auto',
    };
    this.createForm();
    await this.showEmailTemplate();
    
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
    // console.log('value');
    if (this.AddEmailForm.invalid) {
      // console.log('Invalid');
      this.submit = true;
      return;
    }
    this.AddEmailForm.value['id'] = this.id;
    let result = await this.admin.UpdateEmailTemplate({ bulkEmail: [this.AddEmailForm.value], editordata: this.editorMail });
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
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }

  closeModal() {
    this.activeModal.close();
  }
  createForm() {
    this.AddEmailForm = new FormGroup({
      mailtemplate: new FormControl('', Validators.required),
      editor: new FormControl('', Validators.required),
      mailsubject: new FormControl('', Validators.required),
      template_id: new FormControl('', Validators.required),

    });
  }
  async showEmailTemplate() {
    this.emailtemp = await this.admin.showEmailTemplate({});
    // console.log(this.emailtemp);
  }

  async mailTemplates() {
    this.mailresult = await this.admin.showEmailTemplate({ id: this.AddEmailForm.value['mailtemplate'] })
    this.id = this.mailresult[0].mailtid;
    this.editorMail = this.mailresult[0].mtemplates;
    this.subject = this.mailresult[0].mail_subject;
    this.AddEmailForm.get('mailsubject').setValue(this.subject);
    this.AddEmailForm.get('template_id').setValue(this.mailresult[0].mtemplates_id);
  }
  resetfunc() {
    // console.log('Inside reset form'); 
    // this.AddEmailForm.get('mailtemplate').setValue(1);
    this.AddEmailForm.get('editor').setValue('');
    this.AddEmailForm.get('mailsubject').setValue('');
    this.AddEmailForm.get('template_id').setValue('');
  }



}
