import axios from "axios";

var API_ROOT = process.env.API_ROOT;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default {
    get:(url) => {
        return axios.get(API_ROOT+url);
    },
    post:(url,params) => {
        return axios.post(API_ROOT+url,params);
    }
}