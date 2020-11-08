<template>
  <div class="layout-padding">
  <section class="content">
    <div class="row center-block">
    {{department}}
    {{(zoneS[department])[0]}}區
    {{displayDate}}
    {{dateFrom}} ~ {{dateTo}}
    </div>
    <div>
      期間日數{{totalDays}}日*{{hoursADay}}小時={{totalHours}}小時
    </div>
    <div>
      生產工作日數{{totalWorkDays}}天*{{hoursADay}}小時={{totalWorkHours}}小時
    </div>
    <div class="row center-block">
      <h5>{{type}}生產報表</h5>
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
        <q-td slot="body-cell-warehousing" slot-scope="cell">
          <q-input v-if="(period === 'weekly')" v-model="cell.row.warehousing" error placeholder="0" @blur="changeWarehousing(cell)"/>
          <!--<q-input v-else-if="(period === 'weekly')&&(cell.data!=='')" v-model.lazy="cell.data" error :placeholder="cell.data" @blur="changeWarehousing(cell)"/>-->
          <div v-else >
          {{cell.value}}
        </div>
        </q-td>
        <q-td slot="body-cell-badNum" slot-scope="cell">
          <q-input v-if="period === 'weekly'" v-model.lazy="cell.row.badNum" error placeholder="0" @blur="changeBadNum(cell)"/>
          <div v-else >
          {{cell.value}}
        </div>
        </q-td>
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
import Vue from 'vue'
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
    'zoneS',
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
      type: '整合',
      status: null,
      totalDays: 30,
      hoursADay: 24,
      totalHours: 720,
      totalWorkDays: 22,
      totalWorkHours: 528,
      departmentID: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
      selectedWeekO: moment().week() - 1,
      dateFrom: '',
      dateTo: '',
      displayDate: '',
      // selectedYear: moment().year(),
      // selectedTenDaysO: tenDays,
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
          label: '機台',
          field: 'machineID',
          name: '',
          width: '70px',
          filter: true,
          type: 'string',
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '警報',
          field: 'totalAlm',
          name: 'totalAlm',
          width: '40px',
          filter: true,
          type: 'string',
          sort: false
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          width: '100px',
          filter: true,
          type: 'string',
          sort: false
        },
        {
          label: '穴數',
          field: 'cavities',
          name: 'cavities',
          width: '40px',
          type: 'string',
          sort: false
        },
        {
          label: '量產開始',
          field: 'startTime',
          name: 'startTime',
          width: '120px',
          type: 'string',
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '量產結束',
          field: 'endTime',
          name: 'endTime',
          width: '120px',
          type: 'string',
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '自動生產時間累計',
          field: 'duration',
          name: 'duration',
          width: '80px',
          type: 'string',
          sort: false
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '80px',
          type: 'Number',
          sort: false
        },
        {
          label: '應產數量',
          field: 'targetCount',
          name: 'targetCount',
          type: 'Number',
          width: '80px'
        },
        {
          label: '入庫數量',
          field: 'warehousing',
          name: 'warehousing',
          width: '80px'
        },
        {
          label: '簡易不良數',
          field: 'badNum',
          name: 'badNum',
          width: '100px',
          // type: 'Number',
          sort: false
        },
        {
          label: '不良率 %',
          field: 'badRate',
          name: 'badRate',
          width: '80px',
          type: 'number',
          sort: false
        },
        {
          label: '標準週期S',
          field: 'standard',
          name: 'standard',
          width: '100px',
          type: 'string',
          sort: false
        },
        {
          label: '最短週期S',
          field: 'min',
          name: 'min',
          width: '100px',
          type: 'string',
          sort: false
        },
        {
          label: '平均週期S',
          field: 'average',
          name: 'average',
          width: '100px',
          type: 'string',
          sort: false
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '100px',
          type: 'string',
          sort: false
        },
        {
          label: '最遲完成日',
          field: 'deadline',
          name: 'deadline',
          filter: false,
          width: '100px',
          type: 'string',
          sort: false
        }
      ],
      serverPagination: {
        rowsPerPage: 20
      }
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
      /* if (this.period === 'tenDays') {
        if (this.selectedTenDays === 'early') {
          this.dateFrom = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
        } else if (this.selectedTenDays === 'middle') {
          this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
        } else {
          this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
        }
      }
      this.$nextTick(() => {
        if (this.period === 'tenDays') {
          if (this.selectedTenDays === 'early') {
            this.dateFrom = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
          } else if (this.selectedTenDays === 'middle') {
            this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
          } else {
            this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
          }
          var from1 = moment(this.dateFrom).toDate()
          var to1 = moment(this.dateTo).toDate()
          renderTable(this.rows, this.departmentID, from1, to1)
        }
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        renderTable(this.rows, this.departmentID, from, to)
      }) */
    },
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
    /* selectedYear: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        var from = moment(this.dateFrom).toDate()
        var to = moment(this.dateTo).toDate()
        // console.log(this.departmentID + '   ' + from + '  ' + to)
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
    } */
  },
  sockets: {
    setWarehousingSuccess: function (val) {
      for (var idx in this.rows) {
        if (this.rows[idx]._id === val.value._id) {
          val.value.badRate = 0
          if ((val.value.badNum !== '') && (val.value.badNum !== '0') && (val.value.warehousing !== '') && (val.value.warehousing !== '0')) {
            val.value.badRate = (parseInt(val.value.badNum) / parseInt(val.value.warehousing) * 100).toFixed(2)
          }
          // Object.assign(this.rows[idx], val.value)
          Vue.set(this.rows[idx], 'badRate', val.value.badRate)
          break
        }
      }

      this.status = '設定成功'
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setWarehousingFail: function (val) {
      // console.log('fail')
      this.status = '設定失敗'

      for (let i = 0; i < this.rows.length; i++) {
        let record = this.rows[i]
        if (record._id === val._id) {
          record.warehousing = val.warehousing
          break
        }
      }

      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setBadNumSuccess: function (val) {
      for (var idx in this.rows) {
        if (this.rows[idx]._id === val.value._id) {
          val.value.badRate = 0
          if ((val.value.badNum !== '') && (val.value.badNum !== '0') && (val.value.warehousing !== '') && (val.value.warehousing !== '0')) {
            val.value.badRate = (parseInt(val.value.badNum) / parseInt(val.value.warehousing) * 100).toFixed(2)
          }
          // Object.assign(this.rows[idx], val.value)
          Vue.set(this.rows[idx], 'badRate', val.value.badRate)
          break
        }
      }
      this.status = '設定成功'
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setBadNumFail: function (val) {
      // console.log('fail')
      this.status = '設定失敗'

      for (let i = 0; i < this.rows.length; i++) {
        let record = this.rows[i]
        if (record._id === val._id) {
          record.badNum = val.badNum
          break
        }
      }
      setTimeout(() => {
        this.status = null
      }, 5000)
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
    /* this.$nextTick(() => {
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

          var from = moment(this.dateFrom).toDate()
          var to = moment(this.dateTo).toDate()
          this.zoneList.sort()
          this.zone = this.zoneList[0]
          renderTable(this.rows, this.departmentID, from, to)
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
    },
    changeWarehousing (cell) {
      // console.log(cell)
      // console.log(cell.value)
      this.rows[cell.row.__index].warehousing = cell.value
      this.$socket.emit('setWarehousingPeriodlyReport', this.rows[cell.row.__index])
      this.status = '更新入庫數量中...'
    },
    changeBadNum (cell) {
      // console.log(cell)
      // console.log(cell.value)
      this.rows[cell.row.__index].badNum = cell.value
      this.$socket.emit('setBadNumPeriodlyReport', this.rows[cell.row.__index])
      this.status = '更新不良數量中...'
    }
  }
}

function renderTable (rows, departmentID, from, to) {
  // // console.log([departmentID, from, to])
  // init the records in the rows
  rows.splice(0, rows.length)
  rows.length = 0
  var records
  $.get('/api/getPeriodMachineRecords/' + departmentID + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      rows.splice(0, rows.length)
      rows.length = 0
      records = results.data
      // // console.log(JSON.stringify(results.data, null, 2))
      // // console.log(results.data)
      for (var machineID in records) {
        // sorting the records by trig time
        records[machineID] = records[machineID].sort(function (a, b) {
          return a.trigTime > b.trigTime ? 1 : -1
        })

        var initFlag = true
        var prevTotalAlm
        var prevProduct
        var prevCavities
        var prevTrigTime
        var prevLastTrigTime
        var totalDuration
        var totalMoldCount
        // var prevTargetCount
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

          // initilize the new record
          if ((record.product || '') !== '') {
            if (initFlag === true) {
              prevProduct = record.product
              prevTrigTime = record.trigTime
              totalDuration = 0
              totalMoldCount = 0
              min = record['min']

              initFlag = false
            }
            if (prevProduct !== record.product) {
              if ((totalMoldCount || '0') === '0') {
                average = 0
                // performance = 0
              } else {
                average = ((totalDuration / 10000000) / totalMoldCount).toFixed(2)
                // performance = (prevStandard * 100 / average).toFixed(2)
              }
              if (average === 0) {
                performance = 0
              } else {
                performance = (prevStandard * 100 / average).toFixed(2)
              }
              if (parseInt(prevWarehousing || '0') !== 0) {
                prevBadRate = (parseInt(prevBadNum || '0') / parseInt(prevWarehousing || '0') * 100).toFixed(2)
              } else {
                prevBadRate = (0.0).toFixed(2)
              }
              rows.splice(rows.length, 0, {
                _id: prevRecordID,
                machineID: machineID,
                totalAlm: prevTotalAlm || '0',
                product: prevProduct || '',
                cavities: prevCavities || '0',
                sortStartTime: moment(prevTrigTime).format('YYYY-MM-DD HH:mm:ss'),
                startTime: moment(prevTrigTime).format('MM-DD  HH:mm:ss'),
                endTime: moment(prevLastTrigTime).format('MM-DD  HH:mm:ss'),
                duration: moment.duration(totalDuration / 10000, 'ms').format('hh:mm:ss', {trim: false}), // 排班工作時間累計
                moldCount: totalMoldCount || '0',
                targetCount: (totalMoldCount || '0') * prevCavities,
                warehousing: prevWarehousing || '0',
                badNum: prevBadNum || '0',
                badRate: prevBadRate,
                standard: prevStandard || '0',
                min: (Math.round(min * 10) / 10) || '0',
                average: average || '0',
                performance: performance || '0',
                deadline: prevDeadline || ''
              })

              prevProduct = record.product
              prevTrigTime = record.trigTime
              totalDuration = 0
              totalMoldCount = 0
              if (record['min'] > 0) {
                min = record['min']
              }
              ongoingFlag = true
            } else {
              if (record['min'] > 0) {
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
            prevLastTrigTime = record.lastTrigTime
            // prevTargetCount = totalMoldCount * record.cavities
            prevBadNum = record.badNum
            prevBadRate = record.badRate
            prevStandard = record.standard
            prevDeadline = moment(parseInt(record.deadline.split('/Date(')[1].split(')/')[0])).format('YYYY/M/DD')
            prevRecordID = record._id
            prevWarehousing = record.warehousing
          }
        })

        if (ongoingFlag === true) {
          // // console.log('has ongoing record')
          if ((totalMoldCount || '0') === '0') {
            average = 0
            // performance = 0
          } else {
            average = ((totalDuration / 10000000) / totalMoldCount).toFixed(2)
            // performance = (prevStandard * 100 / average).toFixed(2)
          }
          if (average === 0) {
            performance = 0
          } else {
            performance = (prevStandard * 100 / average).toFixed(2)
          }
          if (parseInt(prevWarehousing || '0') !== 0) {
            prevBadRate = (parseInt(prevBadNum || '0') / parseInt(prevWarehousing || '0') * 100).toFixed(2)
          } else {
            prevBadRate = (0.0).toFixed(2)
          }
          rows.splice(rows.length, 0, {
            _id: prevRecordID,
            machineID: machineID,
            totalAlm: prevTotalAlm || '0',
            product: prevProduct || '',
            cavities: prevCavities || '0',
            sortStartTime: moment(prevTrigTime).format('YYYY-MM-DD HH:mm:ss'),
            startTime: moment(prevTrigTime).format('MM-DD HH:mm:ss'),
            endTime: moment(prevLastTrigTime).format('MM-DD HH:mm:ss'),
            duration: moment.duration(totalDuration / 10000, 'ms').format('hh:mm:ss', {trim: false}), // 排班工作時間累計
            moldCount: totalMoldCount || '0',
            targetCount: (totalMoldCount || '0') * prevCavities,
            warehousing: prevWarehousing || '0',
            badNum: prevBadNum || '0',
            badRate: prevBadRate,
            standard: prevStandard || '0',
            min: (Math.round(min * 10) / 10) || '0',
            average: average || '0',
            performance: performance || '0',
            deadline: prevDeadline || ''
          })
        }
      }
      rows.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : (a.machineID < b.machineID) ? -1 : (a.sortStartTime > b.sortStartTime) ? 1 : -1
      })
      // console.log(rows)
    }
  })
}
</script>

<style>
</style>
