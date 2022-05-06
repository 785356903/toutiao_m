<template>
  <van-button
    :icon="isLike == 1 ? 'good-job' : 'good-job-o'"
    :class="{ active: isLike }"
    @click="onCollect"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article.js'
export default {
  name: 'LikeArticle',
  // 自定义 v-model 数据名称 可看vue文档
  model: {
    prop: 'isLike', // 默认是 value
    event: 'update-attitude' // 默认是 input
  },
  props: {
    isLike: {
      type: [Number, String],
      required: true
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {
    async onCollect () {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      })
      try {
        let status = -1
        if (this.isLike === 1) {
          await deleteLike(this.articleId)
          this.$toast.success('取消点赞')
        } else {
          await addLike(this.articleId)
          this.$toast.success('点赞成功')
          status = 1
        }
        // 更新视图
        this.$emit('update-attitude', status)
      } catch (error) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.active {
  /deep/.van-icon {
    color: #ff9d1d;
  }
}
</style>
