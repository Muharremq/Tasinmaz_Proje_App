import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;
  loggedIn: boolean = false;
  currentTitle: string = "Mevcut Taşınmazlar Listesi";

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.routerState.root.snapshot.firstChild;
        if (currentRoute && currentRoute.data["title"]) {
          this.currentTitle = currentRoute.data["title"];
        }
      });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loggedIn = this.authService.loggedIn();

    const currentRoute = this.router.routerState.root.snapshot.firstChild;
    if (currentRoute && currentRoute.data["title"]) {
      this.currentTitle = currentRoute.data["title"];
    }
  }

  logOut() {
    if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      this.authService.logOut();
      this.router.navigate(["/login"]);
    }
  }
}
