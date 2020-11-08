<template>
  <div class="layout-padding">
  <section class="content">
    <div class="row center-block">
     <div class="col-md-12">
      {{displayDate}}
    {{department}}
    {{dateFrom}} ~ {{dateTo}}
    </div>
    </div>
    <div>
      期間日數{{totalDays}}日*{{hoursADay}}小時={{totalHours}}小時
    </div>
    <div>
      生產工作日數{{totalWorkDays}}天*{{hoursADay}}小時={{totalWorkHours}}小時
    </div>
    <div class="row center-block">
      <h5>模具編號 {{type}}生產報表</h5>
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
  name: 'Tables',
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
      type: '明細',
      status: null,
      totalDays: 30,
      hoursADay: 24,
      totalHours: 720,
      totalWorkDays: 22,
      totalWorkHours: 528,
      dateFrom: '',
      dateTo: '',
      displayDate: '',
      departmentID: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
      Yselect: [],
      Qselect: [],
      Tselect: [],
      Wselect: [],
      // selectedWeek: moment().week() - 1,
      // selectedYear: moment().year(),
      // selectedTenDays: tenDays,
      // yearMonth: yearmonth,
      // selectedQuarter: moment().quarter() - 1,
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
          label: '模具編號',
          field: 'moldNum',
          name: 'moldNum',
          width: '100px',
          filter: true,
          type: 'string',
          sort: true
        },
        {
          label: '模具名稱',
          field: 'moldName',
          name: 'moldName',
          width: '200px',
          filter: true,
          type: 'string'
        },
        {
          label: '警報',
          field: 'totalAlm',
          name: 'totalAlm',
          width: '40px',
          filter: true,
          type: 'string'
        },
        {
          label: '換模',
          field: 'changeMold',
          name: 'changeMold',
          width: '40px',
          filter: true,
          type: 'string'
        },
        {
          label: '穴數',
          field: 'cavities',
          name: 'cavities',
          width: '40px'
        },
        {
          label: '自動生產',
          field: 'durationStr',
          name: 'durationStr',
          width: '100px',
          type: 'string'
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '100px'
        },
        {
          label: '應產數量pcs',
          field: 'targetCount',
          name: 'targetCount',
          width: '80px'
        },
        {
          label: '入庫數量pcs',
          field: 'warehousing',
          name: 'warehousing',
          width: '80px'
        },
        {
          label: '不良數量pcs',
          field: 'badNum',
          name: 'badNum',
          width: '80px'
        },
        {
          label: '不良率 %',
          field: 'badRate',
          name: 'badRate',
          width: '60px'
        },
        {
          label: '標準週期S',
          field: 'standard',
          name: 'standard',
          width: '60px',
          type: 'string'
        },
        {
          label: '最短週期S',
          field: 'min',
          name: 'min',
          width: '60px',
          type: 'string'
        },
        {
          label: '平均週期S',
          field: 'average',
          name: 'average',
          width: '60px',
          type: 'string'
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '80px',
          type: 'string'
        }
      ],
      serverPagination: {
        rowsPerPage: 20
      },
      years: [
        {
          label: '2017年',
          value: 'y17'
        },
        {
          label: '2018年',
          value: 'y18'
        },
        {
          label: '2019年',
          value: 'y19'
        },
        {
          label: '2020年',
          value: 'y20'
        }
      ],
      quarters: [
      ],
      tenDays: [
        {
          label: '上旬',
          value: 'early'
        },
        {
          label: '中旬',
          value: 'mid'
        },
        {
          label: '下旬',
          value: 'late'
        }
      ],
      weeks: [
      ]
    }
  },
  created () {
    for (var i = 0; i < 52; i++) {
      var o = {
        label: i + 1 + '周',
        value: 'w' + i + 1
      }
      this.weeks.splice(this.weeks.length, 0, o)
      // console.log(this.weeks)
    }
    for (var i2 = 0; i2 < 4; i2++) {
      var s = {
        label: '第' + (i2 + 1) + '季',
        value: 'q' + i2 + 1
      }
      this.quarters.splice(this.quarters.length, 0, s)
    }
  },
  computed: {
    /* dateFrom: function () {
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
        renderTable(this.rows, this.departmentID, from, to)
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
    },
    zone: function () {
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      })
    } */
    selectedYearWeekly: function () {
      if (this.period === 'weekly') {
        this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
        this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
        this.displayDate = (this.selectedYearWeekly - 1911) + '年 第' + this.selectedWeek + '週'
      }
    },
    selectedWeek: function () {
      if (this.period === 'weekly') {
        this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
        this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
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
        renderTable(this.rows, this.departmentID, from, to)
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
        renderTable(this.rows, this.departmentID, from, to)
      }
    },
    yearMonth: function () {
      if (this.period === 'monthly') {
        this.dateFrom = moment(this.yearMonth).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
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
        renderTable(this.rows, this.departmentID, from, to)
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
        renderTable(this.rows, this.departmentID, from, to)
        this.displayDate = (this.selectedYearQuarter - 1911) + '年 第' + this.selectedQuarter + '季'
      }
    },
    selectedYear: function () {
      if (this.period === 'yearly') {
        this.dateFrom = moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedYearTo, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
        this.displayDate = (parseInt(this.selectedYear) - 1911) + '年 ~ ' + (parseInt(this.selectedYearTo) - 1911) + '年 '
      }
    },
    selectedYearTo: function () {
      if (this.period === 'yearly') {
        this.dateFrom = moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedYearTo, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
        this.displayDate = (parseInt(this.selectedYear) - 1911) + '年 ~ ' + (parseInt(this.selectedYearTo) - 1911) + '年 '
      }
    },
    selectedDatePeriod: function () {
      if (this.period === 'period') {
        this.dateFrom = moment(this.selectedDatePeriod).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedDatePeriodTo).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
        this.displayDate = this.dateFrom + ' ~ ' + this.dateTo
      }
    },
    selectedDatePeriodTo: function () {
      if (this.period === 'period') {
        this.dateFrom = moment(this.selectedDatePeriod).format('YYYY-MM-DD')
        this.dateTo = moment(this.selectedDatePeriodTo).format('YYYY-MM-DD')
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
        this.displayDate = this.dateFrom + ' ~ ' + this.dateTo
      }
    }
  },
  mounted () {
    switch (this.period) {
      case 'weekly':
        this.type = '週'
        this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
        this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
        this.displayDate = (this.selectedYearWeekly - 1911) + '年 第' + this.selectedWeek + '週'
        break
      case 'tenDays':
        this.type = '旬'
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
    }
    var from = moment(this.dateFrom).toDate()
    var to = moment(this.dateTo).toDate()
    renderTable(this.rows, this.departmentID, from, to)
    /* switch (this.period) {
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
      // $.get('/api/getDepartmentList', {}, (results) => {
      $.get('/api/getDepartmentList/' + this.departmentID, {}, (results) => {
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
          this.zoneList.sort()
          this.zone = this.zoneList[0]

          // var from = moment(this.dateFrom).toDate()
          // var to = moment(this.dateTo).toDate()
          // renderTable(this.rows, this.departmentID, from, to)
        }
      })
    }) */
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
      // // console.log(results.data)
      for (var machineID in records) {
        // sorting the records by trig time
        records[machineID] = records[machineID].sort(function (a, b) {
          return a.trigTime > b.trigTime ? 1 : -1
        })

        var initFlag = true
        var moldName
        var moldNum
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
              moldName: moldName,
              moldNum: moldNum,
              totalAlm: prevTotalAlm || '',
              product: prevProduct || '',
              cavities: prevCavities || '',
              durationStr: moment.duration(totalDuration / 10000, 'ms').format('hh:mm:ss', {trim: false}), // 排班工作時間累計
              duration: prevCavities,
              moldCount: totalMoldCount || '',
              targetCount: totalMoldCount || '',
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
            if (min === 0) {
              min = record['min']
            }
            ongoingFlag = true
          } else {
            if (min === 0) {
              min = record['min']
            } else if (record['min'] > 0) {
              if (record['min'] < min) {
                min = record['min']
              }
            }
            ongoingFlag = true
          }

          // do everytime, no matter product change
          moldName = record.moldName
          moldNum = record.moldNum
          totalDuration += record.duration
          totalMoldCount += record.moldCount
          prevTotalAlm = record.totalAlm
          prevCavities = record.cavities
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
            moldName: moldName,
            moldNum: moldNum,
            totalAlm: prevTotalAlm || '',
            product: prevProduct || '',
            cavities: prevCavities || '',
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

      // var test = true
      // if (test) {
      //   rows.splice(0, rows.length)

      //   rows.splice(0, 0, {
      //     _id: '123',
      //     machineID: '1A01',
      //     totalAlm: 10,
      //     product: 'ATM5566',
      //     productName: 'ATM7',
      //     cavities: 2,
      //     durationStr: '00:01:00',
      //     duration: 1 * 60 * 1000 * 1000 * 10,
      //     moldCount: 100,
      //     targetCount: 1000,
      //     warehousing: 90,
      //     badNum: 10,
      //     badRate: '90%',
      //     standard: '5',
      //     min: '8',
      //     average: '10',
      //     performance: '87%'
      //   },
      //   {
      //     _id: '123',
      //     machineID: '1A02',
      //     totalAlm: 20,
      //     product: 'ATM5566',
      //     productName: 'ATM7',
      //     cavities: 2,
      //     durationStr: '00:02:00',
      //     duration: 2 * 60 * 1000 * 1000 * 10,
      //     moldCount: 200,
      //     targetCount: 1000,
      //     warehousing: 100,
      //     badNum: 100,
      //     badRate: '50%',
      //     standard: '5',
      //     min: '10',
      //     average: '20',
      //     performance: '87%'
      //   },
      //   {
      //     _id: '123',
      //     machineID: '1A02',
      //     totalAlm: 30,
      //     product: 'ATM5566',
      //     productName: 'ATM7',
      //     cavities: 2,
      //     durationStr: '00:05:00',
      //     duration: 5 * 60 * 1000 * 1000 * 10,
      //     moldCount: 170,
      //     targetCount: 1000,
      //     warehousing: 160,
      //     badNum: 10,
      //     badRate: '5.8%',
      //     standard: '5',
      //     min: '6',
      //     average: '20',
      //     performance: '87%'
      //   })
      // }
      // same list
      // product: 'ATM5566',
      // cavities: 2,
      // targetCount: 1000,

      // aggregate the product report
      var docs = {}
      rows.forEach(row => {
        if (docs[row.product] === undefined) {
          docs[row.product] = row
        } else {
          var doc = docs[row.product]
          doc.moldName = row.moldName
          doc.moldNum = row.moldNum
          doc.totalAlm += row.totalAlm
          doc.moldCount += row.moldCount
          doc.totalMoldCount += row.totalMoldCount
          doc.warehousing += row.warehousing
          doc.badNum += row.badNum
          doc.duration += row.duration

          if (Number(row.min) > 0) {
            if (Number(row.min) < Number(doc.min)) {
              doc.min = row.min
            }
          }
          // average = ((totalDuration / 10000000) / totalMoldCount).toFixed(2)
          // performance = (prevStandard * 100 / average).toFixed(2)
          // duration: moment.duration(totalDuration / 10000, 'ms').format('hh:mm:ss', {trim: false}), // 排班工作時間累計
        }
      })
      rows.splice(0, rows.length)

      for (var product in docs) {
        average = ((docs[product].duration / 10000000) / docs[product].moldCount).toFixed(2)
        performance = (docs[product].standard * 100 / average).toFixed(2)

        rows.splice(0, 0, {
          _id: docs[product]._id,
          totalAlm: docs[product].totalAlm,
          moldName: docs[product].moldName,
          moldNum: docs[product].moldNum,
          product: docs[product].product,
          productName: docs[product].productName,
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
          performance: `${((docs[product].standard / average) * 100).toFixed(2)}%`
        })
      }
    }
  })
}
</script>

<style>
</style>
