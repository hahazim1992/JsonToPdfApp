import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfComponent } from './pdf/pdf.component';

const routes: Routes = [
  { path: '', component: PdfComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
