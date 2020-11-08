// import { Line, mixins } from 'vue-chartjs'
/* import { Pie } from 'vue-chartjs'
// const { reactiveProp } = mixins
Vue.component('Pie', pie)

export default {
  extends: Pie,
  // export default Line.extend({
  // mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted () {
    // this.chartData is created in the mixin
    // this.renderChart(this.chartData, this.options)
    this.renderChart(this.chartData, this.options)
  }
} */
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}