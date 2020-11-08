<template>
<div>
  <section class="content">
    <div class="row center-block">
      <h5>機台監控</h5>
    </div>
    <div class="center-block">
    </div>
    <tr>
      <td style=" width:2%;"></td>
      <td style=" width:15%;">
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
          <q-table
            :data="rows"
            :columns="columns"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
            separator="cell"
            row-key="name"
          >
            <q-td slot="body-cell-statusName" slot-scope="cell">
              <div v-if="cell.row.statusName === '全自動'">
                <!--<i class="fa fa-star" style="font-size:36px"></i>-->
                <q-icon name="remove_red_eye"  color="green"/>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '半自動'">
                <i class="fa fa-star-half-full" style="font-size:36px"></i>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '手動'">
                <i class="fa fa-hand-paper-o" style="font-size:36px;color:red"></i>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '關機'">
                <i class="fa fa-power-off" style="font-size:36px"></i>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '訊號異常'">
                <i class="fa fa-warning" style="font-size:36px"></i>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '系統啟動'">
                <i class="fa fa-chain" style="font-size:36px;"></i>
                {{cell.row.statusName}}
                </div>
              <div v-else>
                {{cell.row.statusName}}
              </div>
            </q-td>
          </q-table>
        </table>
      </td>
      <td style=" width:2%;"></td>
      <td style=" width:50%;">
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
          <q-table
          :data="rows1"
          :columns="columns1"
          :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
          separator="cell"
            row-key="name"
          >
          <q-td slot="body-cell-machineID" slot-scope="cell">
            <q-btn :label="cell.row.machineID" v-for="modal in types" :key="modal.label" @click="openModal(cell.row.machineID)" v-ripple.mat color="orange" text-color="dark">
            </q-btn>
          </q-td>
          <q-td slot="body-cell-machineStatus" slot-scope="cell">
            <q-icon v-if="cell.row.machineStatus === '全自動'" name="remove_red_eye"  color="green"/>
            <q-icon v-else-if="cell.row.machineStatus === '半自動'" name="remove_red_eye"  color="red"/>
            <q-icon v-else-if="cell.row.machineStatus === '手動'" name="remove_red_eye"  color="yellow"/>
            <q-icon v-else-if="cell.row.machineStatus === '關機'" name="remove_red_eye"  color="blue"/>
            <q-icon v-else name="remove_red_eye"  color="black"/>
          </q-td>
      <!--<template slot="col-machineStatus" slot-scope="cell">
      <div v-if="cell.row.machineStatus === '全自動'">
        <i class="fa fa-star" style="font-size:36px"></i>
      </div>
      <div v-else-if="cell.row.machineStatus === '半自動'">
        <i class="fa fa-star-half-full" style="font-size:36px"></i>
      </div>
      <div v-else-if="cell.row.machineStatus === '手動'">
        <i class="fa fa-hand-paper-o" style="font-size:36px;color:red"></i>
      </div>
      <div v-else-if="cell.row.machineStatus === '關機'">
        <i class="fa fa-power-off" style="font-size:36px"></i>
      </div>
      <div v-else>
        <i class="fa fa-chain" style="font-size:36px;"></i>
      </div>
      </template>-->
          </q-table>
        </table>
      </td>
      <td style="width:100px;"></td>
    </tr>
  </section>
  <q-modal ref="basicModal" :position="position" :content-css="{padding: '300px', maxWidth: '50%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
    <h4>{{id}}</h4>
    <tr>
      <td style=" width:30%;">
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
          <q-table
            :data="rows2"
            :columns="columns2"
            :config="config"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
            separator="cell"
            row-key="name"
          >
          </q-table>
        </table>
      </td>
      <td style=" width:2%;">
      </td>
      <td style=" width:50%;">
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
          <q-table
            :data="rows3"
            :columns="columns3"
            :config="config"
          :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
          separator="cell"
            row-key="name"
          >
          </q-table>
        </table>
        <div class="app" style=" width:100%;">
          <div v-if="show">
            <!--<component :is="view"></component>-->
            <pie-chart :label="myChart2.labels" :data="temp" :color="producePieColor" :options="myChart2Options"></pie-chart>
          </div>
        </div>
        <div id="flot-memo" style="text-align:center;height:30px;width:250px;height:20px;text-align:center;margin:0 auto"></div>
      </td>
    </tr>
    <tr>
        <q-btn v-if="show" color="primary" @click="showClose()">顯示</q-btn>
        <q-btn v-else color="primary" @click="showClose()">隱藏</q-btn>
        <q-btn color="primary" @click="$refs.basicModal.hide()">關閉</q-btn>
    </tr>
    </q-modal-layout>
  </q-modal>
</div>
</template>

<script>
import $ from 'jquery'
// import moment from 'moment'
import 'moment-duration-format'
// import orderNumber from './OrderNumberEdit'
// import moldNum from './MoldNumberEdit'
// outside of a Vue file
// import { Dialog } from 'quasar'
// import Chart from 'chart.js'
// import Pie from './Pie.js'
// import { Line } from 'vue-chartjs'
import {
  Dialog,
  QBtn,
  QIcon,
  QModal,
  QModalLayout,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QList,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'
export default {
  name: 'Tables1',
  // extends: Line,
  data: function () {
    return {
      view: '',
      show: false,
      pageID: '',
      temp: [],
      myChart2: [],
      producePieColor: ['#00D8FF', '#DD1B16'],
      // myChart2: { labels: [], datasets: [] },
      myChart2Options: {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
          mode: 'percentage',
          precision: 1
        }
      },
      serverPagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      flotcontainerAchieve: [],
      flotcontainerAchieveLabel: [],
      btnKey: undefined,
      id: '1A01',
      position: 'right',
      types: [
        {
          label: 'Basic',
          ref: 'basicModal'
        }
      ],
      customDialogModel: undefined,
      name: undefined,
      columns: [
        {
          label: '成型一課',
          field: 'statusName',
          name: 'statusName',
          slot: 'col-statusName',
          width: '35%',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '數量',
          field: 'total',
          name: 'total',
          slot: 'col-total',
          width: '15%',
          filter: false,
          style: {color: 'purple'}
        }
      ],
      rows: [],
      columns1: [
        {
          label: '機台',
          field: 'machineID',
          name: 'machineID',
          slot: 'col-machineID',
          width: '20%',
          filter: false,
          style: {color: 'purple'},
          position: 'absolute',
          vertical: 'middle'
        },
        {
          label: '狀態',
          field: 'machineStatus',
          name: 'machineStatus',
          slot: 'col-machineStatus',
          width: '15%',
          filter: false,
          style: {color: 'purple'}
          // format: val => `${val}%`,
          /* format (value) {
            if (value === '全自動') {
              return '<q-icon name="remove_red_eye"  color="green"/>'// '<i class="fa fa-star" style="font-size:36px"></i>'
            } else if (value === '半自動') {
              return '<i class="fa fa-star-half-full" style="font-size:36px"></i>'
            } else if (value === '手動') {
              return '<i class="fa fa-hand-paper-o" style="font-size:36px;color:red"></i>'
            } else if (value === '關機') {
              return '<i class="fa fa-power-off" style="font-size:36px"></i>'
            } else {
              return '<i class="fa fa-chain" style="font-size:36px;"></i>'
            }
          } */
        },
        {
          label: '警報',
          field: 'totalAlm',
          name: 'totalAlm',
          slot: 'col-totalAlm',
          width: '15%',
          filter: false,
          style: {color: 'purple'}
          /* format (value) {
            return '<div><q-checkbox v-model="cell.data" @blur="showInfor(cell)"/><div'
          } */
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          slot: 'col-product',
          width: '20%',
          filter: false,
          sort: false,
          style: {color: 'gray'}
        }
      ],
      rows1: [],
      columns3: [
        {
          label: '名稱',
          field: 'name',
          name: 'name',
          slot: 'col-name',
          width: '10px',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '當前生產',
          field: 'current',
          name: 'current',
          slot: 'col-current',
          width: '10px',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '下一個',
          field: 'next',
          name: 'next',
          slot: 'col-next',
          width: '10px',
          filter: false,
          style: {color: 'purple'}
        }
      ],
      columns2: [
        {
          label: '名稱',
          field: 'name',
          name: 'name',
          slot: 'col-name',
          width: '50%',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '',
          field: 'info',
          name: 'info',
          slot: 'col-info',
          width: '50%',
          filter: false,
          style: {color: 'purple'}
        }
      ],
      rows3: [],
      rows2: [],
      config: {
        noHeader: false,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        responsive: false,
        messages: {
          noData: '沒有資料可供顯示.',
          noDataAfterFiltering: '沒有資料可供顯示. 請重新檢視您的搜尋條件.'
        },
        pagination: {
          rowsPerPage: 20,
          options: [20, 50, 100, 200, 500]
        }
      },
      config3: {
        noHeader: false,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        responsive: false,
        messages: {
          noData: '沒有資料可供顯示.',
          noDataAfterFiltering: '沒有資料可供顯示. 請重新檢視您的搜尋條件.'
        }
      },
      intervalID: undefined
    }
  },
  created () {
    renderTable(this.$set, this.rows1, this.columns1, '成型一課')
    createRows(this.$set, this.rows, this.columns, '成型一課')
    this.$socket.emit('commCommand', 'getUniqueID')
    /* setInterval(() => {
      renderTable(this.$set, this.rows1, this.columns1, '成型一課')
    }, 20000) */
    this.intervalID = setInterval(() => {
      createRows(this.$set, this.rows, this.columns, '成型一課')
    }, 20000)
  },
  beforeDestroy () {
    this.$socket.emit('deleteClientMonitor', this.pageID)
    clearInterval(this.intervalID)
  },
  computed: {
  },
  watch: {
    flotcontainerAchieve: function () {
      this.$nextTick(() => {
        var Num0 = this.flotcontainerAchieve[0].data
        var Num1 = this.flotcontainerAchieve[1].data - this.flotcontainerAchieve[0].data
        this.myChart2.length = 0
        this.myChart2.splice(0, 0, {
          labels: ['已生產', '未生產'],
          datasets: [
            {
              backgroundColor: ['#00D8FF', '#DD1B16'],
              data: [Num0, Num1]
            }
          ]
        })
        this.temp = [Num0, Num1]
        this.show = true
      })
    }
    /* rows3: function () {
      this.$nextTick(() => {
        var arrIndex = 0
        this.rows3.filter((val, idx) => {
          arrIndex = idx
          return val['_id'] === 'predMoldCnt'
        })
        this.$set(this.myChart2[0], 'datasets', {
          // label: 'three', // labelArray[0],
          backgroundColor: ['#00D8FF', '#DD1B16'],
          data: [this.rows3[arrIndex + 1].current, (this.rows3[arrIndex].current - this.rows3[arrIndex + 1].current)]
        })
      })
    } */
  },
  sockets: {
    'showIncrease': function (val) {
      this.rows1.forEach(rowData => {
        if (rowData['machineID'] === '1A01') {
          rowData['totalAlm'] = val
        }
      })
    },
    'showIncreaseOther': function (val) {
      this.rows1.forEach(rowData => {
        if (rowData['machineID'] !== '1A01') {
          rowData['totalAlm'] = val
        }
      })
    },
    'showMachineSts': function (val) {
      var arrayIndex = 0
      console.log(this.rows1)
      if ((val != null) && (this.rows1 !== undefined)) {
        this.rows1.find(function (element, idx, arr) {
          console.log(arrayIndex)
          console.log(arr[arrayIndex])
          arrayIndex = idx
          if (element['machineID'] === val['machineID']) {
            arr[arrayIndex]._id = val['_id']
            arr[arrayIndex].machineStatus = val['machineStatusType']
            console.log(val.hasOwnProperty('totalAlm'))
            if (val.hasOwnProperty('totalAlm')) {
              arr[arrayIndex].totalAlm = val['totalAlm']
            } else {
              arr[arrayIndex].totalAlm = 0
            }
            if (val.hasOwnProperty('product')) {
              arr[arrayIndex].product = val['product']
            } else {
              arr[arrayIndex].product = ''
            }
            console.log(arrayIndex)
            console.log('this.myChart2')
          }
        })
        if (val['machineID'] === '1A01') {
          console.log(val)
        }
      }
    },
    'getUniqueID': function (val) {
      if (val !== '') {
        this.pageID = val
        this.$socket.emit('addClientMonitor', val)
      }
    }
  },
  mounted () {
  },
  methods: {
    showClose () {
      if (this.show) {
        this.show = false
        this.view = ''
      } else {
        this.show = true
        this.view = 'test'
      }
    },
    openModal (cellVal) {
      this.id = cellVal
      this.$nextTick(() => {
        updateModal(this.$set, this.rows3, this.columns3, this.id, this.flotcontainerAchieve, this.flotcontainerAchieveLabel)
        updateModalHWCfg(this.$set, this.rows2, this.columns2, this.id)
        var t = this.rows3.filter((val, idx, arr) => {
          if (val['_id'] === 'predMoldCnt') {
            this.myChart2.datasets = [
              {
                backgroundColor: ['#00D8FF', '#DD1B16'],
                data: [arr[idx + 1]['current'], (arr[idx]['current'] - arr[idx + 1]['current'])]
              }
            ]
            // console.log(arr[idx])
            // var itbenormalobject = JSON.parse(JSON.stringify(val))
            // console.log(itbenormalobject)
            // console.log(JSON.stringify(val))
          }
          return val['_id'] === 'predMoldCnt'
        })
        console.log(t)
        this.myChart2.labels = ['已生產模數', '未生產模數']
        this.$refs.basicModal.show()
      })
    },
    onOk () {
    },
    onCancel () {
    },
    onShow () {
    },
    onHide () {
    },
    handler (cellval) {
      console.log(cellval.data)
      /* this.$q.dialog({
        title: 'Options',
        message: 'Modern front-end framework on steroids.',
        options: {
          type: 'checkbox',
          model: [],
          items: [
            {label: 'Option 1', value: 'opt1', color: 'secondary'},
            {label: 'Option 2', value: 'opt2'},
            {label: 'Option 3', value: 'opt3'}
          ]
        },
        cancel: true,
        preventClose: true,
        color: 'secondary'
      }).then(data => {
        this.$q.notify(`You selected: `) // ${JSON.stringify(data)}
      }) */
    },
    showDialog (cellval) {
      Dialog.create({
        title: 'Some title',
        message: 'Some message',
        buttons: [
          'Cancel',
          {
            label: 'Empty Trash Bin',
            handler () {
            // "this" refers to the scope of this method only,
            // not your Vue component

            // prints: undefined
            // console.log(this.variable)
            }
          }
        ]
      })
    },
    sel () {
    }
  },
  components: {
    QBtn,
    QIcon,
    QModal,
    QModalLayout,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QList,
    QItem,
    QItemSide,
    QItemMain
  }
}

function renderTable (fun, rows, columns, department) {
  var from = '1A01'
  var to = '1A09'
  $.get('/api/getMachineSts/' + from + '/' + to, {}, (results) => {
  // $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      console.log('Empty~')
    } else {
      var records = results.data
      var size = rows.length
      console.log(size)
      rows.length = 0
      // var index = 0
      // var col = columns[index++].field
      records.forEach(record => {
        rows.splice(0, 0, {
          _id: record['_id'],
          machineID: record['machineID'],
          machineStatus: record['STS'],
          totalAlm: record['totalAlm'],
          product: record['product']
        })
      })
      rows.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : -1
      })
    }
  })
}
function createRows (fun, rows, columns, department) {
  rows.length = 0
  console.log(department)
  $.get('/api/updateMonitorHWCfg/' + department, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      console.log('Empty~')
    } else {
      var record = results.data
      rows.splice(rows.length, 0, {
        'statusName': '成型機共',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '自動生產',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '全自動',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '半自動',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '手動',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '關機',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '當日警報',
        'total': 0
      })
      rows.splice(rows.length, 0, {
        'statusName': '訊號異常',
        'total': 0
      })
      rows.splice(rows.length, 0, {
        'statusName': '系統啟動',
        'total': 0
      })
    }
  })
}
function updateModalHWCfg (fun, rows, columns, machineID) {
  rows.length = 0
  var labelObj = {
    'machineID': '機台編號',
    'dailyAlarm': '當日警報數',
    'monthlyAlarm': '當月警報數',
    'monthlyUtilization': '當月稼動率',
    'prevMonthlyUtilization': '上個月稼動率'
  }
  var objKeys = Object.keys(labelObj)
  objKeys.forEach(elm => {
    rows.splice(rows.length, 0, {
      _id: elm,
      name: labelObj[elm],
      info: ''
    })
  })
  /* rows.splice = function (n,m, obj)
  {
  }  ; */
  /* rows.splice(0, 0, {
    _id: 'machineID',
    name: '機台編號',
    info: machineID
  }) */
  $.get('/api/updateModalHWCfg/' + machineID, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      console.log('Empty~')
    } else {
      var record = results.data
      rows.splice(1, 0, {
        _id: 'brand',
        name: '廠牌型號',
        info: record['brand']
      })
    }
  })
  /* rows.splice(2, 0, {
    _id: 'dailyAlarm',
    name: '當日警報數',
    info: ''
  })
  rows.splice(3, 0, {
    _id: 'monthlyAlarm',
    name: '當月警報數',
    info: ''
  })
  rows.splice(4, 0, {
    _id: 'monthlyUtilization',
    name: '當月稼動率',
    info: ''
  })
  rows.splice(5, 0, {
    _id: 'prevMonthlyUtilization',
    name: '上個月稼動率',
    info: ''
  }) */
}
function updateModal (fun, rows, columns, machineID, flotcontainerAchieve, flotcontainerAchieveLabel) {
  rows.length = 0
  var achieveRateIndex = rows.length
  var labelObj = {
    'orderNumber': '派單號碼',
    'product': '成品料號',
    'prodName': '品名',
    'moldNum': '模具編號',
    'cavities': '穴數',
    'standard': '標準週期',
    'average': '平均週期',
    'min': '最短週期',
    'predMoldCnt': '派單模數',
    'moldCount': '已生產模',
    'achieveRate': '達成率',
    'predStart': '(預計)開',
    'deadline': '預計完成時間 關',
    'historyFailRate': '歷史不良'
  }
  var arr = Object.keys(labelObj)
  arr.forEach(function (elm) {
    rows.splice(rows.length, 0, {
      _id: elm,
      current: '',
      name: labelObj[elm]
    })
    if (elm === 'moldCount') {
      achieveRateIndex = rows.length
    }
  })
  /* rows.splice(rows.length, 0, {
    _id: 'orderNumber',
    current: '',
    name: '派單號碼'
  })
  rows.splice(rows.length, 0, {
    _id: 'product',
    current: '',
    name: '成品料號'
  })
  rows.splice(rows.length, 0, {
    _id: 'prodName',
    current: '',
    name: '品名'
  })
  rows.splice(rows.length, 0, {
    _id: 'moldNum',
    current: '',
    name: '模具編號'
  })
  rows.splice(rows.length, 0, {
    _id: 'cavities',
    current: '',
    name: '穴數'
  })
  rows.splice(rows.length, 0, {
    _id: 'standard',
    current: '',
    name: '標準週期'
  })
  rows.splice(rows.length, 0, {
    _id: 'average',
    current: '',
    name: '平均週期'
  })
  rows.splice(rows.length, 0, {
    _id: 'min',
    current: '',
    name: '最短週期'
  })
  rows.splice(rows.length, 0, {
    _id: 'predMoldCnt',
    current: 0,
    name: '派單模數'
  })
  rows.splice(rows.length, 0, {
    _id: 'moldCount',
    current: 0,
    name: '已生產模'
  })
  var achieveRateIndex = rows.length
  rows.splice(rows.length, 0, {
    _id: 'achieveRate',
    current: '',
    name: '達成率'
  })
  rows.splice(rows.length, 0, {
    _id: 'predStart',
    current: '',
    name: '(預計)開'
  })
  rows.splice(rows.length, 0, {
    _id: 'deadline',
    current: '',
    name: '預計完成時間 關'
  })
  rows.splice(rows.length, 0, {
    _id: 'historyFailRate',
    current: '',
    name: '歷史不良'
  }) */
  $.get('/api/getMachineCurrInfo/' + machineID, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      console.log('Empty~')
    } else {
      var record = results.data
      for (let index = 0; index < rows.length; index++) {
        fun(rows[index], 'current', record[rows[index]._id])
      }
      var achieveRate = Math.floor(100 * rows[achieveRateIndex - 1].current / rows[achieveRateIndex - 2].current)
      fun(rows[achieveRateIndex], 'current', (achieveRate + '%'))
      console.log(achieveRate)
      flotcontainerAchieve.length = 0
      flotcontainerAchieveLabel.length = 0
      flotcontainerAchieveLabel = ['已生產', '未生產']
      flotcontainerAchieve.splice(0, 0, {
        data: rows[achieveRateIndex - 1].current
      })
      flotcontainerAchieve.splice(1, 0, {
        data: rows[achieveRateIndex - 2].current
      })
      console.log(flotcontainerAchieveLabel)
      console.log(flotcontainerAchieve)
    }
  })
}
</script>
