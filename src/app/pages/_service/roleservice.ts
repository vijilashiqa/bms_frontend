import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class RoleService {
	role: any = [];
	constructor(
		private http: HttpClient,
	) { }

	getToken() {
		return (localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null);
	}
	getRefreshtoken() {
		return (localStorage.getItem('ref_token') ? JSON.parse(localStorage.getItem('ref_token')) : null);
	}
	getresellerid() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['reseller_id']) : 0);
	}
	getroleid() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['role_id']) : 0);
	}
	getispid() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['isp_id']) : 0);
	}
	getmanagerid() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['manager_id']) : 0);
	}
	getsubid() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['sub_id']) : 0);
	}
	getgrupid() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['group_id']) : 0);
	}
	getusertype() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['user_type']) : 0);
	}
	getservicetype() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['service_type']) : 0);
	}
	getusername() {
		return (localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo'))['uname'] : null);
	}
	getFname() {
		return (localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo'))['fname'] : null);
	}
	getLname() {
		return (localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo'))['lname'] : null);
	}
	getOTT() {
		return (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['ott_platform']) : []);
	}
	getAccountType() {
		return (localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo'))['acc_type'] : null);
	}
	getmenurole(menu_role) {
		this.role = (localStorage.getItem('userinfo') ? JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['menu_role']) : []);
		return this.role.find(x => x == menu_role) ? false : true;
	}


	setCookie(...args) {
		document.cookie = Object.keys(args[0]) + "=" + (Object.values(args[0]) || ""); Object.keys(args[1]) + "=" + (Object.values(args[1]) || "")
		return document.cookie;
	}

	getCookie(name) {
		let nameEQ = name + "=";
		let id = document.cookie.split(';');
		for (var i of id) {
			var c = i;
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return id;
	}

	eraseCookie() {
		this.setCookie({ 'reselid': "" });
	}

}