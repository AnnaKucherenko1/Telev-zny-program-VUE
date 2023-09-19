import axios from 'axios';

const apiUrl = 'https://playground.systemomega.com/neon'; 


export const getStations = async (maxRetries = 3) => {
  let retries = 0;

  const requestData = {
    version: 3,
    sessionId: '0evig597cb7qfi5ndp2n0cmju7',
    requestIdf: 'abc001',
    dataOrder: ['module:com_playground/tv/tv/getStations'],
  };

  const makeApiCall = async () => {
    try {
      console.log("retries: ", retries)
      const response = await axios.post(`${apiUrl}`, requestData);

      return response.data["module:com_playground/tv/tv/getStations"];
    } catch (error) {
      console.error('Error fetching stations:', error);

      if (retries < maxRetries) {
        console.log(`Retrying (Retry ${retries + 1}/${maxRetries})`);
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
