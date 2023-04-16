/**
 * Title: about.component.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: contact component for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import Component object
import { Component, OnInit } from "@angular/core";

// Defining component metadata
@Component({
	selector: "app-contact",
	templateUrl: "./contact.component.html",
	styleUrls: ["./contact.component.css"],
})

// Component class definition
export class ContactComponent implements OnInit {
	title = "Contact Us";

	constructor() {}

	ngOnInit(): void {}
}
