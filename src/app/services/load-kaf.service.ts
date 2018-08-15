import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { SettingsService } from './settings.service';

import { ILoadKaf } from '../models/load-kaf';
import { ICoefficient } from '../models/settings';
import { Department } from '../models/common';

@Injectable()
export class LoadKafService {

  coefs: ICoefficient;
  kafedras: Department[] = [];

  constructor(private auth: AuthService,
              private stService: SettingsService) {
    this.coefs = this.stService.coefs;
    this.kafedras = this.stService.kafedras;
  }

  public getLoadKafReport(kf_id: number) {
    const body = new HttpParams()
      .set('kf_id', kf_id.toString())
      .set('route', 'ldReports')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoadKaf) => {
      return response;
    }));
  }

  public getTeacherReport(teacher_id: number) {
    const body = new HttpParams()
      .set('teacher_id', teacher_id.toString())
      .set('route', 'ldReports')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoadKaf) => {
      return response;
    }));
  }

  public getTeacherCourseWorks(teacher_id: number) {
    const body = new HttpParams()
      .set('teacher_id', teacher_id.toString())
      .set('route', 'ldCworks')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoadKaf) => {
      return response;
    }));
  }
}
