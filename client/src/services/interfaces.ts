interface Response {
  hasError: boolean;
  requestIdf: string;
  sessionId: string;
  status: boolean;
  version: number;
}

export interface Station {
  id: number;
  title: string;
}

export interface Program {
  date: string;
  stationId: number;
  time: string;
  title: string;
  isFromYesterday?: boolean;
}

export interface StationResult {
    status: boolean;
    result: Station[];
}


export interface StationResponse extends Response {
  ['module:com_playground/tv/tv/getStations']: StationResult;
}

export interface ProgramResponse extends Response {
  ['module:com_playground/tv/tv/getProgram#1']: {
    status: boolean;
    result: Program[];
  };
  ['module:com_playground/tv/tv/getProgram#2']: {
    status: boolean;
    result: Program[];
  };
  ['module:com_playground/tv/tv/getProgram#3']: {
    status: boolean;
    result: Program[];
  };
}