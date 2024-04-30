import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class CustService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }


  async listSubscriber(params) {
    return await this.http.post("/api/subs/listSubscriber", params).toPromise();
  }
  async addSubscriber(params) {
    return await this.http.post("/api/subs/addSubscriber", params).toPromise();
  }
  async editsubscriber(params) {
    return await this.http.post("/api/subs/editsubscriber", params).toPromise();
  }
  async getSubscriberEdit(params) {
    return await this.http.post("/api/subs/getSubscriberEdit", params).toPromise();
  }
  async ViewSubscriber(params) {
    return await this.http.post("/api/subs/ViewSubscriber", params).toPromise();
  }
  async custprofileid(params) {
    return await this.http.post("/api/subs/custprofileid", params).toPromise();
  }
  async changeprofilepwd(params) {
    return await this.http.post("/api/subs/changeprofilepwd", params).toPromise();
  }

  async changesubsusername(params) {
    return await this.http.post("/api/subs/changesubsusername", params).toPromise();
  }

  async changeauthpwd(params) {
    return await this.http.post("/api/subs/changeauthpwd", params).toPromise();
  }
  async showSelectUser(params) {
    return await this.http.post("/api/subs/showSelectUser", params).toPromise();
  }
  async getmacmanagement(param) {
    return await this.http.post("/api/subs/getmacmanagement", param).toPromise();
  }
  async updatemac(params) {
    return await this.http.post("/api/subs/updatemac", params).toPromise();
  }
  async getuserpassword(params) {
    return await this.http.post("/api/subs/getuserpassword", params).toPromise();
  }
  async showdatatrafic(params) {
    return await this.http.post("/api/subs/showdatatrafic", params).toPromise();
  }
  async custdisconnect(params) {
    return await this.http.post("/api/subs/custdisconnect", params).toPromise();
  }
  async showUser(params) {
    return await this.http.post("/api/subs/showUser", params).toPromise();
  }
  async showDatasplit(params) {
    return await this.http.post("/api/subs/showDatasplit", params).toPromise();
  }
  async listInvoice(params) {
    return await this.http.post("/api/subs/listInvoice", params).toPromise();
  }
  async getImage(params) {
    return await this.http.get("/api/subs/rrdImage", { params }).toPromise();
  }
  // async downloadFile(params) {
  //   return await this.http.get("/api/subs/downloadDocument", { params,responseType: 'arraybuffer' }).toPromise();
  // }
  downloadFile(params) {
    return this.http.get("/api/subs/downloadDocument", { params, responseType: 'blob' });
  }
  async getMacBind(params) {
    return await this.http.post("/api/subs/getMacBind", params).toPromise();
  }
  async updateMacBind(params) {
    return await this.http.post("/api/subs/updateMacBind", params).toPromise();
  }
  async changeCustService(params) {
    return await this.http.post("/api/subs/changeCustService", params).toPromise();
  }
  async changeCustValidity(params) {
    return await this.http.post("/api/subs/changeCustValidity", params).toPromise();
  }
  async uploadDoc(file) {
    return await this.http.post("/api/subs/uploadDocument", file).toPromise();
  }
  async getDocument(params) {
    return await this.http.get("/api/subs/getDocument", { params }).toPromise();
  }
  async getProfilePhoto(params) {
    return await this.http.get("/api/subs/getProfilePhoto", { params }).toPromise();
  }
  async updateDocument(file) {
    return await this.http.post("/api/subs/updateDocument", file).toPromise();
  }
  async addCaf(params) {
    return await this.http.post("/api/subs/addCaf", params).toPromise();
  }
  async listCaf(params) {
    return await this.http.post("/api/subs/listCaf", params).toPromise();
  }
  async getCafEdit(params) {
    return await this.http.post("/api/subs/getCafEdit", params).toPromise();
  }
  async editCaf(params) {
    return await this.http.post("/api/subs/editCaf", params).toPromise();
  }
  async getCafNumber(params) {
    return await this.http.post("/api/subs/getCafNumber", params).toPromise();
  }
  async verifyDocument(params) {
    return await this.http.post("/api/subs/verifyDocument", params).toPromise();
  }
  async custServiceMap(params) {
    return await this.http.post("/api/subs/custServiceMap", params).toPromise();
  }
  async showCustServiceMap(params) {
    return await this.http.post("/api/subs/showCustServiceMap", params).toPromise();
  }
  async getlivetraffic(params) {
    return await this.http.post("/api/subs/getlivetraffic", params).toPromise();
  }
  async mobileverify(params) {
    return await this.http.post("/api/subs/mobileverify", params).toPromise();
  }
  async emailverify(params) {
    return await this.http.post("/api/subs/emailverify", params).toPromise();
  }
  async changeSubscriberStatus(params) {
    return await this.http.post("/api/subs/changeSubscriberStatus", params).toPromise();
  }
  async changeSuspendStatus(params) {
    return await this.http.post("/api/subs/changeSuspendStatus", params).toPromise();
  }
  async addVoice(params) {
    return await this.http.post("/api/subs/addVoice", params).toPromise();
  }
  async editVoice(params) {
    return await this.http.post("/api/subs/editVoice", params).toPromise();
  }
  async listVoice(params) {
    return await this.http.post("/api/subs/listVoice", params).toPromise();
  }
  async updateVoice(params) {
    return await this.http.post("/api/subs/updateVoice", params).toPromise();
  }
  async changeVoicePwd(params) {
    return await this.http.post("/api/subs/changeVoicePwd", params).toPromise();
  }
  async changeScheduleTime(params) {
    return await this.http.post("/api/subs/changeScheduleTime", params).toPromise();
  }
  async refreshSchedule(params) {
    return await this.http.post("/api/subs/refreshSchedule", params).toPromise();
  }
  async addlimit(params) {
    return await this.http.post("/api/subs/addlimit", params).toPromise();
  }
  async getlogoff(params) {
    return await this.http.post("/api/subs/getlogoff", params).toPromise();
  }
  async bulkUpdateExpiry(params) {
    return await this.http.post("/api/subs/updateSubscriberExpiry", params).toPromise();
  }
  async bulkUpdateSrvmode(params) {
    return await this.http.post("/api/subs/custsrvmodeupdate", params).toPromise();
  }
  async bulkResellerReplace(params) {
    return await this.http.post("/api/subs/bulkresellerreplace", params).toPromise();
  }
  async bulkUpdateDatasplit(params) {
    return await this.http.post("/api/subs/custdatasplitupdate", params).toPromise();
  }
  async showSubscriber(params) {
    return await this.http.post("/api/subs/showSubscriber", params).toPromise();
  }
  async showRadacctName(params) {
    return await this.http.post("/api/subs/showRadacctName", params).toPromise();
  }
  async listDocument(params) {
    return await this.http.post("/api/subs/listDocument", params).toPromise();
  }
  async bulkSrvReplace(params) {
    return await this.http.post("/api/subs/bulkSrvReplace", params).toPromise();
  }
  async bulkPwdUpdate(params) {
    return await this.http.post("/api/subs/bulkPwdUpdate", params).toPromise();
  }

  async registerCardUser(params){
    return await this.http.post("/api/subs/registerCardUser",params).toPromise();
  }
  async listCardUser(params){
    return await this.http.post("/api/subs/listCardUser",params).toPromise();
  }
  async addCardUser(params) {
    return await this.http.post("/api/subs/addCardUser", params).toPromise();
  }
  async updateCardUser(params) {
    return await this.http.post("/api/subs/updateCardUser", params).toPromise();
  }
  async changeSimUse(params) {
    return await this.http.post("/api/subs/changeSimUse", params).toPromise();
  }
 


}