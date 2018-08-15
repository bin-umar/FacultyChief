import { Load, Teacher } from './load';
import { ICoefficient } from './settings';

export interface ISection {
  id: number;
  groups: string[];
  studentsAmount: number;
  idSection: number;
  section: string;
  hour: number;
  idTeacher: string;
  isTeacherSaved: boolean;
}

export interface ICWServers {
  id: number;
  idLdSubject: number;
  studentsAmount: number;
  idTeacher: number;
}

export interface ICWServersResp {
  error: boolean;
  data: [ICWServers];
}

export interface ISectionCW {
  id: number;
  hour: number;
  studentsAmount: number;
  idTeacher: string;
  isTeacherSaved: boolean;
}

export interface ICourseWorks {
  id: number;
  subjectName: string;
  term: number;
  course: number;
  degree: string;
  type: string;
  hour: number;
  group: string;
  studentsAmount: number;
  idSection: number;
  section: string;
  sections: ISectionCW[];
}

export class CourseWorks {
  private subject: ICourseWorks = {
    id: null,
    subjectName: null,
    term: null,
    course: null,
    degree: null,
    type: null,
    hour: null,
    group: null,
    studentsAmount: null,
    idSection: null,
    section: null,
    sections: []
  };

  constructor(private dbSubject: IDistribution,
              private idLoadSubject: number,
              private teachers: Teacher[],
              private cwServer: ICWServers[],
              private coefs: ICoefficient) {

    const ndSection = this.getNeededSection(this.dbSubject.sections, this.idLoadSubject);

    this.subject.id = +ndSection.id;
    this.subject.subjectName = this.dbSubject.subjectName;
    this.subject.term = this.dbSubject.term;
    this.subject.course = this.dbSubject.course;
    this.subject.degree = this.dbSubject.degree;
    this.subject.type = this.dbSubject.type;
    this.subject.section = ndSection.section;
    this.subject.idSection = +ndSection.idSection;
    this.subject.hour = +ndSection.hour;
    this.subject.group = ndSection.groups[0];
    this.subject.studentsAmount = +ndSection.studentsAmount;

    this.cwServer.forEach(o => {

      let hour: number;
      if (this.subject.idSection === 1) { hour = +o.studentsAmount * this.coefs.courseWork;
      } else if (this.subject.idSection === 2) { hour = +o.studentsAmount * this.coefs.courseProject; }

      let teacher = this.teachers.find(x => +x.id === +o.idTeacher);
      if (teacher === undefined) { teacher = this.teachers[0]; }

      this.subject.sections.push({
        id: o.id,
        hour: hour,
        studentsAmount: +o.studentsAmount,
        idTeacher: teacher.fio,
        isTeacherSaved: !(teacher.fio === '')
      });
    });

  }

  private getNeededSection(sections: ISection[], idLoadSubject: number) {
    return sections.find(o => o.id === idLoadSubject);
  }

  public getSubject() {
    return this.subject;
  }
}

export interface IDistribution {
  subjectName: string;
  term: number;
  course: number;
  degree: string;
  type: string;
  sections: ISection[];
}

export class Distribution {

  private realSubjects: IDistribution[] = [];
  private arrNewIds = new Set<string>();

  constructor(private loadSubjects: Load[],
              private teachers: Teacher[],
              private coefs: ICoefficient) {

    loadSubjects.forEach((item, id, array) => {
      if (+item.idGroup > 0) {
        const mainSubject = array.find(o => +o.id === +item.idGroup);

        if (mainSubject !== undefined) {
          array.filter(o => o.newId === item.newId && +o.id !== item.id)
            .forEach(o => {
              o.newId = mainSubject.newId;
              this.arrNewIds.add(mainSubject.newId);
            });
        }

      } else  {
        this.arrNewIds.add(item.newId);
      }
    });

    this.combineSubjects();
  }

  private combineSubjects() {
    this.arrNewIds.forEach(id => {
      const subject: IDistribution = {
        subjectName: null,
        term: null,
        course: null,
        degree: null,
        type: null,
        sections: []
      };

      const ldSubject = this.loadSubjects.filter(o => o.newId === id);
      ldSubject.forEach((o, index, array) => {

          if (index === 0) {
            subject.degree = o.degree;
            subject.type = o.type;
            subject.course = o.course;
            subject.term = o.term;
            subject.subjectName = o.subjectName;
          }

          let teacher = this.teachers.find(x => +x.id === +o.idTeacher);
          if (teacher === undefined) { teacher = this.teachers[0]; }

          switch (+o.idSection) {
            case 1: case 2: {
              let hour: number;
              if (+o.idSection === 1) { hour = +o.studentsAmount * this.coefs.courseWork;
              } else if (+o.idSection === 2) { hour = +o.studentsAmount * this.coefs.courseProject;
              } else { hour = +o.hour; }

              subject.sections.push({
                id: +o.id,
                groups: Array.of(o.group),
                studentsAmount: o.studentsAmount,
                idSection: +o.idSection,
                section: o.section,
                hour: +o.hour,
                idTeacher: o.idTeacher,
                isTeacherSaved: null
              });
            } break;
            case 4: {
              if (o.newId === (o.idExSubject + o.group)) {
                const groupInfo = this.findGroups(array);

                subject.sections.push({
                  id: +o.id,
                  groups: groupInfo.groups,
                  studentsAmount: groupInfo.studentsAmount,
                  idSection: +o.idSection,
                  section: o.section,
                  hour: +o.hour,
                  idTeacher: teacher.fio,
                  isTeacherSaved: !(teacher.fio === '')
                });
              }
            } break;
            default: {

              subject.sections.push({
                id: +o.id,
                groups: Array.of(o.group),
                studentsAmount: o.studentsAmount,
                idSection: +o.idSection,
                section: o.section,
                hour: +o.hour,
                idTeacher: teacher.fio,
                isTeacherSaved: !(teacher.fio === '')
              });
            } break;
          }
        });

      if (ldSubject.length !== 0) {
        this.realSubjects.push(subject);
      }
    });
  }

  public getSubjects() {
    return this.realSubjects;
  }

  private findGroups(subjects: Load[]) {

    const groups: string[] = [];
    let studentsAmount = 0;

    subjects.forEach(subject => {
      if (groups.indexOf(subject.group) === -1) {
        groups.push(subject.group);
        studentsAmount += +subject.studentsAmount;
      }
    });

    return {
      groups: groups,
      studentsAmount: studentsAmount
    };
  }
}
