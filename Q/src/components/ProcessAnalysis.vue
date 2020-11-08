<template>
  <div class="layout-padding">
  <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>{{(this.reportType === 'productAnalysis') ? '成品料號' : '模具編號'}}製程分析</h4>
    </div>
</div>
      <div class="row justify-center q-pt-xs q-pb-xs text-white bg-light-blue-8 full-width ">
      <q-btn outline glossy label='排序' icon="icon-svg52" @click="sortFalling = !sortFalling, sortEvent()"/>
      <q-btn-dropdown outline glossy label="顯示欄位" icon="icon-svg53">
  <!-- dropdown content -->
        <q-list link>
          <div v-for="(col, index) in columns" v-bind:key="index">
          <q-item v-if="combine===false" >
            <q-item-main>
              <q-checkbox v-model="columns[index]['required']" :label="columns[index]['label']" :value="col"/>
            </q-item-main>
          </q-item>
          <q-item v-else-if="combine===true && columns[index].name !== 'startTime' && columns[index].name !== 'endTime'" >
            <q-item-main>
              <q-checkbox v-model="columns[index]['required']" :label="columns[index]['label']" :value="col"/>
            </q-item-main>
          </q-item>
          </div>
        </q-list>
      </q-btn-dropdown>
      <q-btn outline glossy label='色彩設定' icon="icon-svg54" @click="colorEn = !colorEn"/>
      <q-btn outline glossy v-if="!$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rows, columns, reportTypeStr + type + '製程分析')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
    <div class="row justify-center bg-white full-width no-margin">
          <div class="row inline">
      <div class="col-auto q-pr-xl q-mr-xl">
      <h1>{{reportTypeStr}} {{type}}製程分析</h1>
      <h1 v-if="status !== null">({{status}})</h1>
      </div>
      <div class="col-auto self-center q-pl-xl q-ml-xl">
      <!--<q-checkbox v-model="detail" :val="true" label="明細" @input="combine=!detail, visiColumns.splice(0, 0, 'startTime'), visiColumns.splice(0, 0, 'endTime')"/>-->
      <q-checkbox v-model="detail" :val="true" label="明細" @input="combine=!detail, remove(combine)"/>
      </div>
      <div class="col-auto self-center q-pl-md">
      <!--<q-checkbox v-model="combine" :val="false" label="合計" @input="detail=!combine, remove(visiColumns, 'startTime'), remove(visiColumns, 'endTime')"/>-->
      <q-checkbox v-model="combine" :val="false" label="合計" @input="detail=!combine, remove(combine)"/>
      </div>
      </div>
    <div class="row justify-around q-ma-md full-width">
    <div class="col-auto q-ml-xs q-mt-sm">
      <span>{{displayDate}}
{{displayDepartment}} - {{displayZone}}
    {{dateFrom}} ~ {{dateTo}}
    </span>
    </div>
    <div class="column inline justify-top q-pl-md">
    <div class="col-auto q-ml-xl q-pl-xl">
      <span>期間日數{{totalDays}}日*{{hoursADay}}小時={{totalHours}}小時</span>
    </div>
     <div class="col-auto q-ml-xl q-pl-xl">
      <span>生產工作日數{{totalWorkDays[0]}}天*{{hoursADay}}小時={{totalWorkHours[0]}}小時</span>
    </div>
    </div>
    </div>
    <!--<div v-if="reportType !== 'productAnalysis'">
      穴數 * {{rows[0].cavities}}
    </div>-->
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
  <div class="col q-mt-sm q-mb-xs bg-grey-3">
        <q-item>
        <q-table
        :data="rows"
        :columns="columns"
        :visible-columns="visiColumns0"
        :rows-per-page-options="config.pagination.options"
        :pagination.sync="serverPagination"
        separator="cell"
        :dense="true"
        row-key="name"
        color="amber"
      >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td v-for="column in columns" v-bind:key="column.name" v-if="column.required === true && (props.row.detail !== true && combine === true || detail)">
          <div v-if="column.name === 'totalAlm'">
            <div v-if="colorEn && props.row[column.name] > colorConditionArr[0][0]" :style="colorArr[0]">
              <span v-if="blink[0]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else>
              {{props.row[column.name]}}
            </div>
          </div>
          <div v-else-if="column.name === 'performance'">
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
          <div v-else-if="column.name === 'average'">
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
          <div v-else-if="column.name === 'badRate'">
            <div v-if="colorEn && (props.row['badRateVal'] * 1) >= colorConditionArr[5][0]" :style="colorArr[5]">
              <span v-if="blink[5]" class="blink">{{props.row[column.name]}}</span>
              <span v-else>{{props.row[column.name]}}</span>
            </div>
            <div v-else>
              {{props.row[column.name]}}
            </div>
          </div>
          <div v-else>
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
    'reportType',
    'Sel'
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
      spinLock: [false],
      // ------------------------------
      type: '明細',
      detail: true,
      combine: false,
      status: null,
      totalDays: 30,
      hoursADay: 24,
      totalHours: 720,
      totalWorkDays: [0],
      totalWorkHours: [0],
      reportTypeStr: '',
      dateFrom: '',
      dateTo: '',
      displayDate: '',
      departmentID: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
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
      visiColumns: [],
      visiColumns0: [],
      columns: [],
      rows: [],
      productColumnHeader: {
        // 'moldNumLabel': 'moldNumLabel',
        // 'machineLabel': 'machineLabel',
        '模具編號': 'moldNum',
        '機台': 'machineID',
        '警報': 'totalAlm',
        '穴數': 'cavities',
        '量產開始': 'startTime',
        '量產結束': 'endTime',
        '自動生產時間累計': 'duration',
        '生產模數': 'moldCount',
        '應產數量': 'targetCount',
        '入庫數量': 'warehousing',
        '不良數量': 'badNum',
        '不良率%': 'badRate',
        '標準週期S': 'standard',
        '最短週期S': 'min',
        '平均週期S': 'average',
        '週期效率％': 'performance'
      },
      moldNumColumnHeader: {
        // 'productLabel': 'productLabel',
        // 'machineLabel': 'machineLabel',
        '機台': 'machineID',
        '警報': 'totalAlm',
        '成品料號': 'product',
        '量產開始': 'startTime',
        '量產結束': 'endTime',
        '自動生產時間累計': 'duration',
        '生產模數': 'moldCount',
        '應產數量': 'targetCount',
        '入庫數量': 'warehousing',
        '不良數量': 'badNum',
        '不良率%': 'badRate',
        '標準週期S': 'standard',
        '最短週期S': 'min',
        '平均週期S': 'average',
        '週期效率％': 'performance'
      },
      serverPagination: {
        rowsPerPage: 20
      }
    }
  },
  watch: {
    calendar: function () {
      this.selectedWorkDay()
    },
    colorConditionArr: function () {
      this.hoursADay = this.colorConditionArr[9][0]
      this.selectedWorkDay()
    },
    sortList: function () {
      this.sortLabel0 = this.sortList[1].label
      this.sortLabel1 = this.sortList[2].label
      this.sortLabel2 = this.sortList[0].label
      this.sort0 = this.sortList[1].value
      this.sort1 = this.sortList[2].value
      this.sort2 = this.sortList[0].value
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
    reportType: function () {
      this.constructTable()
    },
    Sel: function () {
      this.constructTable()
    },
    checked () {
      this.constructTable()
    },
    department () {
      this.constructTable()
    }
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
    constructTable: function () {
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
      if (this.spinLock[0]) {
        return
      } else {
        this.spinLock[0] = true
      }
      if (this.reportType === 'productAnalysis') {
        this.reportTypeStr = '成品料號  ' + this.Sel
        this.sortHead = 'moldNumLabel'
      } else {
        this.reportTypeStr = '模具編號  ' + this.Sel
        this.sortHead = 'productLabel'
      }
      reportTypeFunc(this.reportType, this.columns, this.productColumnHeader, this.moldNumColumnHeader, this.visiColumns, this.sortList)
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
      renderTable(this.Sel, this.reportType, this.columns, this.rows, this.machineIDArr, from, to, this.spinLock, this.$q.loading)
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
    indexOf (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) return i
        // console.log(arr[i])
      }
      return -1
    },
    remove (isShow) {
      if (isShow) {
        var col = ['startTime', 'endTime']
        this.columns.forEach(column => {
          if (column.name === col[0] || column.name === col[1]) {
            Vue.set(column, 'required', false)
          }
        })
      } else {
        this.columns.forEach(column => {
          Vue.set(column, 'required', true)
        })
      }
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
      if (this.sortHead === 'moldNumLabel') {
        this.rows.sort(function (a, b) {
          if (a['moldNumLabel'] < b['moldNumLabel']) {
            return -1
          } else if (a['moldNumLabel'] > b['moldNumLabel']) {
            return 1
          } else {
            if (arr[0].asc) {
              return recursiveSortAscending(arr, 0, a, b)
            } else {
              return recursiveSortDescending(arr, 0, a, b)
            }
          }
        })
      } else {
        this.rows.sort(function (a, b) {
          if (a['productLabel'] < b['productLabel']) {
            return -1
          } else if (a['productLabel'] > b['productLabel']) {
            return 1
          } else {
            if (arr[0].asc) {
              return recursiveSortAscending(arr, 0, a, b)
            } else {
              return recursiveSortDescending(arr, 0, a, b)
            }
          }
        })
      }
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

function renderTable (Sel, reportType, columns, rows, machineIDs, from, to, spinLock, loading) {
  if (reportType === 'productAnalysis') {
    renderTableProductAnalysis(Sel, columns, rows, machineIDs, from, to, spinLock, loading)
  } else {
    renderTableMoldAnalysis(Sel, columns, rows, machineIDs, from, to, spinLock, loading)
  }
  loading.hide()
}
function renderTableProductAnalysis (Sel, columns, rows, machineIDs, from, to, spinLock, loading) {
  rows.splice(0, rows.length)
  // var machineIDs = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
  var product = Sel
  var records
  $.get('/api/getProductProcessAnalysis/' + machineIDs + '/' + product + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      loading.hide()
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
      loading.hide()
    } else {
      records = results.data
      records.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : (a.machineID < b.machineID ? -1 : (a.startTime > b.startTime ? 1 : -1))
      })
      var recordsKeys = {}
      records.forEach(record => {
        if (!recordsKeys.hasOwnProperty(record.moldNum)) {
          recordsKeys[record.moldNum] = record.moldNum
        }
      })
      var recordsKeysValues = Object.values(recordsKeys)
      recordsKeysValues.forEach(recordsKeysValue => {
        var recordsFilter = records.filter(record => {
          return record['moldNum'] === recordsKeysValue
        })
        var objTotalT = {}
        objTotalT['min'] = 1000
        machineIDs.forEach(machineID => {
          var recordsFilter2 = recordsFilter.filter(record => {
            if (record['machineID'] === machineID) {
              // console.log(machineID)
            }
            return record['machineID'] === machineID
          })
          if (recordsFilter2.length > 0) {
            var objTotal = {}
            columns.forEach(column => {
              objTotal[column] = 0
            })
            objTotal['min'] = 1000
            for (var record in recordsFilter2) {
              var Obj = {}
              columns.forEach(column => {
                if (column.field === 'duration') {
                  objTotal[column.field] = (recordsFilter2[record])[column.field] + (objTotal[column.field] || 0)
                  objTotalT[column.field] = (recordsFilter2[record])[column.field] + (objTotalT[column.field] || 0)
                } else if (column.field === 'moldCount') {
                  objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
                  objTotalT[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotalT[column.field] || 0)
                } else if (column.field === 'totalAlm') {
                  objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
                  objTotalT[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotalT[column.field] || 0)
                } else if (column.field === 'targetCount') {
                  objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
                  objTotalT[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotalT[column.field] || 0)
                } else if (column.field === 'warehousing') {
                  objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
                  objTotalT[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotalT[column.field] || 0)
                } else if (column.field === 'badNum') {
                  objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
                  objTotalT[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotalT[column.field] || 0)
                } else if (column.field === 'standard') {
                  objTotal[column.field] = (recordsFilter2[record])[column.field]
                  objTotalT[column.field] = (recordsFilter2[record])[column.field]
                } else if (column.field === 'cavities') {
                  objTotal[column.field] = (recordsFilter2[record])[column.field]
                  objTotalT[column.field] = (recordsFilter2[record])[column.field]
                } else if (column.field === 'min') {
                  if (objTotal[column.field] > (recordsFilter2[record])[column.field]) {
                    objTotal[column.field] = (recordsFilter2[record])[column.field]
                  }
                  if (objTotalT[column.field] > (recordsFilter2[record])[column.field]) {
                    objTotalT[column.field] = (recordsFilter2[record])[column.field]
                  }
                }
                if (column.field === 'startTime') {
                  Obj[column.field] = moment((recordsFilter2[record])[column.field]).format('M/DD HH:mm:ss')
                  Obj['trigTimeFullType'] = moment((recordsFilter2[record])[column.field]).format('YYYY/MM/DD HH:mm:ss')
                } else if (column.field === 'endTime') {
                  Obj[column.field] = moment((recordsFilter2[record])[column.field]).format('M/DD HH:mm:ss')
                  Obj['lastTrigTimeFullType'] = moment((recordsFilter2[record])[column.field]).format('YYYY/MM/DD HH:mm:ss')
                } else if (column.field === 'duration') {
                  Obj[column.field] = formatSecond((recordsFilter2[record])[column.field] / 1000)// new Date((recordsFilter2[record])[column.field] * 1000).toISOString().substr(11, 8)
                } else if (column.field === 'min') {
                  Obj[column.field] = (Math.round((recordsFilter2[record])[column.field] * 10) / 10)
                } else if (column.field === 'average') {
                  Obj[column.field] = Math.round((recordsFilter2[record])[column.field] / 100) / 10
                } else if (column.field === 'performance') {
                  Obj[column.field] = Math.round((recordsFilter2[record])[column.field] * 1000) / 10
                } else if (column.field === 'badRate') {
                  Obj[column.field] = Math.round((recordsFilter2[record])[column.field] * 1000) / 10
                  Obj['badRateVal'] = Math.round((recordsFilter2[record])[column.field] * 1000) / 10
                } else {
                  Obj[column.field] = (recordsFilter2[record])[column.field]
                }
              })
              Obj['detail'] = true
              Obj['machineLabel'] = machineID
              Obj['moldNumLabel'] = recordsKeysValue
              rows.splice(rows.length, 0, Obj)
            }
            objTotal['average'] = Math.round(objTotal['duration'] / objTotal['moldCount'] / 100) / 10
            objTotal['duration'] = formatSecond(objTotal['duration'] / 1000)
            objTotal['min'] = (Math.round(objTotal['min'] * 10) / 10)
            if ((objTotal['warehousing'] || 0) > 0) {
              objTotal['badRate'] = Math.round(objTotal['badNum'] / objTotal['targetCount'] * 1000) / 10
              objTotal['badRateVal'] = Math.round(objTotal['badNum'] / objTotal['targetCount'] * 1000) / 10
            } else {
              objTotal['badRate'] = 100
              objTotal['badRateVal'] = 100
            }
            objTotal['performance'] = Math.round(objTotal['standard'] / objTotal['average'] * 1000) / 10
            objTotal['machineID'] = '小計'
            objTotal['machineLabel'] = machineID
            objTotal['detail'] = false
            objTotal['moldNumLabel'] = recordsKeysValue
            rows.splice(rows.length, 0, objTotal)
          }
        })
        objTotalT['average'] = Math.round(objTotalT['duration'] / objTotalT['moldCount'] / 100) / 10
        objTotalT['duration'] = formatSecond(objTotalT['duration'] / 1000)
        objTotalT['min'] = (Math.round(objTotalT['min'] * 10) / 10)
        if ((objTotalT['warehousing'] || 0) > 0) {
          objTotalT['badRate'] = Math.round(objTotalT['badNum'] / objTotalT['targetCount'] * 1000) / 10
          objTotalT['badRateVal'] = Math.round(objTotalT['badNum'] / objTotalT['targetCount'] * 1000) / 10
        } else {
          objTotalT['badRate'] = 100
          objTotalT['badRateVal'] = 100
        }
        objTotalT['performance'] = Math.round(objTotalT['standard'] / objTotalT['average'] * 1000) / 10
        objTotalT['machineID'] = '合計'
        objTotalT['machineLabel'] = 'total'
        objTotalT['detail'] = false
        objTotalT['moldNumLabel'] = recordsKeysValue
        rows.splice(rows.length, 0, objTotalT)
      })
      Vue.set(spinLock, 0, false)
      loading.hide()
    }
  })
}
function renderTableMoldAnalysis (Sel, columns, rows, machineIDs, from, to, spinLock, loading) {
  rows.splice(0, rows.length)
  // var machineIDs = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
  var moldNum = Sel
  var records
  $.get('/api/getMoldProcessAnalysis/' + machineIDs + '/' + moldNum + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      loading.hide()
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
      loading.hide()
    } else {
      records = results.data
      console.log('results.data')
      console.log(results.data)
      records.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : (a.machineID < b.machineID ? -1 : (a.startTime > b.startTime ? 1 : -1))
      })
      machineIDs.forEach(machineID => {
        var recordsFilter2 = records.filter(record => {
          if (record['machineID'] === machineID) {
            // console.log(machineID)
          }
          return record['machineID'] === machineID
        })
        if (recordsFilter2.length > 0) {
          // console.log(recordsFilter2)
          var objTotal = {}
          columns.forEach(column => {
            objTotal[column] = 0
          })
          objTotal['min'] = 1000
          for (var record in recordsFilter2) {
            // console.log(record)
            var Obj = {}
            columns.forEach(column => {
              if (column.field === 'duration') {
                objTotal[column.field] = (recordsFilter2[record])[column.field] + (objTotal[column.field] || 0)
              } else if (column.field === 'moldCount') {
                objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
              } else if (column.field === 'totalAlm') {
                // console.log('totalAlm')
                // console.log(objTotal[column.field])
                objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
                // console.log((recordsFilter2[record])[column.field])
                // console.log(objTotal[column.field])
              } else if (column.field === 'targetCount') {
                objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
              } else if (column.field === 'warehousing') {
                objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
              } else if (column.field === 'badNum') {
                objTotal[column.field] = parseInt((recordsFilter2[record])[column.field]) + (objTotal[column.field] || 0)
              } else if (column.field === 'standard') {
                objTotal[column.field] = (recordsFilter2[record])[column.field]
              } else if (column.field === 'min') {
                if (objTotal[column.field] > (recordsFilter2[record])[column.field]) {
                  objTotal[column.field] = (recordsFilter2[record])[column.field]
                }
              }
              if (column.field === 'startTime') {
                Obj[column.field] = moment((recordsFilter2[record])[column.field]).format('M/DD HH:mm:ss')
                Obj['trigTimeFullType'] = moment((recordsFilter2[record])[column.field]).format('YYYY/MM/DD HH:mm:ss')
              } else if (column.field === 'endTime') {
                Obj[column.field] = moment((recordsFilter2[record])[column.field]).format('M/DD HH:mm:ss')
                Obj['lastTrigTimeFullType'] = moment((recordsFilter2[record])[column.field]).format('YYYY/MM/DD HH:mm:ss')
              } else if (column.field === 'duration') {
                Obj[column.field] = formatSecond((recordsFilter2[record])[column.field] / 1000)
              } else if (column.field === 'min') {
                Obj[column.field] = (Math.round((recordsFilter2[record])[column.field] * 10) / 10)
              } else if (column.field === 'average') {
                Obj[column.field] = Math.round((recordsFilter2[record])[column.field] / 100) / 10
              } else if (column.field === 'performance') {
                Obj[column.field] = Math.round((recordsFilter2[record])[column.field] * 1000) / 10
              } else if (column.field === 'badRate') {
                Obj[column.field] = Math.round((recordsFilter2[record])[column.field] * 1000) / 10
                // Obj['badRateVal'] = ((recordsFilter2[record])['badRate'] * 100).toFixed(2)
                Obj['badRateVal'] = Math.round((recordsFilter2[record])[column.field] * 1000) / 10
              } else {
                Obj[column.field] = (recordsFilter2[record])[column.field]
              }
            })
            Obj['detail'] = true
            Obj['machineLabel'] = machineID
            rows.splice(rows.length, 0, Obj)
          }
          objTotal['average'] = Math.round(objTotal['duration'] / objTotal['moldCount'] / 100) / 10
          objTotal['duration'] = formatSecond(objTotal['duration'] / 1000)
          objTotal['min'] = (Math.round(objTotal['min'] * 10) / 10)
          if ((objTotal['warehousing'] || 0) > 0) {
            objTotal['badRate'] = Math.round(objTotal['badNum'] / objTotal['targetCount'] * 1000) / 10
            objTotal['badRateVal'] = Math.round(objTotal['badNum'] / objTotal['targetCount'] * 1000) / 10
          } else {
            objTotal['badRate'] = 100
            objTotal['badRateVal'] = 100
          }
          objTotal['performance'] = Math.round(objTotal['standard'] / objTotal['average'] * 1000) / 10
          objTotal['machineID'] = '合計'
          objTotal['machineLabel'] = machineID
          objTotal['detail'] = false
          rows.splice(rows.length, 0, objTotal)
        }
      })
      Vue.set(spinLock, 0, false)
      loading.hide()
    }
  })
}
function reportTypeFunc (reportType, columns, productColumnHeader, moldNumColumnHeader, visiColumns, sortList) {
  var columnName = {}
  if (reportType === 'productAnalysis') {
    columnName = productColumnHeader
  } else {
    columnName = moldNumColumnHeader
  }
  columns.splice(0, columns.length)
  columns.length = 0
  visiColumns.splice(0, visiColumns.length)
  visiColumns.length = 0
  var key = Object.keys(columnName)
  key.forEach(elm => {
    var obj = {}
    obj['label'] = elm
    obj['field'] = columnName[elm]
    obj['name'] = columnName[elm]
    obj['required'] = true
    columns.splice(columns.length, 0, obj)
    visiColumns.splice(visiColumns.length, 0, columnName[elm])
    // console.log(obj)
  })
  // ---------------------
  sortList.splice(0, sortList.length)
  sortList.splice(sortList.length, 0, {
    label: ' ',
    value: ''
  })
  columns.forEach(column => {
    sortList.splice(sortList.length, 0, {
      label: column.label,
      value: column.name
    })
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
  $.get('/api/getWorkDays/' + machineID + '/' + from + '/' + to, {}, (results) => {
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
  })
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
