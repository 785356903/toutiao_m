<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 个人信息 -->
    <van-cell-group>
      <van-cell
        class="avatar-cell"
        title="头像"
        value="内容"
        is-link
        @click="$refs.file.click()"
      >
        <van-image
          class="avatar"
          slot="default"
          round
          fit="cover"
          :src="userProfile.photo"
        />
      </van-cell>
      <van-cell
        title="昵称"
        :value="userProfile.name"
        is-link
        @click="isUpdateNameShow = true"
      />
      <van-cell
        title="性别"
        :value="userProfile.gender == 1 ? '女' : '男'"
        is-link
        @click="isUpdateSexShow = true"
      />
      <van-cell
        title="生日"
        :value="userProfile.birthday"
        is-link
        @click="isUpdateBirthdayShow = true"
      />
    </van-cell-group>

    <!-- 编辑昵称的弹出层 -->
    <van-popup
      v-model="isUpdateNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdateName
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="userProfile.name"
      ></UpdateName>
    </van-popup>
    <!-- 编辑性别弹出层 -->
    <van-popup v-model="isUpdateSexShow" position="bottom">
      <UpdateSex
        v-if="isUpdateSexShow"
        @close="isUpdateSexShow = false"
        v-model="userProfile.gender"
      ></UpdateSex>
    </van-popup>
    <!-- 生日编辑弹出层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirathday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="userProfile.birthday"
      ></UpdateBirathday>
    </van-popup>
    <!-- 头像预览弹出层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      :style="{ height: '100%' }"
      position="bottom"
    >
      <UpdatePhoto
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="userProfile.photo = $event"
      ></UpdatePhoto>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'
import UpdateName from './components/update-name.vue'
import UpdateSex from './components/update-sex.vue'
import UpdateBirathday from './components/update-birathday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateSex, UpdateBirathday, UpdatePhoto },
  data () {
    return {
      userProfile: {}, // 个人信息
      isUpdateNameShow: false, // 昵称弹框控制
      isUpdateSexShow: false, // 性别弹框控制
      isUpdateBirthdayShow: false, // 生日弹框控制
      isUpdatePhotoShow: false, // 头像框控制
      img: null
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁止背景点击
        message: '加载中...'
      })
      try {
        const { data } = await getUserProfile()
        this.userProfile = data.data
      } catch (error) {
        this.$toast.fail('获取信息失败')
      }
      this.$toast.clear()
    },
    /*
    URL对象是硬盘（SD卡等）指向的一个文件路径，如果我们做文件上传的时候，
    想在没有上传服务器端的情况下看到上传图片的效果图的时候，
    就可以通过var url = window.URL.createObjectURL(files[0])；
    获得一个http格式的url路径，这个时候就可以设置img中的src进行显示了。
     */
    // bold参数是一个file对象或者bold对象。
    // objectURL是生成的对象URL，通过这个URL，可以获取到所指定文件的完整内容
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      //  展示预览图片弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决方法就是每次使用完毕之后，把他的 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar-cell {
    /deep/.van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
