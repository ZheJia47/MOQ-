<template>
<div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      <h5>資料登錄</h5>
    </div>
    <div class="row center-block">
      <div class="col">
        <select v-model="department">
          <option v-for="part in departmentList" v-bind:key="part" :value="part">
          {{ part }}
          </option>
        </select>
        <select v-model="zone">
          <option v-for="zoneLabel in zoneList" v-bind:key="zoneLabel" :value="zoneLabel">
          {{ zoneLabel }}
          </option>
        </select>
        日期：<input type="date" v-model="selectedDate" />
      </div>
    </div>
    <q-checkbox v-model="show"
      @blur="showInfor()"
      >
      顯示非生產紀錄
    </q-checkbox>
    <div class="row center-block">
      <h5>日 生產報表 - {{type}}</h5>
      <div class="col-md-12">
        <!-- <v-client-table :data="rows" :columns="columns" :options="options"></v-client-table> -->
        <q-table
        :data="rows"
        :columns="columns"
        :config="config"
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
  data: function () {
    return {
      type: '明細',
      machineID: '1A01',
      machineList: [],
      department: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
      show: true,
      selectedDate: moment().format('YYYY-MM-DD'),
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
          width: '70px',
          filter: false,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '狀態',
          field: 'machineStatusType',
          width: '80px',
          filter: true
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '成品料號',
          field: 'product',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '穴<BR>數',
          field: 'cavities',
          width: '40px',
          filter: true
        },
        {
          label: '計時開始',
          field: 'trigTime',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '計時結束',
          field: 'lastTrigTime',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '時間統計',
          field: 'durationStr',
          width: '80px',
          filter: true
        },
        {
          label: '生產<BR>模數',
          field: 'moldCount',
          width: '60px',
          filter: true
        },
        {
          label: '標準<BR>週期',
          field: 'standard',
          width: '60px',
          filter: true
        },
        {
          label: '最短<BR>週期Ｓ',
          field: 'min',
          width: '65px',
          filter: true
        },
        {
          label: '平均<BR>週期Ｓ',
          field: 'average',
          width: '65px',
          filter: true
        },
        {
          label: '週期<BR>效率％',
          field: 'performance',
          width: '65px',
          filter: true
        },
        {
          label: '備註',
          field: 'note',
          filter: true,
          width: '100px'
        }
      ],
      columns1: [
        {
          label: '機台',
          field: 'machineID',
          width: '70px',
          filter: false,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '成品料號',
          field: 'product',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '穴<BR>數',
          field: 'cavities',
          width: '40px',
          filter: true
        },
        {
          label: '計時開始',
          field: 'trigTime',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '計時結束',
          field: 'lastTrigTime',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '時間統計',
          field: 'durationStr',
          width: '80px',
          filter: true
        },
        {
          label: '生產<BR>模數',
          field: 'moldCount',
          width: '60px',
          filter: true
        },
        {
          label: '標準<BR>週期',
          field: 'standard',
          width: '60px',
          filter: true
        },
        {
          label: '最短<BR>週期Ｓ',
          field: 'min',
          width: '65px',
          filter: true
        },
        {
          label: '平均<BR>週期Ｓ',
          field: 'average',
          width: '65px',
          filter: true
        },
        {
          label: '週期<BR>效率％',
          field: 'performance',
          width: '65px',
          filter: true
        }
      ]
    }
  },
  computed: {
  },
  methods: {
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
    department: function () {
      // destroy previous table
      // machineID

      // render new table
      this.$nextTick(() => {
        $.get('/api/getDepartmentList/' + this.department, {}, (results) => {
          if (results.type !== true) {
            alert(`response is not correct, err: ${results.data}`)
          } else if (results.data.length === 0) {
            alert('沒有機台資料')
          } else {
            var arr = Object.keys(results.data.zone)
            arr.forEach((val, index) => {
              this.zoneList.push(val)
            })
            this.zoneList.sort()
            this.zone = this.zoneList[0]
            // renderTable(this.rows, this.machineID, this.selectedDate)
            renderTable(this.rows, this.department, this.zone, this.selectedDate)
          }
        })
      })
    },
    zone: function () {
      this.$nextTick(() => {
        renderTable(this.rows, this.department, this.zone, this.selectedDate)
      })
    },
    /* machineID: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        renderTable(this.rows, this.machineID, this.selectedDate)
      })
    }, */
    selectedDate: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        renderTable(this.rows, this.department, this.zone, this.selectedDate)
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      $.get('/api/getDepartmentList/' + this.department, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
        } else {
          /* results.data.forEach((result) => {
            this.machineList.push(result['machineID'])
          })
          this.machineList.sort()
          renderTable(this.rows, this.machineID, this.selectedDate) */
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
  },
  components: {
  }
}

// function renderTable (rows, machineID, reportDate) {
function renderTable (rows, department, zone, reportDate) {
  // init the records in the rows
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
            trigTime: moment(record['trigTime']).format('HH:mm:ss'),
            lastTrigTime: moment(record['lastTrigTime']).format('HH:mm:ss'),
            durationStr: record['durationStr'],
            moldCount: record['moldCount'],
            standard: record['standard'],
            min: Math.round(record['min'] * 10) / 10,
            average: record['average'],
            performance: Math.round(record['performance'] * 10) / 10,
            note: record['note']
          })
        }
      })
      rows.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : (a.machineID < b.machineID) ? -1 : (a.trigTime > b.trigTime) ? 1 : -1
      })
      // console.log(rows)
    }
  })
}
</script>

<style>
</style>
