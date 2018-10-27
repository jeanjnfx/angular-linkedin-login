import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LinkedinService {
  private URL_LINKEDIN_LOGIN = 'http://linkedin-login-backend.herokuapp.com/auth/linkedin';
  private URL_LINKEDIN_LOGOUT = 'https://linkedin-login-backend.herokuapp.com/api/Users/logout';
  private URL_LINKEDIN_USER = 'https://linkedin-login-backend.herokuapp.com/api/UserIdentities/';

  constructor(private http: HttpClient) { }

  loginLinkedin() {
    return this.http.get(this.URL_LINKEDIN_LOGIN);
  }

  getLinkedinUser(userId: any) {
    return this.http.get(this.URL_LINKEDIN_USER + userId);
  }

  logoutLinkedin(token: any) {
    console.log('token', token);
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: token })
    };
    return this.http.post(this.URL_LINKEDIN_LOGOUT, {}, httpOptions);
  }
}
