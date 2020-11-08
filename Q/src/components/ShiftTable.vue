<template>
<div class="layout-padding">
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
            @input="change" />
        </div>
      </td>
      <td style=" width:30%;"></td>
    </tr>
    <div class="center-block">
    </div>
    <table class="q-table responsive" border="10" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
    <div id="ACC">
      <q-table
        :data="rows2"
        :columns="columns2"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        :hide-header="true"
        :hide-bottom="true"
        separator="cell"
        row-key="name"
        color="secondary"
      >
      <q-tr slot="body" slot-scope="props" :props="props">
      <q-td v-for="day in columns2" v-bind:key="day.name" v-if="(props.row['index']<=2 && day.name==='machineID')">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="(props.row['index']<=1 && day.name.indexOf('First') > -1)" :colspan="3">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="props.row['index']===2">
        {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="(props.row['index']>2 && day.name==='machineID')">
          {{props.row[day.name]}}
      </q-td>
      <q-td v-else-if="props.row['index']>2 && day.name!=='machineID'">
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
  data: function () {
    return {
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
        page: 1,
        rowsPerPage: 200,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
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
      columns1: [
        {
          label: '',
          field: 'machineID',
          width: '70px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'red'}
        },
        {
          label: '',
          field: 'Mon',
          width: '75px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'red'}
        },
        {
          label: '',
          field: 'Tue',
          width: '75px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'orange'}
        },
        {
          label: '',
          field: 'Wen',
          width: '75px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'yellow'}
        },
        {
          label: '',
          field: 'Thu',
          width: '75px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'green'}
        },
        {
          label: '',
          field: 'Fri',
          width: '75px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'blue'}
        },
        {
          label: '',
          field: 'Sat',
          width: '75px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'purple'}
        },
        {
          label: '',
          field: 'Sun',
          width: '75px',
          align: 'center',
          filter: false,
          sort: false,
          style: {color: 'gray'}
        }
      ],
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
      dayNameList: ['monday', 'tuesday', 'wednesday', 'thursday', 'thursday', 'friday', 'saturday', 'sunday'
      ],
      dayNameShiftList: []
    }
  },
  created () {
    this.dayNameShiftList.splice(0, this.dayNameShiftList.length)
    this.dayNameShiftList.length = 0
    // createCheckTableCol(this.columns2)
    // this.change(this.model)
    this.columns2 = new Array(22)
    this.columns2[0] = {
      label: '',
      field: 'machineID',
      name: 'machineID',
      width: '5px',
      filter: false,
      sort: false,
      align: 'center',
      /* sort (a, b) {
        return (a - b)
      }, */
      classes: 'bg-light-blue'
    }
    for (var i = 0; i < 7; i++) {
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
      this.dayNameShiftList.splice(this.dayNameShiftList.length, 0, str + 'First')
      this.dayNameShiftList.splice(this.dayNameShiftList.length, 0, str + 'Second')
      this.dayNameShiftList.splice(this.dayNameShiftList.length, 0, str + 'Third')
      this.columns2[3 * i + 1] = {
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
      }
    }
    this.change(this.model)
    this.$nextTick(() => {
    })
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
      if (cellval.value === true) {
        $.get('/api/updateShiftTable/' + this.rows2[cellval.row.__index].machineID + '/' + tgtdate + '/' + strArray[1].toLowerCase() + '/' + false, {}, (results) => {
          if (results.type !== true) {
            alert(`response is not correct, err: ${results.data}`)
          } else if (results.data.length === 0) {
            // alert('沒有機台資料')
            // console.log('Empty~')
          } else {
            this.rows2[cellval.row.__index][key] = results.data
          }
        })
      } else {
        $.get('/api/updateShiftTable/' + this.rows2[cellval.row.__index].machineID + '/' + tgtdate + '/' + strArray[1].toLowerCase() + '/' + true, {}, (results) => {
          if (results.type !== true) {
            alert(`response is not correct, err: ${results.data}`)
          } else if (results.data.length === 0) {
            // alert('沒有機台資料')
            // console.log('Empty~')
          } else {
            this.rows2[cellval.row.__index][key] = results.data
          }
        })
      }
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
      this.x = newValue
      this.y = typeof this.x
      var z = this.x.split('T')
      // console.log(newValue)
      for (var i in z) {
        // console.log(z[i])
        // console.log(i)
      }
      var whereIsMonday = moment(z[0], 'YYYY-MM-DD').format('d')
      if (whereIsMonday < 1) {
        whereIsMonday = 6
      } else {
        whereIsMonday--
      }
      this.monReg = moment(z[0], 'YYYY-MM-DD').subtract(whereIsMonday, 'd').format('YYYY-MM-DD')
      var a = this.monReg
      z = this.x.split('-')
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
      // this.rows2.splice(0, this.rows.length)
      this.rows2.length = 0
      this.rows2.splice(this.rows2.length, 0, {
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
      })
      var strA = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
      this.$nextTick(() => {
        strA.forEach(element => {
          renderTable(this.$set, this.rows2, this.columns2, element,
            moment(a, 'YYYY-MM-DD').add(0, 'd').format('Y'),
            moment(a, 'YYYY-MM-DD').add(0, 'd').format('M'),
            moment(a, 'YYYY-MM-DD').add(0, 'd').format('D'))
        })
      })
    }
  },
  components: {
  }
}

function renderTable (fun, rows, columns, machineID, year, month, day) {
  $.get('/api/getCalendar/' + machineID + '/' + year + '/' + month + '/' + day, {}, (results) => {
  // $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // console.log('Empty~')
    } else {
      var records = results.data
      var size = rows.length
      var index = 0
      var col = columns[index++].field
      rows.splice(size, 0, {
        'index': size,
        [col]: machineID
      })
      // // console.log(machineID)
      records.forEach(record => {
        var col0 = {} // columns[index++]
        var col1 = {} // columns[index++]
        var col2 = {} // columns[index++]
        col0 = columns[index++].field
        col1 = columns[index++].field
        col2 = columns[index++].field
        fun(rows[size], [col0], record['first'])
        fun(rows[size], [col1], record['second'])
        fun(rows[size], [col2], record['third'])
      })
      rows.sort(function (a, b) {
        return a.index > b.index ? 1 : -1
      })
      // // console.log(rows)
    }
  })
}
</script>
<style>
</style>

<style lang="stylus">
.my-label
  padding 5px
  border-radius 3px
  display inline-block
</style>
