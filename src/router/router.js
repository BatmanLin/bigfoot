import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Setting from '../components/setting'
import Realtime from '../components/realtime'
import Playback from '../components/playback'
import HistoryPlayback from '../components/historyPlayback'
Vue.use(VueRouter)

const routes = [
  {
    path: '/', 
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/setting',
        name: 'Setting',
        component: Setting
      },
      {
        path: '/realtime',
        name: 'Realtime',
        component: Realtime
      },
      {
        path: '/historyplayback',
        name: 'historyplayback',
        component: HistoryPlayback
      }
    ]
  },
]
const router = new VueRouter({
  routes
})

export default router
