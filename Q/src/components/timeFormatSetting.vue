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
   <div class="row content-around bg-light-blue-9 glossy full-width">
    <div class="col-6 text-white q-ml-xl">
    </div>
   </div>
      <div class="col-4 q-mt-md q-mb-xl q-ml-md">
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
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td v-if="props.row.__index===0" key="status" :props="props" :rowspan="2">
            {{props.row.status}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="status" :props="props">
            <!--<q-chip small square color="amber">-->
              {{props.row.status}}
          </q-td>

          <q-td v-if="props.row.__index===0" key="action" :props="props" :rowspan="2">
            {{props.row.action}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="action" :props="props">
            <div color="blue" style="min-width: 100px">
            {{ props.row.action}}
            </div>
          </q-td>

          <q-td v-if="props.row.__index===0" key="condition" :props="props" :rowspan="2">
            {{props.row.condition}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="condition" :props="props" class="text-red">{{ props.row.condition }}</q-td>

          <q-td v-if="props.row.__index===0" key="fontBackground" :props="props" :colspan="6">
            {{props.row.fontBackground}}
          </q-td>
          <q-td v-else-if="props.row.__index===1" key="fontBackground" :props="props">
            {{props.row.fontBackground}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontBackground" :props="props"  color="amber">
            <q-color
              :style="props.row['fontBackground' + 'Style']"
              v-model="props.row['fontBackground']"
              display-value=" "
              :change="setColor(props, 'fontBackground')"
            />
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontSized" :props="props">
            {{props.row.fontSized}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontSized" :props="props"  color="amber">
            <q-input v-model="props.row['fontSized']"  type="number" align="center" :style="props.row['fontSized' + 'Px']" :change="setSize(props, 'fontSized')" :max="30" :min="2">
            </q-input>
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontColor" :props="props"  color="amber">{{props.row.fontColor}}</q-td>
          <q-td v-else-if="props.row.__index>1" key="fontColor" :props="props"  color="amber">
            <q-color
              :style="props.row['fontColor' + 'Style']"
              v-model="props.row['fontColor']"
              display-value=" "
              :change="setColor(props, 'fontColor')"
            />
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontBold" :props="props">
            {{props.row.fontBold}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontBold" :props="props"  color="amber">
            <q-btn label="B" v-if="props.row['fontBold']" @click="fontBoldClick(props, 'fontBold')" style="fontWeight: bold" :push="true"/>
            <q-btn v-else label="B" @click="fontBoldClick(props, 'fontBold')" :push="true"/>
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontItalic" :props="props">
            {{props.row.fontItalic}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontItalic" :props="props"  color="amber">
            <q-btn label="I" v-if="props.row['fontItalic']" @click="fontBoldClick(props, 'fontItalic')" style="fontStyle: italic" :push="true"/>
            <q-btn v-else label="I" @click="fontBoldClick(props, 'fontItalic')" :push="true"/>
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontBlink" :props="props">
            {{props.row.fontBlink}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontBlink" :props="props"  color="amber">
            <q-btn v-if="props.row['fontBlink']" @click="fontBoldClick(props, 'fontBlink')"  :push="true">
              <span class="blink">S</span>
            </q-btn>
            <q-btn v-else @click="fontBoldClick(props, 'fontBlink')" :push="true">
              <span>S</span>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
      </q-table>
   </div>
  </section>
</div>
</template>

<script>
// import $ from 'jquery'
// import moment from 'moment'
// import 'moment-duration-format'
// import Vue from 'vue'
export default {
  data: function () {
    return {
      fullscreen: false,
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
      rowsObj: {
        'finishLEDeadline': {'status': '已完成', 'action': '字型變化', 'condition': '<=最遲完成日', 'rangeR': 0, 'rangeL': 0},
        'finishGDeadline': {'status': '已完成', 'action': '字型變化', 'condition': '>最遲完成日', 'rangeR': 0, 'rangeL': 0},
        'unfinishLEDeadline': {'status': '未完成', 'action': '字型變化', 'condition': '<=最遲完成日-3天', 'rangeR': 0, 'rangeL': 3},
        'unfinishGLEDeadline': {'status': '未完成', 'action': '字型變化', 'condition': '>最遲完成日-3天且<=最遲完成日', 'rangeR': 3, 'rangeL': 0},
        'unfinishGDeadline': {'status': '未完成', 'action': '字型變化', 'condition': '>最遲完成日', 'rangeR': 0, 'rangeL': 0}
      },
      columns: [],
      columnsObj: {
        'status': '派單狀態',
        'action': '動作',
        'condition': '參數條件',
        'fontBackground': '底色',
        'fontSized': '大小',
        'fontColor': '色彩',
        'fontBold': '粗體',
        'fontItalic': '斜體',
        'fontBlink': '閃爍'
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
      noteListArr: []
    }
  },
  created () {
    this.columns.length = 0
    var columnsKey = Object.keys(this.columnsObj)
    columnsKey.forEach(columnKey => {
      var obj = {
        label: this.columnsObj[columnKey],
        field: columnKey,
        name: columnKey,
        align: 'center'
      }
      this.columns.splice(this.columns.length, 0, obj)
    })
    var rowsKey = Object.keys(this.rowsObj)
    // console.log('this.columns')
    // console.log(this.columns)
    // console.log(this.columns.length)
    // console.log(this.columns[0])
    this.rows = [
      {
        _id: 'head',
        status: '派單狀態',
        action: '動作',
        condition: '參數條件',
        fontBackground: '字型'
      },
      {
        _id: 'head',
        fontBackground: '底色',
        fontSized: '大小',
        fontColor: '色彩',
        fontBold: '粗體',
        fontItalic: '斜體',
        fontBlink: '閃爍'
      }
    ]
    rowsKey.forEach(rowKey => {
      var newRow = {}
      newRow = this.rowsObj[rowKey]
      newRow['_id'] = rowKey
      this.rows.splice(this.rows.length, 0, newRow)
    })
    // console.log(this.rows)
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
    setColor (newValue, key) {
      newValue.row[key + 'Style'] = 'background-color:' + newValue.row[key]
    },
    setSize (newValue, key) {
      newValue.row[key + 'Px'] = 'fontSize:' + newValue.row[key] + 'px'
    },
    fontBoldClick (newValue, fontBold) {
      newValue.row[fontBold] = !newValue.row[fontBold]
      // console.log(fontBold)
    },
    save () {
      // console.log(this.rows)
    }
  }
}
</script>

<style>
.icon-svg58:before{
  content : url("../assets/small32/printer.png");
    }
</style>
