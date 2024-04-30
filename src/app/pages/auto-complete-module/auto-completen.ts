import { Component, forwardRef, ElementRef, Input, ViewChild, OnInit, EventEmitter, Output, Renderer2, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'auto-completen',
  templateUrl: 'auto-completen.html',
  styleUrls: ['./auto-completen.scss'],
  host: {
    '(document:mouseup)': 'outSide($event)'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteNComponent),
      multi: true
    }
  ]
})

export class AutoCompleteNComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  hidden = true; index = -1; oldValue = null;
  @ViewChild('dropDown') dropDown: ElementRef;
  @ViewChild('autocomplet') autocomplet: ElementRef;
  incr = 0;
  // Initial Purose Only
  @Input() autofocus = false;
  @Input() disabled = false;
  // @Input() manualSearch = false;
  @Input() optValues = 'name';
  @Input() optId = 'id';
  @Input() placeholder: string = '';
  @Input() addclass;
  @Input() set id(value: string) {
    this._ID = value;
  }
  @Input() set name(value: string) {
    this._Name = value;
  }
  @Input() MultiSelect: boolean = false;
  @Output() changed = new EventEmitter();
  @Output() keyUp = new EventEmitter();
  @Output() enter = new EventEmitter();

  private textbox = '';
  private _ID = ''; private _Name = '';
  private items = []; private itemsFilter = [];
  private initial: boolean = false;

  private multiSelectedItem = [];
  // Function to call when the value changes.
  private onChange = (value: any) => { };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  constructor(
    private _eref: ElementRef
  ) { }
  ngAfterViewInit(): void {
    if (this.autofocus) this.autocomplet.nativeElement.focus();
  }
  ngOnInit() {

  }


  @Input() set item(item: any) {
    this.index = -1;
    if (this.initial && this.dropDown) { this.dropDown.nativeElement.scrollTop = 0; }
    this.items = JSON.parse(JSON.stringify(item || []));//deep cloning
    if (this.MultiSelect) {
      this.itemsFilter = this.items.filter(x => {
        x.status = false;
        if (this.multiSelectedItem.includes(x[this.optId])) { x.status = true; }
        if (x[this.optValues] + ''.toLowerCase().includes((this.textbox + '').toLowerCase())) {
          return x
        }
      });
    } else {
      this.itemsFilter = this.items.filter(x => x[this.optValues] + ''.toLowerCase().includes((this.textbox + '').toLowerCase()));
      if (item && item.length > 0) {
        const value = '';
        if (!this.textbox && this.oldValue) {
          this.setValueBasedOnID(this.oldValue);
        }
      }
    }
  }

  private updateValue(value = {}) {
    const tempValue: number = value[this.optId] || null;
    if ((tempValue || this.oldValue) && tempValue !== this.oldValue && !this.MultiSelect) {
      this.oldValue = tempValue;
      this.onChange(tempValue);
      this.changed.emit(value);
    }
  }

  private setValueBasedOnID(ID, initial: boolean = true) {
    const valueid = this.items.find(x => x[this.optId] == ID);
    if (valueid) {
      this.textbox = valueid[this.optValues];
      this.initial = initial;
    } else {
      this.textbox = '';
    }
  }

  onOutput(event = '') {
    let keycode = event['keyCode'] || 0, val = this.textbox;
    //  if (this.manualSearch) {
      if (keycode === 8) {// Backspace
        this.keyUp.emit(this.textbox)
        this.itemsFilter = this.items.filter(x => (x[this.optValues] + '').toLowerCase().includes((this.textbox + '').toLowerCase()));
        this.updateValue();
        return;
      } else if (keycode === 13 && this.index !== -1 && !this.MultiSelect) {// Enter
        this.hidden = true;
        val = this.textbox = this.itemsFilter[this.index][this.optValues];
        const value = this.items[this.index];
        this.updateValue(value);
        this.enter.emit(value)
        return;
      } else if (keycode === 40 && this.index < this.items.length - 1) { //down
        this.dropDown.nativeElement.scrollTop += this.index === -1 ? 0 : 40;
        this.index++;
        // Set Value Label In Future Like Placeholder
        return;
      } else if (keycode === 38 && this.index > -1) { // UP
        this.dropDown.nativeElement.scrollTop -= 40;
        this.index--;
        // Set Value Label In Future Like Placeholder
        return;
      } else if (event && (
        (keycode > 47 && keycode < 58) || // any keys
        (keycode > 64 && keycode < 91) || // letter keys
        (keycode > 95 && keycode < 112) || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223) ||
        (keycode === 229)) // Allow android keyboard
      ) {
        this.keyUp.emit(this.textbox)
        this.itemsFilter = this.items.filter(x => (x[this.optValues] + '').toLowerCase().includes((this.textbox + '').toLowerCase()));
        this.index = -1;
        this.dropDown.nativeElement.scrollTop = 0;
      }
      // Manual search 
    // } else {
    //   this.itemsFilter = this.items.filter(x => (x[this.optValues] + '').toLowerCase().includes((this.textbox + '').toLowerCase()));

    // }

  }

  get multiselectLabel() {
    return this.items.filter(x => x.status).map(m => m[this.optValues]).join(',') || this.placeholder;
  }

  onClick(item = null) {
    const id = item || this.itemsFilter[this.index];
    if (id) {
      this.textbox = id[this.optValues];
      this.updateValue(id);
    }
    if (this.hidden === false) { this.index = -1; }
    if (!this.MultiSelect) { this.hidden = true; }
  }

  // Work On Multiselect
  onCheck() {
    let checkedVal = this.items.filter(x => x.status).map(m => m[this.optId]);
    // console.log('checked Val', checkedVal, typeof (checkedVal))
    if (checkedVal.length === 0) { checkedVal = null; }
    this.onChange(checkedVal);
    this.changed.emit(checkedVal);
  }
  // Allows Angular to update the model (value).
  // Update the model and changes needed for the view here.
  writeValue(value): void {
    if (this.MultiSelect == true) {
      this.multiSelectedItem = value || [];
      this.items.filter(x => {
        x.status = false;
        if (this.multiSelectedItem.includes(x[this.optId])) { x.status = true; }
        if (x[this.optValues] + ''.toLowerCase().includes((this.textbox + '').toLowerCase())) {
          return x
        }
      });

    } else {
      this.oldValue = value;
      this.setValueBasedOnID(value);
    }
  }
  // Allows Angular to register a function to call when the model (value) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  outSide(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.hidden = true
    }
  }
}
