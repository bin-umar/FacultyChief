import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ITeacher, Teacher } from '../models/load';
import { ICoefficient, SettingsResp } from '../models/settings';

@Injectable()
export class SettingsService {

  coefs: ICoefficient;
  teachers: Teacher[];
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

  getTeachersByKf (kfId: number) {
    const body = new HttpParams()
      .set('kf_id', kfId.toString())
      .set('route', 'teachers')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ITeacher) => {
      return response;
    })).subscribe(response => {

      if (!response.error) {
        this.teachers = response.data.slice();
        this.teachers.unshift({
          id: 0,
          fio: '',
          position: '',
          scienceDegree: '',
          v1: null,
          v2: null,
          v3: null
        });
      }

    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }
}
