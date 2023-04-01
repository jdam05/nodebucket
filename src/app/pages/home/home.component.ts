import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

import { FormBuilder } from "@angular/forms";
import { Message } from "primeng/api";
import { Employee } from "src/app/shared/models/employee.interface";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	serverMessages: Message[] = [];

	constructor() {}

	ngOnInit(): void {}
}
