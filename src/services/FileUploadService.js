import axios from 'axios'

const apiClient = axios.create({
  baseURL: `https://test-confdbv3.web.cern.ch/`,
  withCredentials: true, // This is the default
  headers: {
   
  },
    
})
/* 
apiClient.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    console.log('AXIOS SUCCESS')
    console.log(config)
    return config
  },
  function(error) {
    // Do something with request error
    console.log('AXIOS ERROR' + error)
    return Promise.reject(error)
  }
) */

export default {
  uploadFile(file,token) {
    let formData = new FormData();
    formData.append("file",file)
    return apiClient.post("/upload",formData,{headers : {"Content-Type": "multipart/form-data","Authorization" : "Bearer "+token }});
  }
}
