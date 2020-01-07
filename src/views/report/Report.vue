<template>
  <div id="echars_main" style="width: 600px;height:400px;"></div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
    data(){
        return{
            //需要绑定的数据
            options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
    async mounted(){ //dom结构渲染完
        //初始化echarts实例
         var myChart = echarts.init(document.getElementById('echars_main'))

         const {data: res} = await this.$http.get('reports/type/1');
        
        if(res.meta.status !== 200) return this.$message.error('获取数据失败');
        
         //准备数据和配置项
        const result = _.merge(res.data,this.options)
         var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
         //展示数据
          myChart.setOption(result);
    }
}
</script>

<style>
</style>