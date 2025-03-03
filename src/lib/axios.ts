import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // as our back-end and front-end app are running under the same codebase, sharing the url, we don't need to add the http://localhost...
})
