import Request from "utils/AxiosFactory/index";
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from "axios";
const request = new Request({
  baseURL: "https://autumnfish.cn/"
});
const requestIntercept = (config: AxiosRequestConfig): AxiosRequestConfig => {
  console.log("请求拦截");
  return config;
};
const responseIntercept = (response: AxiosResponse): AxiosResponse => {
  console.log("响应拦截");
  return response;
};
const processingError = (error: AxiosError): AxiosError => {
  console.log("出错了");
  return error;
};
request.interceptors({
  requestIntercept,
  requestError: processingError,
  responseIntercept,
  responseError: processingError
});
export default request;
