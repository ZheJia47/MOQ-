<template>
<div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      <h5>資料登錄</h5>
    </div>
    <div class="row center-block">
      <!--<q-select
            v-if="edit"
            filter
            toggle
            v-model="cell.label"
            :options="cell.row.moldArray"
            :display-value="cell.value"
            error
            hide-underline
            @change="changeMoldNum(cell)"
          /
                    <option v-for="machine in machineList" v-bind:key="machine" :value="machine">
          {{ machine }}
          </option>
          -->
      <div class="col">
        機台: <q-select v-model="machineID" :options="machineList" :display-value="machineID" toggle error>
        </q-select>
        <!--<select v-model="machineID" >
          <option v-for="machine in machineList" v-bind:key="machine" :value="machine">
          {{ machine }}
          </option>
        </select>-->
        <!--日期：<input type="date" v-model="selectedDate" />-->
        日期：<q-datetime v-model="selectedDate" type="date" modal stack-label="日期"/>
      </div>
    </div>
    <div class="row center-block">
      <q-list>
      <q-item>
      <h5 v-if="status === null">射出機生產資料明細</h5>
      <h5 v-else>射出機生產資料明細 ({{status}}) </h5>
      <q-btn v-if="edit" flat round color="primary" @click="edit = !edit">確認</q-btn>
      <q-btn v-else flat round color="negative" @click="edit = !edit">編輯</q-btn>
      自{{from}}~{{to}}
      </q-item>
      <q-item>
      <q-table
        :data="rows"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        separator="cell"
        row-key="name"
        color="secondary"
        @refresh="refresh"
        @rowclick="rowclick"
      >
        <q-td slot="body-cell-machineStatusType" slot-scope="cell">
          {{cell.value}}
        </q-td>
        <q-td slot="body-cell-orderNumber" slot-scope="cell">
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
            v-if="(cell.row.check|edit)"
            type="text"
            v-model="cell.row.orderNumber"
            error
            @blur="changeOrderNumber(cell)"
          />
          <div v-else>
            {{cell.value}}
          </div>
        </q-td>
        <q-td slot="body-cell-check" slot-scope="cell">
          <q-checkbox v-model="cell.row.check" @focus="checkFunc(cell)"/>
        </q-td>
        <!-- delete button on cell -->
        <q-td slot="body-cell-moldNum" slot-scope="cell">
          <q-select
            v-if="(cell.row.check|edit)"
            filter
            toggle
            v-model="cell.label"
            :options="cell.row.moldArray"
            :display-value="cell.value"
            error
            hide-underline
            @change="changeMoldNum(cell)"
          />
          <div v-else>
            {{cell.value}}
          </div>
        </q-td>
        <q-td slot="body-cell-note" slot-scope="props" :props="props">
          <q-tooltip v-if="(props.value !== '')">
            {{props.value}}
          </q-tooltip>
          <q-select v-if="(props.row.check|edit)" v-model="props.label" :options="noteList" :display-value="props.value" hide-underline @input="changeNote(props)">
          <!--<option v-for="noteElm in noteList" v-bind:key="noteElm" :value="noteElm">
          {{noteElm}}
          </option>-->
          </q-select>
          <div v-else>
            {{props.value}}
          </div>
        </q-td>
        <q-td slot="body-cell-moldCount" slot-scope="props" :props="props">
            <q-input v-if="props.row.check"
            type="number"
            v-model="props.row.moldCount"
            error/>
            <div v-else>
              {{props.value}}
            </div>
        </q-td>
      </q-table>
      </q-item>
      </q-list>
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
// var _ = require('underscore')._

export default {
  name: 'Tables',
  data: function () {
    return {
      columns8: [
        { name: '1', field: '1', label: '1' }, // 第一行
        { name: '2', field: '2', label: '2' } // 第二行
      ],
      rows8: [
        { '1': '10', '2': '20' }, // 第一列
        { '1': '100', '2': '200' } // 第二列
      ],
      // moldNumberList: [],
      selected: [],
      firstDailyPoint: '',
      from: moment().format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      edit: false,
      status: null,
      machineID: '1A01',
      machineList: [],
      orderNumberList: [],
      selectedDate: moment().format('YYYY-MM-DD'),
      note: '',
      noteList: [],
      noteListArr: [],
      serverPagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      rows: [],
      rowArray: [],
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
          name: 'machineStatusType',
          align: 'center',
          width: '70px',
          filter: true
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          align: 'center',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '確認',
          field: 'check',
          name: 'check',
          align: 'center',
          width: '40px'
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          align: 'center',
          width: '100px',
          filter: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '模具編號',
          field: 'moldNum',
          name: 'moldNum',
          align: 'center',
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
          align: 'center',
          width: '40px'
        },
        {
          label: '標準週期',
          field: 'standard',
          name: 'standard',
          align: 'center',
          width: '40px'
        },
        {
          label: '計時開始',
          field: 'trigTime',
          name: 'trigTime',
          align: 'center',
          width: '80px',
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '計時結束',
          field: 'lastTrigTime',
          name: 'lastTrigTime',
          align: 'center',
          width: '80px',
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '時間統計',
          field: 'durationStr',
          name: 'durationStr',
          align: 'center',
          width: '80px'
        },
        {
          label: '已生產模數',
          field: 'moldCount',
          name: 'moldCount',
          align: 'center',
          width: '80px'
        },
        {
          label: '最短週期',
          field: 'min',
          name: 'min',
          align: 'center',
          width: '60px'
        },
        {
          label: '平均週期',
          field: 'average',
          name: 'average',
          align: 'center',
          width: '60px'
        },
        {
          label: '備註',
          field: 'note',
          name: 'note',
          align: 'center',
          filter: true,
          type: 'string',
          width: '40px'
        }
      ]
    }
  },
  created () {
    this.$nextTick(() => {
      /* $.get('/api/getNoteSelectedItem', {}, (docs) => {
        if (docs.type !== true) {
          alert(`response is not correct, err: ${docs.data}`)
        } else {
          if (docs.data.length !== 0) {
          // alert('沒有派單資料')
          }
        }
      }) */
      $.get('/api/firstDailyPoint', {}, (docs) => {
        if (docs.type !== true) {
          alert(`response is not correct, err: ${docs.data}`)
        } else {
          this.firstDailyPoint = docs.data
          console.log('45545568')
          console.log(this.firstDailyPoint)
          var subStr = (this.firstDailyPoint.toString()).split(':')
          // this.from = moment(this.selectedDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YY/MM/DD HH:mm:ss')
          // this.to = moment(this.selectedDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
          this.from = moment(moment(this.selectedDate).format('YYYY-MM-DD 00:00:00')).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YY/MM/DD HH:mm:ss')
          this.to = moment(this.from, 'YY/MM/DD HH:mm:ss').add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
        }
      })
      $.get('/api/getNoteSelectedItem', {}, (docs) => {
        if (docs.type !== true) {
          alert(`response is not correct, err: ${docs.data}`)
        } else {
          if (docs.data.length !== 0) {
          // alert('沒有派單資料')
          } else {
            console.log(docs.data)
            this.noteListArr = docs.data
            var arr = Object.keys(this.noteListArr)
            console.log(arr)
            // var arr1 = Object.values(this.noteListArr)
            this.noteList.splice(0, this.noteList.length)
            this.noteList.length = 0
            for (let index = 0; index < arr.length; index++) {
              if (arr[index] !== '_id') {
                this.noteList.splice(index, 0, {
                  label: arr[index] + '.' + this.noteListArr[arr[index]],
                  value: arr[index]
                })
              }
            }
            console.log(this.noteList)
          }
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

      console.log(this.machineID)
      console.log('Hahahahahaha')
      // render new table
      this.$nextTick(() => {
        renderTable(this.rows, this.machineID, this.selectedDate, this.orderNumberList, this.noteListArr, this.rowArray)
      })
    },
    selectedDate: function () {
      // destroy previous table
      // $('#example').off('click', 'tbody td:nth-child(3)')
      // this.rows = []
      var subStr = (this.firstDailyPoint.toString()).split(':')
      console.log('subStr')
      console.log(this.selectedDate)
      console.log(subStr)
      this.from = moment(moment(this.selectedDate).format('YYYY-MM-DD 00:00:00')).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YY/MM/DD HH:mm:ss')
      console.log(this.from)
      console.log(moment(this.from, 'YY/MM/DD HH:mm:ss').toDate())
      this.to = moment(this.from, 'YY/MM/DD HH:mm:ss').add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
      // this.to = moment(this.selectedDate).subtract(8, 'hours').add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
      // this.to = moment(moment(this.from).format('YYYY-MM-DD HH:mm:ss')).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      // render new table
      console.log('check')
      console.log(this.machineID)
      this.$nextTick(() => {
        renderTable(this.rows, this.machineID, this.selectedDate, this.orderNumberList, this.noteListArr, this.rowArray)
      })
    }
  },
  sockets: {
    setOrderNumberSuccess: function (val) {
      for (var idx in this.rows) {
        if (this.rows[idx]._id === val._id) {
          // console.log('get it !!!!')
          // console.log(idx)
          // console.log(JSON.stringify(this.rows[idx], null, 2))
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
          val['lastTrigTime'] = moment(val['lastTrigTime']).format('MM-DD HH:mm:ss')
          val['trigTime'] = moment(val['trigTime']).format('MM-DD HH:mm:ss')
          Object.assign(this.rows[idx], val)
          Object.assign(this.rowArray[idx], val)
          this.rowArray.forEach(function (row, index, array) {
            if (row['_id'] === val['_id']) {
            }
          })
          console.log('465456')
          console.log(this.rows[idx])
          break
        }
      }

      this.status = '派單號碼設定成功'
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setMoldNumberSuccess: function (val) {
      var suc = false
      for (var idx in this.rows) {
        if (this.rows[idx]._id === val._id) {
          // console.log('get it !!!!')
          // console.log(idx)
          // console.log(JSON.stringify(this.rows[idx], null, 2))
          /* val['lastTrigTime'] = moment(val['lastTrigTime']).format('HH:mm:ss')
          val['trigTime'] = moment(val['trigTime']).format('HH:mm:ss')
          Object.assign(this.rows[idx], val)
          Object.assign(this.rowArray[idx], val) */
          (this.rows[idx])['standard'] = val['standard']
          if (this.rows[idx]._id === val._id) {
            (this.rows[idx])['cavities'] = val['cavities']
          }
          console.log('465456')
          suc = true
          console.log(val)
          console.log(this.rows[idx])
          break
        }
      }
      if (suc) {
        this.status = '模具編號設定成功'
      } else {
        this.status = '模具編號設定失敗'
      }
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setMoldNumberFail: function (val) {
      // console.log('fail')
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
      // console.log('fail')
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
      console.log('val')
      console.log(val)
      if ((val === undefined) || (val === null)) {
        this.status = '備註設定失敗'
      } else {
        var i = 0
        for (i = 0; i < this.rows.length; i++) {
          let record = this.rows[i]
          console.log(record._id + '   ' + val.note)
          if (record._id === val._id) {
            var splitStr = record.note.split('.')
            console.log(splitStr[1])
            if (val.note === splitStr[1]) {
              this.rows[i].note = record.note // (_.invert(this.noteListArr))[record.note]
              console.log(record.note)
              console.log(this.noteListArr)
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
    test () {
      var tt = {}
      for (var i = 0; i < this.columns8.length; i++) {
        tt[(this.columns8[i]).field] = this.rows8.length + i
      }
      this.rows8.splice(this.rows8.length, 0, tt)
    },
    testTime () {
      $.get('/api/testDateTime', {}, (results) => {
        console.log('testDateTime')
        console.log(results)
        results.data.forEach(result => {
          console.log(result['Now'])
          console.log(moment(result['Now']).format('YYYY-MM-DD HH:mm:ss'))
        })
      })
    },
    rowclick (event) {
      // console.log(event)
    },
    refresh (done) {
      // console.log('refresh')
      setTimeout(() => {
        done()
      }, 3000)
    },
    changeOrderNumber (cell) {
      console.log('cell')
      console.log(cell)
      var exitFlg = this.orderNumberList.some(function (orderNumber) {
        return cell.value === orderNumber.label
      })
      console.log(exitFlg)
      if (exitFlg) {
        console.log('0')
        console.log(this.rows[cell.row.__index].orderNumber)
        console.log(cell.value)
        console.log(this.rowArray)
        if (this.rowArray[cell.row.__index].orderNumber !== cell.value) {
          this.rows[cell.row.__index].orderNumber = cell.value
          console.log('1')
          this.$socket.emit('setOrderNumber', this.rows[cell.row.__index])
          console.log('更新派單號碼中')
          this.status = '更新派單號碼中...'
        } else {
          this.status = '派單號碼設定成功'
        }
      } else {
        this.status = '輸入錯誤...'
      }
    },
    changeMoldNum (cell) {
      console.log('changeMoldNum')
      console.log(cell)
      if (this.rows[cell.row.__index].moldNum !== cell.label) {
        this.rows[cell.row.__index].moldNum = cell.label
        this.$socket.emit('setMoldNumber', this.rows[cell.row.__index])
        this.status = '更新模具編號中...'
      } else {
        this.status = '模具編號設定成功'
      }
    },
    changeNote (cell) {
      console.log(cell)
      console.log(this.noteListArr[cell.label])
      console.log(this.rows[cell.row.__index].note)
      var str = cell.label + '.' + this.noteListArr[cell.label]
      if (this.rows[cell.row.__index].note !== str) {
        this.rows[cell.row.__index].note = this.noteListArr[cell.label]
        this.$socket.emit('setNoteInfo', this.rows[cell.row.__index])
        this.rows[cell.row.__index].note = str
        this.status = '更新備註中...'
      }
    },
    sel () {
      console.log(this.serverPagination.rowsNumber)
    },
    checkFunc (cell) {
      console.log(cell)
      console.log(cell.row.moldCount)
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
            // this.machineList.push(result['machineID'])
            this.machineList.splice(this.machineList.length, 0, {
              label: result['machineID'],
              value: result['machineID']
            })
          })
          this.machineList.sort()
          console.log('machineList')
          // this.machineList = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
          console.log(this.machineList)
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
                this.noteListArr = docs.data
                var arr = Object.keys(this.noteListArr)
                arr.sort(function (a, b) {
                  return a - b
                })
                // var arr1 = Object.values(this.noteListArr)
                this.noteList.splice(0, this.noteList.length)
                this.noteList.length = 0
                for (let index = 0; index < arr.length; index++) {
                  if (arr[index] !== '_id') {
                    this.noteList.splice(this.noteList, 0, {
                      label: arr[index] + '.' + this.noteListArr[arr[index]],
                      value: arr[index]
                    })
                  }
                }
                // alert('沒有派單資料')
                // this.noteList = docs.data
              }
              console.log('note')
              console.log(this.noteList)
              renderTable(this.rows, this.machineID, this.selectedDate, this.orderNumberList, this.noteListArr, this.rowArray)
            }
          })
        }
      })
    })
  },
  components: {
  }
}

function renderTable (rows, machineID, iReportDate, orderNumberList, noteListArr, rowArray) {
  // init the records in the rows
  rows.splice(0, rows.length)
  var reportDate = moment(iReportDate).format('YYYY-MM-DD 00:00:00')
  $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
    } else {
      var records = results.data
      console.log(records)
      records.forEach(record => {
        // console.log(JSON.stringify(record, null, 2))
        let tempMoldArray = []
        if (record['moldArray'] !== undefined && record['moldArray'].length !== 0) {
          for (let i = 0; i < record['moldArray'].length; i++) {
            tempMoldArray.push({
              label: record['moldArray'][i],
              value: record['moldArray'][i]
            })
          }
        }
        var oKeys = Object.keys(noteListArr)
        var indKey = 0
        for (let index = 0; index < oKeys.length; index++) {
          if (noteListArr[oKeys[index]] === record['note']) {
            indKey = index
            break
          }
        }
        console.log(noteListArr[oKeys[indKey]])
        console.log(oKeys[indKey])
        console.log(oKeys[indKey] + '.' + record['note'])
        console.log('AAAA')
        // rows.push({
        rows.splice(0, 0, {
          _id: record['_id'],
          machineID: record['machineID'],
          machineStatusType: record['machineStatusType'],
          orderNumber: record['orderNumber'],
          orderNumberList: orderNumberList,
          check: false, // record['check'],
          product: record['product'],
          moldNum: record['moldNum'],
          cavities: record['cavities'] ? record['cavities'] : 0,
          standard: record['standard'] ? record['standard'] : 0,
          trigTime: moment(record['trigTime']).format('MM-DD HH:mm:ss'),
          lastTrigTime: moment(record['lastTrigTime']).format('MM-DD HH:mm:ss'),
          durationStr: record['durationStr'],
          moldCount: record['moldCount'],
          moldArray: tempMoldArray,
          min: Math.round(record['min'] * 10) / 10,
          average: record['average'] ? record['average'] : 0,
          note: (indKey > 0) ? (oKeys[indKey] + '.' + record['note']) : '' || ''
          // note: record['note'] || ''
        })
        console.log(record['note'])
        rowArray.splice(rowArray.length, 0, {
          _id: record['_id'],
          orderNumber: record['orderNumber'],
          product: record['product'],
          moldNum: record['moldNum'],
          moldArray: tempMoldArray
        })
      })
      rows.sort(function (a, b) {
        return a.trigTime > b.trigTime ? 1 : (a.trigTime < b.trigTime) ? -1 : (a.lastTrigTime > b.lastTrigTime) ? 1 : -1
      })
      console.log('rows')
      console.log(rows)
      /* for (let i = 0; i < rows.length; i++) {
        rowArray.splice(rowArray.length, 0, rows[i])
        console.log(i)
        console.log(rowArray[i])
        console.log(rows[i])
      } */
    }
  })
}
</script>
<style>
</style>
