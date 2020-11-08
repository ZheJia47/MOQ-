<template>
  <div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      <h5>參數設定</h5>
      <div class="col-md-12">
        部門: <select v-model="departmentID">
          <option v-for="department in departmentList" v-bind:key="department" :value="department">
          {{ department }}
          </option>
        </select>
        <select v-model="zone">
          <option v-for="zoneLabel in zoneList" v-bind:key="zoneLabel" :value="zoneLabel">
          {{ zoneLabel }}
          </option>
        </select>
      </div>
      <div v-if="period === 'weekly'">
        <div class="col-lg-6 col-sm-12">
          年份: <select v-model="selectedYear">
            <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
          </select>
          週數: <select v-model="selectedWeek">
            <option v-for="week in weeksInYear" v-bind:key="week" :value="week"> {{week}}</option>
          </select>
          {{dateFrom}} ~ {{dateTo}}
        </div>
      </div>
      <div v-else-if="period === 'tenDays'">
        <div class="col-lg-6 col-sm-12">
          選擇月份:
          <input type="month" name="yearMonth" v-model="yearMonth" />
        </div>
        <div class="col-lg-6 col-sm-12">
          <select id="tenDays" name="tenDays" v-model="selectedTenDays">
            <option value="early">上旬</option>
            <option value="middle">中旬</option>
            <option value="late">下旬</option>
          </select>
          {{dateFrom}} ~ {{dateTo}}
        </div>
      </div>
      <div v-else-if="period === 'monthly'">
        <div class="col-lg-6 col-sm-12">
          選擇月份:
          <input type="month" name="yearMonth" v-model="yearMonth" /> {{dateFrom}} ~ {{dateTo}}
        </div>
      </div>
      <div v-else-if="period === 'quarterly'">
        <div class="col-lg-6 col-sm-12">
          年份: <select v-model="selectedYear">
            <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
          </select>
          季別: <select v-model="selectedQuarter">
            <option v-for="quarter in 4" v-bind:key="quarter" :value="quarter"> {{quarter}}</option>
          </select>
          {{dateFrom}} ~ {{dateTo}}
        </div>
      </div>
      <div v-else-if="period === 'yearly'">
        <div class="col-lg-6 col-sm-12">
          年份: <select v-model="selectedYear">
            <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
          </select>
          {{dateFrom}} ~ {{dateTo}}
        </div>
      </div>
      <div v-else>
        <div class="col-lg-6 col-sm-12">
          <input type="date" v-model="selectedDateFrom" />
          -
          <input type="date" v-model="selectedDateTo" />
        </div>
      </div>
    </div>
    <div class="row center-block">
      <h5>成品料號 生產報表 - {{type}}</h5>
      <h5 v-if="status !== null">({{status}})</h5>
      <div class="col-md-12">
        <q-table
        :data="rows"
        :columns="columns"
        :config="config"
        @refresh="refresh"
        @rowclick="rowclick"
      >
      </q-table>
      </div>
    </div>
  </section>
<!--   <modal name="demo-login" transition="pop-out" @before-open="beforeOpen" @before-close="beforeClose">
    入庫數量:
    <input type="Number" pattern="[0-9]" v-model.lazy="warehousing"></input>
    <br>
    狀態: {{status}}
    <br>
    <span>視窗關閉之後, 會重讀後台資料庫取得最新資料</span>
  </modal> -->
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
// import warehousing from './WarehousingEdit.vue'
/*
moment.updateLocale('zh-tw', {week: {dow: 1}})
*/
// import edit from './RegisterEdit'

// the default period need to be last tendays
var date = moment().date()
var tenDays
var yearmonth
/*
if (date <= 10) {
  tenDays = 'late'
  yearmonth = moment().month(moment.month() - 1).format('YYYY-MM')
}
else if (date <= 20) {
  tenDays = 'early'
  yearmonth = moment().month(moment().month()).format('YYYY-MM')
}
else {
  tenDays = 'middle'
  yearmonth = moment().month(moment().month()).format('YYYY-MM')
}
*/
if (date <= 10) {
  tenDays = 'late'
  yearmonth = moment().format('YYYY-MM')
} else if (date <= 20) {
  tenDays = 'early'
  yearmonth = moment().format('YYYY-MM')
} else {
  tenDays = 'middle'
  yearmonth = moment().format('YYYY-MM')
}

export default {
  name: 'Tables',
  props: ['period'],
  data: function () {
    return {
      type: '明細',
      status: null,
      departmentID: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
      selectedWeek: moment().week() - 1,
      selectedYear: moment().year(),
      selectedTenDays: tenDays,
      yearMonth: yearmonth,
      selectedQuarter: moment().quarter() - 1,
      selectedDateFrom: moment().format('YYYY-MM-DD'),
      selectedDateTo: moment().format('YYYY-MM-DD'),
      rows: [],
      config: {
        // [REQUIRED] Set the row height
        // rowHeight: '50px',
        // (optional) Title to display
        // title: 'Data Table',
        // (optional) No columns header
        noHeader: false,
        // (optional) Display refresh button
        refresh: false,
        // (optional)
        // User will be able to choose which columns
        // should be displayed
        columnPicker: true,
        // (optional) How many columns from the left are sticky
        leftStickyColumns: 0,
        // (optional) How many columns from the right are sticky
        rightStickyColumns: 0,
        // (optional)
        // Styling the body of the data table;
        // "minHeight", "maxHeight" or "height" are important
        // bodyStyle: {
        //   maxHeight: '500px'
        // },
        // (optional) By default, Data Table is responsive,
        // but you can disable this by setting the property to "false"
        responsive: true,
        // (optional) Use pagination. Set how many rows per page
        // and also specify an additional optional parameter ("options")
        // which forces user to make a selection of how many rows per
        // page he wants from a specific list
        pagination: {
          rowsPerPage: 20,
          options: [20, 50, 100, 200, 500]
        },
        // (optional) Select one or more rows for an action
        // "single" adds a column with radio buttons for single row selection
        // "multiple" adds a column with checkboxes for multiple row selection
        // omitting the property will result in no selection column at all
        // selection: 'multiple',
        // (optional) Override default messages when no data is available
        // or the user filtering returned no results.
        messages: {
          noData: '沒有資料可供顯示.',
          noDataAfterFiltering: '沒有資料可供顯示. 請重新檢視您的搜尋條件.'
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          columns: '欄位顯示',
          allCols: '所有欄位',
          rows: '顯示',
          selected: {
            singular: 'item selected.',
            plural: 'items selected.'
          },
          clear: '清除',
          search: '搜尋',
          all: '全部'
        }
      },
      columns: [
        {
          label: '成品料號',
          field: 'product',
          width: '100px',
          filter: true,
          type: 'string',
          sort: true
        },
        {
          label: '成品名稱',
          field: 'prodName',
          width: '100px',
          filter: true,
          type: 'string'
        },
        {
          label: '警<BR>報',
          field: 'totalAlm',
          width: '40px',
          filter: true,
          type: 'string'
        },
        {
          label: '換<BR>模',
          field: 'changeMold',
          width: '40px',
          filter: true,
          type: 'string'
        },
        {
          label: '穴<BR>數',
          field: 'cavities',
          width: '40px'
        },
        {
          label: '自動生產',
          field: 'durationStr',
          width: '100px',
          type: 'string'
        },
        {
          label: '生產模數',
          field: 'moldCount',
          width: '100px'
        },
        {
          label: '應產數量pcs',
          field: 'targetCount',
          width: '120px'
        },
        {
          label: '入庫數量pcs',
          field: 'warehousing',
          width: '120px'
        },
        {
          label: '不良數量pcs',
          field: 'badNum',
          width: '120px'
        },
        {
          label: '不良率 %',
          field: 'badRate',
          width: '5%'
        },
        {
          label: '標準<BR>週期S',
          field: 'standard',
          width: '70px',
          type: 'string'
        },
        {
          label: '最短<BR>週期S',
          field: 'min',
          width: '70px',
          type: 'string'
        },
        {
          label: '平均<BR>週期S',
          field: 'average',
          width: '70px',
          type: 'string'
        },
        {
          label: '週期<BR>效率％',
          field: 'performance',
          width: '70px',
          type: 'string'
        }
      ]
    }
  },
  computed: {
    dateFrom: function () {
      if (this.period === 'weekly') {
        return moment(`${this.selectedYear}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
      } else if (this.period === 'tenDays') {
        if (this.selectedTenDays === 'early') {
          return moment(this.yearMonth).date(1).format('YYYY-MM-DD')
        } else if (this.selectedTenDays === 'middle') {
          return moment(this.yearMonth).date(11).format('YYYY-MM-DD')
        } else {
          return moment(this.yearMonth).date(21).format('YYYY-MM-DD')
        }
      } else if (this.period === 'monthly') {
        return moment(this.yearMonth).date(1).format('YYYY-MM-DD')
      } else if (this.period === 'quarterly') {
        if (this.selectedQuarter === 1) {
          return moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 2) {
          return moment(this.selectedYear, 'YYYY').month(3).date(1).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 3) {
          return moment(this.selectedYear, 'YYYY').month(6).date(1).format('YYYY-MM-DD')
        } else {
          return moment(this.selectedYear, 'YYYY').month(9).date(1).format('YYYY-MM-DD')
        }
      } else if (this.period === 'yearly') {
        return moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
      } else {
        return moment(this.selectedDateFrom).format('YYYY-MM-DD')
      }
    },
    dateTo: function () {
      if (this.period === 'weekly') {
        return moment(`${this.selectedYear}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
      } else if (this.period === 'tenDays') {
        if (this.selectedTenDays === 'early') {
          return moment(this.yearMonth).date(10).format('YYYY-MM-DD')
        } else if (this.selectedTenDays === 'middle') {
          return moment(this.yearMonth).date(20).format('YYYY-MM-DD')
        } else {
          return moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
        }
      } else if (this.period === 'monthly') {
        return moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
      } else if (this.period === 'quarterly') {
        if (this.selectedQuarter === 1) {
          return moment(this.selectedYear, 'YYYY').month(2).date(31).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 2) {
          return moment(this.selectedYear, 'YYYY').month(5).date(30).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 3) {
          return moment(this.selectedYear, 'YYYY').month(8).date(30).format('YYYY-MM-DD')
        } else {
          return moment(this.selectedYear, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        }
      } else if (this.period === 'yearly') {
        return moment(this.selectedYear, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
      } else {
        return moment(this.selectedDateTo).format('YYYY-MM-DD')
      }
    },
    weeksInYear: function () {
      return moment(`${this.selectedYear}`, 'YYYY').weeksInYear()
    }
  },
  filters: {
  },
  watch: {
    period: function () {
      switch (this.period) {
        case 'weekly':
          this.type = '週'
          break
        case 'tenDays':
          this.type = '旬'
          break
        case 'monthly':
          this.type = '月'
          break
        case 'quarterly':
          this.type = '季'
          break
        case 'yearly':
          this.type = '年'
          break
        case 'period':
          this.type = '自訂期間'
          break
      }
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    },
    selectedYear: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    },
    selectedWeek: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    },
    yearMonth: function () {
      // alert(this.yearWeek)
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    },
    selectedTenDays: function () {
      // alert(this.yearWeek)
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    },
    selectedQuarter: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    },
    selectedDateFrom: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    },
    selectedDateTo: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    }
  },
  mounted () {
    switch (this.period) {
      case 'weekly':
        this.type = '週'
        break
      case 'tenDays':
        this.type = '旬'
        break
      case 'monthly':
        this.type = '月'
        break
      case 'quarterly':
        this.type = '季'
        break
      case 'yearly':
        this.type = '年'
        break
      case 'period':
        this.type = '自訂期間'
        break
    }

    this.$nextTick(() => {
      $.get('/api/getDepartmentList/' + this.departmentID, {}, (results) => {
      // $.get('/api/getDepartmentList', {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
        } else {
          var arr = Object.keys(results.data.department)
          arr.forEach((val, index) => {
            this.departmentList.push(val)
          })
          arr = Object.keys(results.data.zone)
          arr.forEach((val, index) => {
            this.zoneList.push(val)
          })
          this.departmentList.sort()
          var from = moment(this.dateFrom).toDate()
          var to = moment(this.dateTo).toDate()
          this.zoneList.sort()
          this.zone = this.zoneList[0]
          renderTable(this.rows, this.departmentID, from, to)
        }
      })
    })
  },
  methods: {
    rowclick (event) {
      // // console.log(event)
    },
    refresh (done) {
      // // console.log('refresh')
      setTimeout(() => {
        done()
      }, 3000)
    },
    range: function (start, end) {
      var array = []
      var j = 0
      for (var i = start; i <= end; i++, j++) {
        array[j] = i
      }
      return array
    }
  }
}

function renderTable (rows, departmentID, from, to) {
  // // console.log([departmentID, from, to])
  // init the records in the rows
  rows.splice(0, rows.length)

  var records
  $.get('/api/getPeriodMachineRecords/' + departmentID + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      records = results.data
      // // console.log(JSON.stringify(results.data, null, 2))
      // console.log(results.data)
      for (var machineID in records) {
        // sorting the records by trig time
        records[machineID] = records[machineID].sort(function (a, b) {
          return a.trigTime > b.trigTime ? 1 : -1
        })

        var initFlag = true
        var prevTotalAlm
        var prevProduct
        var prevCavities
        var totalDuration
        var totalMoldCount
        var prevTargetCount
        var prevBadNum
        var prevBadRate
        var prevStandard
        var min
        var average // totalDuration / totalMoldCount
        var performance // prevStandard / average
        var prevDeadline
        var prevRecordID
        var prevWarehousing
        var prevProdName

        var ongoingFlag = false

        records[machineID].forEach(record => {
          // // console.log(record)
          if (record.product === undefined) {
            return
          }

          // initilize the new record
          if (initFlag === true) {
            prevProduct = record.product
            totalDuration = 0
            totalMoldCount = 0
            min = record['min']

            initFlag = false
          }
          if (prevProduct !== record.product) {
            if (totalMoldCount === 0) {
              average = 0
              performance = 0
            } else {
              average = ((totalDuration / 10000000) / totalMoldCount).toFixed(2)
              performance = (prevStandard * 100 / average).toFixed(2)
            }

            rows.splice(0, 0, {
              _id: prevRecordID,
              machineID: machineID,
              totalAlm: prevTotalAlm || '',
              product: prevProduct || '',
              cavities: prevCavities || '',
              prodName: prevProdName || '',
              durationStr: moment.duration(totalDuration / 10000, 'ms').format('hh:mm:ss', {trim: false}), // 排班工作時間累計
              duration: totalDuration,
              moldCount: totalMoldCount || '',
              targetCount: prevTargetCount || '',
              warehousing: prevWarehousing || '',
              badNum: prevBadNum || '',
              badRate: prevBadRate || '',
              standard: prevStandard || '',
              min: min || '',
              average: average || '',
              performance: performance || '',
              deadline: prevDeadline || ''
            })

            prevProduct = record.product
            totalDuration = 0
            totalMoldCount = 0
            if (records['min'] !== 0) {
              min = record['min']
            }
            ongoingFlag = true
          } else {
            if (records['min'] !== 0) {
              if (min === 0) {
                min = record['min']
              } else if (record['min'] < min) {
                min = record['min']
              }
            }
            ongoingFlag = true
          }

          // do everytime, no matter product change
          totalDuration += record.duration
          totalMoldCount += record.moldCount
          prevTotalAlm = record.totalAlm
          prevCavities = record.cavities
          prevProdName = record.prodName
          prevTargetCount = record.targetCount
          prevBadNum = record.badNum
          prevBadRate = record.badRate
          prevStandard = record.standard
          prevDeadline = record.deadline
          prevRecordID = record._id
          prevWarehousing = record.warehousing
        })

        if (ongoingFlag === true) {
          // // console.log('has ongoing record')
          if (totalMoldCount === 0) {
            average = 0
            performance = 0
          } else {
            average = ((totalDuration / 10000000) / totalMoldCount).toFixed(2)
            performance = (prevStandard * 100 / average).toFixed(2)
          }

          rows.splice(0, 0, {
            _id: prevRecordID,
            machineID: machineID,
            totalAlm: prevTotalAlm || '',
            product: prevProduct || '',
            cavities: prevCavities || '',
            prodName: prevProdName || '',
            durationStr: moment.duration(totalDuration / 10000, 'ms').format('hh:mm:ss', {trim: false}), // 排班工作時間累計
            duration: totalDuration,
            moldCount: totalMoldCount || '',
            targetCount: prevTargetCount || '',
            warehousing: prevWarehousing || '',
            badNum: prevBadNum || '',
            badRate: prevBadRate || '',
            standard: prevStandard || '',
            min: min || '',
            average: average || '',
            performance: performance || '',
            deadline: prevDeadline || ''
          })
        }
      }
      var docs = {}
      rows.forEach(row => {
        if (docs[row.product] === undefined) {
          docs[row.product] = row
        } else {
          var doc = docs[row.product]
          doc.totalAlm += row.totalAlm
          doc.moldCount += row.moldCount
          doc.totalMoldCount += row.totalMoldCount
          doc.warehousing += row.warehousing
          doc.badNum += row.badNum
          doc.duration += row.duration

          if (doc.min === 0) {
            doc.min = row.min
          } else if (Number(row.min) > 0) {
            if (Number(row.min) < Number(doc.min)) {
              // console.log([row.min, doc.min])
              doc.min = row.min
            }
          }
        }
      })
      rows.splice(0, rows.length)
      // console.log(docs)
      for (var product in docs) {
        /* var ind = -1
        var resul = (records[machineID].filter(function (val, index, arr) {
          // console.log(index + '      ' + arr.length)
          // console.log(val)
          if (val.hasOwnProperty('prodName')) {
            if (val['product'] === docs[product].product) {
              if (ind < 0) {
                ind = index
              }
              return val.prodName
            }
          }
        }))[0]
        // console.log('product')
        // console.log(product)
        // console.log(docs)
        if (docs[product].product !== '') {
          // console.log(resul.hasOwnProperty('prodName'))
        } */
        average = ((docs[product].duration / 10000000) / docs[product].moldCount).toFixed(2)
        performance = (docs[product].standard * 100 / average).toFixed(2)
        // console.log(product)
        if (docs[product].product !== '') {
          rows.splice(0, 0, {
            _id: docs[product]._id,
            totalAlm: docs[product].totalAlm,
            product: docs[product].product,
            prodName: docs[product].prodName,
            cavities: docs[product].cavities,
            durationStr: moment.duration(docs[product].duration / 10000, 'ms').format('hh:mm:ss', {trim: false}), // 排班工作時間累計
            moldCount: docs[product].moldCount,
            targetCount: (docs[product].moldCount * docs[product].cavities),
            warehousing: docs[product].warehousing,
            badNum: docs[product].badNum,
            badRate: `${((docs[product].badNum / docs[product].moldCount) * 100).toFixed(2)}%`,
            standard: docs[product].standard,
            min: Math.round(docs[product].min * 10) / 10,
            average: Math.round(average * 10) / 10,
            performance: Math.round(performance * 10) / 10
          })
        }
      }
    }
  })
}
</script>

<style>
</style>
