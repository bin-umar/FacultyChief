/**
 * Authorization interfaces
 */
export interface UserInfo {
  userId: number;
  type: string;
  time: string;
}

export interface IAuth {
  error: boolean;
  data: {
    token?: string
    hash?: string
  };
}

export interface CheckResponse {
  error: boolean;
  data: {
    last_action: string;
  };
}

/**
 * Common http responses
 */

export interface ResponseAdd {
  error: boolean;
  data: {
    id: number
  };
}

export interface UpdateResponse {
  error: boolean;
}

export interface Department {
  id: number;
  fullName: string;
  shortName: string;
  chief: string;
}

export interface IDepartment {
  error: boolean;
  data: [Department];
}

export interface DepartmentInfo {
  fcId: number;
  fcFullName: string;
  fcShortName: string;
  fcChief: string;
  kfId: number;
  kfFullName: string;
  kfShortName: string;
  kfChiefPosition: string;
  kfChief: string;
}

export interface IDepartmentInfo {
  error: boolean;
  data: DepartmentInfo;
}

/**
 * Standard
 */

export interface Standard {
  ids: number;
  fSpec_Shifr: string;
  timeOfStudying: number;
  typeOfStudying: string;
  degreeOfStudying: string;
  dateOfAcceptance: Date;
  locked: number;
}

export interface IStandard {
  error: boolean;
  data: [Standard];
}

export interface TypesOfStudying {
  id: number;
  name: string;
}
