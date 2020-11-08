<template>
<div>
  <section class="content">
    <div class="row center-block">
      <h5>行事曆</h5>
    </div>
    <div class="center-block">
    </div>
    <tr>
      <td>
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:50%;">
          <q-table
            :data="rows"
            :columns="columns"
            :config="config"
          > 
          
            <template slot="col-statusName" slot-scope="cell">
      <div v-if="cell.row.statusName === '全自動'">
        <i class="fa fa-star" style="font-size:36px"></i>
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
      <div v-else>
        <i class="fa fa-chain" style="font-size:36px;"></i>
        {{cell.row.statusName}}
      </div>
      </template>
      </q-table>
        </table>
      </td>
      <td>
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
          <q-table
          :data="rows1"
          :columns="columns1"
          :config="config"
          > 
          <template slot="col-machineID" slot-scope="cell">                  
            <q-btn label=cell.row.machineID v-for="modal in types" :key="modal" @click="openModal(cell.row.machineID)" v-ripple.mat>
              {{cell.row.machineID}}
            </q-btn>
          </template>
      <template slot="col-totalAlm" slot-scope="cell">
      <div v-if="cell.row.machineStatus === '全自動'">
        <i class="fa fa-star" style="font-size:36px"></i>
        Sayuri
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
      </template>

      <template>
  <q-dialog
    v-model="customDialogModel"
    stack-buttons
    prevent-close
    @ok="onOk"
    @cancel="onCancel"
    @show="onShow"
    @hide="onHide"
  >
    <!-- This or use "title" prop on <q-dialog> -->
    <span slot="title">Favorite Superhero</span>

    <!-- This or use "message" prop on <q-dialog> -->
    <span slot="message">What is your superhero of choice?</span>

    <div slot="body">
      <q-field
        icon="account_circle"
        helper="We need your name so we can send you to the movies."
        label="Your name"
        :label-width="3"
      >
        <q-input v-model="name" />
      </q-field>
    </div>

    <template slot="buttons" slot-scope="props">
      <q-btn color="primary" label="Choose Superman" @click="choose(props.ok, 'Superman')" />
      <q-btn color="black" label="Choose Batman" @click="choose(props.ok, 'Batman')" />
      <q-btn color="negative" label="Choose Spiderman" @click="choose(props.ok, 'Spiderman')" />
      <q-btn flat label="No thanks" @click="props.cancel" />
    </template>
  </q-dialog>
</template>
          </q-table>
        </table>
      </td>
    </tr> 
  </section>
    <q-modal ref="basicModal" :position="position" :content-css="{padding: '50px', minWidth: '50vw'}">
      <h4>{{id}}</h4>
      <tr>
        <td style=" width:30%;">
      <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
        <q-table
          :data="rows2"
          :columns="columns2"
          :config="config"
        >
        </q-table>
      </table>
      </td>
      <td style=" width:5%;">
      </td>
      <td   style=" width:50%;">
      <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
        <q-table
          :data="rows3"
          :columns="columns3"
          :config="config"
        >
        </q-table>
      </table>
      </td>
      </tr>
      <q-btn color="primary" @click="$refs.basicModal.close()">Close</q-btn>
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
  data: function () {
    return {
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
          slot: 'col-statusName',
          width: '35%',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '數量',
          field: 'total',
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
          slot: 'col-machineID',
          width: '100%',
          filter: false,
          style: {color: 'purple'},
          position: 'absolute',
          vertical: 'middle'
        },
        {
          label: '狀態',
          field: 'machineStatus',
          slot: 'col-machineStatus',
          width: '30%',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '警報',
          field: 'totalAlm',
          slot: 'col-totalAlm',
          width: '30%',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '成品料號',
          field: 'product',
          slot: 'col-product',
          width: '45%',
          filter: false,
          sort: true,
          style: {color: 'gray'}
        }
      ],
      rows1: [],
      columns3: [
        {
          label: '名稱',
          field: 'name',
          slot: 'col-name',
          width: '10px',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '當前生產',
          field: 'current',
          slot: 'col-current',
          width: '10px',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '下一個',
          field: 'next',
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
          slot: 'col-name',
          width: '50%',
          filter: false,
          style: {color: 'purple'}
        },
        {
          label: '',
          field: 'information',
          slot: 'col-information',
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
      }
    }
  },
  created () {
    renderTable(this.$set, this.rows1, this.columns1, '成型一課')
    createRows(this.$set, this.rows, this.columns, '成型一課')
  },
  computed: {
  },
  watch: {
  },
  sockets: {
  },
  mounted () {
  },
  methods: {
    openModal (cellVal) {
      console.log(cellVal)
      this.id = cellVal
      this.$nextTick(() => {
        updateModal(this.$set, this.rows3, this.columns3, this.id)
        updateModalHWCfg(this.$set, this.rows2, this.columns2, this.id)
        this.$refs.basicModal.open()
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
    // "this" here refers to current component

    // prints: "alright"
    // console.log(this.variable)

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
  // init the records in the rows
  // rows.splice(0, rows.length)
  var from = '1A01'
  var to = '1A09'
  $.get('/api/getMachineSts/' + from + '/' + to, {}, (results) => {
  // $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    }
    else if (results.data.length === 0) {
      // alert('沒有機台資料')
      console.log('Empty~')
    }
    else {
      var records = results.data
      var size = rows.length
      console.log(size)
      rows.length = 0
      // var index = 0
      // var col = columns[index++].field
      records.forEach(record => {
        rows.splice(0, 0, {
          _id: record['_id'],
          machineID: record['Machine'],
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
  rows.splice(0, 0, {
    'statusName': '成型機共',
    'total': 0
  })
  rows.splice(1, 0, {
    'statusName': '自動生產',
    'total': 0
  })
  rows.splice(2, 0, {
    'statusName': '全自動',
    'total': 0
  })
  rows.splice(3, 0, {
    'statusName': '半自動',
    'total': 0
  })
  rows.splice(4, 0, {
    'statusName': '手動',
    'total': 0
  })
  rows.splice(5, 0, {
    'statusName': '停機',
    'total': 0
  })
  rows.splice(6, 0, {
    'statusName': '當日警報',
    'total': 0
  })
  rows.splice(7, 0, {
    'statusName': '訊號異常',
    'total': 0
  })
}
function updateModalHWCfg (fun, rows, columns, machineID) {
  rows.length = 0
  rows.splice(0, 0, {
    _id: 'machineID',
    name: '機台編號',
    info: ''
  })
  rows.splice(1, 0, {
    _id: 'brand',
    name: '廠牌型號',
    info: ''
  })
  rows.splice(2, 0, {
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
  })
}
function updateModal (fun, rows, columns, machineID) {
  rows.length = 0
  rows.splice(0, 0, {
    _id: 'orderNumber',
    name: '派單號碼',
    current: ''
  })
  rows.splice(1, 0, {
    _id: 'product',
    name: '成品料號',
    current: ''
  })
  rows.splice(2, 0, {
    _id: 'prodName',
    name: '品名',
    current: ''
  })
  rows.splice(3, 0, {
    _id: 'moldNum',
    name: '模具編號',
    current: ''
  })
  rows.splice(4, 0, {
    _id: 'cavities',
    name: '穴數',
    current: ''
  })
  rows.splice(5, 0, {
    _id: 'standard',
    name: '標準週期',
    current: ''
  })
  rows.splice(6, 0, {
    _id: 'average',
    name: '平均週期',
    current: ''
  })
  rows.splice(7, 0, {
    _id: 'min',
    name: '最短週期',
    current: ''
  })
  rows.splice(8, 0, {
    _id: 'predMoldCnt',
    name: '派單模數',
    current: ''
  })
  rows.splice(9, 0, {
    _id: 'moldCount',
    name: '已生產模',
    current: ''
  })
  rows.splice(10, 0, {
    _id: 'achieveRate',
    name: '達成率',
    current: ''
  })
  rows.splice(11, 0, {
    _id: 'predStart',
    name: '(預計)開',
    current: ''
  })
  rows.splice(12, 0, {
    _id: 'predFinish',
    name: '預計完成時間 關',
    current: ''
  })
  rows.splice(13, 0, {
    _id: 'historyFailRate',
    name: '歷史不良',
    current: ''
  })
  $.get('/api/getMachineCurrInfo/' + machineID, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    }
    else if (results.data.length === 0) {
      // alert('沒有機台資料')
      console.log('Empty~')
    }
    else {
      var record = results.data
      console.log(record)
      for (let index = 0; index < rows.length; index++) {
        fun(rows[index], 'current', record[rows[index]._id])
      }
      console.log(rows)
    }
  })
}
</script>