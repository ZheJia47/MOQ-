<template>
  <div class="layout-padding">
     <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>{{type}}&nbsp;-&nbsp;稼動報表&nbsp;&nbsp;&nbsp;&nbsp;{{department}}</h4>
        <h4 v-if="status !== null">({{status}})</h4>
    </div>
    </div>
      <div class="row justify-center q-pt-xs q-pb-xs text-white bg-light-blue-8 full-width ">
      <q-btn outline glossy label='排序' icon="icon-svg52" @click="sortFalling = !sortFalling, sortEvent()"/>
      <q-btn-dropdown outline glossy label="顯示欄位" icon="icon-svg53">
  <!-- dropdown content -->
        <q-list link>
          <q-item v-for="(col, index) in columns" v-bind:key="index">
            <q-item-main>
              <q-checkbox v-model="columns[index]['required']" :label="columns[index]['label']" :value="col"/>
            </q-item-main>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn outline glossy label='色彩設定' icon="icon-svg54" @click="colorEn = !colorEn"/>
      <q-btn outline glossy v-if="!$q.fullscreen.isActive" click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rows, columns, '稼動報表')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
    <div class="row justify-center bg-white full-width no-margin">
    <div class="row justify-around q-ma-md full-width">
    <div class="col-auto q-ml-xs q-mt-sm">
    <p>{{displayDate}} -{{displayDepartment}} - {{displayZone}} {{dateFrom}} ~ {{dateTo}}</p>
    </div>
    <div class="column inline justify-top q-pl-md">
    <div class="col-auto">
     <span>期間日數{{totalDays}}日*{{hoursADay}}小時={{totalHours}}小時</span>
    </div>
    <div class="col-auto">
     <span>生產工作日數{{totalWorkDays[0]}}天*{{hoursADay}}小時={{totalWorkHours[0]}}小時</span>
    </div>
    </div>
    </div>
    <div class="column">
    <div class="row inline justify-center q-pt-sm q-pb-sm">
    <div class="col-auto q-pr-md">
    <q-btn :label="sortLabel0">
    <q-popup-edit v-model="sort0" buttons label-set="確定" label-cancel="取消" persistent @save="test6">
      <q-field count>
        <q-select
          type="text"
          v-model="sort0"
          :options="sortList"
          error
        />
      </q-field>
    </q-popup-edit>
    </q-btn>
    <q-btn @click="sortAsc0=!sortAsc0, sortEvent()">
      <q-icon v-if="sortAsc0" name="arrow_downward" size="24px" />
      <q-icon v-else name="arrow_upward" size="24px" />
    </q-btn>
    </div>
        <div class="col-auto q-pr-md">
     <q-btn :label="sortLabel1">
    <q-popup-edit v-model="sort1" buttons label-set="確定" label-cancel="取消" persistent @save="test7">
      <q-field count>
        <q-select
          type="text"
          v-model="sort1"
          :options="sortList"
          error
        />
      </q-field>
    </q-popup-edit>
    </q-btn>
    <q-btn @click="sortAsc1=!sortAsc1, sortEvent()">
      <q-icon v-if="sortAsc1" name="arrow_downward" size="24px" />
      <q-icon v-else name="arrow_upward" size="24px" />
    </q-btn>
    </div>
        <div class="col-auto">
    <q-btn :label="sortLabel2">
    <q-popup-edit v-model="sort2" buttons label-set="確定" label-cancel="取消" persistent @save="test8">
      <q-field count>
        <q-select
          type="text"
          v-model="sort2"
          :options="sortList"
          error
        />
      </q-field>
    </q-popup-edit>
    </q-btn>
    <q-btn @click="sortAsc2=!sortAsc2, sortEvent()">
      <q-icon v-if="sortAsc2" name="arrow_downward" size="24px" />
      <q-icon v-else name="arrow_upward" size="24px" />
    </q-btn>
    </div>
     </div>
   <div class="col-auto bg-grey-3 items-end q-mb-sm">
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
          :visible-columns="visibleColumns"
      >
      </q-table>
      </q-item>
      </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
import Vue from 'vue'
import XLSX from 'XLSX'
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
    'selectedDatePeriodTo',
    'checked'
  ],
  data: function () {
    return {
      toIndPrev: '',
      fromIndPrev: '',
      // ------------------------------機台編號用
      machineIDArr: [],
      organDept: 0,
      displayZone: '',
      displayDepartment: '',
      // ---------------------------toolBar用
      visibleColumns: [],
      colorEn: false,
      colorArr: [],
      colorConditionArr: [],
      colorConditionObj: {},
      blink: [],
      sortFalling: false,
      fullscreen: false,
      // ------------------------------
      sortList: [],
      sort0: 'machineID',
      sortLabel0: '機台',
      sortAsc0: true,
      sort1: 'startTime',
      sortLabel1: '量產開始',
      sortAsc1: true,
      sort2: '',
      sortLabel2: ' ',
      sortAsc2: true,
      sortHead: '',
      // ------------------------------
      type: '日',
      status: null,
      totalDays: 30,
      hoursADay: 24,
      calMethod: 'A',
      totalHours: 720,
      totalWorkDays: [0],
      totalWorkHours: [0],
      totalPrevWorkDays: [0],
      totalPrevWorkHours: [0],
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
      calendar: [0],
      calendarPrev: [0],
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
          required: true,
          width: '70px',
          filter: true,
          type: 'string',
          sort: true
        },
        {
          label: '財產編號',
          field: 'propertyNum',
          name: 'propertyNum',
          required: true,
          width: '100px',
          filter: true,
          type: 'string'
        },
        {
          label: '機台廠牌型號',
          field: 'brand',
          name: 'brand',
          required: true,
          width: '150px',
          filter: true,
          type: 'string'
        },
        {
          label: '稼動時數',
          field: 'utilization',
          name: 'utilization',
          required: true,
          width: '100px',
          type: 'string'
        },
        {
          label: '換模次數',
          field: 'changeMoldCount',
          name: 'changeMoldCount',
          required: true,
          width: '100px',
          type: 'string'
        },
        {
          label: '警報次數',
          field: 'warningCount',
          name: 'warningCount',
          required: true,
          width: '100px',
          type: 'string'
        },
        {
          label: '故障時數',
          field: 'errCount',
          name: 'errCount',
          required: true,
          width: '100px',
          type: 'string'
        },
        {
          label: '成型模次',
          field: 'moldCount',
          name: 'moldCount',
          required: true,
          width: '100px',
          type: 'string'
        },
        {
          label: 'A.本期稼動率%',
          field: 'currUtil',
          name: 'currUtil',
          required: true,
          width: '80px'
        },
        {
          label: 'B.上期稼動率%',
          field: 'pervUtil',
          name: 'pervUtil',
          required: true,
          width: '80px'
        },
        {
          label: '(A-B)%',
          field: 'diffUtil',
          name: 'diffUtil',
          required: true,
          width: '80px',
          type: 'string'
        }
      ],
      serverPagination: {
        rowsPerPage: 20
      }
    }
  },
  computed: {
    weeksInYear: function () {
      return moment(`${this.selectedYear}`, 'YYYY').weeksInYear()
    }
  },
  filters: {
  },
  watch: {
    totalWorkHours: function () {
      this.rows.filter(row => {
        var workSecond = this.totalWorkHours[0] * 3600
        var opSecond = row.durationOrigin
        this.$set(row, 'currUtil', `${Math.round(opSecond / workSecond) / 10}%`)
      })
    },
    rows: function () {
      this.rows.filter(row => {
        var workSecond = this.totalWorkHours[0] * 3600
        var opSecond = row.durationOrigin
        this.$set(row, 'currUtil', `${Math.round(opSecond / workSecond) / 10}%`)
        var workSecondPrev = this.totalPrevWorkHours[0] * 3600
        var opSecondPrev = row.prevDurationOrigin || 0
        var currUtilPrev = opSecond / workSecond
        // console.log(row.machineID + '_' + opSecondPrev + '_' + workSecondPrev)
        this.$set(row, 'pervUtil', `${Math.round(opSecondPrev / workSecondPrev) / 10}%`)
        this.$set(row, 'diffUtil', `${Math.round(currUtilPrev - opSecondPrev / workSecondPrev) / 10}%`)
      })
    },
    calendar: function () {
      this.selectedWorkDay()
    },
    totalPrevWorkHours: function () {
      this.rows.filter(row => {
        var workSecond = this.totalPrevWorkHours[0] * 3600
        var opSecond = row.prevDurationOrigin || 0
        var currUtil = parseFloat(row.currUtil.split('%')[0]) * 10
        // console.log(row.machineID + '_' + opSecond + '_' + workSecond)
        this.$set(row, 'pervUtil', `${Math.round(opSecond / workSecond) / 10}%`)
        this.$set(row, 'diffUtil', `${Math.round(currUtil - opSecond / workSecond) / 10}%`)
      })
    },
    calendarPrev: function () {
      this.selectedPrevWorkDay()
    },
    colorConditionArr: function () {
      this.hoursADay = this.colorConditionArr[9][0]
      this.calMethod = this.colorConditionArr[8][0]
      this.$forceUpdate()
      // console.log(1230)
      // console.log(this.hoursADay)
      this.selectedWorkDay()
      this.selectedPrevWorkDay()
    },
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
    },
    selectedDateS: function () {
      this.constructTable()
    },
    selectedYearWeekly: function () {
      this.constructTable()
    },
    selectedWeek: function () {
      this.constructTable()
    },
    yearMonthTenDays: function () {
      this.constructTable()
    },
    selectedTenDays: function () {
      this.constructTable()
    },
    yearMonth: function () {
      this.constructTable()
    },
    selectedYearQuarter: function () {
      this.constructTable()
    },
    selectedQuarter: function () {
      this.constructTable()
    },
    selectedYear: function () {
      this.constructTable()
    },
    selectedYearTo: function () {
      this.constructTable()
    },
    selectedDatePeriod: function () {
      this.constructTable()
    },
    selectedDatePeriodTo: function () {
      this.constructTable()
    },
    sortList: function () {
      this.sortLabel0 = this.sortList[1].label
      this.sortLabel1 = this.sortList[2].label
      this.sortLabel2 = this.sortList[0].label
      this.sort0 = this.sortList[1].value
      this.sort1 = this.sortList[2].value
      this.sort2 = this.sortList[0].value
    },
    checked () {
      this.constructTable()
    }
  },
  sockets: {
  },
  mounted () {
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    this.constructTable()
  },
  methods: {
    ExcelExport (rows, cols, fileName) {
      var ws
      ws = XLSX.utils.json_to_sheet(rows)
      const ec = (r, c) => {
        return XLSX.utils.encode_cell({ r: r, c: c })
      }
      const deleteCol = (ws, colIndex) => {
        let range = XLSX.utils.decode_range(ws['!ref'])
        for (var R = range.s.c; R <= range.e.r; ++R) {
          for (var C = colIndex; C <= range.e.c; ++C) {
            ws[ec(R, C)] = ws[ec(R, C + 1)]
          }
        }
        range.e.c--
        ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
      }
      var col2Idx = 0
      let range = XLSX.utils.decode_range(ws['!ref'])
      for (var l = range.e.c; l > -1; l--) {
        for (col2Idx = 0; col2Idx < cols.length; col2Idx++) {
          if (cols[col2Idx].name === ws[ec(0, l)].v) {
            break
          }
        }
        if (col2Idx >= cols.length) {
          deleteCol(ws, l)
        }
      }
      range = XLSX.utils.decode_range(ws['!ref'])
      for (l = 0; l <= (range.e.c); l++) {
        cols.forEach(col2 => {
          if (col2.name === ws[ec(0, l)].v) {
            ws[ec(0, l)].v = col2.label
          }
        })
      }
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '表單')
      // console.log('4444444444')
      XLSX.writeFile(wb, fileName + '.xlsx')
    },
    selectedWorkDay () {
      switch (this.colorConditionArr[8][0]) {
        case 'A':
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, this.calendar.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, this.calendar.length * this.hoursADay)
          break
        case 'B':
          var classB = this.calendar.filter(elm => {
            return (moment(elm.date, 'YYYY/M/DD').format('ddd') !== 'Sun')
          })
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, classB.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, classB.length * this.hoursADay)
          break
        case 'C':
          var classC = this.calendar.filter(elm => {
            return elm['holidayCategory'] !== '星期六、星期日'
          })
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, classC.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, classC.length * this.hoursADay)
          break
        case 'D':
          var classD = this.calendar.filter(elm => {
            return elm['isHoliday'] !== true
          })
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, classD.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, classD.length * this.hoursADay)
          break
      }
    },
    getValidCalendar (from, to) {
      $.get('/api/getValidCalendar/' + from + '/' + to, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else {
          this.calendar.splice(0, this.calendar.length)
          results.data.forEach(elm => {
            this.calendar.splice(this.calendar.length, 0, elm)
          })
        }
      })
    },
    selectedPrevWorkDay () {
      // console.log(123)
      switch (this.colorConditionArr[8][0]) {
        case 'A':
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, this.calendarPrev.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, this.calendarPrev.length * this.hoursADay)
          break
        case 'B':
          // console.log('HHHHHHH')
          var classB = this.calendarPrev.filter(elm => {
            return (moment(elm.date, 'YYYY/M/DD').format('ddd') !== 'Sun')
          })
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, classB.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, classB.length * this.hoursADay)
          break
        case 'C':
          var classC = this.calendarPrev.filter(elm => {
            return elm['holidayCategory'] !== '星期六、星期日'
          })
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, classC.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, classC.length * this.hoursADay)
          break
        case 'D':
          var classD = this.calendarPrev.filter(elm => {
            return elm['isHoliday'] !== true
          })
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, classD.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, classD.length * this.hoursADay)
          break
      }
    },
    getPrevValidCalendar (from, to) {
      $.get('/api/getValidCalendar/' + from + '/' + to, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else {
          this.calendarPrev.splice(0, this.calendarPrev.length)
          results.data.forEach(elm => {
            this.calendarPrev.splice(this.calendarPrev.length, 0, elm)
          })
        }
      })
    },
    getDateInterval (from, to, ind, period) {
      var fromInd
      var toInd
      switch (period) {
        case 'daily':
          fromInd = moment(from).subtract(ind - 2, 'day').format('YYYY-MM-DD')
          toInd = moment(to).subtract(ind - 2, 'day').format('YYYY-MM-DD')
          break
        case 'weekly':
          fromInd = moment(from).subtract(ind - 2, 'week').format('YYYY-MM-DD')
          toInd = moment(to).subtract(ind - 2, 'week').format('YYYY-MM-DD')
          break
        case 'tenDays':
          var yearTenDays = moment(from).year()
          var monthTenDays = moment(from).month()
          var tenDaysFg = 0
          if (moment(from).get('date') < 11) {
            tenDaysFg = 0 + monthTenDays * 3
          } else if (moment(from).get('date') < 21) {
            tenDaysFg = 1 + monthTenDays * 3
          } else {
            tenDaysFg = 2 + monthTenDays * 3
          }
          var section = tenDaysFg - (ind - 2)
          if (section < 0) {
            section += 36
            yearTenDays--
          }
          var tenDaysFgFinal = section % 3
          var monthTenDaysFinal = parseInt(section / 3) + 1
          var yearTenDaysFinal = yearTenDays
          if (tenDaysFgFinal === 0) {
            fromInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(1).format('YYYY-MM-DD')
            toInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(10).format('YYYY-MM-DD')
          } else if (tenDaysFgFinal === 1) {
            fromInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(11).format('YYYY-MM-DD')
            toInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(20).format('YYYY-MM-DD')
          } else {
            fromInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(21).format('YYYY-MM-DD')
            toInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').add(1, 'month').date(0).format('YYYY-MM-DD')
          }
          break
        case 'monthly':
          fromInd = moment(from).subtract(ind - 2, 'month').date(1).format('YYYY-MM-DD')
          toInd = moment(to).subtract(ind - 2, 'month').add(1, 'month').date(0).format('YYYY-MM-DD')
          break
        case 'quarterly':
          fromInd = moment(from).subtract(ind - 2, 'quarter').date(1).format('YYYY-MM-DD')
          toInd = moment(to).subtract(ind - 2, 'quarter').add(1, 'month').date(0).format('YYYY-MM-DD')
          break
        case 'yearly':
          fromInd = moment(from).subtract(ind - 2, 'year').date(1).format('YYYY-MM-DD')
          toInd = moment(to).subtract(ind - 2, 'year').add(1, 'month').date(0).format('YYYY-MM-DD')
          break
        case 'period':
          var diff = moment(to).diff(moment(from)) / 3600 / 24 / 1000 + 1
          fromInd = moment(from).subtract(diff * (ind - 2), 'days').format('YYYY-MM-DD')
          toInd = moment(to).subtract(diff * (ind - 2), 'days').format('YYYY-MM-DD')
          break
      }
      // console.log('fromInd: ' + fromInd + '   toInd: ' + toInd + '   ind: ' + ind)
      this.fromIndPrev = fromInd
      this.toIndPrev = toInd
    },
    updateRenderTable () {
      if (this.$q.loading.isActive) {
        return
      }
      this.$q.loading.show({
        delay: 400 // ms
      })
      // ------------------------------
      this.machineIDArr = recursiveMakeMachineArr(this.zoneS)
      this.organDept = recursiveFindDept(this.zoneS)
      if (this.organDept > 3) {
        this.displayZone = ''
      } else {
        var idx = 0
        this.zoneS[this.department].forEach(elm => {
          Object.keys(elm).forEach(elmKey => {
            if (idx === 0) {
              this.displayZone = elmKey
            } else {
              this.displayZone = this.displayZone + '、' + elmKey
            }
            idx++
          })
        })
        this.displayZone = this.displayZone + '區'
      }
      this.displayDepartment = this.department
      this.$forceUpdate()
      // ------------------------------
      switch (this.period) {
        case 'daily':
          this.type = '日'
          // console.log('555555')
          this.dateFrom = moment(this.selectedDateS).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedDateS).format('YYYY-MM-DD')
          // console.log(this.dateTo)
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
          // console.log('123')
          if (this.selectedTenDays === 'early') {
            // console.log('123456')
            this.dateFrom = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
            this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 ' + moment(this.yearMonthTenDays).date(1).format('M') + '月上旬'
            // console.log('this.yearMonthTenDays')
            // console.log(this.yearMonthTenDays)
          } else if (this.selectedTenDays === 'middle') {
            this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
            this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 ' + moment(this.yearMonthTenDays).date(11).format('M') + '月中旬'
          } else {
            this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
            this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 ' + moment(this.yearMonthTenDays).date(21).format('M') + '月下旬'
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
          // console.log(this.selectedYearQuarter)
          // console.log('55555')
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
          // console.log('989999')
          break
      }
      var from = moment(this.dateFrom).format('YYYY-MM-DD') // .toDate()
      var to = moment(this.dateTo).format('YYYY-MM-DD') // .toDate()
      this.totalDays = moment(this.dateTo).diff(moment(this.dateFrom), 'days') + 1
      this.totalHours = this.hoursADay * this.totalDays
      // renderTable(this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar, this.totalWorkDays, this.hoursADay, this.totalWorkHours, Vue.set, this.period, this.$q.loading, this.calMethod)
      this.getDateInterval(from, to, 3, this.period)
      // console.log('Here????')
      renderTable(this.fromIndPrev, this.toIndPrev, this.rows, this.machineHwCFG, this.departmentID, from, to, this.calendar, this.totalWorkDays, this.hoursADay, this.totalWorkHours, Vue.set, this.period, this.$q.loading, this.calMethod)
      // console.log('LLLLLLLLLLLLLL????')
      this.getValidCalendar(from, to)
      this.getPrevValidCalendar(this.fromIndPrev, this.toIndPrev)
    },
    ttt (newVal) {
      // console.log('ttttttttttttttttttttttttt')
      // console.log(newVal)
      // renderTable(this.rows, this.department, this.zone, this.selectedDate, this.pageID, this.$socket)
      // console.log('tttttttttttttttttttttt')
      // console.log(this.departmentS)
      // var zoneArrFilter = [ '1A' ]
      var selectedDate = moment(newVal).format('YYYY-MM-DD')
      // this.selectedDateS = selectedDate
      this.$router.push({name: 'IntegratedDailyReport', params: {selectedDateS: selectedDate, departmentS: this.department, zoneS: this.zoneS}})
    },
    rowclick (event) {
      // // console.log(event)
    },
    refresh (done) {
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
    test6: function (a, b) {
      this.sortList.forEach(sortElm => {
        if (sortElm.value === this.sort0) {
          this.sortLabel0 = sortElm.label
        }
      })
      this.$forceUpdate()
    },
    test7: function (a, b) {
      this.sortList.forEach(sortElm => {
        if (sortElm.value === this.sort1) {
          this.sortLabel1 = sortElm.label
        }
      })
      this.$forceUpdate()
    },
    test8: function (a, b) {
      this.sortList.forEach(sortElm => {
        if (sortElm.value === this.sort2) {
          this.sortLabel2 = sortElm.label
        }
      })
      this.$forceUpdate()
    },
    sortEvent () {
      var arr = []
      var lb = ''
      if (this.sortLabel0 !== ' ') {
        if (this.sort0 === 'machineID') {
          lb = 'machineID'
        } else if (this.sort0 === 'startTime') {
          lb = 'trigTimeFullType'
        } else if (this.sort0 === 'endTime') {
          lb = 'lastTrigTimeFullType'
        } else {
          lb = this.sort0
        }
        arr.splice(arr.length, 0, {
          key: lb,
          asc: this.sortFalling ? !this.sortAsc0 : this.sortAsc0
        })
      }
      if (this.sortLabel1 !== ' ') {
        if (this.sort1 === 'machineID') {
          lb = 'machineID'
        } else if (this.sort1 === 'startTime') {
          lb = 'trigTimeFullType'
        } else if (this.sort1 === 'endTime') {
          lb = 'lastTrigTimeFullType'
        } else {
          lb = this.sort1
        }
        arr.splice(arr.length, 0, {
          key: lb,
          asc: this.sortFalling ? !this.sortAsc1 : this.sortAsc1
        })
      }
      if (this.sortLabel2 !== ' ') {
        if (this.sort2 === 'machineID') {
          lb = 'machineID'
        } else if (this.sort2 === 'startTime') {
          lb = 'trigTimeFullType'
        } else if (this.sort2 === 'endTime') {
          lb = 'lastTrigTimeFullType'
        } else {
          lb = this.sort2
        }
        arr.splice(arr.length, 0, {
          key: lb,
          asc: this.sortFalling ? !this.sortAsc2 : this.sortAsc2
        })
      }
      this.rows.sort(function (a, b) {
        if (arr[0].asc) {
          return recursiveSortAscending(arr, 0, a, b)
        } else {
          return recursiveSortDescending(arr, 0, a, b)
        }
      })
    },
    print () {
      window.print()
    },
    rz () {
      if (this.$q.fullscreen.isCapable) {
        // this.$q.fullscreen.toggle()
        if (!this.$q.fullscreen.isActive) {
          this.$q.fullscreen.request()
        }
      }
    },
    srz () {
      if (this.$q.fullscreen.isCapable) {
        if (this.$q.fullscreen.isActive) {
          this.$q.fullscreen.exit()
        }
      }
    },
    constructTable () {
      this.sortList.splice(0, this.sortList.length)
      this.sortList.splice(this.sortList.length, 0, {
        label: ' ',
        value: ''
      })
      this.columns.forEach(column => {
        this.sortList.splice(this.sortList.length, 0, {
          label: column.label,
          value: column.name
        })
      })
      this.updateRenderTable()
      this.$nextTick(() => {
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
          }
        })
      })
    }
  }
}

function renderTable (fromInd, toInd, rows, machineHwCFG, departmentID, from, to, calendar, totalWorkDays, hoursADay, totalWorkHours, fun, period, loading, calMethod) {
  rows.splice(0, rows.length)
  var machineID = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
  $.get('/api/getUtilizationMachineRecords/' + machineID + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      loading.hide()
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
      loading.hide()
    } else {
      var records = results.data
      records.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : -1
      })
      for (var record in records) {
        // console.log(record)
        rows.splice(rows.length, 0, {
          machineID: (records[record])['machineID'],
          propertyNum: (records[record])['propertyNum'],
          brand: (records[record])['brand'],
          durationOrigin: (records[record])['utilization'],
          utilization: formatSecond((records[record])['utilization'] / 1000),
          changeMoldCount: (records[record])['changeMoldCount'],
          warningCount: (records[record])['warningCount'],
          errCount: formatSecond((records[record])['errCount'] / 1000),
          moldCount: (records[record])['moldCount'],
          currUtil: (records[record])['currUtil']
        })
      }
      // getWorkDays(machineID, from, to, rows, totalWorkDays, hoursADay, totalWorkHours, fun, calMethod)
      // getDateInterval(from, to, 3, period, function (fromInd, toInd) {
      $.get('/api/getUtilizationMachineRecords/' + machineID + '/' + fromInd + '/' + toInd, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
          loading.hide()
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
          loading.hide()
        } else {
          var records = results.data
          records.sort(function (a, b) {
            return a.machineID > b.machineID ? 1 : -1
          })
          for (var record in records) {
            var prevMachineID = rows.find(row => {
              return row.machineID === (records[record])['machineID']
            })
            fun(prevMachineID, 'prevDurationOrigin', (records[record])['utilization'] || 0)
          }
          // getPrevWorkDays(machineID, fromInd, toInd, rows, totalWorkDays, hoursADay, totalWorkHours, fun, calMethod)
        }
      })
      loading.hide()
      // })
    }
  })
}
function formatSecond (secs) {
  var hr = Math.floor(secs / 3600)
  var min = Math.floor((secs - (hr * 3600)) / 60)
  var sec = parseInt(secs - (hr * 3600) - (min * 60))
  if (min === 0) {
    min = '00'
  } else if (min < 10) {
    min = '0' + min
  }
  if (sec === 0) {
    sec = '00'
  } else if (sec < 10) {
    sec = '0' + sec
  }
  if (hr > 0) {
    hr += ':'
  } else {
    hr = '0:'
  }
  return hr + min + ':' + sec
}
/* function formatSecond (secs) {
  var hr = Math.floor(secs / 3600)
  var min = Math.floor((secs - (hr * 3600)) / 60)
  var sec = parseInt(secs - (hr * 3600) - (min * 60))
  while (min.length < 2) {
    min = '0' + min
  }
  while (sec.length < 2) {
    sec = '0' + min
  }
  if (hr) hr += ':'
  return hr + min + ':' + sec
  } */
/* function getWorkDays (machineID, from, to, rows, totalWorkDays, hoursADay, totalWorkHours, fun, calMethod) {
  $.get('/api/getWorkDays/' + machineID + '/' + from + '/' + to + '/' + calMethod, {}, (results) => {
    var retData = results.data
    // console.log(retData)
    var valuesArr = Object.values(retData)
    var days = Math.max(...valuesArr)
    // console.log(retData)
    // console.log(valuesArr)
    // console.log(days)
    totalWorkDays.splice(0, totalWorkDays.length)
    totalWorkDays.splice(totalWorkDays.length, 0, days)
    totalWorkHours.splice(0, totalWorkHours.length)
    totalWorkHours.splice(totalWorkHours.length, 0, days * hoursADay)
    rows.filter(row => {
      var workSecond = days * hoursADay * 3600
      var opSecond = row.durationOrigin
      fun(row, 'currUtil', `${Math.round(opSecond / workSecond) / 10}%`)
    })
  })
} */
/* function getPrevWorkDays (machineID, from, to, rows, totalWorkDays, hoursADay, totalWorkHours, fun, calMethod) {
  $.get('/api/getWorkDays/' + machineID + '/' + from + '/' + to + '/' + calMethod, {}, (results) => {
    var retData = results.data
    var valuesArr = Object.values(retData)
    var days = Math.max(...valuesArr)
    // console.log(5000)
    // console.log(retData)
    rows.filter(row => {
      var workSecond = days * hoursADay * 3600
      var opSecond = row.prevDurationOrigin || 0
      var currUtil = parseFloat(row.currUtil.split('%')[0]) * 10
      // console.log(row.machineID + '_' + opSecond + '_' + workSecond)
      fun(row, 'pervUtil', `${Math.round(opSecond / workSecond) / 10}%`)
      fun(row, 'diffUtil', `${Math.round(currUtil - opSecond / workSecond) / 10}%`)
    })
  })
} */
/* function getDateInterval (from, to, ind, period, callback) {
  var fromInd
  var toInd
  switch (period) {
    case 'daily':
      fromInd = moment(from).subtract(ind - 2, 'day').format('YYYY-MM-DD')
      toInd = moment(to).subtract(ind - 2, 'day').format('YYYY-MM-DD')
      break
    case 'weekly':
      fromInd = moment(from).subtract(ind - 2, 'week').format('YYYY-MM-DD')
      toInd = moment(to).subtract(ind - 2, 'week').format('YYYY-MM-DD')
      break
    case 'tenDays':
      var yearTenDays = moment(from).year()
      var monthTenDays = moment(from).month()
      var tenDaysFg = 0
      if (moment(from).get('date') < 11) {
        tenDaysFg = 0 + monthTenDays * 3
      } else if (moment(from).get('date') < 21) {
        tenDaysFg = 1 + monthTenDays * 3
      } else {
        tenDaysFg = 2 + monthTenDays * 3
      }
      var section = tenDaysFg - (ind - 2)
      if (section < 0) {
        section += 36
        yearTenDays--
      }
      var tenDaysFgFinal = section % 3
      var monthTenDaysFinal = parseInt(section / 3) + 1
      var yearTenDaysFinal = yearTenDays
      if (tenDaysFgFinal === 0) {
        fromInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(1).format('YYYY-MM-DD')
        toInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(10).format('YYYY-MM-DD')
      } else if (tenDaysFgFinal === 1) {
        fromInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(11).format('YYYY-MM-DD')
        toInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(20).format('YYYY-MM-DD')
      } else {
        fromInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(21).format('YYYY-MM-DD')
        toInd = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').add(1, 'month').date(0).format('YYYY-MM-DD')
      }
      break
    case 'monthly':
      fromInd = moment(from).subtract(ind - 2, 'month').date(1).format('YYYY-MM-DD')
      toInd = moment(to).subtract(ind - 2, 'month').add(1, 'month').date(0).format('YYYY-MM-DD')
      break
    case 'quarterly':
      fromInd = moment(from).subtract(ind - 2, 'quarter').date(1).format('YYYY-MM-DD')
      toInd = moment(to).subtract(ind - 2, 'quarter').add(1, 'month').date(0).format('YYYY-MM-DD')
      break
    case 'yearly':
      fromInd = moment(from).subtract(ind - 2, 'year').date(1).format('YYYY-MM-DD')
      toInd = moment(to).subtract(ind - 2, 'year').add(1, 'month').date(0).format('YYYY-MM-DD')
      break
    case 'period':
      var diff = moment(to).diff(moment(from)) / 3600 / 24 / 1000 + 1
      fromInd = moment(from).subtract(diff * (ind - 2), 'days').format('YYYY-MM-DD')
      toInd = moment(to).subtract(diff * (ind - 2), 'days').format('YYYY-MM-DD')
      break
  }
  // console.log('fromInd: ' + fromInd + '   toInd: ' + toInd + '   ind: ' + ind)
  callback(fromInd, toInd)
} */
function getPageSetting (colorArr, colorConditionArr, blink) {
  $.get('/api/getPageSetting', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // console.log('沒有機台資料')
      // // console.log(results.data)
    } else {
      blink.splice(0, blink.length)
      colorArr.splice(0, colorArr.length)
      colorConditionArr.splice(0, colorConditionArr.length)
      results.data.forEach(result => {
        var styleStr = 'color: ' + result['fontColor'] + '; background-color: ' + result['fontBackground'] + '; fontSize:' + result['fontSized'] + 'px;'
        if (result['fontBold']) {
          styleStr = styleStr + 'fontWeight: bold;'
        }
        if (result['fontItalic']) {
          styleStr = styleStr + 'fontStyle: italic;'
        }
        blink.splice(blink.length, 0, result['fontBlink'])
        colorArr.splice(colorArr.length, 0, styleStr)
        colorConditionArr.splice(colorConditionArr.length, 0, result['rule'])
      })
    }
  })
}
function recursiveSortAscending (sortArr, arrIdx, a, b) {
  if (arrIdx === sortArr.length) {
    return -1
  }
  if (a[sortArr[arrIdx]['key']] > b[sortArr[arrIdx]['key']]) {
    return 1
  } else if (a[sortArr[arrIdx]['key']] < b[sortArr[arrIdx]['key']]) {
    return -1
  } else if ((a.machineID === '合計') || (b.machineID === '合計')) {
    return 1
  } else {
    if (++arrIdx === sortArr.length) {
      return -1
    } else if (sortArr[arrIdx].asc) {
      return recursiveSortAscending(sortArr, arrIdx, a, b)
    } else {
      return recursiveSortDescending(sortArr, arrIdx, a, b)
    }
  }
}
function recursiveSortDescending (sortArr, arrIdx, a, b) {
  if (arrIdx === sortArr.length) {
    return -1
  }
  if (a[sortArr[arrIdx]['key']] < b[sortArr[arrIdx]['key']]) {
    return 1
  } else if (a[sortArr[arrIdx]['key']] > b[sortArr[arrIdx]['key']]) {
    return -1
  } else if ((a.machineID === '合計') || (b.machineID === '合計')) {
    return 1
  } else {
    if (++arrIdx === sortArr.length) {
      return -1
    } else if (sortArr[arrIdx].asc) {
      return recursiveSortAscending(sortArr, arrIdx, a, b)
    } else {
      return recursiveSortDescending(sortArr, arrIdx, a, b)
    }
  }
}
function recursiveMakeMachineArr (orgParam) {
  if (typeof orgParam !== 'object') {
    return [orgParam]
  } else {
    var retArr = []
    var objKeys = Object.keys(orgParam)
    objKeys.forEach(obj => {
      orgParam[obj].forEach(elm => {
        retArr = retArr.concat(recursiveMakeMachineArr(elm))
      })
    })
    return retArr
  }
}
function recursiveFindDept (orgParam) {
  if (typeof orgParam !== 'object') {
    return 1
  } else {
    var retInt = 0
    var retMaxInt = 0
    var objKeys = Object.keys(orgParam)
    objKeys.forEach(obj => {
      orgParam[obj].forEach(elm => {
        retInt = recursiveFindDept(elm)
        if (retMaxInt < retInt) {
          retMaxInt = retInt
        }
      })
    })
    return retMaxInt + 1
  }
}
</script>
<style lang="stylus">
  h4{
     font-family: Microsoft JhengHei;
     font-size:200%;
     font-weight:bold;
    }
   h5{
     font-family: Microsoft JhengHei;
     font-size:150%;
     font-weight:bold;
    }
   span{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
    }
   p{
     font-family: Microsoft JhengHei;
     font-size:150%;
     font-weight:bold;
    }
  .q-checkbox{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
    }
  .q-btn{
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight: 200;
    }
  .q-table{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .q-select{
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .q-datetime{
     font-family:Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
     .blink {
    animation: blink .9s linear infinite;
    -webkit-animation: blink .9s linear infinite;
    -moz-animation: blink .9s linear infinite;
    -ms-animation: blink .9s linear infinite;
    -o-animation: blink .9s linear infinite;
}
@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-webkit-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-moz-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-ms-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-o-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
  .icon-svg51:before{
  content : url("../assets/small32/funnel.png");
}
.icon-svg52:before{
  content : url("../assets/small32/A-to-Z.png");
}
.icon-svg53:before{
  content : url("../assets/small32/Chart.png");
}
.icon-svg54:before{
  content : url("../assets/small32/Color-dial.png");
}
.icon-svg55:before{
  content : url("../assets/small32/Plus.png");
}
.icon-svg56:before{
  content : url("../assets/small32/No-sign.png");
}
.icon-svg57:before{
  content : url("../assets/small32/excel.png");
}
.icon-svg58:before{
  content : url("../assets/small32/printer.png");
}
</style>
