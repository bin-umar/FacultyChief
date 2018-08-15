import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ITeacher, Teacher } from '../models/load';
import { ICoefficient, SettingsResp } from '../models/settings';
import { Department, IDepartment } from '../models/common';

@Injectable()
export class SettingsService {

  coefs: ICoefficient;
  kafedras: Department[] = [];

  constructor(private auth: AuthService) { }

  getLoadCoefficients() {
    const body = new HttpParams()
      .set('source', 'loadCfs')
      .set('route', 'settings')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post<SettingsResp>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(resp => {
        if (!resp.error) {
          this.coefs = new ICoefficient(resp.data);
        }
    }, (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  getKafedraByFacultyId(fcId: number) {
    const body = new HttpParams()
      .set('id', fcId.toString())
      .set('route', 'kafedra')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: IDepartment) => {
      return response;
    })).subscribe(resp => {
      if (!resp.error) {
        this.kafedras = resp.data.slice();
        this.kafedras.unshift( {
          id: -1,
          fullName: '',
          shortName: '',
          chief: ''
        });
      }
    });
  }

  getTeachersByKf (kfId: number) {
    const body = new HttpParams()
      .set('kf_id', kfId.toString())
      .set('route', 'teachers')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ITeacher) => {
      return response;
    }));
  }
}
