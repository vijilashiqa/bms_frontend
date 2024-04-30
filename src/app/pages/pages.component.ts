import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNasComponent } from './nas/Add-nas/add-nas.component';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
  <div class="new">
  <ngx-sample-layout>
  <nb-menu autoCollapse="true" [items]="menu"></nb-menu>
  <router-outlet></router-outlet>
</ngx-sample-layout></div>
  `,
})
export class PagesComponent {

  role = []; roleid;
  constructor(
    private nasmodel: NgbModal
  ) {
    this.role = JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['menu_role']);
    this.roleid = JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['role_id']);
    this.menu = [{
      title: 'Dashboard',
      icon: 'fa fa-home',
      link: '/pages/iot-dashboard',
      home: true,
    },
    {
      title: 'Developer',
      icon: 'fa fa-desktop',
      hidden: this.roleid != 999,
      children: [
        {
          title: 'Profile',
          hidden: this.roleid < 775,
          children: [
            {
              title: 'List',
              link: '/pages/administration/Profilelist',
              // hidden: !this.role.find(x => x == 71)
            },
            {
              title: 'Add',
              link: '/pages/administration/AddProfile',
              // hidden: !this.role.find(x => x == 72)
            }
          ]
        },
        {
          title: 'OTT',
          children: [
            {
              title: 'List',
              link: '/pages/administration/list-ott',
            },

          ]
        },
        {
          title: 'SMS-Template',
          link: '/pages/administration/smstemplates',
        },

        {
          title: 'Email-Template',
          link: '/pages/administration/email-templates',
        },
      ],
    },
    {

      title: 'Tools',
      icon: 'fa fa-cogs',
      hidden: this.roleid < 999 || !this.role.find(x => x == 1073),
      children: [
        {
          title: 'App Tools',
          link: '/pages/tools/add-tools',
        },
      ],
    },
    {
      title: 'ISP',
      icon: 'fa fa-briefcase',
      hidden: !(this.role.find(x => x == 101) || this.role.find(x => x == 102) || this.role.find(x => x == 104)),
      children: [
        {
          title: 'List',
          link: '/pages/business/list-business',
          hidden: !(this.role.find(x => x == 101))
        },
        {
          title: 'Add',
          link: '/pages/business/add-business',
          hidden: !(this.role.find(x => x == 102))
        },

      ],
    },
    {
      title: 'Administration',
      icon: 'fab fa-buysellads',
      hidden: !(this.role.find(x => x == 71) || this.role.find(x => x == 81) || this.role.find(x => x == 61) ||
        this.role.find(x => x == 82) || this.role.find(x => x == 201) || this.role.find(x => x == 202) || this.role.find(x => x == 52)
        || this.role.find(x => x == 21) || this.role.find(x => x == 22)) || this.roleid == 111,
      children: [
        {
          title: 'User Profile',
          hidden: !(this.role.find(x => x == 71)),
          children: [
            {
              title: 'List',
              link: '/pages/administration/userprofilelist',
              hidden: !this.role.find(x => x == 71)
            },
          ]
        },
        {
          title: 'Adminuser',
          hidden: !(this.role.find(x => x == 81) || this.role.find(x => x == 82)),
          children: [
            {
              title: 'List',
              link: '/pages/administration/list-adminuser',
              hidden: !this.role.find(x => x == 82)
            },
            {
              title: 'Add',
              link: '/pages/administration/add-adminuser',
              hidden: !this.role.find(x => x == 81)
            },
          ]
        },
        {
          title: 'List State&City',
          link: '/pages/administration/liststate',
          hidden: !this.role.find(x => x == 61)
        },
        {
          title: 'Circle',
          hidden: !(this.role.find(x => x == 201) || this.role.find(x => x == 202)),
          children: [
            {
              title: 'List',
              link: '/pages/group/list-group',
              hidden: !this.role.find(x => x == 201)
            },
            {
              title: 'Add',
              link: '/pages/group/add-group',
              hidden: !this.role.find(x => x == 202)
            },
          ],
        },
        {
          title: 'PublicIP',
          link: '/pages/administration/liststaticip',
          hidden: (!this.role.find(x => x == 51))
        },
        {
          title: 'SMS-Gateway',
          hidden: (this.roleid == 111 || !(this.role.find(x => x == 21) || this.role.find(x => x == 22))),
          children: [
            {
              title: 'List',
              link: '/pages/administration/list-smsgateway',
              hidden: ((!this.role.find(x => x == 21)))
            },
            {
              title: 'Add',
              link: '/pages/administration/add-smsgateway',
              hidden: ((!this.role.find(x => x == 22)))
            },
          ],
        },

        {
          title: 'Templates',
          hidden: (this.roleid < 775 || !(this.role.find(x => x == 41) || this.role.find(x => x == 45) || this.role.find(x => x == 46))),
          children: [
            {
              title: 'SMS-Templates ISP',
              link: '/pages/administration/smstemplate-isp',
              hidden: (!this.role.find(x => x == 41)),
            },

            {
              title: 'Email-Templates ISP',
              link: '/pages/administration/emailtemplate-isp',
              hidden: (this.roleid < 775 || !(this.role.find(x => x == 45) || this.role.find(x => x == 46))),
            },

          ],
        },
        {
          title: 'Revenue-Share-Details',
          link: '/pages/administration/revenue-share',
          hidden: !this.role.find(x => x == 1057)
        },
        {
          title: 'SMS Credits',
          hidden: this.roleid != 999,
          children: [
            {
              title: 'List',
              link: '/pages/administration/list-sms-credit',
            },
          ],
        },
        {
          title: 'Reseller-Share-Update',
          link: '/pages/administration/update-share',
          hidden: this.roleid < 775
        },
      ],
    },
    {
      title: 'Radius',
      icon: 'fa fa-chart-bar',
      hidden: !(this.role.find(x => x == 314) || this.role.find(x => x == 315) || this.role.find(x => x == 318) ||
        this.role.find(x => x == 319) || this.role.find(x => x == 302) || this.role.find(x => x == 306) || this.role.find(x => x == 1025) ||
        this.role.find(x => x == 307) || this.role.find(x => x == 310) || this.role.find(x => x == 311) || this.role.find(x => x == 321)),
      children: [
        {
          title: 'Nas',
          hidden: !this.role.find(x => x == 302),
          children: [
            {
              title: 'List',
              link: '/pages/nas/nas-list',
              hidden: !this.role.find(x => x == 302)
            },
          ]
        },
        {
          title: 'Service',
          hidden: !(this.role.find(x => x == 314) || this.role.find(x => x == 315) || this.role.find(x => x == 1025) ||
            this.role.find(x => x == 318) || this.role.find(x => x == 319) || this.role.find(x => x == 321)),
          children: [
            {
              title: 'List ',
              link: '/pages/service/service-list',
              hidden: !this.role.find(x => x == 314)
            },
            {
              title: 'Add',
              link: '/pages/service/addservice1',
              hidden: !this.role.find(x => x == 315)
            },
            {
              title: 'Service Map',
              link: '/pages/service/add-service-map',
              hidden: !this.role.find(x => x == 321)
            },
            {
              title: ' New Service Map',
              link: '/pages/service/servicemap',
              hidden: !this.role.find(x => x == 322)
            },
            {
              title: 'Sub Plan',
              hidden: !(this.role.find(x => x == 318) || this.role.find(x => x == 319)),
              children: [
                {
                  title: 'List',
                  link: '/pages/service/list-price',
                  hidden: !this.role.find(x => x == 318)
                },
                {
                  title: 'Add',
                  link: '/pages/service/add-price',
                  hidden: !this.role.find(x => x == 319)
                },
                {
                  title: 'Sub-plan Map',
                  link: '/pages/reseller/resel-packmapping',
                  hidden: !this.role.find(x => x == 1025),
                },
              ],
            },
          ],
        },
        {
          title: 'Top-Up',
          hidden: !(this.role.find(x => x == 1043) || this.role.find(x => x == 1044)),
          children: [
            {
              title: 'List Topup',
              link: '/pages/service/list-topup',
              hidden: !this.role.find(x => x == 1043),
            },
            {
              title: 'Add Topup',
              link: '/pages/service/addtopup',
              hidden: !this.role.find(x => x == 1044),
            },
          ],
        },
        {
          title: 'IP Pool',
          hidden: !(this.role.find(x => x == 306) || this.role.find(x => x == 307)),
          children: [
            {
              title: 'List',
              link: '/pages/ippool/ippoolList',
              hidden: !this.role.find(x => x == 306)
            },
            {
              title: ' Add',
              link: '/pages/ippool/addippool',
              hidden: !this.role.find(x => x == 307)
            },
          ],
        },
        {
          title: 'Access Point',
          hidden: !(this.role.find(x => x == 310) || this.role.find(x => x == 311)),

          children: [
            {
              title: 'List',
              link: '/pages/AP/list-ap',
              hidden: !this.role.find(x => x == 310)
            },
            {
              title: 'Add',
              link: '/pages/AP/add-ap',
              hidden: !this.role.find(x => x == 311)
            },
          ],
        },
      ],
    },
    {
      title: 'Voice',
      icon: 'fa fa-phone-volume',
      hidden: !(this.role.find(x => x == 1047)),
      children: [
        {
          title: 'List',
          link: '/pages/cust/list-voicenum',
          hidden: !this.role.find(x => x == 1047),
        },
      ],
    },
    {
      title: 'Promotion',
      icon: 'fa fa-paper-plane',
      hidden: !(this.role.find(x => x == 1058)),
      children: [
        // {
        //   title: 'Send SMS',
        //   link: '/pages/administration/send-sms',
        // },
        {
          title: 'Send Email',
          link: '/pages/administration/send-email',
        },
        // {
        //   title: 'Send SMS Reseller',
        //   link: '/pages/administration/send-sms-reseller',
        // },
        // {
        //   title: 'Send Email Reseller',
        //   link: '/pages/administration/send-email-reseller',
        // },
        // {
        //   title: 'Send SMS Others',
        //   link: '/pages/administration/send-sms-other',
        // },
      ],
    },
    {
      title: 'OTT',
      icon: 'fa fa-film',
      hidden: !(this.role.find(x => x == 1028) || this.role.find(x => x == 1029 || this.role.find(x => x == 1059))),
      children: [
        {
          title: 'List',
          link: '/pages/administration/list-ottauth',
          hidden: !this.role.find(x => x == 1028),
        },
        {
          title: 'Add',
          link: '/pages/administration/ott-auth',
          hidden: !this.role.find(x => x == 1029),
        },
        {
          title: 'OTT Plan',
          hidden: this.roleid < 775,
          children: [
            {
              title: 'List',
              link: '/pages/administration/list-ottplan',
              hidden: this.roleid < 775
            },
            {
              title: 'Add',
              link: '/pages/administration/ott-plan',
              hidden: this.roleid < 775
            },

          ],
        },
        {
          title: 'OTT Map',
          hidden: this.roleid < 775,
          children: [
            {
              title: 'Add OTTMap',
              link: '/pages/administration/ott-map',
              hidden: this.roleid < 775
            },
            {
              title: 'Update OTTMap',
              link: '/pages/administration/update-ott-map',
              hidden: this.roleid < 775
            },

          ],
        },
        {
          title: 'Reseller OTT Plan',
          link: '/pages/administration/reseller-ott-plan',
          // hidden: !this.role.find(x => x == 1028),
        },


      ]
    },
    {
      title: 'Hotel',
      icon: 'fa fa-user-secret',
      hidden: this.roleid < 999,
      children: [
        {
          title: 'List',
          link: '/pages/hotel/list-hotel'
        }
      ]

    },
    {
      title: 'Reseller',
      icon: 'fa fa-user-secret',
      hidden: !(this.role.find(x => x == 401) || this.role.find(x => x == 402) ||
        this.role.find(x => x == 501) || this.role.find(x => x == 502) || this.role.find(x => x == 404)),
      children: [
        {
          title: ' List',
          link: '/pages/reseller/resellerList',
          hidden: !this.role.find(x => x == 401)
        },
        {
          title: 'Add',
          link: '/pages/reseller/add-reseller',
          hidden: !this.role.find(x => x == 402)
        },
        {
          title: 'View',
          link: '/pages/reseller/viewreseller',
          hidden: this.roleid >= 775
        },
        {
          title: 'Agreement Expiry',
          link: '/pages/reseller/listagrement',
          hidden: this.roleid < 775
        },
        {
          title: 'Reseller Branch',
          hidden: !(this.role.find(x => x == 501) || this.role.find(x => x == 502)),
          children: [
            {
              title: 'List',
              link: '/pages/reseller/list-branch',
              hidden: !this.role.find(x => x == 501)
            },
            {
              title: 'Add',
              link: '/pages/reseller/add-branch',
              hidden: !this.role.find(x => x == 502)
            },
          ],
        },

      ],
    },
    {
      title: 'Subscriber',
      icon: 'fa fa-users',
      hidden: !(this.role.find(x => x == 701) || this.role.find(x => x == 702) || this.role.find(x => x == 706)
        || this.role.find(x => x == 707) || this.role.find(x => x == 708) || this.role.find(x => x == 711) || this.role.find(x => x == 1053)),
      children: [
        {
          title: ' List',
          link: '/pages/cust/custList',
          hidden: !this.role.find(x => x == 701)
        },
        {
          title: 'Add',
          link: '/pages/cust/add-cust',
          hidden: !this.role.find(x => x == 702)
        },
        {
          title: 'Subs ServiceMaping',
          link: '/pages/cust/subs-packmapping',
          hidden: !this.role.find(x => x == 706)
        },
        {
          title: 'Document Pending',
          link: '/pages/cust/listdocpending',
          hidden: !this.role.find(x => x == 707)
        },
        {
          title: 'Update Limit',
          link: '/pages/cust/bulk-updatelimit',
          hidden: !this.role.find(x => x == 1053)
        },
        {
          title: 'Bulk Update',
          link: '/pages/cust/bulkupdate',
          hidden: !this.role.find(x => x == 1055)
        },
        {
          title: 'CAF Book',
          link: '/pages/cust/listcafnum',
          hidden: !this.role.find(x => x == 708)
        },
        {
          title: 'Schedule',
          link: '/pages/cust/listscheduled',
          hidden: !this.role.find(x => x == 711),
        },
        {
          title: 'Data Usage',
          link: '/pages/cust/data-usage',
          hidden: this.roleid < 775
        }
      ],
    },
    {
      title: 'Card users',
      icon: 'fa fa-id-card',
      hidden: !(this.role.find(x => x == 1067) || (this.role.find(x => x == 1068))),
      children: [
        {
          title: 'Registered Card user',
          link: '/pages/cust/register-card-user',
          hidden: !this.role.find(x => x == 1067)
        },
        {
          title: 'List Card User',
          link: '/pages/cust/list-card-user',
          hidden: !this.role.find(x => x == 1068)
        }
      ]
    },
    {
      title: 'Renewal',
      icon: 'fa fa-history',
      link: '/pages/cust/subsrenewal',
      hidden: (this.roleid != 111 || !(this.role.find(x => x == 713))),

    },
    {
      title: 'Accounts',
      icon: 'fa fa-money-check-alt',
      hidden: !(this.role.find(x => x == 801) || this.role.find(x => x == 802) || this.role.find(x => x == 804) ||
        this.role.find(x => x == 805) || this.role.find(x => x == 807) || this.role.find(x => x == 815) || this.role.find(x => x == 1021)
        || this.role.find(x => x == 810) || this.role.find(x => x == 1026) || this.role.find(x => x == 811) || this.role.find(x => x == 812)
        || this.role.find(x => x == 808) || this.role.find(x => x == 1063)),
      children: [
        {
          title: 'Deposit',
          hidden: !(this.role.find(x => x == 801) || this.role.find(x => x == 802) || this.role.find(x => x == 1063) || this.role.find(x => x == 815)),
          children: [
            {
              title: 'List',
              link: '/pages/Accounts/depositlist',
              hidden: !this.role.find(x => x == 801)
            },
            {
              title: 'Add',
              link: '/pages/Accounts/adddeposit',
              hidden: !this.role.find(x => x == 802)
            },
            {
              title: 'Outstanding',
              link: '/pages/Accounts/listresel-outstand',
              hidden: !this.role.find(x => x == 815)
            },
            {
              title: 'Wallet Sharing',
              link: '/pages/Accounts/wallet-share',
              hidden: !this.role.find(x => x == 1063),
            },
          ]
        },
        {
          title: 'Invoice Acknowledge',
          link: '/pages/Accounts/acknowledg-list',
          hidden: !this.role.find(x => x == 1021)
        },

        {
          title: 'OnlinePayment',
          hidden: !(this.role.find(x => x == 810) || this.role.find(x => x == 1026)),
          children: [
            {
              title: 'Reseller',
              link: '/pages/Accounts/onlinepaylist',
              hidden: (!this.role.find(x => x == 810)),
            },
            {
              title: 'Subscriber',
              link: '/pages/Accounts/custonlinepaylist',
              hidden: !this.role.find(x => x == 1026)
            },
          ]
        },



        {
          title: 'ComboInvoice',
          link: '/pages/Accounts/invoicelist',
          hidden: !this.role.find(x => x == 807)
        },
        {
          title: 'GST Invoice',
          link: '/pages/Accounts/gstinvoicelist',
          hidden: (!this.role.find(x => x == 811)),
        },

        {
          title: 'Open/Close Balance',
          link: '/pages/Accounts/openclose-balancelist',
          hidden: (!this.role.find(x => x == 812)),

        },
        {
          title: 'E-Receipt Book',
          hidden: !(this.role.find(x => x == 804) || this.role.find(x => x == 805) || this.role.find(x => x == 808)),
          children: [
            {
              title: 'List',
              link: '/pages/Accounts/listreceipt',
              hidden: !this.role.find(x => x == 804)
            },
            {
              title: 'UsedReceipt',
              link: '/pages/Accounts/listusedreceipt',
              hidden: (this.roleid == 111 || !this.role.find(x => x == 808)),

            },
          ],
        },
      ],
    },

    {
      title: 'Reports',
      icon: 'far fa-file',
      hidden: !(this.role.find(x => x == 1006) || this.role.find(x => x == 1007) || this.role.find(x => x == 1008) ||
        this.role.find(x => x == 1009) || this.role.find(x => x == 1010) || this.role.find(x => x == 1040) || this.role.find(x => x == 1011)
        || this.role.find(x => x == 1012) || this.role.find(x => x == 1013) || this.role.find(x => x == 1041)),
      children: [
        {
          title: 'Renewal Report',
          link: '/pages/reports/renewalReport',
          hidden: (!this.role.find(x => x == 1062))
        },
        {
          title: 'Dues',
          link: '/pages/reports/duesreport',
          hidden: (!this.role.find(x => x == 1006))

        },
        {
          title: 'Collection',
          link: '/pages/reports/collectionreport',
          hidden: (!this.role.find(x => x == 1007))

        },
        {
          title: 'Topup',
          link: '/pages/reports/topupreport',
          hidden: (!this.role.find(x => x == 1066))

        },
        {
          title: 'Traffic',
          link: '/pages/reports/trafficreport',
          hidden: (!this.role.find(x => x == 1077))

        },
        {
          title: 'Cancel Invoice',
          link: '/pages/Accounts/cancelinvreport',
          hidden: (!this.role.find(x => x == 1008))
        },
        {
          title: 'GSTinv Cancel',
          link: '/pages/Accounts/cancelgstinvreport',
          hidden: (!this.role.find(x => x == 1009))
        },
        // {
        //   title: 'OTT Invoice',
        //   link: '/pages/reports/ottinvoicelist',
        //   hidden: this.roleid < 775
        // },
        {
          title: 'Subscriber Count',
          link: '/pages/reports/dailysubs-count',
          hidden: (!this.role.find(x => x == 1040))
        },
        {
          title: 'Renewal Share',
          link: '/pages/Accounts/invoicebal-list',
          hidden: (!this.role.find(x => x == 1010))
        },
        {
          title: 'Reseller Revenue Share',
          link: '/pages/reports/reseller-revenue-share',
          hidden: (!this.role.find(x => x == 1061))
        },
        {
          title: 'Deposit',
          link: '/pages/administration/listbalancelog',
          hidden: (!this.role.find(x => x == 1011))
        },
        {
          title: 'ResellerNas',
          link: '/pages/administration/list-mappednas',
          hidden: (!this.role.find(x => x == 1012))
        },
        {
          title: 'Nas Status',
          link: '/pages/administration/listnaslog',
          hidden: (!this.role.find(x => x == 1013))
        },
        {
          title: 'Traffic',
          link: '/pages/reports/subscriberReport',
          hidden: !this.role.find(x => x == 1041)
        },
        {
          title: 'Online Payment Report',
          link: '/pages/Accounts/list-online-report',
          hidden: this.roleid < 775
        },
      ],
    },
    {
      title: 'Complaint',
      icon: 'far fa-clipboard',
      hidden: !(this.role.find(x => x == 901) || this.role.find(x => x == 902 || this.role.find(x => x == 904 || this.role.find(x => x == 905)))),
      children: [
        {
          title: 'List',
          link: '/pages/complaint/list-comp',
          hidden: !this.role.find(x => x == 901),
        },
        {
          title: 'Add',
          link: '/pages/complaint/add-comp',
          hidden: (!this.role.find(x => x == 902)),
        },
        {
          title: 'Complaint Type',
          hidden: !(this.role.find(x => x == 904) || this.role.find(x => x == 905)),
          children: [
            {
              title: 'List',
              link: '/pages/complaint/list-comptype',
              hidden: (!this.role.find(x => x == 904))
            },
            {
              title: 'Add',
              link: '/pages/complaint/add-comptype',
              hidden: (!this.role.find(x => x == 905))
            },
          ],
        },
      ],
    },
    {
      title: 'Enquiry',
      icon: 'fas fa-clipboard-list',
      hidden: (this.roleid == 111 || this.roleid != 999),
      children: [
        {
          title: 'List',
          link: '/pages/enquiry/list_enquiry',

        },
        {
          title: 'Add ',
          link: '/pages/enquiry/add_enquiry',

        },
      ],
    },
    {
      title: 'Inventory',
      icon: 'fa fa-cubes',
      hidden: !(this.role.find(x => x == 601) || this.role.find(x => x == 605) || this.role.find(x => x == 609) || this.role.find(x => x == 613)),

      children: [
        {
          title: 'HSN/SAC',
          hidden: !this.role.find(x => x == 601),
          children: [
            {
              title: 'List',
              link: '/pages/Inventory/list-hsn',
              hidden: !this.role.find(x => x == 601)
            },
          ]
        },
        {
          title: 'Make',
          hidden: !this.role.find(x => x == 605),
          children: [
            {
              title: 'List',
              link: '/pages/Inventory/list-make',
              hidden: !this.role.find(x => x == 605)
            },
          ]
        },
        {
          title: 'Type',
          hidden: !this.role.find(x => x == 609),
          children: [
            {
              title: 'List',
              link: '/pages/Inventory/list-type',
              hidden: !this.role.find(x => x == 609)
            },
          ],
        },
        {
          title: 'Model',
          hidden: !this.role.find(x => x == 613),
          children: [
            {
              title: 'List',
              link: '/pages/Inventory/list-model',
              hidden: !this.role.find(x => x == 613)
            },
          ]
        },
      ],
    },
    {
      title: 'Logs',
      icon: 'fas fa-clipboard-list',
      hidden: (!(this.role.find(x => x == 1001) || this.role.find(x => x == 1002) || this.role.find(x => x == 1003)
        || this.role.find(x => x == 1004) || this.role.find(x => x == 1005) || this.role.find(x => x == 1064))),
      children: [
        {
          title: 'ProfileLog',
          link: '/pages/administration/list-custprofilelog',
          hidden: !this.role.find(x => x == 1001)
        },
        {
          title: 'ActivityLog',
          link: '/pages/administration/listactivitylog',
          hidden: !this.role.find(x => x == 1002)
        },

        {
          title: 'BandwidthLog',
          link: '/pages/administration/listbandwidthlog',
          hidden: !this.role.find(x => x == 1003)
        },
        {
          title: 'EditProfilelog',
          link: '/pages/administration/listprofileeditlog',
          hidden: !this.role.find(x => x == 1004)
        },
        {
          title: 'ResellerSharelog',
          link: '/pages/administration/listresellersharelog',
          hidden: !this.role.find(x => x == 1005)
        },
        {
          title: 'OTTMonitorLog',
          link: '/pages/administration/ott-log',
          hidden: this.roleid < 775
        },
        {
          title: 'InvoiceMaillog',
          link: '/pages/administration/invoice-mail-log'
        },
        {
          title: 'GSTMaillog',
          link: '/pages/administration/gst-mail-log'
        },
        {
          title: 'UserMailLog',
          link: '/pages/administration/user-mail-log',
          hidden: !this.role.find(x => x == 1064),
        },
        {
          title: 'UpdateShareLog',
          link: '/pages/administration/share-log',
          hidden: this.roleid < 775
        }

      ],
    },


    



    ]
  }
  addnas() {
    const activeModal = this.nasmodel.open(AddNasComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add Nas';
  }
  menu: NbMenuItem[]
}
