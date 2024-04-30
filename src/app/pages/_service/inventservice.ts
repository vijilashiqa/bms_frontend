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
export class InventoryService {
    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    async listMake(params) {
        return await this.http.post("/api/inventory/listMake", params).toPromise();
    }
    async addMake(params) {
        return await this.http.post("/api/inventory/addMake", params).toPromise();
    }
    async editMake(params) {
        return await this.http.post("/api/inventory/editMake", params).toPromise();
    }
    async listModel(params) {
        return await this.http.post("/api/inventory/listModel", params).toPromise();
    }
    async addModel(params) {
        return await this.http.post("/api/inventory/addModel", params).toPromise();
    }
    async editModel(params) {
        return await this.http.post("/api/inventory/editModel", params).toPromise();
    }
    async getModelEdit(params) {
        return await this.http.post("/api/inventory/getModelEdit", params).toPromise();
    }
    async getMakeEdit(params) {
        return await this.http.post("/api/inventory/getMakeEdit", params).toPromise();
    }
    async upload(params) {
        return await this.http.post("/api/inventory/upload", params).toPromise();
    }
    async listType(params) {
        return await this.http.post("/api/inventory/listType", params).toPromise();
    }
    async addType(params) {
        return await this.http.post("/api/inventory/addType", params).toPromise();
    }
    async editType(params) {
        return await this.http.post("/api/inventory/editType", params).toPromise();
    }
    async getTypeEdit(params) {
        return await this.http.post("/api/inventory/getTypeEdit", params).toPromise();
    }
    async showMake(params){
        return await this.http.post("/api/inventory/showMake",params).toPromise();
    }
    async showType(params){
        return await this.http.post("/api/inventory/showType",params).toPromise();
    }
    async showModel(params){
        return await this.http.post("/api/inventory/showModel",params).toPromise();
    }
}