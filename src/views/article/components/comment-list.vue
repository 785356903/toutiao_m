<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <CommentItem
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        :index="index"
        @reply-show="onReplyShow"
      ></CommentItem>
      <!-- <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.aut_name"
      /> -->
    </van-list>
    <!-- 回复弹出层 -->
    <van-popup
      v-if="replyShow"
      class="popup-reply"
      v-model="replyShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <CommentReply
        :comment="comment"
        :source="source"
        @like_count="like_count"
      ></CommentReply>
    </van-popup>
  </div>
</template>

<script>
import { getComments } from '@/api/comment.js'
import CommentItem from './comment-item.vue'
import CommentReply from './comment-reply.vue'
export default {
  name: 'CommentList',
  components: {
    CommentItem,
    CommentReply
  },
  props: {
    source: {
      type: [Number, String],
      required: true
    },
    list: {
      type: Array,
      // 在 vue中 props 里面的 数组与对象的默认值 要以 函数返回值的方式赋予
      default: () => []
    }
  },
  data () {
    return {
      // list: [],
      loading: false, // 加载状态
      finished: false, // 数据加载完状态
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false,
      replyShow: false, // 回复弹出层显示
      comment: {},
      index: 0 // 评论索引
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求数据
        const { data } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 2.将数据加入到列表中
        const { results } = data.data
        this.list.push(...results)

        // 把文章评论总数传递到外部
        this.$emit('onLoad-success', data.data)
        // 3.将 loading 视设置为 false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          //   有数据 加载下一页
          this.offset = data.data.last_id
        } else {
          //   没有数据 finished 设置为 true
          console.log(111)
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
    },
    onReplyShow (comment, index) {
      console.log(index)
      this.replyShow = true
      // 点击回复 返回的评论信息
      this.index = index
      this.comment = comment
    },
    like_count () {
      this.list[this.index].reply_count++
    }
  }
}
</script>

<style lang="less" scoped>
.comment-list {
  .popup-reply {
    color: #fefefe;
  }
}
</style>
