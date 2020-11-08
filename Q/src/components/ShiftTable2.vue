<template>
<div class="layout-padding">
  <q-toolbar color="secondary">
      <q-btn v-if="!fullscreen" @click="rz(), fullscreen=true">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn v-else-if="fullscreen" @click="srz(), fullscreen=false">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn label='列印' icon="icon-svg58" @click="print()"/>
    </q-toolbar>
  <section class="content">
    <div class="row center-block">
      <h5>行事曆</h5>
    </div>
    <tr>
      <td style=" width:40%;"></td>
      <td style=" width:50%;">
        <div class="center-block">
          <q-datetime-picker v-model="model" type="date"
            :first-day-of-week="1"
            @input="val => change(val)" />
        </div>
      </td>
      <td style=" width:30%;"></td>
    </tr>
    <div class="center-block">
    </div>
    <q-btn label="載入預設" @click="loadDefaultSetting"/>
    <q-field>
    <q-select color="white" v-model="departmentSelected" class="no-margin" :options="departmentArr" stack-label=" " :display-value="departmentSelected" toggle error  @input="changeSelected()">
    </q-select>機台排班表
    </q-field>
    <table class="q-table responsive" border="10" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
    <div id="ACC">
      <!--<q-table
        :data="rows2"
        :columns="columns2"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        :hide-bottom="true"
        hide-header
        separator="cell"
        row-key="name"
        color="secondary"
      >
      <q-tr slot="body" slot-scope="props" :props="props">
      <q-td v-for="day in columns2" v-bind:key="day.name" v-if="(props.row['index']<=2 && day.name==='machineID')">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="(props.row['index']<=1 && day.name.indexOf('1') > -1)" :colspan="spanWidth">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="props.row['index']===2">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="(props.row['index']>2 && day.name==='machineID')">
          {{props.row[day.name]}}
      </q-td>
      <q-td :key="day.name" :props="props" v-else-if="props.row['index']>2 && day.name!=='machineID'">
        <q-checkbox v-model="props.row[day.name]"
          @input="showInfor(props, day.name)"
        />
      </q-td>
      </q-tr>
    </q-table>-->
    <q-table
        :data="rows3"
        :columns="columns2"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        :hide-bottom="true"
        separator="cell"
        row-key="name"
        color="secondary"
      >
      <q-tr slot="body" slot-scope="props" :props="props">
      <q-td v-for="day in columns2" v-bind:key="day.name" v-if="(props.row['index']<=2 && day.name==='machineID')">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="(props.row['index']<=1 && day.name.indexOf('1') > -1)" :colspan="spanWidth">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="props.row['index']===2">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="(props.row['index']>2 && day.name==='machineID')">
          {{props.row[day.name]}}
      </q-td>
      <q-td :key="day.name" :props="props" v-else-if="props.row['index']>2 && day.name!=='machineID'">
        <q-checkbox v-model="props.row[day.name]"
          @input="showInfor(props, day.name)"
        />
      </q-td>
      </q-tr>
    </q-table>
    </div>
  </table>
  </section>
</div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
// import orderNumber from './OrderNumberEdit'
// import moldNum from './MoldNumberEdit'

export default {
  name: 'Tables1',
  props: [
    'zoneS',
    'organ'
  ],
  data: function () {
    return {
      departmentSelected: '',
      departmentArr: [],
      shiftKeys: [],
      fullscreen: false,
      model: moment().format('YYYY-MM-DD'),
      monReg: '',
      rrrArray: [{'1': 1000}],
      checked: [],
      text: 'text',
      one: 1,
      two: 2,
      three: 3,
      rows1: [],
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
      day: moment().format('dddd'),
      serverPagination: {
        rowsPerPage: 200
      },
      rows3: [],
      rows2: [],
      columns3: [
        {
          id: 1,
          'machineID': '1A01',
          'satdayFirst': 'LLLLLL'
        },
        {
          'machineID': '1A02',
          'satdaySecond': 'RRRRRR'
        },
        {
          id: 2,
          'machineID': '1A03',
          'satdayThird': 'Lolita'
        }
      ],
      columns2: [],
      checkBoxList: [],
      type: '',
      x: 0,
      y: [],
      min: 3,
      max: 2200,
      moldNumberList: [],
      status: null,
      machineID: '1A01',
      machineList: [],
      orderNumberList: [],
      selectedDate: moment().format('YYYY-MM-DD'),
      rows: [],
      config1: {
        noHeader: true,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 5,
        rightStickyColumns: 0,
        responsive: false,
        messages: {
          noData: '沒有資料可供顯示.',
          noDataAfterFiltering: '沒有資料可供顯示. 請重新檢視您的搜尋條件.'
        }
      },
      config: {
        // [REQUIRED] Set the row height
        // rowHeight: '200px',
        // (optional) Title to display
        // title: 'Data Table',
        // (optional) No columns header
        noHeader: false,
        // (optional) Display refresh button
        refresh: false,
        // (optional)
        // User will be able to choose which columns
        // should be displayed
        columnPicker: false,
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
        },
        bodyStyle: {
          maxHeight: '500px'
        },
        classes: 'bg-purple-1'
      },
      dayNameList: [
        {engName: 'monday', chnName: '一'},
        {engName: 'tuesday', chnName: '二'},
        {engName: 'wednesday', chnName: '三'},
        {engName: 'thursday', chnName: '四'},
        {engName: 'friday', chnName: '五'},
        {engName: 'saturday', chnName: '六'},
        {engName: 'sunday', chnName: '日'}
      ],
      dayNameShiftList: [],
      spanWidth: 0
    }
  },
  created () {
    this.$q.loading.show({
      delay: 400 // ms
    })
    this.getShiftNameArr()
    if (this.organ['test'].length > 0) {
      this.organ['test'].forEach(elm => {
        if (elm.level === 3) {
          this.departmentArr.splice(this.departmentArr.length, 0, {
            label: elm._id,
            value: elm._id
          })
        }
      })
      this.departmentSelected = this.departmentArr[0].label
    }
  },
  computed: {
  },
  watch: {
    sectionForm: function () {

    },
    selectedDate: function () {

    },
    model (val) {
      this.type = typeof val
      // this.change(val)
    },
    minMaxModel () {

    }
    /* rows2 (val) {
      val.sort()
    } */
  },
  sockets: {
  },
  mounted () {
  },
  methods: {
    changeSelected () {
      // this.departmentSelected
      this.change(this.model)
    },
    loadDefaultSetting () {
      this.$q.loading.show({
        delay: 400 // ms
      })
      var machineIDs = this.rows3.map(row2 => {
        return row2.machineID
      }).filter(elm => { return elm !== '' })
      // console.log(1111)
      // console.log(machineIDs)
      var tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(0, 'd').format('YYYY-MM-DD')
      $.get('/api/loadDefaultSettingShiftTable/' + machineIDs + '/' + tgtdate, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
          this.$q.loading.hide()
        } else {
          if (results.data) {
            // this.$router.push({name: 'ShiftTable', params: {zoneS: this.zoneS}})
            setTimeout(() => {
              this.getShiftNameArr()
            }, 3000)
          }
        }
      })
    },
    getShiftNameArr () {
      // console.log('getShiftNameArr')
      // this.shiftKeys.splice(0, this.shiftKeys.length)
      // this.shiftKeys.length = 0
      $.get('/api/shiftTimeConfig', {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
          this.$q.loading.hide()
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
          this.$q.loading.hide()
        } else {
          this.shiftKeys = results.data
          /* results.data.forEach(elm => {
            this.shiftKeys.splice(this.shiftKeys.length, 0, elm)
          }) */
          this.mappingTable()
        }
      })
    },
    mappingTable () {
      // console.log('mappingTable')
      // console.log(this.rows2)
      var shiftKeysArr = Object.keys(this.shiftKeys).filter(elm => {
        return elm !== '_id'
      })
      this.spanWidth = shiftKeysArr.length
      // console.log(shiftKeysArr)
      var daysAWwwk = 7
      this.dayNameShiftList.splice(0, this.dayNameShiftList.length)
      this.dayNameShiftList.length = 0
      // this.columns2 = new Array(shiftKeysArr.length * daysAWwwk + 1) // 22
      this.columns2.splice(0, this.columns2.length)
      this.columns2.splice(0, 0, {
        label: '',
        field: 'machineID',
        name: 'machineID',
        width: '5px',
        filter: false,
        sort: false,
        align: 'center',
        classes: 'bg-light-blue'
      })
      for (var i = 0; i < daysAWwwk; i++) {
        var str
        switch (i) {
          case 0:
            str = 'monday'
            break
          case 1:
            str = 'tuesday'
            break
          case 2:
            str = 'wednesday'
            break
          case 3:
            str = 'thursday'
            break
          case 4:
            str = 'friday'
            break
          case 5:
            str = 'saturday'
            break
          case 6:
            str = 'sunday'
            break
        }
        shiftKeysArr.forEach(elm => {
          this.dayNameShiftList.splice(this.dayNameShiftList.length, 0, str + elm)
          this.columns2.splice(this.columns2.length, 0, {
            label: elm,
            field: str + this.shiftKeys[elm].key,
            name: str + this.shiftKeys[elm].key,
            width: '5px',
            filter: false,
            sort: false,
            align: 'center',
            classes: 'bg-purple-1'
          })
        })
        // this.dayNameShiftList.splice(this.dayNameShiftList.length, 0, str + 'First')
        // this.dayNameShiftList.splice(this.dayNameShiftList.length, 0, str + 'Second')
        // this.dayNameShiftList.splice(this.dayNameShiftList.length, 0, str + 'Third')
        /* this.columns2[3 * i + 1] = {
          label: '日班',
          field: str + 'First',
          name: str + 'First',
          width: '5px',
          filter: false,
          sort: false,
          align: 'center',
          classes: 'bg-purple-1'
        }
        this.columns2[3 * i + 2] = {
          label: '加班',
          field: str + 'Second',
          name: str + 'Second',
          width: '5px',
          filter: false,
          sort: false,
          align: 'center',
          classes: 'bg-purple-2'
        }
        this.columns2[3 * i + 3] = {
          label: '夜班',
          field: str + 'Third',
          name: str + 'Third',
          width: '5px',
          filter: false,
          sort: false,
          align: 'center',
          classes: 'bg-purple-3'
        } */
      }
      this.change(this.model)
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
    sel () {
      // console.log(this.serverPagination.rowsNumber)
    },
    elmClk (cellval) {
      if (cellval.value === true) {
        this.rows2[cellval.row.__index][cellval.col.field] = false
      } else {
        this.rows2[cellval.row.__index][cellval.col.field] = true
      }
    },
    showInfor (cellval, key) {
      var strArray = key.split('day')
      var tgtdate = ''
      switch (strArray[0]) {
        case 'mon':
          tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(0, 'd').format('YYYY-MM-DD')
          break
        case 'tues':
          tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD')
          break
        case 'wednes':
          tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(2, 'd').format('YYYY-MM-DD')
          break
        case 'thurs':
          tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(3, 'd').format('YYYY-MM-DD')
          break
        case 'fri':
          tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(4, 'd').format('YYYY-MM-DD')
          break
        case 'satur':
          tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(5, 'd').format('YYYY-MM-DD')
          break
        case 'sun':
          tgtdate = moment(this.monReg, 'YYYY-MM-DD').add(6, 'd').format('YYYY-MM-DD')
          break
      }
      // console.log('hello')
      // console.log(cellval.row)
      // console.log(this.rows3[cellval.row.__index].machineID)
      // console.log('hello')
      $.get('/api/updateShiftTable/' + this.rows3[cellval.row.__index].machineID + '/' + tgtdate + '/' + strArray[1].toLowerCase() + '/' + cellval.row[key], {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
          this.mappingTable()
          this.$q.loading.hide()
        } else {
          // this.rows2[cellval.row.__index][key] = results.data
          this.$q.loading.hide()
        }
      })
    },
    addMore (event, done) {
    },
    refresh (done) {
      // // console.log('refresh')
      setTimeout(() => {
        done()
      }, 3000)
    },
    rowclick () {
    },
    change (newValue) {
      this.$q.loading.show({
        delay: 400 // ms
      })
      this.x = newValue
      this.y = typeof this.x
      var z = this.x.split('T')
      // console.log(newValue)
      /* for (var i in z) {
        // console.log(z[i])
        // console.log(i)
      } */
      var whereIsMonday = moment(z[0], 'YYYY-MM-DD').format('d')
      if (whereIsMonday < 1) {
        whereIsMonday = 6
      } else {
        whereIsMonday--
      }
      this.monReg = moment(z[0], 'YYYY-MM-DD').subtract(whereIsMonday, 'd').format('YYYY-MM-DD')
      var a = this.monReg
      z = this.x.split('-')
      // -----------------------------
      this.rows1.splice(0, this.rows1.length)
      this.rows1.splice(0, 0, {
        'Mon': moment(a, 'YYYY-MM-DD').add(0, 'd').format('M/DD'),
        'Tue': moment(a, 'YYYY-MM-DD').add(1, 'd').format('M/DD'),
        'Wen': moment(a, 'YYYY-MM-DD').add(2, 'd').format('M/DD'),
        'Thu': moment(a, 'YYYY-MM-DD').add(3, 'd').format('M/DD'),
        'Fri': moment(a, 'YYYY-MM-DD').add(4, 'd').format('M/DD'),
        'Sat': moment(a, 'YYYY-MM-DD').add(5, 'd').format('M/DD'),
        'Sun': moment(a, 'YYYY-MM-DD').add(6, 'd').format('M/DD')
      })
      this.rows1.splice(1, 0, {
        'Mon': '一',
        'Tue': '二',
        'Wen': '三',
        'Thu': '四',
        'Fri': '五',
        'Sat': '六',
        'Sun': '日'
      })
      this.monday = moment(a, 'YYYY-MM-DD').add(0, 'd').format('M/DD')
      this.tuesday = moment(a, 'YYYY-MM-DD').add(1, 'd').format('M/DD')
      this.wednesday = moment(a, 'YYYY-MM-DD').add(2, 'd').format('M/DD')
      this.thursday = moment(a, 'YYYY-MM-DD').add(3, 'd').format('M/DD')
      this.friday = moment(a, 'YYYY-MM-DD').add(4, 'd').format('M/DD')
      this.saturday = moment(a, 'YYYY-MM-DD').add(5, 'd').format('M/DD')
      this.sunday = moment(a, 'YYYY-MM-DD').add(6, 'd').format('M/DD')
      // ---------------------------
      // this.rows2.splice(0, this.rows.length)
      var shiftKeysArr = Object.keys(this.shiftKeys).filter(elm => {
        return elm !== '_id'
      })
      this.rows2.splice(0, this.rows2.length)
      this.rows2.length = 0
      // var idx = 0
      var fistRow = {}
      var secondRow = {}
      this.dayNameList.forEach((elm, idx) => {
        fistRow[elm.engName + this.shiftKeys[shiftKeysArr[0]].key] = moment(a, 'YYYY-MM-DD').add(idx, 'd').format('M/DD')
        secondRow[elm.engName + this.shiftKeys[shiftKeysArr[0]].key] = elm.chnName
      })
      fistRow['_id'] = 'date'
      fistRow['index'] = this.rows2.length
      fistRow['machineID'] = ''
      this.rows2.splice(this.rows2.length, 0, fistRow)
      secondRow['_id'] = 'day'
      secondRow['index'] = this.rows2.length
      secondRow['machineID'] = ''
      this.rows2.splice(this.rows2.length, 0, secondRow)
      this.rows2.splice(this.rows2.length, 0, {
        '_id': 'shift',
        'index': this.rows2.length
      })
      this.columns2.forEach((col) => {
        this.$set(this.rows2[this.rows2.length - 1], col.name, col.label)
      })
      /* this.rows2.splice(this.rows2.length, 0, {
        '_id': 'date',
        'index': this.rows2.length,
        'machineID': '',
        'mondayFirst': moment(a, 'YYYY-MM-DD').add(0, 'd').format('M/DD'),
        'tuesdayFirst': moment(a, 'YYYY-MM-DD').add(1, 'd').format('M/DD'),
        'wednesdayFirst': moment(a, 'YYYY-MM-DD').add(2, 'd').format('M/DD'),
        'thursdayFirst': moment(a, 'YYYY-MM-DD').add(3, 'd').format('M/DD'),
        'fridayFirst': moment(a, 'YYYY-MM-DD').add(4, 'd').format('M/DD'),
        'saturdayFirst': moment(a, 'YYYY-MM-DD').add(5, 'd').format('M/DD'),
        'sundayFirst': moment(a, 'YYYY-MM-DD').add(6, 'd').format('M/DD')
      })
      this.rows2.splice(this.rows2.length, 0, {
        '_id': 'day',
        'index': this.rows2.length,
        'machineID': '',
        'mondayFirst': '一',
        'tuesdayFirst': '二',
        'wednesdayFirst': '三',
        'thursdayFirst': '四',
        'fridayFirst': '五',
        'saturdayFirst': '六',
        'sundayFirst': '日'
      })
      var ind = this.rows2.length
      this.rows2.splice(this.rows2.length, 0, {
        '_id': 'shift',
        'index': this.rows2.length
      })
      this.columns2.forEach((col) => {
        this.$set(this.rows2[ind], col.name, col.label)
      }) */
      // console.log(this.columns2)
      // console.log(this.rows2)
      // console.log('for loop machine')
      // console.log(this.zoneS)
      // var strA = recursiveMakeMachineArr(this.zoneS) // ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
      // console.log(strA)
      // console.log('for loop machine2')
      var strB = recursiveFindObj(this.departmentSelected, this.zoneS)
      // console.log('this.departmentSelected')
      // console.log(this.departmentSelected)
      // console.log(strB)
      var strC = []
      if (Object.keys(strB).length !== 0) {
        strC = recursiveMakeMachineArr(strB)
      } else {
        strC = recursiveMakeMachineArr(this.zoneS)
      }
      this.rows3.splice(0, this.rows3.length)
      this.rows2.forEach(row2 => {
        this.rows3.splice(this.rows3.length, 0, row2)
      })
      // console.log(strC)
      this.$nextTick(() => {
        renderTable1(this.rows3, this.columns2, strC,
          moment(a, 'YYYY-MM-DD').add(0, 'd').format('Y'),
          moment(a, 'YYYY-MM-DD').add(0, 'd').format('M'),
          moment(a, 'YYYY-MM-DD').add(0, 'd').format('D'),
          this.shiftKeys, this.$q.loading)
        strC.forEach(element => {
          renderTable(this.$set, this.rows2, this.columns2, element,
            moment(a, 'YYYY-MM-DD').add(0, 'd').format('Y'),
            moment(a, 'YYYY-MM-DD').add(0, 'd').format('M'),
            moment(a, 'YYYY-MM-DD').add(0, 'd').format('D'),
            this.shiftKeys)
        })
      })
    }
  },
  components: {
  }
}

function renderTable1 (rows, columns, machineIDs, year, month, day, shiftKeys, loading) {
  $.get('/api/getshiftRecord/' + machineIDs + '/' + year + '/' + month + '/' + day, {}, (results) => {
    var resDataArr = results.data
    // var resData = resDataArr.map(elm => elm.machineID)
    resDataArr.forEach(elm => {
      var obj = {}
      columns.forEach(column => {
        if (column.field === 'machineID') {
          obj[column.field] = elm.machineID
        } else if (elm.hasOwnProperty(column.field)) {
          obj[column.field] = elm[column.field]
        } else {
          obj[column.field] = false
        }
      })
      obj['index'] = rows.length
      rows.splice(rows.length, 0, obj)
    })
    // console.log(rows)
    loading.hide()
  })
}
function renderTable (fun, rows, columns, machineID, year, month, day, shiftKeys) {
  rows.splice(rows.length, 0, {
    'index': rows.length,
    [columns[0].field]: machineID
  })
  $.get('/api/getCalendar/' + machineID + '/' + year + '/' + month + '/' + day, {}, (results) => {
  // $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    var machineRow
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      this.$q.loading.hide()
      machineRow = rows.find(elm => {
        return elm[columns[0].field] === machineID
      })
      rows.splice(machineRow.__index, 1)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // console.log('Empty~')
      machineRow = rows.find(elm => {
        return elm[columns[0].field] === machineID
      })
      rows.splice(machineRow.__index, 1)
    } else {
      var records = results.data
      var index = 1
      // console.log(machineID)
      // console.log(records)
      // console.log(shiftKeys)
      var arr = Object.keys(shiftKeys)
      records.forEach(record => {
        var machineRow = rows.find(elm => {
          return elm[columns[0].field] === machineID
        })
        arr.forEach((elm, idx) => {
          fun(machineRow, [columns[index++].field], record[shiftKeys[elm].key] || false)
        })
      })
      rows.sort(function (a, b) {
        return a.index > b.index ? 1 : -1
      })
    }
  })
}
function recursiveMakeMachineArr (orgParam) {
  if (typeof orgParam !== 'object') {
    return [orgParam]
  } else {
    var retArr = []
    var objKeys = Object.keys(orgParam)
    // console.log(objKeys)
    objKeys.forEach(obj => {
      orgParam[obj].forEach(elm => {
        retArr = retArr.concat(recursiveMakeMachineArr(elm))
      })
    })
    return retArr
  }
}
function recursiveFindObj (selected, zoneS) {
  if (selected === '') {
    return {}
  } else if (typeof zoneS !== 'object') {
    return {}
  } else {
    var retArr = {}
    var objKeys = Object.keys(zoneS)
    // // console.log(objKeys)
    objKeys.forEach(obj => {
      // console.log('1111111')
      // console.log(selected)
      // console.log(obj)
      if (obj === selected) {
        retArr = zoneS
        // console.log('88888888')
      } else if ((Object.keys(retArr)).length === 0) {
        zoneS[obj].forEach(elm => {
          if ((Object.keys(retArr)).length === 0) {
            retArr = recursiveFindObj(selected, elm)
            // console.log('99999999')
          }
        })
      } else {
        // console.log('NO')
        // console.log(retArr)
      }
    })
    return retArr
  }
}
</script>
<style>
</style>

<style lang="stylus">
.my-label
  padding 5px
  border-radius 3px
  display inline-block
.icon-svg58:before{
  content : url("../assets/small32/printer.png");
    }
</style>
