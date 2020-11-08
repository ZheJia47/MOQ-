<template>
<div class="layout-padding">
  <section class="content">
   <div class="row inline bg-light-blue-7 full-width glossy">
    <div class="col-12 q-pl-xl text-white">
      <h4>生產單位編制設定</h4>
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
    <div class="row bg-grey-1 q-pb-xs full-width">
    <div class="col-6 q-pt-md q-mt-md">
    <div class="column">
          <div class="col self-end q-mr-sm q-pb-xs q-pt-lg text-black">
      <q-btn outline glossy label='新增' @click="newLevel(), newLevelCreate=true" :disabled="edit||newLevelCreate"/>
     <q-btn outline glossy label='修改' @click="modifyLevel(), edit = !edit" :disabled="newLevelCreate"/>
     <q-btn outline glossy label='刪除' @click="deleteLevel()" :disabled="edit||newLevelCreate"/>
     <q-btn v-show="newLevelCreate" outline glossy label='確定' @click="finishNewCol(), newLevelCreate=false"/>
     </div>
    <div class="row">
      <div class="col q-mb-xl q-mt-lg q-ml-sm q-mr-sm">
      <q-table
        :data="rows"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        separator="cell"
        row-key="name"
        hide-bottom
      >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td v-for="col in columns" v-bind:key="col.name" v-if="edit === true">
            {{props.row[col.name]}}
            <q-popup-edit v-model="props.row[col.name]">
              <q-input type="text" v-model="props.row[col.name]" error/>
            </q-popup-edit>
          </q-td>
          <q-td :key="col.name" v-else-if="col.newCol === true">
            {{props.row[col.name]}}
            <q-popup-edit v-model="props.row[col.name]">
              <q-input type="text" v-model="props.row[col.name]" error/>
            </q-popup-edit>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='level0'">
            {{props.row[col.name]}}
          </q-td>
          <q-td :key="col.name" v-else>
            <q-btn :text-color="selectedLevel===col.name?'blue':'black'" outline glossy :label='props.row[col.name]' @click="showList(col.name), list=true, selectedLevel=col.name, selectedGroup0=col.name"/>
          </q-td>
        </q-tr>
      </q-table>
   </div>
   </div>
   </div>
   <div class="row justify-end q-pt-xs q-pb-xs q-pr-sm text-black">
     <q-btn v-show="list" outline glossy label='新增' @click="newRow2Var=true, rows2Modify=false, newRow2()" :disabled="newRow2Var"/>
     <q-btn v-show="list" outline glossy label='複製' @click="newRow2Var=true, rows2Modify=false, copyRow2()"  :disabled="newRow2Var"/>
     <q-btn v-show="list" outline glossy label='修改' @click="newRow2Var=true, rows2Modify=true, modifyRow2()"  :disabled="newRow2Var"/>
     <q-btn v-show="list" outline glossy label='刪除' @click="deleteRow2()"  :disabled="newRow2Var"/>
     <q-btn v-show="newRow2Var && list" outline glossy label='確定' @click="rows2Modify?modifyRow2Enter():newRow2Enter(), newRow2Var=false, rows2Modify=false"/>
     <q-btn v-show="newRow2Var && list" outline glossy label='取消' @click="rows2Modify?modifyRow2Cancel():newRow2Cancel(), newRow2Var=false, rows2Modify=false"/>
       </div>
       <div class="col-4 q-mt-md q-mb-xl q-ml-sm q-mr-sm">
      <q-table
        v-show="list"
        :data="rows2"
        :columns="columns2"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        separator="cell"
        row-key="name"
      >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td v-for="col in columns2" v-bind:key="col.name" v-if="props.row['newData'] === false && col.name !== 'rowSel'" :props="props">
            {{ props.row[col.name] }}
          </q-td>
        <q-td v-bind:key="col.name" v-else-if="col.name === 'rowSel'" :props="props">
            <q-checkbox v-model="props.row[col.name]" />
          </q-td>
          <q-td v-bind:key="col.name" v-else-if="props.row['newData'] === true && col.name === 'test'" :props="props">
            <q-input v-model="props.row[col.name + 'ND']" />
          </q-td>
          <q-td v-bind:key="col.name" v-else-if="props.row['newData'] === true && col.name === 'test1'" :props="props">
            <q-select
              v-model="props.row[col.name + 'ND']"
              radio
             :options="propertyArr"
            />
          </q-td>
          <q-td v-bind:key="col.name" v-else-if="props.row['newData'] === true && col.name === 'father'" :props="props">
            <q-select
              v-model="props.row[col.name + 'ND']"
             :options="rows2Arr"
            />
          </q-td>
          <q-td v-bind:key="col.name" v-else-if="props.row['newData'] === true" :props="props">
            {{ props.row[col.name + 'ND'] }}
          </q-td>
      </q-tr>
      </q-table>
   </div>
   </div>
   <div class="col-6 q-pt-xl q-mt-sm">
   <div class="col-6">
       <div v-show="false" class="row justify-center q-pb-xs text-black">
     <q-btn outline glossy label='新增' @click="newRow1Var=true, rows1Modify=false, newMachine()" :disabled="newRow1Var"/>
     <q-btn outline glossy label='複製' @click="newRow1Var=true, rows1Modify=false, copyMachine()" :disabled="newRow1Var"/>
     <q-btn outline glossy label='修改' @click="newRow1Var=true, rows1Modify=true, modifyMachine()" :disabled="newRow1Var"/>
     <q-btn outline glossy label='刪除' @click="deleteMachine()" :disabled="newRow1Var"/>
     <q-btn outline glossy label='匯出資料' @click="exportMachine(), newRow1Var=true" :disabled="newRow1Var"/>
     <q-btn outline glossy label='外部匯入' @click="importMachine(), newRow1Var=true" :disabled="newRow1Var"/>
       </div>
 <div class="row justify-center q-pt-xs q-pb-xs text-black">
    <q-btn v-show="newRow1Var" outline glossy label='確定' @click="newRow1Enter(), newRow1Var=false, rows1Modify=false"/>
     <q-btn v-show="newRow1Var" outline glossy label='取消' @click="rows1Modify?modifyRow1Cancel():newRow1Cancel(), newRow1Var=false, rows1Modify=false"/>
     </div>
      <div class="col-4 q-mt-md q-mb-sm q-ml-sm q-mr-sm">
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
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td v-for="col in columns1" v-bind:key="col.name" v-if="props.row['newData'] === false && col.name !== 'machineSel'" :props="props">
            {{ props.row[col.name] }}
          </q-td>
        <q-td v-bind:key="col.name" v-else-if="col.name === 'machineSel'" :props="props">
            <q-checkbox v-model="props.row[col.name]" />
          </q-td>
          <q-td v-bind:key="col.name" v-else-if="props.row['newData'] === true  && col.name !== 'machineSel' && col.name !== 'level0' && col.name !== '1'" :props="props">
            <q-select
              v-model="props.row[col.name]"
              radio
             :options="rows1SelOption[col.name]"
             @input="rows1SelEvent"
            />
          </q-td>
          <q-td v-bind:key="col.name" v-else-if="props.row['newData'] === true" :props="props">
            {{ props.row[col.name] }}
          </q-td>
      </q-tr>
      </q-table>
   </div>
   </div>
   </div>
   </div>
  </section>
</div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
export default {
  data: function () {
    return {
      rows1Modify: false,
      rows2Modify: false,
      selectedGroup0: '',
      fullscreen: false,
      rows: [],
      columns: [],
      rows1: [],
      columns1: [],
      rows2: [],
      columns2: [],
      rows2Arr: [],
      config: {
        noHeader: false,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        responsive: false,
        pagination: {
          rowsPerPage: 50,
          options: [20, 50, 100, 200, 500]
        }
      },
      serverPagination: {
        rowsPerPage: 50
      },
      edit: false,
      newLevelCreate: false,
      list: false,
      level: [],
      newRow2Var: false,
      propertyArr: [],
      selectedLevel: 0,
      newRow1Var: false,
      rows1SelOption: {1: [{label: '111', value: '111'}, {label: '222', value: '222'}], 2: [{label: '222', value: '222'}, {label: '444', value: '444'}], 3: [{label: '333', value: '333'}, {label: '666', value: '666'}]}
    }
  },
  created () {
    // var architecture = {'level1': {label: '一階', value: '機台編號'}, 'level2': {label: '二階', value: '區'}, 'level3': {label: '三階', value: '課'}}
    /* var architectureKeys = Object.keys(architecture)
    this.columns.length = 0
    this.rows.length = 0
    var row = {}
    this.columns.splice(this.columns.length, 0, {
      label: '階層',
      field: 'level0',
      name: 'level0'
    })
    row[(this.columns[0].name)] = '單位名稱'
    architectureKeys.forEach(elm => {
      var obj = {
        label: (architecture[elm]).label,
        field: elm,
        name: elm
      }
      // console.log(elm)
      this.columns.splice(this.columns.length, 0, obj)
      row[elm] = (architecture[elm]).value
    })
    this.rows.splice(this.rows.length, 0, row)
    // console.log(this.columns)
    // console.log(this.rows)
    // ----------------------------------
    this.columns1.splice(this.columns1.length, 0, {
      label: '選擇',
      field: 'machineSel',
      name: 'machineSel'
    })
    this.columns.forEach(column => {
      var obj = {}
      // console.log(column)
      if (column.field !== 'level0') {
        obj['label'] = (this.rows[0])[column['field']]
        obj['field'] = column.field
        obj['name'] = column.name
        // console.log(obj)
      } else {
        obj['label'] = '財產編號'
        obj['field'] = column.field
        obj['name'] = column.name
        // console.log(obj)
      }
      this.columns1.splice(1, 0, obj)
    }) */
    $.get('/api/getPropertyNumber/', {}, (results) => {
      var rets = results.data
      this.propertyArr.splice(0, this.propertyArr.length)
      rets.forEach(ret => {
        this.propertyArr.splice(this.propertyArr.length, 0, {
          label: ret,
          value: ret
        })
      })
      // console.log('propertyArr')
      // console.log(this.propertyArr)
    })
  },
  mounted () {
    // console.log('00000000')
    makeArchitecture(this.level, this.columns, this.columns1, this.rows, this.rows1, function (columns, columns1, rows, rows1, organ, level) {
      var architecture = organ
      var architectureKeys = Object.keys(architecture)
      // console.log(111111110000)
      columns.length = 0
      rows.length = 0
      var row = {}
      // console.log(11111111)
      columns.splice(columns.length, 0, {
        label: '階層',
        field: 'level0',
        name: 'level0',
        newCol: false
      })
      // console.log(22222222222)
      row[(columns[0].name)] = '單位名稱'
      architectureKeys.forEach(elm => {
        var label = '階'
        switch (elm) {
          case '1': label = '一' + label
            break
          case '2': label = '二' + label
            break
          case '3': label = '三' + label
            break
          case '4': label = '四' + label
            break
          case '5': label = '五' + label
            break
          case '6': label = '六' + label
            break
          case '7': label = '七' + label
            break
          case '8': label = '八' + label
            break
          case '9': label = '九' + label
            break
        }
        var obj = {
          label: label, // (architecture[elm]).label,
          field: elm,
          name: elm,
          newCol: false
        }
        // console.log('elm')
        // console.log(elm)
        // console.log(columns)
        columns.splice(columns.length, 0, obj)
        row[elm] = (architecture[elm]).value
      })
      rows.splice(rows.length, 0, row)
      // console.log(columns)
      // console.log(rows)
      // ----------------------------------
      /* columns1.splice(columns1.length, 0, {
        label: '選擇',
        field: 'machineSel',
        name: 'machineSel'
      }) */
      columns.forEach(column => {
        var obj = {}
        // console.log(column)
        if (column.field !== 'level0') {
          obj['label'] = (rows[0])[column['field']]
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
          columns1.splice(0, 0, obj)
        } else {
          obj['label'] = '財產編號'
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
          columns1.splice(columns1.length, 0, obj)
        }
        // columns1.splice(1, 0, obj)
        // constructLinkedTable(this.level, this.columns1, this.rows1)
      })
      // console.log('column1')
      // console.log(columns1)
      // console.log(rows1)
      // console.log(level)
      constructLinkedTable(level, columns1, rows1)
    })
    // 建立財產清單
    // console.log('this.level')
    // console.log(this.level)
    /* this.propertyArr.splice(0, this.propertyArr.length)
    var ptList = this.level.filter(elm => {
      return elm.level === 1
    })
    ptList.forEach(pt => {
      this.propertyArr.splice(this.propertyArr.length, 0, {
        label: pt.data,
        value: pt.data
      })
    }) */
  },
  sockets: {},
  methods: {
    reloadLinkedTable () {
      constructLinkedTable(this.level, this.columns1, this.rows1)
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
    rowClick (row) {
      this.$q.notify({
        color: 'primary',
        icon: 'local_dining',
        message: `Hmm, are you sure? It has ${row.calories} calories.`,
        actions: [{
          label: 'Yes, eat!',
          handler: () => {
            this.$q.notify({ color: 'positive', icon: 'done', message: 'Yummy. Thanks! Now one more.' })
          }
        }]
      })
    },
    sel () {

    },
    newLevel () {
      // var index = parseInt((((this.columns[this.columns.length - 1]).name).split('level'))[1])
      var index = parseInt(((this.columns[this.columns.length - 1]).name))
      // console.log(((this.columns[this.columns.length - 1]).name).split('level'))
      // console.log(index)
      if (index > 8) return
      var field = index + 1 // 'level' + (index + 1)
      var label = '階'
      switch (index) {
        case 0: label = '一' + label
          break
        case 1: label = '二' + label
          break
        case 2: label = '三' + label
          break
        case 3: label = '四' + label
          break
        case 4: label = '五' + label
          break
        case 5: label = '六' + label
          break
        case 6: label = '七' + label
          break
        case 7: label = '八' + label
          break
        case 8: label = '九' + label
          break
      }
      var newColumn = {}
      newColumn['label'] = label
      newColumn['field'] = field.toString()
      newColumn['name'] = field.toString()
      newColumn['newCol'] = true
      this.columns.splice(this.columns.length, 0, newColumn)
      Vue.set(this.rows[0], newColumn['field'], field.toString())
      // ----------------------------------------------------------
      this.columns1.length = 0
      this.columns1.splice(this.columns1.length, 0, {
        label: '選擇',
        field: 'machineSel',
        name: 'machineSel'
      })
      this.columns.forEach(column => {
        var obj = {}
        // console.log(column)
        if (column.field !== 'level0') {
          obj['label'] = (this.rows[0])[column['field']]
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
        } else {
          obj['label'] = '財產編號'
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
        }
        this.columns1.splice(1, 0, obj)
      })
    },
    modifyLevel () {
      // ----------------------------------------------------------
      this.columns1.length = 0
      this.columns1.splice(this.columns1.length, 0, {
        label: '選擇',
        field: 'machineSel',
        name: 'machineSel'
      })
      this.columns.forEach(column => {
        var obj = {}
        // console.log(column)
        if (column.field !== 'level0') {
          obj['label'] = (this.rows[0])[column['field']]
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
        } else {
          obj['label'] = '財產編號'
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
        }
        this.columns1.splice(1, 0, obj)
      })
    },
    deleteLevel () {

    },
    createRows1Option () {
      this.columns1.forEach(column1 => {
        if (column1.nemw !== 'machineSel' && column1.name !== 'level0') {
          var levelArr = this.level.filter(elm => {
            return parseInt(elm.level) === parseInt(column1.name)
          })
          // console.log('前')
          this.rows1SelOption[column1.name] = []
          // console.log('後')
          levelArr.forEach(elm => {
            this.rows1SelOption[column1.name].splice(this.rows1SelOption[column1.name].length, 0, {
              label: elm._id,
              value: elm._id
            })
          })
        }
      })
    },
    newMachine () {
      this.rows1.splice(this.rows1.length, 0, {
        newData: true,
        machineSel: true
      })
      this.createRows1Option()
    },
    rows1SelEvent (a) {
      // // console.log('rows1SelEvent')
      // console.log(a)
      // console.log(this.level)
      var tgtLevel = this.level.filter(elm => {
        // if (parseInt(elm.level) === 1) {
        return elm._id === a
        // }
      })
      // console.log(tgtLevel)
      if (tgtLevel.length !== 0) {
        if (parseInt(tgtLevel[0].level) === 1) {
          this.rows1.forEach(row1 => {
            if (row1.machineSel) {
              // console.log('level0')
              Vue.set(row1, 'level0', tgtLevel[0].data)
            }
          })
        } else {
          // 設定選單 未被指定以及被指定為旗下層的整合出一個陣列
        }
      }
    },
    newRow1Enter () {
      this.rows1.forEach(row1 => {
        if (row1['newData'] === true) {
          Vue.set(row1, 'newData', false)
          Vue.set(row1, 'machineSel', false)
          // console.log(this.level)
        }
      })
    },
    modifyRow1Cancel () {
      this.rows1.forEach(row1 => {
        if (row1['newData'] === true) {
          Vue.set(row1, 'newData', false)
          Vue.set(row1, 'machineSel', false)
        }
      })
    },
    newRow1Cancel () {
      this.rows1.splice(this.rows1.length - 1, 1)
    },
    newRow2 () {
      this.rows2.splice(this.rows2.length, 0, {
        newData: true,
        rowSel: true
      })
    },
    newRow2Enter () {
      this.rows2.forEach(row2 => {
        if (row2['newData'] === true) {
          Vue.set(row2, 'test', row2['testND'] || '')
          Vue.set(row2, 'test1', row2['test1ND'] || '')
          Vue.set(row2, 'father', row2['fatherND'] || '')
          Vue.set(row2, 'newData', false)
          Vue.set(row2, 'rowSel', false)
          var obj = {
            _id: row2['test' + 'ND'] || '',
            father: row2['fatherND'] || '',
            son: [],
            level: parseInt(this.selectedLevel),
            levelName: (this.rows[0])[this.selectedLevel],
            data: row2['test1' + 'ND'] || '',
            abridge: '機台',
            linked: false
          }
          this.level.splice(this.level.length, 0, obj)
          this.$socket.emit('setNewOrganization', obj)
          // console.log(this.level)
        }
      })
      this.reloadLinkedTable()
    },
    modifyRow2Enter () {
      this.rows2.forEach(row2 => {
        if (row2['newData'] === true) {
          var tgt = this.level.find(elm => {
            return row2['test'] === elm._id
          })
          if (tgt === undefined) {
            return
          }
          var obj = [{
            _id: row2['test'] || ''
          }, {
            _id: row2['test' + 'ND'] || '',
            father: row2['fatherND'],
            son: [],
            level: parseInt(this.selectedLevel),
            levelName: (this.rows[0])[this.selectedLevel],
            data: row2['test1' + 'ND'] || '',
            abridge: '機台',
            linked: false
          }]
          // this.level.splice(this.level.length, 0, obj)
          this.$socket.emit('updateOrganization', obj)
          Vue.set(tgt, '_id', row2['test' + 'ND'])
          Vue.set(tgt, 'data', row2['test1' + 'ND'] || '')
          Vue.set(tgt, 'father', row2['father' + 'ND'])
          Vue.set(row2, 'test', row2['testND'])
          Vue.set(row2, 'test1', row2['test1ND'])
          Vue.set(row2, 'father', row2['fatherND'])
          Vue.set(row2, 'newData', false)
          Vue.set(row2, 'rowSel', false)
          // console.log('this.level ')
          // console.log(this.level)
          // console.log(obj)
        }
      })
      this.reloadLinkedTable()
    },
    deleteRow2 () {
      this.rows2.forEach((row2, idx, arr) => {
        if (row2['rowSel'] === true) {
          this.level.forEach((elm, index, AR) => {
            if (elm._id === row2['test']) {
              AR.splice(index, 1)
            }
          })
          arr.splice(idx, 1)
          this.$socket.emit('deleteOrganization', row2)
        }
      })
      this.reloadLinkedTable()
    },
    modifyRow2 () {
      var selected = 0
      this.rows2.forEach((row2, idx, arr) => {
        if (row2['rowSel'] === true) {
          selected++
          Vue.set(row2, 'newData', true)
        }
      })
      if (selected === 0) {
        this.newRow2Var = false
        this.rows2Modify = false
      }
    },
    copyRow2 () {
      var selected = 0
      var createSuccess = false
      this.rows2.forEach((row2, idx, arr) => {
        if (row2['rowSel'] === true) {
          selected++
          var cpyRow2 = {}
          this.columns2.forEach(element => {
            if (element.name !== 'rowSel') {
              cpyRow2[element.name] = row2[element.name]
            }
          })
          cpyRow2['test' + 'ND'] = row2['test']
          cpyRow2['test1' + 'ND'] = row2['test1']
          cpyRow2['rowSel'] = true
          cpyRow2['newData'] = true
          Vue.set(row2, 'rowSel', false)
          arr.splice(arr.length, 0, cpyRow2)
          createSuccess = true
        }
      })
      if (selected === 0) {
        this.newRow2Var = false
      }
      // console.log('this.newRow2Var = ' + this.newRow2Var)
      if (createSuccess) {
        // Vue.set(this.rows2[this.rows2.length - 1], 'rowSel', true)
        // Vue.set(this.rows2[this.rows2.length - 1], 'newData', true)
      }
    },
    modifyRow2Cancel () {
      // console.log('row2 cancel')
      this.rows2.forEach(row2 => {
        if (row2['newData'] === true) {
          Vue.set(row2, 'newData', false)
          Vue.set(row2, 'rowSel', false)
          Vue.set(row2, 'test' + 'ND', '')
          Vue.set(row2, 'test1' + 'ND', '')
        }
      })
    },
    newRow2Cancel () {
      this.rows2.splice(this.rows2.length - 1, 1)
      // console.log(this.rows2)
    },
    finishNewCol () {
      this.columns.forEach(column => {
        Vue.set(column, 'newCol', false)
      })
      // ----------------------------------------------------------
      this.columns1.length = 0
      this.columns1.splice(this.columns1.length, 0, {
        label: '選擇',
        field: 'machineSel',
        name: 'machineSel'
      })
      this.columns.forEach(column => {
        var obj = {}
        // console.log(column)
        if (column.field !== 'level0') {
          obj['label'] = (this.rows[0])[column['field']]
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
        } else {
          obj['label'] = '財產編號'
          obj['field'] = column.field
          obj['name'] = column.name
          // console.log(obj)
        }
        this.columns1.splice(1, 0, obj)
      })
    },
    showList (levelNum) {
      var str = 'test'
      // console.log('levelNum:' + levelNum)
      // console.log(this.level)
      var levelFlt = this.level.filter(elm => {
        return parseInt(elm.level) === parseInt(levelNum)
      })
      var hLevelFlt = this.level.filter(elm => {
        return parseInt(elm.level) === (parseInt(levelNum) + 1)
      })
      this.rows2Arr.splice(0, this.rows2Arr.length)
      hLevelFlt.forEach(elm => {
        this.rows2Arr.splice(this.rows2Arr.length, 0, {
          label: elm._id,
          value: elm._id
        })
      })
      // console.log(levelFlt)
      this.columns2.splice(0, this.columns2.length)
      this.columns2.length = 0
      if (parseInt(levelNum) > 1) {
        this.columns2.splice(this.columns2.length, 0, {
          label: '選取',
          name: 'rowSel',
          field: 'rowSel'
        })
        if (hLevelFlt.length !== 0) {
          this.columns2.splice(this.columns2.length, 0, {
            label: '隸屬',
            name: 'father',
            field: 'father'
          })
        }
        this.columns2.splice(this.columns2.length, 0, {
          label: '名稱',
          name: str,
          field: str
        })
        this.rows2.splice(0, this.rows2.length)
        this.rows2.length = 0
        levelFlt.forEach(elm => {
          var obj = {}
          obj[str] = elm._id
          obj[str + 'ND'] = elm._id
          obj['father'] = elm['father']
          obj['father' + 'ND'] = elm['father']
          obj['newData'] = false
          obj['rowSel'] = false
          this.rows2.splice(this.rows2.length, 0, obj)
        })
      } else {
        this.columns2.splice(this.columns2.length, 0, {
          label: '',
          name: 'rowSel',
          field: 'rowSel'
        })
        this.columns2.splice(this.columns2.length, 0, {
          label: '隸屬',
          name: 'father',
          field: 'father'
        })
        this.columns2.splice(this.columns2.length, 0, {
          label: '機台編號',
          name: str,
          field: str
        })
        this.columns2.splice(this.columns2.length, 0, {
          label: '設備編號',
          name: str + '1',
          field: str + '1'
        })
        this.rows2.splice(0, this.rows2.length)
        this.rows2.length = 0
        levelFlt.forEach(elm => {
          var obj = {}
          obj[str] = elm._id
          obj[str + 'ND'] = elm._id
          obj[str + '1'] = elm.data
          obj[str + '1ND'] = elm.data
          obj['father'] = elm['father']
          obj['fatherND'] = elm['father']
          obj['newData'] = false
          obj['rowSel'] = false
          this.rows2.splice(this.rows2.length, 0, obj)
        })
      }
      // console.log('columns2:' + this.columns2)
      // console.log(this.columns2)
      // console.log('rows2:' + this.rows2)
      // console.log(this.rows2)
    },
    copyMachine () {
      var selected = 0
      this.rows1.forEach((row1, idx, arr) => {
        if (row1['machineSel'] === true) {
          selected++
          var cpyRow1 = {}
          this.columns1.forEach(element => {
            if (element.name !== 'machineSel') {
              cpyRow1[element.name] = row1[element.name]
            }
          })
          cpyRow1['machineSel'] = true
          cpyRow1['newData'] = false
          Vue.set(row1, 'machineSel', false)
          arr.splice(arr.length, 0, cpyRow1)
        }
      })
      if (selected === 0) {
        this.newRow1Var = false
      }
      this.createRows1Option()
    },
    modifyMachine () {
      var selected = 0
      this.rows1.forEach((row1, idx, arr) => {
        if (row1['machineSel'] === true) {
          selected++
          Vue.set(row1, 'newData', true)
        }
      })
      if (selected === 0) {
        this.newRow1Var = false
        this.rows1Modify = false
      }
      this.createRows1Option()
    },
    deleteMachine () {
      this.rows1.forEach((row1, idx, arr) => {
        if (row1['machineSel'] === true) {
          arr.splice(idx, 1)
        }
      })
    },
    exportMachine () {},
    importMachine () {}
  }
}
function makeArchitecture (level, columns, columns1, rows, rows1, callback) {
  /* var Level = [{
    _id: '1A01', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI14', abridge: '機台'
  }, {
    _id: '1A02', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI52', abridge: '機台'
  }, {
    _id: '1A03', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI34', abridge: '機台'
  }, {
    _id: '1A04', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI20', abridge: '機台'
  }, {
    _id: '1A05', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI18', abridge: '機台'
  }, {
    _id: '1A06', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI17', abridge: '機台'
  }, {
    _id: '1A07', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI16', abridge: '機台'
  }, {
    _id: '1A08', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI15', abridge: '機台'
  }, {
    _id: '1A09', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台'
  }, {
    _id: '1B01', father: '1B', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台'
  }, {
    _id: '2C01', father: '2C', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台'
  }, {
    _id: '1A', father: '成型一課', son: ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], level: 2, levelName: '區', data: ''
  }, {
    _id: '1B', father: '成型一課', son: ['1B01'], level: 2, levelName: '區', data: ''
  }, {
    _id: '1C', father: '成型一課', son: [], level: 2, levelName: '區', data: ''
  }, {
    _id: '2C', father: '成型二課', son: ['2C01'], level: 2, levelName: '區', data: ''
  }, {
    _id: '成型一課', father: '全廠', son: ['1A', '1B', '1C'], level: 3, levelName: '課', data: ''
  }, {
    _id: '成型二課', father: '全廠', son: ['2A', '2B', '2C'], level: 3, levelName: '課', data: ''
  }, {
    _id: '全廠', father: 'organization', son: ['成型一課', '成型二課'], level: 4, levelName: '廠', data: ''
  }] */
  $.get('/api/getOrganizationStructure/', {}, (results) => {
    var rets = results.data
    rets.forEach(elm => {
      level.splice(level.length, 0, elm)
    })
    /* var top = level.filter(lv => {
      return lv.levelName === '廠'
    }) */
    var obj = {}
    level.forEach(lv => {
      if (!obj.hasOwnProperty(lv.level)) {
        var str = lv.level + '階'
        obj[lv.level] = {label: str, value: lv.levelName}
        // console.log(top)
        /* if (lv.level !== top[0].level) {
          var str = lv.level + '階'
          obj[lv.level] = {label: str, value: lv.levelName}
        } */
      }
    })
    // console.log('getOrganizationStructure')
    // console.log(rets)
    // console.log(level)
    callback(columns, columns1, rows, rows1, obj, level)
  })
}
function constructLinkedTable (level, columns1, rows1) {
  var level1Flts = level.filter(elm1 => {
    return elm1.level === 1
  })
  rows1.splice(0, rows1.length)
  level1Flts.forEach(level1Flt => {
    var rowObj = {}
    var arr = findDataRelation(level, level1Flt)
    // console.log('findDataRelation')
    // console.log(arr)
    arr.forEach(elm => {
      rowObj[elm.level] = elm._id
    })
    rowObj[1] = level1Flt._id
    rowObj['newData'] = false
    rowObj['machineSel'] = false
    rowObj['level0'] = level1Flt.data
    /* columns1.forEach(column => {
      if (parseInt(column.name) === parseInt(level1Flt.level)) {
        rowObj[column.name] = level1Flt._id
      } else if (parseInt(column.name) === parseInt(level1Flt.level) + 1) {
        rowObj[column.name] = level1Flt.father
      } else if (column.name === 'level0') {
        rowObj[column.name] = level1Flt.data
      } else if (column.name === 'machineSel') {
        rowObj[column.name] = false
      }
    }) */
    // console.log('level1Flt')
    // console.log(level1Flt)
    if (level1Flt.linked === true) {
      rows1.splice(rows1.length, 0, rowObj)
    } else {
      rows1.splice(rows1.length, 0, rowObj)
    }
  })
}
function findDataRelation (level, base) {
  var retArr = []
  var next = level.filter(elm => {
    return elm._id === base.father
  })
  if (next.length === 0) {
    return [base] // retArr
  }
  retArr.splice(retArr.length, 0, base)
  retArr = retArr.concat(findDataRelation(level, next[0]))
  return retArr
}
</script>

<style lang="stylus">
$sizes = {
  xs: 0,
  sm: 575px
  md: 767px
  lg: 991px
  xl: 1199px
  xxl:1600px
}
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
