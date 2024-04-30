import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AutoCompleteComponent } from './auto-complete';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    AutoCompleteComponent
  ],
  exports: [AutoCompleteComponent],
  schemas : [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AutoCompleteModule {
}