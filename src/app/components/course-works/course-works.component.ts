import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { ICourseWorks, ICWServers, ISectionCW } from '../../models/distribution';
import { Teacher } from '../../models/load';
import { ICoefficient } from '../../models/settings';

import { SettingsService } from '../../services/settings.service';
import { LoadService } from '../../services/load.service';

@Component({
  selector: 'app-course-works',
  templateUrl: './course-works.component.html',
  styleUrls: ['./course-works.component.css'],
  providers: [ LoadService ]
})

export class CourseWorksComponent {

  newSection: ISectionCW = {
    id: 0,
    hour: null,
    studentsAmount: 0,
    idTeacher: null,
    isTeacherSaved: false
  };

  teachers: Teacher[];
  coefs: ICoefficient;
  sections: ISectionCW[];

  constructor(public dialogRef: MatDialogRef<CourseWorksComponent>,
              private loadService: LoadService,
              private stService: SettingsService,
              public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: ICourseWorks) {
    this.teachers = this.stService.teachers;
    this.coefs = this.stService.coefs;
    this.sections = this.data.sections.slice();
  }

  setHours() {
    if (this.data.idSection === 1) {
      this.newSection.hour = this.newSection.studentsAmount * this.coefs.courseWork;
    } else {
      this.newSection.hour = this.newSection.studentsAmount * this.coefs.courseProject;
    }
  }

  leftOverStudents(): number {
    let l = this.data.studentsAmount;
    this.data.sections.forEach(o => { l -= +o.studentsAmount; });
    return l;
  }

  deleteSection(id: number) {
    const i = this.data.sections.findIndex(o => o.id === id);
    this.data.sections.splice(i, 1);
  }

  addSection() {
    if ((this.newSection.idTeacher !== '' && this.newSection.idTeacher !== null)
        && (this.newSection.studentsAmount !== 0)) {
      this.data.sections.push(Object.assign({}, this.newSection));
      this.newSection.studentsAmount = 0;
    }
  }

  submit() {
    if (this.leftOverStudents() === 0 || this.data.sections.length === 0) {

      this.sections.forEach(s => {
        const i = this.data.sections.findIndex(o => +o.id === +s.id);
        // removable
        if (i === -1) {

          this.loadService.deleteCW(s.id).subscribe(resp => {
              if (!resp.error) {
                this.snackBar.open('Бо муваффақият хориҷ шуд', '', { duration: 1000 });

                if (this.data.sections.length === 0) { this.onNoClick(0); }
              }
          });
        }
      });


      this.data.sections.forEach(s => {
        const i = this.sections.findIndex(o => +o.id === +s.id);
        // insertable
        if (i === -1) {
          const subject: ICWServers = {
            id: s.id,
            idLdSubject: this.data.id,
            studentsAmount: s.studentsAmount,
            idTeacher: this.teachers.find(x => x.fio === s.idTeacher).id
          };

          this.loadService.addCW(subject).subscribe(resp => {
            if (!resp.error) {
              this.snackBar.open('Бо муваффақият сабт шуд', '', { duration: 1000 });
              this.onNoClick(1);
            }
          });
        }
      });


    } else {
      this.snackBar.open('Ҳамаи донишҷӯён тақсим нашудаанд',
        '',  { duration: 3000 });
    }
  }

  onNoClick(arg?: number): void { this.dialogRef.close(arg); }

}
