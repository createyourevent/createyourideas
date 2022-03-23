import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ApplicationComponent } from "./application.component";
import { ApplicationRoutes } from "./application.routing";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ApplicationRoutes
  ],
  declarations: [ApplicationComponent]
})
export class ApplicationModule { }
