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
export class AdminuserService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async listAdminuser(params) {
    return await this.http.post("/api/adminuser/listAdminuser", params).toPromise();
  }

  async addAdminuser(params) {
    return await this.http.post("/api/adminuser/addAdminuser", params).toPromise();
  }
  async editAdminuser(params) {
    return await this.http.post("/api/adminuser/editAdminuser", params).toPromise();
  }

  async getAdminuseredit(params) {
    return await this.http.post("/api/adminuser/getAdminuseredit", params).toPromise();
  }

  async changeadminpwd(params) {
    return await this.http.post("/api/adminuser/changeadminpwd", params).toPromise();
  }
  async showProfileAdmin(params) {
    return await this.http.post("/api/adminuser/showProfileAdmin", params).toPromise();
  }
  async showDepartment(params) {
    return await this.http.post("/api/adminuser/showDepartment", params).toPromise();
  }
  async addprofile(params) {
    return await this.http.post("/api/adminuser/addProfile", params).toPromise();
  }

  async listprofile(params) {
    return await this.http.post("/api/adminuser/listprofile", params).toPromise();
  }
  async listAdminProfile(params) {
    return await this.http.post("/api/adminuser/listAdminProfile", params).toPromise();
  }

  async getProfileEdit(params) {
    return await this.http.post("/api/adminuser/getprofileedit", params).toPromise();
  }
  async getAdminProfileedit(params) {
    return await this.http.post("/api/adminuser/getAdminProfileedit", params).toPromise();
  }

  async editProfile(params) {
    return await this.http.post("/api/adminuser/updateprofile", params).toPromise();
  }
  async updateAdminProfile(params) {
    return await this.http.post("/api/adminuser/updateAdminProfile", params).toPromise();
  }
  async listCustProfileLog(params) {
    return await this.http.post("/api/adminuser/listCustProfileLog", params).toPromise();
  }
  async listSMSGateway(params) {
    return await this.http.post("/api/adminuser/listSMSGateway", params).toPromise();
  }
  async addSMSGateway(params) {
    return await this.http.post("/api/adminuser/addSMSGateway", params).toPromise();
  }
  async editSMSGateway(params) {
    return await this.http.post("/api/adminuser/editSMSGateway", params).toPromise();
  }
  async getSMSGateway(params) {
    return await this.http.post("/api/adminuser/getSMSGateway", params).toPromise();
  }
  async showSMSGateway(params) {
    return await this.http.post("/api/adminuser/showSMSGateway", params).toPromise();
  }
  async listSMSTemplate() {
    return await this.http.post("/api/adminuser/listSMSTemplate", Observable).toPromise();
  }
  async addSMSTemplate(params) {
    return await this.http.post("/api/adminuser/addSMSTemplate", params).toPromise();
  }
  async editSMSTemplate(params) {
    return await this.http.post("/api/adminuser/editSMSTemplate", params).toPromise();
  }
  async listSMSTemplateBusiness(params) {
    return await this.http.post("/api/adminuser/listSMSTemplateBusiness", params).toPromise();
  }
  async addSMSTemplateBusiness(params) {
    return await this.http.post("/api/adminuser/addSMSTemplateBusiness", params).toPromise();
  }
  async editSMSTemplateBusiness(params) {
    return await this.http.post("/api/adminuser/editSMSTemplateBusiness", params).toPromise();
  }
  async showEmailTemplate(params) {
    return await this.http.post("/api/adminuser/showEmailTemplate", params).toPromise();
  }
  async UpdateEmailTemplate(params) {
    return await this.http.post("/api/adminuser/UpdateEmailTemplate", params).toPromise();
  }
  async showEmailTemplateIsp(params) {
    return await this.http.post("/api/adminuser/showEmailTemplateIsp", params).toPromise();
  }
  async UpdateEmailTemplateIsp(params) {
    return await this.http.post("/api/adminuser/UpdateEmailTemplateIsp", params).toPromise();
  }
  async listOTTPlatforms(params) {
    return await this.http.post("/api/adminuser/listOTTPlatforms", params).toPromise();
  }
  async addOTTPlatforms(params) {
    return await this.http.post("/api/adminuser/addOTTPlatforms", params).toPromise();
  }
  async editOTTPlatforms(params) {
    return await this.http.post("/api/adminuser/editOTTPlatforms", params).toPromise();
  }
  async showOTTPlatforms(params) {
    return await this.http.post("/api/adminuser/showOTTplatforms", params).toPromise();
  }
  async addOTTService(params) {
    return await this.http.post("/api/adminuser/addOTTService", params).toPromise();
  }
  async editOTTService(params) {
    return await this.http.post("/api/adminuser/editOTTService", params).toPromise();
  }
  async getOTTService(params) {
    return await this.http.post("/api/adminuser/getOTTService", params).toPromise();
  }
  async listOTTService(params) {
    return await this.http.post("/api/adminuser/listOTTService", params).toPromise();
  }
  async addOTTPlan(params) {
    return await this.http.post("/api/adminuser/addOTTPlan", params).toPromise();
  }
  async editOTTPlan(params) {
    return await this.http.post("/api/adminuser/editOTTPlan", params).toPromise();
  }
  async getOTTPlan(params) {
    return await this.http.post("/api/adminuser/getOTTPlan", params).toPromise();
  }
  async listOTTPlan(params) {
    return await this.http.post("/api/adminuser/listOTTPlan", params).toPromise();
  }
  async showOTTPlan(params) {
    return await this.http.post("/api/adminuser/showOTTPlan", params).toPromise();
  }
  async showAllowMan(params) {
    return await this.http.post("/api/adminuser/showAllowMan", params).toPromise();
  }
  async showAllowBranch(params) {
    return await this.http.post("/api/adminuser/showAllowBranch", params).toPromise();
  }
  async showOTTPlanCode(params) {
    return await this.http.post("/api/adminuser/showOTTPlanCode", params).toPromise();
  }
  async listSmsCredit(params) {
    return await this.http.post("/api/adminuser/listSmsCredit", params).toPromise();
  }
  async addSmscredit(params) {
    return await this.http.post("/api/adminuser/addSmscredit", params).toPromise();
  }
  async editSmscredit(params) {
    return await this.http.post("/api/adminuser/editSmscredit", params).toPromise();
  }
  async ottMap(params) {
    return await this.http.post("/api/adminuser/ottMap", params).toPromise();
  }
  async updateOttMap(params) {
    return await this.http.post("/api/adminuser/updateOttMap", params).toPromise();
  }
  async showOttMap(params) {
    return await this.http.post("/api/adminuser/showOttMap", params).toPromise();
  }
  async sendbulkemail(params) {
    return await this.http.post("/api/smsemail/sendbulkemail", params).toPromise();
  }
  async listResellerOttMap(params) {
    return await this.http.post("/api/adminuser/listResellerOttMap", params).toPromise();
  }
  
}