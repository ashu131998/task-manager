
import axios from 'axios';

const baseUrl = "https://server-nine-kohl.vercel.app";

async function apiServiceHandler(method, endpoint, payload) {
  const token = localStorage.getItem('secret');
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    // console.log(config);
    //   endpoint = baseUrl + endpoint
    let response;
    if (method === 'GET') {
      // response = await axios.get(`${baseUrl}/${endpoint}`, { config });
      response = await axios({
        method: 'get',
        url: `${baseUrl}/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token }
      });
    } else if (method === 'POST') {
      // response = await axios.post(`${baseUrl}/${endpoint}`, payload, { config });
      response = await axios({
        method: 'post',
        url: `${baseUrl}/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token },
        data: payload
      })
    } else if (method === 'PUT') {
      response = await axios({
        method: 'put',
        url: `${baseUrl}/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token },
        data: payload
      })
    } else if (method === 'PATCH') {
      response = await axios({
        method: 'patch',
        url: `${baseUrl}/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token },
        data: payload
      })
    }
    else if (method === 'DELETE') {
      response = await axios({
        method: 'delete',
        url: `${baseUrl}/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token },
        data: payload
      })
    }
    else {
      throw new Error('Unsupported HTTP method');
    }

    return response.data;
  } catch (error) {
    window.location.href("/login")
    throw error;
  }
}

export default apiServiceHandler;
