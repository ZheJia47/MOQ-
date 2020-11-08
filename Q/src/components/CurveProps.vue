<template>
<div class="layout-padding">
  <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>平均不良率</h4>
      </div>
      </div>
      <div class="row justify-center q-pt-xs q-pb-xs text-white bg-light-blue-8 full-width ">
      <q-btn outline glossy label='色彩設定' icon="icon-svg54" @click="colorEn = !colorEn"/>
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
    <div>
      <h4>{{displayDepartment}} - {{displayZone}}</h4>
      <!--{{period}}
      {{yearMonth}}
      {{defectiveTableTimes}}
      {{defectiveGroup}}
      -----
      {{yearSplit}}
      --
      {{monthSplit}}
      ---
      {{ymEnd}}-->
    </div>
      <div v-for="(data, key) in labelText" v-bind:key="key" class="col-4 q-mt-md q-mb-xl q-ml-md">
        {{data}}平均不良率
      <q-table
        :data="rows[data]"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        :hide-header="false"
        :hide-bottom="true"
        separator="cell"
        row-key="name"
      >
        <q-tr slot="body" slot-scope="props" :props="props" >
          <q-td v-for="column in columns" v-bind:key="column.name" >
            <div v-if="colorEn && props.row[column.name] >= colorConditionArr[5][0] && props.row.__index === 0" :style="colorArr[5]">
              <span v-if="blink[5]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else>
              {{props.row[column.name]}}
            </div>
          </q-td>
        </q-tr>
      </q-table>
      <line-chart3 :data="myChart2[data]" :labels="labels" :options="myChart2Options" :labelData="data" backgroundColor="red"></line-chart3>
      </div>
   <div>
   </div>
  </section>
</div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
import Vue from 'vue'
export default {
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
    'defectiveTableTimes',
    'defectiveGroup',
    'checked',
    'topName'
  ],
  data: function () {
    return {
      Level: [],
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
      architecture: {'level1': {label: '一階', value: '機台編號'}, 'level2': {label: '二階', value: '區'}, 'level3': {label: '三階', value: '課'}},
      organization: {
        '_id': 'organization',
        '全廠': {'all': ['成型一課', '成型二課', '成型三課']},
        '成型一課': {'1A': ['全部機台', '1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], '1B': ['全部機台'], '1C': ['全部機台']},
        '成型二課': {'2A': ['全部機台'], '2B': ['全部機台'], '2C': ['全部機台']}
      },
      organizationDoc: {
        '_id': 'organization',
        '全廠': [
          {'成型一課': {'1A': ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], '1B': [], '1C': []}},
          {'成型二課': {'2A': [], '2B': [], '2C': []}}
        ]
      },
      initDoc: {
        '_id': 'timeSlicePoint',
        '日切換點': '08:00',
        '時段點1': '12:00',
        '時段點2': '16:30',
        '時段點3': '20:00',
        '時段點4': '23:00'
      },
      shift: {
        '_id': 'shiftCfg',
        '日班': {'from': '日切換點', 'to': '時段點2'},
        '加班': {'from': '時段點2', 'to': '時段點3'},
        '夜班': {'from': '時段點3', 'to': '日切換點'}
      },
      headName: ['select', 'timeSlicePointName', 'timeSlicePointTime'],
      shiftName: {'select': '選擇', 'shiftName': '班別', 'from': '起', 'day': '隔日', 'to': '迄'},
      // rows: {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: []},
      rows: {},
      columns: [],
      columnsObj: {
        'symbol': '代號',
        'definition': '定義'
      },
      rows1: [],
      columns1: [],
      config: {
        noHeader: false,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        responsive: false,
        pagination: {
          rowsPerPage: 20,
          options: [20, 50, 100, 200, 500]
        }
      },
      serverPagination: {
        rowsPerPage: 20
      },
      noteList: [],
      noteListArr: [],
      // myChart2: [],
      producePieColor: ['#00D8FF', '#DD1B16'],
      // myChart2: { labels: [], datasets: [] },
      myChart2Options:
      {
        responsive: true,
        maintainAspectRatio: false,
        animation:
        {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      },
      labels: ['a', 'b', 'c', 'd', 'e', '1'],
      // myChart2: {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: []},
      myChart2: {},
      myChart3: {
        labels: ['x', 'y', 'z', 'a', 'b'],
        datasets: [{
          label: '1',
          backgroundColor: 'red',
          data: [10, 20, 30, 40, 50]
        }, {
          label: '2',
          backgroundColor: 'blue',
          data: [20, 40, 60, 80, 100]
        }, {
          label: '3',
          backgroundColor: 'green',
          data: [30, 60, 90, 120, 150]
        }]
      },
      labelText: {},
      monthSplit: 0,
      yearSplit: 0,
      ymEnd: ''
    }
  },
  beforeCreate () {
  },
  created () {
  },
  watch: {
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
    yearMonth () {
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
    defectiveTableTimes: function () {
      this.updateRenderTable()
    },
    checked () {
      this.updateRenderTable()
    },
    department () {
      this.updateRenderTable()
    },
    defectiveGroup  () {
      this.updateRenderTable()
    }
  },
  mounted () {
    // 讀取組織資料
    this.$nextTick(() => {
      $.get('/api/getOrganizationStructure/', {}, (results) => {
        this.Level = results.data
        getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
        this.updateRenderTable()
      })
    })
  },
  sockets: {},
  methods: {
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
      var yM = []
      var i = 0
      var monthSplitStr = ''
      switch (this.period) {
        case 'weekly':
          this.type = '週'
          this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
          this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
          this.displayDate = (this.selectedYearWeekly - 1911) + '年 第' + this.selectedWeek + '週'
          // -------------------------------
          this.columnsObj = {}
          this.columnsObj['rowName'] = '期間'
          for (i = 0; i < this.defectiveTableTimes; i++) {
            this.monthSplit = moment(this.dateTo).subtract(i, 'week').week()
            this.yearSplit = moment(this.dateTo).subtract(i, 'week').year() - 1911
            monthSplitStr = paddingLeft(this.monthSplit.toString(), 2)
            this.ymEnd = this.yearSplit.toString() + monthSplitStr // 10708
            this.columnsObj[this.ymEnd] = this.yearSplit.toString() + '年' + monthSplitStr + '週'
          }
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
          yM = this.yearMonthTenDays.split('-')
          this.yearSplit = yM[0] - 1911
          this.monthSplit = yM[1]
          var tenDaysFg = 0
          if (this.selectedTenDays === 'early') {
            tenDaysFg = 0
          } else if (this.selectedTenDays === 'middle') {
            tenDaysFg = 1
          } else {
            tenDaysFg = 2
          }
          this.columnsObj = {}
          this.columnsObj['rowName'] = '期間'
          for (i = 0; i < this.defectiveTableTimes; i++) {
            if (tenDaysFg === 0) {
              monthSplitStr = '上旬'
            } else if (tenDaysFg === 1) {
              monthSplitStr = '中旬'
            } else {
              monthSplitStr = '下旬'
            }
            this.ymEnd = this.yearSplit.toString() + paddingLeft(this.monthSplit.toString(), 2) + tenDaysFg // 10708
            this.columnsObj[this.ymEnd] = this.yearSplit.toString() + '年' + paddingLeft(this.monthSplit.toString(), 2) + '月' + monthSplitStr
            if (tenDaysFg === 2) {
              tenDaysFg = 1
            } else if (tenDaysFg === 1) {
              tenDaysFg = 0
            } else {
              tenDaysFg = 2
              this.monthSplit--
              if (this.monthSplit < 1) {
                this.monthSplit += 12
                this.yearSplit--
              }
            }
          }
          break
        case 'monthly':
          this.type = '月'
          this.dateFrom = moment(this.yearMonth).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
          this.displayDate = (parseInt(moment(this.yearMonth).format('YYYY')) - 1911) + '年 ' + parseInt(moment(this.yearMonth).format('MM')) + '月'
          // ------------------
          yM = this.yearMonth.split('-')
          this.columnsObj = {}
          this.columnsObj['rowName'] = '期間'
          for (i = 0; i < this.defectiveTableTimes; i++) {
            this.yearSplit = yM[0] - 1911
            this.monthSplit = yM[1] - i
            if (this.monthSplit < 1) {
              this.monthSplit += 12
              this.yearSplit--
            }
            monthSplitStr = paddingLeft(this.monthSplit.toString(), 2)
            this.ymEnd = this.yearSplit.toString() + monthSplitStr // 10708
            this.columnsObj[this.ymEnd] = this.yearSplit.toString() + '年' + monthSplitStr + '月'
          }
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
          // ----------------------------
          this.yearSplit = this.selectedYearQuarter - 1911
          this.monthSplit = this.selectedQuarter
          this.columnsObj = {}
          this.columnsObj['rowName'] = '期間'
          for (i = 0; i < this.defectiveTableTimes; i++) {
            this.ymEnd = this.yearSplit.toString() + paddingLeft(this.monthSplit.toString(), 2) // 10708
            this.columnsObj[this.ymEnd] = this.yearSplit.toString() + '年第' + paddingLeft(this.monthSplit.toString(), 2) + '季'
            this.monthSplit--
            if (this.monthSplit < 1) {
              this.monthSplit = 4
              this.yearSplit--
            }
          }
          break
        case 'yearly':
          this.type = '年'
          this.dateFrom = moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearTo, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.selectedYear) - 1911) + '年 ~ ' + (parseInt(this.selectedYearTo) - 1911) + '年 '
          // ----------------------------
          this.yearSplit = this.selectedYear - 1911
          this.monthSplit = this.selectedYearTo - 1911
          this.columnsObj = {}
          this.columnsObj['rowName'] = '期間'
          for (i = 0; i < this.defectiveTableTimes; i++) {
            this.ymEnd = this.yearSplit.toString() + this.monthSplit.toString() // 10708
            this.columnsObj[this.ymEnd] = this.yearSplit.toString() + '年/' + this.monthSplit.toString() + '年'
            this.yearSplit -= (this.selectedYearTo - this.selectedYear + 1)
            this.monthSplit -= (this.selectedYearTo - this.selectedYear + 1)
          }
          break
        case 'period':
          this.type = '自訂期間'
          this.dateFrom = moment(this.selectedDatePeriod).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedDatePeriodTo).format('YYYY-MM-DD')
          this.displayDate = this.dateFrom + ' ~ ' + this.dateTo
          // ----------------------------
          this.yearSplit = this.dateFrom
          this.monthSplit = this.dateTo
          this.columnsObj = {}
          this.columnsObj['rowName'] = '期間'
          var diff = moment(this.dateTo).diff(moment(this.dateFrom)) / 3600 / 24 / 1000 + 1
          var strFrom = ''
          var strTo = ''
          for (i = 0; i < this.defectiveTableTimes; i++) {
            // console.log(this.yearMonthTenDays)
            this.ymEnd = i // 10708
            strFrom = (moment(this.dateFrom).subtract(diff * (this.defectiveTableTimes - i - 1), 'days').year() - 1911) + '年' + (moment(this.dateFrom).subtract(diff * (this.defectiveTableTimes - i - 1), 'days').month() + 1) + '月' + moment(this.dateFrom).subtract(diff * (this.defectiveTableTimes - i - 1), 'days').get('date') + '日'
            strTo = (moment(this.dateTo).subtract(diff * (this.defectiveTableTimes - i - 1), 'days').year() - 1911) + '年' + (moment(this.dateTo).subtract(diff * (this.defectiveTableTimes - i - 1), 'days').month() + 1) + '月' + moment(this.dateTo).subtract(diff * (this.defectiveTableTimes - i - 1), 'days').get('date') + '日'
            this.columnsObj[this.ymEnd] = strFrom + '/' + strTo
          }
          break
      }
      var from = moment(this.dateFrom).toDate()
      var to = moment(this.dateTo).toDate()
      // this.rows[0] = []
      // console.log('999999')
      // -----------月報------------------
      // ------------------------------
      renderTable([this.displayDepartment], this.Level, this.rows, from, to, this.myChart2, this.period, Vue.set, this.labelText, this.columnsObj, this.defectiveGroup, this.defectiveTableTimes, this.$q.loading, this.topName)
      var columnsObjKey = Object.keys(this.columnsObj)
      this.labels.splice(0, this.labels.length)
      this.labels.length = 0
      this.columns.splice(0, this.columns.length)
      this.columns.length = 0
      columnsObjKey.forEach(columnKey => {
        if (columnKey !== 'rowName') {
          this.labels.splice(this.labels.length, 0, this.columnsObj[columnKey])
        }
        this.columns.splice(this.columns.length, 0, {
          label: this.columnsObj[columnKey],
          field: columnKey,
          name: columnKey
        })
      })
      this.columns.sort(function (a, b) {
        return parseInt(a.field) > parseInt(b.field) ? 1 : -1
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
    sel () {

    },
    a () {
    }
  }
}
function paddingLeft (str, lenght) {
  if (str.length >= lenght) {
    return str
  } else {
    return paddingLeft('0' + str, lenght)
  }
}
function renderTable (target, Level, rows, reportRange, iReportDate, myChart2, period, fun, labelText, columnsObj, defectiveGroup, defectiveTableTimes, loading, topName) {
  var targetDetail = {} // 保存原始請求作為產生上級資料的參考
  var levelNum = 0
  target.forEach(tgt => {
    var t = Level.filter(elm => {
      return (elm._id === tgt)
    })
    levelNum = t[0].level
    if (t.length > 0) {
      targetDetail[tgt] = t[0]
    }
  })
  var index = -1
  var machineDetail = {} // 子陣列的參考，底下帶著有相關的機台編號
  if (levelNum > 0) {
    target.forEach(tgt => {
      // ------20190504 加列
      if (defectiveGroup) {
        Vue.set(labelText, ++index, tgt)
        Vue.set(myChart2, tgt, [])
        Vue.set(rows, tgt, [])
        rows[tgt].splice(rows[tgt].length, 0, {rowName: '不良率'})
        rows[tgt].splice(rows[tgt].length, 0, {rowName: '換模具換模仁次數'})
        rows[tgt].splice(rows[tgt].length, 0, {rowName: '生產模次'})
        // rows[tgt].splice(rows[tgt].length, 0, {rowName: '機台編號'})
        machineDetail[tgt] = recursiveFindMachineID(Level, tgt, -1)
        loopSearch(period, defectiveTableTimes, rows[tgt], myChart2[tgt], machineDetail[tgt], columnsObj, index, loading)
      }
      // -------------------
      targetDetail[tgt].son.forEach(son => {
        // 若 target === 全廠
        // targetDetail[全廠] === ['成型一課', '成型二課']
        // machineDetail = {成型一課: 所有轄下level1的機台, 成型二課: 所有轄下level1的機台}
        // console.log(son)
        // index++
        machineDetail[son] = recursiveFindMachineID(Level, son, -1)
        // labelText[index] = []
        Vue.set(labelText, ++index, son)
        // labelText[index].splice(0, 0, son) 20190504
        // myChart2[index] = []
        // Vue.set(myChart2, index, [])
        Vue.set(myChart2, son, [])
        /* for (idx = 0; idx < defectiveTableTimes; idx++) {
          myChart2[son].splice(idx, 0, 0)
        } */
        // myChart2[index].splice(myChart2[index].length, 0, [])
        // rows[index] = []
        Vue.set(rows, son, [])
        rows[son].splice(rows[son].length, 0, {rowName: '不良率'})
        rows[son].splice(rows[son].length, 0, {rowName: '換模具換模仁次數'})
        rows[son].splice(rows[son].length, 0, {rowName: '生產模次'})
        // rows[son].splice(rows[son].length, 0, {rowName: '機台編號'})
        loopSearch(period, defectiveTableTimes, rows[son], myChart2[son], machineDetail[son], columnsObj, index, loading)
        /* switch (period) {
          case 'weekly':
            var yearWeek = parseInt(keyTxt[0].slice(0, 3)) + 1911
            var week = parseInt(keyTxt[0].slice(3))
            for (idx = 0; idx < defectiveTableTimes; idx++) {
              from = moment((yearWeek + '-' + week), 'YYYY-w').add(idx, 'week').format('YYYY-MM-DD')
              to = moment((yearWeek + '-' + week), 'YYYY-w').add(idx, 'week').weekday(6).format('YYYY-MM-DD')
              constructTable(rows[son], myChart2[son], machineDetail[son], from, to, keyTxt[idx], fun, idx, index, loading)
            }
            break
          case 'tenDays':
            var yearTenDays = parseInt(keyTxt[0].slice(0, 3)) + 1911
            var monthTenDays = parseInt(keyTxt[0].slice(3, 5))
            var tenDaysFg = parseInt(keyTxt[0].slice(5))
            for (idx = 0; idx < defectiveTableTimes; idx++) {
              var section = tenDaysFg + idx
              var tenDaysFgFinal = section % 3
              var monthTenDaysFinal = (parseInt(section / 3) + monthTenDays) % 12
              var yearTenDaysFinal = parseInt((parseInt(section / 3) + monthTenDays) / 12) + yearTenDays
              if (tenDaysFgFinal === 0) {
                from = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(1).format('YYYY-MM-DD')
                to = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(10).format('YYYY-MM-DD')
              } else if (tenDaysFgFinal === 1) {
                from = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(11).format('YYYY-MM-DD')
                to = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(20).format('YYYY-MM-DD')
              } else {
                from = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(21).format('YYYY-MM-DD')
                to = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').add(1, 'month').date(0).format('YYYY-MM-DD')
              }
              constructTable(rows[son], myChart2[son], machineDetail[son], from, to, keyTxt[idx], fun, idx, index, loading)
            }
            break
          case 'monthly':
            var yearMonth = parseInt(keyTxt[0].slice(0, 3)) + 1911
            var month = parseInt(keyTxt[0].slice(3))
            for (idx = 0; idx < defectiveTableTimes; idx++) {
              from = moment((yearMonth + '-' + month), 'YYYY-M').add(idx, 'month').date(1).format('YYYY-MM-DD')
              to = moment((yearMonth + '-' + month), 'YYYY-M').add(idx + 1, 'month').date(0).format('YYYY-MM-DD')
              constructTable(rows[son], myChart2[son], machineDetail[son], from, to, keyTxt[idx], fun, idx, index, loading)
            }
            break
          case 'quarterly':
            var yearQuarter = parseInt(keyTxt[0].slice(0, 3)) + 1911
            var quarter = parseInt(keyTxt[0].slice(3))
            for (idx = 0; idx < defectiveTableTimes; idx++) {
              from = moment((yearQuarter + '-' + quarter), 'YYYY-Q').add(idx, 'quarter').date(1).format('YYYY-MM-DD')
              to = moment((yearQuarter + '-' + quarter), 'YYYY-Q').add(idx + 1, 'quarter').date(0).format('YYYY-MM-DD')
              constructTable(rows[son], myChart2[son], machineDetail[son], from, to, keyTxt[idx], fun, idx, index, loading)
            }
            break
          case 'yearly':
            var yearFrom = parseInt(keyTxt[0].slice(0, 3)) + 1911
            var yearTo = parseInt(keyTxt[0].slice(3)) + 1911
            for (idx = 0; idx < defectiveTableTimes; idx++) {
              from = moment((yearFrom), 'YYYY').add(idx, 'year').date(1).format('YYYY-MM-DD')
              to = moment((yearTo), 'YYYY').add(idx + 1, 'year').date(0).format('YYYY-MM-DD')
              constructTable(rows[son], myChart2[son], machineDetail[son], from, to, keyTxt[idx], fun, idx, index, loading)
            }
            break
          case 'period':
            var dtStr = columnsObj[0].split('/')
            var dateFrom = (parseInt((dtStr[0].split('年'))[0]) + 1911) + '-' + ((dtStr[0].split('年'))[1].split('月'))[0] + '-' + (((dtStr[0].split('年'))[1].split('月'))[1].split('日'))[0]
            var dateTo = (parseInt((dtStr[1].split('年'))[0]) + 1911) + '-' + ((dtStr[1].split('年'))[1].split('月'))[0] + '-' + (((dtStr[1].split('年'))[1].split('月'))[1].split('日'))[0]
            var diff = moment(dateTo, 'YYYY-M-DD').diff(moment(dateFrom, 'YYYY-M-DD')) / 3600 / 24 / 1000 + 1
            for (idx = 0; idx < defectiveTableTimes; idx++) {
              from = moment(dateFrom, 'YYYY-M-DD').add(diff * idx, 'days').format('YYYY-MM-DD')
              to = moment(dateTo, 'YYYY-M-DD').add(diff * idx, 'days').format('YYYY-MM-DD')
              constructTable(rows[son], myChart2[son], machineDetail[son], from, to, keyTxt[idx], fun, idx, index, loading)
            }
            break
        } */
      })
    })
  }
}
function loopSearch (period, defectiveTableTimes, rows, myChart2, machineDetail, columnsObj, index, loading) {
  var keyTxt = Object.keys(columnsObj)
  var from
  var to
  var idx = 0
  switch (period) {
    case 'weekly':
      var yearWeek = parseInt(keyTxt[0].slice(0, 3)) + 1911
      var week = parseInt(keyTxt[0].slice(3))
      for (idx = 0; idx < defectiveTableTimes; idx++) {
        from = moment((yearWeek + '-' + week), 'YYYY-w').add(idx, 'week').format('YYYY-MM-DD')
        to = moment((yearWeek + '-' + week), 'YYYY-w').add(idx, 'week').weekday(6).format('YYYY-MM-DD')
        constructTable(rows, myChart2, machineDetail, from, to, keyTxt[idx], Vue.set, idx, index, loading)
      }
      break
    case 'tenDays':
      var yearTenDays = parseInt(keyTxt[0].slice(0, 3)) + 1911
      var monthTenDays = parseInt(keyTxt[0].slice(3, 5))
      var tenDaysFg = parseInt(keyTxt[0].slice(5))
      for (idx = 0; idx < defectiveTableTimes; idx++) {
        var section = tenDaysFg + idx
        var tenDaysFgFinal = section % 3
        var monthTenDaysFinal = (parseInt(section / 3) + monthTenDays) % 12
        var yearTenDaysFinal = parseInt((parseInt(section / 3) + monthTenDays) / 12) + yearTenDays
        if (tenDaysFgFinal === 0) {
          from = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(1).format('YYYY-MM-DD')
          to = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(10).format('YYYY-MM-DD')
        } else if (tenDaysFgFinal === 1) {
          from = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(11).format('YYYY-MM-DD')
          to = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(20).format('YYYY-MM-DD')
        } else {
          from = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').date(21).format('YYYY-MM-DD')
          to = moment((yearTenDaysFinal + '-' + monthTenDaysFinal), 'YYYY-M').add(1, 'month').date(0).format('YYYY-MM-DD')
        }
        constructTable(rows, myChart2, machineDetail, from, to, keyTxt[idx], Vue.set, idx, index, loading)
      }
      break
    case 'monthly':
      var yearMonth = parseInt(keyTxt[0].slice(0, 3)) + 1911
      var month = parseInt(keyTxt[0].slice(3))
      for (idx = 0; idx < defectiveTableTimes; idx++) {
        from = moment((yearMonth + '-' + month), 'YYYY-M').add(idx, 'month').date(1).format('YYYY-MM-DD')
        to = moment((yearMonth + '-' + month), 'YYYY-M').add(idx + 1, 'month').date(0).format('YYYY-MM-DD')
        constructTable(rows, myChart2, machineDetail, from, to, keyTxt[idx], Vue.set, idx, index, loading)
      }
      break
    case 'quarterly':
      var yearQuarter = parseInt(keyTxt[0].slice(0, 3)) + 1911
      var quarter = parseInt(keyTxt[0].slice(3))
      for (idx = 0; idx < defectiveTableTimes; idx++) {
        from = moment((yearQuarter + '-' + quarter), 'YYYY-Q').add(idx, 'quarter').date(1).format('YYYY-MM-DD')
        to = moment((yearQuarter + '-' + quarter), 'YYYY-Q').add(idx + 1, 'quarter').date(0).format('YYYY-MM-DD')
        constructTable(rows, myChart2, machineDetail, from, to, keyTxt[idx], Vue.set, idx, index, loading)
      }
      break
    case 'yearly':
      var yearFrom = parseInt(keyTxt[0].slice(0, 3)) + 1911
      var yearTo = parseInt(keyTxt[0].slice(3)) + 1911
      for (idx = 0; idx < defectiveTableTimes; idx++) {
        from = moment((yearFrom), 'YYYY').add(idx, 'year').date(1).format('YYYY-MM-DD')
        to = moment((yearTo), 'YYYY').add(idx + 1, 'year').date(0).format('YYYY-MM-DD')
        constructTable(rows, myChart2, machineDetail, from, to, keyTxt[idx], Vue.set, idx, index, loading)
      }
      break
    case 'period':
      var dtStr = columnsObj[0].split('/')
      var dateFrom = (parseInt((dtStr[0].split('年'))[0]) + 1911) + '-' + ((dtStr[0].split('年'))[1].split('月'))[0] + '-' + (((dtStr[0].split('年'))[1].split('月'))[1].split('日'))[0]
      var dateTo = (parseInt((dtStr[1].split('年'))[0]) + 1911) + '-' + ((dtStr[1].split('年'))[1].split('月'))[0] + '-' + (((dtStr[1].split('年'))[1].split('月'))[1].split('日'))[0]
      var diff = moment(dateTo, 'YYYY-M-DD').diff(moment(dateFrom, 'YYYY-M-DD')) / 3600 / 24 / 1000 + 1
      for (idx = 0; idx < defectiveTableTimes; idx++) {
        from = moment(dateFrom, 'YYYY-M-DD').add(diff * idx, 'days').format('YYYY-MM-DD')
        to = moment(dateTo, 'YYYY-M-DD').add(diff * idx, 'days').format('YYYY-MM-DD')
        constructTable(rows, myChart2, machineDetail, from, to, keyTxt[idx], Vue.set, idx, index, loading)
      }
      break
  }
}
function constructTable (rows, myChart2, machineIDArr, from, to, ind, fun, idx, index, loading) {
  // var machineIDArr = machineDetail[son]
  $.get('/api/getDefectiveTable/' + machineIDArr + '/' + from + '/' + to + '/' + ind + '/' + index, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      loading.hide()
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
      loading.hide()
    } else {
      var records = results.data // 回傳微陣列
      var totalMoldCount = records.reduce((acc, record) => {
        return acc + parseInt(record.totalMoldCount)
      }, 0)
      var totalWarehousing = records.reduce((acc, record) => {
        return acc + parseInt(record.totalWarehousing)
      }, 0)
      var totalTargetCount = records.reduce((acc, record) => {
        return acc + parseInt(record.totalTargetCount || 0)
      }, 0)
      var totalChangeMold = records.reduce((acc, record) => {
        return acc + parseInt(record.totalChangeMold)
      }, 0)
      var badRate = 0
      if (totalTargetCount !== 0) {
        badRate = Math.round((totalTargetCount - totalWarehousing) / totalTargetCount * 1000) / 10
      }
      Vue.set(rows[0], ind, badRate)
      Vue.set(rows[1], ind, totalChangeMold)
      Vue.set(rows[2], ind, totalMoldCount)
      // Vue.set(rows[3], ind, records[0].machineID)
      var rowsVal = Object.values(rows[0]).filter(val => {
        return val !== '不良率'
      })
      myChart2.splice(0, myChart2.length)
      rowsVal.forEach(elm => {
        myChart2.splice(myChart2.length, 0, elm)
      })
      loading.hide()
    }
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
     font-size:180%;
     font-weight:600;
    }
  h5{
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:300;
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
  .q-btn{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
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
.small {
    max-width: 600px;
    margin:  150px auto;
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
