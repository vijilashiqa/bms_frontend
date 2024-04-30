import { Component, ElementRef, EventEmitter, Input ,Output, ViewChild } from '@angular/core';

@Component({
  selector: 'auto-complete',
  template: `
    <label>{{label}}</label>
    <input (keydown)='onOutput($event);' (change) ='onOutput();' (focus)="hidden=false" class="form-control {{aclass}}" #input placeholder='{{placeholder}}' [id]='name' [name]='name'>
    <div #dropDown [hidden]="hidden" class="dropdown-content">
      <a (mouseover)="index=i;" (click)="onClick();" [ngStyle]="{'background-color': i==index ? 'silver':''}" [hidden]=!item[values].toLowerCase().includes(input.value.toLowerCase()) *ngFor="let item of items;let i=index;">
        {{item[values]}}
      </a>
      <a [hidden]='items.length!=0'>No Data Found</a>
    </div>
  `,
  styleUrls : ['./auto-complete.scss'],
  host: {
    '(document:click)': 'outSide($event.target.id)'
  }
})
export class AutoCompleteComponent{
  hidden=true;index=0;
  @ViewChild('input') input: ElementRef;
  @ViewChild('dropDown') dropDown: ElementRef;
  @Input() label='';incr=0;
  @Input() name='';id;values;
  //Initial Purose Only
  @Input() initialText = '';

  ngOnInit(){
    this.input.nativeElement.value = this.initialText;
  }

  @Input() set item(item : any){
    this.index = 0;
    this.dropDown.nativeElement.scrollTop = 0;
   let val =(item==null?0:item);
   // console.log("value",val)
    this.items = val|| [];
    // console.log("ITEM",this.items)
    //  console.log("ITEM1",item)
    let len = val.length ? val.length : 0 
    if( len > 0){
      this.id = Object.keys(item[0])[0];
      this.values = Object.keys(item[0])[1];
          //  console.log("id",this.id )
            // console.log("value",this.values )

      if(!this.initial && this.iniialid){
        let valueid = this.items.find(x=> x[this.id] == this.iniialid);
        if(valueid){
          this.input.nativeElement.value = valueid[this.values];
          this.initial = true;
          this.iniialid = null;
        }else{
          this.input.nativeElement.value = '';
        }
      }
      let id = this.items.find(x=> x[this.values] == this.input.nativeElement.value);
      if(id){
        this.value.emit(id[this.values]);
        this.item_id.emit(id[this.id]);
        // this.aclass = '';
      }else{
        this.value.emit('');
        this.item_id.emit(null);
      }
    }
    else if(len==0){
       this.id =null;
       this.values =null;
    }
  };
  @Input() set setId(Id:any){
    if(Id){
      this.iniialid = Id;
      this.initial = false;
      let valueid = this.items.find(x=> x[this.id] == Id);
      if(valueid){
        this.input.nativeElement.value = valueid[this.values];
      }else{
        this.input.nativeElement.value = '';
      }
    }
  };
  @Input() placeholder:string='';
  @Input() aclass;

  //Output
  @Output() item_id: EventEmitter<number> = new EventEmitter<number>();
  @Output() value: EventEmitter<string> = new EventEmitter<string>();

  items=[];
  initial:boolean = false
  iniialid:any;

  onOutput(event = '') {    
    let keycode = event['keyCode'] || 0,val = this.input.nativeElement.value;
    if(keycode==9){
      this.hidden=!this.hidden;
    }
    if(keycode==13){
      this.hidden = true;
      
      val = this.input.nativeElement.value = this.items[this.index][this.values];
      let id = this.items[this.index];
      if(id){
        this.item_id.emit(id[this.id]);
        this.value.emit(id[this.values]);
        return;
      }else{
        this.item_id.emit(null);
        this.value.emit('');
        return;
      }
    }else if(keycode==40&&this.index<this.items.length-1){
      this.dropDown.nativeElement.scrollTop+=35;
      this.index++;
      return;
    }else if(keycode==38&&this.index>0){
      this.dropDown.nativeElement.scrollTop-=35;
      this.index--;
      return;
    }
    if(event &&  ((keycode > 47 && keycode < 58)   || // number keys
        // keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223))
      ){
        let id = this.items.find(x=> (x[this.values]+'').toLowerCase() == (val+'').toLowerCase());
        if(id){
          this.item_id.emit(id[this.id]);
          this.value.emit(id[this.values]);
        }else{
          this.item_id.emit(null);
          this.value.emit('');
        }
      }
  }

  onClick(){
    let id = this.items[this.index];
    let val = this.input.nativeElement.value = id[this.values];
    if(id){
      this.item_id.emit(id[this.id]);
      this.value.emit(id[this.values]);
    }
    this.hidden = !this.hidden;
  }

  outSide(event){
    this.hidden = event != this.name;
  }
}