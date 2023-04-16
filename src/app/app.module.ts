/**
 * Title: app.module.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: App module for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import statements
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeComponent } from "./pages/home/home.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { AboutComponent } from "./pages/about/about.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthLayoutComponent } from "./shared/auth-layout/auth-layout.component";
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
import { FlexLayoutModule } from "@angular/flex-layout";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

// Angular material imports
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { DragDropModule } from "@angular/cdk/drag-drop";

// primeNG imports
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { ConfirmDialogComponent } from "./shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

// Declaring list of components
@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		AuthLayoutComponent,
		BaseLayoutComponent,
		LoginComponent,
		ConfirmDialogComponent,
		ContactComponent,
		AboutComponent,
		NotFoundComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatDividerModule,
		MessageModule,
		MessagesModule,
		MatDialogModule,
		ConfirmDialogModule,
		ToastModule,
		MatCardModule,
		DragDropModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})

// Exporting module
export class AppModule {}
