import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { CustService } from '../../_service/indexService';


@Component({
  selector: 'voicepassword',
  templateUrl: './voicepassword.component.html',

})

export class VoicePasswordComponent implements OnInit {
  submit: boolean = false; VoicePassForm; datas; id; modalHeader;item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private router: Router
  ) {  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnInit() {
    this.createForm();

  }

  async Voicepasssubmit() {
    if (this.VoicePassForm.invalid) {
      this.submit = true;
      return;
    }
    this.VoicePassForm.value['id'] = this.item.vid;
    this.VoicePassForm.value['pwd_old'] = this.item.lpwd;

    let voicepwd = [this.VoicePassForm.value];
    let result = await this.ser.changeVoicePwd({ voice:voicepwd })
    this.datas = result;
    const toast: Toast = {
      type: result['error_msg'] == 0 ? 'success' : 'warning',
      title: result['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result['error_msg'] == 0) {
      this.closeModal();
    }
  }


  createForm() {
    this.VoicePassForm = new FormGroup({
      password: new FormControl('',Validators.required),

    });
  }
}