<template>
<div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      <h5>資料登錄</h5>
    </div>
    <div class="row center-block">
      <div class="col">
        機台: <select v-model="machineID">
          <option v-for="machine in machineList" v-bind:key="machine" :value="machine">
          {{ machine }}
          </option>
        </select>
        日期：<input type="date" v-model="selectedDate" />
      </div>
    </div>
    <div class="row center-block">
      <h5 v-if="status === null">射出機生產資料明細</h5>
      <h5 v-else>射出機生產資料明細 ({{status}}) </h5>
      <q-btn v-if="edit" flat round color="primary" @click="edit = !edit">確認</q-btn>
      <q-btn v-else flat round color="negative" @click="edit = !edit">編輯</q-btn>
      <q-table
        :data="rows"
        :columns="columns"
        :config="config"
        @refresh="refresh"
        @rowclick="rowclick"
      >
        <template slot="col-machineStatusType" slot-scope="cell">
        </template>
        <template slot="col-orderNumber" slot-scope="cell">
<!--           <q-select
            v-if="edit"
            filter
            toggle
            v-model="cell.data"
            :options="orderNumberList"
            error
            @change="changeOrderNumber(cell)"
          />
 -->
          <q-input
            v-if="edit"
            type="text"
            v-model="cell.data"
            error
            @blur="changeOrderNumber(cell)"
          />
          <div v-else>
            {{cell.data}}
          </div>
        </template>
        <!-- delete button on cell -->
        <template slot="col-moldNum" slot-scope="cell">
          <q-select
            v-if="edit"
            filter
            toggle
            v-model="cell.data"
            :options="cell.row.moldArray"
            error
            @change="changeMoldNum(cell)"
          />
          <div v-else>
            {{cell.data}}
          </div>
        </template>
        <template slot="col-note" slot-scope="cell">
          <q-tooltip v-if="(cell.data !== '')">
            {{noteListArr[cell.data]}}
            </q-tooltip>
        <q-select v-model="cell.data" :options="noteList" @change="changeNote(cell)">
          <!--<option v-for="noteElm in noteList" v-bind:key="noteElm" :value="noteElm">
          {{noteElm}}
          </option>-->
        </q-select>
        </template>
      </q-table>
    </div>
  </section>
</div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
// import orderNumber from './OrderNumberEdit'
// import moldNum from './MoldNumberEdit'
var _ = require('underscore')._

export default {
  name: 'Tables',
  data: function () {
    return {
      // moldNumberList: [],
      edit: false,
      status: null,
      machineID: '1A01',
      machineList: [],
      orderNumberList: [],
      selectedDate: moment().format('YYYY-MM-DD'),
      note: '',
      noteList: [],
      noteListArr: [],
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
          label: '狀態',
          field: 'machineStatusType',
          width: '70px',
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
          label: '確<BR>認',
          field: 'check',
          width: '40px'
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
          label: '模具編號',
          field: 'moldNum',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '穴<BR>數',
          field: 'cavities',
          width: '40px'
        },
        {
          label: '標準<BR>週期',
          field: 'standard',
          width: '40px'
        },
        {
          label: '計時開始',
          field: 'trigTime',
          width: '80px',
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '計時結束',
          field: 'lastTrigTime',
          width: '80px',
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '時間統計',
          field: 'durationStr',
          width: '80px'
        },
        {
          label: '已生產<BR>模數',
          field: 'moldCount',
          width: '80px'
        },
        {
          label: '最短<BR>週期',
          field: 'min',
          width: '60px'
        },
        {
          label: '平均<BR>週期',
          field: 'average',
          width: '60px'
        },
        {
          label: '備註',
          field: 'note',
          filter: true,
          type: 'string',
          width: '40px'
        }
      ]
    }
  },
  created () {
    this.$nextTick(() => {
      $.get('/api/getNoteSelectedItem', {}, (docs) => {
        if (docs.type !== true) {
          alert(`response is not correct, err: ${docs.data}`)
        } else {
          if (docs.data.length !== 0) {
          // alert('沒有派單資料')
          }
          // console.log(docs.data)
          this.noteListArr = docs.data
          var arr = Object.keys(this.noteListArr)
          // var arr1 = Object.values(this.noteListArr)
          for (let index = 0; index < arr.length; index++) {
            if (arr[index] !== '_id') {
              this.noteList.splice(this.noteList, 0, {
                label: arr[index],
                value: arr[index]
              })
            }
          }
          /* arr.forEach((element) => {
            if (element !== '_id') {
              this.noteList.push(element)
            }
          }) */
          // console.log('note')
          // console.log(this.noteList)
        }
      })
    })
  },
  computed: {
  },
  watch: {
    machineID: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // console.log(this.machineID)
      // render new table
      this.$nextTick(() => {
        renderTable(this.rows, this.machineID, this.selectedDate, this.orderNumberList, this.noteListArr)
      })
    },
    selectedDate: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []

      // render new table
      this.$nextTick(() => {
        renderTable(this.rows, this.machineID, this.selectedDate, this.orderNumberList, this.noteListArr)
      })
    }
  },
  sockets: {
    setOrderNumberSuccess: function (val) {
      for (var idx in this.rows) {
        if (this.rows[idx]._id === val._id) {
          // // console.log('get it !!!!')
          // // console.log(idx)
          // // console.log(JSON.stringify(this.rows[idx], null, 2))
          let tempMoldArray = []
          if (val.moldArray !== undefined && val.moldArray.length !== 0) {
            for (let i = 0; i < val.moldArray.length; i++) {
              tempMoldArray.push({
                label: val.moldArray[i],
                value: val.moldArray[i]
              })
            }
          }
          val.moldArray = tempMoldArray
          this.rows[idx].moldArray.splice(0, this.rows[idx].moldArray.length)
          Object.assign(this.rows[idx], val)
          break
        }
      }

      this.status = '派單號碼設定成功'
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setMoldNumberSuccess: function (val) {
      this.status = '模具編號設定成功'

      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setMoldNumberFail: function (val) {
      // // console.log('fail')
      this.status = '模具編號設定失敗'

      for (let i = 0; i < this.rows.length; i++) {
        let record = this.rows[i]
        if (record._id === val._id) {
          record.moldNumber = val.moldNumber
          break
        }
      }

      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setOrderNumberFail: function (val) {
      // // console.log('fail')
      this.status = '派單號碼設定失敗'

      for (let i = 0; i < this.rows.length; i++) {
        let record = this.rows[i]
        if (record._id === val._id) {
          record.orderNumber = val.orderNumber
          break
        }
      }

      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setNoteInfoRes: function (val) {
      // console.log('val')
      // console.log(val)
      if ((val === undefined) || (val === null)) {
        this.status = '備註設定失敗'
      } else {
        var i = 0
        for (i = 0; i < this.rows.length; i++) {
          let record = this.rows[i]
          // console.log(record._id + '   ' + val.note)
          if (record._id === val._id) {
            if (record.note === val.note) {
              this.rows[i].note = record.note // (_.invert(this.noteListArr))[record.note]
              // console.log(record.note)
              // console.log(this.noteListArr)
              this.status = '備註設定成功'
            } else {
              record.note = ''
              this.status = '備註設定失敗'
            }
            break
          }
        }
      }
      setTimeout(() => {
        this.status = null
      }, 3000)
    }
  },
  methods: {
    rowclick (event) {
      // // console.log(event)
    },
    refresh (done) {
      // // console.log('refresh')
      setTimeout(() => {
        done()
      }, 3000)
    },
    changeOrderNumber (cell) {
      // // console.log(cell)
      this.rows[cell.row.__index].orderNumber = cell.data
      this.$socket.emit('setOrderNumber', this.rows[cell.row.__index])
      this.status = '更新派單號碼中...'
    },
    changeMoldNum (cell) {
      // // console.log(cell)
      this.rows[cell.row.__index].moldNum = cell.data
      this.$socket.emit('setMoldNumber', this.rows[cell.row.__index])
      this.status = '更新模具編號中...'
    },
    changeNote (cell) {
      // console.log(this.noteListArr[cell.data])
      // console.log(this.rows[cell.row.__index])
      if (this.rows[cell.row.__index].note !== cell.data) {
        this.rows[cell.row.__index].note = this.noteListArr[cell.data]
        this.$socket.emit('setNoteInfo', this.rows[cell.row.__index])
        this.status = '更新備註中...'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      $.get('/api/getMachineList', {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
        } else {
          results.data.forEach((result) => {
            this.machineList.push(result['machineID'])
          })
          this.machineList.sort()
        }
      })
      $.get('/api/getOrderList', {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          // alert('沒有派單資料')
        } else {
          results.data.forEach((result) => {
            this.orderNumberList.push({
              label: result['派單號碼'],
              value: result['派單號碼']
            })
          })
          $.get('/api/getNoteSelectedItem', {}, (docs) => {
            if (docs.type !== true) {
              alert(`response is not correct, err: ${docs.data}`)
            } else {
              if (docs.data.length !== 0) {
              // alert('沒有派單資料')
                this.noteList = docs.data
              }
              // console.log('note')
              // console.log(this.noteList)
              renderTable(this.rows, this.machineID, this.selectedDate, this.orderNumberList, this.noteListArr)
            }
          })
        }
      })
    })
  },
  components: {
  }
}

function renderTable (rows, machineID, reportDate, orderNumberList, noteListArr) {
  // init the records in the rows
  rows.splice(0, rows.length)

  $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
    } else {
      var records = results.data
      // console.log(records)
      records.forEach(record => {
        // // console.log(JSON.stringify(record, null, 2))
        let tempMoldArray = []
        if (record['moldArray'] !== undefined && record['moldArray'].length !== 0) {
          for (let i = 0; i < record['moldArray'].length; i++) {
            tempMoldArray.push({
              label: record['moldArray'][i],
              value: record['moldArray'][i]
            })
          }
        }

        // rows.push({
        rows.splice(0, 0, {
          _id: record['_id'],
          machineID: record['machineID'],
          machineStatusType: record['machineStatusType'],
          orderNumber: record['orderNumber'],
          orderNumberList: orderNumberList,
          check: record['check'],
          product: record['product'],
          moldNum: record['moldNum'],
          cavities: record['cavities'] ? record['cavities'] : 0,
          standard: record['standard'] ? record['standard'] : 0,
          trigTime: moment(record['trigTime']).format('HH:mm:ss'),
          lastTrigTime: moment(record['lastTrigTime']).format('HH:mm:ss'),
          durationStr: record['durationStr'],
          moldCount: record['moldCount'],
          moldArray: tempMoldArray,
          min: Math.round(record['min'] * 10) / 10,
          average: record['average'] ? record['average'] : 0,
          note: (_.invert(noteListArr))[record['note']] || ''
          // note: record['note'] || ''
        })
        // console.log(record['note'])
      })
      rows.sort(function (a, b) {
        return a.trigTime > b.trigTime ? 1 : -1
      })
    }
  })
}
</script>
<style>
</style>
