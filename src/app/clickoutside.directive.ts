import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective {

  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      console.log('outside click xx');
      this.clickOutside.emit();
    }
  }

}
