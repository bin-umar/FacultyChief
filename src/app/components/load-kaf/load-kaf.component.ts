import { Component, Input, OnInit, Output } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { LoadKafService } from '../../services/load-kaf.service';

import { Department, DepartmentInfo, TypesOfStudying } from '../../models/common';
import { ILoadKafSubject, LoadKaf, LoadKafReport } from '../../models/load-kaf';

@Component({
  selector: 'app-load-kaf',
  templateUrl: './load-kaf.component.html',
  styleUrls: ['../extraction/extraction.component.css'],
  providers: [ LoadKafService ]
})

export class LoadKafComponent implements OnInit {

  @Output() cmpName: any = 'Сарбории кафедра';
  @Input() depInfo: DepartmentInfo;

  kafedra: Department = {
    id: null,
    shortName: '',
    fullName: '',
    chief: ''
  };

  faculty = this.kafedra;
  kafedras: Department[] = [];
  subjects: ILoadKafSubject[] = [];
  isError = false;

  constructor(private auth: AuthService,
              private lkService: LoadKafService) {
    this.kafedras = this.lkService.kafedras;
  }

  ngOnInit() {
    this.kafedra = {
      id: this.depInfo.kfId,
      fullName: this.depInfo.kfFullName,
      shortName: this.depInfo.kfShortName,
      chief: this.depInfo.kfChief
    };

    this.faculty = {
      id: this.depInfo.fcId,
      fullName: this.depInfo.fcFullName,
      shortName: this.depInfo.fcShortName,
      chief: this.depInfo.fcChief
    };

  }

  getContentByKfId() {
    this.lkService.getLoadKafReport(this.kafedra.id).subscribe(resp => {
      if (!resp.error) {

        const subjects: LoadKaf[] = resp.data.slice();

        subjects.forEach(subject => {
          subject.newId = subject.idExSubject + subject.group;
          subject.degree = this.auth.DEGREES[+subject.degree];
        });

        const loadKafReport = new LoadKafReport(subjects, this.lkService.coefs);
        this.subjects = loadKafReport.getSubjects();
        this.isError = loadKafReport.isErrorSubject();
      }
    });
  }

  rowAmount(amount: number): number[] {
    return Array.from(Array(amount).keys());
  }

  getSubjects(term: number, typeS: number, fcId: number): ILoadKafSubject[] {
    return this.subjects.filter(o => (
      o.term === term && +o.type === typeS && +o.fcId === fcId
    ));
  }

  getTypesByTerm(term: number): TypesOfStudying[] {
    const types: TypesOfStudying[] = [];

    this.subjects.filter(o => o.term === term)
      .forEach(o => {
      const i = types.findIndex(t => t.id === +o.type);
      if (i === -1) {
        types.push(this.auth.TYPES.find(t => t.id === +o.type));
      }
    });

    return types;
  }

  getFacultiesByType(typeS: number, term: number): Department[] {
    const faculties: Department[] = [];

    this.subjects.filter(o => (+o.type === typeS) && (+o.term === term))
      .forEach(o => {
        const i = faculties.findIndex(fc => fc.id === +o.fcId);
        if (i === -1) {
          faculties.push({
            id: +o.fcId,
            shortName: o.fcName,
            fullName: o.fcName,
            chief: ''
          });
        }
      });

    return faculties;
  }

  sum(prop: string, term?: number, typeS?: number) {
    let sum = 0;
    let subjects: ILoadKafSubject[];

    if (term) {
      if (typeS) {
        subjects = this.subjects.filter(o => +o.type === typeS && +o.term === term);
      } else {
        subjects = this.subjects.filter(o => +o.term === term);
      }
    } else {
      subjects = this.subjects;
    }

    subjects.forEach(item => {
      switch (prop) {
        case 'lkTotal': sum += +item.lecture.total; break;
        case 'lbTotal': sum += +item.laboratory.total; break;
        case 'prTotal': sum += +item.practical.total; break;
        case 'smTotal': sum += +item.seminar.total; break;
        case 'kmroTotal': sum += +item.kmro.total; break;
        case 'advice': sum += +item.advice; break;
        case 'prac': sum += +item.practices; break;
        case 'diploma': sum += +item.diploma; break;
        case 'gosExam': sum += +item.gosExam; break;
        case 'total': sum += +item.total; break;
        case 'cw': sum += +item.courseWork; break;
        case 'cp': sum += +item.courseProject; break;
        case 'wk': sum += +item.workKont; break;
        case 'exam': sum += +item.exam; break;
        case 'tAH': sum += +item.totalAuditHour; break;
        case 'checkout': sum += +item.checkout; break;
      }
    });

    return +sum.toFixed(2);
  }

  print() {
    window.print();
  }
}
