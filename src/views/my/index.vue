<template>
  <div class="my-container">
    <!-- 登录 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image round fit="cover" class="avatar" :src="userInfo.photo" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button round size="mini" to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-states">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>

        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 九宫格 收藏 历史 -->
    <van-grid clickable :column-num="2" class="grid-nav">
      <van-grid-item
        :to="{
          // 根据路由名称进行跳转
          name: 'myCollectOrHistory',
          // 传递路由动态参数
          params: {
            // 属性名：路由路径汇中设计的参数的名称
            activeIndex: 0
          }
        }"
        class="grid-item"
      >
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item
        :to="{
          // 根据路由名称进行跳转
          name: 'myCollectOrHistory',
          // 传递路由动态参数
          params: {
            // 属性名：路由路径汇中设计的参数的名称
            activeIndex: 1
          }
        }"
        class="grid-item"
      >
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell is-link title="消息通知" />
    <van-cell is-link title="小智同学" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onlogout"
      clickable
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
// import store from '@/store'
export default {
  name: 'MyIndex',
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      userInfo: {} // 用户信息
    }
  },
  created () {
    // 如果用户登录的，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo()
    }
    // console.log(store.state.user.token)
  },
  methods: {
    onlogout () {
      // 退出提示
      this.$dialog
        .confirm({
          title: '确认退出么？'
        })
        .then(() => {
          // 确认退出：清除状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {})
    },
    // 获取用户信息
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        console.log(data)
      } catch (error) {
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    align-items: center;
    justify-content: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      .mobile {
        width: 132px;
        height: 132px;
      }
      span.text {
        margin-top: 15px;
        font-size: 28px;
        color: #ffffff;
      }
    }
  }
  .user-info {
    .base-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 231px;
      box-sizing: border-box;
      padding: 76px 32px 23px;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #ffffff;
        }
      }
    }
    .data-states {
      // height: 130px;
      display: flex;
      align-items: center;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 130px;
        color: #ffffff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    margin-bottom: 9px;
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    color: #d86262;
    font-size: 30px;
    text-align: center;
    margin-top: 9px;
  }
}
</style>
