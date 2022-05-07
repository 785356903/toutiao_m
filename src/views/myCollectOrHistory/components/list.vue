<template>
  <div class="list-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <ListItem
        v-for="article in recordList"
        :key="article.art_id"
        :article="article"
      ></ListItem>
    </van-list>
  </div>
</template>

<script>
import { collectionsList, historiesList } from '@/api/user.js'
import ListItem from './list-item.vue'
export default {
  name: '',
  components: { ListItem },
  props: {
    active: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      recordList: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      let res = {}

      try {
        // 判断请求数据
        if (this.active === 0) {
          res = await collectionsList({
            page: this.page,
            per_page: this.per_page
          })
        } else {
          res = await historiesList({
            page: this.page,
            per_page: this.per_page
          })
        }
        // 将数据存入data
        const data = res.data.data
        const { results } = data
        this.recordList.push(...results)
        // 加载状态结束 loading = false
        this.loading = false
        // 判断是否还有数据
        if (results.length) {
          // 有数据继续加载
          this.page++
        } else {
          // 没有数据 数据全部加载完成 finished = true
          this.finished = true
        }
      } catch (error) {
        this.$toast.fail('获取数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.list-container {
  height: 87vh;
  overflow-y: auto;
}
</style>
