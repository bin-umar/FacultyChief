import { Component, Input, OnInit, Output } from '@angular/core';
import { LoadKafService } from '../../services/load-kaf.service';
import { AuthService} from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

import { Teacher } from '../../models/load';
import { ILoadKafSubject, LoadKaf, LoadKafReport } from '../../models/load-kaf';
import { Department, DepartmentInfo, TypesOfStudying } from '../../models/common';

@Component({
  selector: 'app-teacher-load',
  templateUrl: './teacher-load.component.html',
  styleUrls: ['../extraction/extraction.component.css'],
  providers: [ LoadKafService ]
})

export class TeacherLoadComponent implements OnInit {

  @Output() cmpName: any = 'Сарбории омӯзгорони кафедра';
  @Input() depInfo: DepartmentInfo;

  today: number = Date.now();

  kafedra: Department = {
    id: null,
    shortName: '',
    fullName: '',
    chief: ''
  };

  faculty = this.kafedra;
  teachers: Teacher[] = [];
  selectedTeacher: Teacher = {
    id: 0,
    fio: '',
    position: '',
    scienceDegree: '',
    v1: null,
    v2: null,
    v3: null
  };

  teacherLoad = {
    total: null,
    workRate: null,
    kmro: null
  };

  subjects: ILoadKafSubject[] = [];
  kafedras: Department[] = [];

  constructor(private lkService: LoadKafService,
              private stService: SettingsService,
              private auth: AuthService) {
    this.kafedras = this.stService.kafedras;
  }

  ngOnInit() {
    this.kafedra = {
      id: +this.depInfo.kfId,
      fullName: this.depInfo.kfFullName,
      shortName: this.depInfo.kfShortName,
      chief: this.depInfo.kfChief,
      chiefPosition: this.depInfo.kfChiefPosition
    };

    this.faculty = {
      id: +this.depInfo.fcId,
      fullName: this.depInfo.fcFullName,
      shortName: this.depInfo.fcShortName,
      chief: this.depInfo.fcChief
    };
  }

  selectTeacher() {
    this.subjects = [];

    this.lkService.getTeacherReport(this.selectedTeacher.id, this.depInfo.kfId).subscribe(resp => {
      if (!resp.error) {

        this.lkService.getTeacherCourseWorks(this.selectedTeacher.id, this.depInfo.kfId).subscribe(response => {
          if (!response.error) {

            const subjects: LoadKaf[] = [...resp.data, ...response.data];

            subjects.forEach(subject => {
              subject.newId = subject.idExSubject + subject.group;
              subject.degree = this.auth.DEGREES[+subject.degree];
            });

            const teacherLoad = new LoadKafReport(subjects, this.lkService.coefs, true);
            this.subjects = teacherLoad.getSubjects();
            this.countTeacherLoad();
          }
        });
      }
    });
  }

  getContentByKfId() {
    this.stService.getTeachersByKf(this.kafedra.id).subscribe(resp => {
      if (!resp.error) {
        this.teachers = resp.data.slice();
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

  countTeacherLoad() {
    const teacher = this.selectedTeacher;
    const total = this.sum('total');
    let v = 0;

    if (total !== 0) {

      const scienceDegree = teacher.scienceDegree
                                  .split( ' ')
                                  .filter(o => o !== '')
                                  .join('').toLowerCase();

      switch (scienceDegree) {
        case 'надорад': v = +teacher.v1; break;
        case 'номзадиилм': v = +teacher.v2; break;
        case 'докториилм': v = +teacher.v3; break;
        case 'узвивобастаиаиҷт': v = 432; break;
        case 'академикиаиҷт': v = 360; break;
      }

      this.teacherLoad.workRate = +(total / v).toFixed(2);
      this.teacherLoad.total = total;
      this.teacherLoad.kmro = +((total * 240) / v).toFixed(2);

    } else {
      this.teacherLoad.workRate = null;
      this.teacherLoad.total = null;
      this.teacherLoad.kmro = null;
    }
  }

  print(): void {
    window.print();
  }

}
