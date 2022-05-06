<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(suggestion, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', suggestion)"
    >
      <div slot="title" v-html="hightLight(suggestion)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search.js'

// 按需加载的好处 只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return { suggestions: [] }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会 调用 handler 函数 suggestion
      //   handler 函数名称是固定的
      //   debounce()
      //   handler (value) {
      //     this.loadSearchSuggestion(value)
      //   },
      // debounce  参数1：一个函数 参数2：延迟时间 单位是毫秒 返回值：防抖时候的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 200),
      // 该回调将会在侦听之后 立即调用
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestion (value) {
      try {
        const { data } = await getSearchSuggestion({ q: value })
        if (data.data.options[0]) {
          this.suggestions = data.data.options
        } else {
          this.suggestions = [this.searchText]
        }
      } catch (error) {
        this.$toast('获取失败')
      }
    },
    hightLight (text) {
      if (text) {
        const highStr = `<span class="active">${this.searchText}</span>`
        // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
        // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
        // 正则表达式的 new RegExp 构造函数
        //   参数1：匹配模式字符串，它会根据这个字符串创建 正则表达式
        //   参数2：匹配模式，要写到字符串中
        const reg = new RegExp(this.searchText, 'gi')
        return text.replace(reg, highStr)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
