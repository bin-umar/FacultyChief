export interface Load {
  id: number;
  newId: string;
  subjectName: string;
  idExSubject: number;
  term: number;
  course: number;
  group: string;
  degree: string;
  type: string;
  studentsAmount: number;
  idSection: number;
  section: string;
  hour: number;
  idGroup: number;
  idTeacher: string;
}

export interface ILoad {
  error: boolean;
  data: [Load];
}

export interface Teacher {
  id: number;
  fio: string;
  position: string;
  scienceDegree: string;
  v1: number;
  v2: number;
  v3: number;
}

export interface ITeacher {
  error: boolean;
  data: [Teacher];
}
