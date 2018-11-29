import axios from "axios";

var API_ROOT = process.env.API_ROOT;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.response.use(function (res) {
    if(res.data.code === 10001){
        alert(res.data.message)
    }
    return res;
}, function (err) {
    return Promise.reject(err);
});

axios.interceptors.request.use(function (config) {
    config.headers.common['Authorization'] = Number(localStorage.getItem("token")) === 1 ? "cxrloginsuccess" : "";
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default {
    get:(url) => {
        return axios.get(API_ROOT+url);
    },
    post:(url,params) => {
        return axios.post(API_ROOT+url,params);
    }
}