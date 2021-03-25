import axios from 'axios'

const apiClient = axios.create({
  baseURL: `https://test-confdbv3.web.cern.ch/`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getConfiguration() {
    console.log(
      'GET CONFIGURATION KEYCLOKAER: ' + JSON.stringify(globalThis.keyCloaker)
    )
    let response =  apiClient.get('configuration',{
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + globalThis.keyCloaker.idToken
      }     	 
    })
   console.log("response"+JSON.stringify(response))
   return response
  },
  getAllFromFile(fileData) {
    let jsonObject = JSON.parse(fileData)
    return jsonObject['configuration']
  },
  postAll(all) {
    return apiClient.post('/', all)
  },
  uploadFile(fileData) {
     let formData = new FormData();
     formData.append("file",fileData)
     console.log(JSON.stringify(globalThis.keyCloaker))	
     return apiClient.post('upload',formData,{headers : {"Content-Type": "multipart/form-data","Authorization" : "Bearer "+globalThis.keyCloaker.idToken }})
  }
}
