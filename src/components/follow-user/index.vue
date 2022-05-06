<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="isLoading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="isLoading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'followUser',
  // 自定义 v-model 数据名称 可看vue文档
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    authorId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    // 添加取消关注
    async onFollow () {
      // 开启按钮的 loading 状态
      this.isLoading = true
      /*
       *err 对象的属性说明：
       *message：错误提示信息
       *fileName：表示出错代码所在文件
       *lineNumber：出错代码所在行数
       *stack： 出错堆栈信息
       *name：异常对象名/类型
       *response 被隐藏了
       */
      try {
        // 如果已关注，则取消关注
        const authorId = this.authorId
        // console.log(authorId)
        if (this.isFollowed) {
          await deleteFollow(authorId)
        } else {
          await addFollow(authorId)
        }
        console.log(this.isFollowed)
        this.$emit('update-is_followed', !this.isFollowed)
        // this.$emit('update-is_followed', !this.isFollowed)
      } catch (error) {
        let message = '操作失败'
        if (error.response && error.response.status === 400) {
          message = '你不能关注自己'
        }
        this.$toast.fail(message)
      }
      // 关闭按钮的 loading 状态
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
