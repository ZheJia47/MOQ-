<template>
<div class="layout-padding">
   <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>龍達塑膠股份有限公司&nbsp;&nbsp;&nbsp;&nbsp;{{displayDepartment}} - {{displayZone}} </h4>
  </div>
  </div>
      <div class="row justify-center q-pt-xs q-pb-xs text-white bg-light-blue-8 full-width ">
      <q-btn outline glossy label='排序' icon="icon-svg52" @click="sortFalling = !sortFalling, sortEvent()"/>
      <q-btn-dropdown outline glossy label="顯示欄位" icon="icon-svg53">
  <!-- dropdown content -->
        <q-list link v-if="show" >
          <q-item v-for="(col, index) in columns" v-bind:key="index">
            <q-item-main>
              <q-checkbox v-model="columns[index]['required']" :label="columns[index]['label']" :value="col"/>
            </q-item-main>
          </q-item>
        </q-list>
        <q-list link v-else >
          <q-item v-for="(col, index) in columns1" v-bind:key="index">
            <q-item-main>
              <q-checkbox v-model="columns1[index]['required']" :label="columns1[index]['label']" :value="col"/>
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
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rows, columns, '日 生產報表 - ' + type)"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
   <div class="row justify-around bg-white full-width no-margin">
   <div class="row justify-center q-ma-md full-width">
        <div class="col-6 q-pt-sm">
      <span>日 生產報表 - {{type}}</span>
     </div>
      <div class="col-2 q-ml-xs">
        <q-datetime v-model="selectedDate" type="date" :first-day-of-week="1" @change="ttt(selectedDate)" :display-value="displayValue" />
       </div>
       <div class="col-2 q-ml-xs q-pt-sm">
        <q-checkbox v-model="show">
          顯示非生產紀錄
        </q-checkbox>
        </div>
      </div>
          <div class="row q-pb-sm">
         <span>排序&nbsp;&nbsp;&nbsp;&nbsp;機台<q-icon name="arrow_downward" size="24px" /> + 時間<q-icon name="arrow_downward" size="24px" /></span>
      </div>
      </div>
       <div class="row center-block">
        <div class="col-md-12">
        <q-table v-if="show"
        :data="rows"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        row-key="name"
        separator="cell"
        :visible-columns="visibleColumns"
        >
        <q-tr slot="body" slot-scope="props" :props="props">
        <q-td v-for="column in columns" v-bind:key="column.name">
          <div v-if="column.name === 'performance'">
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
          <div v-else>
            {{props.row[column.name]}}
          </div>
        </q-td>
        </q-tr>
        </q-table>
        <q-table v-else
        :data="rows1"
        :columns="columns1"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        row-key="name"
        separator="cell"
        :visible-columns="visibleColumns"
        >
        <q-tr slot="body" slot-scope="props" :props="props">
        <q-td v-for="column in columns1" v-bind:key="column.name">
          <div v-if="column.name === 'performance'">
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
          <div v-else>
            {{props.row[column.name]}}
          </div>
        </q-td>
        </q-tr>
        </q-table>
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
    'selectedDateS',
    'departmentS',
    'checked',
    'zoneS'
  ],
  data: function () {
    return {
      // ---------------------------toolBar用
      colorArr: [],
      colorConditionArr: [],
      blink: [],
      colorEn: false,
      sortFalling: false,
      // ------------------------------機台編號用
      machineIDArr: [],
      organDept: 0,
      // ------------------------------
      fullscreen: false,
      visibleColumns: [],
      visibleColumns1: [],
      colorConditionObj: {},
      selectedDate: moment().format('YYYY-MM-DD'),
      displayValue: '',
      displayZone: '',
      displayDepartment: '',
      type: '明細',
      zoneStrArr: '',
      serverPagination: {
        rowsPerPage: 20
      },
      show: true,
      rows: [],
      rows1: [],
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
          width: '70px',
          required: true,
          filter: false,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '狀態',
          field: 'machineStatusType',
          name: 'machineStatusType',
          width: '80px',
          required: true,
          filter: true
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '穴數',
          field: 'cavities',
          name: 'cavities',
          width: '40px',
          required: true,
          filter: true
        },
        {
          label: '計時開始',
          field: 'trigTime',
          name: 'trigTime',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '計時結束',
          field: 'lastTrigTime',
          name: 'lastTrigTime',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '時間統計',
          field: 'durationStr',
          name: 'durationStr',
          width: '80px',
          required: true,
          filter: true
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '60px',
          required: true,
          filter: true
        },
        {
          label: '標準週期',
          field: 'standard',
          name: 'standard',
          width: '60px',
          required: true,
          filter: true
        },
        {
          label: '最短週期Ｓ',
          field: 'min',
          name: 'min',
          width: '65px',
          required: true,
          filter: true
        },
        {
          label: '平均週期Ｓ',
          field: 'average',
          name: 'average',
          width: '65px',
          required: true,
          filter: true
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '65px',
          required: true,
          filter: true
        },
        {
          label: '備註',
          field: 'note',
          name: 'note',
          required: true,
          filter: true,
          width: '100px'
        }
      ],
      columns1: [
        {
          label: '機台',
          field: 'machineID',
          name: 'machineID',
          width: '70px',
          filter: false,
          required: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '穴數',
          field: 'cavities',
          name: 'cavities',
          width: '40px',
          required: true,
          filter: true
        },
        {
          label: '計時開始',
          field: 'trigTime',
          name: 'trigTime',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '計時結束',
          field: 'lastTrigTime',
          name: 'lastTrigTime',
          width: '100px',
          required: true,
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '時間統計',
          field: 'durationStr',
          name: 'durationStr',
          width: '80px',
          required: true,
          filter: true
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '60px',
          required: true,
          filter: true
        },
        {
          label: '標準週期',
          field: 'standard',
          name: 'standard',
          width: '60px',
          required: true,
          filter: true
        },
        {
          label: '最短週期Ｓ',
          field: 'min',
          name: 'min',
          width: '65px',
          required: true,
          filter: true
        },
        {
          label: '平均週期Ｓ',
          field: 'average',
          name: 'average',
          width: '65px',
          required: true,
          filter: true
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '65px',
          required: true,
          filter: true
        }
      ]
    }
  },
  computed: {
  },
  created () {
    this.$nextTick(() => {
      var dayStr = ''
      switch (moment(this.selectedDateS).format('d')) {
        case '0':
          dayStr = '星期日'
          break
        case '1':
          dayStr = '星期一'
          break
        case '2':
          dayStr = '星期二'
          break
        case '3':
          dayStr = '星期三'
          break
        case '4':
          dayStr = '星期四'
          break
        case '5':
          dayStr = '星期五'
          break
        case '6':
          dayStr = '星期六'
          break
      }
      this.displayValue = (parseInt(moment(this.selectedDateS).format('YYYY')) - 1911) + '年' + moment(this.selectedDateS).format('M') + '月' + moment(this.selectedDateS).format('D') + '日 ' + dayStr
      // ------------------------------
      this.machineIDArr = recursiveMakeMachineArr(this.zoneS)
      this.organDept = recursiveFindDept(this.zoneS)
      if (this.organDept > 3) {
        this.displayZone = ''
      } else {
        var idx = 0
        this.zoneS[this.departmentS].forEach(elm => {
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
      this.displayDepartment = this.departmentS
      this.$forceUpdate()
      // ------------------------------
      var zoneArr = this.zoneS[this.departmentS]
      // var zoneArrFilter = []
      // var selectedDate = this.selectedDateS // moment().format('YYYY-MM-DD')
      this.selectedDate = this.selectedDateS
      if (this.departmentS !== '全廠') {
        if (zoneArr.includes('全課')) {
          this.zoneStrArr = ['全課']
          /* zoneArrFilter = zoneArr.filter((elm) => {
            return elm !== '全課'
          }) */
        } else {
          this.zoneStrArr = zoneArr
          // zoneArrFilter = zoneArr
        }
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    // just use `this`
    // this.name = to.params.name
    next()
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
      this.machineIDArr = recursiveMakeMachineArr(this.zoneS)
      this.organDept = recursiveFindDept(this.zoneS)
      if (this.organDept > 3) {
        this.displayZone = ''
      } else {
        var idx = 0
        this.zoneS[this.departmentS].forEach(elm => {
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
      this.displayDepartment = this.departmentS
      this.$forceUpdate()
      // ------------------------------
      renderTable(this.rows, this.departmentS, this.machineIDArr, moment(this.selectedDateS).format('YYYY-MM-DD'), this.$q.loading)
    },
    ttt (newVal) {
      var selectedDate = moment(newVal).format('YYYY-MM-DD')
      this.$router.push({name: 'DailyReportProps', params: {selectedDateS: selectedDate, departmentS: this.departmentS, zoneS: this.zoneS, checked: this.checked}})
    },
    sel () {
    },
    showInfor () {
      if (this.show) {
        var idx = -1
        this.columns.forEach((val, index) => {
          if (val.field === 'machineStatusType') {
            idx = index
          }
        })
        this.columns.splice(idx, 1)
        idx = -1
        this.columns.forEach((val, index) => {
          if (val.field === 'note') {
            idx = index
          }
        })
        this.columns.splice(idx, 1)
      } else {
        this.columns.splice(1, 0, {
          label: '狀態',
          field: 'machineStatusType',
          width: '80px',
          filter: true
        })
        this.columns.splice(this.columns.length, 0, {
          label: '備註',
          field: 'note',
          filter: true,
          width: '100px'
        })
      }
    },
    sortEvent () {
      if (!this.sortFalling) {
        this.rows.sort(function (a, b) {
          return a.machineID > b.machineID ? 1 : (a.machineID < b.machineID) ? -1 : (a.trigTimeFullType > b.trigTimeFullType) ? 1 : -1
        })
      } else {
        this.rows.sort(function (a, b) {
          return a.machineID < b.machineID ? 1 : (a.machineID > b.machineID) ? -1 : (a.trigTimeFullType < b.trigTimeFullType) ? 1 : -1
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
  },
  watch: {
    checked: function () {
      this.updateRenderTable()
    },
    departmentS: function () {
      this.updateRenderTable()
    },
    zoneS: function () {
      this.updateRenderTable()
    },
    selectedDateS: function () {
      var dayStr = ''
      switch (moment(this.selectedDateS).format('d')) {
        case '0':
          dayStr = '星期日'
          break
        case '1':
          dayStr = '星期一'
          break
        case '2':
          dayStr = '星期二'
          break
        case '3':
          dayStr = '星期三'
          break
        case '4':
          dayStr = '星期四'
          break
        case '5':
          dayStr = '星期五'
          break
        case '6':
          dayStr = '星期六'
          break
      }
      this.displayValue = (parseInt(moment(this.selectedDateS).format('YYYY')) - 1911) + '年' + moment(this.selectedDateS).format('M') + '月' + moment(this.selectedDateS).format('D') + '日 ' + dayStr
      this.updateRenderTable()
    },
    zone: function () {

    },
    rows: function () {
      this.rows1 = this.rows.filter((elm, index, arr) => {
        if ((elm.machineStatusType === '全自動') || (elm.machineStatusType === '半自動')) {
          // console.log(elm.machineStatusType === '全自動')
        }
        return (elm.machineStatusType === '全自動') || (elm.machineStatusType === '半自動')
      })
    }
  },
  mounted () {
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    this.$forceUpdate()
    this.updateRenderTable()
  },
  components: {
  }
}
function renderTable (rows, department, machineIDs, iReportDate, loading) {
  // init the records in the rows
  // console.log('LKLKLLK')
  var reportDate = moment(iReportDate).format('YYYY-MM-DD 00:00:00')
  rows.splice(0, rows.length)
  rows.length = 0
  $.get('/api/getMachineListRecords/' + department + '/' + machineIDs + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      loading.hide()
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
      loading.hide()
    } else {
      var records = results.data
      records.forEach(record => {
        var t = moment.duration(moment(record['lastTrigTime']) - moment(record['trigTime']))
        var H
        var m
        var s
        var ms
        if (Math.round(t.milliseconds() / 100) >= 10) {
          t = t.add(1, 's')
          ms = '0'
        } else {
          ms = Math.round(t.milliseconds() / 100).toString()
        }
        if (t.asHours() < 10) {
          H = '0' + Math.floor(t.asHours()).toString()
        } else {
          H = Math.floor(t.asHours()).toString()
        }
        if (t.minutes() < 10) {
          m = '0' + t.minutes().toString()
        } else {
          m = t.minutes().toString()
        }
        if (t.seconds() < 10) {
          s = '0' + t.seconds().toString()
        } else {
          s = t.seconds().toString()
        }
        var average = ((record['moldCount'] || 0) === 0) ? 0 : Math.round(moment.duration(moment(record['lastTrigTime']) - moment(record['trigTime'])).asMilliseconds() / Number(record['moldCount']) / 100) / 10
        if ((record['orderNumber'] !== '') && (record['orderNumber'] !== undefined) && (record['orderNumber'] !== null) && (record['machineStatusType'] !== '警報') && (record['moldCount'] > 0)) {
          rows.splice(rows.length, 0, {
            _id: record['_id'],
            machineID: record['machineID'],
            machineStatusType: record['machineStatusType'],
            orderNumber: record['orderNumber'],
            product: record['product'],
            cavities: record['cavities'],
            trigTime: (Math.round(Number(moment(record['trigTime']).format('SSS')) / 100) >= 10) ? (moment(record['trigTime']).add(1, 'seconds').format('MM-DD HH:mm:ss') + '.0') : (moment(record['trigTime']).format('MM-DD HH:mm:ss') + '.' + Math.round(Number(moment(record['trigTime']).format('SSS')) / 100)), // moment(record['trigTime']).format('M/DD HH:mm:ss'),
            lastTrigTime: (Math.round(Number(moment(record['lastTrigTime']).format('SSS')) / 100) >= 10) ? (moment(record['lastTrigTime']).add(1, 'seconds').format('MM-DD HH:mm:ss') + '.0') : (moment(record['lastTrigTime']).format('MM-DD HH:mm:ss') + '.' + Math.round(Number(moment(record['lastTrigTime']).format('SSS')) / 100)), // moment(record['lastTrigTime']).format('M/DD HH:mm:ss'),
            durationStr: H + ':' + m + ':' + s + '.' + ms, // record['durationStr'],
            moldCount: record['moldCount'] || 0,
            standard: record['standard'],
            min: ((record['moldCount'] || 0) > 0) ? ((Math.round((record['min'] || 0) * 10) / 10) === 0) ? 0 : (Math.round((record['min'] || 0) * 10) / 10).toFixed(1) : 0, // Math.round(record['min'] * 10) / 10,
            average: average, // record['average'],
            performance: Math.round(record['standard'] / average * 1000) / 10,
            note: record['note'] || '',
            trigTimeFullType: moment(record['trigTime']).format('YYYY/M/DD HH:mm:ss'),
            lastTrigTimeFullType: moment(record['lastTrigTime']).format('YYYY/M/DD HH:mm:ss')
          })
        }
      })
      rows.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : (a.machineID < b.machineID) ? -1 : (a.trigTimeFullType > b.trigTimeFullType) ? 1 : -1
      })
      loading.hide()
    }
  })
}
function getPageSetting (colorArr, colorConditionArr, blink) {
  $.get('/api/getPageSetting', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // console.log('沒有機台資料')
      // console.log(results.data)
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
