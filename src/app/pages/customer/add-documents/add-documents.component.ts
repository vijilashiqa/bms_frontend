import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.scss'],

})

export class DocpopComponent implements OnInit {
  modalHeader; data; item; AddDocForm; add;
  add_proof_file: any; imageURL: any = []; imageurl: any = []; imagecafurl: any; addrflag; idflag; id_proof_file: any; cafflag;
  caf_proof: any; subs_pic: any; subpicurl: any; custpicflag;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  submit = false;

  constructor(
    private router: Router,
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private custser: CustService,
    private sanitizer: DomSanitizer,

  ) { }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    this.createForm();
    this.addrflag = this.item.addr
    this.idflag = this.item.idproof
    this.cafflag = this.item.cafaddr
    this.custpicflag = this.item.subpicflag
    console.log(this.item)

  }

  async adddoc() {
    // console.log(this.AddDocForm.value['same_proof'])
    this.submit = true;
    // if(this.idflag == 2 || this.AddDocForm.value['same_proof']){
    //   this.AddDocForm.get('ProofID').setValidators(Validators.required)
    // }else{
    //   this.AddDocForm.set('ProofID').clearValidators();
    //   this.AddDocForm.set('ProofID').updateValueAndValidity();
    // }
    if (this.AddDocForm.invalid && (this.idflag == 2 || this.AddDocForm.value['same_proof'])) {
      window.alert('Please Fill ProofID');
      return;
    }
    this.loading = true;
    const file = new FormData();
    let username = this.item.proid, uid = this.item.uid;
    file.append('username', username);
    file.append('uid', uid);

    if (this.addrflag == 2 || this.idflag == 2) {
      file.append('sameproof', String(this.AddDocForm.value['same_proof']))
    }
    //Address Proof ALone
    if (this.addrflag == 2 && this.AddDocForm.value['same_proof'] == false) {
      let filename = this.AddDocForm.value['addr_proof'] == 1 ? 'Aadhar' : this.AddDocForm.value['addr_proof'] == 2 ? 'Ration Card' :
        this.AddDocForm.value['addr_proof'] == 3 ? 'Voter ID' : this.AddDocForm.value['addr_proof'] == 4 ? 'Passport' : this.AddDocForm.value['addr_proof'] == 5 ? 'Gas Bill' :
          this.AddDocForm.value['addr_proof'] == 6 ? 'EB Bill' : this.AddDocForm.value['addr_proof'] == 7 ? 'Water Bill' : this.AddDocForm.value['addr_proof'] == 8 ? 'Home Tax': '--'
      let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';
      file.append('addr_proof', this.AddDocForm.value['addr_proof'])
      file.append('file', this.add_proof_file[0], first);
      if (this.add_proof_file.length == 2) {
        file.append('file', this.add_proof_file[1], second);
        file.append('proofType', String(2));
      } else file.append('proofType', String(1))
      // file.append('addr_proof', filename)
      file.append('addr_status', String(1));
    }
    //Id Proof alone
    if (this.idflag == 2 && this.AddDocForm.value['same_proof'] == false) {
      let filename = this.AddDocForm.value['Proof'] == 0 ? 'Aadhar' : this.AddDocForm.value['Proof'] == 1 ? 'Voter' : this.AddDocForm.value['Proof'] == 2 ? 'Pan' : 'DL'
      let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';
      file.append('Proof', this.AddDocForm.value['Proof'])
      file.append('file', this.id_proof_file[0], first);
      if (this.id_proof_file.length == 2) {
        file.append('file', this.id_proof_file[1], second);
        file.append('idproofType', String(2));
      } else file.append('idproofType', String(1))
      // file.append('id_proof', filename)
      file.append('ProofID', this.AddDocForm.value['ProofID']);
      file.append('id_status', String(1));
    }
    //Address & ID proofs are same
    //uploading address proof
    if (this.addrflag == 2 && this.AddDocForm.value['same_proof'] == true) {
      let filename = this.AddDocForm.value['addr_proof'] == 1 ? 'Aadhar' : this.AddDocForm.value['addr_proof'] == 2 ? 'Ration' :
        this.AddDocForm.value['addr_proof'] == 3 ? 'Voter ID' : this.AddDocForm.value['addr_proof'] == 4 ? 'Passport' : this.AddDocForm.value['addr_proof'] == 5 ? 'Gas Bill' :
          this.AddDocForm.value['addr_proof'] == 6 ? 'EB Bill' : this.AddDocForm.value['addr_proof'] == 7 ? 'Water Bill' : this.AddDocForm.value['addr_proof'] == 8 ? 'Home tax' : '--'
      let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';
      file.append('addr_proof', this.AddDocForm.value['addr_proof'])
      file.append('file', this.add_proof_file[0], first);
      if (this.add_proof_file.length == 2) {
        file.append('file', this.add_proof_file[1], second);
        file.append('proofType', String(2));
      } else file.append('proofType', String(1))
      // file.append('addr_proof', filename)
      file.append('addr_status', String(1));
      file.append('id_status', String(1));
      file.append('ProofID', this.AddDocForm.value['ProofID'])
    }
    //Id proof & Address Proof are same
    //uploading id Proof
    if (this.idflag == 2 && this.AddDocForm.value['same_proof'] == true) {
      let filename = this.AddDocForm.value['Proof'] == 0 ? 'Aadhar' : this.AddDocForm.value['Proof'] == 1 ? 'Ration' : this.AddDocForm.value['Proof'] == 2 ? 'Pan' : 'DL'
      let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';
      file.append('addr_proof', this.AddDocForm.value['Proof'])
      file.append('file', this.id_proof_file[0], first);
      if (this.id_proof_file.length == 2) {
        file.append('file', this.id_proof_file[1], second);
        file.append('proofType', String(2));
      } else file.append('proofType', String(1))
      // file.append('id_proof', filename)
      file.append('id_status', String(1));
      file.append('addr_status', String(1));
      file.append('ProofID', this.AddDocForm.value['ProofID'])
    }
    //caf form upload
    if (this.cafflag == 3) {
      let caf_file = username + '-' + 'CAF', caf_tc = username + '-' + 'T&C';
      file.append('caf_status', String(1));
      file.append('file', this.caf_proof[0], caf_file);
      file.append('file', this.caf_proof[1], caf_tc);

    }
    //cust profilepic upload
    if (this.custpicflag == 4) {
      let filename = username + '-' + 'Profile';
      file.append('file', this.subs_pic, filename);
      file.append('user_photo_status', String(1));
    }
    let result = await this.custser.updateDocument(file)
    const toast: Toast = {
      type: result['status'] == 1 ? 'success' : 'warning',
      title: result['status'] == 1 ? 'Success' : 'Failure',
      body: result['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result['status'] == 1) {
      this.loading = false;
      this.closeModal();
    }
  }

  upload(event: any) {
    this.id_proof_file = event.target.files;
    let filelength = event.target.files.length;
    // console.log("File", this.id_proof_file)
    if (filelength) {
      for (let i = 0; i < filelength; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.imageURL.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  upload1(event: any) {
    this.add_proof_file = event.target.files;
    let filelength = event.target.files.length;
    // console.log("File", this.add_proof_file)
    if (filelength) {
      for (let i = 0; i < filelength; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.imageurl.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }


  upload2(event: any) {
    this.caf_proof = event.target.files;
    let filelength = event.target.files.length;
    if (filelength > 1) {
      for (let i = 0; i < filelength; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagecafurl.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    } else {
      this.imagecafurl = '';
      window.alert('Please upload both CAF and T&C')
    }
  }

  /* 
    upload2(files: FileList) {
      this.caf_proof = files.item(0);
      if (this.caf_proof) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagecafurl = this.sanitizer.bypassSecurityTrustUrl(event.target.result)
          // log
        }
        reader.readAsDataURL(this.caf_proof);
      } else {
        this.imagecafurl = '';
      }
    }
   */
  uploadpic(files: FileList) {
    this.subs_pic = files.item(0);
    if (this.subs_pic) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.subpicurl = this.sanitizer.bypassSecurityTrustUrl(event.target.result)
        // log
      }
      reader.readAsDataURL(this.subs_pic);
    } else {
      this.subpicurl = '';
    }
  }

  createForm() {
    this.AddDocForm = new FormGroup({
      Proof: new FormControl(''),
      addr_proof: new FormControl(''),
      upproof: new FormControl(''),
      addr_up_proof: new FormControl(''),
      same_proof: new FormControl(false),
      cafupproof: new FormControl(''),
      cust_pic: new FormControl(''),
      ProofID: new FormControl('', Validators.required),
    })
  }
}