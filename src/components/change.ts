import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'cmp',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `Number of ticks: {{numberOfTicks}}`
  })
  class Cmp {
    numberOfTicks = 0;
  
    constructor(private ref: ChangeDetectorRef) {
      setInterval(() => {
        this.numberOfTicks++;
        // the following is required, otherwise the view will not be updated
        this.ref.markForCheck();
      }, 1000);
    }
  }