module.exports = {
    chainWebpack:config => {
        //发布阶段
        config.when(process.env.NODE_ENV === 'production',config => {
            config.entry('app').clear().add('./src/main-pro.js');
            
            //使用externals设置排除项
            config.set('externals',{
                vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                nprogress:'NProgress',
                'vue-quill-editor':'quill'
            })
            //html自定义渲染
            config.plugin('html').tap(args => {
                args[0].isProd = true;
                return args
            })
        })

        config.when(process.env.NODE_ENV === 'development',config => {
            config.entry('app').clear().add('./src/main.js');
            
            config.plugin('html').tap(args => {
                args[0].isProd = false;
                return args
            })
        })
    }
}