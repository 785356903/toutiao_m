/**
 * 搜索相关的请求模块
 */
import request from '@/utils/request'
// import store from '@/store'

// 联想建议（补全）
export const getSearchSuggestion = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params
  })
}

// 获取搜索结果
export const getSearchResult = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
