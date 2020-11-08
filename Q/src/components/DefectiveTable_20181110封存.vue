<template>
  <div class="layout-padding">
    <section class="content">
    <div class="row center-block">
      <q-list>
        <q-item>
          <q-btn @click="openModal()">
            {{yearFrom}}年{{monthFrom}}月&nbsp; - &nbsp;{{yearTo}}年{{monthTo}}月
          </q-btn>
          &nbsp; 生產管理項目統計表
        </q-item>
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
      >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td v-for="col in columns" v-bind:key="col.name" v-if="col.merge && props.row[col.name]!==''" :props="props" :rowspan="props.row[col.name + 'SZ'] + 1">
                {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row[col.name]!==''" :props="props">{{ props.row[col.name] }}</q-td>

          <!--<q-td v-if="props.row.departmentID!==''" key="departmentID" :props="props" :rowspan="props.row['departmentIDSZ']+1">
            {{ props.row.departmentID }}
          </q-td>
        <q-td key="zone" :props="props">{{ props.row.zone }}</q-td>
          <q-td key="machineID" :props="props">{{ props.row.machineID }}</q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="Jan" :props="props">{{ props.row.Jan }}</q-td>
          <q-td key="Feb" :props="props">{{ props.row.Feb }}</q-td>
          <q-td v-if="props.row.Jan==='300'" colspan="100%" :props="props">
              {{ props.row.departmentID }}
          </q-td>-->
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
      </q-list>
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
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import $ from 'jquery'
import Vue from 'vue'
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
    'defectiveGroup'
  ],
  methods: {
    Enter () {
      this.$refs.basicModal.hide()
      this.constructTable()
    },
    constructTable () {
      this.yearMonthTo = this.yearMonthToT
      this.yearMonthFrom = this.yearMonthFromT
      this.yearTo = moment(this.yearMonthToT).format('YYYY')
      this.yearFrom = moment(this.yearMonthFromT).format('YYYY')
      this.monthTo = moment(this.yearMonthToT).format('MM')
      this.monthFrom = moment(this.yearMonthFromT).format('MM')
      this.columns.splice(0, this.columns)
      this.columns.length = 0
      this.columns = [
        {
          label: '課別',
          field: 'department',
          name: 'department',
          merge: true,
          width: '140px',
          classes: 'bg-orange-2'
        },
        {
          label: '區域',
          field: 'zone',
          name: 'zone',
          merge: true,
          width: '70px'
        },
        {
          label: '機台編號',
          field: 'machineID',
          name: 'machineID',
          merge: true,
          width: '120px',
          type: 'string'
        },
        {
          label: '資料名稱',
          field: 'nameInfo',
          name: 'nameInfo',
          type: 'string',
          width: '120'
        }
      ]
      var m0 = moment(this.yearMonthFrom)
      var m1 = moment(this.yearMonthTo)
      var monthCnt = m1.diff(m0, 'M') + 1
      console.log(this.columns.length)
      console.log(this.columns.length)
      for (var ind = 0; ind < monthCnt; ind++) {
        this.columns.splice(this.columns.length, 0, {
          label: moment(this.yearMonthFrom).add(ind, 'month').format('YYYY年MM月').toString(),
          field: ind.toString(),
          name: ind.toString(),
          type: 'string',
          width: '100px'
        })
      }
      console.log(this.columns)
      renderTable(this.table, this.rowsMerge, this.columns, moment(this.yearMonthFrom).format('YYYY-MM'), moment(this.yearMonthTo).format('YYYY-MM'), Vue.set)
    },
    openModal () {
      this.yearMonthToT = this.yearMonthTo
      this.yearMonthFromT = this.yearMonthFrom
      this.$nextTick(() => {
        this.$refs.basicModal.show()
      })
    },
    closeModal () {
      console.log(this.checked)
      console.log(this.radio1)
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
      console.log(`selected ${number}: ${rows}`)
    },
    rowClick (row) {
      console.log('clicked on a row', row)
    },
    simulateProgress () {
      console.log(this.period)
    },
    sel () {
      console.log(this.serverPagination.rowsNumber)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  },
  created () {
    // this.constructTable()
  },
  mounted () {
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
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 上旬'
        } else if (this.selectedTenDays === 'middle') {
          this.dateFrom = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 中旬'
        } else {
          this.dateFrom = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
          this.dateTo = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
          this.displayDate = (parseInt(this.yearMonthTenDays) - 1911) + '年 下旬'
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
    console.log(from)
    console.log(to)
    this.constructTable()
  },
  data () {
    return {
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
        page: 1,
        rowsPerPage: 200,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      columns: [
        {
          label: '課別',
          field: 'department',
          name: 'department',
          merge: true,
          width: '140px',
          classes: 'bg-orange-2'
        },
        {
          label: '區域',
          field: 'zone',
          name: 'zone',
          merge: true,
          width: '70px'
        },
        {
          label: '機台編號',
          field: 'machineID',
          name: 'machineID',
          merge: true,
          width: '120px',
          type: 'string'
        },
        {
          label: '資料名稱',
          field: 'nameInfo',
          name: 'nameInfo',
          type: 'string',
          width: '120'
        },
        {
          label: '1月',
          field: '1',
          name: '1',
          type: 'string',
          width: '100px'
        },
        {
          label: '2月',
          field: '2',
          name: '2',
          type: 'string',
          width: '100px'
        },
        {
          label: '3月',
          field: '3',
          name: '3',
          type: 'string',
          width: '100px'
        },
        {
          label: '4月',
          field: '4',
          name: '4',
          type: 'string',
          width: '100px'
        },
        {
          label: '5月',
          field: '5',
          name: '5',
          type: 'string',
          width: '100px'
        },
        {
          label: '6月',
          field: '6',
          name: '6',
          type: 'string',
          width: '100px'
        },
        {
          label: '7月',
          field: '7',
          name: '7',
          type: 'string',
          width: '100px'
        },
        {
          label: '8月',
          field: '8',
          name: '8',
          type: 'string',
          width: '100px'
        },
        {
          label: '9月',
          field: '9',
          name: '9',
          type: 'string',
          width: '100px'
        },
        {
          label: '10月',
          field: '10',
          name: '10',
          type: 'string',
          width: '100px'
        },
        {
          label: '11月',
          field: '11',
          name: '11',
          type: 'string',
          width: '100px'
        },
        {
          label: '12月',
          field: '12',
          name: '12',
          type: 'string',
          width: '100px'
        }
      ],
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: 'maxHeight',
      bodyHeight: 500
    }
  },
  watch: {
    yearMonthFrom (value) {
      console.log(value)
      console.log(this.yearMonthTo)
    },
    yearMonthTo (value) {
      console.log(value)
      console.log(this.yearMonthFrom)
    },
    /* pagination (value) {
      if (!value) {
        this.oldPagination = clone(this.config.pagination)
        this.config.pagination = false
        return
      }
      this.config.pagination = this.oldPagination
    }, */
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
function renderTable (rows, rowsMerge, columns, from, to, fun) {
  // console.log([departmentID, from, to])
  // init the records in the rows
  rows.splice(0, rows.length)

  // var records
  $.get('/api/getDetectiveData1/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      console.log(results.data)
      results.data.forEach(res => {
        fun(rows, rows.length, res)
      })
      merge(rows, rowsMerge, columns)
    }
  })
}
function merge (rows, rowsMerge, columns) {
  var columnsMerge = columns.filter(element => {
    return element.merge === true
  })
  console.log('columnsMerge')
  console.log(columnsMerge)
  rowsMerge.splice(0, rowsMerge.length)
  rowsMerge.length = 0
  console.log('Hi~hi~')
  console.log(columnsMerge.length)
  console.log(columnsMerge)
  var arr = Array(columnsMerge.length)
  var prevRow = {}
  rows.forEach(row => {
    var newRow = row
    columnsMerge.forEach((columnMerge, index) => {
      if (row[columnMerge.name] !== arr[index]) {
        arr[index] = row[columnMerge.name]
        newRow[columnMerge.name] = row[columnMerge.name]
        console.log('newRow')
        console.log(newRow)
        newRow[columnMerge.name + 'SZ'] = 0
        console.log('newRow')
        console.log(newRow)
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
  console.log('Hi~hi~')
  console.log(rowsMerge)
}
</script>

<style lang="stylus">
.my-label
  padding 5px
  border-radius 3px
  display inline-block
</style>
