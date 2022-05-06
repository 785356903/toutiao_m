<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template v-if="isRemoveHistory">
        <span @click="$emit('remove-all-history')">全部删除</span>
        &emsp;
        <span @click="isRemoveHistory = false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="isRemoveHistory = true" />
    </van-cell>
    <van-cell
      v-for="(title, index) in searchHistories"
      :key="index"
      :title="title"
      @click="removeAllHistory(title, index)"
    >
      <van-icon name="close" v-show="isRemoveHistory" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isRemoveHistory: false
    }
  },
  computed: {},
  watch: {
    searchHistories: {
      handler (val) {
        if (val.length < 1) {
          this.isRemoveHistory = false
        }
      },
      // 这里是关键，代表递归监听 demo 的变化
      deep: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    removeAllHistory (title, index, isAll = this.isRemoveHistory) {
      this.$emit('remove-history', title, index, isAll)
    }
  }
}
</script>

<style scoped lang="less"></style>
