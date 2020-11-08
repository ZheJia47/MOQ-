<template>
<div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      <h5>龍達塑膠股份有限公司</h5>
    </div>
    <q-checkbox v-model="show">
      顯示非生產紀錄
    </q-checkbox>
    <div class="row center-block">
      <h5>日 生產報表 - {{type}}</h5>
      <td>
          <q-datetime v-model="selectedDate" type="date" :first-day-of-week="1" @change="ttt(selectedDate)" :display-value="displayValue"/>
      </td>
      <td>
        {{displayDepartment}}
      </td>
      <td>
        {{displayZone}}區
      </td>
      <div class="col-md-12">
        <!-- <v-client-table :data="rows" :columns="columns" :options="options"></v-client-table> @blur="showInfor()"-->
        <q-table v-if="show"
        :data="rows"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        row-key="name"
        separator="cell"
        />
        <q-table v-else
        :data="rows1"
        :columns="columns1"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        row-key="name"
        />
      </div>
    </div>
  </section>
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'

export default {
  name: 'Tables',
  props: [
    'selectedDateS',
    'departmentS',
    'zoneS'
  ],
  data: function () {
    return {
      selectedDate: moment().format('YYYY-MM-DD'),
      displayValue: '',
      displayZone: '',
      displayDepartment: '',
      type: '明細',
      zoneStrArr: '',
      /* machineID: '1A01',
      machineList: [],
      department: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
      selectedDate: moment().format('YYYY-MM-DD'), */
      serverPagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      show: true,
      visibleColumns: [],
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
          filter: true
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          width: '100px',
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
          filter: true
        },
        {
          label: '計時開始',
          field: 'trigTime',
          name: 'trigTime',
          width: '100px',
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
          filter: true
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '60px',
          filter: true
        },
        {
          label: '標準週期',
          field: 'standard',
          name: 'standard',
          width: '60px',
          filter: true
        },
        {
          label: '最短週期Ｓ',
          field: 'min',
          name: 'min',
          width: '65px',
          filter: true
        },
        {
          label: '平均週期Ｓ',
          field: 'average',
          name: 'average',
          width: '65px',
          filter: true
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '65px',
          filter: true
        },
        {
          label: '備註',
          field: 'note',
          name: 'note',
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
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          width: '100px',
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
          filter: true
        },
        {
          label: '計時開始',
          field: 'trigTime',
          name: 'trigTime',
          width: '100px',
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
          filter: true
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '60px',
          filter: true
        },
        {
          label: '標準週期',
          field: 'standard',
          name: 'standard',
          width: '60px',
          filter: true
        },
        {
          label: '最短週期Ｓ',
          field: 'min',
          name: 'min',
          width: '65px',
          filter: true
        },
        {
          label: '平均週期Ｓ',
          field: 'average',
          name: 'average',
          width: '65px',
          filter: true
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '65px',
          filter: true
        }
      ]
    }
  },
  computed: {
  },
  created () {
    console.log('LLLLLLK')
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
      this.displayZone = ''
      this.zoneS[this.departmentS].forEach(elm => {
        if (this.displayZone === '') {
          this.displayZone = elm
        } else {
          this.displayZone = this.displayZone + '、' + elm
        }
      })
      this.displayDepartment = this.departmentS
      console.log('LLLLLLK22222')
      console.log(this.departmentS)
      console.log(this.selectedDateS)
      var zoneArr = this.zoneS[this.departmentS]
      var zoneArrFilter = []
      var selectedDate = this.selectedDateS // moment().format('YYYY-MM-DD')
      this.selectedDate = this.selectedDateS
      if (this.departmentS !== '全廠') {
        console.log('LLLLLLK22222')
        if (zoneArr.includes('全課')) {
          this.zoneStrArr = ['全課']
          zoneArrFilter = zoneArr.filter((elm) => {
            return elm !== '全課'
          })
        } else {
          // this.zoneStrArr = zoneArr
          this.zoneStrArr = zoneArr
          zoneArrFilter = zoneArr
        }
        console.log(zoneArrFilter)
        zoneArrFilter.forEach((zone) => {
          selectedDate = moment(this.selectedDateS).format('YYYY-MM-DD')
          renderTable(this.rows, this.departmentS, zone, selectedDate)
        })
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    // just use `this`
    // this.name = to.params.name
    next()
  },
  methods: {
    ttt (newVal) {
      console.log('tttttttttttttttttttttt')
      console.log(this.departmentS)
      // var zoneArrFilter = [ '1A' ]
      var selectedDate = moment(newVal).format('YYYY-MM-DD')
      // this.selectedDateS = selectedDate
      this.$router.push({name: 'DailyReportProps', params: {selectedDateS: selectedDate, departmentS: this.departmentS, zoneS: this.zoneS}})
      /* zoneArrFilter.forEach((zone) => {
        renderTable(this.rows, this.departmentS, zone, selectedDate)
      }) */
    },
    sel () {
      console.log(this.serverPagination.rowsNumber)
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
    }
  },
  watch: {
    departmentS: function () {},
    zoneS: function () {},
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
      var zoneArrFilter = [ '1A' ]
      zoneArrFilter.forEach((zone) => {
        renderTable(this.rows, this.departmentS, zone, this.selectedDateS)
      })
    },
    zone: function () {

    },
    /* selectedDate: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table

    }, */
    rows: function () {
      this.rows1 = this.rows.filter((elm, index, arr) => {
        if ((elm.machineStatusType === '全自動') || (elm.machineStatusType === '半自動')) {
          console.log(elm.machineStatusType === '全自動')
        }
        return (elm.machineStatusType === '全自動') || (elm.machineStatusType === '半自動')
      })
    }
  },
  mounted () {

  },
  components: {
  }
}

// function renderTable (rows, machineID, reportDate) {
function renderTable (rows, department, zone, iReportDate) {
  // init the records in the rows
  console.log('LKLKLLK')
  var reportDate = moment(iReportDate).format('YYYY-MM-DD 00:00:00')
  rows.splice(0, rows.length)
  rows.length = 0
  $.get('/api/getMachineListRecords/' + department + '/' + zone + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
    } else {
      var records = results.data
      records.forEach(record => {
        if ((record['orderNumber'] !== '') && (record['orderNumber'] !== undefined) && (record['orderNumber'] !== null) && (record['machineStatusType'] !== '警報') && (record['moldCount'] > 0)) {
          rows.splice(rows.length, 0, {
            _id: record['_id'],
            machineID: record['machineID'],
            machineStatusType: record['machineStatusType'],
            orderNumber: record['orderNumber'],
            product: record['product'],
            cavities: record['cavities'],
            trigTime: moment(record['trigTime']).format('M/DD HH:mm:ss'),
            lastTrigTime: moment(record['lastTrigTime']).format('M/DD HH:mm:ss'),
            durationStr: record['durationStr'],
            moldCount: record['moldCount'],
            standard: record['standard'],
            min: Math.round(record['min'] * 10) / 10,
            average: record['average'],
            // performance: Math.round(record['performance'] * 10) / 10,
            performance: Math.round(record['standard'] / record['average'] * 1000) / 10,
            note: record['note']
          })
        }
      })
      rows.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : (a.machineID < b.machineID) ? -1 : (a.trigTime > b.trigTime) ? 1 : -1
      })
      console.log(rows)
    }
  })
}
</script>

<style>
</style>
