<template>
  <!--
  '/article/' + article.art_id\
  `/article/${article.art_id}`
 -->
  <van-cell
    class="article-item"
    :to="{
      // 根据路由名称进行跳转
      name: 'article',
      // 传递路由动态参数
      params: {
        // 属性名：路由路径汇中设计的参数的名称
        articleId: article.art_id
      }
    }"
  >
    <div slot="title" class="title">
      <div class="van-multi-ellipsis--l2">{{ article.title }}</div>
    </div>
    <!-- 第三方资源怎么保护 referrer 来保护-->
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      class="right-cover"
      fit="cover"
      :src="article.cover.images[0]"
    />
    <div slot="label">
      <div v-if="article.cover.type === 3" class="cover-warp">
        <div
          class="cover-item"
          v-for="(item, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item-img" fit="cover" :src="item" />
        </div>
      </div>
      <div class="label-info-warp">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  /deep/.van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-warp span {
    font-size: 23px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-warp {
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
