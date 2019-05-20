import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios.create({
  // 기본 API URL
  baseURL: 'http://ec2-18-220-151-89.us-east-2.compute.amazonaws.com:3001/',
  timeout: 30000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
});

// 요청데이터 전처리
Vue.prototype.$http.interceptors.request.use(function (config) {
  console.log('-------------보낸 데이터--------------');
  console.log(config.url);
  console.log(config.data);
  console.log('------------------------------------');
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 응답데이터 전처리
Vue.prototype.$http.interceptors.response.use(function (response) {
  console.log('-------------받은 데이터--------------');
  console.log(response);
  console.log('------------------------------------');
  return response.data;
}, function (error) {
  return Promise.reject(error);
});
