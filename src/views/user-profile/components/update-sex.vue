<template>
  <div class="update-sex">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user.js'
export default {
  name: 'UpdateSex',
  components: {},
  props: {
    value: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女']
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm (value, index) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁止背景点击
        message: '保存中...'
      })
      //   this.$toast(`当前值：${value}, 当前索引：${index}`)
      try {
        await updateUserProfile({ gender: index })
        // 更新视图
        this.$emit('input', index)
        // 关闭弹窗
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-sex {
  /deep/.van-picker__cancel,
  /deep/.van-picker__confirm {
    color: #3296fa;
  }
}
</style>
