import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
let baseURL
if (import.meta.env.MODE === 'mobileProduction' || import.meta.env.MODE === 'mobileTest') {
  baseURL = 'api'
} else {
  baseURL = 'api'
}
console.log('baseURL', baseURL)
const service = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 60000,
})
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    const { config, response } = err
    if (response?.status === 401) {
      return Promise.reject(err)
    }
  },
)
const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },
  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },
}
export default http
