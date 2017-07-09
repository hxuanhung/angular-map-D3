import { Component } from '@angular/core';

@Component({
  selector: 'kd-devtools',
  template: `
    <ngrx-store-log-monitor toggleCommand="shift-h"></ngrx-store-log-monitor>
  `,
})
export class DevtoolsComponent { }
