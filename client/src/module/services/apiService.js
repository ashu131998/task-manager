
import axios from 'axios';

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
        url: `https://server-nine-kohl.vercel.app/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token }
      });
    } else if (method === 'POST') {
      // response = await axios.post(`${baseUrl}/${endpoint}`, payload, { config });
      response = await axios({
        method: 'post',
        url: `https://server-nine-kohl.vercel.app/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token },
        data: payload
      })
    } else if (method === 'PUT') {
      response = await axios({
        method: 'put',
        url: `https://server-nine-kohl.vercel.app/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token },
        data: payload
      })
    } else if (method === 'PATCH') {
      response = await axios({
        method: 'patch',
        url: `https://server-nine-kohl.vercel.app/${endpoint}`,
        headers: { 'Authorization': 'Bearer ' + token },
        data: payload
      })
    }
    else if (method === 'DELETE') {
      response = await axios({
        method: 'delete',
        url: `https://server-nine-kohl.vercel.app/${endpoint}`,
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
