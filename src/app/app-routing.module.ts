/**
 * Title: app-routing-module.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: Routing module for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import statements
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

// Defining routes
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

// Configuring router module
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

// Exporting module
export class AppRoutingModule {}
