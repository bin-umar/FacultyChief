export interface Degree {
  exam: number;
  practice: number;
  graduateWork: number;
}

export class ICoefficient {

  bachelor: Degree = {
    exam: 0,
    practice: 0,
    graduateWork: 0
  };

  master: Degree = {
    exam: 0,
    practice: 0,
    graduateWork: 0
  };

  distanceExam: number;
  courseWork: number;
  courseProject: number;
  graphicWork: number;
  controlWork: number;
  gosExam: number;
  checkout: number;
  advice: number;

  constructor(settings: Settings[]) {
    settings.forEach(o => {
      switch (o.key) {
        case 'exam': this.bachelor.exam = +o.value; break;
        case 'diplomPrac': this.bachelor.practice = +o.value; break;
        case 'graduateWork': this.bachelor.graduateWork = +o.value; break;

        case 'mastersExam': this.master.exam = +o.value; break;
        case 'diplomPracMaster': this.master.practice = +o.value; break;
        case 'graduateWorkMaster': this.master.graduateWork = +o.value; break;

        case 'courseWork': this.courseWork = +o.value; break;
        case 'courseProject': this.courseProject = +o.value; break;
        case 'graphicWork': this.graphicWork = +o.value; break;
        case 'controlWork': this.controlWork = +o.value; break;
        case 'distanceExam': this.distanceExam = +o.value; break;
        case 'gosExam': this.gosExam = +o.value; break;
        case 'checkout': this.checkout = +o.value; break;
        case 'advice': this.advice = +o.value; break;
      }
    });
  }
}

export interface Settings {
  key: string;
  value: number;
}

export interface SettingsResp {
  error: boolean;
  data: [Settings];
}
