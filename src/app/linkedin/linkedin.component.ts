import { Component, OnInit } from '@angular/core';
import { LinkedinService } from 'src/app/linkedin/linkedin.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-linkedin',
  templateUrl: './linkedin.component.html',
  styleUrls: ['./linkedin.component.scss'],
  providers: [LinkedinService]
})
export class LinkedinComponent implements OnInit {
  /**
   * Efecto de carga
   */
  public loading = false;
  /**
   * URL actual en el navegador
   */
  public currentURL: any;
  /**
   * Modelo de datos del usuario tras haber realizado login
   */
  public USER_DATA = {
    isLoggedIn: false,
    token: null,
    userId: null
  };
  /**
   * Perfil del usuario
   */
  public USER_PROFILE: any;
  /**
   * Constante auxiliar para la validación de URL
   */
  public VALIDATOR_URL = {
    token: 'access-token=',
    id: 'user-id='
  };

  constructor(
    public linkedinService: LinkedinService,
    public ngZone: NgZone
  ) {
    this.currentURL = window.location.href || '';
    try {
      if (this.currentURL.includes(this.VALIDATOR_URL.token)) {
        const INFO = this.currentURL.substring(this.currentURL.indexOf(this.VALIDATOR_URL.token) +
        this.VALIDATOR_URL.token.length).split('&');
        this.USER_DATA.token = INFO[0];
        localStorage.setItem('token', this.USER_DATA.token);
        this.USER_DATA.userId = INFO[1].substring(this.VALIDATOR_URL.id.length);
      }
      // console.log(this.USER_DATA);
      if (this.USER_DATA.userId != null) {
        this.USER_DATA.isLoggedIn = true;
        this.getUserData();
      }
    } catch (err) {
      this.currentURL = null;
    }
  }

  ngOnInit() {
  }

  public login() {
    this.loading = true;
    window.open('http://linkedin-login-backend.herokuapp.com/auth/linkedin', '_self');
    this.loading = false;
  }

  public getUserData() {
    this.loading = true;
    this.USER_PROFILE = {
      photo: null,
      name: null,
      description: null,
      occupation: null
    };
    this.linkedinService.getLinkedinUser(this.USER_DATA.userId).subscribe(
      (resp: any) => {
        console.log('RESPONSE => ', resp);
        const RESPONSE = resp.profile._json;
        // resp = TEMP; // TEMPORAL
        this.USER_PROFILE = {
          photo: RESPONSE.pictureUrl || null,
          name: RESPONSE.formattedName,
          description: RESPONSE.summary,
          occupation: RESPONSE.headline,
          location: RESPONSE.location.name
        };
        this.loading = false;
      },
      err => {
        console.error('ERROR => ', err);
        this.USER_DATA.isLoggedIn = false;
        this.loading = false;
      }
    );
  }

  public logoutLinkedin() {
    this.loading = true;
    this.linkedinService.logoutLinkedin(localStorage.getItem('token')).subscribe(
      resp => {
        this.USER_DATA.isLoggedIn = false;
        localStorage.removeItem('token');
        this.loading = false;
      },
      err => {
        console.error('ERROR =>', err);
        localStorage.removeItem('token');
        this.USER_DATA.isLoggedIn = false;
        this.loading = false;
      }
    );
  }
}
