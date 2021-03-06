import Vue from 'vue'
import Element from 'element-ui'
import scroll from 'vue-seamless-scroll'
import Icon from 'vue-svg-icon/Icon.vue'
import VueAMap from 'vue-amap'
import '@/assets/iconfont/iconfont.css'//全局引用iconfont
import '@/theme/element-#41B883/index.css'//全局引用elementui
import '@/assets/styl/index'
import '@/mock'
import VueParticles from 'vue-particles'
import VueCountUp from 'vue-countupjs'
import JsBarcode from 'jsbarcode'  //条形码

import App from '@/App'
import { router } from '@/router'
import '@/router/routerControl'
import store from '@/store'

import $ from 'jquery/dist/jquery.slim.min' //全局引用jquery
window.$ = $

import dayjs from 'dayjs' //全局引用dayjs
window.dayjs = dayjs;
import 'lodash'

import i18n from '@/lang'

// 图片查看器
import Viewer from 'viewerjs/dist/viewer'
import 'viewerjs/dist/viewer.min.css'
window.Viewer = Viewer;

Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Vue.component('icon', Icon)

Vue.use(VueParticles)
Vue.use(VueCountUp)
Vue.use(scroll)
Vue.use(Element, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(VueAMap)
// 初始化vue-amap
VueAMap.initAMapApiLoader({
	// 高德的key
	key: '8120b756a0a5a0cc9a543412fc5b2613',
	// 插件集合
	plugin: ['AMap.Geocoder', 'AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
	uiVersion: '1.0' // 版本号
});

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
