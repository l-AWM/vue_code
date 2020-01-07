//发布阶段插件
const prodPlugins = []
//development production
if(process.env.NDOE_ENV === 'production'){
  prodPlugins.push('transform-remove-console');
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins":[...prodPlugins] 
}
