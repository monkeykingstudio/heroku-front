import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupComponent } from './popup.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PopupComponent],
    exports: [PopupComponent]
})
export class PopupModule { }
