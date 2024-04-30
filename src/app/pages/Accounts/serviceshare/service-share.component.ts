import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, RoleService, S_Service } from '../../_service/indexService';

@Component({
    selector: 'serviceshare',
    templateUrl: './service-share.component.html',
    styleUrls: ['./service-share.component.scss']
})

export class ServiceShareComponent implements OnInit {
    submit: boolean = false; item; modalHeader; data; sharedata;service_type;plancode ='';
    constructor(
        private alert: ToasterService,
        private ser: AccountService,
        private router: Router,
        public activeModal: NgbActiveModal,
        public role: RoleService

    ) { }

    closeModal() {
        // console.log(this.addprice)
        this.activeModal.close(true);

    }

    async transacn() {
        let res = await this.ser.invoiceOttShare({ invid: this.data['invid'] });
        this.service_type = this.data['sertype']
        this.sharedata = res[0];
        // if(res){
        //     let plan = await this.ser.ottInvoice({ invid: this.data['invid']  })
        //     console.log('Ottplan',plan[0][0])
        //     this.plancode = plan[0][0]['ottplancode'];
        //  }

    }

    async ngOnInit() {
        if (this.data) {
            await this.transacn()
        }
    }
}

