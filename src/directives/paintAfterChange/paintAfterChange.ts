import {Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";

/**
 * Generated class for the paintAfterChange directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[paintAfterChange]' // Attribute selector
})
export class paintAfterChange implements OnChanges, OnDestroy {


  @Input() changer: any;
  @Input() activityLength: any;
  static number: number = 0;
  interval: any;

  constructor(private elRef: ElementRef,
              private renderer: Renderer2,
              private userService: UserService) {
  }

  ngOnChanges() {
    let isCurrentUser: boolean = false;
    this.changer.consumer_id == this.userService.thisProfile.keyForFirebase ? isCurrentUser = true : '';
    paintAfterChange.number++;
    if (paintAfterChange.number == this.activityLength && !isCurrentUser) {
      paintAfterChange.number = 0;
      this.renderer.addClass(this.elRef.nativeElement, 'highLight');
      this.interval = setTimeout(() => {
        this.renderer.removeClass(this.elRef.nativeElement, 'highLight');
      }, 5000); //5 seconds
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.interval);
  }
}
