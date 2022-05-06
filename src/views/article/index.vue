<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.go(-1)"
      :z-index="0"
    ></van-nav-bar>

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- 用户信息 -->
        <van-cell class="user-info" :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
            @click="
              $router.push({
                // 根据路由名称进行跳转
                name: 'author-user',
                // 传递路由动态参数
                params: {
                  // 属性名：路由路径汇中设计的参数的名称
                  authorId: article.aut_id
                }
              })
            "
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <div slot="default">
            <!-- 模板中的 $event 就是事件参数
              @is-followed="(isFollowed) => (article.is_followed = isFollowed)"
              当我们传递给子组件的数据要使用还要修改
              传递props
              :is_followed="article.is_followed"
              修改：自定义事件
              @update-is_followed="article.is_followed = $event"
              简写方式：在组件上使用 v-model
              value="article.is_followed"
              @input="article.is_followed = $event"

              如需要修改 v-model 的规则名称，可以通过子组件的model来修改

              一个组件上只能使用一次 v-model

              如果有多个数据需要实现类似 v-model的效果 怎么办？
              可以使用 .sync 修饰符
            -->
            <followUser
              class="follow-btn"
              :authorId="article.aut_id"
              v-model="article.is_followed"
            ></followUser>
            <!-- <van-button
              v-if="article.is_followed"
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
            > -->
          </div>
        </van-cell>
        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <CommentList
          :source="article.art_id"
          :list="commentList"
          @onLoad-success="totalCommentCount = $event.total_count"
        ></CommentList>
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
          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <CollectArticle
            class="btn-item"
            :authorId="article.aut_id"
            v-model="article.is_collected"
          ></CollectArticle>
          <!-- <van-button class="btn-item" icon="star-o"></van-button> -->
          <LikeArticle
            class="btn-item"
            :articleId="article.art_id"
            v-model="article.attitude"
          ></LikeArticle>
          <!-- <van-button class="btn-item" icon="good-job-o"></van-button> -->

          <!-- <van-icon color="#777" name="star-o" />
        <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup v-model="commentShow" position="bottom">
          <CommentPost
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></CommentPost>
        </van-popup>
      </div>
      <!-- 资源未找到 -->
      <van-empty
        v-else-if="errStatus === 404"
        class="error-wrap"
        image="error"
        description="该资源不存在或已删除！"
      >
      </van-empty>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <van-empty v-else class="error-wrap" description="内容加载失败">
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </van-empty>
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
import followUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   startPosition: 1 // 其实位置 从0 开始
// })
export default {
  name: 'ArticleIndex',
  components: {
    followUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},
      loading: true, // loading 的加载状态
      errStatus: 0, // 失败的状态码
      isLoading: false,
      totalCommentCount: 0, // 评论总数
      commentShow: false, // 评论弹出层状态
      commentList: [] // 评论列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticleById()
  },
  mounted () {},
  methods: {
    async loadArticleById () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        console.log(data)
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdfasdfasd')
        // }

        // 数据驱动试图不是立即的
        this.article = data.data

        // 初始化图片点击预览 图片不是历立即更新的 小技巧
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }

        console.log(error)
      }
      // 无论成功失败都需要关闭loading
      this.loading = false
    },
    loadArticle () {
      this.loadArticleById()
    },

    // 图片预览思想
    /*
     * 1、从文章内容中获取到所有的 img DOM 节点
     * 2、获取文章内容中所有的图片地址
     * 3、遍历所有 img 节点，给每个节点注册点击事件
     * 4、在 img 点击事件处理函数中，调用 ImagePreview 预览
     */
    previewImage () {
      // 得到所有的  img 节点
      const articleCentont = this.$refs['article-content']
      const img = articleCentont.querySelectorAll('img')
      console.log(img)
      // 获取所有图片
      const images = []
      img.forEach((img, index) => {
        images.push(img.dataset.src)
        img.onclick = () => {
          ImagePreview({
            images, // 预览的图片地址数组
            startPosition: index // 其实位置 从0 开始
          })
        }
      })
    },
    // 发布评论成功
    onPostSuccess (data) {
      // 关闭弹出层
      this.commentShow = false
      // 将发布内容添加到列表顶部 更新视图
      this.commentList.unshift(data.new_obj)
    }
    // 添加取消关注
    // async onFollow () {
    //   // 开启按钮的 loading 状态
    //   this.isLoading = true
    //   /*
    //    *err 对象的属性说明：
    //    *message：错误提示信息
    //    *fileName：表示出错代码所在文件
    //    *lineNumber：出错代码所在行数
    //    *stack： 出错堆栈信息
    //    *name：异常对象名/类型
    //    *response 被隐藏了
    //    */
    //   try {
    //     // 如果已关注，则取消关注
    //     const authorId = this.article.aut_id
    //     console.log(authorId)
    //     if (this.article.is_followed) {
    //       await deleteFollow(authorId)
    //     } else {
    //       await addFollow(authorId)
    //     }
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (error) {
    //     let message = '操作失败'
    //     console.log(error)
    //     console.log(error.response)
    //     if (error.response && error.response.status === 400) {
    //       message = '你不能关注自己'
    //     }
    //     this.$toast.fail(message)
    //   }
    //   // 关闭按钮的 loading 状态
    //   this.isLoading = false
    // }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }
  }
  .user-info {
    padding: 0 32px;
    display: flex;
    align-items: center;
    .avatar {
      width: 70px;
      height: 70px;
      margin-right: 17px;
    }
    /deep/.van-cell__label {
      margin-top: 0;
    }
    .user-name {
      font-size: 24px;
      color: #3a3a3a;
    }
    .publish-date {
      font-size: 23px;
      color: #b7b7b7;
    }
    .follow-btn {
      width: 170px;
      height: 58px;
    }
  }
  .article-content {
    padding: 55px 32px;
    /deep/ p {
      text-align: justify;
    }
  }
  .error-wrap {
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
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
      width: 282px;
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
