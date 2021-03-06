import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

// import Quasar, * as All from 'quasar'
import VueSocketio from 'vue-socket.io'
import VueChartJs from 'vue-chartjs'
Vue.component('pie-chart', {
  extends: VueChartJs.Pie,
  props: ['label', 'data', 'color', 'options'],
  computed: {
    chartData: function () {
      return this.data
    }
  },
  watch: {
    data: function () {
      // this._chart.destroy() 20181020
      // this.renderChart(this.data, this.options);
      this.renderPieChart()
    }
  },
  mounted () {
    this.renderPieChart()
  },
  methods: {
    renderPieChart: function () {
      if (this.$data._chart) {
        this.$data._chart.destroy()
      }
      // console.log(this.chartData)
      this.renderChart({'labels': this.label,
        'datasets': [{
          backgroundColor: this.color,
          data: this.chartData
        }]
      },
      this.options)
    }
  }
})
Vue.component('line-chart', {
  extends: VueChartJs.Line,
  props: ['labels', 'data', 'options'],
  computed: {
    chartData: function () {
      return this.data
    }
  },
  watch: {
    data: function () {
      // this.renderChart(this.data, this.options);
      // console.log(5555555555555555555555555)
      // console.log({'labels': this.labels, 'datasets': this.chartData})
      this.renderChart({'labels': this.labels, 'datasets': this.chartData}, this.options)
    }
  },
  mounted () {
    // console.log(5555555555555555555555555)
    // console.log({'labels': this.labels, 'datasets': this.chartData})
    this.renderChart({'labels': this.labels, 'datasets': this.chartData}, this.options)
    // this.htmlLegend = this.generateLegend()
  }
})
Vue.component('line-chart2', {
  extends: VueChartJs.Line,
  props: ['datasets', 'options'],
  data: () => ({
    htmlLegend: null
  }),
  mounted () {
    // console.log(11111111111)
    // console.log(this.datasets)
    this.renderChart(this.datasets, this.options)
    // this.htmlLegend = this.generateLegend()
  }
})
Vue.component('line-chart3', {
  extends: VueChartJs.Line,
  props: ['labels', 'data', 'options', 'labelData', 'backgroundColor'],
  computed: {
    chartData: function () {
      return this.data
    }
  },
  watch: {
    data: function () {
      // this._chart.destroy()
      // this.renderChart(this.data, this.options);
      this.renderLineChart()
    }
  },
  mounted () {
    this.renderLineChart()
    // this.htmlLegend = this.generateLegend()
  },
  methods: {
    renderLineChart: function () {
      if (this.$data._chart) {
        this.$data._chart.destroy()
      }
      // // console.log(5555555555555555555555555)
      // // console.log({'labels': this.labels, 'datasets': this.chartData})
      this.renderChart({'labels': this.labels,
        'datasets': [{
          data: this.chartData,
          label: this.labelData,
          backgroundColor: this.backgroundColor
        }]
      }, this.options)
    }
  }
})
Vue.use(VueSocketio, 'http://localhost:3001')

// Vue.config.productionTip = false
/* Vue.use(Quasar, { // Install Quasar Framework
  components: All,
  directives: All
}) */

Vue.use(VueRouter)
export default function (/* { store } */) {
  const Router = new VueRouter({
    /*
     * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
     *
     * If you decide to go with "history" mode, please also set "build.publicPath"
     * to something other than an empty string.
     * Example: '/' instead of ''
     */

    // Leave as is and change from quasar.conf.js instead!
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    scrollBehavior: () => ({ y: 0 }),
    routes
  })
  return Router
  // export default Router
}
