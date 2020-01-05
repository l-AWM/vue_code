import Vue from 'vue'
import { Button ,Form } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {FormItem} from 'element-ui'

import {Input} from 'element-ui'

import {Message, MessageBox} from 'element-ui';

import {Container,Header,Aside,Main} from 'element-ui';

import {Menu,MenuItem,Submenu,MenuItemGroup} from 'element-ui'

import {Breadcrumb,BreadcrumbItem} from 'element-ui'

import {Card} from 'element-ui'

import {Row,Col} from 'element-ui'

import {Table,TableColumn} from 'element-ui'

import {Switch} from 'element-ui'

import {Tooltip} from 'element-ui'

import {Pagination } from 'element-ui'

import {Dialog} from 'element-ui'

import {Alert,Tag} from 'element-ui'

import {Tree} from 'element-ui'

import {Select, Option} from 'element-ui'

import {Cascader} from 'element-ui'

Vue.use(Cascader)

Vue.use(Option)

Vue.use(Select)

Vue.use(Tree)

Vue.use(Alert)

Vue.use(Tag)

Vue.use(Dialog)

Vue.use(Pagination)

Vue.use(Tooltip)

Vue.use(Switch)

Vue.use(Table)
Vue.use(TableColumn)

Vue.use(Row)
Vue.use(Col)

Vue.use(Button)
//Vue.use(Element)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)
//挂载到vue上
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;