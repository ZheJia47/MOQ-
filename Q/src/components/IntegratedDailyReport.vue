<template>
<div class="layout-padding">
  <section class="content">
     <div class="row inline bg-light-blue-7 full-width glossy">
      <div class="col-12 q-pl-xl text-white">
          <h4>龍達塑膠股份有限公司&nbsp;&nbsp;&nbsp;&nbsp;{{displayDepartment}} - {{displayZone}} </h4>
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
      <q-btn outline glossy v-if="!$q.fullscreen.isActive" @click="rz()">
        <q-icon name="fullscreen" size="36px" />
        全銀幕
      </q-btn>
      <q-btn outline glossy v-else @click="srz()">
        <q-icon name="fullscreen_exit" size="36px" />
        退出全銀幕
      </q-btn>
      <q-btn outline glossy label='EXCEL匯出' icon="icon-svg57" @click="ExcelExport(rows, columns, '日 生產報表 - ' + type)"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
      </div>
   <div class="row justify-around bg-white full-width no-margin">
   <div class="row justify-center q-ma-md full-width">
        <div class="col-8 q-pt-xs">
        <span>{{displayDepartment}}&nbsp;&nbsp;{{displayZone}}&nbsp;&nbsp;&nbsp;&nbsp;日 生產報表 - {{type}}</span>
     </div>
      <div class="col-2 q-ml-xs">
          <q-datetime v-model="selectedDate" type="date" :first-day-of-week=1 @change="ttt(selectedDate)" :display-value="displayValue"/>
     </div>
    </div>
      <div class="row q-pb-sm">
         <span>排序&nbsp;&nbsp;&nbsp;&nbsp;機台<q-icon name="arrow_downward" size="24px" /> + 時間<q-icon name="arrow_downward" size="24px" /></span>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-md-12">
        <q-table
        :data="rows"
        :columns="columns"
        :rows-per-page-options="config.pagination.options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        :dense="true"
        :filter="filter"
        :visible-columns="visibleColumns"
        separator="cell"
        row-key="name"
        hide-bottom
        >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td v-for="col in columns" v-bind:key="col.name" v-if="col.name==='totalAlm'" :props="props">
            <div v-if="colorEn && props.row[col.name] > colorConditionArr[0][0]" :style="colorArr[0]">
              <span v-if="blink[0]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else>
              {{props.row[col.name]}}
            </div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='performance'" :props="props">
            <div v-if="colorEn && props.row[col.name] > colorConditionArr[1][0]" :style="colorArr[1]">
              <span v-if="blink[1]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row[col.name] < colorConditionArr[2][0]" :style="colorArr[2]">
              <span v-if="blink[2]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else>
              {{props.row[col.name]}}
            </div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='average'" :props="props">
            <div v-if="colorEn && props.row[col.name] >= props.row['standard'] * colorConditionArr[3][0]" :style="colorArr[3]">
              <span v-if="blink[3]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row[col.name] <= props.row['standard'] * colorConditionArr[4][0]" :style="colorArr[4]">
              <span v-if="blink[4]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else>
              {{props.row[col.name]}}
            </div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='deadline'" :props="props">
            <div v-if="colorEn && props.row[col.name] < props.row['tgtfinishTime' + 'FullType'] + colorConditionArr[7][0]" :style="colorArr[7]">
              <span v-if="blink[7]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else>
              {{props.row[col.name]}}
            </div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='tgtfinishTime' && props.row['percentageFullType'] >= 1000" :props="props">
            <div v-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > (props.row['deadline'] + colorConditionArr[11][0])" :style="colorArr[11]">
              <span v-if="blink[11]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > (props.row['deadline'] + colorConditionArr[10][0])" :style="colorArr[10]">
              <span v-if="blink[10]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] <= (props.row['deadline'] * colorConditionArr[12][0])" :style="colorArr[12]">
              <span v-if="blink[12]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else>
              {{props.row[col.name]}}
            </div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='tgtfinishTime' && props.row['percentageFullType'] < 1000" :props="props">
            <div v-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > (props.row['deadline'] + colorConditionArr[14][0])" :style="colorArr[14]">
              <span v-if="blink[14]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > (props.row['deadline'] + colorConditionArr[13][0])" :style="colorArr[13]">
              <span v-if="blink[13]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] <= (props.row['deadline'] * colorConditionArr[15][0])" :style="colorArr[15]">
              <span v-if="blink[15]" class="blink">{{props.row[col.name]}}</span>
              <span v-else>{{props.row[col.name]}}</span>
            </div>
            <div v-else>
              {{props.row[col.name]}}
            </div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.shift" :props="props">
            <div v-for="(value) in shiftKeys" v-bind:key="value.key" v-if="col.name===value.key">
              <div  v-if="props.row[col.name] && props.row.machineID === '合計'">
                <q-chip small color="black" :square="true"></q-chip>
              </div>
              <div v-else-if="!props.row[col.name] && props.row.machineID === '合計'">
                <q-chip small color="white" :square="true"></q-chip>
              </div>
              <div v-else>-</div>
            </div>
        </q-td>
        <q-td :key="col.name" v-else-if="col.name==='first'" :props="props">
            <div  v-if="props.value && props.row.machineID === '合計'">
            <q-chip small color="black" :square="true"></q-chip>
            </div>
            <div v-else-if="!props.value && props.row.machineID === '合計'">
              <q-chip small color="white" :square="true"></q-chip>
            </div>
            <div v-else>-</div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='second'" :props="props">
            <div  v-if="props.value && props.row.machineID === '合計'">
            <q-chip small color="black" :square="true"></q-chip>
            </div>
            <div v-else-if="!props.value && props.row.machineID === '合計'">
              <q-chip small color="white" :square="true"></q-chip>
            </div>
            <div v-else>-</div>
          </q-td>
          <q-td :key="col.name" v-else-if="col.name==='third'" :props="props">
            <div  v-if="props.value && props.row.machineID === '合計'">
            <q-chip small color="black" :square="true"></q-chip>
            </div>
            <div v-else-if="!props.value && props.row.machineID === '合計'">
              <q-chip small color="white" :square="true"></q-chip>
            </div>
            <div v-else>-</div>
          </q-td>
        <q-td v-else>
              {{ props.row[col.name] }}
        </q-td>
        </q-tr>
          <!--<q-td v-for="(value) in shiftKeys" v-bind:key="value.key" slot="body-cell-1" :props="props">
            <div  v-if="props.value && props.row.machineID === '合計'">
            <q-chip small color="black" :square="true"></q-chip>
            </div>
            <div v-else-if="!props.value && props.row.machineID === '合計'">
              <q-chip small color="white" :square="true"></q-chip>
            </div>
            <div v-else>-</div>
        </q-td>
          <q-td slot="body-cell-first" slot-scope="props" :props="props">
            <div  v-if="props.value && props.row.machineID === '合計'">
            <q-chip small color="black" :square="true"></q-chip>
            </div>
            <div v-else-if="!props.value && props.row.machineID === '合計'">
              <q-chip small color="white" :square="true"></q-chip>
            </div>
            <div v-else>-</div>
          </q-td>
          <q-td slot="body-cell-second" slot-scope="props" :props="props">
            <div  v-if="props.value && props.row.machineID === '合計'">
            <q-chip small color="black" :square="true"></q-chip>
            </div>
            <div v-else-if="!props.value && props.row.machineID === '合計'">
              <q-chip small color="white" :square="true"></q-chip>
            </div>
            <div v-else>-</div>
          </q-td>
          <q-td slot="body-cell-third" slot-scope="props" :props="props">
            <div  v-if="props.value && props.row.machineID === '合計'">
            <q-chip small color="black" :square="true"></q-chip>
            </div>
            <div v-else-if="!props.value && props.row.machineID === '合計'">
              <q-chip small color="white" :square="true"></q-chip>
            </div>
            <div v-else>-</div>
          </q-td>
          <q-td slot="body-cell-totalAlm" slot-scope="props" :props="props">
            <div v-if="colorEn && props.value > colorConditionArr[0][0]" :style="colorArr[0]">
              <span v-if="blink[0]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else>
              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-performance" slot-scope="props" :props="props">
            <div v-if="colorEn && props.value > colorConditionArr[1][0]" :style="colorArr[1]">
              <span v-if="blink[1]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else-if="colorEn && props.value < colorConditionArr[2][0]" :style="colorArr[2]">
              <span v-if="blink[2]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else>
              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-average" slot-scope="props" :props="props">
            <div v-if="colorEn && props.value >= props.row['standard'] * colorConditionArr[3][0]" :style="colorArr[3]">
              <span v-if="blink[3]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else-if="colorEn && props.value <= props.row['standard'] * colorConditionArr[4][0]" :style="colorArr[4]">
              <span v-if="blink[4]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else>
              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-deadline" slot-scope="props" :props="props">
            <div v-if="colorEn && props.value < props.row['tgtfinishTime' + 'FullType'] + colorConditionArr[7][0]" :style="colorArr[7]">
              <span v-if="blink[7]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else>
              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-tgtfinishTime" slot-scope="props" :props="props">
            <div v-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > props.row['standard'] + colorConditionArr[11][0]" :style="colorArr[11]">
              <span v-if="blink[11]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] > props.row['standard'] + colorConditionArr[10][0]" :style="colorArr[10]">
              <span v-if="blink[10]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else-if="colorEn && props.row['tgtfinishTime' + 'FullType'] <= props.row['standard'] * colorConditionArr[12][0]" :style="colorArr[12]">
              <span v-if="blink[12]" class="blink">{{props.value}}</span>
              <span v-else>{{props.value}}</span>
            </div>
            <div v-else>
              {{props.value}}
            </div>
          </q-td>-->
        </q-table>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
import Vue from 'vue'
import XLSX from 'XLSX'
export default {
  name: 'Tables',
  props: [
    'selectedDateS',
    'departmentS',
    'checked',
    'zoneS'
  ],
  data: function () {
    return {
      shiftKeys: {},
      fullscreen: false,
      totalAlmTextColor: '',
      model:
      '<h3>Header 3</h3><div>Normal text; <b>bold</b>; <i>italic</i>; <strike>strike-trough</strike>; <u style="font-weight: bold; font-style: italic;">bold, italic and underline</u>;</div><div><u>A <i style="font-weight: bold;">mo</i>re <i style="font-weight: bold;">com</i>plica</u>ted example.</div><div><br></div><div>Link to <a href="http://quasar-framework.org">Quasar Documentation</a></div><div><font face="Courier New">Using "Courier New" font.</font></div><div><ul><li>Vue</li><li>Webpack</li></ul><ol><li>Website</li><li>App</li><ol><li>Mobile (Cordova)</li><li>Electron</li></ol></ol><div style="text-align: center;">Center aligned text</div></div><div style="text-align: right;">Right aligned</div>',
      // ---------------------------toolBar用
      colorArr: [],
      colorConditionArr: [],
      blink: [],
      colorEn: false,
      sortFalling: false,
      // ------------------------------機台編號用
      machineIDArr: [],
      organDept: 0,
      // ------------------------------
      chipShiftArr: ['body-cell-first', 'body-cell-second', 'body-cell-third'],
      displayValue: '',
      displayZone: '',
      displayDepartment: '',
      type: '整合',
      department: '成型一課',
      departmentList: [],
      departmentList1: [],
      zone: '1H',
      zoneList: [],
      zoneList1: [],
      selectedDate: moment().format('YYYY-MM-DD'),
      pageID: undefined,
      tempkey: undefined,
      filter: '',
      visibleColumns: [],
      serverPagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
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
        // should be displayed++
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
        bodyStyle: {
          maxHeight: '500px'
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
      columnsObjHead: {
        machineID: '機台'
        // first: '日班',
        // second: '加班',
        // third: '夜班'
      },
      columnsObj: {
        totalAlm: '警報',
        orderNumber: '派單號碼',
        product: '成品料號',
        cavities: '穴數',
        trigTime: '自動生產開始',
        lastTrigTime: '自動生產結束',
        shiftHour: '排班工作時間累計',
        duration: '自動生產時間累計',
        moldCount: '生產模數',
        predProductCnt: '應產數量',
        standard: '標準週期',
        min: '最短週期Ｓ',
        average: '平均週期Ｓ',
        performance: '週期效率％',
        predMoldCnt: '派單模數',
        accMoldCnt: '累計模數',
        percentage: '生產進度%',
        tgtfinishTime: '實際或預計完時間',
        deadline: '最遲完成日'
      },
      columns: []
      /* columns: [
        {
          label: '機台',
          field: 'machineID',
          name: 'machineID',
          width: '70px',
          filter: true,
          required: true
        },
        {
          label: '日班',
          field: 'first',
          name: 'first',
          width: '40px',
          filter: true,
          sort: false,
          required: true,
          style: { color: '#8B0000' }// 'class="-webkit-writing-mode: vertical-lr; -moz-writing-mode: vertical-lr; -ms-writing-mode: vertical-lr; writing-mode: vertical-lr;"'
        },
        {
          label: '加班',
          field: 'second',
          name: 'second',
          width: '40px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '夜班',
          field: 'third',
          name: 'third',
          width: '40px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '警報',
          field: 'totalAlm',
          name: 'totalAlm',
          width: '40px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '派單號碼',
          field: 'orderNumber',
          name: 'orderNumber',
          width: '100px',
          filter: true,
          required: true,
          sort: false
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          width: '100px',
          required: true,
          filter: true
        },
        {
          label: '穴數',
          field: 'cavities',
          name: 'cavities',
          width: '40px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '自動生產開始',
          field: 'trigTime',
          name: 'trigTime',
          width: '150px',
          filter: true,
          required: true
        },
        {
          label: '自動生產結束',
          field: 'lastTrigTime',
          name: 'lastTrigTime',
          width: '150px',
          filter: false,
          required: true
        },
        {
          label: '排班工作時間累計',
          field: 'shiftHour',
          name: 'shiftHour',
          width: '150px',
          filter: false,
          required: true
        },
        {
          label: '自動生產時間累計',
          field: 'duration',
          name: 'duration',
          width: '150px',
          filter: false,
          required: true
        },
        {
          label: '生產模數',
          field: 'moldCount',
          name: 'moldCount',
          width: '100px',
          filter: false,
          required: true
        },
        {
          label: '應產數量',
          field: 'predProductCnt',
          name: 'predProductCnt',
          width: '100px',
          filter: false,
          required: true
        },
        {
          label: '標準週期',
          field: 'standard',
          name: 'standard',
          width: '100px',
          filter: true,
          required: true
        },
        {
          label: '最短週期Ｓ',
          field: 'min',
          name: 'min',
          width: '100px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '平均週期Ｓ',
          field: 'average',
          name: 'average',
          width: '100px',
          required: true,
          filter: false,
          sort: false
        },
        {
          label: '週期效率％',
          field: 'performance',
          name: 'performance',
          width: '100px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '派單模數',
          field: 'predMoldCnt',
          name: 'predMoldCnt',
          width: '100px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '累計模數',
          field: 'accMoldCnt',
          name: 'accMoldCnt',
          width: '100px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '生產進度%',
          field: 'percentage',
          name: 'percentage',
          width: '100px',
          filter: false,
          required: true,
          sort: false
        },
        {
          label: '實際或預計完時間',
          field: 'tgtfinishTime',
          name: 'tgtfinishTime',
          filter: false,
          width: '150px',
          required: true,
          sort: false
        },
        {
          label: '最遲完成日',
          field: 'deadline',
          name: 'deadline',
          filter: false,
          width: '100px',
          required: true,
          sort: false
        }
      ] */
    }
  },
  created () {
    this.totalAlmTextColor = 'background-color: #ffffff; color: #a2aa33'
    this.$socket.emit('commCommand', 'getUniqueID')
    this.$nextTick(() => {
      var dayStr = ''
      switch (moment(this.selectedDateS).format('d')) {
        case '0':
          dayStr = '星期日'
          break
        case '1':
          dayStr = '星期一'
          break
        case '2':
          dayStr = '星期二'
          break
        case '3':
          dayStr = '星期三'
          break
        case '4':
          dayStr = '星期四'
          break
        case '5':
          dayStr = '星期五'
          break
        case '6':
          dayStr = '星期六'
          break
      }
      this.displayValue = (parseInt(moment(this.selectedDateS).format('YYYY')) - 1911) + '年' + moment(this.selectedDateS).format('M') + '月' + moment(this.selectedDateS).format('D') + '日 ' + dayStr
      this.displayZone = ''
      // ------------------------------
      this.machineIDArr = recursiveMakeMachineArr(this.zoneS)
      this.organDept = recursiveFindDept(this.zoneS)
      if (this.organDept > 3) {
        this.displayZone = ''
      } else {
        var idx = 0
        this.zoneS[this.departmentS].forEach(elm => {
          Object.keys(elm).forEach(elmKey => {
            if (idx === 0) {
              this.displayZone = elmKey
            } else {
              this.displayZone = this.displayZone + '、' + elmKey
            }
            idx++
          })
        })
        this.displayZone = this.displayZone + '區'
      }
      this.displayDepartment = this.departmentS
      // ------------------------------
      var zoneArr = this.zoneS[this.departmentS]
      // var zoneArrFilter = []
      // var selectedDate = this.selectedDateS // moment().format('YYYY-MM-DD')
      this.selectedDate = this.selectedDateS
      if (this.departmentS !== '全廠') {
        if (zoneArr.includes('全課')) {
          this.zoneStrArr = ['全課']
          /* zoneArrFilter = zoneArr.filter((elm) => {
            return elm !== '全課'
          }) */
        } else {
          this.zoneStrArr = zoneArr
          // zoneArrFilter = zoneArr
        }
        /* zoneArrFilter.forEach((zone) => {
          selectedDate = moment(this.selectedDateS).format('YYYY-MM-DD')
        }) */
      }
    })
  },
  beforeDestroy () {
    this.$socket.emit('deleteClientDailyReportIntegrated', this.pageID)
  },
  computed: {
  },
  watch: {
    checked: function () {
      this.updateRenderTable()
    },
    departmentS: function () {
      this.updateRenderTable()
    },
    zoneS: function () {
      this.updateRenderTable()
    },
    selectedDateS: function () {
      var dayStr = ''
      switch (moment(this.selectedDateS).format('d')) {
        case '0':
          dayStr = '星期日'
          break
        case '1':
          dayStr = '星期一'
          break
        case '2':
          dayStr = '星期二'
          break
        case '3':
          dayStr = '星期三'
          break
        case '4':
          dayStr = '星期四'
          break
        case '5':
          dayStr = '星期五'
          break
        case '6':
          dayStr = '星期六'
          break
      }
      this.displayValue = (parseInt(moment(this.selectedDateS).format('YYYY')) - 1911) + '年' + moment(this.selectedDateS).format('M') + '月' + moment(this.selectedDateS).format('D') + '日 ' + dayStr
      this.updateRenderTable()
    },
    department: function () {
      this.updateRenderTable()
    },
    zone: function () {
      this.updateRenderTable()
    }
  },
  sockets: {
    'updateShiftDailyReportInteg': function (val) {
      assignedShiftTable(this.rows, this.$set, val)
    },
    'updateAccDailyReportInteg': function (val) {
      assignedAccTable(this.rows, this.$set, val)
    },
    'getUniqueID': function (val) {
      if (val !== '') {
        this.pageID = val
        this.$socket.emit('addClientDailyReportIntegrated', val)
      }
    }
  },
  mounted () {
    this.getShiftNameArr()
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    this.$forceUpdate()
    this.updateRenderTable()
  },
  components: {
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
    contructColumns () {
      this.columns.splice(0, this.columns.length)
      var columnsObjHeadKeys = Object.keys(this.columnsObjHead)
      columnsObjHeadKeys.forEach(elm => {
        this.columns.splice(this.columns.length, 0, {
          label: this.columnsObjHead[elm],
          field: elm,
          name: elm,
          required: true,
          shift: false,
          style: { color: '#8B0000' }
        })
      })
      var shiftKeysArr = Object.keys(this.shiftKeys)
      shiftKeysArr.forEach(elm => {
        this.columns.splice(this.columns.length, 0, {
          label: elm,
          field: this.shiftKeys[elm].key,
          name: this.shiftKeys[elm].key,
          required: true,
          shift: true
        })
      })
      var columnsObjKeys = Object.keys(this.columnsObj)
      columnsObjKeys.forEach(elm => {
        this.columns.splice(this.columns.length, 0, {
          label: this.columnsObj[elm],
          field: elm,
          name: elm,
          required: true,
          shift: false
        })
      })
      // console.log('this.columns')
      // console.log(this.columns)
    },
    getShiftNameArr () {
      // console.log('getShiftNameArr')
      // this.shiftKeys.splice(0, this.shiftKeys.length)
      this.shiftKeys = {} // .length = 0
      $.get('/api/shiftTimeConfig', {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else if (results.data.length === 0) {
          alert('沒有機台資料')
        } else {
          this.shiftKeys = results.data
          this.contructColumns()
          this.$forceUpdate()
        }
      })
    },
    test () {
    },
    updateRenderTable () {
      if (this.$q.loading.isActive) {
        return
      }
      this.$q.loading.show({
        delay: 400 // ms
      })
      // ------------------------------
      this.machineIDArr = recursiveMakeMachineArr(this.zoneS)
      this.organDept = recursiveFindDept(this.zoneS)
      if (this.organDept > 3) {
        this.displayZone = ''
      } else {
        var idx = 0
        this.zoneS[this.departmentS].forEach(elm => {
          Object.keys(elm).forEach(elmKey => {
            if (idx === 0) {
              this.displayZone = elmKey
            } else {
              this.displayZone = this.displayZone + '、' + elmKey
            }
            idx++
          })
        })
        this.displayZone = this.displayZone + '區'
      }
      this.displayDepartment = this.departmentS
      this.$forceUpdate()
      // ------------------------------
      renderTable(this.rows, this.department, this.machineIDArr, moment(this.selectedDateS).format('YYYY-MM-DD'), this.pageID, this.$socket, this.$q.loading)
    },
    sel () {
    },
    ttt (newVal) {
      var selectedDate = moment(newVal).format('YYYY-MM-DD')
      this.$router.push({name: 'IntegratedDailyReport', params: {selectedDateS: selectedDate, departmentS: this.departmentS, zoneS: this.zoneS, checked: this.checked}})
    },
    sortEvent () {
      if (!this.sortFalling) {
        this.rows.sort(function (a, b) {
          return a.machineIDLabel > b.machineIDLabel ? 1 : (a.machineIDLabel < b.machineIDLabel) ? -1 : (a.machineID === '合計') ? 1 : (b.machineID === '合計') ? 1 : (a.tgtfinishTimeFullType > b.tgtfinishTimeFullType) ? 1 : -1
        })
      } else {
        this.rows.sort(function (a, b) {
          return a.machineIDLabel < b.machineIDLabel ? 1 : (a.machineIDLabel > b.machineIDLabel) ? -1 : (a.machineID === '合計') ? 1 : (b.machineID === '合計') ? 1 : (a.tgtfinishTimeFullType < b.tgtfinishTimeFullType) ? 1 : -1
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
  }
}
function renderTable (rows, department, machineIDs, iReportDate, pageID, socket, loading) {
  // init the records in the rows
  rows.splice(0, rows.length)
  rows.length = 0
  var reportDate = moment(iReportDate).format('YYYY-MM-DD 00:00:00')
  $.get('/api/getDailyIntegratedReport/' + machineIDs + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
      loading.hide()
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
      loading.hide()
    } else {
      var retObj = results.data
      var retObjKeys = Object.keys(retObj)
      retObjKeys.forEach(retObjKey => {
        var records = retObj[retObjKey]
        records.forEach(record => {
          var ackDate = moment(record['trigTime']).format('YYYY-MM-DD')
          var sendDate = ackDate
          if (ackDate === sendDate) {
            var performance = 0
            if (record['average'] > 0) {
              performance = Math.round(record['standard'] / record['average'] * 1000000) / 10
            }
            rows.splice(rows.length, 0, {
              machineIDLabel: record['machineID'],
              machineID: record['machineID'],
              first: false, // record['first'],
              second: false, // record['second'],
              third: false, // record['third'],
              1: false,
              2: false,
              3: false,
              4: false,
              totalAlm: record['totalAlm'],
              orderNumber: record['orderNumber'],
              product: record['product'],
              cavities: record['cavities'],
              trigTime: moment(record['trigTime']).format('M/DD HH:mm:ss'),
              lastTrigTime: moment(record['lastTrigTime']).format('M/DD HH:mm:ss'),
              shiftHour: '-',
              duration: formatSecond(record['duration'] / 1000),
              moldCount: record['moldCount'],
              predProductCnt: record['predProductCnt'],
              standard: record['standard'],
              min: Math.round((record['min'] || 0) * 10) / 10,
              average: Math.round(record['average'] / 100) / 10,
              performance: performance,
              predMoldCnt: record['predMoldCnt'],
              accMoldCnt: record['accMoldCnt'],
              percentage: Math.round(record['percentage'] * 1000) / 10,
              tgtfinishTime: moment(record['tgtfinishTime']).format('M/DD HH:mm:ss'),
              deadline: moment(parseInt(record['deadline'].split('/Date(')[1].split(')/')[0])).format('YYYY/MM/DD'),
              trigTimeFullType: moment(record['trigTime']).format('YYYY/MM/DD HH:mm:ss'),
              lastTrigTimeFullType: moment(record['lastTrigTime']).format('YYYY/MM/DD HH:mm:ss'),
              tgtfinishTimeFullType: moment(record['tgtfinishTime']).format('YYYY/MM/DD') //  HH:mm:ss
            })
          }
          var sendData = {
            machineID: record['machineID'],
            orderNumber: record['orderNumber']
          }
          socket.emit('reqUpdateAccDailyReportIntegrated', sendData)
        })
        if (records.length > 0) {
          rows.splice(rows.length, 0, {
            machineIDLabel: retObjKey,
            orderNumber: '-',
            machineID: '合計',
            trigTime: '-',
            lastTrigTime: '-'
          })
          var sendData = {
            machineID: retObjKey,
            orderNumber: '-',
            reportDate: reportDate,
            trigTime: '-',
            lastTrigTime: '-'
          }
          socket.emit('reqUpdateShiftDailyReportIntegrated', sendData)
        }
      })
      rows.sort(function (a, b) {
        return a.machineIDLabel > b.machineIDLabel ? 1 : (a.machineIDLabel < b.machineIDLabel) ? -1 : (a.machineID === '合計') ? 1 : (b.machineID === '合計') ? 1 : (a.tgtfinishTimeFullType > b.tgtfinishTimeFullType) ? 1 : -1
      })
      loading.hide()
    }
  })
}
function formatSecond (secs) {
  var hr = Math.floor(secs / 3600)
  var min = Math.floor((secs - (hr * 3600)) / 60)
  var sec = parseInt(secs - (hr * 3600) - (min * 60))
  if (min === 0) {
    min = '00'
  } else if (min < 10) {
    min = '0' + min
  }
  if (sec === 0) {
    sec = '00'
  } else if (sec < 10) {
    sec = '0' + sec
  }
  if (hr > 0) {
    hr += ':'
  } else {
    hr = '0:'
  }
  return hr + min + ':' + sec
}
function formatMinute (minOrg) {
  var hr = Math.floor(minOrg / 60)
  var min = Math.floor((minOrg - (hr * 60)))
  while (min.length < 2) {
    min = '0' + min
  }
  if (hr) hr += ':'
  return hr + min
}
/* function assignedShiftTable (rows, fun, val) {
  var shift = {'first': [8, 30], 'second': [3, 30], 'third': [12, 0]}
  var shiftKey = Object.keys(shift)
  rows.forEach((rowData, index, arr) => {
    if (rowData['machineIDLabel'] === val.machineID) {
      if (rowData['machineID'] === '合計') {
        var totalMin = 0
        var totalHour = 0
        shiftKey.forEach(elm => {
          if (val[elm]) {
            totalMin += (shift[elm])[1]
            totalHour += (shift[elm])[0]
            if (totalMin >= 60) {
              totalMin -= 60
              totalHour++
            }
          }
        })
        Vue.set(arr[index], 'first', val.first)
        Vue.set(arr[index], 'second', val.second)
        Vue.set(arr[index], 'third', val.third)
        if (totalHour > 0 || totalMin > 0) {
          Vue.set(arr[index], 'shiftHour', (totalHour + ':' + formatMinute(totalMin) + ':00'))
        }
      }
    }
  })
} */
function assignedShiftTable (rows, fun, val) {
  if (val.shiftData !== null) {
    rows.forEach((rowData, index, arr) => {
      if ((rowData['machineIDLabel'] === val.machineID) && (rowData['machineID'] === '合計')) {
        var totalMin = 0
        var totalHour = 0
        var shift = val.shiftData.shift
        var initDoc = val.shiftData.initDoc
        var shiftKey = Object.keys(shift)
        shiftKey.forEach(elm => {
          if (shift[elm].work) {
            var toArr = initDoc[shift[elm].to].split(':')
            var fromArr = initDoc[shift[elm].from].split(':')
            totalMin += Number(toArr[1]) - Number(fromArr[1])
            totalHour += Number(toArr[0]) - Number(fromArr[0])
            if (Number(toArr[0]) < Number(fromArr[0])) {
              totalHour += 24
            }
            if (totalMin >= 60) {
              totalMin -= 60
              totalHour++
            } else if (totalMin < 0) {
              totalMin += 60
              totalHour--
            }
          }
          Vue.set(arr[index], shift[elm].key, shift[elm].work)
        })
        if (totalHour > 0 || totalMin > 0) {
          Vue.set(arr[index], 'shiftHour', (totalHour + ':' + formatMinute(totalMin) + ':00'))
        }
      }
    })
    // console.log('showData')
    // console.log(rows)
  }
}
function assignedAccTable (rows, fun, val) {
  rows.forEach((rowData, index, arr) => {
    if (rowData['machineID'] === val.machineID) {
      if (rowData['orderNumber'] === val.orderNumber) {
        Vue.set(arr[index], 'accMoldCnt', val.accMoldCnt)
        // Vue.set(arr[index], 'percentage', `${Math.round(val.percentage * 1000) / 10}%`)
        Vue.set(arr[index], 'percentage', `${Math.round(val.accMoldCnt / arr[index]['predMoldCnt'] * 1000) / 10}%`)
        Vue.set(arr[index], 'percentageFullType', Math.round(val.accMoldCnt / arr[index]['predMoldCnt'] * 1000))
        var seconds = Math.round(((arr[index]['predMoldCnt'] * 1.03) - val.accMoldCnt) * arr[index]['average'])
        var tgtfinishTime = moment(val.tgtfinishTime, 'YYYY-MM-DD HH:mm:ss.SSS') // .format('YYYY-MM-DD HH:mm:ss.SSS')
        if (Math.round(val.accMoldCnt / arr[index]['predMoldCnt'] * 1000) < 1000) {
          tgtfinishTime = moment(val.tgtfinishTime, 'YYYY-MM-DD HH:mm:ss.SSS').add(seconds, 's')
        }
        if (arr[index]['accMoldCnt'] > 0) {
          Vue.set(arr[index], 'tgtfinishTimeFullType', tgtfinishTime.format('YYYY/MM/DD')) //  HH:mm:ss.SSS
          Vue.set(arr[index], 'tgtfinishTime', (tgtfinishTime.year() - 1911) + '/' + tgtfinishTime.format('MM/DD HH:mm'))
        }
      }
    }
  })
}
function getPageSetting (colorArr, colorConditionArr, blink) {
  $.get('/api/getPageSetting', {}, (results) => {
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
      console.log(results.data)
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
    }
  })
}
function recursiveMakeMachineArr (orgParam) {
  if (typeof orgParam !== 'object') {
    return [orgParam]
  } else {
    var retArr = []
    var objKeys = Object.keys(orgParam)
    objKeys.forEach(obj => {
      orgParam[obj].forEach(elm => {
        retArr = retArr.concat(recursiveMakeMachineArr(elm))
      })
    })
    return retArr
  }
}
function recursiveFindDept (orgParam) {
  if (typeof orgParam !== 'object') {
    return 1
  } else {
    var retInt = 0
    var retMaxInt = 0
    var objKeys = Object.keys(orgParam)
    objKeys.forEach(obj => {
      orgParam[obj].forEach(elm => {
        retInt = recursiveFindDept(elm)
        if (retMaxInt < retInt) {
          retMaxInt = retInt
        }
      })
    })
    return retMaxInt + 1
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
.my-label
  padding 5px
  border-radius 3px
  display inline-block
.shape1
  display:inline-block!important
  width:12px
  height:12px
  background-color:#FFFFFF
.shape2
  display:inline-block!important
  width:12px
  height:12px
  background-color:#000000
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
  h4{
     font-family: Microsoft JhengHei;
     font-size:200%;
     font-weight:bold;
    }
   h5{
     font-family: Microsoft JhengHei;
     font-size:150%;
     font-weight:bold;
    }
   span{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
    }
  .q-checkbox{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
    }
  .q-btn{
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight: 200;
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
</style>
