import axios from 'axios';
import { uuid } from 'vue-uuid';
import { ProgramResponse, StationResponse, StationResult } from './interfaces';

const API_URL = 'https://playground.systemomega.com/neon';
const MAX_RETRIES = 6;

const generateRequestId = () => {
  return uuid.v1();
};
export const getStations = async (maxRetries = MAX_RETRIES): Promise<StationResult | null> => {
  let retries = 0;

  const requestData = {
    version: 3,
    sessionId: '0evig597cb7qfi5ndp2n0cmju7',
    requestIdf: generateRequestId(),
    dataOrder: ['module:com_playground/tv/tv/getStations'],
  };

  // TODO: Fix typing
  const makeApiCall = async (): Promise<StationResult | null> => {
    try {
      const response = await axios.post(`${API_URL}`, requestData);

      return response.data['module:com_playground/tv/tv/getStations'];
    } catch (error) {
      console.error('Error fetching stations:', error);

      if (retries < maxRetries) {
        retries++;
        return makeApiCall();
      } else {
        console.error('Max retries reached. Unable to fetch stations data.');
        return null;
      }
    }
  };
  return makeApiCall();
};

export const getPrograms = async (
  date: string,
  stationIds: number[] | undefined,
  maxRetries = MAX_RETRIES
): Promise<ProgramResponse | null> => {
  if (!stationIds || !stationIds.length) {
    return null;
  }
  let retries = 0;

  const requestData = {
    version: 3,
    sessionId: '0evig597cb7qfi5ndp2n0cmju7',
    requestIdf: generateRequestId(),
    dataOrder: [
      'module:com_playground/tv/tv/getProgram#1',
      'module:com_playground/tv/tv/getProgram#2',
      'module:com_playground/tv/tv/getProgram#3',
    ],
    'module:com_playground/tv/tv/getProgram#1': {
      stationId: stationIds[0],
      date: date,
    },
    'module:com_playground/tv/tv/getProgram#2': {
      stationId: stationIds[1],
      date: date,
    },
    'module:com_playground/tv/tv/getProgram#3': {
      stationId: stationIds[2],
      date: date,
    },
  };

  const makeApiCall = async (): Promise<ProgramResponse | null> => {
    try {
      const response = await axios.post(`${API_URL}`, requestData);

      return response.data;
    } catch (error) {
      console.error('Error fetching stations:', error);

      if (retries < maxRetries) {
        retries++;
        return makeApiCall();
      } else {
        console.error('Max retries reached. Unable to fetch stations data.');
        return null;
      }
    }
  };
  return makeApiCall();
};


