import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { AuthLayoutComponent } from "./shared/auth-layout/auth-layout.component";
import { LoginComponent } from "./pages/login/login.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
	{
		path: "",
		component: BaseLayoutComponent,
		children: [
			{
				path: "",
				component: HomeComponent,
				canActivate: [AuthGuard],
			},
			{
				path: "about",
				component: AboutComponent,
				canActivate: [AuthGuard],
			},
			{
				path: "contact",
				component: ContactComponent,
				canActivate: [AuthGuard],
			},
		],
	},
	{
		path: "session",
		component: AuthLayoutComponent,
		children: [
			{
				path: "login",
				component: LoginComponent,
			},
		],
	},
	{
		path: "**",
		component: BaseLayoutComponent,
		children: [
			{
				path: "",
				component: NotFoundComponent,
			},
		],
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			useHash: true,
			enableTracing: false,
			scrollPositionRestoration: "enabled",
			relativeLinkResolution: "legacy",
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
