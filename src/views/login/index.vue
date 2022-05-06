<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <van-form @submit="onSubmit" ref="loginFromRef">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入短信验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <i slot="right-icon" class="login-i">|</i>
        <template #button>
          <!-- tiem 倒计时时间 -->
          <van-count-down
            :time="6000 * 10"
            format="ss s"
            v-if="isCountDownShow"
            @finish="() => (isCountDownShow = false)"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block class="login-btn" type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, getSmsCode } from '@/api/user.js'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false // 倒计时显隐
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 表单提交
    onSubmit (values) {
      // 1.获取表单数据
      // 2.表单验证
      // 3.提交表单请求
      // 4.根据相应数据结果处理后续操作
      console.log(values)
      this.onlogin()
    },
    // 用户登录
    async onlogin () {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 0则持续展示
      })
      try {
        const { data } = await login(this.user)
        this.$toast.success('登录成功')
        this.$store.commit('setUser', data.data)
        this.$router.push('/my')
        console.log('登录成功', data)
      } catch (err) {
        console.log(err)
        if (err.response.status === 400) {
          console.log(err)
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    // 获取验证码
    async onSendSms () {
      // 1.校验手机号
      try {
        await this.$refs.loginFromRef.validate('mobile')
        console.log('验证成功')
      } catch (error) {
        return console.log('验证失败', error)
      }
      // 2.成功进入倒计时 失败提示手机号无效
      this.isCountDownShow = true
      // 3.发送信息
      try {
        const res = await getSmsCode(this.user.mobile)
        console.log('发送成功', res)
        this.$toast('发送成功')
      } catch (error) {
        // 发送失败 关闭计时器
        this.isCountDownShow = false
        if (error.response.status === 429) {
          this.$toast('发送频繁，请稍后再试')
        } else {
          console.log('发送失败,请重试', error)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .login-i {
    font-size: 30px;
    color: #ededed;
  }
  .send-sms-btn {
    display: flex;
    align-items: center;
    width: 170px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border-radius: 10px;
      border: none;
    }
  }
}
</style>
