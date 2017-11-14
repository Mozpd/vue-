import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  //用于存放数据
  state: {
    sideBarState: false,
    headerTitle: '默认的头部标题'
  },
  //用于改变状态
  mutations: {
    changeSideBarState (state, boolean) {
      state.sideBarState = boolean
    },
    changeHeaderTitle (state, str) {
      state.headerTitle = str
    }
  },
  //用于改变状态 异步
  actions: {
    // es6解构写法
    changeSideBarState ({commit}, status) {
      commit('changeSideBarState', status)
    },
    changeHeaderTitle ({commit}, str) {
      commit('changeHeaderTitle', str)
    }
  },
  //也是用于存放数据 但存的是计算后的数据
  getters: {
    getSideBarState (state) {
      return state.sideBarState
    },
    getHeaderTitle (state) {
      return state.headerTitle
    }
  }
})
