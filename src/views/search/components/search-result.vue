<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="加载失败，请重试"
    >
      <van-cell
        v-for="(result, index) in ResultList"
        :key="index"
        :title="result.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      ResultList: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 2,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLoad () {
      // 异步更新数据
      this.loadSearchResult()
    },
    // 请求
    async loadSearchResult () {
      try {
        // 1.请求数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 搜索参数
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('jklj;')
        // }
        // 2.将数据添加到数据列表
        const { results } = data.data
        this.ResultList.push(...results)
        // 3.加载状态结束 关闭
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 如果有，跟新下一页数据
          this.page++
        } else {
          // 如果没有 数据全部加载完成
          this.finished = true
        }
      } catch (error) {
        // 展示加载失败
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
