import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'

Vue.use(Vuex)
// 使用 vuex
// 1.容积是为了访问方便
// 2.数据是响应式的 容积中的数据发生变化 绑定这个数据的视图也会发生变化
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 用户的登录状态信息'
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    // user: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 3.但是 容积中的数据不是持久化的 为了持久化 结合本地存储
      // 为了防止刷新丢失，我们需要把数据被分到本地存储
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
    }
  },
  actions: {},
  modules: {}
})
