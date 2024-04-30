
import { Component, OnInit,AfterViewChecked,ChangeDetectorRef, ViewRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { Router } from '@angular/router';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { Md5 } from 'ts-md5/dist/md5';
import {
  CustService, S_Service, SelectService, RoleService, IppoolService,
  BusinessService, GroupService, ResellerService, InventoryService, UsernameValidator
} from '../../_service/indexService';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
import { ThemeModule } from '../../../@theme/theme.module';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'Add-Cust',
  templateUrl: './add-Cust.component.html',
  styleUrls: ['./custstyle.scss'],
})

export class AddCustComponent implements OnInit,AfterViewChecked {
  submit: boolean = false; AddSubsForm; resell; datas; pack; cusprefix; branches;
  ip; busname; grup; mod; id_proof_file: any; selectfile: File = null; imageURL: any = []; typeid; imageurl: any = [];
  subsid = false; bulk = []; arrayBuffer: any; failure: any[]; s = 0; f = 0; file: any[]; dist; states; config; servtype;
  simul = false; add_proof_file: any; statipdata; proid; subspro_image: any; ecaf; cafno;
  sizeOfOriginalImage: number; compressResult = [];
  sizeOFCompressedImage: number; localCompressedURl: any; imageBlob: any;
  hide_cam1: boolean = false; hide_cam2: boolean = false; idhide_cam2: boolean = false; idhide_cam1: boolean = false;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public addressfront: WebcamImage = null;
  public addressback: WebcamImage = null;

  public proofidfront: WebcamImage = null;
  public proofidback: WebcamImage = null;

  // webcam snapshot trigger
  private fronttrigger: Subject<void> = new Subject<void>();
  private backtrigger: Subject<void> = new Subject<void>();

  private idfronttrigger: Subject<void> = new Subject<void>();
  private idbacktrigger: Subject<void> = new Subject<void>();


  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();


  constructor(
    private alert: ToasterService,
    private router: Router,
    private _fb: FormBuilder,
    private serv: S_Service,
    private custser: CustService,
    private select: SelectService,
    public activeModal: NgbModal,
    private sanitizer: DomSanitizer,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    private inventser: InventoryService,
    public role: RoleService,
    private ipser: IppoolService,
    private imageCompress: NgxImageCompressService,
    private readonly changeDetectorRef: ChangeDetectorRef

  ) { }

  ngAfterViewChecked(): void {
    // this.changeDetectorRef.detectChanges();
    if ( this.changeDetectorRef !== null &&
      this.changeDetectorRef !== undefined &&
      ! (this.changeDetectorRef as ViewRef).destroyed ) {
          this.changeDetectorRef.detectChanges();
  }
  }

  public camera(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public frontSnapshot(): void {
    console.log('Front image', this.addressfront)
    this.fronttrigger.next();
  }
  public backSnapshot(): void {
    this.backtrigger.next();
  }

  public idfrontSnapshot(): void {
    this.idfronttrigger.next();
  }
  public idbackSnapshot(): void {
    this.idbacktrigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public fronthandleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public backhandleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public idfronthandleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public idbackhandleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  //Address proof
  public frontNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public backNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  //ID proof
  public idfrontNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public idbackNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  //Address proof Front&back Captured image result
  public frontImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.addressfront = webcamImage;
  }
  public backImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.addressback = webcamImage;
  }

  //ID proof Front&back captured image result
  public idfrontImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.proofidfront = webcamImage;
  }
  public idbackImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.proofidback = webcamImage;
  }

  //addressproof camera switch front&back
  public frontcameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public backcameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  //idproof camera switch front&back
  public idfrontcameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public idbackcameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get frontObservable(): Observable<void> {
    return this.fronttrigger.asObservable();
  }
  public get backObservable(): Observable<void> {
    return this.backtrigger.asObservable();
  }

  public get idfrontObservable(): Observable<void> {
    return this.idfronttrigger.asObservable();
  }
  public get idbackObservable(): Observable<void> {
    return this.idbacktrigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  idconfirm1() {
    if (!this.proofidfront) window.alert('Please Capture image before clicking confirm')
    else this.idhide_cam1 = true;
  }

  idconfrim2() {
    if (!this.proofidback) window.alert('Please Capture image before clicking confirm')
    else this.idhide_cam2 = true;
  }

  confirm1() {
    if (!this.addressfront) window.alert('Please Capture image before clicking confirm')
    else this.hide_cam1 = true;
  }

  confirm2() {
    if (!this.addressback) window.alert('Please Capture image before clicking confirm')
    else this.hide_cam2 = true;
  }

  async business() {
    this.busname = await this.busser.showBusName({})
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddSubsForm.value['bus_id'] })
  }

  async showReseller($event = '') {
    this.resell = await this.resser.showResellerName({ bus_id: this.AddSubsForm.value['bus_id'], groupid: this.AddSubsForm.value['groupid'], except: 1, like: $event });
    // console.log(this.resell);

  }

  async cafnum() {
    this.cafno = await this.custser.getCafNumber({ resel_id: this.AddSubsForm.value['reseller'] });
    // console.log(this.cafno.resp[0]['caf_number']);
    if (this.cafno.error_msg != 0) {
      this.AddSubsForm.get('CAF').setValue('')
      this.ecaf = false;
    }
    if (this.cafno.error_msg == 0) {
      console.log(this.cafno);
      if (this.cafno.resp) {
        let cafnum = this.cafno.resp[0]['caf_number'];
        this.ecaf = true;
        // this.AddSubsForm.get('CAf').setValue(cafnum)
        this.AddSubsForm.controls.CAF.setValue(cafnum)
      } else {
        this.ecaf = false;
        console.log('CAFLIST');
        window.alert('Please contact admin to provide ECAF');
        this.router.navigate(['/pages/cust/custList']);
      }

    } else {
      this.ecaf = false;
    }

  }

  async modelshow() {
    if (this.role.getroleid() >= 775) {
      this.mod = await this.inventser.showModel({ resel_id: this.AddSubsForm.value['reseller'] })
    }
    if (this.role.getroleid() < 775) {
      this.mod = await this.inventser.showModel({ resel_id: this.role.getresellerid() })
    }
  }

  async cityshow($event = '') {
    this.dist = await this.select.showDistrict({ state_id: this.AddSubsForm.value['state'], like: $event, index: 0, limit: 15 })
  }

  async stateshow($event = '') {
    this.states = await this.select.showState({ like: $event })
  }

  async staticip($event = '') {
    this.statipdata = await this.ipser.showPublicIp({ resel_id: this.AddSubsForm.value['reseller'], like: $event })
    // console.log(result);
  }

  async subprefix() {
    if (this.role.getroleid() >= 775 && this.role.getroleid() > 444) {
      let result = await this.custser.custprofileid({ resel_id: this.AddSubsForm.value['reseller'] })
      // console.log(result);

      this.cusprefix = result[1];
      let custprofile = result[0]
      let rid = this.AddSubsForm.value['reseller']
      this.subsid = this.cusprefix['status']
      if (this.subsid == true) {
        this.AddSubsForm.controls.ID.setValue(custprofile.next_id)
      }
      else {
        this.AddSubsForm.controls.ID.setValue('')
      }
    }
    if (this.role.getroleid() < 775 && (this.role.getroleid() <= 444)) {
      let result;
      if (this.role.getroleid() == 443 || this.role.getroleid() == 332 || this.role.getroleid() == 221) {
        result = await this.custser.custprofileid({ resel_id: this.role.getmanagerid() })
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        result = await this.custser.custprofileid({ resel_id: this.role.getresellerid() })
      } else {
        result = await this.custser.custprofileid({ resel_id: this.role.getresellerid() })
      }
      this.cusprefix = result[1];
      let custprofile = result[0]
      let rid = this.AddSubsForm.value['reseller']
      this.subsid = this.cusprefix['status']
      if (this.subsid == true) {
        this.AddSubsForm.controls.ID.setValue(custprofile.next_id)
      }
      else {
        this.AddSubsForm.controls.ID.setValue('')
      }
    }

  }

  addvalid() {
    if (this.role.getroleid() < 775) {
      this.AddSubsForm.get('bus_id').clearValidators();
      this.AddSubsForm.get('bus_id').updateValueAndValidity();

      this.AddSubsForm.get('groupid').clearValidators();
      this.AddSubsForm.get('groupid').updateValueAndValidity();

      this.AddSubsForm.get('reseller').clearValidators();
      this.AddSubsForm.get('reseller').updateValueAndValidity();

      this.AddSubsForm.get('create_type').clearValidators();
      this.AddSubsForm.get('create_type').updateValueAndValidity();

      this.AddSubsForm.get('Expiry').clearValidators();
      this.AddSubsForm.get('Expiry').updateValueAndValidity();
    }
  }

  bulkvalid() {
    if (this.AddSubsForm.value['create_type'] == '1') {
      this.AddSubsForm.get('package').clearValidators();
      this.AddSubsForm.get('package').updateValueAndValidity();

      this.AddSubsForm.get('propass').clearValidators();
      this.AddSubsForm.get('propass').updateValueAndValidity();

      this.AddSubsForm.get('ID').clearValidators();
      this.AddSubsForm.get('ID').updateValueAndValidity();

      this.AddSubsForm.get('confpass').clearValidators();
      this.AddSubsForm.get('confpass').updateValueAndValidity();

      this.AddSubsForm.get('password').clearValidators();
      this.AddSubsForm.get('password').updateValueAndValidity();

      this.AddSubsForm.get('conpass').clearValidators();
      this.AddSubsForm.get('conpass').updateValueAndValidity();

      this.AddSubsForm.get('First').clearValidators();
      this.AddSubsForm.get('First').updateValueAndValidity();

      // this.AddSubsForm.get('Last').clearValidators();
      // this.AddSubsForm.get('Last').updateValueAndValidity();

      this.AddSubsForm.get('mobnum').clearValidators();
      this.AddSubsForm.get('mobnum').updateValueAndValidity();

      this.AddSubsForm.get('CAF').clearValidators();
      this.AddSubsForm.get('CAF').updateValueAndValidity();

      this.AddSubsForm.get('loc').clearValidators();
      this.AddSubsForm.get('loc').updateValueAndValidity();


      this.AddSubsForm.get('state').clearValidators();
      this.AddSubsForm.get('state').updateValueAndValidity();

      this.AddSubsForm.get('city').clearValidators();
      this.AddSubsForm.get('city').updateValueAndValidity();

      this.AddSubsForm.get('locality').clearValidators();
      this.AddSubsForm.get('locality').updateValueAndValidity();

      this.AddSubsForm.get('email').clearValidators();
      this.AddSubsForm.get('email').updateValueAndValidity();

      this.AddSubsForm.get('Installation').clearValidators();
      this.AddSubsForm.get('Installation').updateValueAndValidity();

      this.AddSubsForm.get('Billing').clearValidators();
      this.AddSubsForm.get('Billing').updateValueAndValidity();

      // this.AddSubsForm.get('addr_proof').clearValidators();
      // this.AddSubsForm.get('addr_proof').updateValueAndValidity();

      // this.AddSubsForm.get('addr_up_proof').clearValidators();
      // this.AddSubsForm.get('addr_up_proof').updateValueAndValidity();

      this.AddSubsForm.get('subs_type').clearValidators();
      this.AddSubsForm.get('subs_type').updateValueAndValidity();


      this.AddSubsForm.get('Proof').clearValidators();
      this.AddSubsForm.get('Proof').updateValueAndValidity();

      this.AddSubsForm.get('ProofID').clearValidators();
      this.AddSubsForm.get('ProofID').updateValueAndValidity();

      this.AddSubsForm.get('status').clearValidators();
      this.AddSubsForm.get('status').updateValueAndValidity();

      this.AddSubsForm.get('acctype').clearValidators();
      this.AddSubsForm.get('acctype').updateValueAndValidity();

      this.AddSubsForm.get('conntype').clearValidators();
      this.AddSubsForm.get('conntype').updateValueAndValidity();

      this.AddSubsForm.get('Expiry').clearValidators();
      this.AddSubsForm.get('Expiry').updateValueAndValidity();

      this.AddSubsForm.get('mat_from').clearValidators();
      this.AddSubsForm.get('mat_from').updateValueAndValidity();

      // this.AddSubsForm.get('upproof').clearValidators();
      // this.AddSubsForm.get('upproof').updateValueAndValidity();

      // this.AddSubsForm.get('docupload').clearValidators();
      // this.AddSubsForm.get('docupload').updateValueAndValidity();

      this.AddSubsForm.get('sim_use').clearValidators();
      this.AddSubsForm.get('sim_use').updateValueAndValidity();

    }
  }

  cafvalid() {
    if (this.AddSubsForm.value['demo_accnt'] == 3) {
      this.AddSubsForm.controls.CAF.setValue('');
      this.AddSubsForm.get('CAF').clearValidators();
      this.AddSubsForm.get('CAF').updateValueAndValidity();

      // this.AddSubsForm.get('docupload').clearValidators();
      // this.AddSubsForm.get('docupload').updateValueAndValidity();

      // this.AddSubsForm.get('addr_proof').clearValidators();
      // this.AddSubsForm.get('addr_proof').updateValueAndValidity();

      // this.AddSubsForm.get('addr_up_proof').clearValidators();
      // this.AddSubsForm.get('addr_up_proof').updateValueAndValidity();

      this.AddSubsForm.get('Proof').clearValidators();
      this.AddSubsForm.get('Proof').updateValueAndValidity();

      // this.AddSubsForm.get('upproof').clearValidators();
      // this.AddSubsForm.get('upproof').updateValueAndValidity();

      this.AddSubsForm.get('ProofID').clearValidators();
      this.AddSubsForm.get('ProofID').updateValueAndValidity();
    } else {
      this.AddSubsForm.get('CAF').setValidators([Validators.required]);
      this.AddSubsForm.get('CAF').updateValueAndValidity();
    }
  }

  substypechange() {
    this.AddSubsForm.get('Company').setValue('');
    this.AddSubsForm.get('GST').setValue('');
    this.AddSubsForm.get('cont_id').setValue('');
    this.AddSubsForm.get('cont_from_date').setValue('');
    this.AddSubsForm.get('cont_to_date').setValue('');
  }

  substypevalid() {
    if (this.AddSubsForm.value['subs_type'] != 1) {
      this.AddSubsForm.get('Company').setValidators([Validators.required]);
      this.AddSubsForm.get('GST').setValidators([Validators.required]);
      this.AddSubsForm.get('cont_id').setValidators([Validators.required]);
      this.AddSubsForm.get('cont_from_date').setValidators([Validators.required]);
      this.AddSubsForm.get('cont_to_date').setValidators([Validators.required]);
    } else {
      this.AddSubsForm.get('Company').clearValidators();
      this.AddSubsForm.get('Company').updateValueAndValidity();

      this.AddSubsForm.get('GST').clearValidators();
      this.AddSubsForm.get('GST').updateValueAndValidity();

      this.AddSubsForm.get('cont_id').clearValidators();
      this.AddSubsForm.get('cont_id').updateValueAndValidity();

      this.AddSubsForm.get('cont_from_date').clearValidators();
      this.AddSubsForm.get('cont_from_date').updateValueAndValidity();

      this.AddSubsForm.get('cont_to_date').clearValidators();
      this.AddSubsForm.get('cont_to_date').updateValueAndValidity();
    }
  }
  // Documents comment
  /*
    proofvalid() {
      if (this.AddSubsForm.value['proofsame'] == true) {
        this.AddSubsForm.get('upproof').clearValidators();
        this.AddSubsForm.get('upproof').updateValueAndValidity();
      }
    }
  
    uploadProofValidation() {
      if (this.AddSubsForm.value['docupload'] == '1') {
        this.AddSubsForm.get('addr_up_proof').clearValidators();
        this.AddSubsForm.get('addr_up_proof').updateValueAndValidity();
        this.AddSubsForm.get('upproof').clearValidators();
        this.AddSubsForm.get('upproof').updateValueAndValidity();
      }
    }
  
    proof() {
      this.AddSubsForm.value["Proof"] != "" ? this.AddSubsForm.get('ProofID').setValidators([Validators.required]) : this.AddSubsForm.get('ProofID').clearValidators()
      this.AddSubsForm.get('ProofID').updateValueAndValidity();
  
      this.AddSubsForm.value['Proof'] == 0 ? this.AddSubsForm.get('ProofID').setValidators([Validators.pattern("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$")]) : this.AddSubsForm.get('ProofID').clearValidators();
      this.AddSubsForm.get('ProofID').updateValueAndValidity();
  
      this.AddSubsForm.value['Proof'] == 2 ? this.AddSubsForm.get('ProofID').setValidators([Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")]) : this.AddSubsForm.get('ProofID').clearValidators();
      this.AddSubsForm.get('ProofID').updateValueAndValidity();
  
    }
    */

  async Service($event = '') {
    if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
      console.log('show service data', this.AddSubsForm.value['reseller'])
      this.pack = await this.serv.showServiceName({ edit_flag: 1, resel_id: this.AddSubsForm.value['reseller'], like: $event })
    }
    if (this.role.getroleid() < 775 && (this.role.getroleid() <= 444)) {
      if (this.role.getroleid() == 443 || this.role.getroleid() == 332 || this.role.getroleid() == 221) {
        this.pack = await this.serv.showServiceName({ edit_flag: 1, resel_id: this.role.getmanagerid(), like: $event })
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.pack = await this.serv.showServiceName({ edit_flag: 1, resel_id: this.role.getresellerid(), like: $event })
      } else {
        this.pack = await this.serv.showServiceName({ edit_flag: 1, resel_id: this.role.getresellerid(), like: $event })
      }
    }
  }

  async servicetype() {
    this.servtype = await this.busser.showServiceType({ bus_id: this.AddSubsForm.value['bus_id'], sertype: 1 })
  }

  async PoolName() {
    if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
      this.ip = await this.ipser.showPoolName({ groupid: this.AddSubsForm.value['groupid'], bus_id: this.AddSubsForm.value['bus_id'], resel_id: this.AddSubsForm.value['reseller'] })
    }
    if (this.role.getroleid() < 775 && (this.role.getroleid() <= 444)) {
      if (this.role.getroleid() == 443 || this.role.getroleid() == 332 || this.role.getroleid() == 221) {
        this.ip = await this.ipser.showPoolName({ resel_id: this.role.getmanagerid() })
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.ip = await this.ipser.showPoolName({ resel_id: this.role.getresellerid() })
      } else {
        this.ip = await this.ipser.showPoolName({ resel_id: this.role.getresellerid() })
      }
    }
  }

  async reselbranch() {
    if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
      this.branches = await this.resser.showResellerBranch({ resel_id: this.AddSubsForm.value['reseller'] })
    }
    if (this.role.getroleid() < 775 && (this.role.getroleid() <= 444)) {
      if (this.role.getroleid() == 443 || this.role.getroleid() == 332 || this.role.getroleid() == 221) {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getmanagerid() })
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getresellerid() })
      } else {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getresellerid() })
      }
    }
  }

  upload1(event: any) {
    this.add_proof_file = event.target.files;
    let filelength = event.target.files.length;
    // console.log("File", this.add_proof_file)
    if (filelength == 2) {
      for (let i = 0; i < filelength; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.imageurl.push(event.target.result);
          this.compressFile(event.target.result, 'filename_addr');

        }
        reader.readAsDataURL(event.target.files[i]);
      }
    } else {
      window.alert('Please upload front and back in separate files');
    }
  }

  upload(event: any) {
    this.id_proof_file = event.target.files;
    let filelength = event.target.files.length;
    // console.log("File", this.id_proof_file)
    if (filelength == 2) {
      for (let i = 0; i < filelength; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.imageURL.push(event.target.result);
          this.compressFile(event.target.result, 'filename_id');

        }
        reader.readAsDataURL(event.target.files[i]);
      }
    } else {
      window.alert('Please upload front and back in separate (2)files');
    }
  }

  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;
  compressFile(image, fileName) {
    // console.log("Result Image", image)
    var orientation = -1;
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
    // console.warn('Size in bytes is now:', this.sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;
        this.localCompressedURl = result;
        this.sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024)
        // console.warn('Size in bytes after compression:', this.sizeOFCompressedImage);
        // console.log("r", result)

        // create file from byte
        var imageName = fileName;
        // call method that creates a blob from dataUri
        this.imageBlob = this.dataURItoBlob(result.split(',')[1]);
        // console.log("imageBlob", this.imageBlob)
        //imageFile created below is the new compressed file which can be send to API in form data
        // this.address_imageFile = new File([imageBlob], 'upload.jpg', { type: 'image/jpeg' });
        // console.log("image",this.address_imageFile)

        this.compressResult.push(this.imageBlob)
        // console.log("image compress",  this.compressResult)

        // return this.imageBlob

      });

  }


  mac() {
    console.log('mac address',this.AddSubsForm.value['mac_addr']);
    
    if (this.AddSubsForm.value['mac_addr'] == true) {
      this.AddSubsForm.get('amac').setValidators([Validators.required]);
    }
    if (this.AddSubsForm.value['mac_addr'] == false) {
      this.AddSubsForm.controls.amac.setValue('');
      this.AddSubsForm.get('amac').clearValidators();
      this.AddSubsForm.get('amac').updateValueAndValidity();
    }
  }



  async mode() {
    this.AddSubsForm.get('ippool').setValue('');
    this.AddSubsForm.get('statip_type').setValue('');
    this.AddSubsForm.get('public_ip').setValue('');
    this.AddSubsForm.get('staticip').setValue('');

    this.AddSubsForm.value["ipmode"] == "1" ? this.AddSubsForm.get('ippool').setValidators([Validators.required]) : this.AddSubsForm.get('ippool').clearValidators()
    this.AddSubsForm.get('ippool').updateValueAndValidity();
    this.AddSubsForm.value["ipmode"] == "2" ? this.AddSubsForm.get('statip_type').setValidators([Validators.required]) : this.AddSubsForm.get('statip_type').clearValidators()
    this.AddSubsForm.get('statip_type').updateValueAndValidity();

    await this.staticmode();

  }

  staticmode() {

    (this.AddSubsForm.value['statip_type'] == 0 && this.AddSubsForm.value["ipmode"] == "2") ? this.AddSubsForm.get('staticip').setValidators([Validators.required]) : this.AddSubsForm.get('staticip').clearValidators();
    this.AddSubsForm.get('staticip').updateValueAndValidity();

    (this.AddSubsForm.value['statip_type'] == 1 && this.AddSubsForm.value["ipmode"] == "2") ? this.AddSubsForm.get('public_ip').setValidators([Validators.required]) : this.AddSubsForm.get('public_ip').clearValidators();
    this.AddSubsForm.get('public_ip').updateValueAndValidity();
  }

  type() {
    this.AddSubsForm.get('mac_addr').setValue(false)
    this.AddSubsForm.value["acctype"] == "1" ? this.AddSubsForm.get('mac_id').setValidators([Validators.required]) : this.AddSubsForm.get('mac_id').clearValidators()
    this.AddSubsForm.get('mac_id').updateValueAndValidity();
    if (this.AddSubsForm.value['acctype'] == '1') {
      this.simul = true;
      this.AddSubsForm.get('sim_use').setValue('1');
    }
    else {
      this.simul = false;
    }
  }
  bulk_meta = [
    { msg: 'Please Fill Login id', label: 'Login id*', assign_to: 'ID', required: true },
    { msg: 'Please Fill Profile Password', label: 'Profile Password*', assign_to: 'propass', required: true },
    { msg: 'Please Fill Authentication Password', label: 'Authentication Password*', assign_to: 'password_en', required: true },
    { msg: 'Please Fill CAF', label: 'CAF No', assign_to: 'CAF', required: false },
    { msg: 'Please Fill Reseller Branch', label: 'Reseller Branch*', assign_to: 'loc', required: true },
    { msg: 'Please Fill Full Name', label: 'Full Name*', assign_to: 'First', required: true },
    { msg: 'Please Fill Installation Address', label: 'Installation Address*', assign_to: 'Installation', required: true },
    { msg: 'Please Fill Billing Address', label: 'Billing Address*', assign_to: 'Billing', required: true },
    { msg: 'Please Fill State', label: 'State*', assign_to: 'state', required: true },
    { msg: 'Please Fill City', label: 'City*', assign_to: 'city', required: true },
    { msg: 'Please Fill Locality', label: 'Locality*', assign_to: 'locality', required: true },
    { msg: 'Please Fill Mobile', label: 'Mobile*', assign_to: 'mobnum', required: true },
    { msg: 'Please Fill Email', label: 'Email*', assign_to: 'email', required: true },
    { msg: 'Please Fill Description', label: 'Description', assign_to: 'descr', required: false },
    { msg: 'Please Fill Proof Type', label: 'Proof Type', assign_to: 'Proof', required: false },
    { msg: 'Please Fill Proof ID No', label: 'Proof ID No', assign_to: 'ProofID', required: false },
    { msg: 'Please Fill Subscriber Type', label: 'Subscriber Type*', assign_to: 'subs_type', required: true },
    { msg: 'Please Fill Status', label: 'Status*', assign_to: 'status', required: true },
    { msg: 'Please Fill Company Name', label: 'Company Name', assign_to: 'Company', required: false },
    { msg: 'Please Fill GST No', label: 'GST No', assign_to: 'GST', required: false },
    { msg: 'Please Fill Contract ID', label: 'Contract ID', assign_to: 'cont_id', required: false },
    { msg: 'Please Fill Contract From Date', label: 'Contract From Date', assign_to: 'cont_from_date', required: false },
    { msg: 'Please Fill Contract To Date', label: 'Contract To Date', assign_to: 'cont_to_date', required: false },
    { msg: 'Please Fill Package Name', label: 'Package Name*', assign_to: 'package', required: true },
    { msg: 'Please Fill Sub Plan Name', label: 'Sub Plan Name', assign_to: 'sub_plan', required: false },
    { msg: 'Please Fill Download Limit(MB)', label: 'Download Limit(MB)', assign_to: 'dllimit', required: false },
    { msg: 'Please Fill Upload Limit(MB)', label: 'Upload Limit(MB)', assign_to: 'uplimit', required: false },
    { msg: 'Please Fill Total Limit(MB)', label: 'Total Limit(MB)', assign_to: 'comblimit', required: false },
    { msg: 'Please Fill Account Type', label: 'Account Type*', assign_to: 'acctype', required: true },
    { msg: 'Please Fill MAC Address', label: 'MAC Address', assign_to: 'mac_id', required: false },
    { msg: 'Please Fill Allowed MAC Address', label: 'Allowed MAC Address', assign_to: 'amac', required: false },
    { msg: 'Please Fill IP Mode', label: 'IP Mode*', assign_to: 'ipmode', required: true },
    { msg: 'Please Fill PoolName', label: 'PoolName', assign_to: 'ippool', required: false },
    { msg: 'Please Fill StaticIP Type', label: 'StaticIP Type', assign_to: 'statip_type', required: false },
    { msg: 'Please Fill Static IP', label: 'Static IP', assign_to: 'staticip', required: false },
    { msg: 'Please Fill Public IP', label: 'Public IP', assign_to: 'public_ip', required: false },
    { msg: 'Please Fill Connection Type', label: 'Connection Type*', assign_to: 'conntype', required: true },
    { msg: 'Please Fill Expiry Date', label: 'Expiry Date*', assign_to: 'Expiry', required: true },
    { msg: 'Please Fill Package Mode', label: 'Package Mode*', assign_to: 'pack_mode', required: true },
    { msg: 'Please Fill Registered Date', label: 'Registered Date*', assign_to: 'reg_date', required: true },
    { msg: 'Please Fill Demo Account', label: 'Demo Account*', assign_to: 'demo_accnt', required: true },
    { msg: 'Please Fill Last Renewal Date', label: 'Last Renewal Date*', assign_to: 'last_renewal', required: true },
    { msg: 'Please Fill pincode', label: 'Pincode', assign_to: 'pincode', required: false }
  ]
  async addSubscriber() {
    this.submit = true;
    const invalid = [];
    console.log('this', this.AddSubsForm.getError(), this.AddSubsForm.hasError('userMatch', 'ID'), this.AddSubsForm.hasError('required', 'ID'))
    const controls = this.AddSubsForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    if (this.AddSubsForm.invalid) {
      console.log('Invalid', invalid)
      window.alert('Please fill all the fields marked with Asterisks*')
      return;
    }
    const md = new Md5;
    const sub_type = {
      'SME': 0,
      'Broadband': 1,
      'Corporate': 2,
      'Education/Institute': 3
    }, status = {
      'Disconnected': 0,
      'Active': 1,
      'Suspend': 2,
      'Hold': 3
    }
    for (var i = 0; i < this.bulk.length; i++) {
      for (let meta of this.bulk_meta) {
        if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) {
          this.toastalert(meta.msg);
          return;
        }
        else {
          switch (meta.label) {
            case 'Authentication Password*':
              this.bulk[i][meta.assign_to] = md.appendStr(this.bulk[i][meta.label]).end();
              this.bulk[i]['password'] = this.bulk[i][meta.label]
              break;
            case 'Locality*':
              this.bulk[i][meta.assign_to] = this.bulk[i][meta.label] == 'Rural' ? 0 : 1;
              break;
            case 'Description':
            case 'Proof Type':
            case 'Proof ID No':
            case 'Company Name':
            case 'Static IP':
            case 'Public IP':
              if (this.bulk[i].hasOwnProperty(meta.label)) {
                this.bulk[i][meta.assign_to] = this.bulk[i][meta.label]
              } else {
                this.bulk[i][meta.assign_to] = this.AddSubsForm.value[meta.assign_to]
              }
              break;
            case 'Account Type*':
              this.bulk[i][meta.assign_to] = this.bulk[i][meta.label] == 'Regular' ? 0 : 1;
              break;
            case 'Connection Type*':
              this.bulk[i][meta.assign_to] = this.bulk[i][meta.label] == 'Wired(RPY)'
                ? 0
                : this.bulk[i][meta.label] == 'Wireless'
                  ? 1 : 2;
              break;
            case 'IP Mode*':
              this.bulk[i][meta.assign_to] = this.bulk[i][meta.label] == 'NAS Pool or DHCP'
                ? 0
                : this.bulk[i][meta.label] == 'IP Pool'
                  ? 1 : 2;
              break;
            case 'Package Mode*':
              this.bulk[i][meta.assign_to] = this.bulk[i][meta.label] == 'Old'
                ? 1
                : this.bulk[i][meta.label] == 'New'
                  ? 3 : '';
              break;
            case 'Demo Account*':
              this.bulk[i][meta.assign_to] = this.bulk[i][meta.label] == 'prepaid'
                ? 1
                : this.bulk[i][meta.label] == 'postpaid'
                  ? 2 : 3;
              break;
            case 'Subscriber Type*':
              this.bulk[i][meta.assign_to] = sub_type[this.bulk[i][meta.label]];
              break;
            case 'Status*':
              this.bulk[i][meta.assign_to] = status[this.bulk[i][meta.label]];
              break;
            case 'Contract From Date':
            case 'Contract To Date':
            case 'Registered Date*':
            case 'Expiry Date*':
            case 'Last Renewal Date*':
              if (this.bulk[i].hasOwnProperty(meta.label)) {
                let contfrom = this.bulk[i][meta.label]
                let fromdate = new Date((contfrom - (25567 + 2)) * 86400 * 1000)
                this.bulk[i][meta.assign_to] = fromdate;
              }
              else {
                this.bulk[i][meta.assign_to] = this.AddSubsForm.value[meta.assign_to];
              }
              break;
            case 'Sub Plan Name':
            case 'Download Limit(MB)':
            case 'Upload Limit(MB)':
            case 'Total Limit(MB)':
              if (this.bulk[i].hasOwnProperty(meta.label)) {
                this.bulk[i][meta.assign_to] = this.bulk[i][meta.label];
              }
              else {
                this.bulk[i][meta.assign_to] = '';
              }
              break;
            case 'MAC Address':
            case 'PoolName':
            case 'StaticIP Type':
              if (this.bulk[i].hasOwnProperty(meta.label)) {
                this.bulk[i][meta.assign_to] = meta.label === 'StaticIP Type'
                  ? this.bulk[i][meta.label] === 'StaticIP' ? 0 : 1
                  : this.bulk[i][meta.label];
              }
              else {
                this.bulk[i][meta.assign_to] = this.AddSubsForm.value[meta.assign_to];
              }
              break;
            case 'Allowed MAC Address':
              if (this.bulk[i].hasOwnProperty(meta.label)) {
                this.bulk[i].amac = this.bulk[i][meta.label];
                this.bulk[i].mac_addr = true;
              }
              else {
                this.bulk[i].amac = this.AddSubsForm.value[meta.assign_to];
                this.bulk[i].mac_addr = false;
              }
              break;


            default:
              this.bulk[i][meta.assign_to] = this.bulk[i][meta.label]
              break;
          }
        }
      }


      this.bulk[i].sub_role = 111;
      this.bulk[i].serv_type = this.AddSubsForm.value['serv_type']
      this.bulk[i].mat_from = this.AddSubsForm.value['mat_from']
      this.bulk[i].sim_use = this.AddSubsForm.value['sim_use']
      this.bulk[i].bus_id = this.AddSubsForm.value['bus_id']
      this.bulk[i].groupid = this.AddSubsForm.value['groupid']
      this.bulk[i].reseller = this.AddSubsForm.value['reseller']
      this.bulk[i].create_type = this.AddSubsForm.value['create_type']
      this.bulk[i].addr_proof = this.AddSubsForm.value['addr_proof']
      this.bulk[i].addr_up_proof = this.AddSubsForm.value['addr_up_proof']
      this.bulk[i].Proof = this.AddSubsForm.value['Proof']
      this.bulk[i].ProofID = this.AddSubsForm.value['ProofID']
      this.bulk[i].latitude = this.AddSubsForm.value['latitude']
      this.bulk[i].longitude = this.AddSubsForm.value['longitude']
      this.bulk[i].phonenum = this.AddSubsForm.value['phonenum']
      this.bulk[i].attributes = this.AddSubsForm.value['attributes']
    }


    if (this.AddSubsForm.value['create_type'] == '0') {
      const md5 = new Md5;
      this.AddSubsForm.value['propass_en'] = md5.appendStr(this.AddSubsForm.value['propass']).end();
      const md = new Md5;
      this.AddSubsForm.value['password_en'] = md5.appendStr(this.AddSubsForm.value['password']).end();
      this.AddSubsForm.value['sub_role'] = 111;
      // console.log("inside success",this.AddSubsForm.value)
      let subsdata = [this.AddSubsForm.value];
      this.loading = true;
      let result = await this.custser.addSubscriber({ bulkSubscriber: subsdata });
      console.log('Add result', result)
      if (result) {
        this.loading = false;
        this.result_pop(result, true);
      }
      // this.datas=result;
      // Documents upload ----
      /*
      if (result[0]['error_msg'] == 0 && this.AddSubsForm.value['demo_accnt'] != 3) {
        const file = new FormData();
        let username = this.AddSubsForm.value['ID'];
        if (this.AddSubsForm.value['docupload'] == 0) {
          let filename = this.AddSubsForm.value['addr_proof'] == 1 ? 'Aadhaar' : this.AddSubsForm.value['addr_proof'] == 2 ? 'Ration' : 'VoterId'
          let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';
          file.append('file', this.compressResult[0], first)
          file.append('file', this.compressResult[1], second)
          file.append('addr_proof', filename)
          file.append('addr_status', String(1))
        }

        if (this.AddSubsForm.value['docupload'] == 1) {
          const imageBlob = this.dataURItoBlob(this.addressfront.imageAsBase64);
          let frontimageblob = new File([imageBlob], 'AddressFront.jpg', { type: this.addressfront['_mimeType'] });

          const imageblob = this.dataURItoBlob(this.addressback.imageAsBase64);
          let backimageblob = new File([imageblob], 'AddressBack.jpg', { type: this.addressback['_mimeType'] });

          let filename = this.AddSubsForm.value['addr_proof'] == 1 ? 'Aadhaar' : this.AddSubsForm.value['addr_proof'] == 2 ? 'Ration' : 'VoterId'
          let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';

          file.append('file', frontimageblob, first)
          file.append('file', backimageblob, second)
          file.append('addr_proof', filename)
          file.append('addr_status', String(1))
        }
        if (this.AddSubsForm.value['docupload'] == 1 && this.AddSubsForm.value['proofsame'] == false) {
          const imageBlob = this.dataURItoBlob(this.proofidfront.imageAsBase64);
          let idfrontimageblob = new File([imageBlob], 'IDProofFront.jpg', { type: this.proofidfront['_mimeType'] });

          const imageblob = this.dataURItoBlob(this.proofidback.imageAsBase64);
          let idbackimageblob = new File([imageblob], 'IDProofBack.jpg', { type: this.proofidback['_mimeType'] });

          let filename = this.AddSubsForm.value['Proof'] == 0 ? 'Aadhaar' : this.AddSubsForm.value['Proof'] == 1 ? 'Ration' : 'Pan';
          let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';

          file.append('file', idfrontimageblob, first)
          file.append('file', idbackimageblob, second)
          file.append('id_proof', filename)
          file.append('id_status', String(1))
        }

        if (this.AddSubsForm.value['docupload'] == 0 && this.AddSubsForm.value['proofsame'] == false) {
          let filename = this.AddSubsForm.value['Proof'] == 0 ? 'Aadhaar' : this.AddSubsForm.value['Proof'] == 1 ? 'Ration' : 'Pan'
          let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';
          file.append('file', this.compressResult[2], first)
          file.append('file', this.compressResult[3], second)
          file.append('id_proof', filename)
          file.append('id_status', String(1))
        }
        if (this.AddSubsForm.value['proofsame'] == true) {
          file.append('id_status', String(1))
        }
         file.append('username', username)
        file.append('sameproof', String(this.AddSubsForm.value['proofsame']))
        setTimeout(() => {
          this.loading = false;
          this.result_pop(result, true);
        }, 1000)
        let res = await this.custser.uploadDoc(file)
        // console.log("Address proof result", res)

        // if (res[0]['error_msg'] == 0) {
        //   this.loading = false;
        //   this.result_pop(result, true);

        // } else {
        //   this.loading = false;
        //   this.result_pop(result, true);
        // }


      } else {
        this.loading = false;
        this.result_pop(result, true);
      }
      */
    }
    if (this.AddSubsForm.value['create_type'] == '1') {
      console.log("in", this.bulk);
      this.loading = true;
      let result = await this.custser.addSubscriber({ bulkSubscriber: this.bulk });
      // console.log('Result',result)
      if (result) {
        this.loading = false;
        this.result_pop(result, true);
      }
    }
    // })
  }

  dataURItoBlob(dataURI) {
    // console.log("hit");
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    // console.log("Blob", blob)
    return blob;
  }


  changeListener(file) {
    this.file = file;
    this.filereader(this.file, result => {
      this.bulk = result;
    });
  }

  filereader(file, callback) {
    if (file) {
      let fileReader = new FileReader(), filedata;
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = JSXLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        // console.log(JSXLSX.utils.sheet_to_json(worksheet,{raw:true}));
        callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }))
      }
      fileReader.readAsArrayBuffer(file);
    } else {
      callback([])
    }
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

  result_pop(item, add_res) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.add_res = add_res;
    activeModal.result.then((data) => {

    });
  }

  async ngOnInit() {
    this.createForm();
    this.cafvalid();
    await this.business();
    await this.stateshow();
    this.addvalid();
    if (this.role.getroleid() <= 777) {
      this.AddSubsForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.showReseller();
      await this.servicetype();
      await this.Service();
      await this.modelshow();
      await this.PoolName();
      await this.subprefix();
      await this.reselbranch();
    }
    if (this.role.getroleid() < 775 && (this.role.getroleid() <= 444)) {
      this.AddSubsForm.get('bus_id').setValue(this.role.getispid())
      this.AddSubsForm.get('groupid').setValue(this.role.getgrupid());
      if (this.role.getroleid() == 443 || this.role.getroleid() == 332 || this.role.getroleid() == 221) {
        this.AddSubsForm.get('reseller').setValue(this.role.getmanagerid());
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.AddSubsForm.get('reseller').setValue(this.role.getresellerid());
      } else {
        this.AddSubsForm.get('reseller').setValue(this.role.getresellerid());
      }
      this.AddSubsForm.get('create_type').setValue('0')
      this.AddSubsForm.get('groupid').clearValidators();
      this.AddSubsForm.get('groupid').updateValueAndValidity();

      this.AddSubsForm.get('reseller').clearValidators();
      this.AddSubsForm.get('reseller').updateValueAndValidity();

      // this.AddSubsForm.get('serv_type').clearValidators();
      // this.AddSubsForm.get('serv_type').updateValueAndValidity();
      await this.cafnum();
    }
    if (this.role.getroleid() > 444) {
      this.AddSubsForm.get('bus_id').setValue(this.role.getispid())
      this.AddSubsForm.get('groupid').setValue(this.role.getgrupid());
      this.AddSubsForm.get('create_type').setValue('0')
      this.AddSubsForm.get('groupid').clearValidators();
      this.AddSubsForm.get('groupid').updateValueAndValidity();

    }
    if (this.role.getroleid() >= 775) {
      this.AddSubsForm.get('sim_use').clearValidators();
      this.AddSubsForm.get('sim_use').updateValueAndValidity();

      this.AddSubsForm.get('Expiry').clearValidators();
      this.AddSubsForm.get('Expiry').updateValueAndValidity();
    }
  }

  cancel() {
    this.router.navigate(['/pages/cust/custList']);
  }

  get materialDetails(): FormArray {
    return this.AddSubsForm.get('materialDetails') as FormArray;
  }

  addMaterial() {
    this.materialDetails.push(this.createMaterial());
  }

  deleteMatField(index: number) {
    this.materialDetails.removeAt(index);
  }

  createMaterial(): FormGroup {
    return this._fb.group({
      model: [''],
      qty: [''],
      price: [''],
      total: ['']
      // total: [{ value: '', disabled: true }]
    });
  }

  createForm() {
    this.AddSubsForm = new FormGroup({
      // this.AddSubsForm =this._fb.group({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl('', Validators.required),
      reseller: new FormControl('', Validators.required),
      // serv_type: new FormControl('', Validators.required),
      create_type: new FormControl('', Validators.required),
      CAF: new FormControl(''),
      loc: new FormControl('', Validators.required),
      propass: new FormControl('', Validators.required),
      confpass: new FormControl(''),
      checkpasswrd: new FormControl(''),
      password: new FormControl('', Validators.required),
      conpass: new FormControl(''),
      ID: new FormControl('', [Validators.required, Validators.pattern("[a-z0-9._\-\]{5,20}$"), UsernameValidator.cannotContainSpace]),
      // ID: new FormControl('', [Validators.required,Validators.pattern("/^(?=[a-zA-Z0-9._\-\]{6,20}$)(?!.*[_\-\.]{2})[^_\-\.].*[^_\-\.]$/")]),
      First: new FormControl('', Validators.required),
      // Last: new FormControl('', Validators.required),
      mobnum: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      phonenum: new FormControl('', [Validators.pattern('^[0-9]{11}$')]),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z 0-9]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      locality: new FormControl('', Validators.required),
      Installation: new FormControl('', Validators.required),
      Billing: new FormControl('', Validators.required),
      // addr_proof: new FormControl('', Validators.required),
      addr_proof: new FormControl(''),
      // addr_up_proof: new FormControl('', Validators.required),
      addr_up_proof: new FormControl(''),
      proofsame: new FormControl(false),
      checkaddr: new FormControl(''),
      subs_type: new FormControl(''),
      Proof: new FormControl(''),
      descr: new FormControl(''),
      Company: new FormControl(''),
      ProofID: new FormControl(''),
      front: new FormControl(''),
      back: new FormControl(''),
      idfront: new FormControl(''),
      idback: new FormControl(''),
      GST: new FormControl(''),
      cont_id: new FormControl(''),
      cont_from_date: new FormControl(''),
      cont_to_date: new FormControl(''),
      demo_accnt: new FormControl('1'),
      status: new FormControl('1', Validators.required),
      // docupload: new FormControl('0', Validators.required),
      docupload: new FormControl('0'),
      pack_mode: new FormControl('1'),
      package: new FormControl('', Validators.required),
      Expiry: new FormControl('', Validators.required),
      sim_use: new FormControl('1', Validators.required),
      onu_mac: new FormControl(''),
      amac: new FormControl(''),
      ipmode: new FormControl('0', Validators.required),
      conntype: new FormControl('2', Validators.required),
      statip_type: new FormControl(''),
      staticip: new FormControl(''),
      public_ip: new FormControl(''),
      ippool: new FormControl(''),
      resel_renewal: new FormControl(''),
      cust_renewal: new FormControl(''),
      // upproof: new FormControl('', Validators.required),
      upproof: new FormControl(''),
      attributes: new FormControl(''),
      acctype: new FormControl('', Validators.required),
      pan_no: new FormControl(''),
      mac_id: new FormControl(''),
      mac_addr: new FormControl(false),
      mat_from: new FormControl(''),
      type_name: new FormControl(''),
      dllimit: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      uplimit: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      comblimit: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      pincode: new FormControl(''),
      materialDetails: new FormArray([
        this.createMaterial()
      ]),
    });
    // this.addMaterial();
  }

  //   userNameValidator =() => {
  //     console.log('Insideeeeee')
  //      return (formGroup: FormGroup) => {
  //          const regex = /^(?=[a-zA-Z0-9._\-\^\S]{6,20}$)(?!.*[_\-\.]{2})[^_\-\.].*[^_\-\.]$/
  //         const status = regex.test(formGroup.get('ID').value);
  //         console.log('Status',status,'\n',formGroup.get('ID').value)
  //         const ctrl = formGroup.controls['ID']
  //         console.log('ctrl',ctrl)
  //         if (!status) {
  //             ctrl.setErrors({
  //                 userMatch: true
  //             });
  //         } else {
  //             ctrl.setErrors(null);
  //         }
  //     }
  // }

  onkeyupQty(event: any, index: number) { // without type info
    //console.log(index, test);
    if (event.target.value != "") {
      // console.log(this.AddSubsForm.value["materialDetails"][index]["qty"], this.AddSubsForm.value["materialDetails"][index]["price"])
      var total = Number(this.AddSubsForm.value["materialDetails"][index]["qty"]) * Number(this.AddSubsForm.value["materialDetails"][index]["price"]);
      const controlArray = <FormArray>this.AddSubsForm.get('materialDetails');
      controlArray.controls[index].get('total').setValue(total);
    }

  }
}