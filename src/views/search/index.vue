<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form class="search-from" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
        background="#3296fa"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText" />

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />

    <!-- 搜索历史记录 -->
    <search-history
      :searchHistories="searchHistories"
      @remove-history="removeHistory"
      @remove-all-history="searchHistories = []"
      v-else
    />
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
// import {getItem} from '@/utils/storage.js'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('serach-histories') || [] // 历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories: {
      handler (val) {
        setItem('serach-histories', val)
      },
      // 这里是关键，代表递归监听 demo 的变化
      deep: true
    }
  },
  created () {},
  methods: {
    onSearch (val) {
      //   Toast(val)
      this.searchText = val

      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      //   this.searchText = ''
      this.$router.back()
    },
    // 删除历史
    removeHistory (title, index, isAll) {
      if (isAll) {
        // 如果是编辑状态，删除该条历史
        this.searchHistories.splice(index, 1)
      } else {
        // 如果不是编辑状态 跳转搜索结果
        this.onSearch(title)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  /deep/.van-search__action {
    color: #fff;
    padding: 0 33px;
  }
  .search-from {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
  }
}
</style>
