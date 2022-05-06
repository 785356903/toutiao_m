<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- v-bind:class 语法  一个对象，对象中的 key 表示要作用的 css 类名 对象中的 value 要计算出布尔值 如果为 true 作用 false 不作用  -->
        <van-icon
          v-show="isEdit && !fixedChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      >
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 计算属性会观测内部以来数据的变化
  // 如果依赖的数据发生变化，则计算属性会重新执行
  computed: {
    ...mapState(['user']),
    //  全部频道 - 我的频道 = 推荐频道 利用计算属性 计算
    // 推荐频道 当将推荐频道添加至我的频道的时候 经过数组筛选会自动排除
    recommendChannels () {
      const channels = []
      this.allChannels.forEach((channel) => {
        //   find 遍历数组，找到满足条件的元素项
        const ret = this.myChannels.find((myChannels) => {
          return myChannels.id === channel.id
        })
        // 如果我的频道中不包含该频道，则收集到推荐频道中
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
    },
    recommendChannelsFilter () {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter((channel) => {
        //   数组的 find 方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find((myChannels) => {
          return myChannels.id === channel.id
        })
      })
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fixedChannels: [0]
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    //  获取所有频道
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toats('数据获取失败')
      }
    },
    // 添加频道
    async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 未登录，把数据存储到本地
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (error) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 已登陆，把数据放到线上
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        //   1.如果是固定频道不删除
        if (this.fixedChannels.includes(channel.id)) return
        // 编辑状态 执行删除频道
        // 参数1：要删除元素的开始索引(包括他)
        // 参数2：要删除元素的个数，如果不指定则从参数1开始 一直删除到最后
        // 2.删除频道
        this.myChannels.splice(index, 1)
        // 3.如果删除的频道 是激活频道之前的频道，则更新激活项
        if (index <= this.active) {
          // 如果删除被激活频道前面的频道 让激活频道的索引 - 1
          this.$emit('update-active', this.active - 1, true)
        }
        // 4.处理持久化
        this.deleteChannels(channel)
      } else {
        // 非编辑状态 执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    // 删除频道
    async deleteChannels (channel) {
      if (this.user) {
        // 已登录，将数据更新到线上
        try {
          await deleteUserChannel(channel.id)
        } catch (error) {
          this.$toats('删除失败，请稍后再试')
        }
      } else {
        // 未登录，将数据更新到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  },
  mounted () {
    console.log(this.recommendChannels)
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    font-size: 26px;
    width: 104px;
    height: 48px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .grid-item {
    width: 160px;
    height: 86px;
    border-radius: 6px;
  }
  /deep/.van-grid-item__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    height: 27px;
    background: #f4f5f6;
    .van-grid-item__text {
      font-size: 28px;
      color: #222222;
    }
  }
  /deep/.my-grid {
    .grid-item {
      margin-top: 0;
      .van-grid-item__text,
      .text {
        margin-top: 0;
        font-size: 28px;
        color: #222222;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .active {
        color: #f85959;
      }
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 32px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  .recommend-grid {
    .grid-item {
      /deep/.van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 24px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
