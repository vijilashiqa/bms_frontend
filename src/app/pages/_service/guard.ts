import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    cuser; menu_access;

    constructor(
        private router: Router
    ) {
        this.cuser = JSON.parse(localStorage.getItem('userinfo'));
    }

    validate(id) {
        if (!(this.menu_access.find(x => x == id))) {
            this.router.navigate(['/pages/404']);
        }
    }
    canActivate() {
        setTimeout(() => {
            this.cuser = JSON.parse(localStorage.getItem('userinfo'));
            this.menu_access = this.cuser ? JSON.parse(this.cuser['menu_role']) : [];
            var menu = (this.router.url).split('/');
            if (!this.cuser) {
                // not logged in so redirect to login page with the return url
                this.router.navigate(['/auth/logout']);
                // this.router.navigate(['/pages/iot-dashboard']);
                return false;
            }
            // else {
            //     this.router.navigate(['/pages/iot-dashboard']);
            // }

            else {
                switch (menu[3]) {
                    case "userprofilelist":
                        this.validate(71);
                        break;
                    case "edituserprofile":
                        this.validate(73);
                        break;
                    case "list-adminuser":
                        this.validate(81);
                        break;
                    case "add-adminuser":
                        this.validate(82);
                        break;
                    case "liststate":
                        this.validate(61);
                        break;
                    case "list-group":
                        this.validate(201);
                        break;
                    case "add-group":
                        this.validate(202);
                        break;
                    case "liststaticip":
                        this.validate(52);
                        break;
                    case "list-smsgateway":
                        this.validate(21);
                        break;
                    case "add-smsgateway":
                        this.validate(22);
                        break;
                    case "smstemplate-isp":
                        this.validate(41);
                        break;
                    case "emailtemplate-isp":
                        this.validate(45);
                        break;
                    case "list-business":
                        this.validate(101);
                        break;
                    case "add-business":
                        this.validate(102);
                        break;
                    case "edit-business":
                        this.validate(103);
                        break;
                    case "list-bustaxlog":
                        this.validate(104);
                        break;
                    case "nas-list":
                        this.validate(302);
                        break;
                    case "service-list":
                        this.validate(314);
                        break;
                    case "addservice1":
                        this.validate(315);
                        break;
                    case "edit-service":
                        this.validate(316);
                        break;
                    case "viewservice":
                        this.validate(317);
                        break;
                    case "add-service-map":
                        this.validate(321);
                        break;
                    case "list-price":
                        this.validate(318);
                        break;
                    case "add-price":
                        this.validate(319);
                        break;
                    case "edit-price":
                        this.validate(320);
                        break;
                    case "resel-packmapping":
                        this.validate(1025);
                        break;
                    case "ippoolList":
                        this.validate(306);
                        break;
                    case "addippool":
                        this.validate(307);
                        break;
                    case "list-ap":
                        this.validate(310);
                        break;
                    case "add-ap":
                        this.validate(311);
                        break;

                    case "resellerList":
                        this.validate(401);
                        break;
                    case "add-reseller":
                        this.validate(402);
                        break;
                    case "edit-reseller":
                        this.validate(403);
                        break;
                    case "viewreseller":
                        this.validate(404);
                        break;
                    case "listagrement":
                        this.validate(405);
                        break;
                    case "list-branch":
                        this.validate(501);
                        break;
                    case "add-branch":
                        this.validate(502);
                        break;
                    case "custList":
                        this.validate(701);
                        break;
                    case "add-cust":
                        this.validate(702);
                        break;
                    case "edit-cust":
                        this.validate(703);
                        break;
                    case "viewcust":
                        this.validate(704);
                        break;
                    case "subs-packmapping":
                        this.validate(706);
                        break;
                    case "listdocpending":
                        this.validate(707);
                        break;
                    case "listcafnum":
                        this.validate(708);
                        break;
                    case "listscheduled":
                        this.validate(711);
                        break;
                    case "depositlist":
                        this.validate(801);
                        break;
                    case "adddeposit":
                        this.validate(802);
                        break;
                    case "listresel-outstand":
                        this.validate(815);
                        break;
                    case "acknowledg-list":
                        this.validate(1021);
                        break;
                    case "onlinepaylist":
                        this.validate(810);
                        break;
                    case "custonlinepaylist":
                        this.validate(1026);
                        break;
                    case "invoicelist":
                        this.validate(807);
                        break;
                    case "gstinvoicelist":
                        this.validate(811);
                        break;
                    case "openclose-balancelist":
                        this.validate(812);
                        break;
                    case "listreceipt":
                        this.validate(804);
                        break;
                    case "listusedreceipt":
                        this.validate(808);
                        break;
                    case "list-custprofilelog":
                        this.validate(1001);
                        break;
                    case "listactivitylog":
                        this.validate(1002);
                        break;
                    case "listbandwidthlog":
                        this.validate(1003);
                        break;
                    case "listprofileeditlog":
                        this.validate(1004);
                        break;
                    case "listresellersharelog":
                        this.validate(1005);
                        break;
                    case "duesreport":
                        this.validate(1006);
                        break;
                    case "collectionreport":
                        this.validate(1007);
                        break;
                    case "cancelinvreport":
                        this.validate(1008);
                        break;
                    case "cancelgstinvreport":
                        this.validate(1019);
                        break;
                    case "invoicebal-list":
                        this.validate(1010)
                        break;
                    case "listbalancelog":
                        this.validate(1011);
                        break;
                    case "list-mappednas":
                        this.validate(1012);
                        break;
                    case "listnaslog":
                        this.validate(1013);
                        break;
                    case "list-comp":
                        this.validate(901);
                        break;
                    case "add-comp":
                        this.validate(902);
                        break;
                    case "list-comptype":
                        this.validate(904);
                        break;
                    case "add-comptype":
                        this.validate(905);
                        break;
                    case "list-hsn":
                        this.validate(601);
                        break;
                    case "list-make":
                        this.validate(605);
                        break;
                    case "list-type":
                        this.validate(609);
                        break;
                    case "list-model":
                        this.validate(613);
                        break;

                    default:
                        if (menu[2] == 'iot-dashboard') {
                            return true;
                        } else {
                            this.router.navigate(['/auth/logout']);
                        }
                        break;
                }
            }

        }, 1);
        if (!localStorage.getItem('userinfo')) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/auth/logout']);
            return false;
        }
        return true;
    }
}