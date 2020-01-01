//导出axios实例
import axios from 'axios';

let instance = axios.create();
//统一配置 baseURL 请求头 设置 超时 响应状态码处理
//http 状态码 2或304请求设置为 resolve状态其余未reject 
//q请求响应处理 序列化
//拦截器中loading 鉴权

const http = axios.create({
    baseURl: '',
    headers:{
        
    },
    timeout:5000
})

http.interceptors.request.use(config => {

    return config;
},err=>{

})

http.interceptors.response.use(res => {
    
    return res;
},err=>{

})

export default http;
