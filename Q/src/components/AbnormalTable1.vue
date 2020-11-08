<template>
  <div class="layout-padding">
  <section class="content">
   <div class="row inline bg-light-blue-7 full-width glossy">
    <div class="col-12 q-pl-xl text-white">
      <h4>{{type}}異常時數分類統計表</h4>
      <h4 v-if="status !== null">({{status}})</h4>
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
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rowsMerge, columns, '異常時數分類統計表')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
    </div>
    <div class="column bg-white full-width no-margin">
    <div class="row inline justify-center" >
    <h1>{{displayDate}}&nbsp;&nbsp;&nbsp;&nbsp;{{displayDepartment}}
          &nbsp;&nbsp;&nbsp;&nbsp;{{displayZone}}
          &nbsp;&nbsp;&nbsp;&nbsp;{{dateFrom}} ~ {{dateTo}}
    </h1>
    </div>
    <div class="row inline q-pt-xs q-pb-xs">
        <div class="col q-pl-xl q-mt-md">
      <span>{{type}}異常時數分類統計表</span>
      <span v-if="status !== null">({{status}})</span>
    </div>
        <div class="row inline q-mr-xl">
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
        <div class="col-12">
        <q-item>
        <q-table
        :data="rowsMerge"
          :columns="columns"
          :rows-per-page-options="config.pagination.options"
          :pagination.sync="serverPagination"
          separator="cell"
          :dense="true"
          row-key="name"
          color="amber"
          @refresh="refresh"
          @rowclick="rowclick"
          hide-header
      >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td v-for="col in columns" v-bind:key="col.name" v-if="props.row['columnMerge'] === true && col.merge === true && props.row[col.name] !== '' &&  props.row[col.name + 'CspanSZ'] === 0" :props="props" :rowspan="props.row[col.name + 'SZ'] + 1">
            {{ props.row[col.name] }}
          </q-td>
          <!--<q-td :key="col.name" v-else-if="props.row['columnMerge'] === true && col.name==='departmentID' && props.row['department'] !== ''" :props="props" :colspan="4">
            {{ props.row[col.name] }}
          </q-td>-->
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === true && col.name > 0" :props="props">
            {{ props.row[col.name] || 0 }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === true && col.merge === true && props.row[col.name] !== '' &&  props.row[col.name + 'CspanSZ'] > 0" :props="props" :colspan="props.row[col.name + 'CspanSZ'] + 1">
            {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === true && col.merge === true && (props.row[col.name] || '') !== ''" :props="props">
            {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === false && col.merge && props.row[col.name]!==''" :props="props" :rowspan="props.row[col.name + 'SZ'] + 1">
                {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === false && props.row[col.name]!=='' && props.row.__index===0 && col.name===times+1" :props="props" :colspan="times+1">
                {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === false && props.row[col.name]!=='' && props.row.__index>0" :props="props">{{ props.row[col.name] }}</q-td>
        </q-tr>
      </q-table>
      </q-item>
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
    'abnormaleTableTimes',
    'checked'
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
      columns: [],
      rows: [],
      rowsMerge: [],
      abnormalColArr: {
        // '資料間隔': 'dataInterval',
        '課別': 'departmentID',
        '區別': 'zoneID',
        '機台編號': 'machineID',
        '說明': 'illustration'
        // '模具故障時數': 'moldFaultTotalHour',
        // '成型機故障時數': 'machineFaultTotalHour',
        // '機械手故障時數': 'armFaultTotalHour',
        // '其他設備故障時數': 'otherFaultTotalHour',
        // '總故障時數': 'faultTotalHour'
      },
      times: 12,
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
      retArr: []
    }
  },
  created: function () {
    this.organization = {
      '_id': 'organization',
      '全局': {'all': ['全局']},
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
    },
    checked () {
      this.updateRenderTable()
    },
    departmentS: function () {
      this.updateRenderTable()
    },
    zoneS: function () {
      this.updateRenderTable()
    }
  },
  mounted () {
    // console.log('mounted')
    if ((this.abnormaleTableTimes || 0) !== 0) {
      this.times = this.abnormaleTableTimes
    }
    // console.log('mounted0')
    this.departmentSelected = this.department
    // console.log(this.department)
    // console.log(this.zoneS)
    this.machineIDSelected = '全部機台'
    var zoneIDArr = Object.keys(this.organization[this.department]).filter(elm => { return elm !== '_id' })
    // console.log('mounted1')
    this.zoneArr.splice(0, this.zoneArr.length)
    this.zoneArr.length = 0
    zoneIDArr.forEach(elm => {
      this.zoneArr.splice(this.zoneArr.length, 0, {
        label: elm,
        value: elm
      })
    })
    // console.log('getDepartObj')
    $.get('/api/getDepartObjAll', {}, (results) => {
      if (results.type !== true) {
        alert(`response is not correct, err: ${results.data}`)
      } else if (results.data.length === 0) {
        alert('沒有機台資料')
      } else {
        results.data.sort(function (a, b) {
          return a.level > b.level ? -1 : a.level < b.level ? 1 : a._id > b._id ? 1 : -1
        })
        results.data.forEach(elm => {
          this.retArr.splice(this.retArr.length, 0, elm)
        })
        this.updateRenderTable()
      }
    })
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
      renderTable(this.columns, this.rows, this.rowsMerge, this.departmentID, from, to, this.period, this.times, this.abnormalColArr, this.type, Vue.set, this.$q.loading, this.retArr, this.zoneS)
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
      this.$router.push({name: 'AbnormalTable1', params: {period: 'period', department: this.department, zone: this.zone, selectedDatePeriod: val, selectedDatePeriodTo: this.selectedDateE}})
    },
    ttt1 (val) {
      this.$router.push({name: 'AbnormalTable1', params: {period: 'period', department: this.department, zone: this.zone, selectedDatePeriod: this.selectedDate, selectedDatePeriodTo: val}})
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
function renderTable (columns, rows, rowsMerge, departmentID, from, to, period, times, abnormalColArr, type, fun, loading, retArr, zoneS) {
  // retArr組織的陣列
  // zoneS前台傳來需求的組織階層
  reportTypeFunc(columns, times, retArr, zoneS)
  // Step1 取得組織架構，再建立rows陣列
  /* var Level1 = [{
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
  }] */
  /* var Level2 = [{
    _id: '1A', father: '成型一課', son: ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], level: 2, levelName: '區', data: ''
  }, {
    _id: '1B', father: '成型一課', son: ['1B01'], level: 2, levelName: '區', data: ''
  }, {
    _id: '1C', father: '成型一課', son: [], level: 2, levelName: '區', data: ''
  }, {
    _id: '2C', father: '成型二課', son: ['2C01'], level: 2, levelName: '區', data: ''
  }]
  var Level3 = [{
    _id: '成型一課', father: '全廠', son: ['1A', '1B', '1C'], level: 3, levelName: '課', data: ''
  }, {
    _id: '成型二課', father: '全廠', son: ['2A', '2B', '2C'], level: 3, levelName: '課', data: ''
  }]
  var Level4 = [{
    _id: '全廠', father: 'organization', son: ['成型一課', '成型二課'], level: 4, levelName: '廠', data: ''
  }) */
  var machineIDArr = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09', '1B01', '2C01']
  // $.get('/api/getAbnormalTable/' + machineIDArr + '/' + from + '/' + times + '/' + period, {}, (results) => {
  var illustrations = {
    totalMoldErr: '加總 的模具故障時數', totalMachineErr: '加總 的成型機故障時數', totalArmErr: '加總 的機械手故障時數', totalOtherErr: '加總 的其他故障時數'
  }
  // var illustrationsKeys = Object.keys(illustrations)
  rows.splice(0, rows.length)
  // console.log('flag')
  buildColumns(columns, rows, zoneS, period, type, from, to, times)
  // console.log('後')
  recursiveMakeRows(rows, retArr, illustrations, zoneS)
  // --------------------------------------------------------------------------
  // var prvLevel1F = ''
  // var prvLevel2F = ''
  // var zoneObj = {}
  // var departmentObj = {}
  /* machineIDArr.forEach(machineID => {
    var machineLevel = Level1.filter(elm => {
      return elm._id === machineID
    })
    var machineLevel2 = ''
    if (machineLevel[0].father !== '') {
      machineLevel2 = Level2.filter(elm => {
        return elm._id === machineLevel[0].father
      })
    }
    if ((prvLevel1F !== '') && (prvLevel1F !== machineLevel[0].father)) {
      if ((prvLevel2F !== '') && (prvLevel2F !== machineLevel2[0].father)) {
        illustrationsKeys.forEach(illustrationKey => {
          rows.splice(rows.length, 0, {
            columnMerge: true,
            department: '',
            departmentID: prvLevel2F,
            zone: prvLevel1F,
            zoneID: prvLevel1F + '區' + illustrations[illustrationKey],
            machineID: '',
            machine: illustrationKey,
            illustration: '',
            illustrationKey: illustrationKey
          })
        })
        illustrationsKeys.forEach(illustrationKey => {
          rows.splice(rows.length, 0, {
            columnMerge: true,
            department: prvLevel2F,
            departmentID: prvLevel2F + illustrations[illustrationKey],
            zone: '',
            zoneID: ' ',
            machineID: ' ',
            machine: illustrationKey,
            illustration: ' ',
            illustrationKey: illustrationKey
          })
        })
      } else {
        illustrationsKeys.forEach(illustrationKey => {
          rows.splice(rows.length, 0, {
            columnMerge: true,
            department: '',
            departmentID: machineLevel2[0].father,
            zone: prvLevel1F,
            zoneID: prvLevel1F + '區' + illustrations[illustrationKey],
            machineID: ' ',
            machine: illustrationKey,
            illustration: ' ',
            illustrationKey: illustrationKey
          })
        })
      }
    }
    illustrationsKeys.forEach(illustrationKey => {
      rows.splice(rows.length, 0, {
        columnMerge: false,
        department: '',
        departmentID: machineLevel2[0].father,
        zone: '',
        zoneID: machineLevel2[0]._id,
        machineID: machineID,
        machine: machineID,
        illustration: illustrations[illustrationKey],
        illustrationKey: illustrationKey
      })
    })
    prvLevel1F = machineLevel[0].father
    prvLevel2F = machineLevel2[0].father
    if (!zoneObj.hasOwnProperty(prvLevel1F)) {
      zoneObj[prvLevel1F] = prvLevel1F
    }
    if (!departmentObj.hasOwnProperty(prvLevel2F)) {
      departmentObj[prvLevel2F] = prvLevel2F
    }
  })
  illustrationsKeys.forEach(illustrationKey => {
    rows.splice(rows.length, 0, {
      columnMerge: true,
      department: '',
      departmentID: prvLevel2F,
      zone: prvLevel1F,
      zoneID: prvLevel1F + '區' + illustrations[illustrationKey],
      machineID: '',
      machine: illustrationKey,
      illustration: '',
      illustrationKey: illustrationKey
    })
  })
  illustrationsKeys.forEach(illustrationKey => {
    rows.splice(rows.length, 0, {
      columnMerge: true,
      department: prvLevel2F,
      departmentID: prvLevel2F + illustrations[illustrationKey],
      zone: '',
      zoneID: ' ',
      machineID: ' ',
      machine: illustrationKey,
      illustration: ' ',
      illustrationKey: illustrationKey
    })
  })
  illustrationsKeys.forEach(illustrationKey => {
    rows.splice(rows.length, 0, {
      columnMerge: true,
      department: 'Total',
      departmentID: illustrations[illustrationKey] + ' 的加總',
      zone: '',
      zoneID: ' ',
      machineID: ' ',
      machine: illustrationKey,
      illustration: ' ',
      illustrationKey: illustrationKey
    })
  }) */
  // console.log('rowsMerge')
  merge(rows, rowsMerge, columns)
  // console.log('rowsMerge0')
  // ----------------
  rowsMerge.forEach((row, idx) => {
    for (var ind = times + 1; ind > 0; ind--) {
      if (idx > 1) {
        fun(row, ind, 0)
      }
    }
  })
  // ----------------
  for (var ind = times + 1; ind > 1; ind--) {
    /* rowsMerge.forEach((row, idx) => {
      if (idx > 1) {
        fun(row, ind, 0)
      }
    }) */
    var fromInd
    var toInd
    switch (period) {
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
    // console.log(fromInd)
    // console.log(toInd)
    $.get('/api/getAbnormalTable/' + machineIDArr + '/' + fromInd + '/' + toInd + '/' + ind, {}, (results) => {
      var ret = results.data
      var retMachineIDs = Object.keys(ret)
      var illustrationsKeys = Object.keys(illustrations)
      retMachineIDs.forEach(retMachineID => {
        var machineRowFilter = rowsMerge.filter(flt => {
          return flt.level1ID === retMachineID
        })
        illustrationsKeys.forEach(illustrationKey => {
          machineRowFilter.forEach(row => {
            if ((row.name === illustrationKey)) {
              fun(row, (ret[retMachineID])['index'], formatSecond(((ret[retMachineID])[illustrationKey] || 0) / 1000))
              fun(row, (ret[retMachineID])['index'] + 'NB', (ret[retMachineID])[illustrationKey] || 0)
              var totalH = 0
              for (var cndInd = times + 1; cndInd > 1; cndInd--) {
                totalH += row[cndInd + 'NB'] || 0
              }
              fun(row, 1, formatSecond(totalH / 1000))
            }
          })
        })
      })
      console.log('rowsMerge666')
      console.log(rowsMerge)
    })
    /* $.get('/api/getAbnormalTable/' + machineIDArr + '/' + fromInd + '/' + toInd + '/' + ind, {}, (results) => {
      var ret = results.data
      var retMachineIDs = Object.keys(ret)
      retMachineIDs.forEach(retMachineID => {
        illustrationsKeys.forEach(illustrationKey => {
          rowsMerge.forEach(row => {
            if ((row.machine === retMachineID) && (row.illustration === illustrations[illustrationKey])) {
              fun(row, (ret[retMachineID])['index'], (ret[retMachineID])[illustrationKey])
              var totalH = 0
              for (var cndInd = times + 1; cndInd > 1; cndInd--) {
                totalH += row[cndInd] || 0
              }
              fun(row, 1, totalH)
            }
          })
        })
      })
      var zoneArr = Object.keys(zoneObj)
      zoneArr.forEach(zone => {
        var machineArr = ((Level2.filter(elm => {
          return elm._id === zone
        }))[0]).son
        illustrationsKeys.forEach(illustrationKey => {
          var cnt = 0
          if (machineArr.length > 0) {
            cnt = machineArr.reduce(function (acc, machineSingleID, currIndex, arr) {
              if (ret.hasOwnProperty(machineSingleID)) {
                return acc + parseInt((ret[machineSingleID])[illustrationKey] || 0)
              }
              return acc
            }, 0)
          }
          rowsMerge.forEach(row => {
            if ((row.zone === zone) && (row.illustrationKey === illustrationKey)) {
              fun(row, (ret[retMachineIDs[0]])['index'], cnt)
              var totalH = 0
              for (var cndInd = times + 1; cndInd > 1; cndInd--) {
                totalH += row[cndInd] || 0
              }
              fun(row, 1, totalH)
            }
          })
        })
      })
      var departArr = Object.keys(departmentObj)
      departArr.forEach(depart => {
        var departSonArr = ((Level3.filter(elm => {
          return elm._id === depart
        }))[0]).son
        var departMachineIDArr = []
        departSonArr.forEach(elm => {
          Level2.forEach(elmElm => {
            if (elmElm['_id'] === elm) {
              departMachineIDArr = departMachineIDArr.concat(elmElm.son)
            }
          })
        })
        illustrationsKeys.forEach(illustrationKey => {
          var cnt = 0
          if (departMachineIDArr.length > 0) {
            cnt = departMachineIDArr.reduce(function (acc, machineSingleID, currIndex, arr) {
              if (ret.hasOwnProperty(machineSingleID)) {
                // console.log('hasOwnProperty')
                return acc + parseInt((ret[machineSingleID])[illustrationKey] || 0)
              }
              return acc
            }, 0)
          }
          rowsMerge.forEach(row => {
            if ((row.department === depart) && (row.illustrationKey === illustrationKey)) {
              fun(row, (ret[retMachineIDs[0]])['index'], cnt)
              var totalH = 0
              for (var cndInd = times + 1; cndInd > 1; cndInd--) {
                totalH += row[cndInd] || 0
              }
              fun(row, 1, totalH)
            }
          })
        })
      })
      // 加總全部
      Level4.forEach(depart => {
        var departZoneIDArr = []
        Level3.forEach(elm => {
          (depart.son).forEach(departSon => {
            if (departSon === elm._id) {
              departZoneIDArr = departZoneIDArr.concat(elm.son)
            }
          })
        })
        var departMachineIDArr = []
        departZoneIDArr.forEach(elm => {
          Level2.forEach(elmElm => {
            if (elmElm['_id'] === elm) {
              departMachineIDArr = departMachineIDArr.concat(elmElm.son)
            }
          })
        })
        illustrationsKeys.forEach(illustrationKey => {
          var cnt = 0
          if (departMachineIDArr.length > 0) {
            cnt = departMachineIDArr.reduce(function (acc, machineSingleID, currIndex, arr) {
              if (ret.hasOwnProperty(machineSingleID)) {
                return acc + parseInt((ret[machineSingleID])[illustrationKey] || 0)
              }
              return acc
            }, 0)
          }
          rowsMerge.forEach(row => {
            if ((row.department === 'Total') && (row.illustrationKey === illustrationKey)) {
              fun(row, (ret[retMachineIDs[0]])['index'], cnt)
              var totalH = 0
              for (var cndInd = times + 1; cndInd > 1; cndInd--) {
                totalH += row[cndInd] || 0
              }
              fun(row, 1, totalH)
            }
          })
        })
      })
      loading.hide()
    }) */
    loading.hide()
  }
}
/* function reportTypeFunc (columns, abnormalColArr, times) {
  columns.splice(0, columns.length)
  columns.length = 0
  var key = Object.keys(abnormalColArr)
  key.forEach(elm => {
    var obj = {}
    obj['label'] = elm
    obj['field'] = abnormalColArr[elm]
    obj['name'] = abnormalColArr[elm]
    obj['merge'] = true
    columns.splice(columns.length, 0, obj)
  })
  // 是否需加入period是否為整數判斷
  for (var i = times + 1; i > 0; i--) {
    var obj = {}
    obj['label'] = i
    obj['field'] = i
    obj['name'] = i
    obj['merge'] = false
    columns.splice(columns.length, 0, obj)
  }
} */
function reportTypeFunc (columns, times, retArr, zoneS) {
  columns.splice(0, columns.length)
  columns.length = 0
  var keys = Object.keys(zoneS)
  var topLevel = retArr.find(elm => {
    return elm._id === keys[0]
  })
  var virtualHead = {}
  retArr.forEach(elm => {
    if (!virtualHead.hasOwnProperty('level' + elm.level)) {
      if (elm.level <= topLevel.level) {
        virtualHead['level' + elm.level] = elm.levelName
      }
    }
  })
  virtualHead['level0'] = '說明'
  // virtualHead['__index'] = ''
  // console.log('virtualHead')
  // console.log(virtualHead)
  // console.log(retArr)
  var virtualHeadKeys = []
  virtualHeadKeys = Object.keys(virtualHead)
  virtualHeadKeys.forEach(elm => {
    var obj = {}
    obj['label'] = virtualHead[elm]
    obj['field'] = elm
    obj['name'] = elm
    obj['merge'] = true
    columns.splice(columns.length, 0, obj)
  })
  // 是否需加入period是否為整數判斷
  for (var i = times + 1; i > 0; i--) {
    var obj = {}
    obj['label'] = i
    obj['field'] = i
    obj['name'] = i
    obj['merge'] = false
    columns.splice(columns.length, 0, obj)
  }
}
function merge (rows, rowsMerge, columns) {
  var columnsMerge = columns.filter(element => {
    return element.merge === true
  })
  rowsMerge.splice(0, rowsMerge.length)
  rowsMerge.length = 0
  var arr = Array(columnsMerge.length)
  var prevRow = {}
  rows.forEach(row => {
    var newRow = row
    columnsMerge.forEach((columnMerge, index) => {
      // console.log(999)
      // console.log(row[columnMerge.name])
      // console.log(row)
      // console.log(columnMerge.name)
      // console.log(arr[index])
      // console.log(arr)
      // console.log(index)
      if (row[columnMerge.name] !== (arr[index] || '')) {
        arr[index] = row[columnMerge.name]
        newRow[columnMerge.name] = row[columnMerge.name]
        // console.log(111)
        // newRow[columnMerge.name + 'SZ'] = 0
        Vue.set(newRow, columnMerge.name + 'SZ', 0)
        // console.log(1110)
        // console.log(rowsMerge.length)
        // console.log(columnMerge.name + 'SZ')
        // console.log(prevRow[columnMerge.name + 'SZ'])
        // console.log(prevRow)
        if (rowsMerge.length > 0) {
          // // console.log(222)
          (rowsMerge[rowsMerge.length - prevRow[columnMerge.name + 'SZ'] - 1])[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ']
          // console.log(222)
        }
      } else {
        // console.log(333)
        newRow[columnMerge.name] = ''
        newRow[columnMerge.name + 'SZ'] = (prevRow[columnMerge.name + 'SZ'] || 0) + 1
      }
    })
    rowsMerge.splice(rowsMerge.length, 0, newRow)
    prevRow = newRow
  })
  columnsMerge.forEach((columnMerge, index) => {
    if (rowsMerge.length > 0) {
      // // console.log(444)
      (rowsMerge[rowsMerge.length - prevRow[columnMerge.name + 'SZ'] - 1])[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ']
      // console.log(444)
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
function buildColumns (columns, rows, zoneS, period, type, from, to, times) {
  var columnLabelObj = {}
  var columnLabelObj1 = {}
  /* var virtualHead = {
    departmentID: '課別',
    zoneID: '區別',
    machineID: '機台編號',
    illustration: '資料'
  } */
  columns.forEach(column => {
    columnLabelObj[column.name] = column.label || ' '
    if (column.name === times + 1) {
      columnLabelObj[column.name] = type
    }
  })
  // var sub = moment(from, 'YYYY-MM-DD').format('w')
  columns.forEach(column => {
    columnLabelObj1[column.name] = column.label || ' '
    if ((column.merge === false) && (column.name !== 1)) {
      var sub1 = ''
      switch (period) {
        case 'daily':
          sub1 = (moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'd').format('Y') - 1911) + '年'
          sub1 += moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'd').format('M') + '月'
          sub1 += moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'd').format('d') + '日'
          break
        case 'weekly':
          sub1 = (moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'w').format('Y') - 1911) + '年'
          sub1 += moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'w').format('w') + '週'
          break
        case 'tenDays':
          var yearTenDaysSub1 = moment(from).year()
          var monthTenDaysSub1 = moment(from).month()
          var tenDaysFgSub1 = 0
          if (moment(from).get('date') < 11) {
            tenDaysFgSub1 = 0 + monthTenDaysSub1 * 3
          } else if (moment(from).get('date') < 21) {
            tenDaysFgSub1 = 1 + monthTenDaysSub1 * 3
          } else {
            tenDaysFgSub1 = 2 + monthTenDaysSub1 * 3
          }
          var section = tenDaysFgSub1 - (column.name - 2)
          if (section < 0) {
            section += 36
            yearTenDaysSub1--
          }
          var tenDaysFgFinal = section % 3
          var monthTenDaysFinal = parseInt(section / 3) + 1
          var yearTenDaysFinal = yearTenDaysSub1
          if (tenDaysFgFinal === 0) {
            sub1 = yearTenDaysFinal + '年' + monthTenDaysFinal + '月上旬'
          } else if (tenDaysFgFinal === 1) {
            sub1 = yearTenDaysFinal + '年' + monthTenDaysFinal + '月中旬'
          } else {
            sub1 = yearTenDaysFinal + '年' + monthTenDaysFinal + '月下旬'
          }
          break
        case 'monthly':
          sub1 = (moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'M').format('Y') - 1911) + '年'
          sub1 += moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'M').format('M') + '月'
          break
        case 'quarterly':
          sub1 = (moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'Q').format('Y') - 1911) + '年'
          sub1 += moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'Q').format('Q') + '季'
          break
        case 'yearly':
          sub1 = (moment(from, 'YYYY-MM-DD').subtract(column.name - 2, 'Y').format('Y') - 1911) + '年'
          break
        case 'period':
          var diff0 = moment(to).diff(moment(from)) / 3600 / 24 / 1000 + 1
          sub1 = moment(from).subtract(diff0 * (column.name - 2), 'days').format('YYYY-MM-DD')
          break
      }
      columnLabelObj1[column.name] = sub1 // '107年9月'
    } else if ((column.merge === false) && (column.name === 1)) {
      columnLabelObj1[column.name] = '合計' // '107年9月'
    }
  })
  columnLabelObj['columnMerge'] = false
  columnLabelObj1['columnMerge'] = false
  rows.splice(rows.length, 0, columnLabelObj)
  rows.splice(rows.length, 0, columnLabelObj1)
  // console.log('flag2')
}
function recursiveMakeRows (rows, orgArr, illustrations, zoneS) {
  // var illustrationsKeys = Object.keys(illustrations)
  var keysArr = Object.keys(zoneS)
  var retArr = []
  if (keysArr.length === 0) {
    return retArr
  }
  // console.log('flag5')
  keysArr.forEach(elm => {
    var org = orgArr.find(orgElm => {
      return orgElm._id === elm
    })
    // console.log(org)
    // console.log(elm)
    // console.log(zoneS)
    if (org === undefined) {
      return
    }
    if (org.level > 2) {
      // var arr = recursiveMakeRows(rows, orgArr, illustrations, zoneS[elm])
      var arr = []
      zoneS[elm].forEach(elm3 => {
        arr = arr.concat(recursiveMakeRows(rows, orgArr, illustrations, elm3))
        // retArr.splice(retArr.length, 0, rows.length)
        if (elm3 === '1A01') {
          // console.log('第N層 0')
        }
        // makeRow(rows, orgArr, illustrations, arr, elm)
      })
      retArr.splice(retArr.length, 0, rows.length)
      makeRow(rows, orgArr, illustrations, arr, elm)
      // 大區域總結
      // retArr.splice(retArr.length, 0, rows.length)
      // makeRow(rows, orgArr, illustrations, arr, elm)
      /* var idx = 0
      var illustrationsKeys = Object.keys(illustrations)
      illustrationsKeys.forEach(illustrationsKey => {
        var obj = {}
        for (var tgtLabel = elm2; tgt.father !== 'organization'; tgtLabel = tgt.father) {
          var tgt = orgArr.find(orgElm => {
            return orgElm === tgtLabel
          })
          obj['level' + tgt.level] = tgt._id + tgt.levelName + illustrations[illustrationsKey]
        }
        obj['sumArr'] = []
        obj['sumFlg'] = true
        arr.forEach(elm => {
          obj['sumArr'].splice(obj['sumArr'].length, 0, elm + idx)
        })
        rows.splice(rows.splice, 0, obj)
        idx++
      }) */
    } else {
      var Arr = []
      zoneS[elm].forEach(elm2 => {
        /* var level2 = orgArr.find(orgElm => {
          return orgElm._id === elm2
        })
        var sumIdArr = []
        // console.log(elm2)
        // console.log(zoneS)
        if (level2.son.length > 0) {
          level2.son.forEach(machineID => {
            // console.log('設定機台的列')
            sumIdArr.splice(sumIdArr.length, 0, makeMachineRows(rows, orgArr, name, illustrations, machineID))
          })
        } */
        if (elm2 === '1A01') {
          // console.log('第N層 1')
          // console.log(rows)
        }
        Arr.splice(Arr.length, 0, makeMachineRows(rows, orgArr, name, illustrations, elm2))
        // 小區域小結
        // Arr.splice(Arr.length, 0, rows.length)
        // makeRow(rows, orgArr, illustrations, sumIdArr, elm2)
        /* var idx = 0
        var illustrationsKeys = Object.keys(illustrations)
        illustrationsKeys.forEach(illustrationsKey => {
          var obj = {}
          for (var tgtLabel = elm2; tgt.father !== 'organization'; tgtLabel = tgt.father) {
            var tgt = orgArr.find(orgElm => {
              return orgElm === tgtLabel
            })
            obj['level' + tgt.level] = tgt._id + tgt.levelName + illustrations[illustrationsKey]
          }
          obj['sumArr'] = []
          obj['sumFlg'] = true
          sumIdArr.forEach(elm => {
            obj['sumArr'].splice(obj['sumArr'].length, 0, elm + idx)
          })
          rows.splice(rows.splice, 0, obj)
          idx++
        }) */
      })
      // 中區域小結
      if (zoneS[elm].length > 0) {
        retArr.splice(retArr.length, 0, rows.length)
        makeRow(rows, orgArr, illustrations, Arr, elm)
      }
    }
  })
  return retArr
}
function makeRow (rows, orgArr, illustrations, sumIdArr, elm2) {
  var idx = 0
  var illustrationsKeys = Object.keys(illustrations)
  illustrationsKeys.forEach(illustrationsKey => {
    var obj = {}
    var tgt = orgArr.find(orgElm => {
      return orgElm._id === elm2
    })
    for (var tgtLabel = elm2; tgtLabel !== 'organization'; tgtLabel = tgt.father) {
      tgt = orgArr.find(orgElm => {
        return orgElm._id === tgtLabel
      })
      if (tgt._id === elm2) {
        obj['name'] = illustrationsKey
        obj['level' + tgt.level] = tgt._id + tgt.levelName + illustrations[illustrationsKey]
        obj['level' + tgt.level + 'CspanSZ'] = tgt.level
      } else {
        obj['level' + tgt.level] = tgt._id
        obj['level' + tgt.level + 'CspanSZ'] = 0
      }
      obj['level' + tgt.level + 'Cspan'] = true
      // obj['level' + tgt.level] = tgt._id
      obj['level' + tgt.level + 'SZ'] = 0
    }
    obj['level0'] = '' // illustrations[illustrationsKey]
    obj['level0Cspan'] = false
    obj['level0CspanSZ'] = 0
    obj['columnMerge'] = true
    obj['sumArr'] = []
    obj['sumFlg'] = true
    sumIdArr.forEach(elm => {
      obj['sumArr'].splice(obj['sumArr'].length, 0, elm + idx)
    })
    rows.splice(rows.length, 0, obj)
    idx++
  })
}
function makeMachineRows (rows, orgArr, name, illustrations, machineID) {
  /* var illustrations = {
    totalMoldErr: '加總 的模具故障時數', totalMachineErr: '加總 的成型機故障時數', totalArmErr: '加總 的機械手故障時數', totalOtherErr: '加總 的其他故障時數'
  } */
  // var tgtLabel = machineID
  var firstRowId = rows.length
  var illustrationsKeys = Object.keys(illustrations)
  illustrationsKeys.forEach(elm => {
    var obj = {}
    var tgt = orgArr.find(orgElm => {
      return orgElm._id === machineID
    })
    // console.log('flag3')
    // obj['level1ID'] = machineID
    for (var tgtLabel = machineID; tgt.father !== 'organization' && tgt.father !== ''; tgtLabel = tgt.father) {
      tgt = orgArr.find(orgElm => {
        return orgElm._id === tgtLabel
      })
      if (tgt !== undefined) {
        obj['level' + tgt.level] = tgt._id
        obj['level' + tgt.level + 'SZ'] = 0
        obj['level' + tgt.level + 'Cspan'] = false
        obj['level' + tgt.level + 'CspanSZ'] = 0
      } else {
        // console.log(tgtLabel)
      }
      if (tgt.father === '') {
        // console.log(tgt)
      }
      /* if (tgt.father !== 'organization') {
        tgtLabel = tgt.father
      } */
    }
    if (Object.keys(obj).length > 0) {
      obj['level1ID'] = machineID
      obj['name'] = elm
      obj['level0'] = illustrations[elm]
      obj['level0CspanSZ'] = 0
      obj['level0Cspan'] = false
      obj['columnMerge'] = false
      obj['sumArr'] = []
      obj['sumFlg'] = false
      rows.splice(rows.length, 0, obj)
    }
  })
  return firstRowId
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
