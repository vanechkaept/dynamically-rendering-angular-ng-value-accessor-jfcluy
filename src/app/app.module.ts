import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { FormControlOutletComponent } from "./form-control-outlet.component";
import { CustomInputComponent } from "./custom-input.component";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    FormControlOutletComponent,
    CustomInputComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
