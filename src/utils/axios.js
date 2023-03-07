import axios from 'axios';
// import { Message } from 'antd-mobile';

const instance = axios.create({
  //创建axios实例，在这里可以设置请求的默认配置
  timeout: 5000, // 设置超时时间10s
  baseURL: '', //根据自己配置的反向代理去设置不同环境的baeUrl
});
instance.defaults.headers.post['Content-Type'] = 'application/json';

let httpCode = {
  //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时',
};

/** 添加请求拦截器 **/
instance.interceptors.request.use(
  (config) => {
    config.headers['token'] = sessionStorage.getItem('token') || '';
    if (config.url.includes('pur/contract/export')) {
      config.headers['responseType'] = 'blob';
    }
    if (config.url.includes('pur/contract/upload')) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** 添加响应拦截器  **/
instance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
    // if (response.statusText === 'ok') { // 响应结果里的statusText: 暂定ok，可以根据实际情况去做对应的判断
    //     return Promise.resolve(response.data)
    // }
    // message.error('响应超时')
    // return Promise.reject(response.data.message)
  },
  (error) => {
    if (error.response) {
      // 根据请求失败的http状态码去给用户相应的提示
      let tips =
        error.response.status in httpCode
          ? httpCode[error.response.status]
          : error.response.data.message;
      // Message.error(tips);
      if (error.response.status === 401) {
        // token或者登陆失效情况下跳转到登录页面，根据实际情况
        //针对框架跳转到登陆页面
      }
      return Promise.reject(error);
    }
    // Message.error('请求超时, 请刷新重试');
    return Promise.reject('请求超时, 请刷新重试');
  }
);

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url,
      params,
      ...config,
    })
      .then((response) => {
        return resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...config,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
