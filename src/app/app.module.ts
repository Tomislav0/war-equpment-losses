import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineChartComponent } from './bar-chart/line-chart.component';
import { DevExtremeModule, DxButtonModule, DxDataGridModule, DxDropDownBoxModule,DxCheckBoxModule, DxDateBoxModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxDateBoxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
