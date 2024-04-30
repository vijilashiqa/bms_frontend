import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { BusinessService } from '../../_service/indexService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'isplogo',
  templateUrl: './isplogo.component.html',

})

export class ISPLogoUpdateComponent implements OnInit {
  submit: boolean = false; LogoForm; datas; modalHeader; newlogo;
  selectedfile: File = null; fileupload; imageURL: any; files; item; logo;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: BusinessService,
    private router: Router,
    private sanitizer: DomSanitizer,

  ) { }

  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/pages/business/list-business'])
  }
  ngOnInit() {
    this.createForm();
    this.getisplogo();

  }

  upload(files: FileList) {
    this.selectedfile = files.item(0);
    if (this.selectedfile) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageURL = this.sanitizer.bypassSecurityTrustUrl(event.target.result)
      }
      reader.readAsDataURL(this.selectedfile);
    } else {
      this.imageURL = '';
    }
  }

  async updatelogo() {
    if (this.LogoForm.invalid) {
      this.submit = true;
      return;
    }
    const file = new FormData();
    let id = this.item.id, filename = 'logo',
      name = id + '-' + filename;
    file.append('file', this.selectedfile, name)
    file.append('id', id)
    let logoresult = await this.ser.uploadLogo(file);
    const toast: Toast = {
      type: logoresult[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: logoresult[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: logoresult[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (logoresult[0]['error_msg'] == 0) {
      this.closeModal();
      // this.router.navigate(['/pages/cust/viewcust'])
    }
  };

  async getisplogo() {
    const profileid = this.item.id;
    let result = await this.ser.getIspLogo({ id: profileid });
    // console.log('Result', result);
    this.logo = result;
    if (this.logo) {
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.logo[key] = 'data:image/png;base64,' + element
        };
      }
    }
  };


  createForm() {
    this.LogoForm = new FormGroup({
      isp_logo: new FormControl('', Validators.required),

    });
  }
}