import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { DomSanitizer } from '@angular/platform-browser';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'add-custpic',
  templateUrl: './add-custpic.component.html',
  styleUrls: ['./add-custpic.component.scss'],

})

export class SubscriberPicComponent implements OnInit, OnDestroy {
  config; image; subspro_image: any; proid; picflag; idfront; idback; AddPicForm;
  hide_cam: boolean = false; hide_cam1: boolean = false; hide_cam2: boolean = false;
  submit = false; uid;docflag =0;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = true;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  public addressfront: WebcamImage = null;
  public addressback: WebcamImage = null;

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private fronttrigger: Subject<void> = new Subject<void>();
  private backtrigger: Subject<void> = new Subject<void>();

  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(
    private router: Router,
    private alert: ToasterService,
    private custser: CustService,
    private sanitizer: DomSanitizer,

  ) {
    this.proid = JSON.parse(localStorage.getItem('array'));
    this.picflag = JSON.parse(localStorage.getItem('flag'));
    this.uid = JSON.parse(localStorage.getItem('subid'));
    this.docflag = JSON.parse(localStorage.getItem('doc')) || 0;
  }

  public camera(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  ngOnInit() {
    this.createForm()
  }
  confirm() {
    this.hide_cam = true;
  }
  confirm1() {
    this.hide_cam1 = true;
  }

  confirm2() {
    this.hide_cam2 = true;
  }

  public frontSnapshot(): void {
    this.fronttrigger.next();
  }
  public backSnapshot(): void {
    this.backtrigger.next();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
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

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

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

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public frontImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.addressfront = webcamImage;
  }

  public backImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.addressback = webcamImage;
  }

  public handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public frontcameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public backcameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public cameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get frontObservable(): Observable<void> {
    return this.fronttrigger.asObservable();
  }
  public get backObservable(): Observable<void> {
    return this.backtrigger.asObservable();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cancel() {
  this.docflag == 1 ? this.router.navigate(['/pages/cust/listdocpending'])  :  this.router.navigate(['/pages/cust/viewcust'])
  }

  async addpic() {
    // console.log("Image",this.webcamImage)
    this.submit = true;
    if (this.AddPicForm.invalid && (this.picflag == 2 || this.AddPicForm.value['same_proof'])) {
      window.alert('Please fill Mandatory fields');
      return;
    }
    const file = new FormData();
    let username = this.proid;
    file.append('username', username);
    file.append('uid', this.uid);
    if (this.picflag == 1) {
      const imageBlob = this.dataURItoBlob(this.webcamImage.imageAsBase64);
      //imageFile created below is the new compressed file which can be send to API in form data
      this.subspro_image = new File([imageBlob], 'Subscriber.jpg', { type: this.webcamImage['_mimeType'] });
      let proofname = 'Profile';
      let filename = username + "-" + proofname;
      file.append('file', this.subspro_image, filename);
      file.append('user_photo_status', String(1));
      // console.log("image", this.subspro_image)
    }
    if (this.picflag == 2) {
      const imageBlob = this.dataURItoBlob(this.addressfront.imageAsBase64);
      let idfrontimageblob = new File([imageBlob], 'IDProofFront.jpg', { type: this.addressfront['_mimeType'] });

      let idbackimageblob;
      if (this.AddPicForm.value['back'] == true) {
        const imageblob = this.dataURItoBlob(this.addressback.imageAsBase64);
        idbackimageblob = new File([imageblob], 'IDProofBack.jpg', { type: this.addressback['_mimeType'] });
      }
      let filename = this.AddPicForm.value['Proof'] == 0 ? 'Aadhaar' : this.AddPicForm.value['Proof'] == 1 ? 'Ration' : 'Pan';
      let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';


      file.append('file', idfrontimageblob, first)
      if (this.AddPicForm.value['back'] == true) {
        file.append('file', idbackimageblob, second)
        file.append('idproofType', String(2));
      } else file.append('idproofType', String(1))
      file.append('id_proof', filename)
      file.append('id_status', String(1))
      file.append('sameproof', String(this.AddPicForm.value['same_proof']))

    }
    if (this.picflag == 3) {
      const imageBlob = this.dataURItoBlob(this.addressfront.imageAsBase64);
      let frontimageblob = new File([imageBlob], 'AddressFront.jpg', { type: this.addressfront['_mimeType'] });

      let backimageblob;
      if (this.AddPicForm.value['back'] == true) {
        const imageblob = this.dataURItoBlob(this.addressback.imageAsBase64);
        backimageblob = new File([imageblob], 'AddressBack.jpg', { type: this.addressback['_mimeType'] });
      }


      let filename = this.AddPicForm.value['addr_proof'] == 1 ? 'Aadhaar' : this.AddPicForm.value['addr_proof'] == 2 ? 'Ration' :
        this.AddPicForm.value['addr_proof'] == 3 ? 'Voter ID' : this.AddPicForm.value['addr_proof'] == 4 ? 'Passport' : this.AddPicForm.value['addr_proof'] == 5 ? 'Gas Bill' :
          this.AddPicForm.value['addr_proof'] == 6 ? 'EB Bill' : this.AddPicForm.value['addr_proof'] == 7 ? 'Water Bill' : this.AddPicForm.value['addr_proof'] == 8 ? 'Home tax' : '--'
      let first = username + '-' + filename + 'first', second = username + '-' + filename + 'second';

      file.append('file', frontimageblob, first)
      if (this.AddPicForm.value['back'] == true) {
        file.append('file', backimageblob, second)
        file.append('proofType', String(2));
      } else file.append('proofType', String(1))
      file.append('addr_proof', filename)
      file.append('addr_status', String(1))
      file.append('sameproof', String(this.AddPicForm.value['same_proof']))

    }


    let result = await this.custser.updateDocument(file)
    // console.log("pic res",result);
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
      this.docflag == 1 ? this.router.navigate(['/pages/cust/listdocpending'])  :  this.router.navigate(['/pages/cust/viewcust'])
     }
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

  createForm() {
    this.AddPicForm = new FormGroup({
      front: new FormControl(''),
      back: new FormControl(''),
      Proof: new FormControl(''),
      addr_proof: new FormControl(''),
      same_proof: new FormControl(false),
      ProofID: new FormControl('', Validators.required),
    })
  }

  ngOnDestroy(): void {
    localStorage.removeItem('array');
    localStorage.removeItem('flag');
    localStorage.removeItem('subid');
    localStorage.removeItem('doc')
  }
}