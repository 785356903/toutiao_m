<template>
  <van-button
    :icon="isCollected ? 'star' : 'star-o'"
    :class="{ active: isCollected }"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article.js'
export default {
  name: 'CollectArticle',
  // 自定义 v-model 数据名称 可看vue文档
  model: {
    prop: 'isCollected', // 默认是 value
    event: 'update-is_collected' // 默认是 input
  },
  props: {
    isCollected: {
      type: Boolean,
      required: true
    },
    authorId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {}
  },
  mounted () {
    console.log(this.isCollected)
    console.log(this.authorId)
  },
  methods: {
    async onCollect () {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      })
      try {
        if (this.isCollected) {
          await deleteCollect(this.authorId)
          this.$toast.success('取消收藏')
        } else {
          await addCollect(this.authorId)
          this.$toast.success('收藏成功')
        }
        this.$emit('update-is_collected', !this.isCollected)
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
