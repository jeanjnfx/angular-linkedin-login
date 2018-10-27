import { Component, OnInit } from '@angular/core';
import { LinkedinService } from 'src/app/linkedin/linkedin.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public navbarOpen = false;
  public loading = false;

  constructor(private linkedinService: LinkedinService) { }

  ngOnInit() {
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logOut() {
    this.loading = true;
    this.linkedinService.logoutLinkedin(localStorage.getItem('token')).subscribe(
      resp => {
        this.refreshAll();
        this.loading = false;
      },
      err => {
        console.error('ERROR =>', err);
        this.refreshAll();
        this.loading = false;
      }
    );
  }

  private refreshAll() {
    localStorage.removeItem('token');
    window.open(window.location.origin, '_self');
  }

}
