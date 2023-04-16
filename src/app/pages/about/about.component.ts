/**
 * Title: about.component.ts
 * Date: April 14, 2023
 * Author: Jamal Eddine Damir
 * Description: about component for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import Component object
import { Component, OnInit } from "@angular/core";

// Defining component metadata
@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.css"],
})

// Component class definition
export class AboutComponent implements OnInit {
	// Page title
	title = "About Us";

	constructor() {}

	ngOnInit(): void {}
}
