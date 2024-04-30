import { Component, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card >
      <div class="icon-container">
        <div class="icon  {{ type }}" style="cursor:pointer;" (click)="click()">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title">{{ title }}</div>
         
        <div class="value">{{ value }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {
  @Output() clicked = new EventEmitter<any>();
  @Input() title: string;
  @Input() type: string;
  @Input() on = true;
  @Input() value : any;
  @Input() ID : string;
  click(){
    this.clicked.emit(this.ID)
    
  }
}


