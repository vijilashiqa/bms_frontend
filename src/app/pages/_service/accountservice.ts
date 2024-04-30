import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { httpHeade } from './headerservice';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AccountService {
  constructor(
    private http: HttpClient,
    private router: Router,
    // private httpHeade: httpHeade
  ) { }

  async addDeposit(params) {
    return await this.http.post("/api/account/addDeposit", params).toPromise();
  }
  async listDeposit(params) {
    return await this.http.post("/api/account/listDeposit", params).toPromise();
  }
  async uploadPaymentProof(params) {
    return await this.http.post("/api/account/uploadPaymentProof", params).toPromise();
  }
  async showDepReason() {
    return await this.http.post("/api/account/showDepReason", httpOptions).toPromise();
  }
  async listInvoice(params) {
    return await this.http.post("/api/account/listInvoice", params).toPromise();
  }
  async addReceipt(params) {
    return await this.http.post("/api/account/addReceipt", params).toPromise();
  }
  async listReceipt(params) {
    return await this.http.post("/api/account/listReceipt", params).toPromise();
  }
  async editReceipt(params) {
    return await this.http.post("/api/account/editReceipt", params).toPromise();
  }
  async showInvoiceReceipt(params) {
    return await this.http.post("/api/account/showInvoiceReceipt", params).toPromise();
  }
  async showGSTInvoiceReceipt(params) {
    return await this.http.post("/api/account/showGSTInvoiceReceipt", params).toPromise();
  }
  async showInvoiceNo(params) {
    return await this.http.post("/api/account/showInvoiceNo", params).toPromise();
  }
  async listOutstandingBalance(params) {
    return await this.http.post("/api/account/listOutstandingBalance", params).toPromise();
  }
  async listInvoiceBalancelog(params) {
    return await this.http.post("/api/account/listInvoiceBalancelog", params).toPromise();
  }
  async listOCBalance(params) {
    return await this.http.post("/api/account/listOCBalance", params).toPromise();
  }
  async listInvReceipt(params) {
    return await this.http.post("/api/account/listInvReceipt", params).toPromise();
  }
  async listGSTInvReceipt(params) {
    return await this.http.post("/api/account/listGSTInvReceipt", params).toPromise();
  }
  async listGSTInvoice(params) {
    return await this.http.post("/api/account/listGSTInvoice", params).toPromise();
  }
  async cancelDeposit(params) {
    return await this.http.post("/api/account/cancelDeposit", params).toPromise();
  }
  async listRenewalSchedule(params) {
    return await this.http.post("/api/account/listRenewalSchedule", params).toPromise();
  }
  async listOnlinePayment(params) {
    return await this.http.post("/api/account/listOnlinePayment", params).toPromise();
  }
  async listCustOnlinePayment(params) {
    return await this.http.post("/api/account/listcustOnlinePayment", params).toPromise();
  }
  async eInvoicing(params) {
    return await this.http.post("/api/account/eInvoicing", params).toPromise();
  }
  async listEInvoicing(params) {
    return await this.http.post("/api/account/listEInvoicing", params).toPromise();
  }
  async viewEInvoicing(params) {
    return await this.http.post("/api/account/viewEInvoicing", params).toPromise();
  }
  async getQrcode(params) {
    return await this.http.get("/api/account/getQrcode", { params }).toPromise();
  }
  async getPaymentProof(params) {
    return await this.http.get("/api/account/getPaymentProof", { params }).toPromise();
  }
  async invoiceOttShare(params) {
    return await this.http.post("/api/account/invoiceOttShare", params).toPromise();
  }
  async ottInvoice(params) {
    return await this.http.post("/api/account/listOttInvoice", params).toPromise();
  }
  async renewalHistory(params) {
    return await this.http.post("/api/account/renewalHistory", params).toPromise();
  }
  async updateEinvoice(params) {
    return await this.http.post("/api/account/updateEinvoiceDate", params).toPromise();
  }
  async showOrdertransactionId(params){
    return await this.http.post("/api/account/showOrdertransactionId",params).toPromise();
  }
  async walletSharing(params){
    return await this.http.post("/api/account/walletSharing",params).toPromise();
  }
  async listOnlinePaymentReport(params) {
    return await this.http.post("/api/account/listOnlinePaymentReport", params).toPromise();
  }

}