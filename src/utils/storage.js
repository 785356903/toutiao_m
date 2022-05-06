/* 封装本地存储的操作模块 */

// 存储数据
export const setItem = (key, value) => {
  // 将数组或对象类型的数据转换为 json 格式字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
// 获取数据

export const getItem = (key, value) => {
  const data = window.localStorage.getItem(key, value)
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

// 删除数据
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
