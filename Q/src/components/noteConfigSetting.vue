<template>
<div class="layout-padding">
  <section class="content">
   <div class="row inline bg-light-blue-7 full-width glossy">
    <div class="col-12 q-pl-xl text-white">
      <h4>備註選填代號設定</h4>
    </div>
    </div>
        <div class="row justify-end q-pt-xs q-pb-xs q-pr-xl text-white bg-light-blue-8 full-width ">
          <q-btn outline glossy v-if="!$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
    </div>
    <div class="row justify-center bg-grey-1 q-pb-xs full-width">
      <div class="col-4 q-mt-md q-mb-sm q-ml-sm q-mr-sm">
      <q-table
        :data="rows"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        :hide-header="false"
        :hide-bottom="true"
        separator="cell"
        row-key="name"
      >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td v-for="col in columns" v-bind:key="col.name" v-if="col.name === 'noteSel'" :props="props">
          <q-checkbox v-model="props.row[col.name]" />
        </q-td>
        <q-td v-bind:key="col.name" v-else-if="props.row['newData'] === true">
          {{props.row[col.name + '0']}}
          <q-popup-edit v-model="props.row[col.name + '0']" buttons label-set="確定" label-cancel="取消" persistent @save="updateFun(props.row, col.name, props.row[col.name + '0'])">
            <q-input v-model="props.row[col.name + '0']" />
          </q-popup-edit>
        </q-td>
        <q-td v-bind:key="col.name" v-else>
          {{props.row[col.name]}}
        </q-td>
      </q-tr>
      </q-table>
   </div>
      <div class="colum q-ml-xl q-pt-md q-pb-xs q-pr-xl text-black">
     <q-btn outline glossy label='新增' @click="modifyRowVar=false, newRowVar=true, newNote()" :disabled="newRowVar"/>
     <q-btn outline glossy label='修改' @click="modifyRowVar=true, newRowVar=true, modifyNote()" :disabled="newRowVar"/>
     <q-btn outline glossy label='刪除' @click="deleteNote()" :disabled="newRowVar"/>
     <div class="col q-mt-sm">
     <q-btn v-show="newRowVar" outline glossy label='確定' @click="newRowEnter(), newRowVar=false, modifyRowVar=false"/>
     <q-btn v-show="newRowVar" outline glossy label='取消' @click="modifyRowVar?modifyRowCancel():newRowCancel(), newRowVar=false, modifyRowVar=false"/>
      </div>
      </div>
   </div>
  </section>
</div>
</template>

<script>
import $ from 'jquery'
// import moment from 'moment'
// import 'moment-duration-format'
import Vue from 'vue'
export default {
  data: function () {
    return {
      architecture: {'level1': {label: '一階', value: '機台編號'}, 'level2': {label: '二階', value: '區'}, 'level3': {label: '三階', value: '課'}},
      organization: {
        '_id': 'organization',
        '全廠': {'all': ['成型一課', '成型二課', '成型三課']},
        '成型一課': {'1A': ['全部機台', '1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], '1B': ['全部機台'], '1C': ['全部機台']},
        '成型二課': {'2A': ['全部機台'], '2B': ['全部機台'], '2C': ['全部機台']}
      },
      initDoc: {
        '_id': 'timeSlicePoint',
        '日切換點': '08:00',
        '時段點1': '12:00',
        '時段點2': '16:30',
        '時段點3': '20:00',
        '時段點4': '23:00'
      },
      shift: {
        '_id': 'shiftCfg',
        '日班': {'from': '日切換點', 'to': '時段點2'},
        '加班': {'from': '時段點2', 'to': '時段點3'},
        '夜班': {'from': '時段點3', 'to': '日切換點'}
      },
      headName: ['select', 'timeSlicePointName', 'timeSlicePointTime'],
      shiftName: {'select': '選擇', 'shiftName': '班別', 'from': '起', 'day': '隔日', 'to': '迄'},
      rows: [],
      columns: [],
      columnsObj: {
        'noteSel': '選擇',
        'symbol': '代號',
        'definition': '定義'
      },
      rows1: [],
      columns1: [],
      config: {
        noHeader: false,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        responsive: false,
        pagination: {
          rowsPerPage: 20,
          options: [20, 50, 100, 200, 500]
        }
      },
      serverPagination: {
        rowsPerPage: 20
      },
      noteList: [],
      noteListArr: [],
      newRowVar: false,
      fullscreen: false,
      modifyRowVar: false
    }
  },
  created () {
    this.$nextTick(() => {
      // console.log('999999')
      $.get('/api/getNoteSelectedItem', {}, (docs) => {
        if (docs.type !== true) {
          // console.log('00000')
          alert(`response is not correct, err: ${docs.data}`)
        } else {
          if (docs.data.length === 0) {
          // alert('沒有派單資料')
          } else {
            // console.log('11111')
            // console.log(docs.data)
            this.noteListArr = docs.data
            var arr = Object.keys(this.noteListArr)
            // console.log('22222')
            // console.log(arr)
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
            // console.log('333')
            // console.log(this.noteList)
            // console.log('aaaaaaaaaaa')
            this.columns.length = 0
            var columnsKey = Object.keys(this.columnsObj)
            columnsKey.forEach(elm => {
              var col = {
                label: this.columnsObj[elm],
                name: elm,
                field: elm
              }
              this.columns.splice(this.columns.length, 0, col)
            })
            // var arr = Object.keys(this.noteListArr)
            arr.forEach(elm => {
              if (elm !== '_id') {
                var row = {}
                row['newData'] = false
                this.columns.forEach(column => {
                  row[column.field] = elm
                  row[column.field + '0'] = elm
                  if (column.field === 'definition') {
                    row[column.field] = this.noteListArr[elm]
                    row[column.field + '0'] = this.noteListArr[elm]
                  } else if (column.field === 'noteSel') {
                    row[column.field] = false
                  }
                })
                this.rows.splice(this.rows.length, 0, row)
              }
            })
            // console.log('this.rows')
            // console.log(this.columns)
            // console.log(this.rows)
          }
        }
      })
    })
  },
  mounted () {
  },
  sockets: {},
  methods: {
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
    sel () {

    },
    newNote () {
      this.rows.splice(this.rows.length, 0, {
        newData: true,
        noteSel: true
      })
    },
    modifyNote () {
      var selected = 0
      this.rows.forEach((row, idx, arr) => {
        if (row['noteSel'] === true) {
          selected++
          Vue.set(row, 'newData', true)
        }
      })
      if (selected === 0) {
        this.newRowVar = false
        this.modifyRowVar = false
      }
    },
    deleteNote () {
      this.rows.forEach((row, idx, arr) => {
        if (row['noteSel'] === true) {
          arr.splice(idx, 1)
        }
      })
      this.$socket.emit('deleteNote', this.rows)
    },
    newRowEnter () {
      this.rows.forEach(row => {
        if (row['newData'] === true) {
          Vue.set(row, 'newData', false)
          Vue.set(row, 'noteSel', false)
          Vue.set(row, 'symbol', row['symbol0'])
          Vue.set(row, 'definition', row['definition0'])
        }
      })
      this.$socket.emit('writeNewNote', this.rows) // 因為mongodb限制 無法只更改document中的某一個object，直接將最後的陣列全部寫入
    },
    newRowCancel () {
      this.rows.splice(this.rows.length - 1, 1)
    },
    modifyRowCancel () {
      this.rows.forEach(row => {
        if (row['newData'] === true) {
          Vue.set(row, 'newData', false)
          Vue.set(row, 'noteSel', false)
          Vue.set(row, 'symbol0', row['symbol'])
          Vue.set(row, 'definition0', row['definition'])
        }
      })
    },
    updateFun (row, col, data) {

    }
  }
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
     font-size:140%;
     font-weight:300;
    }
   span{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
    }
  .q-btn{
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight: 200;
    }
  i{
     font-size:200%;
   }
  .q-table{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .table{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .tr{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .td{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .q-tr{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
  .q-td{
     color:#000000;
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:bold;
    }
.icon-svg58:before{
  content : url("../assets/small32/printer.png");
}
</style>
