/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
// 大数字的处理   超过区间 -2的53次幂   2的53次幂
// import JSONBig from 'json-bigint'

// const jsonStr = '{ "art_id": 1245953273786007552 }'
// const jsonStr1 = '{ "art_id": 12459 }'
// console.log(JSONBig.parse(jsonStr).art_id.toString())
// console.log(JSONBig.parse(jsonStr1))
// 可以处理数据中 超出 js 安全证书范围的数字
// JSONBig.parse() // 把 JSON 格式的字符串转为 javascript 对象
// JSONBig.stringfy() // 把  javascript 对象 转为 JSON 格式的字符串 javascript 对象
const request = axios.create({
  baseURL: 'http://www.liulongbin.top:8000' // 接口地址
  // 自定义后端返回的原始数据
  // transformRequest: [
  //   function (data, headers) {
  //     try {
  //       // 如果转换成功则返回转换的数据结果
  //       return JSONBig.parse(data)
  //     } catch (err) {
  //       // 如果转换失败，则包装为统一数据格式并返回
  //       return {
  //         data
  //       }
  //     }
  //     // axios 默认会在内部这样来处理后端返回的数据
  //     // return JSON.parse(data)
  //   }
  // ]
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // config 配置对象：本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意：这里务必要返回 config对象，否则请求就停在这里
    // console.log(config)
    return config
  },
  function (error) {
    // 对请求错误做些什么（还没有发出去的）
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default request
