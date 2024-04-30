import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../_service/indexService';
@Component({
  selector: 'ngx-flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss']
})
export class FlipCardComponent implements OnInit {
  flipped = false;

  toggleView() {
    this.flipped = !this.flipped;
  }

  constructor(
    public role: RoleService,
  ) { }

  ngOnInit() {

  }
}
