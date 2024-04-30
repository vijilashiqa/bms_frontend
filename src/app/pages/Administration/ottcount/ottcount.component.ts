import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'ngx-ottcount',
  templateUrl: './ottcount.component.html',
  styleUrls: ['./ottcount.component.scss']
})
export class OttcountComponent implements OnInit {

  submit: boolean = false; item; modalHeader;
  constructor(
    private alert: ToasterService,
    public activeModal: NgbActiveModal,

  ) { }

  closeModal() {
    // console.log(this.addprice)
    this.activeModal.close(true);

  }

  ngOnInit() {
    console.log(this.item)
  }
}
