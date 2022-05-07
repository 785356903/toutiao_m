<template>
  <div class="myCollectOrHistory-container">
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.go(-1)"
      :placeholder="true"
    />
    <van-tabs class="channel-tabs" v-model="active" animated swipeable sticky>
      <van-tab :title="item" v-for="(item, index) in title" :key="index">
        <List :active="active"></List>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import List from './components/list.vue'
export default {
  name: 'MyCollectOrHistory',
  components: { List },
  props: {
    activeIndex: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return { active: this.activeIndex || 0, title: ['收藏', '历史'] }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
.myCollectOrHistory-container {
  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      height: 6;
      width: 100px;
      bottom: 8px;
      background: #3296fa;
    }
    .van-tab--active {
      color: #3296fa;
    }
    .van-tabs__nav--line.van-tabs__nav--complete {
      padding-right: 0;
    }
  }
}
</style>
