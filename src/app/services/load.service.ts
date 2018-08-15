import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { SettingsService } from './settings.service';

import { ILoad, Teacher } from '../models/load';
import { IDepartment, ResponseAdd, UpdateResponse } from '../models/common';
import { ICoefficient } from '../models/settings';
import { ICWServers, ICWServersResp } from '../models/distribution';

@Injectable()
export class LoadService {

  coefs: ICoefficient;
  teachers: Teacher[];
  constructor(private auth: AuthService,
              private stService: SettingsService) {
    this.coefs = this.stService.coefs;
    this.teachers = this.stService.teachers;
  }

  getLoadSubjectsByKf (kfId: number) {
    const body = new HttpParams()
      .set('kf_id', kfId.toString())
      .set('route', 'ldSubjects')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoad) => {
      return response;
    }));
  }

  saveTeacherId (idTeacher: number, idSubject: number) {
    const body = new HttpParams()
      .set('idTeacher', idTeacher.toString())
      .set('idSubject', idSubject.toString())
      .set('route', 'ldSubjects')
      .set('operation', 'update')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: UpdateResponse) => {
      return response;
    }));
  }

  deleteTeacherId (idSubject: number) {
    const body = new HttpParams()
      .set('id', idSubject.toString())
      .set('route', 'ldSubjects')
      .set('operation', 'remove')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: UpdateResponse) => {
      return response;
    }));
  }

  getFacultyList() {
    const body = new HttpParams()
      .set('route', 'fc')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: IDepartment) => {
      return response;
    }));
  }

  getKafedraByFacultyId(fcId: number) {
    const body = new HttpParams()
      .set('id', fcId.toString())
      .set('route', 'kafedra')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: IDepartment) => {
      return response;
    }));
  }

  getCourseWorks(idLoadSubject: number) {
    const body = new HttpParams()
      .set('idLoadSubject', idLoadSubject.toString())
      .set('route', 'ldCworks')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ICWServersResp) => {
      return response;
    }));
  }

  deleteCW(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'ldCworks')
      .set('operation', 'remove')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: UpdateResponse) => {
      return response;
    }));
  }

  addCW(subject: ICWServers) {
    const body = new HttpParams()
      .set('idLdSubject', subject.idLdSubject.toString())
      .set('studentsAmount', subject.studentsAmount.toString())
      .set('idTeacher', subject.idTeacher.toString())
      .set('route', 'ldCworks')
      .set('operation', 'insert')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ResponseAdd) => {
      return response;
    }));
  }

}
