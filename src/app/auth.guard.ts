/**
 * Title: auth.guard.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: Auth guard for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import statements
import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	RouterStateSnapshot,
	UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private cookieService: CookieService) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		const sessionUser = this.cookieService.get("session_user");
		if (sessionUser) {
			return true;
		} else {
			this.router.navigate(["/session/login"]);
			return false;
		}
		return true;
	}
}
