<template>
  <div class="update-birthday">
    <!--
        currentDate 双相绑定了日期选择器
        设置日期选择器的默认值
        同步日期选择器选择的日期
        :max-date="maxDate"
       -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user.js'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      //   maxDate: new Date(), // 最大时间 不设置 默认十年后
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      console.log(this.currentDate.getTime())
      const currentDate = dayjs(this.currentDate.getTime()).format('YYYY-MM-DD')
      console.log(currentDate)
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁止背景点击
        message: '保存中...'
      })
      //   this.$toast(`当前值：${value}, 当前索引：${index}`)
      try {
        await updateUserProfile({ birthday: currentDate })
        // 更新视图
        this.$emit('input', currentDate)
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
.update-birthday {
  /deep/.van-picker__cancel,
  /deep/.van-picker__confirm {
    color: #3296fa;
  }
}
</style>
