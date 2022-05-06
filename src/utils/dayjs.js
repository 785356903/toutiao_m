import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 依赖包
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理响应时间的插件
dayjs.extend(relativeTime)
// dayjs 默认语言是英文，我们这里配置为中文
dayjs.locale('zh-cn') // 全局使用

// 定义一个全局过滤器, 然后就可以在任何模板中使用了
// 其实过滤器就相当于一个全局的可用方法（仅模板可用）
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})
// dayjs() 获取当前最新时间
// dayjs().format(YYYY-MM-DD) 处理格式

console.log()
