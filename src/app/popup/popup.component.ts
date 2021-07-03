import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PopupService } from './../services/popup.service';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() data: any;
  private element: any;

  constructor(
    private popupService: PopupService,
    private el: ElementRef
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    // move element to bottom of page (just before </body>) so it can be displayed above everything else


    if (document.getElementById('colonyRef')) {
      document.getElementById('colonyRef').appendChild(this.element);
    }
    else if (document.getElementById('foodRef')) {
      document.getElementById('foodRef').appendChild(this.element);
    }

    if (this.element.classList[0] === 'counter-popup') {
      document.getElementById('counterRef').appendChild(this.element);
    }
    else if (this.element.classList[0] === 'food-popup') {
      document.getElementById('foodRef').appendChild(this.element);
    }

    console.log('DATA', this.data[0]);

    // close modal on background click
    this.element.addEventListener('click', el => {
    if (el.target.className === 'app-popup') {
      this.close();
    }});

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.popupService.add(this);
  }

  ngOnDestroy(): void {
    this.popupService.remove(this.id);
    this.element.remove();
}

  // open modal
  open(): void {
    this.element.style.display = 'flex';
    document.body.classList.add('app-popup-open');
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('app-popup-open');
  }

}
