<template>
<div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      <h5>生產管理項目統計表</h5>
    </div>
    <div>
      <div class="container">
            <div>
              <b>Resize count : {{resizeCount}} </b>
            </div>
          <div class="resizable ui-widget-content" v-resize="onResize">
            <b>Standard</b>
          </div>
        </div>
    </div>
    <div class="row center-block">
      <div class="col-md-12">
        <input type="month" v-model="selectedDateFrom" />
        &nbsp;-&nbsp;
        <input type="month" v-model="selectedDateTo" />
        &nbsp;&nbsp;
        部門: <select v-model="departmentID">
          <option v-for="department in departmentList" v-bind:key="department" :value="department">
          {{ department }}
          </option>
        </select>
         <select v-model="zone"  v-resize:throttle="onResize">
          <option v-for="part in zoneList" v-bind:key="part" :value="part">
          {{ part }}
          </option>
        </select>
      </div>
    </div>
    <q-input v-model="num"  type="number" align="center" :change="changeSize(num, 'fontSized')" :max="30" :min="2">
      px
    </q-input>
    <div class="row center-block q-mr-sm">
      <q-table id="t"
        :data="rowsMerge"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        separator="cell"
        row-key="name"
        color="secondary"
      >
        <q-tr slot="body" slot-scope="props" :props="props"  @dbclick.native="rowDBClick(props.row)">
          <q-resize-observable @resize="onResize1" :debounce="3000"/>
          <q-td v-for="col in columns" v-bind:key="col.name" v-if="col.merge && props.row[col.name]!==''" :props="props" :rowspan="props.row[col.name + 'SZ'] + 1">
                {{ props.row[col.name] }}
          </q-td>
          <q-td :key="col.name" v-else-if="props.row[col.name]!==''" :props="props"  @click.native="rowClick(props.row)" v-resize:throttle="onResize" :style="sizeStyle">
            {{ props.row[col.name] }}
          </q-td>
          <!--<q-td v-if="props.row.departmentID!==''" key="departmentID" :props="props" :rowspan="props.row['departmentIDSZ']+1">
            {{ props.row.departmentID }}
          </q-td>
        <q-td key="zone" :props="props">{{ props.row.zone }}</q-td>
          <q-td key="machineID" :props="props">{{ props.row.machineID }}</q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="Jan" :props="props">{{ props.row.Jan }}</q-td>
          <q-td key="Feb" :props="props">{{ props.row.Feb }}</q-td>
          <q-td v-if="props.row.Jan==='300'" colspan="100%" :props="props">
              {{ props.row.departmentID }}
          </q-td>-->
        </q-tr>
      </q-table>
    </div>
  </section>
</div>
</template>

<script>
import moment from 'moment'
import 'moment-duration-format'
import resize from 'vue-resize-directive'
import $ from 'jquery'
// import jquery_ui from 'jquery-ui/ui/widgets/resizable.js'
// import colResizable from 'D:/Q2/Q/node_modules/colresizable/colResizable-1.6.js'
export default {
  directives: {
    resize
  },
  name: 'Tables',
  data: function () {
    return {
      num: 20,
      sizeStyle: '20px',
      resizeCount: 0,
      serverPagination: {
        rowsPerPage: 20
      },
      selectedDateFrom: moment().subtract(11, 'month').format('YYYY-MM'),
      selectedDateTo: moment().format('YYYY-MM'),
      departmentID: '',
      departmentList: [],
      zone: '',
      zoneList: [],
      rowsMerge: [],
      options: [20, 50, 100, 200, 500, 0],
      config: {
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
        responsive: true,
        pagination: {
          rowsPerPage: 20,
          options: [5, 20, 50, 100, 200, 500, 0]
        },
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
          label: '課別',
          field: 'departmentID',
          name: 'departmentID',
          width: '20%', // '70px',
          merge: true,
          type: 'string'
        },
        {
          label: '區域',
          field: 'zone',
          name: 'zone',
          width: '20%', // '70px',
          merge: true,
          type: 'string'
        },
        {
          label: '機台編號',
          field: 'machineID',
          name: 'machineID',
          merge: true,
          width: '20%', // '70px',
          type: 'string'
        },
        {
          label: '資料名稱',
          field: 'description',
          name: 'description',
          width: '20%', // '70px',
          type: 'string'
        },
        {
          label: '1月',
          field: 'Jan',
          name: 'Jan',
          width: '20%' // '70px'
        }
      ],
      rows: [
        {
          departmentID: '成型一課',
          zone: '1A區',
          machineID: '1A01',
          description: '機械手警報次數',
          Jan: 100
        },
        {
          departmentID: '成型一課',
          zone: '1A區',
          machineID: '1A01',
          description: '成型機警報次數',
          Jan: 200
        },
        {
          departmentID: '成型一課',
          zone: '1A區',
          machineID: '1A01',
          description: '換模次數',
          Jan: 300
        },
        {
          departmentID: '成型一課',
          zone: '1A區',
          machineID: '1A02',
          description: '機械手警報次數',
          Jan: 400
        },
        {
          departmentID: '成型一課',
          zone: '1B區',
          machineID: '1B01',
          description: '機械手警報次數',
          Jan: 500
        },
        {
          departmentID: '成型一課',
          zone: '1B區',
          machineID: '1B03',
          description: '機械手警報次數',
          Jan: 505
        },
        {
          departmentID: '成型二課',
          zone: '2A區',
          machineID: '2A09',
          description: '機械手警報次數',
          Jan: 500
        },
        {
          departmentID: '成型二課',
          zone: '2A區',
          machineID: '2A10',
          description: '機械手警報次數',
          Jan: 700
        }
      ]
    }
  },
  created () {
    var columnsMerge = this.columns.filter(element => {
      return element.merge === true
    })
    this.rowsMerge.splice(0, this.rowsMerge.length)
    this.rowsMerge.length = 0
    // console.log('Hi~hi~')
    // console.log(columnsMerge.length)
    // console.log(columnsMerge)
    var arr = Array(columnsMerge.length)
    var prevRow = {}
    this.rows.forEach(row => {
      var newRow = row
      columnsMerge.forEach((columnMerge, index) => {
        if (row[columnMerge.name] !== arr[index]) {
          arr[index] = row[columnMerge.name]
          newRow[columnMerge.name] = row[columnMerge.name]
          newRow[columnMerge.name + 'SZ'] = 0
          if (this.rowsMerge.length > 0) {
            (this.rowsMerge[this.rowsMerge.length - prevRow[columnMerge.name + 'SZ'] - 1])[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ']
          }
        } else {
          newRow[columnMerge.name] = ''
          newRow[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ'] + 1
        }
      })
      this.rowsMerge.splice(this.rowsMerge.length, 0, newRow)
      prevRow = newRow
    })
    columnsMerge.forEach((columnMerge, index) => {
      if (this.rowsMerge.length > 0) {
        (this.rowsMerge[this.rowsMerge.length - prevRow[columnMerge.name + 'SZ'] - 1])[columnMerge.name + 'SZ'] = prevRow[columnMerge.name + 'SZ']
      }
    })
    // console.log('Hi~hi~')
    // console.log(this.rowsMerge)
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
    sel (rowsNumber) {
      this.serverPagination.rowsNumber = rowsNumber
      // console.log(rowsNumber)
    },
    onResize1 (size) {
      // console.log(size)
      // {
      //   width: 20 // width of container (in px)
      //   height: 50 // height of container (in px)
      // }
    },
    rowClick (value) {
      // console.log(value)
    },
    rowDBClick (value) {
      // console.log(value)
    },
    onResize () {
      this.resizeCount++
      // console.log(this.resizeCount)
    },
    changeSize (newValue, key) {
      this.sizeStyle = 'font-size:' + newValue + 'px'
    }
  },
  mounted () {
    $(function () {
      $('t').colResizable()
    })
  }
}
</script>
<style>
.container{
  display: flex;
  justify-content: space-around;
  font-size: x-large;
}
.resizable {
  overflow: hidden;
  background: green !important;
  height: 200px;
  width: 200px;
  vertical-align: middle;
  display: table-cell;
}
</style>
