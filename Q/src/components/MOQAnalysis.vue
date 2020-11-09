<template>
  <div class="layout-padding">
  <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>{{type}}派單MOQ與入庫數量差異值分析表</h4>
        <h4 v-if="status !== null">({{status}})</h4>
      </div>
    </div>
    <!-- 工具列 -->
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
      <q-btn outline glossy v-if="!$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rows, columns, '派單MOQ與入庫數量差異值分析表')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
 <div class="column bg-white full-width no-margin">
    <!-- xxx年 xx月   全廠      yyyy-mm-dd ~ yyyy-mm-dd -->
    <div class="row inline justify-center" >
      <h1>{{displayDate}}&nbsp;&nbsp;
    {{displayDepartment}}&nbsp;&nbsp;
    {{displayZone}}&nbsp;&nbsp;
    {{dateFrom}} ~ {{dateTo}}
    </h1>
    </div>
    <!-- 搜尋欄 -->
    <div class="row justify-around q-pt-xs q-pb-xs">
    <div class="col-auto q-ml-sm q-mt-md">
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
    <!-- date interval -->
    <div class="row inline self-end q-mr-xl">
      <q-datetime v-model="selectedDate" class="no-margin" type="date" modal stack-label=" " @change="ttt(selectedDate)"/>
      <q-datetime v-model="selectedDateE" class="no-margin" type="date" modal stack-label=" " @change="ttt1(selectedDateE)"/>
      <!--<q-select color="white" v-model="departmentSelected" class="no-margin" :options="departmentArr" stack-label=" " :display-value="departmentSelected" toggle error  @input="departmentSelFunc(departmentSelected)">
      </q-select>
      <q-select color="white" v-model="zoneSelected" class="no-margin" :options="zoneArr" stack-label=" " :display-value="zoneSelected" toggle error @input="zoneSelFunc(zoneSelected)">
      </q-select>
      <q-select color="white" v-model="machineIDSelected" class="no-margin" :options="machineIDArrQSel" stack-label=" " :display-value="machineIDSelected" toggle error>
      </q-select>-->
      </div>
    </div>
    <!-- table -->
    <div class="row justify-center">
      <div class="col-md-12">
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
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td v-for="col in columns" v-bind:key="col.name" v-if="col.name==='deadlineWarehousing'" :props="props">
            <!--<div v-if="colorEn && moment(props.row[col.name], 'YYYY/M/DD').isAfter(moment(props.row['deadline'], 'YYYY/M/DD').add(colorConditionArr[7][0], 'd'))" :style="colorArr[7]">-->
              <div v-if="colorEn && momentTest(props, col)" :style="colorArr[7]">
              <span v-if="blink[7]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else>
              {{props.row[col.name]}}
            </div>
          </q-td>
          <q-td :key="col.name" v-else>
            {{props.row[col.name]}}
          </q-td>
        </q-tr>
        </q-table>
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
    'checked'
  ],
  data: function () {
    return {
      // ------------------------------機台編號用
      machineIDArrQSel: [],
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
      columns: [],
      rows: [],
      MOQColArr: {
        // '開單日期': 'createDate',
        '派單號碼': 'orderNumber',
        '貨品編號': 'product',
        '品名': 'prodName',
        'M.O.Q.': 'MOQ',
        '生產派單數量': 'targetCount',
        'M.O.Q.差異比': 'diffMOQ',
        '實際入庫數量': 'warehousing',
        '派單入庫差異': 'diffWarehousing',
        '最遲完成日': 'deadline',
        '最後入庫日期': 'deadlineWarehousing'
      },
      serverPagination: {
        rowsPerPage: 20
      },
      departmentArr: [],
      zoneArr: [],
      machineIDArrObj: [],
      organization: {},
      departmentSel: '',
      zoneSel: '',
      machineIDSel: '',
      departmentSelected: '',
      zoneSelected: '',
      machineIDSelected: ''
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
    // console.log(initDoc)
    // console.log(shift)
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
    // console.log(this.zoneArr)
    this.zoneSel = '1A'
    this.machineIDArrObj.length = 0
    // console.log((this.organization[this.departmentSel])[this.zoneSel])
    var tempArr = (this.organization[this.departmentSel])[this.zoneSel]
    tempArr.forEach(elm => {
      this.machineIDArrObj.splice(this.machineIDArrObj.length, 0, {
        label: elm,
        value: elm
      })
    })
    // console.log(this.machineIDArrObj)
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
    sortList: function () {
      this.sortLabel0 = this.sortList[1].label
      this.sortLabel1 = this.sortList[2].label
      this.sortLabel2 = this.sortList[0].label
      this.sort0 = this.sortList[1].value
      this.sort1 = this.sortList[2].value
      this.sort2 = this.sortList[0].value
    },
    checked () {
      this.updateRenderTable()
    }
  },
  mounted () {
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    this.constructTable()
  },
  methods: {
    momentTest (props, col) {
      return moment(props.row[col.name], 'YYYY/M/DD').isAfter(moment(props.row['deadline'], 'YYYY/M/DD').add(this.colorConditionArr[7][0], 'd'))
    },
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
    rowclick (event) {
      // // console.log(event)
    },
    refresh (done) {
      // // console.log('refresh')
      setTimeout(() => {
        done()
      }, 3000)
    },
    ttt (val) {
      // console.log('AbnormalReport1')
      // console.log(val)
      this.$router.push({name: 'AbnormalReport1', params: {period: 'period', department: this.department, zone: this.zone, selectedDatePeriod: val, selectedDatePeriodTo: this.selectedDateE}})
    },
    ttt1 (val) {
      // console.log('AbnormalReport1')
      // console.log(val)
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
      this.machineIDArrObj.splice(0, this.machineIDArrObj.length)
      this.machineIDArrObj.length = 0
      machineIDArrKeys.forEach(elm => {
        this.machineIDArrObj.splice(this.machineIDArrObj.length, 0, {
          label: elm,
          value: elm
        })
      })
      this.machineIDSelected = (this.machineIDArrObj[0]).value
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
    },
    constructTable () {
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
      reportTypeFunc(this.columns, this.MOQColArr, this.sortList)
      this.updateRenderTable()
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
      // console.log(555555)
      this.machineIDArrQSel.splice(0, this.machineIDArrQSel.length)
      this.machineIDArr.forEach(elm => {
        this.machineIDArrQSel.splice(this.machineIDArrQSel.length, 0, {
          label: elm,
          value: elm
        })
      })
      this.machineIDArrQSel.splice(this.machineIDArrQSel.length, 0, {
        label: '全部機台',
        value: 'all'
      })
      // console.log(this.machineIDArr)
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
      this.selectedDate = from
      this.selectedDateE = to
      renderTable(this.columns, this.rows, this.machineIDArr, from, to, this.$q.loading)
    }
  }
}

function renderTable (columns, rows, machineIDArr, from, to, loading) {
  // // console.log(111110)
  // // console.log(columns)
  // // console.log(machineIDArr)
  $.get('/api/getMOQAnalysis/' + machineIDArr + '/' + from + '/' + to, {}, (results) => {
    // // console.log(111112)
    var ret = results.data
    // // console.log(11111)
    // // console.log(ret)
    rows.splice(0, rows.length)
    ret.forEach(rData => {
      var obj = rData
      columns.forEach(column => {
        if (column.name === 'createDate') {
          /* var c = rData[column.name].split('/Date(')[1].split(')/')[0]
          // console.log(c)
          // console.log(parseInt(c))
          // console.log(moment(parseInt(c))) */
          if ((rData[column.name] || '') !== '') {
            obj[column.name] = moment(parseInt(rData[column.name].split('/Date(')[1].split(')/')[0])).format('YYYY/M/DD') // .split(')/') // .getFullYear() + '-' + Date(rData[column.name]).getMonth() + '-' + Date(rData[column.name]).getDate()
          } else {
            obj[column.name] = rData[column.name]
          }
        } else if (column.name === 'deadlineWarehousing') {
          if ((rData[column.name] || '0') !== '0') {
            if (rData[column.name].indexOf('/Date(') !== -1) {
              obj[column.name] = moment(parseInt((rData[column.name].split('/Date(')[1] || '0)/').split(')/')[0])).format('YYYY/M/DD')
            } else {
              obj[column.name] = rData[column.name]
            }
          } else {
            obj[column.name] = rData[column.name]
          }
        } else if (column.name === 'deadline') {
          if ((rData[column.name] || '') !== '') {
            obj[column.name] = moment(parseInt(rData[column.name].split('/Date(')[1].split(')/')[0])).format('YYYY/M/DD')
          } else {
            obj[column.name] = rData[column.name]
          }
        } else if (column.name === 'diffWarehousing') {
          obj[column.name] = `${Math.round(rData[column.name] * 1000) / 10}%`
        }
      })
      rows.splice(rows.length, 0, rData)
    })
    rows.sort(function (a, b) {
      return a.orderNumber > b.orderNumber ? 1 : -1
    })
    console.log(rows)
    loading.hide()
  })
}

function reportTypeFunc (columns, MOQColArr, sortList) {
  columns.splice(0, columns.length)
  columns.length = 0
  var key = Object.keys(MOQColArr)
  key.forEach(elm => {
    var obj = {}
    obj['label'] = elm
    obj['field'] = MOQColArr[elm]
    obj['name'] = MOQColArr[elm]
    obj['required'] = true
    columns.splice(columns.length, 0, obj)
  })
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
function getPageSetting (colorArr, colorConditionArr, blink) {
  $.get('/api/getPageSetting', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
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
