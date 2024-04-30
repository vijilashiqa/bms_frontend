import { Component } from '@angular/core';

import './ckeditor.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-ckeditor',
  template: `
    <nb-card>
      <nb-card-header>
        CKEditor
      </nb-card-header>
      <nb-card-body>
      <p> demo </p>
      </nb-card-body>
    </nb-card>
  `,
})
export class CKEditorComponent {
}
