<template>
  <div class="update-photo">
    <img class="img" :src="img" alt="" ref="img" />

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">确定</div>
    </div>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user.js'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    // vue 中操作 document 需要使用 ref
    // const image = document.getElementById('image')
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      // options
      viewMode: 1,
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图框比例
      autoCropArea: 1, // 自动截取区域比例
      cropBoxMovable: false, // 截图框是否可以移动
      cropBoxResizable: false, // 截图区域是否可以缩放
      background: false, // 默认背景
      movable: true // 默认是 true 画布背景是否可以移动
    })
  },
  methods: {
    onConfirm () {
      // 如果是基于服务端的裁切，则使用：[getData](https://github.com/fengyuanchen/cropperjs#getdatarounded) 方法，该方法得到裁切的区域参数。
      //   console.log(this.cropper.getData())
      //   如果是纯客户端的图片裁切，则使用：getCroppedCanvas方法，该方法得到裁切之后的图片对象（类似于URL.createObjectURL 方法得到的文件对象）。
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁止背景点击
        message: '保存中...'
      })
      try {
        // 错误的用法
        // 如果接口要求是 Content-Type 是 application/json
        // 则传递普通 js 对象
        // await updateUserPhoto({ photo: blob })

        // 如果接口要求的是 Content-Type 是 multipart/form-data
        // 则必须传递 FromData 对象
        console.log(blob)
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        console.log(data)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', data.data.photo)
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    display: block;
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    .cancel,
    .confirm {
      width: 90px;
      width: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
