// import { Line, mixins } from 'vue-chartjs'
import { Pie } from 'vue-chartjs'
// const { reactiveProp } = mixins

export default {
  extends: Pie,
  // export default Line.extend({
  // mixins: [reactiveProp],
  // props: ['chartData', 'options'],
  mounted () {
    // this.chartData is created in the mixin
    // this.renderChart(this.chartData, this.options)
    // this.renderChart(this.chartData, this.options)
    this.renderChart({
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          backgroundColor: [
            '#41B883',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: [40, 20, 10, 10]
        }
      ]
    }, {
      responsive: true,
      maintainAspectRatio: false,
      pieceLabel: {
        mode: 'percentage',
        precision: 1
      }
    })
  }
}
