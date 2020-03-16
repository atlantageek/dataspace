import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { ContactComponent } from './contact/contact.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/detail/world', pathMatch: 'full'},
  {path: 'contacts' , component: ContactComponent},
  {path: 'detail/:id' , component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),MatSliderModule,],
  exports: [RouterModule]
})
export class AppRoutingModule { }
