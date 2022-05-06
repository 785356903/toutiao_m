<template>
  <div class="comment-reply">
    <div class="reply-title">{{ list.length }}条回复</div>
    <!-- 该条评论 -->
    <CommentItem class="reply-item" :comment="comment"></CommentItem>
    <!-- 全部评论 -->
    <div class="replay-warp">
      <div class="all-replay">全部评论</div>
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
          :autName="autName"
          @reply-show="onReplyShow"
        ></CommentItem>
      </van-list>
    </div>
    <!-- 底部工具栏 -->
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="commentShow = true"
        >写评论</van-button
      >
      <!-- <van-button class="btn-item" icon="good-job-o" @click="onCommentLike()"></van-button> -->
      <van-button
        class="like-btn"
        :class="{ liked: comment.is_liking }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="commentLoading"
        @click="onCommentLike()"
        >{{ comment.like_count || '赞' }}</van-button
      >
      <!-- <van-icon color="#777" name="good-job-o" /> -->
    </div>
    <!-- 发布评论 -->
    <van-popup v-model="commentShow" position="bottom">
      <CommentPost
        :target="comment.com_id"
        :artId="source"
        @post-success="onPostSuccess"
      ></CommentPost>
    </van-popup>
    <!-- 回复评论 -->
    <van-popup v-model="replyCommentShow" position="bottom">
      <CommentPost
        :target="replyComment.com_id"
        :artId="source"
        :autName="replyComment.aut_name"
        @post-success="onReplayPostSuccess"
      ></CommentPost>
    </van-popup>
  </div>
</template>

<script>
import {
  getComments,
  addCommentLike,
  deleteCommentLike
} from '@/api/comment.js'
import CommentItem from './comment-item.vue'
import CommentPost from './comment-post.vue'

export default {
  name: 'CommentReply',
  components: { CommentItem, CommentPost },
  props: {
    comment: {
      type: Object,
      required: true
    },
    source: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false, // 加载状态
      finished: false, // 数据加载完状态
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false,
      commentShow: false, // 评论弹出层状态
      commentLoading: false,
      replyComment: {}, // 评论回复的信息
      replyCommentShow: false,
      autName: '' // 回复的作者名
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 评论列表
    async onLoad () {
      try {
        // 1.请求数据
        const { data } = await getComments({
          type: 'c', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.comment.com_id, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 2.将数据加入到列表中
        const { results } = data.data
        this.list.push(...results)

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
    onPostSuccess (data) {
      // 关闭弹出层
      this.commentShow = false
      // 将发布内容添加到列表顶部 更新视图
      this.comment.like_count++
      this.$emit('like_count')
      console.log(this.comment.like_count)
      this.list.unshift(data.new_obj)
    },
    onReplayPostSuccess (data) {
      // 关闭弹出层
      this.replyCommentShow = false
      // 将发布内容添加到列表顶部 更新视图
      this.list.unshift(data.new_obj)
    },
    // 点赞
    async onCommentLike () {
      this.commentLoading = true
      // 1.是否点赞
      if (this.comment.is_liking) {
        // 点赞取消点赞
        await deleteCommentLike(this.comment.com_id)
        this.comment.like_count--
      } else {
        // 未点赞点赞
        await addCommentLike(this.comment.com_id)
        this.comment.like_count++
      }
      // 2.更新视图
      this.comment.is_liking = !this.comment.is_liking
      //   this.$emit('comment-is_liking', this.comment)
      //   this.$toast('操作成功')
      this.commentLoading = false
      try {
      } catch (error) {}
    },
    onReplyShow (comment) {
      this.replyCommentShow = true
      this.replyComment = comment
      //   this.autName = comment.aut_name
    }
  }
}
</script>

<style scoped lang="less">
.comment-reply {
  padding-top: 33px;
  .reply-title {
    text-align: center;
    font-size: 33px;
    color: #7f7f7f;
  }
  .reply-item {
    margin-top: 30px;
  }
  .replay-warp {
    .all-replay {
      font-size: 30px;
      color: #7f7f7f;
      padding: 30px 0 30px 30px;
    }
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #ff9d1d;
    }
  }
  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 320px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 30px;
      color: #a7a7a7;
    }
    .btn-item {
      border: 0;
      width: 20px;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
