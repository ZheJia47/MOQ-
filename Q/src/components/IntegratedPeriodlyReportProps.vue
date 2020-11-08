<template>
  <div class="layout-padding">
  <section class="content">
    <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
        <h4>{{type}}生產報表
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {{displayDepartment}} - {{displayZone}}</h4>
        <h4 v-if="status !== null">({{status}})
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {{displayDepartment}} - {{displayZone}}</h4>
      </div>
    </div>
    <div class="row justify-center q-pt-xs q-pb-xs text-white bg-light-blue-8 full-width ">
      <q-btn outline glossy label='排序' icon="icon-svg52" @click="sortFalling = !sortFalling, sortEvent()"/>
      <q-btn-dropdown outline glossy label="顯示欄位" icon="icon-svg53">
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
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rows, columns, type + ' 生產報表')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
    </div>
    <div class="row justify-around bg-white full-width no-margin">
      <div class="row justify-around q-ma-md full-width">
        <div class="col-auto q-ml-xs q-mt-sm">
          <p>{{displayDate}} - {{dateFrom}} ~ {{dateTo}}</p>
        </div>
        <div class="column inline justify-top q-pl-md">
          <div class="col-auto">
            <span>期間日數{{totalDays}}日*{{hoursADay}}小時={{totalHours}}小時</span>
          </div>
          <div class="col-auto">
            <span>生產工作日數{{totalWorkDays[0]}}天*{{hoursADay}}小時={{totalWorkHours[0]}}小時</span>
          </div>
        </div>
      </div>
      <div class="column" style="max-width: 110%">
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
        <div class="row justify-center">
            <div class="col-auto bg-grey-3 q-ma-xs q-pb-sm" style="max-width: 90%">
              <q-table
                :data="rows"
                :columns="columns"
                :rows-per-page-options="config.pagination.options"
                :pagination.sync="serverPagination"
                separator="cell"
                :dense="true"
                row-key="name"
                color="amber"
                :visible-columns="visibleColumns"
              >
                <q-td slot="body-cell-warehousing" slot-scope="cell">
                  {{cell.row.warehousing}}
                  <q-popup-edit v-model="cell.row.warehousing" buttons label-set="確定" label-cancel="取消" :disable="((period !== 'monthly') && (period !== 'weekly') && (cell.row.machineID === '合計'))" persistent @save="changeWarehousing(cell.row.warehousing, cell)" @cancel="test5">
                  <q-field count>
                    <q-input
                      type="text"
                      v-model="cell.row.warehousing"
                      error
                    />
                  </q-field>
                </q-popup-edit>
              </q-td>
              <q-td slot="body-cell-totalAlm" slot-scope="props" :props="props">
                <div v-if="colorEn && props.value > colorConditionArr[0][0]" :style="colorArr[0]">
                  <span v-if="blink[0]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else>
                  {{props.value}}
                </div>
              </q-td>
              <q-td slot="body-cell-badRate" slot-scope="props" :props="props">
                <div v-if="colorEn && props.value >= colorConditionArr[5][0]" :style="colorArr[5]">
                  <span v-if="blink[5]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else>
                  {{props.value}}
                </div>
              </q-td>
              <q-td slot="body-cell-performance" slot-scope="props" :props="props">
                <div v-if="colorEn && props.value > colorConditionArr[1][0]" :style="colorArr[1]">
                  <span v-if="blink[1]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else-if="colorEn && props.value < colorConditionArr[2][0]" :style="colorArr[2]">
                  <span v-if="blink[2]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else>
                  {{props.value}}
                </div>
              </q-td>
              <q-td slot="body-cell-average" slot-scope="props" :props="props">
                <div v-if="colorEn && props.value >= props.row['standard'] * colorConditionArr[3][0]" :style="colorArr[3]">
                  <span v-if="blink[3]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else-if="colorEn && props.value <= props.row['standard'] * colorConditionArr[4][0]" :style="colorArr[4]">
                  <span v-if="blink[4]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else>
                  {{props.value}}
                </div>
              </q-td>
              <q-td slot="body-cell-deadline" slot-scope="props" :props="props">
                <div v-if="colorEn && props.value < props.row['tgtfinishTime' + 'FullType'] + colorConditionArr[7][0]" :style="colorArr[7]">
                  <span v-if="blink[7]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else>
                  {{props.value}}
                </div>
              </q-td>
              <q-td slot="body-cell-tgtfinishTime" slot-scope="props" :props="props">
                <div v-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > props.row['standard'] + colorConditionArr[11][0]" :style="colorArr[11]">
                  <span v-if="blink[11]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > props.row['standard'] + colorConditionArr[10][0]" :style="colorArr[10]">
                  <span v-if="blink[10]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] <= props.row['standard'] * colorConditionArr[12][0]" :style="colorArr[12]">
                  <span v-if="blink[12]" class="blink">{{props.value}}</span>
                  <span v-else>{{props.value}}</span>
                </div>
                <div v-else>
                  {{props.value}}
                </div>
              </q-td>
            </q-table>
          <!--</q-item>-->
          </div>
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
    'zoneS',
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
    'checked'
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
      // ------------------------------
      type: '整合',
      status: null,
      totalDays: 30,
      hoursADay: 24,
      totalHours: 720,
      totalWorkDays: [0],
      totalWorkHours: [0],
      departmentID: '成型一課',
      departmentList: [],
      zone: '1H',
      zoneList: [],
      selectedWeekO: moment().week() - 1,
      dateFrom: '',
      dateTo: '',
      displayDate: '',
      selectedDateFrom: moment().format('YYYY-MM-DD'),
      selectedDateTo: moment().format('YYYY-MM-DD'),
      rows: [],
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
          filter: true,
          type: 'string',
          required: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '警報',
          field: 'totalAlm',
          name: 'totalAlm',
          width: '40px',
          filter: true,
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          width: '100px',
          filter: true,
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          width: '100px',
          filter: true,
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '穴數',
          field: 'cavities',
          name: 'cavities',
          width: '40px',
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '量產開始',
          field: 'startTime',
          name: 'startTime',
          width: '120px',
          type: 'string',
          required: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '量產結束',
          field: 'endTime',
          name: 'endTime',
          width: '120px',
          type: 'string',
          required: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '自動生產時間累計',
          field: 'duration',
          name: 'duration',
          width: '80px',
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '80px',
          type: 'Number',
          required: true,
          sort: false
        },
        {
          label: '應產數量',
          field: 'targetCount',
          name: 'targetCount',
          type: 'Number',
          required: true,
          width: '80px'
        },
        {
          label: '入庫數量',
          field: 'warehousing',
          name: 'warehousing',
          required: true,
          width: '80px'
        },
        {
          label: '簡易不良數',
          field: 'badNum',
          name: 'badNum',
          width: '100px',
          // type: 'Number',
          required: true,
          sort: false
        },
        {
          label: '不良率 %',
          field: 'badRate',
          name: 'badRate',
          width: '80px',
          type: 'number',
          required: true,
          sort: false
        },
        {
          label: '標準週期S',
          field: 'standard',
          name: 'standard',
          width: '100px',
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '最短週期S',
          field: 'min',
          name: 'min',
          width: '100px',
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '平均週期S',
          field: 'average',
          name: 'average',
          width: '100px',
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '100px',
          type: 'string',
          required: true,
          sort: false
        },
        {
          label: '最遲完成日',
          field: 'deadline',
          name: 'deadline',
          filter: false,
          width: '100px',
          type: 'string',
          required: true,
          sort: false
        }
      ],
      serverPagination: {
        rowsPerPage: 20
      }
    }
  },
  computed: {
    weeksInYear: function () {
      return moment(`${this.selectedYear}`, 'YYYY').weeksInYear()
    }
  },
  filters: {
  },
  watch: {
    calendar: function () {
      this.selectedWorkDay()
    },
    colorConditionArr: function () {
      this.hoursADay = this.colorConditionArr[9][0]
      this.selectedWorkDay()
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
    department: function () {
      this.updateRenderTable()
    },
    zoneS: function () {
      this.updateRenderTable()
    },
    checked () {
      this.updateRenderTable()
    }
  },
  sockets: {
    setWarehousingSuccess: function (val) {
      var rowsMachineID = this.rows.filter(row => {
        return row.machineID === val.value.machineID
      })
      for (var idx in this.rows) {
        if (this.rows[idx].lastID === val.value._id) {
          val.value.badRate = 0
          // (val.value.badNum !== '') && (val.value.badNum !== '0') &&
          /* if ((val.value.warehousing !== '') && (val.value.warehousing !== '0')) {
            val.value.badRate = ((this.rows[idx].totalTargetCount - parseInt(val.value.warehousing)) / parseInt(val.value.warehousing) * 100).toFixed(2)
          } */
          // Object.assign(this.rows[idx], val.value)
          // Vue.set(this.rows[idx], 'badRate', val.value.badRate)
          // Vue.set(this.rows[idx], 'badNum', (this.rows[idx].targetCount - parseInt(val.value.warehousing)))
          var arr = []
          rowsMachineID.forEach(rowMachineID => {
            if (rowMachineID.warehousing > 0) {
              arr.splice(arr.length, 0, rowMachineID.orderNumber)
            }
          })
          var o = {
            machineID: val.value.machineID,
            orderArr: arr
          }
          this.$socket.emit('getTotalTargetCount', o)
          // // console.log('getTotalTargetCount')
          break
        }
      }
      var totalWarehousing = rowsMachineID.reduce(function (previousValue, currentValue, index, array) {
        return previousValue + parseInt(currentValue.warehousing)
      }, 0)
      for (var idxT in this.rows) {
        if ((this.rows[idxT].machineLabel === val.value.machineID) && (this.rows[idxT].machineID === '合計')) {
          Vue.set(this.rows[idxT], 'warehousing', totalWarehousing)
        }
      }
      this.status = '設定成功'
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setWarehousingFail: function (val) {
      // console.log('fail')
      this.status = '設定失敗'

      for (let i = 0; i < this.rows.length; i++) {
        let record = this.rows[i]
        if (record._id === val._id) {
          record.warehousing = val.warehousing
          break
        }
      }

      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setBadNumSuccess: function (val) {
      for (var idx in this.rows) {
        if (this.rows[idx]._id === val.value._id) {
          val.value.badRate = 0
          if ((val.value.badNum !== '') && (val.value.badNum !== '0') && (val.value.warehousing !== '') && (val.value.warehousing !== '0')) {
            val.value.badRate = (parseInt(val.value.badNum) / parseInt(val.value.warehousing) * 100).toFixed(2)
          }
          // Object.assign(this.rows[idx], val.value)
          Vue.set(this.rows[idx], 'badRate', val.value.badRate)
          break
        }
      }
      this.status = '設定成功'
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setBadNumFail: function (val) {
      // console.log('fail')
      this.status = '設定失敗'

      for (let i = 0; i < this.rows.length; i++) {
        let record = this.rows[i]
        if (record._id === val._id) {
          record.badNum = val.badNum
          break
        }
      }
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    getTotalTargetCountSuccess: function (val) {
      var totalWarehousing = 0
      var totalBadNum = 0
      var totalTargetCount = 0
      var machineID = ''
      // console.log('getTotalTargetCountSuccess')
      val.forEach(elm => {
        machineID = elm.machineID
        // totalWarehousing += elm.warehousing
        // totalBadNum += elm.totalTargetCount - elm.warehousing
        // totalTargetCount += elm.totalTargetCount
        this.rows.forEach((row, idx, arr) => {
          if ((elm.machineID === row.machineID) && (elm.orderNumber === row.orderNumber) && (row.warehousing > -1)) {
            // // console.log(row.orderNumber)
            totalBadNum += elm.totalTargetCount - elm.warehousing
            totalTargetCount += elm.totalTargetCount
            totalWarehousing += parseInt(row.warehousing || '0')
            Vue.set(arr[idx], 'totalTargetCount', elm.totalTargetCount)
            // Vue.set(arr[idx], 'targetCount', elm.totalTargetCount)
            // Vue.set(arr[idx], 'warehousing', elm.warehousing)
            // Vue.set(arr[idx], 'badNum', elm.totalTargetCount - elm.warehousing)
            Vue.set(arr[idx], 'badNum', elm.totalTargetCount - row.warehousing)
            var badRate = 0
            if (elm.totalTargetCount > 0) {
              badRate = ((elm.totalTargetCount - row.warehousing) / elm.totalTargetCount * 100).toFixed(2)
            }
            Vue.set(arr[idx], 'badRate', badRate)
          }
        })
      })
      this.rows.forEach((row, idx, arr) => {
        if ((row.machineLabel === machineID) && (row.machineID === '合計')) {
          // Vue.set(arr[idx], 'warehousing', totalWarehousing)
          Vue.set(arr[idx], 'badNum', totalBadNum)
          // Vue.set(arr[idx], 'targetCount', totalTargetCount)
          Vue.set(arr[idx], 'totalTargetCount', totalTargetCount)
          var totalBadRate = 0
          if (totalTargetCount > 0) {
            // // console.log(totalTargetCount)
            // console.log(totalBadRate)
            totalBadRate = ((totalTargetCount - totalWarehousing) / totalTargetCount * 100).toFixed(2)
          }
          Vue.set(arr[idx], 'badRate', totalBadRate)
        }
      })
    }
  },
  mounted () {
    this.sortList.splice(0, this.sortList.length)
    this.sortList.splice(this.sortList.length, 0, {
      label: ' ',
      value: ''
    })
    this.columns.forEach(column => {
      this.sortList.splice(this.sortList.length, 0, {
        label: column.label,
        value: column.name
      })
    })
    this.sort2 = this.sortList[0].value
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    this.updateRenderTable()
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
      this.getValidCalendar(from, to)
      renderTable(this.rows, this.machineIDArr, from, to, this.$socket, this.totalWorkDays, this.hoursADay, this.totalWorkHours, Vue.set, this.$q.loading)
      this.totalDays = moment(this.dateTo).diff(moment(this.dateFrom), 'days') + 1
      this.totalHours = this.hoursADay * this.totalDays
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
    rowclick (event) {
    },
    refresh (done) {
      setTimeout(() => {
        done()
      }, 3000)
    },
    range: function (start, end) {
      var array = []
      var j = 0
      for (var i = start; i <= end; i++, j++) {
        array[j] = i
      }
      return array
    },
    changeWarehousing (newData, cell) {
      this.rows[cell.row.__index].warehousing = cell.value
      this.$socket.emit('setWarehousingPeriodlyReport', this.rows[cell.row.__index])
      this.status = '更新入庫數量中...'
    },
    changeBadNum (cell) {
      this.rows[cell.row.__index].badNum = cell.value
      this.$socket.emit('setBadNumPeriodlyReport', this.rows[cell.row.__index])
      this.status = '更新不良數量中...'
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
      // console.log('tttttttttt')
      // console.log(arr)
      // console.log(arr)
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
    getValidCalendar (from, to) {
      $.get('/api/getValidCalendar/' + from + '/' + to, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else {
          // console.log('getValidCalendar')
          // console.log(results.data)
          this.calendar.splice(0, this.calendar.length)
          results.data.forEach(elm => {
            this.calendar.splice(this.calendar.length, 0, elm)
          })
        }
      })
    }
  }
}

function renderTable (rows, departmentID, from, to, socket, totalWorkDays, hoursADay, totalWorkHours, fun, loading) {
  rows.splice(0, rows.length)
  rows.length = 0
  var recordsMachine
  // console.log('getPeriodMachineRecords')
  // console.log(departmentID)
  $.get('/api/getPeriodMachineRecords/' + departmentID + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      loading.hide()
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
      loading.hide()
    } else {
      rows.splice(0, rows.length)
      rows.length = 0
      recordsMachine = results.data
      var orderArr = {}
      var objKeys = Object.keys(recordsMachine)
      objKeys.sort(function (a, b) {
        return a > b ? 1 : -1
      })
      // // console.log(objKeys)
      objKeys.forEach(objKey => {
        var records = recordsMachine[objKey]
        orderArr[objKey] = []
        for (var record in records) {
          orderArr[objKey].splice(orderArr[objKey].length, 0, (records[record])['orderNumber'])
          // // console.log(record)
          rows.splice(rows.length, 0, {
            machineLabel: (records[record])['machineID'],
            machineID: (records[record])['machineID'],
            totalAlm: (records[record])['totalAlm'],
            orderNumber: (records[record])['orderNumber'],
            product: (records[record])['product'],
            cavities: (records[record])['cavities'],
            // sortStartTime: (records[record])['sortStartTime'],
            // startTime: moment((records[record])['startTime']).format('M/DD HH:mm:ss'), // moment(record['trigTime']).format('M/DD HH:mm:ss')
            // endTime: moment((records[record])['endTime']).format('M/DD HH:mm:ss'),
            startTime: (Math.round(Number(moment((records[record])['startTime']).format('SSS')) / 100) >= 10) ? (moment((records[record])['startTime']).add(1, 'seconds').format('MM-DD HH:mm:ss') + '.0') : (moment((records[record])['startTime']).format('MM-DD HH:mm:ss') + '.' + Math.round(Number(moment((records[record])['startTime']).format('SSS')) / 100)),
            endTime: (Math.round(Number(moment((records[record])['endTime']).format('SSS')) / 100) >= 10) ? (moment((records[record])['endTime']).add(1, 'seconds').format('MM-DD HH:mm:ss') + '.0') : (moment((records[record])['endTime']).format('MM-DD HH:mm:ss') + '.' + Math.round(Number(moment((records[record])['endTime']).format('SSS')) / 100)),
            duration: formatSecond((records[record])['duration'] / 1000), // 排班工作時間累計 formatSecond(record['duration'] / 1000),
            moldCount: (records[record])['moldCount'],
            targetCount: (records[record])['targetCount'],
            warehousing: (records[record])['warehousing'] || 0,
            badNum: (records[record])['badNum'] || 0, // (records[record])['targetCount'] - (records[record])['warehousing'], (records[record])['badNum'],
            badRate: `${Math.round((records[record]['badRate'] || 0) * 1000) / 10}%`, // badRate, (records[record])['badRate'],
            standard: (records[record])['standard'],
            min: (Math.round((records[record])['min'] * 10) / 10),
            average: Math.round((records[record])['average'] / 100) / 10,
            performance: Math.round((records[record])['performance'] * 1000000) / 10,
            deadline: ((records[record])['deadline'].indexOf('/Date(') > -1) ? moment(parseInt((records[record])['deadline'].split('/Date(')[1].split(')/')[0])).format('YYYY/M/DD') : (records[record])['deadline'],
            lastTrigTime: (records[record])['endTime'],
            lastID: (records[record])['lastID'],
            totalTargetCount: 0,
            durationOrigin: (records[record])['duration'],
            trigTimeFullType: moment((records[record])['startTime']).format('YYYY/MM/DD HH:mm:ss'),
            lastTrigTimeFullType: moment((records[record])['endTime']).format('YYYY/MM/DD HH:mm:ss'),
            tgtfinishTimeFullType: moment((records[record])['endTime']).format('YYYY/MM/DD HH:mm:ss')
          })
        }
        if (records.length > 0) {
          var totalDur = (records.reduce(function (previousValue, currentValue, index, array) {
            return previousValue + currentValue.duration
          }, 0))
          rows.splice(rows.length, 0, {
            machineLabel: (records[0])['machineID'],
            machineID: '合計',
            totalAlm: (records.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.totalAlm
            }, 0)),
            product: '-',
            cavities: '-',
            startTime: '稼動率', // moment(record['trigTime']).format('M/DD HH:mm:ss')
            endTime: `${Math.round(totalDur * 10 * 100 / (totalWorkHours[0] * 3600 * 1000)) / 10}%`, // '',
            duration: formatSecond(totalDur / 1000), // 排班工作時間累計 formatSecond(record['duration'] / 1000),
            moldCount: (records.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.moldCount
            }, 0)),
            targetCount: (records.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.targetCount
            }, 0)),
            warehousing: (records.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.warehousing || 0
            }, 0)),
            badNum: (records.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.targetCount
            }, 0) - records.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.warehousing || 0
            }, 0)),
            badRate: `${Math.round((records.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.warehousing || 0
            }, 0) > 0 ? (records.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + currentValue.targetCount
              }, 0) - records.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + currentValue.warehousing || 0
              }, 0)) / records.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + currentValue.warehousing || 0
              }, 0) : 0) * 1000) / 10}%`, // badRate, // (records[record])['badRate'],
            standard: '-',
            min: '-',
            average: '-',
            performance: '-',
            deadline: '-',
            lastTrigTime: '-',
            lastID: '-',
            totalTargetCount: 0,
            durationOrigin: totalDur
          })
        }
        /* var o = {
          machineID: objKey,
          orderArr: orderArr[objKey]
        }
        socket.emit('getTotalTargetCount', o) 暫時移除 */
        // console.log('getTotalTargetCount')
      })
      loading.hide()
      // getWorkDays(objKeys, from, to, rows, totalWorkDays, hoursADay, totalWorkHours, fun)
      var arr = []
      arr.splice(arr.length, 0, {
        key: 'machineLabel',
        asc: true
      })
      arr.splice(arr.length, 0, {
        key: 'trigTimeFullType',
        asc: true
      })
      rows.sort((a, b) => {
        if (arr[0].asc) {
          return recursiveSortAscending(arr, 0, a, b)
        } else {
          return recursiveSortDescending(arr, 0, a, b)
        }
      })
    }
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
/* function getWorkDays (machineID, from, to, rows, totalWorkDays, hoursADay, totalWorkHours, fun) {
  $.get('/api/getWorkDays/' + machineID + '/' + from + '/' + to, {}, (results) => {
    var retData = results.data
    var valuesArr = Object.values(retData)
    var days = Math.max(...valuesArr)
    totalWorkDays.splice(0, totalWorkDays.length)
    totalWorkDays.splice(totalWorkDays.length, 0, days)
    totalWorkHours.splice(0, totalWorkHours.length)
    totalWorkHours.splice(totalWorkHours.length, 0, days * hoursADay)
    var partRows = rows.filter(row => {
      return row.startTime === '稼動率'
    })
    rows.filter(row => {
      if (row.startTime === '稼動率') {
        var workSecond = retData[row.machineLabel] * 24 * 3600
        var opSecond = row.durationOrigin
        fun(row, 'endTime', `${Math.round(opSecond / workSecond) / 10}%`)
      }
    })
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
