<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <template>
        <div class="user-name" v-if="autName">
          {{ comment.aut_name }}@{{ autName }}
        </div>
        <div class="user-name" v-else>{{ comment.aut_name }}</div>
      </template>

      <van-button
        class="like-btn"
        :class="{ liked: comment.is_liking }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="commentLoading"
        @click="onCommentLike()"
        >{{ comment.like_count || '赞' }}</van-button
      >
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{
          comment.pubdate | relativeTime
        }}</span>
        <van-button
          class="reply-btn"
          round
          @click="$emit('reply-show', comment, index)"
          >回复 {{ comment.reply_count }}
        </van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment.js'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    },
    index: {
      type: [Number, String]
    },
    autName: {
      type: String
    }
  },
  data () {
    return {
      commentLoading: false,
      show: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
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
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 160px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
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
}
</style>
