<template>
  <div class="layout-padding">
  <section class="content">
   <div class="row inline bg-light-blue-7 full-width glossy">
    <div class="col-12 q-pl-xl text-white">
      <h4>{{type}}異常明細表</h4>
    </div>
    </div>
     <div class="row justify-end q-pt-xs q-pb-xs q-pr-xl text-white bg-light-blue-8 full-width ">
          <q-btn outline glossy v-if="!$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
    </div>
     <div class="column bg-white full-width no-margin">
    <div class="row justify-around q-pt-md">
        <div class="col q-pl-xl q-pt-sm q-mt-md">
      <span>{{displayDate}}
    {{displayDepartment}}
    {{displayZone}}
    {{dateFrom}} ~ {{dateTo}}</span>
    </div>
        <div class="row inline q-mr-xl">
      <h5 v-if="status !== null">({{status}})</h5>
      <q-datetime v-model="selectedDate" class="no-margin" type="date" modal stack-label=" " @change="ttt(selectedDate)"/>
      <q-datetime v-model="selectedDateE" class="no-margin" type="date" modal stack-label=" " @change="ttt1(selectedDateE)"/>
      <q-select color="white" v-model="departmentSelected" class="no-margin" :options="departmentArr" stack-label=" " :display-value="departmentSelected" toggle error  @input="departmentSelFunc(departmentSelected)">
      </q-select>
      <q-select color="white" v-model="zoneSelected" class="no-margin" :options="zoneArr" stack-label=" " :display-value="zoneSelected" toggle error @input="zoneSelFunc(zoneSelected)">
      </q-select>
      <q-select color="white" v-model="machineIDSelected" class="no-margin" :options="machineIDArr" stack-label=" " :display-value="machineIDSelected" toggle error>
      </q-select>
      </div>
      </div>
        <!--<q-item>-->
          {{zoneS}}
          <div class="row justify-center q-mt-xl">
        <p> <span>{{displayDepartment}}{{displayZone}}故障時數</span>
        <q-table
          :data="rowsTotal"
          :columns="columnsTotal"
          :rows-per-page-options="config.pagination.options"
          :pagination.sync="serverPagination"
          separator="cell"
          :dense="true"
          row-key="name"
          color="amber"
          hide-bottom
      >
      </q-table></p>
          <pie-chart :label="myChartLabelTotal" :data="pieDataTotal" :color="producePieColor" :options="myChart2Options"></pie-chart>
    </div>
        <div v-for="(data, key) in labelText" v-bind:key="key" class="row justify-center q-mt-xl">
        <p> <span>{{data[0]}}
        {{departmentID}}</span>
        <q-table
        :data="rows[key]"
          :columns="columns[key]"
          :rows-per-page-options="config.pagination.options"
          :pagination.sync="serverPagination"
          separator="cell"
          :dense="true"
          row-key="name"
          color="amber"
          hide-bottom
      >
      </q-table></p>
          <pie-chart :label="myChartLabel[key]" :data="pieData[key]" :color="producePieColor" :options="myChart2Options"></pie-chart>
    </div>
    </div>
  </section>
  </div>
   </template>
<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
// import func from '../../vue-temp/vue-editor-bridge'
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
    'reportType',
    'group',
    'orgArr'
  ],
  data: function () {
    return {
      // ------------------------------機台編號用
      machineIDArrS: [],
      organDept: 0,
      displayZone: '',
      displayDepartment: '',
      // ------------------------------
      fullscreen: false,
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
      selectedDate: '',
      selectedDateE: '',
      selectedDateFrom: moment().format('YYYY-MM-DD'),
      selectedDateTo: moment().format('YYYY-MM-DD'),
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
      columns: {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: []},
      rows: {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: []},
      abnormalColArr: {
        '課別': 'department',
        '區別': 'zone',
        '機台': 'machineID',
        '計時開始': 'trigTime',
        '計時結束': 'lastTrigTime',
        '生產時間統計': 'duration',
        '備註': 'note'
      },
      serverPagination: {
        rowsPerPage: 20
      },
      departmentArr: [],
      zoneArr: [],
      machineIDArr: [],
      organization: {},
      departmentSel: '',
      zoneSel: '',
      machineIDSel: '',
      departmentSelected: '',
      zoneSelected: '',
      machineIDSelected: '',
      columnsTotal: [{
        label: '單位',
        field: 'unit',
        name: 'unit'
      }, {
        label: '故障時數',
        field: 'totalHour',
        name: 'totalHour'
      }, {
        label: '比率',
        field: 'percentage',
        name: 'percentage'
      }, {
        label: '機台',
        field: 'count',
        name: 'count'
      }],
      rowsTotal: [],
      pieDataTotal: [],
      myChartLabelTotal: [],
      pieData: {0: []}, // [9.4, 9.5, 37.5, 8],
      myChartLabel: {0: []}, // ['6A', '6B', '6C', '8F'],
      producePieColor: ['#00D8FF', '#DD1B16', 'green', 'pink'],
      // myChart2: { labels: [], datasets: [] },
      myChart2Options: {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
          mode: 'percentage',
          precision: 1
        }
      },
      labelText: {0: [], 1: []}
    }
  },
  created: function () {
    /* var initDoc = {
      '_id': 'timeSlicePoint',
      '日切換點': '08:00',
      '時段點1': '12:00',
      '時段點2': '16:30',
      '時段點3': '20:00',
      '時段點4': '23:00'
    }
    var shift = {
      '_id': 'shiftCfg',
      '日班': {'from': '日切換點', 'to': '時段點2'},
      '加班': {'from': '時段點2', 'to': '時段點3'},
      '夜班': {'from': '時段點3', 'to': '日切換點'}
    } */
    this.organization = {
      '_id': 'organization',
      '全廠': {'all': ['成型一課', '成型二課', '成型三課']},
      '成型一課': {'1A': ['全部機台', '1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], '1B': ['全部機台'], '1C': ['全部機台']},
      '成型二課': {'2A': ['全部機台'], '2B': ['全部機台'], '2C': ['全部機台']}
    }
    var departmentIDArr = (Object.keys(this.organization)).filter(elm => { return elm !== '_id' }) // ['全廠', '成型一課', '成型二課', '成型三課']
    this.departmentArr.splice(0, this.departmentArr.length)
    this.departmentArr.length = 0
    departmentIDArr.forEach(elm => {
      this.departmentArr.splice(this.departmentArr.length, 0, {
        label: elm,
        value: elm
      })
    })
    this.departmentSel = '成型一課'
    this.zoneArr.length = 0
    Object.keys(this.organization[this.departmentSel]).forEach(elm => {
      this.zoneArr.splice(this.zoneArr, 0, {
        label: elm,
        value: elm
      })
    })
    this.zoneSel = '1A'
    this.machineIDArr.length = 0
    // console.log((this.organization[this.departmentSel])[this.zoneSel])
    var tempArr = (this.organization[this.departmentSel])[this.zoneSel]
    tempArr.forEach(elm => {
      this.machineIDArr.splice(this.machineIDArr.length, 0, {
        label: elm,
        value: elm
      })
    })
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
    },
    selectedDateS: function () {
      this.updateRenderTable()
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
    selectedDate: function () {
      this.updateRenderTable()
    },
    checked () {
      this.updateRenderTable() // this.constructTable()
    },
    department () {
      this.updateRenderTable() // this.constructTable()
    }
  },
  mounted () {
    this.departmentSelected = this.department
    this.machineIDSelected = '全部機台'
    var zoneIDArr = Object.keys(this.organization[this.department]).filter(elm => { return elm !== '_id' })
    this.zoneArr.splice(0, this.zoneArr.length)
    this.zoneArr.length = 0
    zoneIDArr.forEach(elm => {
      this.zoneArr.splice(this.zoneArr.length, 0, {
        label: elm,
        value: elm
      })
    })
    this.updateRenderTable()
  },
  methods: {
    updateRenderTable () {
      if (this.$q.loading.isActive) {
        return
      }
      this.$q.loading.show({
        delay: 400 // ms
      })
      // ------------------------------
      this.machineIDArrS = recursiveMakeMachineArr(this.zoneS)
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
          this.dateFrom = moment(this.selectedDateS).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedDateS).format('YYYY-MM-DD')
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
      this.selectedDate = from
      this.selectedDateE = to
      renderTable(this.columns, this.rows, this.machineIDArrS, from, to, this.labelText, this.pieData, this.myChartLabel, this.$q.loading, this.rowsTotal, this.orgArr, this.displayDepartment)
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
    rowclick (event) {
    },
    refresh (done) {
      setTimeout(() => {
        done()
      }, 3000)
    },
    ttt (val) {
      this.$router.push({name: 'AbnormalReport1', params: {period: 'period', department: this.department, zone: this.zone, selectedDatePeriod: val, selectedDatePeriodTo: this.selectedDateE}})
    },
    ttt1 (val) {
      this.$router.push({name: 'AbnormalReport1', params: {period: 'period', department: this.department, zone: this.zone, selectedDatePeriod: this.selectedDate, selectedDatePeriodTo: val}})
    },
    departmentSelFunc (data) {
      var zoneIDArr = Object.keys(this.organization[this.departmentSelected]).filter(elm => { return elm !== '_id' })
      this.zoneArr.splice(0, this.zoneArr.length)
      this.zoneArr.length = 0
      zoneIDArr.forEach(elm => {
        this.zoneArr.splice(this.zoneArr.length, 0, {
          label: elm,
          value: elm
        })
      })
      this.zoneSelected = (this.zoneArr[0]).value
      this.zoneSelFunc(this.zoneSelected)
    },
    zoneSelFunc (data) {
      var machineIDArrKeys = (this.organization[this.departmentSelected])[data]
      this.machineIDArr.splice(0, this.machineIDArr.length)
      this.machineIDArr.length = 0
      machineIDArrKeys.forEach(elm => {
        this.machineIDArr.splice(this.machineIDArr.length, 0, {
          label: elm,
          value: elm
        })
      })
      this.machineIDSelected = (this.machineIDArr[0]).value
    }
  }
}
// 分類原則，因此需要知道呈現的最小單位是哪一個部分
function renderTable (columns, rows, machineIDArr, from, to, labelText, pieData, myChartLabel, loading, rowsTotal, orgArr, displayDepartment) {
  /* var Level = [{
    _id: '1A01', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI14', abridge: '機台'
  }, {
    _id: '1A02', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI52', abridge: '機台'
  }, {
    _id: '1A03', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI34', abridge: '機台'
  }, {
    _id: '1A04', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI20', abridge: '機台'
  }, {
    _id: '1A05', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI18', abridge: '機台'
  }, {
    _id: '1A06', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI17', abridge: '機台'
  }, {
    _id: '1A07', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI16', abridge: '機台'
  }, {
    _id: '1A08', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI15', abridge: '機台'
  }, {
    _id: '1A09', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台'
  }, {
    _id: '1B01', father: '1B', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台'
  }, {
    _id: '2C01', father: '2C', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台'
  }, {
    _id: '1A', father: '成型一課', son: ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], level: 2, levelName: '區', data: ''
  }, {
    _id: '1B', father: '成型一課', son: ['1B01'], level: 2, levelName: '區', data: ''
  }, {
    _id: '1C', father: '成型一課', son: [], level: 2, levelName: '區', data: ''
  }, {
    _id: '2C', father: '成型二課', son: ['2C01'], level: 2, levelName: '區', data: ''
  }, {
    _id: '成型一課', father: '全廠', son: ['1A', '1B', '1C'], level: 3, levelName: '課', data: ''
  }, {
    _id: '成型二課', father: '全廠', son: ['2A', '2B', '2C'], level: 3, levelName: '課', data: ''
  }, {
    _id: '全廠', father: 'organization', son: ['成型一課', '成型二課'], level: 4, levelName: '廠', data: ''
  }] */
  var failTotalMs = {}
  var Level = []
  Object.keys(orgArr).forEach(orgKey => {
    Level.splice(Level.length, 0, orgArr[orgKey])
  })
  var levelObj = {}
  // var levelSonArr = []
  // // console.log(classifyBase)
  // console.log(22222222222222222222222)
  var baseIndex = 0
  machineIDArr.forEach(base => {
    labelText[baseIndex] = []
    labelText[baseIndex++].splice(0, 0, base)
    // 問後台取得
    levelObj[base] = recursiveFindMachineID(Level, base, -1)
  })
  // ----------------取得機台編號
  var objKeys = Object.keys(levelObj)
  var errStr = {totalMoldErr: '模具', totalMachineErr: '成型機', totalArmErr: '機械手', totalOtherErr: '其他設備', totalErr: '合計'}
  var cntDataKeys = Object.keys(errStr)
  $.get('/api/getAbnormalTable/' + machineIDArr + '/' + from + '/' + to + '/0', {}, (results) => {
    var ret = results.data
    objKeys.forEach((objKey, idx) => {
      var cntData = {}
      cntDataKeys.forEach(cntDataKey => {
        cntData[cntDataKey] = 0
      })
      var subArr = levelObj[objKey]
      subArr.forEach(machineID => {
        if (ret.hasOwnProperty(machineID)) {
          cntDataKeys.forEach(cntDataKey => {
            if ((ret[machineID]).hasOwnProperty(cntDataKey)) {
              cntData[cntDataKey] += (ret[machineID])[cntDataKey]
            }
          })
        }
      })
      var totalFailHr = 0
      cntDataKeys.forEach(cntDataKey => {
        if (cntData.hasOwnProperty(cntDataKey)) {
          totalFailHr += cntData[cntDataKey]
        }
      })
      myChartLabel[idx] = []
      pieData[idx] = []
      rows[idx] = []
      columns[idx] = []
      columns[idx].splice(columns[idx].length, 0, {
        label: '故障原因',
        field: 'reason',
        name: 'reason'
      })
      columns[idx].splice(columns[idx].length, 0, {
        label: '故障時數',
        field: 'totalHour',
        name: 'totalHour'
      })
      columns[idx].splice(columns[idx].length, 0, {
        label: '比率',
        field: 'percentage',
        name: 'percentage'
      })
      cntDataKeys.forEach(cntDataKey => {
        var percentage = 0
        if (cntDataKey === 'totalErr') {
          if (totalFailHr > 0) {
            percentage = totalFailHr / totalFailHr
            failTotalMs[objKey] = totalFailHr // {'1A01': ms, '1A02': ms}
          } else {
            percentage = 0
            failTotalMs[objKey] = 0
          }
          rows[idx].splice(rows[idx].length, 0, {
            reason: errStr[cntDataKey],
            totalHour: formatSecond(totalFailHr / 1000),
            percentage: `${(Math.round(percentage * 1000) / 10)}%`
          })
          pieData[idx].splice(pieData[idx].length, 0, cntData[cntDataKey])
          myChartLabel[idx].splice(myChartLabel[idx].length, 0, errStr[cntDataKey])
        } else {
          if (totalFailHr > 0) {
            percentage = cntData[cntDataKey] / totalFailHr
          } else {
            percentage = 0
          }
          rows[idx].splice(rows[idx].length, 0, {
            reason: errStr[cntDataKey],
            totalHour: formatSecond(cntData[cntDataKey] / 1000),
            percentage: `${(Math.round(percentage * 1000) / 10)}%`
          })
          pieData[idx].splice(pieData[idx].length, 0, cntData[cntDataKey])
          myChartLabel[idx].splice(myChartLabel[idx].length, 0, errStr[cntDataKey])
        }
        /* rows[idx].splice(rows[idx].length, 0, {
          reason: errStr[cntDataKey],
          totalHour: formatSecond(cntData[cntDataKey] / 1000),
          percentage: `${(Math.round(percentage * 1000) / 10)}%`
        })
        pieData[idx].splice(pieData[idx].length, 0, cntData[cntDataKey])
        myChartLabel[idx].splice(myChartLabel[idx].length, 0, errStr[cntDataKey]) */
      })
    })
    // 新增
    rowsTotal.splice(0, rowsTotal.length)
    var tgt = Level.find(subElm => {
      if (subElm._id === displayDepartment) {
        return subElm
      }
    })
    if (tgt !== undefined) {
      tgt.son.forEach(elm => {
        var machineArr = recursiveMakeMachineArrV2(Level, elm)
        var calculusMs = 0
        machineArr.forEach(mch => {
          if (failTotalMs.hasOwnProperty(mch)) {
            calculusMs += failTotalMs[mch]
          }
        })
        // console.log('總合計算')
        // console.log(elm)
        // console.log(machineArr)
        rowsTotal.splice(rowsTotal.length, 0, {
          unit: elm,
          totalHour: formatSecond(calculusMs / 1000),
          count: machineArr.length
        })
      })
    }
    loading.hide()
  })
}
function recursiveFindMachineID (Level, base, index) {
  var filterLevel = Level.filter(elm => {
    return elm._id === base
  })
  var retArr = []
  if (filterLevel.length <= 0) {
    return retArr
  } else if (filterLevel[0].level === 1) {
    retArr.splice(retArr.length, 0, filterLevel[0]._id)
    return retArr
  } else if (filterLevel[0].level === index) {
    retArr.splice(retArr.length, 0, filterLevel[0]._id)
    return retArr
  }
  filterLevel[0].son.forEach(element => {
    retArr = retArr.concat(recursiveFindMachineID(Level, element, filterLevel[0].level))
  })
  return retArr
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
function recursiveMakeMachineArrV2 (orgArr, name) {
  var tgt = orgArr.find(elm => {
    if (elm._id === name) {
      return elm
    }
  })
  if (tgt === undefined) {
    // console.log('找不倒' + name)
    return []
  } else {
    if (tgt.hasOwnProperty('level') && tgt.hasOwnProperty('son') && tgt.hasOwnProperty('_id')) {
      if (tgt.level === 1) {
        return [tgt._id]
      } else {
        var retArr = []
        tgt.son.forEach(sonElm => {
          retArr = retArr.concat(recursiveMakeMachineArrV2(orgArr, sonElm))
        })
        return retArr
      }
    } else {
      // console.log('找不倒' + tgt)
      return []
    }
  }
}
</script>
<style lang="stylus">
  h4{
     font-family: Microsoft JhengHei;
     font-size:180%;
     font-weight:600;
    }
   h5{
     font-family: Microsoft JhengHei;
     font-size:140%;
     font-weight:300;
    }
   span{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
    }
  .q-btn{
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight: 200;
    }
  i{
     font-size:200%;
   }
  .q-table{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .table{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .tr{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .td{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .q-tr{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .q-td{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
    .icon-svg58:before{
  content : url("../assets/small32/printer.png");
}
    </style>
