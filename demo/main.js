import Vue from 'vue'
import Vonic from 'vonic'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Index from './components/Index'
import Home from './components/Home'
import Button from './components/Button'
import MdButton from './components/MdButton'
import Input from './components/Input'
import InputDefault from './components/InputDefault'
import InputFloatingLabel from './components/InputFloatingLabel'
import Search from './components/Search'
import Radio from './components/Radio'
import Checkbox from './components/Checkbox'

import Dialog from './components/Dialog'

// Layout
import List from './components/List'
import Cells from './components/Cells'
import Tabs from './components/Tabs'
import ButtonBar from './components/ButtonBar'
import Scalable from './components/Scalable'

// Advanced
import Swiper from './components/Swiper'
import SwiperDefault from './components/SwiperDefault'
import SwiperVertical from './components/SwiperVertical'
import Cascade from './components/Cascade'
import Popup from './components/Popup'
import ActionSheet from './components/ActionSheet'
import Tabbar from './components/Tabbar'
import TabbarHome from './components/tabbar/Home'
import TabbarDiscount from './components/tabbar/Discount'
import TabbarCart from './components/tabbar/Cart'
import TabbarUser from './components/tabbar/User'
import PageFromTabbar from './components/tabbar/PageFromTabbar'
import TabbarWithoutRoutes from './components/TabbarWithoutRoutes'

const routes = [
  { path: '/', component: Index },
  { path: '/home', component: Home },
  { path: '/basic/button', component: Button },
  { path: '/basic/mdButton', component: MdButton },
  { path: '/basic/input', component: Input },
  { path: '/basic/inputDefault', component: InputDefault },
  { path: '/basic/inputFloatingLabel', component: InputFloatingLabel },
  { path: '/basic/search', component: Search },
  { path: '/basic/radio', component: Radio },
  { path: '/basic/checkbox', component: Checkbox },

  { path: '/basic/dialog', component: Dialog },

  // Layout
  { path: '/layout/list', component: List },
  { path: '/layout/cells', component: Cells },
  { path: '/layout/tabs', component: Tabs },
  { path: '/layout/buttonbar', component: ButtonBar },
  { path: '/layout/scalable', component: Scalable },

  // Advanced
  { path: '/advanced/swiper', component: Swiper },
  { path: '/advanced/swiper/default', component: SwiperDefault },
  { path: '/advanced/swiper/vertical', component: SwiperVertical },

  { path: '/advanced/cascade', component: Cascade },
  { path: '/advanced/popup', component: Popup },
  { path: '/advanced/actionSheet', component: ActionSheet },
  {
    path: '/advanced/tabbar',
    component: Tabbar,
    children: [
      { path: 'home', component: TabbarHome },
      { path: 'discount', component: TabbarDiscount },
      { path: 'cart', component: TabbarCart },
      { path: 'user', component: TabbarUser }
    ]
  },
  { path: '/pageFromTabbar',component: PageFromTabbar },
  { path: '/advanced/tabbarWithoutRoutes', component: TabbarWithoutRoutes }
]

/**
 * !! Head up
 * Using sessionStorage, Vonic.app.pageContentScrollTop, Vonic.app.nextDirection
 * to handle history view transition and preview page position
 *
 */

import sess from './sess'

const beforeEach = (toRoute, fromRoute, next) => {
  const to = toRoute.path
  const from = fromRoute.path
  const scrollTop = Vonic.app.pageContentScrollTop()

  const h = sess.get(to)
  if (h && h.history || (from && from.indexOf(to) === 0)) {
    Vonic.app.nextDirection('back')
    h.history = false
    sess.set(to, h)
  } else {
    sess.set(from || '/', {
      history: true,
      scrollTop: scrollTop
    })
    Vonic.app.nextDirection('forward')
  }
  next()
}

const afterEach = (toRoute, fromRoute) => {
  const to = toRoute.path
  const from = fromRoute.path
  // [Custom Business] Never use history scrollTop when '/' => '/home'
  if (from == '/' && to == '/home') return

  const h = sess.get(to)
  if (h && h.scrollTop) {
    Vue.nextTick(() => {
      Vonic.app.pageContentScrollTop(h.scrollTop)
    })
  }
}

// Register beforeEach and afterEach Hooks
Vonic.app.setConfig('beforeEach', beforeEach)
Vonic.app.setConfig('afterEach', afterEach)

Vue.use(Vonic.app, {
  routes: routes
})
