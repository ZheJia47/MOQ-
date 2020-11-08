<template>
  <div class="layout-padding">
    <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>生產管理項目統計表</h4>
      </div>
      </div>
      <div class="row justify-center q-pt-xs q-pb-xs text-white bg-light-blue-8 full-width ">
      <q-btn outline glossy label='色彩設定' icon="icon-svg54" @click="colorEn = !colorEn"/>
      <q-btn outline glossy v-if="!$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon outline glossy name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rowsMerge, columns, '生產管理項目統計表')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
      <div class="row justify-center bg-white full-width no-margin">
    <div class="col-12 q-ml-xl">
    <h1>{{displayDateFrom}}&nbsp; -&nbsp; {{displayDate}}期內</h1>
    </div>
    <div class="row center-block">
    <div class="col-md-12 bg-grey-3 justify-center q-mb-sm q-mt-sm">
<h4>{{displayDepartment}} - {{displayZone}}</h4>
        <q-item>
          <div class="col-md-12">
            <q-table
        :data="rowsMerge"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        row-key="name"
        color="secondary"
        separator="cell"
        hide-header
      >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td v-for="col in columns" v-bind:key="col.name" v-if="props.row['columnMerge'] === true && col.merge === true && props.row[col.name] !== '' &&  props.row[col.name + 'CspanSZ'] === 0" :props="props" :rowspan="props.row[col.name + 'SZ'] + 1">
            {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="col.name === '__index'" :props="props">
            {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === true && col.merge === true && props.row[col.name] !== '' &&  props.row[col.name + 'CspanSZ'] > 0" :props="props" :colspan="props.row[col.name + 'CspanSZ'] + 1">
            {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === true && col.merge === true && (props.row[col.name] || '') !== ''" :props="props">
            {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === true && col.name > 0" :props="props">
            <div v-if="props.row.illustrationKey === 'badRate'">
              <div v-if="colorEn &&  props.row[col.name]  >= colorConditionArr[5][0]" :style="colorArr[5]">
                <span v-if="blink[5]" class="blink">{{ props.row[col.name] }}</span>
                <span v-else>{{ props.row[col.name] }}</span>
              </div>
              <div v-else>
                {{ props.row[col.name] }}
              </div>
            </div>
            <div v-else>
              {{ props.row[col.name] }}
            </div>
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === false && col.merge && props.row[col.name]!==''" :props="props" :rowspan="props.row[col.name + 'SZ'] + 1">
                {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === false && props.row[col.name]!=='' && props.row.__index===0 && col.name===times+1" :props="props" :colspan="times+1">
                {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row['columnMerge'] === false && props.row[col.name]!=='' && props.row.__index>0" :props="props">
            <div v-if="props.row.illustrationKey === 'badRate'">
              <div v-if="colorEn &&  props.row[col.name]  >= colorConditionArr[5][0]" :style="colorArr[5]">
                <span v-if="blink[5]" class="blink">{{ props.row[col.name] }}</span>
                <span v-else>{{ props.row[col.name] }}</span>
              </div>
              <div v-else>
                {{ props.row[col.name] }}
              </div>
            </div>
            <div v-else>
              {{ props.row[col.name] }}
            </div>
            </q-td>
        </q-tr>
      </q-table>
        <!--<q-table
        :data="table"
        :columns="columns"
        :config="config"
        @refresh="refresh"
        @rowclick="rowClick"
      >
        <template slot="col-warehousing" slot-scope="cell">
          <q-input v-model.lazy="cell.data" error placeholder="0" @blur="changeWarehousing(cell)"/>
        </template>
      </q-table>-->
          </div>
      </q-item>
    </div>

    <q-modal ref="basicModal" :content-css="{padding: '10px', maxWidth: '200px'}">
      <q-modal-layout
        header-style="min-height: 10px"
        content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
        footer-class="bg-primary some-class"
        footer-style="{fontSize: '24px', fontWeight: 'bold'}"
      >
       <q-list>
         <h5>生產管理項目統計表</h5>
         <q-item>
        開始:&nbsp;<input type="month" name="yearMonth" v-model="yearMonthFromT" />
        </q-item>
        <q-item>
        結束:&nbsp;<input type="month" name="yearMonth" v-model="yearMonthToT" />
         </q-item>
         <q-item>
        <q-btn color="primary" @click="Enter()">確定</q-btn>
        <q-btn color="primary" @click="closeModal()">關閉</q-btn>
        </q-item>
       </q-list>
      </q-modal-layout>
    </q-modal>
    </div>
    </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import $ from 'jquery'
import Vue from 'vue'
import XLSX from 'XLSX'
// import table from 'data/table.json'
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
  methods: {
    ExcelExport (rows, cols, fileName) {
      // console.log('ppppppppppppppp')
      // console.log(cols)
      // console.log(this.columns)
      var ws
      ws = XLSX.utils.json_to_sheet(rows)
      var wb1 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb1, ws, '表單')
      XLSX.writeFile(wb1, fileName + '9.xlsx')
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
        col2Idx = l
        cols.forEach((col, idx) => {
          if (col.name === ws[ec(0, l)].v) {
            col2Idx = idx
          }
        })
        /* for (col2Idx = 0; col2Idx < cols.length; col2Idx++) {
          if (cols[col2Idx].name === ws[ec(0, l)].v) {
            break
          }
        } */
        if (col2Idx >= cols.length) {
          deleteCol(ws, l)
        }
      }
      range = XLSX.utils.decode_range(ws['!ref'])
      for (l = 0; l <= (range.e.c); l++) {
        cols.forEach(col2 => {
          if (String(col2.name) === ws[ec(0, l)].v) {
            ws[ec(0, l)].v = col2.label
          }
        })
      }
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '表單')
      // console.log('4444444444')
      // console.log(wb)
      // console.log(ws)
      XLSX.writeFile(wb, fileName + '.xlsx')
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
    nonTimeSetting () {
      if ((this.defectiveTableTimes || 0) !== 0) {
        this.times = this.defectiveTableTimes
      }
      switch (this.period) {
        case 'weekly':
          this.type = '週'
          this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
          this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
          this.displayDate = (this.selectedYearWeekly - 1911) + '年 第' + this.selectedWeek + '週'
          this.displayDateFrom = (parseInt(moment(this.dateTo).subtract(this.times - 1, 'week').format('YYYY')) - 1911) + moment(this.dateTo).subtract(this.times - 1, 'week').format('年 第W週')
          break
        case 'tenDays':
          var ten = 0
          var tenFrom = 0
          this.type = '旬'
          if (this.selectedTenDays === 'early') {
            this.dateFrom = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
            this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 ' + moment(this.yearMonthTenDays).format('M') + '上旬'
          } else if (this.selectedTenDays === 'middle') {
            this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
            this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 ' + moment(this.yearMonthTenDays).format('M') + '中旬'
            ten = 1
          } else {
            this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
            this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
            this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 ' + moment(this.yearMonthTenDays).format('M') + '下旬'
            ten = 2
          }
          var yearTenDays = parseInt(moment(this.yearMonthTenDays).format('YYYY'))
          var monthTenDays = parseInt(moment(this.yearMonthTenDays).format('MM'))
          if ((monthTenDays * 3 + ten - 3) < this.times) {
            tenFrom = monthTenDays * 3 + ten + 36 - this.times + 1 - 3
            yearTenDays--
          } else {
            tenFrom = monthTenDays * 3 + ten - this.times + 1 - 3
          }
          this.displayDateFrom = (yearTenDays - 1911) + '年 ' + Math.floor(tenFrom / 3 + 1) + '月 '
          switch (tenFrom % 3) {
            case 0:
              this.displayDateFrom = this.displayDateFrom + '上旬'
              break
            case 1:
              this.displayDateFrom = this.displayDateFrom + '中旬'
              break
            default:
              this.displayDateFrom = this.displayDateFrom + '下旬'
              break
          }
          break
        case 'monthly':
          this.type = '月'
          this.dateFrom = moment(this.yearMonth).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
          this.displayDate = (parseInt(moment(this.yearMonth).format('YYYY')) - 1911) + '年 ' + parseInt(moment(this.yearMonth).format('MM')) + '月'
          this.displayDateFrom = (parseInt(moment(this.yearMonth).subtract(this.times - 1, 'month').format('YYYY')) - 1911) + moment(this.yearMonth).subtract(this.times - 1, 'month').format('年 M月')
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
          var quarterFrom = moment(`${this.selectedYearQuarter}-Q${this.selectedQuarter}`, 'YYYY-Q').subtract(this.times - 1, 'Q')
          this.displayDateFrom = (parseInt(moment(quarterFrom).format('YYYY')) - 1911) + '年 第' + moment(quarterFrom).format('Q') + '季'
          break
        case 'yearly':
          this.type = '年'
          this.dateFrom = moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
          this.dateTo = moment(this.selectedYearTo, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.selectedYear) - 1911) + '年 ~ ' + (parseInt(this.selectedYearTo) - 1911) + '年 '
          this.displayDateFrom = (parseInt(moment(this.selectedYear, 'YYYY').subtract(this.times - 1, 'year').format('YYYY')) - 1911) + '年 ~ ' + (parseInt(moment(this.selectedYear, 'YYYY').subtract(this.times - 1, 'year').format('YYYY')) - 1911) + '年 '
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
      this.constructTable(from, to)
    },
    Enter () {
      this.$refs.basicModal.hide()
      this.constructTable()
    },
    constructTable (from, to) {
      if (this.$q.loading.isActive) {
        return
      }
      this.$q.loading.show({
        delay: 400 // ms
      })
      this.$q.loading.hide()
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
      this.columns = []
      this.columns.splice(0, this.columns.length)
      var ColArr = {
        'departmentID': '課別',
        'zoneID': '區別',
        'machineID': '機台編號',
        'illustration': '資料名稱'
      }
      // var m0 = moment(this.yearMonthFrom)
      // var m1 = moment(this.yearMonthTo)
      // var monthCnt = m1.diff(m0, 'M') + 1
      // console.log(this.columns.length)
      /* for (var ind = 0; ind < monthCnt; ind++) {
        this.columns.splice(this.columns.length, 0, {
          label: moment(this.yearMonthFrom).add(ind, 'month').format('YYYY年MM月').toString(),
          field: ind.toString(),
          name: ind.toString(),
          type: 'string',
          width: '100px'
        })
      } */
      // reportTypeFunc(this.columns, ColArr, this.times)
      // console.log(this.columns)
      this.table = []
      this.table.splice(0, this.table.length)
      this.rowsMerge = []
      this.rowsMerge.splice(0, this.rowsMerge.length)
      // var machineIDArr = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
      constructTable1(this.table, this.rowsMerge, this.columns, this.machineIDArr, from, to, this.period, ColArr, this.times, this.type, this.$q.loading, this.zoneS, this.retArr, this.defectiveGroup, this.topName)
    },
    openModal () {
      this.yearMonthToT = this.yearMonthTo
      this.yearMonthFromT = this.yearMonthFrom
      this.$nextTick(() => {
        this.$refs.basicModal.show()
      })
    },
    closeModal () {
      // console.log(this.checked)
      // console.log(this.radio1)
      this.$refs.basicModal.hide()
    },
    changeMessage (props) {
      props.rows.forEach(row => {
        row.data.message = 'Gogu'
      })
    },
    deleteRow (props) {
      props.rows.forEach(row => {
        this.table.splice(row.index, 1)
      })
    },
    refresh (done) {
      this.timeout = setTimeout(() => {
        done()
      }, 5000)
    },
    selection (number, rows) {
      // console.log(`selected ${number}: ${rows}`)
    },
    rowClick (row) {
      // console.log('clicked on a row', row)
    },
    simulateProgress () {
      // console.log(this.period)
    },
    sel () {
      // console.log(this.serverPagination.rowsNumber)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  },
  created () {
  },
  mounted () {
    // this.nonTimeSetting()
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
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
        this.nonTimeSetting()
      }
    })
  },
  data () {
    return {
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
      times: 12,
      displayDateFrom: moment().add(-11, 'month').format('YYYY-MM'),
      displayDate: moment().format('YYYY-MM'),
      yearMonthFrom: moment().add(-11, 'month').format('YYYY-MM'),
      yearMonthTo: moment().format('YYYY-MM'),
      yearMonthFromT: moment().add(-11, 'month').format('YYYY-MM'),
      yearMonthToT: moment().format('YYYY-MM'),
      yearFrom: moment().add(-11, 'month').format('YYYY'),
      monthFrom: moment().add(-11, 'month').format('MM'),
      yearTo: moment().format('YYYY'),
      monthTo: moment().format('MM'),
      table: [],
      rows: [],
      rowsMerge: [],
      config: {
        refresh: true,
        noHeader: false,
        columnPicker: true,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
          maxHeight: '500px'
        },
        rowHeight: '50px',
        responsive: true,
        pagination: {
          rowsPerPage: 20,
          options: [20, 50, 100, 200, 500]
        },
        selection: 'multiple'
      },
      serverPagination: {
        rowsPerPage: 200
      },
      columns: [],
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: 'maxHeight',
      bodyHeight: 500,
      retArr: []
    }
  },
  watch: {
    defectiveTableTimes: function () {
      this.nonTimeSetting()
    },
    defectiveGroup: function () {
      this.nonTimeSetting()
    },
    period: function () {
      this.nonTimeSetting()
    },
    selectedYearWeekly: function () {
      this.nonTimeSetting()
    },
    selectedWeek: function () {
      this.nonTimeSetting()
    },
    yearMonthTenDays: function () {
      this.nonTimeSetting()
    },
    selectedTenDays: function () {
      this.nonTimeSetting()
    },
    yearMonth: function () {
      this.nonTimeSetting()
    },
    selectedYearQuarter: function () {
      this.nonTimeSetting()
    },
    selectedQuarter: function () {
      this.nonTimeSetting()
    },
    selectedYear: function () {
      this.nonTimeSetting()
    },
    selectedYearTo: function () {
      this.nonTimeSetting()
    },
    selectedDatePeriod: function () {
      this.nonTimeSetting()
    },
    selectedDatePeriodTo: function () {
      this.nonTimeSetting()
    },
    departmentS: function () {
      this.nonTimeSetting()
    },
    zoneS: function () {
      this.nonTimeSetting()
    },
    selectedDate: function () {
    },
    yearMonthFrom (value) {
    },
    yearMonthTo (value) {
    },
    rowHeight (value) {
      this.config.rowHeight = value + 'px'
    },
    bodyHeight (value) {
      let style = {}
      if (this.bodyHeightProp !== 'auto') {
        style[this.bodyHeightProp] = value + 'px'
      }
      this.config.bodyStyle = style
    },
    bodyHeightProp (value) {
      let style = {}
      if (value !== 'auto') {
        style[value] = this.bodyHeight + 'px'
      }
      this.config.bodyStyle = style
    }
  }
}
function renderTable (rows, rowsMerge, columns, from, to, ind, times, nameInfoStr, loading, cnt, machinesObj) {
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
  /* var nameInfoStr = {arm: '機械手警報次數',
    machine: '成型機警報次數',
    change: '換模次數',
    moldCount: '生產模次',
    targetCount: '應產數量',
    warehousing: '入庫數量',
    badNum: '不良數量',
    badRate: '平均不良率'} */
  var illustrations = nameInfoStr
  // console.log(illustrations)
  var illustrationsKeys = Object.keys(illustrations)
  var machineIDArr = Object.keys(machinesObj) // ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
  $.get('/api/getDetectiveTableData/' + machineIDArr + '/' + from + '/' + to + '/' + ind, {}, (results) => {
    var ret = results.data
    var retMachineIDs = Object.keys(ret)
    retMachineIDs.forEach(retMachineID => {
      var machineRowFilter = rowsMerge.filter(flt => {
        // return flt.level1ID === retMachineID
        return machinesObj[retMachineID].indexOf(flt.id) > -1
      })
      var totalH = 0
      var cndInd = 0
      illustrationsKeys.forEach(illustrationKey => {
        machineRowFilter.forEach((row, index, rows) => {
          if ((row.name === illustrationKey)) {
            if (illustrationKey === 'badNum') {
              Vue.set(row, (ret[retMachineID])['index'], row[(ret[retMachineID])['index']] + ((ret[retMachineID])['targetCount'] || 0) - ((ret[retMachineID])['warehousing'] || 0))
              totalH = 0
              for (cndInd = times + 1; cndInd > 1; cndInd--) {
                totalH += row[cndInd] || 0
              }
              Vue.set(row, 1, totalH)
            } else if (illustrationKey === 'badRate') {
              var badRatePercent = 0
              if ((rows[index - 3][(ret[retMachineID])['index']] || 0) !== 0) {
              // if (((ret[retMachineID])['targetCount'] || 0) !== 0) {
                // badRatePercent = Math.round((((ret[retMachineID])['targetCount'] || 0) - ((ret[retMachineID])['warehousing'] || 0)) / ((ret[retMachineID])['targetCount'] || 0) * 1000) / 10
                badRatePercent = Math.round((rows[index - 1][(ret[retMachineID])['index']] || 0) / (rows[index - 3][(ret[retMachineID])['index']] || 0) * 1000) / 10
              }
              Vue.set(row, (ret[retMachineID])['index'], `${badRatePercent}%`)
              if ((rows[index - 3][1] || 0) !== 0) {
              // if (((ret[retMachineID])['targetCount'] || 0) !== 0) {
                // badRatePercent = Math.round((((ret[retMachineID])['targetCount'] || 0) - ((ret[retMachineID])['warehousing'] || 0)) / ((ret[retMachineID])['targetCount'] || 0) * 1000) / 10
                badRatePercent = Math.round((rows[index - 1][1] || 0) / (rows[index - 3][1] || 0) * 1000) / 10
              } else {
                badRatePercent = 0
              }
              Vue.set(row, 1, `${badRatePercent}%`)
            } else {
              Vue.set(row, (ret[retMachineID])['index'], row[(ret[retMachineID])['index']] + (ret[retMachineID])[illustrationKey] || 0)
              totalH = 0
              for (cndInd = times + 1; cndInd > 1; cndInd--) {
                totalH += row[cndInd] || 0
              }
              Vue.set(row, 1, totalH)
            }
          }
        })
      })
    })
    /* retMachineIDs.forEach(retMachineID => {
      illustrationsKeys.forEach(illustrationKey => {
        var rowsMergeFlt = rowsMerge.filter(row => {
          return row.machine === retMachineID
        })
        rowsMergeFlt.forEach(row => {
          if (row.illustration === illustrations[illustrationKey]) {
            Vue.set(row, (ret[retMachineID])['index'], (ret[retMachineID])[illustrationKey])
            var totalH = 0
            for (var cndInd = times + 1; cndInd > 1; cndInd--) {
              totalH += row[cndInd] || 0
            }
            Vue.set(row, 1, totalH)
          }
        })
        var warehousing = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'warehousing'
        })
        var targetCount = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'targetCount'
        })
        var badNum = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badNum'
        })
        Vue.set(badNum, (ret[retMachineID])['index'], targetCount[(ret[retMachineID])['index']] - warehousing[(ret[retMachineID])['index']])
        var total = 0
        for (var cndInd = times + 1; cndInd > 1; cndInd--) {
          total += badNum[cndInd] || 0
        }
        Vue.set(badNum, 1, total)
        var badRate = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badRate'
        })
        var badRatePercent = 0
        if (targetCount[(ret[retMachineID])['index']] !== 0) {
          badRatePercent = Math.round((targetCount[(ret[retMachineID])['index']] - warehousing[(ret[retMachineID])['index']]) / targetCount[(ret[retMachineID])['index']] * 1000) / 10
        }
        Vue.set(badRate, (ret[retMachineID])['index'], badRatePercent)
        if (targetCount['1'] !== 0) {
          total = Math.round((targetCount['1'] - warehousing['1']) / targetCount['1'] * 1000) / 10
        } else {
          total = 0
        }
        Vue.set(badRate, 1, total)
      })
    })
    var zoneArr = Object.keys(zoneObj)
    zoneArr.forEach(zone => {
      var machineArr = ((Level.filter(elm => {
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
        var rowsMergeFlt = rowsMerge.filter(row => {
          return row.zone === zone
        })
        rowsMergeFlt.forEach(row => {
          if (row.illustrationKey === illustrationKey) {
            Vue.set(row, (ret[retMachineIDs[0]])['index'], cnt)
            var totalH = 0
            for (var cndInd = times + 1; cndInd > 1; cndInd--) {
              totalH += row[cndInd] || 0
            }
            Vue.set(row, 1, totalH)
          }
        })
        var warehousing = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'warehousing'
        })
        var targetCount = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'targetCount'
        })
        var badNum = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badNum'
        })
        Vue.set(badNum, (ret[retMachineIDs[0]])['index'], targetCount[(ret[retMachineIDs[0]])['index']] - warehousing[(ret[retMachineIDs[0]])['index']])
        var total = 0
        for (var cndInd = times + 1; cndInd > 1; cndInd--) {
          total += badNum[cndInd] || 0
        }
        Vue.set(badNum, 1, total)
        var badRate = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badRate'
        })
        var badRatePercent = Math.round((targetCount[(ret[retMachineIDs[0]])['index']] - warehousing[(ret[retMachineIDs[0]])['index']]) / targetCount[(ret[retMachineIDs[0]])['index']] * 1000) / 10
        if (targetCount[(ret[retMachineIDs[0]])['index']] === 0) {
          badRatePercent = 0
        }
        Vue.set(badRate, (ret[retMachineIDs[0]])['index'], badRatePercent)
        total = Math.round((targetCount['1'] - warehousing['1']) / targetCount['1'] * 1000) / 10
        if (targetCount['1'] === 0) {
          total = 0
        }
        Vue.set(badRate, 1, total)
      })
    })
    var departArr = Object.keys(departmentObj)
    // console.log(departArr)
    departArr.forEach(depart => {
      var departSonArr = ((Level.filter(elm => {
        return elm._id === depart
      }))[0]).son
      var departMachineIDArr = []
      departSonArr.forEach(elm => {
        Level.forEach(elmElm => {
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
        var rowsMergeFlt = rowsMerge.filter(row => {
          return row.department === depart
        })
        rowsMergeFlt.forEach(row => {
          if (row.illustrationKey === illustrationKey) {
            Vue.set(row, (ret[retMachineIDs[0]])['index'], cnt)
            var totalH = 0
            for (var cndInd = times + 1; cndInd > 1; cndInd--) {
              totalH += row[cndInd] || 0
            }
            Vue.set(row, 1, totalH)
          }
        })
        var warehousing = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'warehousing'
        })
        var targetCount = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'targetCount'
        })
        var badNum = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badNum'
        })
        Vue.set(badNum, (ret[retMachineIDs[0]])['index'], targetCount[(ret[retMachineIDs[0]])['index']] - warehousing[(ret[retMachineIDs[0]])['index']])
        var total = 0
        for (var cndInd = times + 1; cndInd > 1; cndInd--) {
          total += badNum[cndInd] || 0
        }
        Vue.set(badNum, 1, total)
        var badRate = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badRate'
        })
        var badRatePercent = Math.round((targetCount[(ret[retMachineIDs[0]])['index']] - warehousing[(ret[retMachineIDs[0]])['index']]) / targetCount[(ret[retMachineIDs[0]])['index']] * 1000) / 10
        if (targetCount[(ret[retMachineIDs[0]])['index']] === 0) {
          badRatePercent = 0
        }
        Vue.set(badRate, (ret[retMachineIDs[0]])['index'], badRatePercent)
        total = Math.round((targetCount['1'] - warehousing['1']) / targetCount['1'] * 1000) / 10
        if (targetCount['1'] === 0) {
          total = 0
        }
        Vue.set(badRate, 1, total)
      })
    })
    // 加總全部
    Level.forEach(depart => {
      var departZoneIDArr = []
      Level.forEach(elm => {
        (depart.son).forEach(departSon => {
          if (departSon === elm._id) {
            departZoneIDArr = departZoneIDArr.concat(elm.son)
          }
        })
      })
      var departMachineIDArr = []
      departZoneIDArr.forEach(elm => {
        Level.forEach(elmElm => {
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
        var rowsMergeFlt = rowsMerge.filter(row => {
          return row.department === 'Total'
        })
        rowsMergeFlt.forEach(row => {
          if (row.illustrationKey === illustrationKey) {
            Vue.set(row, (ret[retMachineIDs[0]])['index'], cnt)
            var totalH = 0
            for (var cndInd = times + 1; cndInd > 1; cndInd--) {
              totalH += row[cndInd] || 0
            }
            Vue.set(row, 1, totalH)
          }
        })
        var warehousing = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'warehousing'
        })
        var targetCount = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'targetCount'
        })
        var badNum = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badNum'
        })
        Vue.set(badNum, (ret[retMachineIDs[0]])['index'], targetCount[(ret[retMachineIDs[0]])['index']] - warehousing[(ret[retMachineIDs[0]])['index']])
        var total = 0
        for (var cndInd = times + 1; cndInd > 1; cndInd--) {
          total += badNum[cndInd] || 0
        }
        Vue.set(badNum, 1, total)
        var badRate = rowsMergeFlt.find(row => {
          return row.illustrationKey === 'badRate'
        })
        var badRatePercent = Math.round((targetCount[(ret[retMachineIDs[0]])['index']] - warehousing[(ret[retMachineIDs[0]])['index']]) / targetCount[(ret[retMachineIDs[0]])['index']] * 1000) / 10
        if (targetCount[(ret[retMachineIDs[0]])['index']] === 0) {
          badRatePercent = 0
        }
        Vue.set(badRate, (ret[retMachineIDs[0]])['index'], badRatePercent)
        total = Math.round((targetCount['1'] - warehousing['1']) / targetCount['1'] * 1000) / 10
        if (targetCount['1'] === 0) {
          total = 0
        }
        Vue.set(badRate, 1, total)
      })
    }) */
    cnt[0]++
    if (cnt[0] === times) {
      loading.hide()
    }
  })
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
      if (row[columnMerge.name] !== arr[index]) {
        arr[index] = row[columnMerge.name]
        newRow[columnMerge.name] = row[columnMerge.name]
        newRow[columnMerge.name + 'SZ'] = 0
        if (rowsMerge.length > 0) {
          (rowsMerge[rowsMerge.length - prevRow[columnMerge.name + 'SZ'] - 1])[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ']
        }
      } else {
        newRow[columnMerge.name] = ''
        newRow[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ'] + 1
      }
    })
    rowsMerge.splice(rowsMerge.length, 0, newRow)
    prevRow = newRow
  })
  columnsMerge.forEach((columnMerge, index) => {
    if (rowsMerge.length > 0) {
      (rowsMerge[rowsMerge.length - prevRow[columnMerge.name + 'SZ'] - 1])[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ']
    }
  })
}
function constructTable1 (rows, rowsMerge, columns, machineIDArr, from, to, period, ColArr, times, type, loading, zoneS, retArr, defectiveGroup, topName) {
  // -------------------------------------------
  var nameInfoStr = {arm: '機械手警報次數',
    machine: '成型機警報次數',
    change: '換模次數',
    moldCount: '生產模次',
    targetCount: '應產數量',
    warehousing: '入庫數量',
    badNum: '不良數量',
    badRate: '平均不良率'}
  rows.splice(0, rows.length)
  // console.log('flag')
  // console.log(rowsMerge)
  // console.log(columns)
  if (zoneS.hasOwnProperty(topName)) {
    reportTypeFunc(columns, times, retArr, zoneS)
    buildColumns(columns, rows, zoneS, period, type, from, to, times)
    recursiveMakeRows(rows, retArr, nameInfoStr, zoneS, defectiveGroup, topName)
  } else {
    // 找出正確的zoneS
    var tempZoneS = zoneS
    while (tempZoneS !== undefined) {
      if (tempZoneS.hasOwnProperty(topName)) {
        break
      } else {
        tempZoneS = Object.values(tempZoneS)[0][0]
      }
    }
    // -----------------------------------------
    reportTypeFunc(columns, times, retArr, tempZoneS)
    buildColumns(columns, rows, tempZoneS, period, type, from, to, times)
    recursiveMakeRows(rows, retArr, nameInfoStr, tempZoneS, defectiveGroup, topName)
  }
  // -------------------------------------------
  merge(rows, rowsMerge, columns)
  // ----------------
  rowsMerge.forEach((row, idx) => {
    for (var ind = times + 1; ind > 0; ind--) {
      if (idx > 1) {
        Vue.set(row, ind, 0)
      }
    }
  })
  // ----------------
  // 從topName建構物件，{'1A01': ['1A', '成型一課', '全廠'], '1A02': ['1A', '成型一課', '全廠']}
  var machinesObj = {}
  recursiveMakeMachineArrV2(retArr, topName).forEach(elm => {
    machinesObj[elm] = findForebearArr(retArr, elm)
  })
  // console.log(machinesObj)
  // console.log('machinesObj')
  var cnt = [0]
  for (var i = 2; i < times + 2; i++) {
    getDateInterval(from, to, i, period, function (fromInd, toInd) {
      renderTable(rows, rowsMerge, columns, fromInd, toInd, i, times, nameInfoStr, loading, cnt, machinesObj)
    })
  }
}
/* function reportTypeFunc (columns, abnormalColArr, times) {
  columns.splice(0, columns.length)
  columns.length = 0
  var key = Object.keys(abnormalColArr)
  key.forEach(elm => {
    var obj = {}
    obj['label'] = abnormalColArr[elm]
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
} */
function getDateInterval (from, to, ind, period, callback) {
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
  // console.log('fromInd: ' + fromInd + '   toInd: ' + toInd + '   ind: ' + ind)
  callback(fromInd, toInd)
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
  virtualHead['level0'] = '資料名稱'
  // virtualHead['__index'] = '123'
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
function recursiveMakeRows (rows, orgArr, illustrations, zoneS, defectiveGroup, topName) {
  var keysArr = Object.keys(zoneS)
  var retArr = []
  if (keysArr.length === 0) {
    return retArr
  }
  var topOrg = orgArr.find(orgElm => {
    return orgElm._id === topName
  })
  keysArr.forEach(elm => {
    var org = orgArr.find(orgElm => {
      return orgElm._id === elm
    })
    if (org === undefined) {
      return
    }
    if (org.level > 2) {
      var arr = []
      zoneS[elm].forEach(elm3 => {
        arr = arr.concat(recursiveMakeRows(rows, orgArr, illustrations, elm3, defectiveGroup, topName))
      })
      retArr.splice(retArr.length, 0, rows.length)
      if (defectiveGroup) {
        makeRow(rows, orgArr, illustrations, arr, elm, defectiveGroup, topName)
      } else {
        if (org.level < topOrg.level) {
          makeRow(rows, orgArr, illustrations, arr, elm, defectiveGroup, topName)
        }
      }
    } else {
      var Arr = []
      zoneS[elm].forEach(elm2 => {
        Arr.splice(Arr.length, 0, makeMachineRows(rows, orgArr, name, illustrations, elm2))
      })
      if (zoneS[elm].length > 0) {
        retArr.splice(retArr.length, 0, rows.length)
        if (defectiveGroup) {
          makeRow(rows, orgArr, illustrations, Arr, elm, defectiveGroup, topName)
        } else {
          if (org.level < topOrg.level) {
            makeRow(rows, orgArr, illustrations, Arr, elm, defectiveGroup, topName)
          }
        }
      }
    }
  })
  return retArr
}
function makeRow (rows, orgArr, illustrations, sumIdArr, elm2, defectiveGroup, topName) {
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
        obj['id'] = tgt._id
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
  var firstRowId = rows.length
  var illustrationsKeys = Object.keys(illustrations)
  illustrationsKeys.forEach(elm => {
    var obj = {}
    var tgt = orgArr.find(orgElm => {
      return orgElm._id === machineID
    })
    // console.log('flag3')
    obj['level1ID'] = machineID
    obj['id'] = machineID
    for (var tgtLabel = machineID; tgt.father !== 'organization'; tgtLabel = tgt.father) {
      tgt = orgArr.find(orgElm => {
        return orgElm._id === tgtLabel
      })
      obj['level' + tgt.level] = tgt._id
      obj['level' + tgt.level + 'SZ'] = 0
      obj['level' + tgt.level + 'Cspan'] = false
      obj['level' + tgt.level + 'CspanSZ'] = 0
    }
    obj['name'] = elm
    obj['level0'] = illustrations[elm]
    obj['level0CspanSZ'] = 0
    obj['level0Cspan'] = false
    obj['columnMerge'] = false
    obj['sumArr'] = []
    obj['sumFlg'] = false
    rows.splice(rows.length, 0, obj)
  })
  return firstRowId
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
function findForebearArr (retArr, name) {
  var nameObj = retArr.find(elm => {
    return elm._id === name
  })
  var forebearArr = [nameObj._id]
  if (nameObj.father === 'organization') {
    return forebearArr
  } else {
    return forebearArr.concat(findForebearArr(retArr, nameObj.father))
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
.my-label
  padding 5px
  border-radius 3px
  display inline-block
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
