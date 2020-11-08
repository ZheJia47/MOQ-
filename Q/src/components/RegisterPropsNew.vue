<template>
<div class="layout-padding">
<section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
         <h4>資料登錄 New - Data Login</h4>
      </div>
      </div>
      <div class="row justify-center q-pt-xs q-pb-xs text-white bg-light-blue-8 full-width ">
      <q-btn outline glossy label='排序' icon="icon-svg52" @click="sortFalling = !sortFalling, sortEvent()"/>
      <q-btn-dropdown outline glossy label="顯示欄位" icon="icon-svg53">
  <!-- dropdown content -->
        <q-list link>
          <q-item v-for="(col, index) in columns" v-bind:key="index">
            <q-item-main>
              <q-checkbox v-model="columns[index]['required']" :label="columns[index]['label']" :value="col"/>
            </q-item-main>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn outline glossy label='色彩設定' icon="icon-svg54" @click="colorEn = !colorEn"/>
      <q-btn outline glossy v-if="$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rows, columns, machineID + '資料登錄New')"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
    <div class="row justify-center bg-white full-width q-pt-xs no-margin">
    <!--<q-list>-->
     <div class="overflow-hidden">
     <!--<q-item>-->
      <div class="row inline justify-end q-mb-xs full-width">
           <q-select color="white" v-model="machineID" class="no-margin" :options="machineList" stack-label=" " :display-value="machineID" toggle error style="fontSize:16px;">
          </q-select>
         <q-datetime v-model="selectedDate" class="no-margin" type="date" modal stack-label=" " ok-label="確定" cancel-label="取消" :first-day-of-week="1" style="fontSize:16px;"/>
       <q-datetime v-model="selectedDateTo" class="no-margin" type="date" modal stack-label=" " ok-label="確定" cancel-label="取消" :first-day-of-week="1" style="fontSize:16px;"/>
       <q-btn outline size="16px" text-color="black" text-bold label="載入" @click="reloadTable"/>
        <q-btn v-if="edit" outline size="16px" align="center" text-color="black" text-bold @click="edit = !edit">確認</q-btn>
        <q-btn v-else outline size="16px" align="center" text-color="black" text-bold @click="edit = !edit">編輯</q-btn>
        <q-btn outline size="16px" text-color="black" text-bold label="創建" @click="makeTable"/>
       </div>
     <div class="col q-pt-xs q-pb-xs">
      <h1 v-if="status === null">射出機生產資料明細
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      自{{from}}~{{to}}</h1>
      <h1 v-else>射出機生產資料明細 ({{status}})
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      自{{from}}~{{to}}</h1>
   </div>
      <!--</q-item>-->
<div class="row justify-center full-width q-mt-xs">
      <!--<q-item>-->
 <!--<q-scroll-area style="height: 200px; width: 400px; max-width: 100%vw; max-height: 100%vh;" class="bg-grey-3 round-borders">-->
 <!--  <q-scroll-area style="width: 400px; max-width: 85vw; height: 470px; max-height: 70vh;" class="bg-grey-3 round-borders shadow-2">-->
      <q-table
        :data="rows"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        separator="cell"
        row-key="name"
        :visible-columns="visibleColumns"
      >
        <q-td slot="body-cell-durationStr" slot-scope="props">
          <div v-if="colorEn && props.value > (colorConditionObj['manual']) && props.row.machineStatusType==='手動'" :style="colorArr[13]">
              <span v-if="blink[13]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else>
              {{props.value}}
            </div>
        </q-td>
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
          <!--<div v-if="(cell.row.check|edit)">-->
            {{cell.row.orderNumber}}
          <q-popup-edit v-model="cell.row.orderNumber" buttons label-set="確定" label-cancel="取消" :disable="!(cell.row.check|edit) || cell.row.machineStatusType==='手動' || cell.row.machineStatusType==='關機'" persistent @save="changeOrderNumberNew(cell.row.orderNumber, cell)" @cancel="test5">
            <q-field count>
          <q-input
            type="text"
            v-model="cell.row.orderNumber"
            error
          />
            </q-field>
          </q-popup-edit>
          <!--</div>
          <q-input
            v-if="(cell.row.check|edit)"
            type="text"
            v-model="cell.row.orderNumber"
            error
            @input="changeOrderNumber(cell)"
            @blur="checkOrderNumber(cell)"
          />
          <div v-else>
            {{cell.value}}
          </div>-->
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
            color="red"
            separator
            inverted-ligh
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
      <!--</q-scroll-area>-->
      <!--</q-item>-->
      </div>
      </div>
      <!--</q-list>-->
      </div>
      <!--</div>-->
    </section>
</div>
</template>

<script>
import $ from 'jquery'
import 'moment-duration-format'
// require('moment-round')
import moment from 'moment'
// TT.monkey(moment)
// import orderNumber from './OrderNumberEdit'
// import moldNum from './MoldNumberEdit'
// var _ = require('underscore')._
import XLSX from 'XLSX'
export default {
  name: 'Tables',
  props: [
    'user'
  ],
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
      selected: [],
      firstDailyPoint: '',
      from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      edit: false,
      status: null,
      machineID: '1A01',
      machineList: [],
      orderNumberList: [],
      selectedDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      selectedDateTo: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      note: '',
      noteList: [],
      noteListArr: [],
      serverPagination: {
        rowsPerPage: 20
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
          required: true,
          filter: true
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          align: 'center',
          width: '100px',
          required: true,
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
          width: '40px',
          required: true
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          align: 'center',
          width: '100px',
          required: true,
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
          align: 'center',
          width: '40px',
          required: true
        },
        {
          label: '標準週期',
          field: 'standard',
          name: 'standard',
          align: 'center',
          width: '40px',
          required: true
        },
        {
          label: '計時開始',
          field: 'trigTime',
          name: 'trigTime',
          align: 'center',
          width: '80px',
          required: true,
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
          required: true,
          sort (a, b) {
            return (a > b) ? 1 : -1
          }
        },
        {
          label: '時間統計',
          field: 'durationStr',
          name: 'durationStr',
          align: 'center',
          width: '80px',
          required: true
        },
        {
          label: '已生產模數',
          field: 'moldCount',
          name: 'moldCount',
          align: 'center',
          width: '80px',
          required: true
        },
        {
          label: '最短週期',
          field: 'min',
          name: 'min',
          align: 'center',
          width: '60px',
          required: true
        },
        {
          label: '平均週期',
          field: 'average',
          name: 'average',
          align: 'center',
          width: '60px',
          required: true
        },
        {
          label: '備註',
          field: 'note',
          name: 'note',
          align: 'center',
          filter: true,
          type: 'string',
          width: '40px',
          required: true
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
          // console.log('45545568')
          // console.log(this.firstDailyPoint)
          var subStr = (this.firstDailyPoint.toString()).split(':')
          // this.from = moment(this.selectedDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YY/MM/DD HH:mm:ss')
          // this.to = moment(this.selectedDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
          this.from = moment(moment(this.selectedDate).format('YYYY-MM-DD 00:00:00')).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YY/MM/DD HH:mm:ss')
          this.to = moment(moment(this.selectedDateTo).format('YYYY-MM-DD 00:00:00')).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
        }
      })
      $.get('/api/getNoteSelectedItem', {}, (docs) => {
        if (docs.type !== true) {
          alert(`response is not correct, err: ${docs.data}`)
        } else {
          if (docs.data.length === 0) {
          // alert('沒有派單資料')
          } else {
            // console.log(docs.data)
            this.noteListArr = docs.data
            var arr = Object.keys(this.noteListArr)
            // console.log(arr)
            // var arr1 = Object.values(this.noteListArr)
            this.noteList.splice(0, this.noteList.length)
            this.noteList.length = 0
            arr.forEach(elm => {
              if (elm !== '_id') {
                this.noteList.splice(this.noteList.length, 0, {
                  label: elm + '.' + this.noteListArr[elm],
                  value: elm
                })
              }
            })
            /* for (let index = 0; index < arr.length; index++) {
              if (arr[index] !== '_id') {
                this.noteList.splice(index, 0, {
                  label: arr[index] + '.' + this.noteListArr[arr[index]],
                  value: arr[index]
                })
              }
            } */
            this.noteList.sort(function (a, b) {
              return a.value < b.value ? 1 : -1
            })
            this.noteList.splice(0, 0, {
              label: '',
              value: ''
            })
            // console.log(this.noteList)
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

      // console.log(this.machineID)
      // console.log('Hahahahahaha')
      // render new table
      /* this.$nextTick(() => {
        renderTable(this.rows, this.machineID, this.selectedDate, this.orderNumberList, this.noteListArr, this.rowArray)
      }) */
      this.reloadTable()
    },
    selectedDate: function () {
      // this.reloadTable()
      this.selectedDateTo = this.selectedDate
    },
    selectedDateTo: function () {
      // this.reloadTable()
      if (this.selectedDateTo < this.selectedDate) {
        this.selectedDate = this.selectedDateTo
      }
    },
    colorConditionArr: function () {
      if (this.colorConditionArr.length > 14) {
        var hour = (this.colorConditionArr[13][0] < 10) ? '0' + String(this.colorConditionArr[13][0]) : String(this.colorConditionArr[13][0])
        var min = (this.colorConditionArr[13][1] < 10) ? '0' + String(this.colorConditionArr[13][1]) : String(this.colorConditionArr[13][1])
        this.colorConditionObj['manual'] = hour + ':' + min + ':00'
      }
    }
  },
  sockets: {
    setOrderNumberSuccess: function (val) {
      renderTable(this.rows, this.machineID, this.selectedDate, this.selectedDateTo, this.orderNumberList, this.noteListArr, this.rowArray, this.$q.loading)
      this.status = '派單號碼設定成功'
      setTimeout(() => {
        this.status = null
      }, 5000)
    },
    setMoldNumberSuccess: function (val) {
      renderTable(this.rows, this.machineID, this.selectedDate, this.selectedDateTo, this.orderNumberList, this.noteListArr, this.rowArray, this.$q.loading)
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
    findMoldListFail: function (val) {
      // // console.log('fail')
      this.status = '模具編號不存在'

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
    failToClrOrderNumberSuccess: function (val) {
      renderTable(this.rows, this.machineID, this.selectedDate, this.selectedDateTo, this.orderNumberList, this.noteListArr, this.rowArray, this.$q.loading)
      this.status = '輸入錯誤...'
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
            var splitStr = record.note.split('.')
            // console.log(splitStr[1])
            if (val.note === splitStr[1]) {
              this.rows[i].note = record.note // (_.invert(this.noteListArr))[record.note]
              // console.log(record.note)
              // console.log(this.noteListArr)
              this.status = '備註設定成功'
            } else if (val.note === '') {
              record.note = ''
              this.status = '清除成功'
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
    },
    moldNotExit: function (val) {
      this.status = '模具編號不存在'

      for (let i = 0; i < this.rows.length; i++) {
        let record = this.rows[i]
        if (record._id === val._id) {
          record.orderNumber = val.orderNumber
          break
        }
      }
      setTimeout(() => {
        this.status = null
      }, 3000)
    }
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
    makeTable () {
      /* this.$q.loading.show({
        delay: 400 // ms
      }) */
      this.from = moment(moment(this.selectedDate).format('YYYY-MM-DD') + ' ' + this.firstDailyPoint).format('YY/MM/DD HH:mm:ss')
      this.to = moment(moment(this.selectedDateTo).format('YYYY-MM-DD') + ' ' + this.firstDailyPoint).add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
      $.get('/api/buildTableByRealData/' + this.machineID + '/' + this.selectedDate + '/' + this.selectedDateTo, {}, (results) => {
        if (results.type !== true) {
          this.$q.loading.hide()
          this.rows.splice(0, this.rows.length)
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          this.$q.loading.hide()
          this.rows.splice(0, this.rows.length)
          alert('沒有機台資料')
        } else {
          this.$q.loading.hide()
          renderTable(this.rows, this.machineID, this.selectedDate, this.selectedDateTo, this.orderNumberList, this.noteListArr, this.rowArray, this.$q.loading)
        }
      })
    },
    test5 (a, b) {
      // console.log('test5')
      // console.log(a)
      // console.log(b)
    },
    reloadTable () {
      // var subStr = (this.firstDailyPoint.toString()).split(':')
      // this.from = moment(moment(this.selectedDate).format('YYYY-MM-DD 00:00:00')).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YY/MM/DD HH:mm:ss')
      // this.to = moment(moment(this.selectedDateTo).format('YYYY-MM-DD 00:00:00')).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
      this.from = moment(moment(this.selectedDate).format('YYYY-MM-DD') + ' ' + this.firstDailyPoint).format('YY/MM/DD HH:mm:ss')
      this.to = moment(moment(this.selectedDateTo).format('YYYY-MM-DD') + ' ' + this.firstDailyPoint).add(1, 'day').subtract(1, 'seconds').format('YY/MM/DD HH:mm:ss')
      this.$nextTick(() => {
        renderTable(this.rows, this.machineID, this.selectedDate, this.selectedDateTo, this.orderNumberList, this.noteListArr, this.rowArray, this.$q.loading)
      })
    },
    test () {
      var tt = {}
      for (var i = 0; i < this.columns8.length; i++) {
        tt[(this.columns8[i]).field] = this.rows8.length + i
      }
      this.rows8.splice(this.rows8.length, 0, tt)
    },
    testTime () {
      $.get('/api/testDateTime', {}, (results) => {
        // console.log('testDateTime')
        // console.log(results)
        results.data.forEach(result => {
          // console.log(result['Now'])
          // console.log(moment(result['Now']).format('YYYY-MM-DD HH:mm:ss'))
        })
      })
    },
    rowclick (event) {
      // // console.log(event)
    },
    refresh (done) {
      // // console.log('refresh')
      setTimeout(() => {
        done()
      }, 3000)
    },
    checkOrderNumber (cell) {
      // console.log('cell')
      // console.log(cell)
      var exitFlg = this.orderNumberList.some(function (orderNumber) {
        return cell.value === orderNumber.label
      })
      if (!exitFlg) {
        this.status = '輸入錯誤...'
        this.rows[cell.row.__index].orderNumber = ''
        // console.log(this.orderNumberList)
        this.$socket.emit('failToClrOrderNumber', this.rows[cell.row.__index])
      }
    },
    changeOrderNumberNew (val, cell) {
      // console.log('cell')
      // console.log(val)
      // console.log(cell)
      var exitFlg = this.orderNumberList.some(function (orderNumber) {
        return cell.value === orderNumber.label
      })
      // console.log(exitFlg)
      if (exitFlg) {
        // console.log('0')
        // console.log(this.rows[cell.row.__index].orderNumber)
        // console.log(cell.value)
        // console.log(this.rowArray)
        if (this.rowArray[cell.row.__index].orderNumber !== cell.value) {
          this.rows[cell.row.__index].orderNumber = cell.value
          // console.log('1')
          this.$socket.emit('setOrderNumber', this.rows[cell.row.__index])
          // console.log('更新派單號碼中')
          this.status = '更新派單號碼中...'
        } else {
          this.status = '派單號碼設定成功'
        }
      } else if (cell.value === '') {
        // 清除派單和模具編號
        // this.rows[cell.row.__index].orderNumber = cell.value
        this.$socket.emit('clrOrderNumber', this.rows[cell.row.__index])
        this.status = '更新派單號碼中...'
      } else {
        // this.status = '輸入錯誤...'
      }
    },
    changeOrderNumber (cell) {
      // console.log('cell')
      // console.log(cell)
      var exitFlg = this.orderNumberList.some(function (orderNumber) {
        return cell.value === orderNumber.label
      })
      // console.log(exitFlg)
      if (exitFlg) {
        // console.log('0')
        // console.log(this.rows[cell.row.__index].orderNumber)
        // console.log(cell.value)
        // console.log(this.rowArray)
        if (this.rowArray[cell.row.__index].orderNumber !== cell.value) {
          this.rows[cell.row.__index].orderNumber = cell.value
          // console.log('1')
          this.$socket.emit('setOrderNumber', this.rows[cell.row.__index])
          // console.log('更新派單號碼中')
          this.status = '更新派單號碼中...'
        } else {
          this.status = '派單號碼設定成功'
        }
      } else if (cell.value === '') {
        // 清除派單和模具編號
        // this.rows[cell.row.__index].orderNumber = cell.value
        this.$socket.emit('clrOrderNumber', this.rows[cell.row.__index])
        this.status = '更新派單號碼中...'
      } else {
        // this.status = '輸入錯誤...'
      }
    },
    changeMoldNum (cell) {
      // console.log('changeMoldNum')
      // console.log(cell)
      // if (this.rows[cell.row.__index].moldNum !== cell.label) {
      this.rows[cell.row.__index].moldNum = cell.label
      this.$socket.emit('setMoldNumber', this.rows[cell.row.__index])
      this.status = '更新模具編號中...'
      // } else {
      // this.status = '模具編號設定成功'
      // }
    },
    changeNote (cell) {
      // console.log(cell)
      // console.log(this.noteListArr[cell.label])
      // console.log(this.rows[cell.row.__index].note)
      var str = ''
      if (cell.label !== '') {
        str = cell.label + '.' + this.noteListArr[cell.label]
      }
      if (this.rows[cell.row.__index].note !== str) {
        if (cell.label !== '') {
          this.rows[cell.row.__index].note = this.noteListArr[cell.label]
        } else {
          this.rows[cell.row.__index].note = ''
        }
        this.$socket.emit('setNoteInfo', this.rows[cell.row.__index])
        this.rows[cell.row.__index].note = str
        this.status = '更新備註中...'
      }
    },
    sel () {
      // console.log(this.serverPagination.rowsNumber)
    },
    checkFunc (cell) {
      // console.log(cell)
      // console.log(cell.row.moldCount)
    },
    sortEvent () {
      if (!this.sortFalling) {
        this.rows.sort(function (a, b) {
          return (a.trigTimeFullType > b.trigTimeFullType) ? 1 : -1
        })
      } else {
        this.rows.sort(function (a, b) {
          return (a.trigTimeFullType < b.trigTimeFullType) ? 1 : -1
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
  mounted () {
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    this.$nextTick(() => {
      $.get('/api/getMachineList', {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
        } else {
          results.data.sort((a, b) => {
            return a.machineID > b.machineID ? 1 : -1
          })
          results.data.forEach((result) => {
            // this.machineList.push(result['machineID'])
            this.machineList.splice(this.machineList.length, 0, {
              label: result['machineID'],
              value: result['machineID']
            })
          })
          this.machineList.sort()
          // console.log('machineList')
          // this.machineList = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
          // console.log(this.machineList)
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
                arr.forEach(elm => {
                  if (elm !== '_id') {
                    this.noteList.splice(this.noteList.length, 0, {
                      label: elm + '.' + this.noteListArr[elm],
                      value: elm
                    })
                  }
                })
                this.noteList.sort(function (a, b) {
                  return a.value > b.value ? 1 : -1
                })
                this.noteList.splice(0, 0, {
                  label: '',
                  value: ''
                })
              }
              // console.log('note')
              // console.log(this.noteList)
              renderTable(this.rows, this.machineID, this.selectedDate, this.selectedDateTo, this.orderNumberList, this.noteListArr, this.rowArray, this.$q.loading)
            }
          })
        }
      })
    })
  },
  components: {
  }
}

function renderTable (rows, machineID, iReportDate, selectedDateTo, orderNumberList, noteListArr, rowArray, loading) {
  // init the records in the rows
  var reportDate = moment(iReportDate).format('YYYY-MM-DD 00:00:00')
  var reportDateTo = moment(selectedDateTo).format('YYYY-MM-DD 00:00:00')
  $.get('/api/getMachineRecordsNew/' + machineID + '/' + reportDate + '/' + reportDateTo, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      rows.splice(0, rows.length)
      loading.hide()
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      rows.splice(0, rows.length)
      loading.hide()
    } else {
      loading.hide()
      rows.splice(0, rows.length)
      var records = results.data
      // console.log(records)
      records.forEach(record => {
        // // console.log(JSON.stringify(record, null, 2))
        /* if ((record.machineStatusType !== '全自動') && (record.machineStatusType !== '半自動')) {
          return
        } */ // else if (record.machineStatusType === '系統啟動') {
        // return
        // }
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
        // console.log(noteListArr[oKeys[indKey]])
        // console.log(oKeys[indKey])
        // console.log(oKeys[indKey] + '.' + record['note'])
        // console.log('AAAA')
        // console.log(record)
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
        var average = 0
        if ((record['moldCount'] || 0) > 0) {
          average = Math.round(t.asMilliseconds() / (record['moldCount'] || 0) / 100) / 10
        }
        rows.splice(rows.length, 0, {
          _id: record['_id'],
          machineID: record['machineID'],
          machineStatusType: record['machineStatusType'],
          orderNumber: record['orderNumber'] || '',
          orderNumberN: record['orderNumber'] || '',
          orderNumberList: orderNumberList,
          check: false, // record['check'],
          product: record['product'],
          moldNum: record['moldNum'],
          cavities: record['cavities'] ? record['cavities'] : 0,
          standard: record['standard'] ? record['standard'] : 0,
          trigTime: moment(record['trigTime']).format('MM-DD HH:mm:ss.SSS'), // (Math.round(Number(moment(record['trigTime']).format('SSS')) / 100) >= 10) ? (moment(record['trigTime']).add(1, 'seconds').format('MM-DD HH:mm:ss') + '.0') : (moment(record['trigTime']).format('MM-DD HH:mm:ss') + '.' + Math.round(Number(moment(record['trigTime']).format('SSS')) / 100)),
          lastTrigTime: (Math.round(Number(moment(record['lastTrigTime']).format('SSS')) / 100) >= 10) ? (moment(record['lastTrigTime']).add(1, 'seconds').format('MM-DD HH:mm:ss') + '.0') : (moment(record['lastTrigTime']).format('MM-DD HH:mm:ss') + '.' + Math.round(Number(moment(record['lastTrigTime']).format('SSS')) / 100)),
          durationStr: H + ':' + m + ':' + s + '.' + ms, // record['durationStrCor'],
          moldCount: record['moldCount'] || 0,
          moldArray: tempMoldArray,
          min: ((Math.round((record['min'] || 0) * 10) / 10) === 0) ? 0 : (Math.round((record['min'] || 0) * 10) / 10).toFixed(1),
          average: average,
          note: (indKey > 0) ? (oKeys[indKey] + '.' + record['note']) : '' || '',
          componentNum: record['componentNum'],
          trigTimeFullType: moment(record['trigTime']).format('YYYY-MM-DD HH:mm:ss.SSS'),
          lastTrigTimeFullType: moment(record['lastTrigTime']).format('YYYY-MM-DD HH:mm:ss.SSS'),
          durationStrOrg: record['durationStr']
          // note: record['note'] || ''
        })
        // console.log(record['note'] || '')
        rowArray.splice(rowArray.length, 0, {
          _id: record['_id'],
          orderNumber: record['orderNumber'],
          product: record['product'],
          moldNum: record['moldNum'],
          moldArray: tempMoldArray
        })
      })
      rows.sort(function (a, b) {
        return a.trigTimeFullType > b.trigTimeFullType ? 1 : (a.trigTimeFullType < b.trigTimeFullType) ? -1 : (a.lastTrigTimeFullType > b.lastTrigTimeFullType) ? 1 : -1
      })
      // console.log('rows')
      // console.log(rows)
      /* for (let i = 0; i < rows.length; i++) {
        rowArray.splice(rowArray.length, 0, rows[i])
        // console.log(i)
        // console.log(rowArray[i])
        // console.log(rows[i])
      } */
      loading.hide()
    }
  })
}
function getPageSetting (colorArr, colorConditionArr, blink) {
  $.get('/api/getPageSettingRegister', {}, (results) => {
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
      // console.log('colorConditionArr')
      // console.log(colorConditionArr)
      // console.log(colorArr)
      // console.log(blink)
    }
  })
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
