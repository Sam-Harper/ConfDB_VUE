import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getPSets() {
    return apiClient.get('/psets')
  },
  getPSetsFromFile(fileData) {
    let jsonObject = JSON.parse(fileData)
    //console.log(jsonObject['mods'])
    return jsonObject['psets']
  },
  getPSet(id) {
    return apiClient.get('/psets/' + id)
  },
  getPSetByName(name) {
    return apiClient.get('/psets/' + name)
  },
  postPSet(pset) {
    return apiClient.post('/psets', pset)
  },
}
