import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAuth, IDepartmentInfo, ResponseAdd, UserInfo } from '../models/common';

@Injectable()
export class AuthService {

  // public host = 'http://api.techuni.lo/';
  public host = 'http://asu.techuni.tj/jxapi/';
  public token: string;

  public DEGREES = ['бакалавр', 'магистр', 'PhD'];
  public TYPES = [{
      name: 'рӯзона',
      id: 1
    },
    {
      name: 'ғоибона',
      id: 2
    },
    {
      name: 'фосилавӣ',
      id: 25
    },
    {
      name: 'магистратура',
      id: 135
    },
    {
      name: 'маълумоти дуюм',
      id: 136
    }];

  constructor(public http: HttpClient) {}

  checkUserSession(user: UserInfo): Observable<boolean> {

    const body = new HttpParams()
      .set('uid', user.userId.toString())
      .set('type', user.type)
      .set('time', user.time)
      .set('action', 'check')
      .set('route', 'authsess')
      .set('operation', 'custom');

    return this.http.post(this.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: IAuth) => {
        const token = response.data.token;
        if (token) {
          // set token property
          this.token = token;
          console.log(token);

          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({token: token }));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }));
  }

  getUserKafedra() {
    const body = new HttpParams()
      .set('route', 'authsess')
      .set('operation', 'one')
      .set('token', this.token);

    return this.http.post(this.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ResponseAdd) => {
      return response;
    }));
  }

  getDepartmentInfo(kfId: number) {
    const body = new HttpParams()
      .set('id', kfId.toString())
      .set('route', 'authsess')
      .set('operation', 'one')
      .set('token', this.token);

    return this.http.post(this.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: IDepartmentInfo) => {
      return response;
    }));
  }

  getToken(username: string, password: string): Observable<boolean> {
    return this.http.get(
      this.host + 'self.php?route=auth&operation=login&username=' + username + '&password=' + password
    ).pipe(map((response: IAuth) => {
      const token = response.data.hash;
      if (token) {
        // set token property
        this.token = token;
        console.log(token);

        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

        // return true to indicate successful login
        return true;
      } else {
        // return false to indicate failed login
        return false;
      }
    }));
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

}
