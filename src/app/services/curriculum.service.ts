import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import { CurriculumList, ICurriculumList } from '../models/curriculum';

@Injectable()
export class CurriculumService {

  dataChange: BehaviorSubject<CurriculumList[]> = new BehaviorSubject<CurriculumList[]>([]);

  get data(): CurriculumList[] {
    return this.dataChange.value;
  }

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {
  }

  getAllCurriculums(fc_id: number): void {
    const body = new HttpParams()
      .set('fc_id', fc_id.toString())
      .set('route', 'extractions')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post<ICurriculumList>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(response => {
        const curriculums: CurriculumList[] = [];
        response.data.forEach( (item, i) => {
          curriculums.push({
            id: item.id,
            number: i + 1,
            idSpec: +item.idSpec,
            speciality: item.speciality,
            course: item.course,
            degree: this.auth.DEGREES[+item.degree],
            type: this.auth.TYPES.find(o => o.id === +item.type).name,
            educationYear: item.educationYear,
            idStandard: item.idStandard,
            dateOfStandard: item.dateOfStandard,
            locked: +item.locked
          });
        });

        this.dataChange.next(curriculums);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }
}
