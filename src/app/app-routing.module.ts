import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NestedFormComponent } from './nested-form/nested-form.component';


const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // },
  { path: '', component: NestedFormComponent }
  // {
  //   path: 'demo',
  //   component: DemoComponent
  // },
  // {
  //   path: 'user-profile',
  //   component: UserProfileComponent
  // },
  // {
  //   path: 'applications',
  //   component: ApplicationsComponent
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
