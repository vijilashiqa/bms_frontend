import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { RoleService, PaymentService, S_Service, BusinessService, ResellerService, CustService } from '../../_service/indexService';
import { ITreeOptions, TreeModel } from 'angular-tree-component';
import { toJS } from "mobx";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HashLocationStrategy } from '@angular/common';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
   selector: 'subs-packmapping',
   templateUrl: './subs-packmapping.component.html',
})

export class SubsServiceAssignComponent implements OnInit {
   MapServiceForm; busdata; reseldata; profile;
   config; queryparams; msg; status; item; result: any; pack: any; selectdata;

   public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
   public primaryColour = '#dd0031';
   public secondaryColour = '#006ddd';
   public loading = false;

   @ViewChild('tree') public tree; selectedNodes = []; service = []; price = []; getSelected;
   submit: boolean;
   nodes: any[] = [];

   constructor(
      private router: Router,
      private alert: ToasterService,
      public role: RoleService,
      private packser: S_Service,
      private busser: BusinessService,
      private resser: ResellerService,
      private custser: CustService,

   ) { }

   async ngOnInit() {
      await this.createForm();
      await this.businessname();
      await this.showProfile();

      if (this.role.getroleid() <= 777) {
         this.MapServiceForm.get('bus_id').setValue(this.role.getispid());
         // await this.resellername();
         await this.showProfile();
      }
      if (this.role.getroleid() < 775) {
         this.MapServiceForm.get('reseller').setValue(this.role.getresellerid());
         await this.package();
      }
      // await this.package();
   }

   async businessname() {
      this.busdata = await this.busser.showBusName({})
   }

   async showProfile($event = '') {
      if (this.MapServiceForm.value['bus_id']) {
         this.profile = await this.resser.showProfileReseller({ like: $event, bus_id: this.MapServiceForm.value['bus_id'] })
      }
   }

   async resellername($event = '') {
      if (this.MapServiceForm.value['bus_id'] && this.MapServiceForm.value['resel_type']) {
         this.reseldata = await this.resser.showResellerName({ like: $event, bus_id: this.MapServiceForm.value['bus_id'], role: this.MapServiceForm.value['resel_type'] });
      }
   }

   async package() {
      this.nodes = [];
      if (this.MapServiceForm.value['reseller']) {
         this.result = await this.packser.showService({
            res_flag: 1, resel_id: this.MapServiceForm.value['reseller'], tree_flag: 1
         });
         for (var val of this.result) {
            val.hasChildren = true;
            this.nodes.push(val);
            this.tree.treeModel.update();
         }
         this.loading = true;
         for (var i = 0; i < this.nodes.length; i++) {
            await this.getChildren(this.nodes[i])
            this.tree.treeModel.update();
         }
         this.selectdata = await this.custser.showCustServiceMap({ bus_id: this.MapServiceForm.value['bus_id'], resel_id: this.MapServiceForm.value['reseller'] })
         this.getSelected = await this.selectdata.map(item => item.sub_plan_id)
         // console.log("select", this.getSelected);
         if (this.getSelected) {
            this.loading = false;
         }
         this.selectnodes(this.getSelected)
      }
   }

   options: ITreeOptions = {
      useCheckbox: true,
      getChildren: this.getChildren.bind(this),
      useVirtualScroll: true,
      nodeHeight: 22
   };


   async getChildren(node: any) {
      if (node.srvid) {
         this.pack = await this.packser.showSubPlan({ srvid: node['srvid'], resel_id: this.MapServiceForm.value['reseller'], tree_flag: 1, edit_flag: 1 })
      } else {
         this.pack = await this.packser.showSubPlan({ srvid: node.data['srvid'], resel_id: this.MapServiceForm.value['reseller'], tree_flag: 1, edit_flag: 1 })
      }
      this.tree.treeModel.setFocus(true);
      if (this.pack.length != 0 && node['id']) {
         let id = this.nodes.find(e => e.id === node['id']);
         if (!this.nodes.find(e => e.id === node['id']).children) {
            this.nodes.find(e => e.id === node['id']).children = new Array();
         }
         for (let val of this.pack) {
            val.hasChildren = false;
            this.nodes.find(e => e.id === node['id']).children.push(val);
            this.tree.treeModel.update();
         }
      }
      else {
         this.nodes.find(e => e.id === node['id']).hasChildren = false;
      }
      return this.pack;
   }

   selectednodes() {
      const selectedNodes = [];
      Object.entries(toJS(this.tree.treeModel.selectedLeafNodeIds)).forEach(([key, value]) => {
         console.log(key, value);
         if (value === true) {
            selectedNodes.push(parseInt(key));
         }
      });
      this.tree.treeModel.update();
      return (selectedNodes);
   }

   selectnodes(item) {
      let index: number = item.indexOf(404);
      if (index !== -1) {
         item.splice(index, 1);
      }
      let nodedata = this.tree.treeModel.nodes;
      for (var i = 0; i < item.length; ++i) {
         // console.log("checkdatas", item[i]);
         let leaf = this.tree.treeModel.getNodeById(JSON.parse(item[i]))
         // console.log(leaf)
         if (leaf)
            leaf.setIsSelected(true);
      }
   }

   async mapService() {
      if (this.MapServiceForm.invalid) {
         this.submit = true;
         return;
      }
      var values = this.MapServiceForm.value, issue = false;
      let res = this.selectednodes();
      values['sub_plan_id'] = res;
      values['sub_plan_id'].forEach(item => {
         if ((item + '').includes('404')) {
            issue = true;
         }
      });
      issue ? values['sub_plan_id'].push(404) : '';
      if (values['sub_plan_id'].length == 0) {
         this.toastalert('Please Select Subplan', 1);
         return;
      }
      let result = await this.custser.custServiceMap({ values });
      if (result[0]['error_msg'] == 0) {
         this.toastalert(result[0]['msg'], result[0]['error_msg']);
         setTimeout(() => {
            this.router.navigate(['/pages/service/service-list'])
         }, 2000);
      } else {
         this.price = []
      }

   }

   toastalert(msg, status) {
      const toast: Toast = {
         type: status == 0 ? 'success' : 'warning',
         title: status == 0 ? 'Success' : 'Failure',
         body: msg,
         timeout: 3000,
         showCloseButton: true,
         bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
   }

   createForm() {
      this.MapServiceForm = new FormGroup({
         bus_id: new FormControl('', Validators.required),
         reseller: new FormControl('', Validators.required),
         resel_type: new FormControl('', Validators.required),
      });
   }
}