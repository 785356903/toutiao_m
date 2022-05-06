<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="pullLadingText"
      :success-duration="1000 * 1"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></ArticleItem>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false, // 控制加载中 loading 的状态
      finished: false, // 控制数据加载结束的状态
      error: false, // list组件的 错误提示
      isLoading: false, // 控制下拉刷新
      timestamp: null, // 请求获取下一页的时间戳
      pullLadingText: '更新成功'
    }
  },
  methods: {
    //   初始化或者滚动到底部的时候会触发 onLoad
    async onLoad () {
      // 1.异步更新数据 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第一页数据：当前最新时间戳
          // 用于请求之数据的时间戳会在当前请求结果中返回
          timestamp: this.timestamp || Date.now()
          //   with_top: 0 // 0 包含置顶 1 不包含
        })
        console.log(data)
        // 2. 把请求结果放入 list 数组

        const { results } = data.data
        this.timestamp = data.data.pre_timestamp
        // 数组的展开运算符，会把元素一个一个的加入数组中
        this.list = [...this.list, ...results]
        // 3.本次加载完毕以后，要把加载状态设置为结束
        // loading 关闭之后才能触发下一次的加载更多
        this.loading = false

        // 4.判断数据全部加载完成

        // 如果没有数据了 把 finished 设置为 true 就不会继续加载
        if (results.length) {
          // 更新获取下一页数据
        } else {
          //   没有数据了 将 finished 设置为 true
          this.finished = true
        }
        // 模拟随机报错
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdfds')
        // }
      } catch (error) {
        // this.$toast('获取文章失败', error)
        this.error = true
        this.loading = false
      }
    },
    // 当下拉刷新会调用该函数
    async onRefresh () {
      try {
        // 1.请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now()
          //   with_top: 0 // 0 包含置顶 1 不包含
        })
        // 2. 把请求结果放入 list 数组顶部
        const { results } = data.data
        // 数组的展开运算符，会把元素一个一个的加入数组中
        // this.list = [...results, ...this.list]
        this.list.unshift(...results)
        // 3.要把加载状态设置为结束
        this.isLoading = false
        // 跟新下拉成功文本提示
        this.pullLadingText = `更新成功，更新${results.length}了条数据`
      } catch (error) {
        this.pullLadingText = '刷新失败'
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;
  height: 79vh;
  overflow-y: auto;
}
</style>
