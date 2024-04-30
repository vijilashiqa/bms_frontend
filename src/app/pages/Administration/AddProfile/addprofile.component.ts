import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ITreeOptions } from 'angular-tree-component';
import { toJS } from "mobx";
import { AdminuserService, RoleService } from '../../_service/indexService';

@Component({
  selector: 'AddProfile',
  templateUrl: './addprofile.component.html',
})

export class AddprofileComponent implements OnInit {
  @ViewChild('tree') public tree;
  AddProfileForm; edit;
  submit: boolean;
  nodes = [
    {
      name: 'Dashboard',
      children: [
        { id: 91, name: 'Payment' },
        { id: 92, name: 'Subscriber Status Card' },
        { id: 93, name: 'ExpiryDetails' },
        { id: 94, name: 'Subscriber Status Chart' },
        { id: 95, name: 'Link Status' },
        { id: 96, name: 'CAF Pending' },
        { id: 97, name: 'Agreement Expiry Details' },
        { id: 98, name: 'Balance Sheet' },
        { id: 99, name: 'Wallet' },
        {
          name: 'Subscriber Dashboard',
          children: [
            // { id:1014, name:'Wallet' },
            { id: 1015, name: 'Daily Usage Limit' },
            { id: 1016, name: 'Basic Info' },
            { id: 1017, name: 'Status Info' },
            { id: 1042, name: 'Address Info' },
            { id: 1018, name: 'Service Info' },

          ]
        }
      ]
    },
    {
      name: 'Administration',
      children: [
        {
          name: 'Admin user',
          children: [
            { id: 81, name: 'List Adminuser' },
            { id: 82, name: 'Add Adminuser' },
            { id: 83, name: 'Edit Adminuser' },
            { id: 84, name: 'Change User Password' }
          ],
        },
        {
          name: 'User Profile',
          children: [
            { id: 71, name: 'List User Profile' },
            // { id: 72, name: 'Add User Profile' },
            { id: 73, name: 'Edit User Profile' },

          ],
        },
        {
          name: 'state/City',
          children: [
            { id: 61, name: 'List State/City' },
          ]
        },
        {
          name: 'Circles',
          children: [
            { id: 201, name: 'List Circle' },
            { id: 202, name: 'Add Circle' },
            { id: 203, name: 'Edit Circle' },
          ]
        },
        {
          name: 'Static IP',
          children: [
            { id: 51, name: 'List Static IP' },
            { id: 52, name: 'Add Static IP' },
            { id: 53, name: 'Edit Static IP' },
          ],
        },
        {
          name: 'SMS-Gateway',
          children: [
            { id: 21, name: 'List SMS-Gateway' },
            { id: 22, name: 'Add SMS-Gateway' },
            { id: 23, name: 'Edit SMS-Gateway' },
          ],
        },
        {
          name: 'Templates',
          children: [
            {
              name: 'SMS-TemplatesISP',
              children: [
                { id: 41, name: 'List SMS-Templates ISP' },
                { id: 42, name: 'Add SMS-Templates ISP' },
                { id: 43, name: 'Edit SMS-Templates ISP' },
                { id: 44, name: 'Delete SMS-Templates ISP' },
              ],
            },
            {
              name: 'EMail-TemplatesISP',
              children: [
                { id: 45, name: 'Update' },
                { id: 46, name: 'Reset' },
              ]
            },
          ],
        },
        { id: 1057, name: 'Show Revenue-ShareDetails' },
      ]
    },
    {
      name: 'TOOLS',
      children: [
        { id: 1073, name: 'Tools Operation' }
      ]
    },
    {
      name: 'OTT',
      children: [
        { id: 1028, name: 'List OTT' },
        { id: 1029, name: 'Add OTT' },
        { id: 1030, name: 'Edit OTT' },
        { id: 1059, name: 'Reseller OTT PLAN' }
      ],
    },
    {
      name: 'PROMOTION',
      children: [
        { id: 1058, name: 'Send Email' }
      ]
    },
    {
      name: 'ISP',
      children: [
        { id: 101, name: 'List ISP' },
        { id: 102, name: 'Add ISP' },
        { id: 103, name: 'Edit ISP' },
        { id: 105, name: 'Logo Update' },
        { id: 104, name: 'List Business Taxlog' },
      ],
    },
    {
      name: 'Radius',
      children: [
        {
          name: 'Nas',
          children: [
            { id: 302, name: 'List Nas' },
            { id: 303, name: 'Add Nas' },
            { id: 304, name: 'Edit Nas' },
          ],
        },
        {
          name: 'Service',
          children: [
            { id: 314, name: 'List Service' },
            { id: 315, name: 'Add Service' },
            { id: 316, name: 'Edit Service' },
            { id: 317, name: 'View Service' },
            { id: 321, name: 'Service Maping' },
            { id: 322, name: ' New Service Mapping' },

            {
              name: 'Sub Plan',
              children: [
                { id: 318, name: 'List Subplan' },
                { id: 319, name: 'Add Subplan' },
                { id: 320, name: 'Edit Subplan' },
                { id: 1025, name: 'Sub-plan Mapping' }
              ]
            },
          ],
        },
        {
          name: 'Top-Up',
          children: [
            { id: 1043, name: 'List Top-Up' },
            { id: 1044, name: 'Add Top-Up' },
            { id: 1045, name: 'Edit Top-Up' },
          ],
        },
        {
          name: 'Ip Pool',
          children: [
            { id: 306, name: 'List IP Pool' },
            { id: 307, name: 'Add IP Pool' },
            { id: 308, name: 'Edit IP Pool' },
          ],
        },
        {
          name: 'Access Point',
          children: [
            { id: 310, name: 'List AP' },
            { id: 311, name: 'Add AP' },
            { id: 312, name: 'Edit AP' },
          ],
        },
      ],
    },
    {
      name: 'Voice',
      children: [
        { id: 1047, name: 'List Voice' },
        { id: 1048, name: 'Add Voice' },
        { id: 1049, name: 'Edit Voice' },
      ],
    },
    {
      name: 'Reseller',
      children: [
        { id: 401, name: 'List Reseller' },
        { id: 402, name: 'Add Reseller' },
        { id: 403, name: 'Edit Reseller' },
        { id: 404, name: 'View Reseller' },
        { id: 406, name: 'Logo Update' },
        { id: 1031, name: 'Change Password' },
        { id: 405, name: 'List Agreement Expiry' },
      ],
    },
    {
      name: 'Reseller Branch',
      children: [
        { id: 501, name: 'List Branch' },
        { id: 502, name: 'Add Branch' },
        { id: 503, name: 'Edit Branch' },
      ],
    },
    {
      name: 'Subscriber',
      children: [
        { id: 701, name: 'List Subscriber' },
        { id: 702, name: 'Add Subscriber' },
        { id: 703, name: 'Edit Subscriber' },
        { id: 704, name: 'View Subscriber' },
        { id: 705, name: 'Renew Subscriber' },
        { id: 1032, name: 'Change Password' },
        { id: 713, name: 'Direct subscriber Renewal' },
        { id: 706, name: 'Subscriber Service Map' },
        { id: 707, name: 'List Document Pending' },
        { id: 1050, name: 'Change Validity' },
        { id: 1051, name: 'Change Service' },
        { id: 1052, name: 'Limit Update' },
        { id: 1053, name: 'Bulk Limit Update' },
        { id: 1054, name: 'Show Services For Subscriber' },
        { id: 1055, name: 'Bulk Update' },
        { id: 1065, name: 'Topup Renewal' },
        { id: 1074, name: 'CAF Verification' },
        { id: 1075, name: 'Document & profile picture Verification' },

        {
          name: 'CAF Book',
          children: [
            { id: 708, name: 'List CAF' },
            { id: 709, name: 'Add CAF' },
            { id: 710, name: 'Edit CAF' },
          ],
        },
        {
          name: 'Schedule',
          children: [
            { id: 711, name: 'List Scheduled Subscribers' },
            { id: 712, name: 'Cancel Scheduled Subscribers' },
            { id: 714, name: 'Change Scheduled Time' },

          ],
        },
      ],
    },
    {
      name: 'Accounts',
      children: [
        { id: 1046, name: 'Invoice Share Show' },
        { id: 1060, name: 'Invoice Share Amount Details' },
        { id: 1063, name: 'Wallet Share' },

        {
          name: 'Deposit',
          children: [
            { id: 801, name: 'List Deposit' },
            { id: 802, name: 'Add Deposit' },
            { id: 803, name: 'Cancel Deposit' },
            { id: 815, name: 'List Outstanding' },
          ],
        },
        {
          name: 'Invoice Acknowledge',
          children: [
            { id: 1021, name: 'List Invoice Acknowldgment' },
            { id: 1022, name: 'Add Acknowledge Invoice' },
            { id: 1023, name: 'View Acknowldged Invoice' },
            { id: 1024, name: 'View QRCode' },
            { id: 1056, name: 'Update EInvoice Date' }

          ],
        },
        {
          name: 'Online Payment',
          children: [
            { id: 810, name: 'List Online Payment' },
            { id: 816, name: 'Payment Status Check' },
          ],
        },
        {
          name: 'Subscriber Payment',
          children: [
            { id: 1026, name: 'List Subscriber Payment' },
            { id: 1027, name: 'Payment Status Check' },
          ],
        },
        {
          name: 'Receipts',
          children: [
            { id: 1033, name: 'Receipts' },
            { id: 1038, name: 'Cancel Receipt' },
          ],
        },
        {
          name: 'Combo Invoice',
          children: [
            { id: 807, name: 'List Combo Invoice' },
            { id: 813, name: 'View Combo Invoice' },
          ],
        },
        {
          name: 'GST Invoice',
          children: [
            { id: 811, name: 'List GST Invoice' },
            { id: 814, name: 'View GST Invoice' },
          ],
        },
        { id: 812, name: 'List Balance' },
        {
          name: 'E-Receipt Book',
          children: [
            { id: 804, name: 'List Receipt' },
            { id: 805, name: 'Add Receipt' },
            { id: 806, name: 'Edit Receipt' },
            { id: 808, name: 'List Used Receipt' },
            { id: 809, name: 'View Used Receipt' },
          ],
        },
      ]
    },
    {
      name: 'Logs',
      children: [
        { id: 1001, name: 'Profile Log' },
        { id: 1002, name: 'Activity Log' },
        { id: 1003, name: 'Bandwidth Log' },
        { id: 1004, name: 'Editprofile Log' },
        { id: 1005, name: 'Resellershare Log' },
        { id: 1064, name: 'UserMail Log' },
      ]
    },
    {
      name: 'Reports',
      children: [
        { id: 1062, name: 'Renewal Report' },
        { id: 1006, name: 'Dues' },
        { id: 1035, name: 'view Dues' },
        { id: 1007, name: 'Collection' },
        { id: 1036, name: 'View Collection' },
        { id: 1037, name: 'Collection Receipt' },
        { id: 1008, name: 'Cancel Invoice' },
        { id: 1019, name: 'View Cancel Invoice' },
        { id: 1009, name: 'GSTInvoice Cancel' },
        { id: 1020, name: 'View GSTInvoice Cancel' },
        { id: 1039, name: 'GSTInvoice Receipt' },
        { id: 1040, name: 'Subscriber Count' },
        { id: 1010, name: 'Renewal Share' },
        { id: 1011, name: 'Deposit' },
        { id: 1012, name: 'Reseller Nas' },
        { id: 1013, name: 'Nas Status' },
        { id: 1041, name: 'Subscriber Traffic' },
        { id: 1061, name: 'Reseller Revenue Sharing' },
        { id: 1066, name: 'Topup Report' },
        { id: 1077, name: 'Traffic Report' },
      ]
    },
    {
      name: 'Complaints',
      children: [
        { id: 901, name: 'List Complaints' },
        { id: 902, name: 'Add Complaints' },
        { id: 903, name: 'Edit Complaints' },
        { id: 907, name: 'View Complaints' },
        { id: 908, name: 'Update Complaint Status' },
        { id: 904, name: 'List Complaint Type' },
        { id: 905, name: 'Add Complaint Type' },
        { id: 906, name: 'Edit Complaint Type' },
      ],
    },
    {
      name: 'Inventory',
      children: [
        {
          name: 'HSN/SAC',
          children: [
            { id: 601, name: 'List HSN' },
            { id: 602, name: 'Add HSN' },
            { id: 603, name: 'Edit HSN' }
          ],
        },
        {
          name: 'Make',
          children: [
            { id: 605, name: 'List Make' },
            { id: 606, name: 'Add Make' },
            { id: 607, name: 'Edit Make' },
          ],
        },
        {
          name: 'Type',
          children: [
            { id: 609, name: 'List Type' },
            { id: 610, name: 'Add type' },
            { id: 611, name: 'Edit Type' },
          ],
        },
        {
          name: 'Model',
          children: [
            { id: 613, name: 'List Model' },
            { id: 614, name: 'Add Model' },
            { id: 615, name: 'Edit Model' },
          ],
        },
      ],
    },
    {
      name: 'Card-users',
      children: [
        { id: 1067, name: 'Register Card user' },
        { id: 1068, name: 'List Card User' },
        { id: 1069, name: 'Add Card User' },
        { id: 1070, name: 'Update Card User' },
        { id: 1071, name: 'Update Profile Password Card User' },
        { id: 1072, name: 'Update Validity For Card User' },
        { id: 1076, name: 'Update Simultaneous Use for Card Users' }
      ]
    }
  ];

  options: ITreeOptions = {
    useCheckbox: true
  };

  constructor(
    private alert: ToasterService,
    private router: Router,
    private admser: AdminuserService,
    public role: RoleService,
  ) {
    this.edit = JSON.parse(localStorage.getItem('profile_e'));
    // console.log(this.id['id'])
  }

  async ngOnInit() {
    this.createForm();
    if (this.edit)
      await this.getprofile();
  }

  async getprofile() {
    let result = await this.admser.getProfileEdit({ profile_id: this.edit['role_id'] });
    if (result) {
      this.selectnodes(result['menu_role'])
    }
  }

  async AddProfile() {
    if (this.AddProfileForm.invalid) {
      this.submit = true;
      return;
    }
    var method, val = this.AddProfileForm.value, issue = false;
    val['menu_role'] = this.selectednodes();
    // console.log("role",val['menu_role']);

    val['menu_role'].forEach(item => {
      if ((item + '').includes('404')) {
        issue = true
      }
    });
    issue ? val['menu_role'].push(404) : '';
    if (val['menu_role'].length == 0) {
      this.toastalert('Pls Select Profile Role')
      return;
    }
    // console.log("777")
    method = this.edit ? 'editProfile' : 'addprofile'

    if (this.edit) {
      val['roleId'] = this.edit['role_id'];
    }

    let result = await this.admser[method](val)
    // console.log(result)
    this.toastalert(result['msg'], result['status']);
    if (result['status'] == 1) {
      this.router.navigate(['/pages/administration/Profilelist'])
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

  selectednodes() {
    const selectedNodes = [];
    Object.entries(toJS(this.tree.treeModel.selectedLeafNodeIds)).forEach(([key, value]) => {
      // console.log(key, value);
      if (value === true) {
        selectedNodes.push(parseInt(key));
      }
    });
    return (selectedNodes);
  }

  selectnodes(item) {
    let data = JSON.parse(item);

    let index: number = data.indexOf(404);
    if (index !== -1) {
      data.splice(index, 1);
    }
    for (var i = 0; i < data.length; ++i) {
      // console.log("data", data[i])
      let leaf = this.tree.treeModel.getNodeById(JSON.parse(data[i]))
      // console.log(leaf)
      if (leaf)
        leaf.setIsSelected(true);
    }
  }

  createForm() {
    this.AddProfileForm = new FormGroup({
      menu_name: new FormControl(this.edit ? this.edit['menu_name'] : '', Validators.required),
      descr: new FormControl(this.edit ? this.edit['desc'] : '')
    });
  }
}