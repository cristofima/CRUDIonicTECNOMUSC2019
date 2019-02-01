import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", loadChildren: "./auth/login/login.module#LoginPageModule" },
  {
    path: "register",
    loadChildren: "./auth/register/register.module#RegisterPageModule"
  },
  { path: "list", loadChildren: "./crud/list/list.module#ListPageModule" },
  {
    path: "create",
    loadChildren: "./crud/create/create.module#CreatePageModule"
  },
  { path: "edit/:id", loadChildren: "./crud/edit/edit.module#EditPageModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
