//Imports--------------------------------------------
import apiUrl from "./ApiUrl.jsx";

export const api = {};
api.get = (endpoint) => callFetch(endpoint, "GET", null);
api.post = (endpoint, data) => callFetch(endpoint, "POST", data);
api.put = (endpoint, data) => callFetch(endpoint, "PUT", data);
api.delete = (endpoint) => callFetch(endpoint, "DELETE", null);

const callFetch = async (endpoint, method, dataObj) => {
  //Build request object
  let requestObj = { method: method }; //GET, POST, PUT or DELETE
  if (dataObj)
    requestObj = {
      ...requestObj,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(dataObj),
    };

  //call the fetch and process the return
  try {
    const endpointAddress = apiUrl + endpoint;
    const response = await fetch(endpointAddress);
    const result = await response.json();
    return response.status >= 200 && response.status < 300
      ? { isSuccess: true, result: result }
      : {
          isSuccess: false,
          message: `Error recovering: status code ${response.status}`,
        };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};
export default api;
