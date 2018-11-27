import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'cpnts/recommend/recommend'
import Rank from 'cpnts/rank/rank'
import Singer from 'cpnts/singer/singer'
import Search from 'cpnts/search/search'
import SingerDetail from 'cpnts/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
