import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { NestedFormComponent } from './nested-form/nested-form.component';
import { DataService } from './data.service';
import { UsersTableComponent } from './nested-form/users/users-table.component';

const routes: Routes = [
  { path: '', component: NestedFormComponent }, // Route to your component
];

@NgModule({
  declarations: [
    AppComponent,
    NestedFormComponent,
    UsersTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    // UsersTableComponent
],
  exports: [RouterModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
