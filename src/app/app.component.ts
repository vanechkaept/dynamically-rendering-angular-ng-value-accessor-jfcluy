import { Component, VERSION } from "@angular/core";

@Component({
  selector: "my-app",
  template: `
    <form>
      <app-form-control-outlet [(ngModel)]="value" name="formOutletInput">
      </app-form-control-outlet>
    </form>

    <div>Value: {{ value }}</div>
  `
})
export class AppComponent {
  public value: string;
}
