<template>
  <div class="author-user">
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.go(-1)"
      :z-index="0"
    ></van-nav-bar>
    作者信息
  </div>
</template>

<script>
import { getUserAuthor } from '@/api/user.js'
export default {
  name: 'AuthorUser',
  components: {},
  props: {
    authorId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserAuthor()
  },
  mounted () {},
  methods: {
    async loadUserAuthor () {
      const { data } = await getUserAuthor()
      console.log(data)
    }
  }
}
</script>

<style scoped lang="less"></style>
