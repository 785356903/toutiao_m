// PostCSS 配置文件

module.exports = {
  // 配置要使用的 PostCSS 插件
  plugins: {
    // 配置使用 autoprefixer(自动添加浏览器前缀)
    // 作用：生成浏览器 CSS 样式规则前缀
    // VueCli 内部已经配置了 autoprefixer
    // 这里又配置了一遍 所以冲突了
    // autoprefixer: {
    //   // autoprefixer 插件配置
    //   // 配置要兼容环境的信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 配置使用 postcss-pxtorem 插件
    // 配置使用 postcss-pxtorem 插件
    // 作用：把 px 转为 rem
    'postcss-pxtorem': {
      // 如果你使用的是基于 lib-flexable 的 REM 适配方案，则应该设置为你的设计稿的十分之一
      // rootValue 应该为设计稿的宽度的十分之一
      // 我们的设计稿使750 应该是75
      // 但是 Vant建议设置为37.5 为什么？ 应为 Vant 是基于 375
      // 所以必须使用 37.5 唯一缺点就是 设计稿的设计要除以2
      //  rootValue： 数字：固定数值 函数：可以动态处理返回
      // postcss-pxtorem 处理每一个css文件都会 调用这个函数
      // 他会把被处理的css文件相关的信息通过参数传递给该函数
      rootValue({ file }) {
        // console.log(file); // 返回的是 css文件路径
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // * 表示所有
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
