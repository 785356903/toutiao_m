<template>
  <van-cell class="article-item">
    <van-image
      class="avatar"
      slot="icon"
      round
      fit="cover"
      :src="article.aut_photo"
    />
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.aut_name }}
    </div>
    <div slot="label">
      {{ article.title }}
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item-img" fit="cover" :src="img" />
        </div>
      </div>
      <div class="label-info-wrap">
        <van-icon class="comment-icon" name="comment-o" color="#777">{{
          article.comm_count
        }}</van-icon>
        <van-icon class="comment-icon" name="good-job-o" color="#777">{{
          article.like_count
        }}</van-icon>
        <van-icon class="comment-icon" name="star-o" color="#777">{{
          article.is_top
        }}</van-icon>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      class="right-cover"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }

  .label-info-wrap {
    display: flex;
    flex: 1;
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
    .comment-icon {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      padding: 20px;
    }
    .btn-item {
      flex: 1;
      border: 0;
      width: 20px;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777;
    }
  }

  .avatar {
    width: 70px;
    height: 70px;
    margin-right: 17px;
  }
  .active {
    /deep/.van-icon {
      color: #ff9d1d;
    }
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
