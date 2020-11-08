<template>
  <div class="layout-padding">
  <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>模具編號 - {{type}}生產報表 &nbsp;&nbsp;&nbsp;&nbsp; {{displayDepartment}}{{displayZone}}</h4>
        <h4 v-if="status !== null">({{status}}) &nbsp;&nbsp;&nbsp;&nbsp; {{displayDepartment}}{{displayZone}}</h4>
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
      <q-btn outline glossy v-if="!$q.fullscreen.isActive"  @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57"  @click="ExcelExport(rows, columns, '模具編號生產紀錄統計表')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
    <div class="row justify-around bg-white full-width no-margin">
    <div class="row justify-around q-ma-md full-width">
    <div class="col-auto q-ml-xs q-mt-sm">
      <p>{{displayDate}} - {{dateFrom}} ~ {{dateTo}}</p>
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
    <div class="q-mt-sm">
    <span>{{MoldReportFrom}}~{{MoldReportTo}}</span>
    </div>
    <div>
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
    +
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
    +
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
    <div class="row center-block">
    <div class="col-md-12 bg-grey-3 justify-center q-mb-sm q-mt-sm">
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
      <q-tr slot="body" slot-scope="props" :props="props" >
        <q-td v-for="column in columns" v-bind:key="column.name" >
          <div v-if="(props.row['show'] === true) && column.required === true && column.name === 'totalAlm'">
            <div v-if="colorEn && props.row[column.name] > colorConditionArr[0][0]" :style="colorArr[0]">
              <span v-if="blink[0]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else>
              {{props.row[column.name]}}
            </div>
          </div>
          <div v-else-if="(props.row['show'] === true) && column.required === true && column.name === 'performance'" slot-scope="props" :props="props">
            <div v-if="colorEn && props.row[column.name] > colorConditionArr[1][0]" :style="colorArr[1]">
              <span v-if="blink[1]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row[column.name] < colorConditionArr[2][0]" :style="colorArr[2]">
              <span v-if="blink[2]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else>
              {{props.row[column.name]}}
            </div>
          </div>
          <div v-else-if="(props.row['show'] === true) && column.required === true && column.name === 'average'" slot-scope="props" :props="props">
            <div v-if="colorEn && props.row[column.name] >= props.row['standard'] * colorConditionArr[3][0]" :style="colorArr[3]">
              <span v-if="blink[3]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row[column.name] <= props.row['standard'] * colorConditionArr[4][0]" :style="colorArr[4]">
              <span v-if="blink[4]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else>
              {{props.row[column.name]}}
            </div>
          </div>
          <div v-else-if="(props.row['show'] === true) && column.required === true && column.name === 'badRate'" slot-scope="props" :props="props">
            <div v-if="colorEn && (props.row['badRateVal'] * 1) >= colorConditionArr[5][0]" :style="colorArr[5]">
              <span v-if="blink[5]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else>
              {{props.row[column.name]}}
            </div>
          </div>
          <div v-else-if="(props.row['show'] === true) && column.required === true" slot-scope="props" :props="props">
            {{props.row[column.name]}}
          </div>
        </q-td>
      </q-tr>
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
    'selectedDatePeriodTo',
    'MoldReportFrom',
    'MoldReportTo',
    'checked'
  ],
  data: function () {
    return {
      calendar: [],
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
      // ------------------------------
      type: '明細',
      status: null,
      totalDays: 30,
      hoursADay: 24,
      totalHours: 720,
      totalWorkDays: [0],
      totalWorkHours: [0],
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
          sort: true,
          required: true
        },
        {
          label: '模具名稱',
          field: 'moldName',
          name: 'moldName',
          width: '200px',
          filter: true,
          type: 'string',
          required: true
        },
        {
          label: '警報',
          field: 'totalAlm',
          name: 'totalAlm',
          width: '40px',
          filter: true,
          type: 'string',
          required: true
        },
        {
          label: '換模',
          field: 'changeMold',
          name: 'changeMold',
          width: '40px',
          filter: true,
          type: 'string',
          required: true
        },
        {
          label: '穴數',
          field: 'cavities',
          name: 'cavities',
          width: '40px',
          required: true
        },
        {
          label: '自動生產',
          field: 'durationStr',
          name: 'durationStr',
          width: '100px',
          type: 'string',
          required: true
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '100px',
          required: true
        },
        {
          label: '應產數量pcs',
          field: 'targetCount',
          name: 'targetCount',
          width: '80px',
          required: true
        },
        {
          label: '入庫數量pcs',
          field: 'warehousing',
          name: 'warehousing',
          width: '80px',
          required: true
        },
        {
          label: '不良數量pcs',
          field: 'badNum',
          name: 'badNum',
          width: '80px',
          required: true
        },
        {
          label: '不良率 %',
          field: 'badRate',
          name: 'badRate',
          width: '60px',
          required: true
        },
        {
          label: '標準週期S',
          field: 'standard',
          name: 'standard',
          width: '60px',
          type: 'string',
          required: true
        },
        {
          label: '最短週期S',
          field: 'min',
          name: 'min',
          width: '60px',
          type: 'string',
          required: true
        },
        {
          label: '平均週期S',
          field: 'average',
          name: 'average',
          width: '60px',
          type: 'string',
          required: true
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '80px',
          type: 'string',
          required: true
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
    weeksInYear: function () {
      return moment(`${this.selectedYear}`, 'YYYY').weeksInYear()
    }
  },
  filters: {
  },
  watch: {
    calendar: function () {
      this.selectedWorkDay()
    },
    colorConditionArr: function () {
      this.hoursADay = this.colorConditionArr[9][0]
      this.selectedWorkDay()
    },
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
    },
    selectedYearWeekly: function () {
      this.updateRenderTable()
    },
    selectedWeek: function () {
      this.updateRenderTable()
    },
    yearMonthTenDays: function () {
      this.updateRenderTable()
    },
    selectedTenDays: function () {
      this.updateRenderTable()
    },
    yearMonth: function () {
      this.updateRenderTable()
    },
    selectedYearQuarter: function () {
      this.updateRenderTable()
    },
    selectedQuarter: function () {
      this.updateRenderTable()
    },
    selectedYear: function () {
      this.updateRenderTable()
    },
    selectedYearTo: function () {
      this.updateRenderTable()
    },
    selectedDatePeriod: function () {
      this.updateRenderTable()
    },
    selectedDatePeriodTo: function () {
      this.updateRenderTable()
    },
    MoldReportFrom: function () {
      this.updateRenderTable() // checkIsShow(this.rows, this.MoldReportFrom, this.MoldReportTo, Vue.set)
    },
    MoldReportTo: function () {
      this.updateRenderTable() // checkIsShow(this.rows, this.MoldReportFrom, this.MoldReportTo, Vue.set)
    },
    checked () {
      this.updateRenderTable()
    }
  },
  mounted () {
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    // console.log(this.sortList)
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
    this.sortLabel0 = this.sortList[1].label
    this.sortLabel1 = this.sortList[2].label
    this.sortLabel2 = this.sortList[0].label
    this.sort0 = this.sortList[1].value
    this.sort1 = this.sortList[2].value
    this.sort2 = this.sortList[0].value
    this.updateRenderTable()
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
            this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 ' + moment(this.yearMonthTenDays).date(1).format('M') + '月上旬'
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
      this.totalDays = moment(this.dateTo).diff(moment(this.dateFrom), 'days') + 1
      this.totalHours = this.hoursADay * this.totalDays
      this.departmentID = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
      // getWorkDays(this.machineIDArr, from, to, this.totalWorkDays, this.hoursADay, this.totalWorkHours)
      renderTable(this.rows, this.machineIDArr, from, to, this.MoldReportFrom, this.MoldReportTo, Vue.set, this.$q.loading)
      this.getValidCalendar(from, to)
    },
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
    test5 (a, b) {
      // console.log('test5')
      // console.log(a)
      // console.log(b)
    },
    sortEvent () {
      // var arr = [ 'machineLabel', 'trigTimeFullType' ]
      var arr = []
      var lb = ''
      if (this.sortLabel0 !== ' ') {
        if (this.sort0 === 'machineID') {
          lb = 'machineLabel'
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
          lb = 'machineLabel'
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
          lb = 'machineLabel'
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
    }
  }
}

function renderTable (rows, machineIDs, from, to, MoldReportFrom, MoldReportTo, fun, loading) {
  // // console.log([departmentID, from, to])
  // init the records in the rows
  rows.splice(0, rows.length)
  // var machineID = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
  var records
  $.get('/api/getMoldPeriodMachineRecords/' + machineIDs + '/' + from + '/' + to + '/' + MoldReportFrom + '/' + MoldReportTo, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      records = results.data
      records.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : -1
      })
      for (var record in records) {
        // console.log(record)
        rows.splice(rows.length, 0, {
          totalAlm: (records[record])['totalAlm'],
          moldName: (records[record])['moldName'],
          moldNum: (records[record])['moldNum'],
          changeMold: (records[record])['changeMold'],
          // product: (records[record])['product'],
          // productName: (records[record])['productName'],
          cavities: (records[record])['cavities'],
          durationStr: formatSecond((records[record])['durationStr'] / 1000), // (records[record])['durationStr'], // 排班工作時間累計
          moldCount: (records[record])['moldCount'],
          targetCount: (records[record])['targetCount'],
          warehousing: (records[record])['warehousing'],
          badNum: (records[record])['badNum'],
          badRate: `${((records[record])['badRate'] * 100).toFixed(2)}%`,
          badRateVal: ((records[record])['badRate'] * 100).toFixed(2),
          standard: (records[record])['standard'],
          min: Math.round((records[record])['min'] * 10) / 10,
          average: Math.round((records[record])['average'] / 100) / 10,
          performance: Math.round((records[record])['performance'] * 1000000) / 10, // `${(records[record])['performance'].toFixed(2)}%`
          show: true
        })
      }
      rows.sort(function (a, b) {
        return a.moldNum > b.moldNum ? 1 : -1
      })
      checkIsShow(rows, MoldReportFrom, MoldReportTo, fun)
    }
    loading.hide()
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
/* function getWorkDays (machineID, from, to, totalWorkDays, hoursADay, totalWorkHours) {
  $.get('/api/getWorkDays/' + ['1A01'] + '/' + from + '/' + to, {}, (results) => {
    var retData = results.data
    var valuesArr = Object.values(retData)
    var days = Math.max(...valuesArr)
    totalWorkDays.splice(0, totalWorkDays.length)
    totalWorkDays.splice(totalWorkDays.length, 0, days)
    totalWorkHours.splice(0, totalWorkHours.length)
    totalWorkHours.splice(totalWorkHours.length, 0, days * hoursADay)
  })
} */
function checkIsShow (rows, ReportFrom, ReportTo, fun) {
  if ((ReportFrom !== 'XXXX-XXXX') && (ReportTo !== 'XXXX-XXXX')) {
    rows.forEach(row => {
      if ((row.product < ReportFrom) || (row.product > ReportTo)) {
        fun(row, 'show', false)
      } else {
        fun(row, 'show', true)
      }
    })
  } else if ((ReportFrom === 'XXXX-XXXX') && (ReportTo === 'XXXX-XXXX')) {
    rows.forEach(row => {
      fun(row, 'show', true)
    })
  }
}
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
  h1{
     font-family: Microsoft JhengHei;
     font-size:150%;
     font-weight:600;
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
