import Vue from 'vue'
import { Button ,Form } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {FormItem} from 'element-ui';
import {Input} from 'element-ui'

import {Message} from 'element-ui';

Vue.use(Button)
//Vue.use(Element)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

//挂载到vue上
Vue.prototype.$message = Message