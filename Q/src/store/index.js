import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'

Vue.use(Vuex)
export default function () {
  const store = new Vuex.Store({
    modules: {
      example
    }
  })
  return store
  // export default store
}
