<template>
  <div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      {{displayDate}}
    {{department}}
    {{dateFrom}} ~ {{dateTo}}
    </div>
    <div>
      期間日數{{totalDays}}日*{{hoursADay}}小時={{totalHours}}小時
    </div>
    <div>
      生產工作日數{{totalWorkDays}}天*{{hoursADay}}小時={{totalWorkHours}}小時
    </div>
    <div class="row center-block">
      <h5>{{type}}稼動報表</h5>
      <h5 v-if="status !== null">({{status}})</h5>
      <div class="col-md-12">
        <q-item>
        <q-table
        :data="rows"
          :columns="columns"
          :rows-per-page-options="config.pagination.options"
          :pagination.sync="serverPagination"
          separator="cell"
          :dense="true"
          row-key="name"
          color="amber"
          @refresh="refresh"
          @rowclick="rowclick"
      >
        <template slot="col-warehousing" slot-scope="cell">
          <q-input v-model.lazy="cell.data" error placeholder="0" @blur="changeWarehousing(cell)"/>
        </template>
      </q-table>
      </q-item>
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
// var date = moment().date()
// var tenDays
// var yearmonth
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
/* if (date <= 10) {
  tenDays = 'late'
  yearmonth = moment().format('YYYY-MM')
} else if (date <= 20) {
  tenDays = 'early'
  yearmonth = moment().format('YYYY-MM')
} else {
  tenDays = 'middle'
  yearmonth = moment().format('YYYY-MM')
} */

export default {
  name: 'Utilization',
  // props: ['period'],
  props: [
    'period',
    'department',
    'departmentS',
    'zoneS',
    'selectedDateS',
    'selectedYearWeekly',
    'selectedWeek',
    'yearMonthTenDays',
    'selectedTenDays',
    'yearMonth',
    'selectedYearQuarter',
    'selectedQuarter',
    'selectedYear',
    'selectedYearTo',
    'selectedDatePeriod',
    'selectedDatePeriodTo'
  ],
  data: function () {
    return {
      type: '日',
      status: null,
      totalDays: 30,
      hoursADay: 24,
      totalHours: 720,
      totalWorkDays: 22,
      totalWorkHours: 528,
      displayDate: '',
      departmentID: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
      selectedDate: moment().format('YYYY-MM-DD'),
      // selectedWeek: moment().week() - 1,
      // selectedYear: moment().year(),
      // selectedTenDays: tenDays,
      // yearMonth: yearmonth,
      // selectedQuarter: moment().quarter() - 1,
      selectedDateFrom: moment().format('YYYY-MM-DD'),
      selectedDateTo: moment().format('YYYY-MM-DD'),
      dateFrom: moment().format('YYYY-MM-DD'),
      dateTo: moment().format('YYYY-MM-DD'),
      machineHwCFG: {},
      calendar: {},
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
          label: '機台',
          field: 'machineID',
          name: 'machineID',
          width: '70px',
          filter: true,
          type: 'string',
          sort: true
        },
        {
          label: '財產編號',
          field: 'propertyNum',
          name: 'propertyNum',
          width: '100px',
          filter: true,
          type: 'string'
        },
        {
          label: '機台廠牌型號',
          field: 'brand',
          name: 'brand',
          width: '150px',
          filter: true,
          type: 'string'
        },
        {
          label: '稼動時數',
          field: 'utilization',
          name: 'utilization',
          width: '100px',
          type: 'string'
        },
        {
          label: '換模次數',
          field: 'changeMoldCount',
          name: 'changeMoldCount',
          width: '100px',
          type: 'string'
        },
        {
          label: '警報次數',
          field: 'warningCount',
          name: 'warningCount',
          width: '100px',
          type: 'string'
        },
        {
          label: '故障時數',
          field: 'errCount',
          name: 'errCount',
          width: '100px',
          type: 'string'
        },
        {
          label: '成型模次',
          field: 'moldCount',
          name: 'moldCount',
          width: '100px',
          type: 'string'
        },
        {
          label: 'A.本期稼動率%',
          field: 'currUtil',
          name: 'currUtil',
          width: '80px'
        },
        {
          label: 'B.上期稼動率%',
          field: 'pervUtil',
          name: 'pervUtil',
          width: '80px'
        },
        {
          label: '(A-B)%',
          field: 'diffUtil',
          name: 'diffUtil',
          width: '80px',
          type: 'string'
        }
      ],
      serverPagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20 // specifying this determines pagination is server-side
      }
    }
  },
  computed: {
    /* dateFrom: function () {
      if (this.period === 'daily') {
        return moment(this.selectedDate)
      } else if (this.period === 'weekly') {
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
      if (this.period === 'daily') {
        return moment(this.selectedDate).add(1, 'day').subtract(1, 'second')
      } else if (this.period === 'weekly') {
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
    }, */
    weeksInYear: function () {
      return moment(`${this.selectedYear}`, 'YYYY').weeksInYear()
    }
  },
  filters: {
  },
  watch: {
    period: function () {
      switch (this.period) {
        case 'daily':
          this.type = '日'
          break
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
      /* this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
      }) */
    },
    /* selectedYear: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
      })
    },
    selectedDate: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.selectedDate).toDate()
        var to = moment(this.selectedDate).toDate().add(1, 'day').subtract(1, 'second')
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
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
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
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
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
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
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
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
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
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
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
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
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
      })
    },
    zone: function () {
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
      })
    } */
    selectedDateS: function () {
      if (this.period === 'daily') {
        this.dateFrom = moment(this.selectedDateS).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedDateS).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (parseInt(moment(this.selectedDateS).format('YYYY')) - 1911) + '年' + moment(this.selectedDateS).format('M') + '月' + moment(this.selectedDateS).format('D') + '日 '
      }
    },
    selectedYearWeekly: function () {
      if (this.period === 'weekly') {
        this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
        this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (this.selectedYearWeekly - 1911) + '年 第' + this.selectedWeek + '週'
      }
    },
    selectedWeek: function () {
      if (this.period === 'weekly') {
        this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
        this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (this.selectedYearWeekly - 1911) + '年 第' + this.selectedWeek + '週'
      }
    },
    yearMonthTenDays: function () {
      if (this.period === 'tenDays') {
        if (this.selectedTenDays === 'early') {
          this.dateFrom = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 上旬'
        } else if (this.selectedTenDays === 'middle') {
          this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 中旬'
        } else {
          this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 下旬'
        }
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
      }
    },
    selectedTenDays: function () {
      if (this.period === 'tenDays') {
        if (this.selectedTenDays === 'early') {
          this.dateFrom = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 上旬'
        } else if (this.selectedTenDays === 'middle') {
          this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 中旬'
        } else {
          this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 下旬'
        }
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
      }
    },
    yearMonth: function () {
      if (this.period === 'monthly') {
        this.dateFrom = moment(this.yearMonth).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (parseInt(moment(this.yearMonth).format('YYYY')) - 1911) + '年 ' + parseInt(moment(this.yearMonth).format('MM')) + '月'
      }
    },
    selectedYearQuarter: function () {
      if (this.period === 'quarterly') {
        if (this.selectedQuarter === 1) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(2).date(31).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 2) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(3).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(5).date(30).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 3) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(6).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(8).date(30).format('YYYY-MM-DD')
        } else {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(9).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        }
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (this.selectedYearQuarter - 1911) + '年 第' + this.selectedQuarter + '季'
      }
    },
    selectedQuarter: function () {
      if (this.period === 'quarterly') {
        if (this.selectedQuarter === 1) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(2).date(31).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 2) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(3).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(5).date(30).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 3) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(6).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(8).date(30).format('YYYY-MM-DD')
        } else {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(9).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        }
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (this.selectedYearQuarter - 1911) + '年 第' + this.selectedQuarter + '季'
      }
    },
    selectedYear: function () {
      if (this.period === 'yearly') {
        this.dateFrom = moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedYearTo, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (parseInt(this.selectedYear) - 1911) + '年 ~ ' + (parseInt(this.selectedYearTo) - 1911) + '年 '
      }
    },
    selectedYearTo: function () {
      if (this.period === 'yearly') {
        this.dateFrom = moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedYearTo, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = (parseInt(this.selectedYear) - 1911) + '年 ~ ' + (parseInt(this.selectedYearTo) - 1911) + '年 '
      }
    },
    selectedDatePeriod: function () {
      if (this.period === 'period') {
        this.dateFrom = moment(this.selectedDatePeriod).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedDatePeriodTo).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = this.dateFrom + ' ~ ' + this.dateTo
      }
    },
    selectedDatePeriodTo: function () {
      if (this.period === 'period') {
        this.dateFrom = moment(this.selectedDatePeriod).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedDatePeriodTo).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        this.displayDate = this.dateFrom + ' ~ ' + this.dateTo
      }
    }
  },
  sockets: {
  },
  mounted () {
    console.log('111111')
    console.log(this.period)
    console.log('02222')
    switch (this.period) {
      case 'daily':
        this.type = '日'
        console.log('555555')
        this.dateFrom = moment(this.selectedDateS).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedDateS).format('YYYY-MM-DD')
        console.log(this.dateTo)
        this.displayDate = (parseInt(moment(this.selectedDateS).format('YYYY')) - 1911) + '年' + moment(this.selectedDateS).format('M') + '月' + moment(this.selectedDateS).format('D') + '日 '
        break
      case 'weekly':
        this.type = '週'
        this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
        this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
        this.displayDate = (this.selectedYearWeekly - 1911) + '年 第' + this.selectedWeek + '週'
        break
      case 'tenDays':
        this.type = '旬'
        console.log('123')
        if (this.selectedTenDays === 'early') {
          console.log('123456')
          this.dateFrom = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 上旬'
          console.log('this.yearMonthTenDays')
          console.log(this.yearMonthTenDays)
        } else if (this.selectedTenDays === 'middle') {
          this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 中旬'
        } else {
          this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 下旬'
        }
        break
      case 'monthly':
        this.type = '月'
        this.dateFrom = moment(this.yearMonth).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
        this.displayDate = (parseInt(moment(this.yearMonth).format('YYYY')) - 1911) + '年 ' + parseInt(moment(this.yearMonth).format('MM')) + '月'
        break
      case 'quarterly':
        this.type = '季'
        if (this.selectedQuarter === 1) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(2).date(31).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 2) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(3).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(5).date(30).format('YYYY-MM-DD')
        } else if (this.selectedQuarter === 3) {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(6).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(8).date(30).format('YYYY-MM-DD')
        } else {
          this.dateFrom = moment(this.selectedYearQuarter, 'YYYY').month(9).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearQuarter, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        }
        console.log(this.selectedYearQuarter)
        console.log('55555')
        this.displayDate = (this.selectedYearQuarter - 1911) + '年 第' + this.selectedQuarter + '季'
        break
      case 'yearly':
        this.type = '年'
        this.dateFrom = moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedYearTo, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        this.displayDate = (parseInt(this.selectedYear) - 1911) + '年 ~ ' + (parseInt(this.selectedYearTo) - 1911) + '年 '
        break
      case 'period':
        this.type = '自訂期間'
        this.dateFrom = moment(this.selectedDatePeriod).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedDatePeriodTo).format('YYYY-MM-DD')
        this.displayDate = this.dateFrom + ' ~ ' + this.dateTo
        break
      default:
        console.log('989999')
        break
    }
    // var from = moment(this.dateFrom).toDate()
    // var to = moment(this.dateTo).toDate()

    this.$nextTick(() => {
      var years = [2017, 2018]
      $.get('/api/getMachineList', {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
        } else {
          results.data.forEach((result) => {
            this.machineHwCFG[result['machineID']] = {
              propertyNum: result['propertyNum'],
              brand: result['brand']
            }
            years.forEach(year => {
              $.get('/api/getCalendar/' + result['machineID'] + '/' + year, {}, (doc) => {
                if (doc.type !== true) {
                  alert(`response is not correct, err: ${doc.data}`)
                } else if (doc.data.length === 0) {
                  alert('沒有行事曆資料' + result['machineID'])
                } else {
                  if (!this.calendar[year]) {
                    this.calendar[year] = {}
                  }
                  this.calendar[year][result['machineID']] = doc
                }
              })
            })
          })
        }
      })
      // $.get('/api/getDepartmentList', {}, (results) => {
      $.get('/api/getDepartmentList/' + this.departmentID, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          alert('沒有課別資料')
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
          this.zoneList.sort()
          this.zone = this.zoneList[0]
          // var from = moment(this.dateFrom).toDate()
          // var to = moment(this.dateTo).toDate()
          // renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar)
        }
      })
    })
  },
  methods: {
    ttt (newVal) {
      console.log('ttttttttttttttttttttttttt')
      console.log(newVal)
      // renderTable(this.rows, this.department, this.zone, this.selectedDate, this.pageID, this.$socket)
      console.log('tttttttttttttttttttttt')
      console.log(this.departmentS)
      // var zoneArrFilter = [ '1A' ]
      var selectedDate = moment(newVal).format('YYYY-MM-DD')
      // this.selectedDateS = selectedDate
      this.$router.push({name: 'IntegratedDailyReport', params: {selectedDateS: selectedDate, departmentS: this.department, zoneS: this.zoneS}})
    },
    rowclick (event) {
      // console.log(event)
    },
    refresh (done) {
      // console.log('refresh')
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
    },
    changeWarehousing (cell) {
      // console.log(cell)
      this.rows[cell.row.__index].warehousing = cell.data
      this.$socket.emit('setWarehousing', this.rows[cell.row.__index])
      this.status = '更新入庫數量中...'
    }
  }
}

function renderTable (rows, machineHwCFG, departmentID, from, to, calendar) {
  // console.log([departmentID, moment(from), moment(to)])
  // console.log(machineHwCFG)
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
      var utilization = {}
      // console.log(results.data)
      // console.log(JSON.stringify(results.data, null, 2))
      for (var machineID in records) {
        // caculate the utilization
        utilization[machineID] = 0
        var startDay = moment(from)
        while (startDay.isSameOrBefore(moment(to))) {
          // console.log(startDay.format('YYYY/M/DD'))
          var id = startDay.format('YYYY/M/DD')
          var year = startDay.format('YYYY')
          // var date = moment(calendar[year][machineID].data['_id'])
          var data = calendar[year][machineID]['data']
          var dayInfo
          for (var idx in data) {
            if (data[idx]['_id'] === id) {
              dayInfo = data[idx]
              break
            }
          }

          // var startTime
          // var endTime
          // if (dayInfo['first']) {
          //   startTime = moment(`${id} ${dayInfo['firstS']}`)
          //   endTime = moment(`${id} ${dayInfo['firstE']}`)
          //   utilization[machineID] += endTime.diff(startTime)
          // }
          // if (dayInfo['second']) {
          //   startTime = moment(`${id} ${dayInfo['secondS']}`)
          //   endTime = moment(`${id} ${dayInfo['secondE']}`)
          //   utilization[machineID] += endTime.diff(startTime)
          // }
          // if (dayInfo['third']) {
          //   startTime = moment(`${id} ${dayInfo['thirdS']}`)
          //   endTime = moment(`${moment(id).add(1, 'day').format('YYYY-MM-DD')} ${dayInfo['thirdE']}`)
          //   utilization[machineID] += endTime.diff(startTime)
          // }

          if (!dayInfo['first'] || dayInfo['second'] || dayInfo['third']) {
            utilization[machineID] += 24 * 60 * 60 * 1000
          }

          startDay.add(1, 'day')
        }
        // sorting the records by trig time
        records[machineID] = records[machineID].sort(function (a, b) {
          return a.trigTime > b.trigTime ? 1 : -1
        })
        var totalDuration = 0
        var totalMoldCount = 0
        var totalWarningCount = 0
        records[machineID].forEach(record => {
          // console.log(record)
          totalDuration += record.duration
          totalMoldCount += record.moldCount
          totalWarningCount += (record.alarmCount + record.armAlarmCount + record.autoSigCount + record.semiAutoSigCount)
        })
        rows.splice(0, 0, {
          machineID: machineID,
          propertyNum: machineHwCFG[machineID]['propertyNum'],
          brand: machineHwCFG[machineID]['brand'],
          utilization: moment.duration(totalDuration / 10000, 'ms').format('hh:mm:ss', {trim: false}),
          changeMoldCount: 0,
          warningCount: totalWarningCount,
          moldCount: totalMoldCount,
          errCount: 0,
          currUtil: (((totalDuration / 10000) / utilization[machineID]) * 100).toFixed(2)
        })
      }
      rows.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : -1
      })
    }
  })
}
</script>

<style>
</style>
