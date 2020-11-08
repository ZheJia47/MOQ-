<template>
<div class="layout-padding">
  <section class="content">
     <div class="row justify-start bg-light-blue-9 glossy full-width">
    <div class="col-5 text-white q-ml-xl">
      <h4>系統共用資料設定</h4>
    </div>
    <div class="col-6 self-end text-white q-pb-xs">
        <q-btn outline glossy v-if="!$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      <q-btn outline glossy label="確定" @click="save" color="light-blue-9" :push="true"/>
      <q-btn outline glossy label="重載" color="light-blue-9" :push="true"/>
    </div>
    </div>
  <div class="row justify-center full-width bg-grey-3">
      <div class="row inline q-mr-xl q-pr-xl">
      <q-item>
      <q-table
        :data="rows"
        :columns="columns"
        :rows-per-page-options="options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        separator="cell"
        row-key="name"
        color="amber"
        @refresh="refresh"
        @rowclick="rowclick"
        hide-bottom
        hide-header
      >
      <q-tr slot="header" slot-scope="props">
     <q-th v-for="col in props.cols" :key="col.name" :props="props" :auto-width="true">
          {{ col.label }}
    </q-th>
      </q-tr>
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td v-if="props.row.__index===0" key="paramName" :props="props" :rowspan="2">
            {{props.row.paramName}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="paramName" :props="props">
            <!--<q-chip small square color="amber">-->
              {{props.row.paramName}}
          </q-td>
          <q-td v-if="props.row.__index===0" key="action" :props="props" :rowspan="2">
            {{props.row.action}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="action" :props="props" class="text-red">
            <!--<div>-->
              <p color="text-blue" style="min-width: 100px" class="text-blue">{{props.row.action}}</p>
              <div v-if="props.row.__index!==10">
                    <div v-for="(element, index) in props.row.rule" v-bind:key="index" >
                      <!--<q-input v-if="(props.row.rule.length > 1) && (index===0)" v-model="props.row.rule[index]" suffix="小時"/>
                      <q-input v-else-if="(props.row.rule.length > 1) && (index===1)" v-model="props.row.rule[index]" suffix="分"/>
                      <q-input v-else v-model="props.row.rule[index]"/>-->
                      <div v-if="(props.row.rule.length > 1) && (index===0)" >
                        {{element}}小時
                        <q-popup-edit v-model="props.row['data' + index]" buttons label-set="確定" label-cancel="取消" persistent @save="updateFun(props.row, index, element, props.row['data' + index])">
                          <q-input v-model="props.row['data' + index]" suffix="小時" type="number"/>
                        </q-popup-edit>
                        <!--<q-popup-edit v-model="element" buttons label-set="確定" label-cancel="取消" persistent @save="updateFun(props.row.rule, index, element, props.row['data' + index])">
                          <q-input v-model="element" suffix="小時"/>
                        </q-popup-edit>-->
                      </div>
                      <div v-else-if="(props.row.rule.length > 1) && (index===1)">
                        {{element}}分
                        <q-popup-edit v-model="props.row['data' + index]" buttons label-set="確定" label-cancel="取消" persistent @save="updateFun(props.row, index, element, props.row['data' + index])">
                          <q-input v-model="props.row['data' + index]" suffix="分" type="number"/>
                        </q-popup-edit>
                      </div>
                      <div v-else>
                        {{element}}
                        <q-popup-edit v-model="props.row['data' + index]" buttons label-set="確定" label-cancel="取消" persistent @save="updateFun(props.row, index, element, props.row['data' + index])">
                          <q-input v-model="props.row['data' + index]" type="number"/>
                        </q-popup-edit>
                      </div>
                    </div>
              </div>
              <div v-else-if="props.row.__index===10" >
                {{props.row.rule[0]}}
                <q-popup-edit v-model="props.row['data0']" buttons label-set="確定" label-cancel="取消" persistent @save="updateFun(props.row, 0, 0, props.row['data0'])">
                  <q-select v-model="props.row['data0']" :options="utilizationMode" @change="val => { props.row['data0'] = val }"/>
                </q-popup-edit>
              </div>
            <!--</div>-->
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
              display-value="  "
              @change="setColor(props, 'fontBackground')"
              format-model="hex"
              modal
              ok-label="確定"
              cancel-label="取消"
            />
          </q-td>
          <q-td v-if="props.row.__index===1" key="fontSized" :props="props">
            {{props.row.fontSized}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontSized" :props="props"  color="amber">
            {{props.row.fontSized}}
            <q-popup-edit v-model="props.row.fontSized" buttons label-set="確定" label-cancel="取消" persistent >
              <q-field count>
                <q-input v-model="props.row.fontSized"  type="number" align="center" warning :style="props.row['fontSized' + 'Px']" @change="setSize(props, 'fontSized')" :max="30" :min="2">
                </q-input>
              </q-field>
            </q-popup-edit>
          </q-td>
          <q-td v-if="props.row.__index===1" key="fontColor" :props="props"  color="amber">{{props.row.fontColor}}</q-td>
          <q-td v-else-if="props.row.__index>1" key="fontColor" :props="props"  color="amber">
            <q-color
            :style="props.row['fontColor' + 'Style']"
              v-model="props.row['fontColor']"
              display-value="  "
              @change="setColor(props, 'fontColor')"
              format-model="hex"
              modal
              ok-label="確定"
              cancel-label="取消"
            >
            </q-color>
          </q-td>
          <q-td v-if="props.row.__index===1" key="fontBold" :props="props">
            {{props.row.fontBold}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontBold" :props="props"  color="amber">
            <q-btn label="S"  v-if="props.row['fontBold']" @click="fontBoldClick(props, 'fontBold')" style="fontWeight:bold" :push="true"/>
            <q-btn v-else label="S" @click="fontBoldClick(props, 'fontBold')" style="fontWeight:lighter" :push="true"/>
          </q-td>
          <q-td v-if="props.row.__index===1" key="fontItalic" :props="props">
            {{props.row.fontItalic}}
            +++3.
            0
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
      </q-item>
      </div>
      </div>
</section>
</div>
</template>

<script>
import $ from 'jquery'
// import moment from 'moment'
// import 'moment-duration-format'
// import orderNumber from './OrderNumberEdit'
// import moldNum from './MoldNumberEdit'
// var _ = require('underscore')._
// import { colors } from 'quasar'
import Vue from 'vue'
export default {
  data: function () {
    return {
      sizeArr: [{K: 1}, {K: 2}, {K: 3}],
      ttt3: '',
      fullscreen: false,
      brand: 'red',
      temp: '#a2aa33',
      modelHexBg: '',
      modelHex: '',
      rowData: [
        {_id: 1, rule: [5], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 2, rule: [99], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 3, rule: [97], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 4, rule: [1.1], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 5, rule: [0.9], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 6, rule: [3], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 7, rule: [50], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 8, rule: [0], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 9, rule: ['B'], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 10, rule: [24], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 11, rule: [1.03], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
        {_id: 12, rule: [0, 30], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false}
      ],
      rowInfo: { // key 為資料庫中的ID對應
        1: {paramName: '共用', action: '當日警報次數上限(次) > ', condition: '當日警報次數 字型變化'},
        2: {paramName: '共用', action: '週期效率(%) > ', condition: '週期效率 字型變化'},
        3: {paramName: '共用', action: '週期效率(%) < ', condition: '週期效率 字型變化'},
        4: {paramName: '共用', action: '平均週期 >= 標準週期 * ', condition: '平均週期 字型變化'},
        5: {paramName: '共用', action: '平均週期 <= 標準週期 * ', condition: '平均週期 字型變化'},
        6: {paramName: '共用', action: '平均不良率(非個別成品料號)(%) >= ', condition: '平均不良率 字型變化'},
        7: {paramName: '共用', action: '稼動率(%) < ', condition: '稼動率 字型變化'},
        8: {paramName: '共用', action: '最遲完成日 < 實際或預計完成時間 + ', condition: '最遲完成日 字型變化'},
        9: {paramName: '共用', action: '稼動日數計算模式 ', condition: '選項設定為 A.每日計 B.扣除星期日 C.扣除星期六日 D.扣除所有國定假日'},
        10: {paramName: '共用', action: '日稼動時數(小時) = ', condition: '負荷時間 = 稼動日數 * 日稼動時數'},
        101: {paramName: '個別射出機生產資料明細', action: '累計模數 > 派單模數 * ', condition: '跳出派單之累計魔術提示框'},
        102: {paramName: '個別射出機生產資料明細', action: '工作時段停機持續時間 >= 小時 分', condition: '時間統計 字型變化'},
        103: {paramName: '個別射出機生產資料明細', action: '工作時段停機持續時間 >= 小時 分', condition: '下筆自動生產 派單號碼 字型變化'},
        104: {paramName: '個別射出機生產資料明細', action: '手動狀態持續時間上限 >= 小時 分', condition: '時間統計 字型變化'},
        105: {paramName: '個別射出機生產資料明細', action: '手動狀態持續時間上限 >= 小時 分', condition: '下筆自動生產 派單號碼 字型變化'},
        106: {paramName: '個別射出機生產資料明細', action: '設備警報持續時間上限 >= 分 秒', condition: '時間統計 字型變化'},
        201: {paramName: '日生產報表(整合)', action: '(已完成)實際或預計完成時間 > 最遲完成日', condition: '實際或預計完成時間 字型變化'},
        202: {paramName: '日生產報表(整合)', action: '(已完成)實際或預計完成時間 > 最遲完成日 + 日', condition: '實際或預計完成時間 字型變化'},
        203: {paramName: '日生產報表(整合)', action: '(已完成)實際或預計完成時間 <= 最遲完成日 - 日', condition: '實際或預計完成時間 字型變化'},
        204: {paramName: '日生產報表(整合)', action: '(未完成)實際或預計完成時間 > 最遲完成日', condition: '實際或預計完成時間 字型變化'},
        205: {paramName: '日生產報表(整合)', action: '(未完成)實際或預計完成時間 > 最遲完成日 + 日', condition: '實際或預計完成時間 字型變化'},
        206: {paramName: '日生產報表(整合)', action: '(未完成)實際或預計完成時間 <= 最遲完成日 - 日', condition: '實際或預計完成時間 字型變化'}
      },
      rows: [
        {
          paramName: '頁面或報表名稱',
          action: '參數或係數設定(紅色為設定值藍色為連棟值)',
          condition: '欄位之動作說明；或備註',
          fontBackground: '字型設定'
        },
        {
          fontBackground: '底色',
          fontSized: '大小',
          fontColor: '色彩',
          fontBold: '粗體',
          fontItalic: '斜體',
          fontBlink: '閃爍'
        }
      ],
      /* [
        {
          paramName: '當日警報次數上限',
          action: '字型變化',
          condition: '>5',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '連續成品料號生產，提示分割派單用之派單模次係數',
          action: '跳出派單之累計模數提示框',
          condition: '>1.03',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '週期效率',
          action: '字型變化',
          condition: '>99%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '週期效率',
          action: '字型變化',
          condition: '<97%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '不良率(非單一成品料號)',
          action: '字型變化',
          condition: '>3%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '稼動率',
          action: '字型變化',
          condition: '<50%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        }
      ], */
      columns: [
        {
          label: '參數名稱',
          field: 'paramName',
          name: 'paramName',
          align: 'left',
          width: '1000px',
          color: 'amber',
          rowMerge: false,
          firstFontCol: false,
          style: 'width: 100px',
          filter: true
        },
        {
          label: '動作',
          field: 'action',
          name: 'action',
          align: 'center',
          width: '70px',
          rowMerge: false,
          firstFontCol: false,
          style: {color: 'red', width: '10px'},
          filter: true
        },
        {
          label: '參數條件',
          field: 'condition',
          name: 'condition',
          align: 'center',
          width: '70px',
          rowMerge: false,
          firstFontCol: false,
          style: 'width: 50px',
          filter: true
        },
        {
          label: '底色',
          field: 'fontBackground',
          name: 'fontBackground',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: true,
          filter: true
        },
        {
          label: '大小',
          field: 'fontSized',
          name: 'fontSized',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '色彩',
          field: 'fontColor',
          name: 'fontColor',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '粗體',
          field: 'fontBold',
          name: 'fontBold',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '斜體',
          field: 'fontItalic',
          name: 'fontItalic',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '閃爍',
          field: 'fontBlink',
          name: 'fontBlink',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        }
      ],
      serverPagination: {
        rowsPerPage: 200
      },
      options: [
        20, 50, 100, 200, 500
      ],
      utilizationMode: [{
        label: 'A',
        value: 'A'
      }, {
        label: 'B',
        value: 'B'
      }, {
        label: 'C',
        value: 'C'
      }, {
        label: 'D',
        value: 'D'
      }]
    }
  },
  mounted () {
    $.get('/api/getSysCommonSettingList/', {}, (results) => {
      if (results.type !== true) {
        alert(`response is not correct, err: ${results.data}`)
      } else if (results.data.length === 0) {
        alert('參數讀取異常')
      } else {
        this.rowData = results.data
        // console.log('obj merge0')
        // console.log(this.rowData)
        var rowDataObj = {}
        this.rowData.forEach(rd => {
          // rowDataObj[rd._id] = rd
          this.$set(rowDataObj, rd._id, rd)
        })
        var rowKeys = Object.keys(this.rowInfo)
        rowKeys.forEach(rowKey => {
          var Obj = {}
          /* rowDataObj[rowKey].rule.forEach((elm, idx) => {
            // rowDataObj[rowKey]['data' + idx] = elm
            this.$set(rowDataObj[rowKey], 'data' + idx, elm)
          }) */
          // rowDataObj[rowKey]['fontBackgroundStyle'] = 'background-color: ' + (rowDataObj[rowKey])['fontBackground']
          // rowDataObj[rowKey]['fontColorStyle'] = 'background-color: ' + (rowDataObj[rowKey])['fontColor']
          // rowDataObj[rowKey]['fontSizedPx'] = 'fontSize:' + rowDataObj[rowKey]['fontSized'] + 'px'
          this.$set(rowDataObj[rowKey], 'fontBackgroundStyle', 'background-color: ' + (rowDataObj[rowKey])['fontBackground'])
          this.$set(rowDataObj[rowKey], 'fontColorStyle', 'background-color: ' + (rowDataObj[rowKey])['fontColor'])
          this.$set(rowDataObj[rowKey], 'fontSizedPx', 'fontSize:' + rowDataObj[rowKey]['fontSized'] + 'px')
          Obj = Object.assign(this.rowInfo[rowKey], rowDataObj[rowKey])
          // rowData
          this.rows.splice(this.rows.length, 0, Obj)
        })
        // console.log('obj merge')
        // console.log(this.rows)
        var row = this.rows.find((elm, index) => {
          return index === 10
        })
        this.ttt3 = row.rule[0]
        this.rows.forEach((row, idx) => {
          if (idx < 2) {
            return
          }
          row.rule.forEach((elm, idx) => {
            this.$set(row, 'data' + idx, elm)
          })
        })
        this.$forceUpdate()
      }
    })
  },
  methods: {
    updateFunN (val, init) {
      init = val
      // console.log(init, val)
    },
    updateFun (d0, index, d1, d2) {
      // console.log('updateFun')
      // console.log(d1)
      // console.log(d2)
      Vue.set(d0.rule, index, d2 || 0)
      this.$forceUpdate()
      this.$socket.emit('sysCommonSettingUpdateRule', d0)
    },
    upFun (d1, d2) {
      Vue.set(d1, 0, this.ttt3)
      // console.log(this.rows)
      this.$forceUpdate()
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
    setColor (newValue, key) {
      // console.log(newValue)
      // console.log(key)
      // console.log(newValue.row[key])
      // colors.setBrand(newValue.row['fontBackgroundStyle'], newValue.row[key])
      // newValue.row[key + 'Style'] = 'background-color:' + newValue.row[key]
      // Vue.set(newValue.row, key, newValue.row[key])
      Vue.set(newValue.row, key + 'Style', 'background-color:' + newValue.row[key])
      this.$forceUpdate()
      this.$socket.emit('sysCommonSettingUpdateColor', newValue.row)
    },
    setSize (newValue, key) {
      if (newValue.row[key] > 30) {
        newValue.row[key] = 30
      }
      newValue.row[key + 'Px'] = 'fontSize:' + newValue.row[key] + 'px'
      this.$forceUpdate()
      this.$socket.emit('sysCommonSettingUpdateSize', newValue.row)
    },
    fontBoldClick (newValue, fontBold) {
      newValue.row[fontBold] = !newValue.row[fontBold]
      this.$forceUpdate()
      // console.log(fontBold)
      this.$socket.emit('sysCommonSettingUpdateFont', newValue.row)
    },
    save () {
      // console.log(this.rows)
    },
    test () {
      // console.log(this.rows)
    }
  }
}
</script>
<style lang="stylus">
.blink {
    animation: blink .9s linear infinite;
    -webkit-animation: blink .9s linear infinite;
    -moz-animation: blink .9s linear infinite;
    -ms-animation: blink .9s linear infinite;
    -o-animation: blink .9s linear infinite;
    color: #dd4814;
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
.text-ccc {
  color: #a2aa33;
}
.bg-ccc {
  background: #a2aa33;
}
.icon-svg58:before{
  content : url("../assets/small32/printer.png");
    }
</style>
