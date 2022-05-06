<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- 搜索 -->
      <van-button
        class="search-btn"
        round
        slot="title"
        type="info"
        size="small"
        icon="search"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- 通过v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签 -->
    <!-- animated 属性可以开启切换标签内容是的转场动画 -->
    <!-- swipeable 属性可以开启华东切换标题页 -->
    <van-tabs
      class="channel-tabs"
      v-model="active"
      animated
      swipeable
      sticky
      offset-top="48px"
    >
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 文章列表 -->
        <Articlelist :channel="item"></Articlelist>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道列表 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :myChannels="channels"
        :active="active"
        @update-active="onUpdateActive"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import Articlelist from '@/views/home/components/article-list.vue'
import ChannelEdit from '@/views/home/components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'HomeIndex',
  components: { Articlelist, ChannelEdit },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false // 频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // console.log(data)
        // this.channels = data.data.channels
        let channels = []
        if (this.user) {
          // 已登录，请求货获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断本地是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          // 有拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (error) {
        this.$toast('获取频道数据失败，请稍后再试')
      }
    },
    // 子组件频道切换
    onUpdateActive (index, isChennelEditShow = true) {
      // 更新激活频道
      this.active = index
      // 关闭频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 98px;
  padding-bottom: 104px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background: #5babfb;
    border: none;
    font-size: 28px;
    /deep/.van-icon {
      font-size: 32px;
    }
  }
  /deep/.channel-tabs {
    position: relative;
    .van-tabs__wrap {
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      font-size: 30px;
      color: #777777;
      border-right: 1px solid #edeff3;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px;
      height: 6;
      bottom: 8px;
      background: #3296fa;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav--line.van-tabs__nav--complete {
      padding-right: 0;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background: #ffffff;
      opacity: 0.9;
      i.toutiao-gengduo {
        font-size: 40px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url('~@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
  }
}
</style>
