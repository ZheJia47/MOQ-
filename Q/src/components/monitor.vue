<template>
<div class="layout-padding">
  <section class="content ">
   <div class="row inline bg-light-blue-7 full-width glossy">
    <div class="col-12 q-pl-xl text-white">
      <h4>機台監控</h4>
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
      <q-btn outline glossy label='欄位選擇' icon="icon-svg53" @click="printAA(), visibleSetting=(visibleSetting? false: true)"/>
      <q-btn outline glossy label='色彩設定' icon="icon-svg54" @click="colorSetting=(colorSetting ? false: true)"/>
      <q-btn outline glossy label='列印' icon="icon-svg58" @click="print()"/>
    </div>
   <!--<div class="row justify-center full-width bg-grey-3">
     <div class="row inline q-mr-xl q-pr-xl">
      <div class="col-auto bg-grey-3 q-mb-sm q-mt-md">
         <q-table
            :data="rows"
            :columns="columns"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="false"
            separator="cell"
            row-key="name"
            hide-bottom
          >
            <q-td slot="body-cell-statusName" slot-scope="cell">
              <div v-if="cell.row.statusName === '全自動'">
                <q-icon name="icon-auto"  style="font-size: 25px"/>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '半自動'">
                <q-icon name="icon-halfAuto"  style="font-size: 25px"/>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '手動'">
                <q-icon name="icon-manual" size="4px"/>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '停機'">
                <q-icon name="clear" size="36px"/>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '當日警報'">
                <q-icon name="grade" size="36px"/>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '訊號異常'">
                <q-icon name="error" size="36px"/>
                {{cell.row.statusName}}
              </div>
              <div v-else-if="cell.row.statusName === '系統啟動'">
                {{cell.row.statusName}}
                </div>
              <div v-else>
                {{cell.row.statusName}}
              </div>
            </q-td>
          </q-table>
        </div>
        <div class="col-auto bg-grey-3 q-mb-sm q-ml-md q-mt-md">
          <q-table
            :data="rows1"
            :columns="columns1"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="false"
            separator="cell"
            row-key="name"
            hide-bottom
          >
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td v-for="column in columns1" v-bind:key="column.name" v-if="(column.name === 'machineID')" :props="props">
              <q-btn :label="props.row.machineID" @click="openModal(props.row.machineID)" v-ripple.mat color="orange" text-color="dark">
              </q-btn>
            </q-td>
            <q-td :key="column.name" v-else-if="(column.name === 'machineStatus')" :props="props">
              <div v-if="props.row.machineStatus === '全自動'" >
                <q-icon name="icon-auto"  color="green"/>
              </div>
              <div v-else-if="props.row.machineStatus === '半自動'" >
                <q-icon name="icon-halfAuto"  color="red"/>
              </div>
              <div v-else-if="props.row.machineStatus === '手動'">
                <q-icon name="icon-manual"  color="yellow" size="36px"/>
              </div>
              <div v-else-if="props.row.machineStatus === '關機'" >
                <q-icon name="clear"  color="blue" size="36px"/>
              </div>
              <div v-else-if="props.row.machineStatus === '警報'" >
                <q-icon name="clear"  color="blue" size="36px"/>
              </div>
              <div  v-else >
                <q-icon name="remove_red_eye"  color="black" size="36px"/>
              </div>
            </q-td>
            <q-td :key="column.name" v-else :props="props">
              {{props.row[column.name]}}
            </q-td>
          </q-tr>
          </q-table>
      </div>
      </div>
      </div>-->
      <div v-show="groupObjArr[key][0].total > 0" v-for="(objKey, key) in groupObjArr" v-bind:key="key" class="row justify-center full-width bg-grey-3">
      <div class="row inline q-ml-xl q-mr-xl q-pr-xl q-mt-xs">
      <div class="col-auto bg-grey-3 q-mb-sm q-mt-md">
        <div v-show="visibleSetting" v-for="(col) in groupObjCols[key]" v-bind:key="col.name" class="row inline q-ml-xl q-mr-xl q-pr-xl q-mt-xs">
          <q-checkbox v-model="col.required"/>
        </div>
        <div v-show="visibleSetting" v-for="(row, key2) in groupObjArr[key]" v-bind:key="key2">
          <q-checkbox v-model="row.required"/>
        </div>
         <q-table
            :data="groupObjArr[key]"
            :columns="groupObjCols[key]"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="false"
            separator="cell"
            row-key="name"
            hide-bottom
            :visible-columns="visibleGroupObjArr[key]"
          >
          <q-td slot="body-cell-total" slot-scope="cell" style="';fontSize:20px;'" v-show="cell.row.required">
            {{cell.row.total}}
          </q-td>
            <q-td slot="body-cell-statusName" slot-scope="cell" v-show="cell.row.required"
            :style="'background-color:  ' + (cell.row.statusName === '自動生產' ? bgColorAutoAll :
              cell.row.statusName === '全自動' ? bgColorAutoFull :
              cell.row.statusName === '半自動' ? bgColorAutoHalf :
              cell.row.statusName === '手動' ? bgColorManual :
              cell.row.statusName === '停機' ? bgColorPowerOff:
              cell.row.statusName === '當日警報' ? bgColorAlarm :
              cell.row.statusName === '訊號異常' ? bgColorSignalError : bgColorOther) + ';fontSize:20px;'"
            >
              <q-icon :name="cell.row.statusName === '全自動' ? 'icon-auto' :
              cell.row.statusName === '半自動' ? 'icon-halfAuto' :
              cell.row.statusName === '手動' ? 'icon-manual' :
              cell.row.statusName === '停機' ? 'clear':
              cell.row.statusName === '當日警報' ? 'grade' :
              cell.row.statusName === '訊號異常' ? 'error' : 'clear'"
              :style="'font-size: ' + (cell.row.statusName === '自動生產' ? '25px;' :
              cell.row.statusName === '全自動' ? '25px;' :
              cell.row.statusName === '半自動' ? '4px;' :
              cell.row.statusName === '手動' ? '36px;' :
              cell.row.statusName === '停機' ? '36px;':
              cell.row.statusName === '當日警報' ? '36px;' :
              cell.row.statusName === '訊號異常' ? '36px;' : '25px;')"/>
                {{cell.row.statusName}}
              <q-popup-edit v-if="cell.row.statusName === '自動生產'" v-model="bgColorAutoAll" :disable="colorSetting">
                <q-color-picker v-model="bgColorAutoAll" />
              </q-popup-edit>
              <q-popup-edit v-else-if="cell.row.statusName === '全自動'" v-model="bgColorAutoFull" :disable="colorSetting">
                <q-color-picker v-model="bgColorAutoFull" />
              </q-popup-edit>
              <q-popup-edit v-else-if="cell.row.statusName === '半自動'" v-model="bgColorAutoHalf" :disable="colorSetting">
                <q-color-picker v-model="bgColorAutoHalf" />
              </q-popup-edit>
              <q-popup-edit v-else-if="cell.row.statusName === '手動'" v-model="bgColorManual" :disable="colorSetting">
                <q-color-picker v-model="bgColorManual" />
              </q-popup-edit>
              <q-popup-edit v-else-if="cell.row.statusName === '停機'" v-model="bgColorPowerOff" :disable="colorSetting">
                <q-color-picker v-model="bgColorPowerOff" />
              </q-popup-edit>
              <q-popup-edit v-else-if="cell.row.statusName === '當日警報'" v-model="bgColorAlarm" :disable="colorSetting">
                <q-color-picker v-model="bgColorAlarm" />
              </q-popup-edit>
              <q-popup-edit v-else-if="cell.row.statusName === '訊號異常'" v-model="bgColorSignalError" :disable="colorSetting">
                <q-color-picker v-model="bgColorSignalError" />
              </q-popup-edit>
              <q-popup-edit v-else v-model="bgColorOther" :disable="colorSetting">
                <q-color-picker v-model="bgColorOther" />
                </q-popup-edit>
              <!--<p v-if="cell.row.statusName === '自動生產'">
                {{cell.row.statusName}}
              </p>
              <p v-else-if="cell.row.statusName === '全自動'">
                <q-icon name="icon-auto"  style="font-size: 25px"/>
                {{cell.row.statusName}}
              </p>
              <p v-else-if="cell.row.statusName === '半自動'">
                <q-icon name="icon-halfAuto"  style="font-size: 25px"/>
                {{cell.row.statusName}}
              </p>
              <p v-else-if="cell.row.statusName === '手動'">
                <q-icon name="icon-manual" size="4px"/>
                {{cell.row.statusName}}
              </p>
              <p v-else-if="cell.row.statusName === '停機'">
                <q-icon name="clear" size="36px"/>
                {{cell.row.statusName}}
              </p>
              <p v-else-if="cell.row.statusName === '當日警報'">
                <q-icon name="grade" size="36px"/>
                {{cell.row.statusName}}
              </p>
              <p v-else-if="cell.row.statusName === '訊號異常'">
                <q-icon name="error" size="36px"/>
                {{cell.row.statusName}}
              </p>
              <p v-else-if="cell.row.statusName === '系統啟動'">
                {{cell.row.statusName}}
                </p>
              <p v-else>
                {{cell.row.statusName}}
              </p>-->
            </q-td>
          </q-table>
        </div>
      <div v-show="subVal.length > 0" v-for="(subVal, subKey) in subGroup[key]" v-bind:key="subKey" class="col-auto bg-grey-3 q-mb-sm q-ml-md q-mt-md">
      <!--<div class="col-auto bg-grey-3 q-mb-sm q-mt-md">-->
        <div v-show="visibleSetting" v-for="(col) in columns1" v-bind:key="col.name" class="row inline q-ml-xl q-mr-xl q-pr-xl q-mt-xs">
          <q-checkbox v-model="col.required"/>
        </div>
         <q-table
            :data="subVal"
            :columns="columns1"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="false"
            separator="cell"
            row-key="name"
            hide-bottom
            :visible-columns="visibleSubGroup[key]"
          >
            <q-tr slot="body" slot-scope="props">
            <q-td v-for="column in columns1" v-bind:key="column.name" v-if="(column.name === 'machineID')" :props="props"
              :style="'background-color:  ' + (
              props.row.machineStatus === '全自動' ? bgColorAutoFull :
              props.row.machineStatus === '半自動' ? bgColorAutoHalf :
              props.row.machineStatus === '手動' ? bgColorManual :
              props.row.machineStatus === '關機' ? bgColorPowerOff:
              props.row.machineStatus === '警報' ? bgColorAlarm :
              props.row.machineStatus === '訊號異常' ? bgColorSignalError : bgColorOther) + ';fontSize:20px;'"
            >
              <q-btn :label="props.row.machineID" @click="openModal(props.row.machineID)" v-ripple.mat color="orange" text-color="dark">
              </q-btn>
            </q-td>
            <q-td :key="column.name" v-else-if="(column.name === 'machineStatus')" :props="props"
              :style="'background-color:  ' + (
              props.row.machineStatus === '全自動' ? bgColorAutoFull :
              props.row.machineStatus === '半自動' ? bgColorAutoHalf :
              props.row.machineStatus === '手動' ? bgColorManual :
              props.row.machineStatus === '關機' ? bgColorPowerOff:
              props.row.machineStatus === '警報' ? bgColorAlarm :
              props.row.machineStatus === '訊號異常' ? bgColorSignalError : bgColorOther) + ';fontSize:20px;'"
            >
              <q-icon :name="props.row.machineStatus === '全自動' ? 'icon-auto' :
                props.row.machineStatus === '半自動' ? 'icon-halfAuto' :
                props.row.machineStatus === '手動' ? 'icon-manual' :
                props.row.machineStatus === '關機' ? 'clear':
                props.row.machineStatus === '警報' ? 'grade' :
                props.row.machineStatus === '訊號異常' ? 'error' : 'clear'"
                :style="'font-size: ' + (
                props.row.machineStatus === '全自動' ? '25px;' :
                props.row.machineStatus === '半自動' ? '4px;' :
                props.row.machineStatus === '手動' ? '36px;' :
                props.row.machineStatus === '關機' ? '36px;':
                props.row.machineStatus === '警報' ? '36px;' :
                props.row.machineStatus === '訊號異常' ? '36px;' : '25px;')"
                :color="(
                props.row.machineStatus === '全自動' ? 'lime' :
                props.row.machineStatus === '半自動' ? 'red' :
                props.row.machineStatus === '手動' ? 'yellow' :
                props.row.machineStatus === '關機' ? 'clear':
                props.row.machineStatus === '警報' ? 'blue' :
                props.row.machineStatus === '訊號異常' ? 'black' : 'black')"
              />
              <!--<div v-if="props.row.machineStatus === '全自動'" >
                <q-icon name="icon-auto"  color="green"/>
              </div>
              <div v-else-if="props.row.machineStatus === '半自動'" >
                <q-icon name="icon-halfAuto"  color="red"/>
              </div>
              <div v-else-if="props.row.machineStatus === '手動'">
                <q-icon name="icon-manual"  color="yellow" size="36px"/>
              </div>
              <div v-else-if="props.row.machineStatus === '關機'" >
                <q-icon name="clear"  color="blue" size="36px"/>
              </div>
              <div v-else-if="props.row.machineStatus === '警報'" >
                <q-icon name="clear"  color="blue" size="36px"/>
              </div>
              <div  v-else >
                <q-icon name="remove_red_eye"  color="black" size="36px"/>
              </div>-->
            </q-td>
            <q-td :key="column.name" v-else :props="props" style="';fontSize:20px;'">
              {{props.row[column.name]}}
            </q-td>
          </q-tr>
          </q-table>
        <!--</div>-->
        </div>
      </div>
    </div>
    </section>
  <q-modal ref="basicModal" :position="position" :content-css="{padding: '10px', maxWidth: '50%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
  <div class="row content-around bg-light-blue-9 full-width glossy">
  <div class="col-auto text-white q-ml-xl">
    <h4>{{id}}</h4>
    </div>
    </div>
    <div class="row content-around">
    <div class="column inline justify-top no-margin">
      <div class="col-6 q-mt-xs q-ml-xs">
        <div v-show="visibleSetting" v-for="(col) in columns2" v-bind:key="col.name" class="row inline q-ml-xl q-mr-xl q-pr-xl q-mt-xs">
          <q-checkbox v-model="col.required"/>
        </div>
         <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
         <q-table
            :data="rows2"
            :columns="columns2"
            :config="config"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
            separator="cell"
            row-key="name"
            hide-bottom
            hide-header
            :visible-columns="visibleColumns2"
          >
          </q-table>
          </table>
          <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
         <q-table
            :data="rows4"
            :columns="columns4"
            :config="config"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
            separator="cell"
            row-key="name"
            hide-bottom
            hide-header
          >
          </q-table>
          </table>
        </div>
        <div class="col-2 q-ma-xs">
        <div class="app" style=" width:65%;">
          <div v-show="show & pieUtilization | visibleSetting">
            <!--<component :is="view"></component>-->
            <pie-chart :label="utilization.labels" :data="utilization.data" :color="producePieColor" :options="myChart2Options"></pie-chart>
            <q-checkbox v-show="visibleSetting" v-model="pieUtilization"/>
            稼動率
          </div>
          <div v-show="show & pieAchieveRate | visibleSetting">
            <!--<component :is="view"></component>-->
            <pie-chart :label="myChart2.labels" :data="myChart2.data" :color="producePieColor" :options="myChart2Options"></pie-chart>
            <q-checkbox v-show="visibleSetting" v-model="pieAchieveRate"/>
            達成率
          </div>
          <div v-show="show & pieCurrBadRate | visibleSetting">
            <!--<component :is="view"></component>-->
            <pie-chart :label="currBadRate.labels" :data="currBadRate.data" :color="producePieColor" :options="myChart2Options"></pie-chart>
            <q-checkbox v-show="visibleSetting" v-model="pieCurrBadRate"/>
            歷史不良率
          </div>
          <div v-show="show & piePrevBadRate | visibleSetting">
            <!--<component :is="view"></component>-->
            <pie-chart :label="prevBadRate.labels" :data="prevBadRate.data" :color="prevBadRate.color" :options="myChart2Options"></pie-chart>
            <q-checkbox v-show="visibleSetting" v-model="piePrevBadRate"/>
            歷史不良率
          </div>
          <div id="flot-memo" style="text-align:center;height:30px;width:250px;height:20px;text-align:center;margin:0 auto"></div>
      </div>
      </div>
     </div>
        <div class="col-5 q-mt-xs q-ml-sm">
          <div v-for="(col) in columns3" v-bind:key="col.name" class="row inline q-ml-xl q-mr-xl q-pr-xl q-mt-xs">
            <q-checkbox v-show="visibleSetting" v-model="col.required"/>
            <!--<div v-if="col.name==='current'" label="現況"/>
            <div v-else-if="col.name==='next'" label="下一張"/>-->
          </div>
          <div v-show="visibleSetting" v-for="(row) in rows3" v-bind:key="row._id">
            <q-checkbox v-model="row.required"/>
          </div>
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
          <q-table
            :data="rows3"
            :columns="columns3"
            :config="config"
          :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
          separator="cell"
            row-key="name"
            hide-bottom
            :visible-columns="visibleColumns3"
          >
            <q-tr slot="body" slot-scope="props" :props="props">
              <q-td v-for="col in columns3" v-bind:key="col.name" :props="props" v-show="props.row.required">
                <div>
                  {{props.row[col.name]}}
                </div>
              </q-td>
            </q-tr>
          </q-table>
        </table>
        </div>
        <div class="col-3 q-ml-xl">
        <q-btn v-if="show" color="primary" @click="showClose()">顯示</q-btn>
        <q-btn v-else color="primary" @click="showClose()">隱藏</q-btn>
        <q-btn color="primary" @click="$refs.basicModal.hide()">關閉</q-btn>
      </div>
        </div>
        <div v-show="visibleSetting | available">
          <div>
            <q-checkbox v-model="available" v-show="visibleSetting"/>
            適用生產機台
          </div>
        <table v-show="visibleSetting | available">
          <q-table
            :data="rows5"
            :columns="columns3"
            :config="config"
          :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
          separator="cell"
            row-key="name"
            hide-bottom
          >
          </q-table>
        </table>
        </div>
  </q-modal-layout>
  </q-modal>
  <!--<q-modal ref="basicModal" :position="position" :content-css="{padding: '10px', maxWidth: '50%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
  <div class="row content-around bg-light-blue-9 full-width glossy">
  <div class="col-auto text-white q-ml-xl">
    <h4>{{id}}</h4>
    </div>
    </div>
    <div class="row content-around">
    <div class="column inline justify-top no-margin">
         <div class="col-6 q-mt-xs q-ml-xs">
         <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
         <q-table
            :data="rows2"
            :columns="columns2"
            :config="config"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
            separator="cell"
            row-key="name"
            hide-bottom
          >
          </q-table>
         <q-table
            :data="rows4"
            :columns="columns4"
            :config="config"
            :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
            separator="cell"
            row-key="name"
            hide-bottom
            hide-header
          >
          </q-table>
          </table>
        </div>
        <div class="col-2 q-ma-xs">

      </div>
     </div>
        <div class="col-5 q-mt-xs q-ml-sm">
        <table class="q-table responsive" border="5" cellpadding="3" cellspacing="1" style="border: 3px solid #FFAE7F border-collapse: collapse; width:100%;">
          <q-table
            :data="rows3"
            :columns="columns3"
            :config="config"
          :rows-per-page-options="config.pagination.options"
            :selected-rows-label="sel()"
            :pagination.sync="serverPagination"
            :dense="true"
          separator="cell"
            row-key="name"
            hide-bottom
          >
          </q-table>
        </table>
        </div>
        <div class="col-3 q-ml-xl">
        <q-btn v-if="show" color="primary" @click="showClose()">顯示</q-btn>
        <q-btn v-else color="primary" @click="showClose()">隱藏</q-btn>
        <q-btn color="primary" @click="$refs.basicModal.hide()">關閉</q-btn>
      </div>
        </div>
  </q-modal-layout>
  </q-modal>-->
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'moment-duration-format'
import schedule from 'node-schedule'
let rule = new schedule.RecurrenceRule()
rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
// import {observable} from 'mobx' // autorun
// import orderNumber from './OrderNumberEdit'
// import moldNum from './MoldNumberEdit'
// outside of a Vue file
// import { Dialog } from 'quasar'
// import Chart from 'chart.js'
// import Pie from './Pie.js'
// import { Line } from 'vue-chartjs'
// import Vue from 'vue'
import {
  Dialog
} from 'quasar'
import Vue from 'vue'
export default {
  name: 'Tables1',
  // extends: Line,
  data: function () {
    return {
      available: true,
      pieUtilization: true,
      pieAchieveRate: true,
      pieCurrBadRate: true,
      piePrevBadRate: true,
      // -------------------------------
      colorSetting: true,
      bgColorAutoAll: '#57C253',
      bgColorAutoFull: '#91E68E',
      bgColorAutoHalf: '#91E68E',
      bgColorManual: '#D78EE6',
      bgColorPowerOff: '#ECF09E',
      bgColorAlarm: '#F0CB9E',
      bgColorSignalError: '#F09E9E',
      bgColorOther: 'white',
      // -------------------------------
      totalDays: 30,
      hoursADay: 24,
      calendar: [0],
      calendarPrev: [0],
      colorArr: [],
      colorConditionArr: [],
      colorConditionObj: {},
      blink: [],
      fromIndPrev: '',
      toIndPrev: '',
      totalWorkDays: [0],
      totalWorkHours: [0],
      totalPrevWorkDays: [0],
      totalPrevWorkHours: [0],
      fullscreen: false,
      visibleColumns: [],
      view: '',
      show: false,
      pageID: '',
      temp: [],
      myChart2: {},
      currBadRate: {},
      prevBadRate: {},
      utilization: {},
      producePieColor: ['#00D8FF', '#DD1B16'],
      // myChart2: { labels: [], datasets: [] },
      myChart2Options: {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
          mode: 'percentage',
          precision: 1
        }
      },
      serverPagination: {
        rowsPerPage: 20
      },
      flotcontainerAchieve: [],
      flotcontainerAchieveLabel: [],
      btnKey: undefined,
      id: '1A01',
      position: 'right',
      types: [
        {
          label: 'Basic',
          ref: 'basicModal'
        }
      ],
      customDialogModel: undefined,
      name: undefined,
      rows: [],
      columns1: [
        {
          label: '機台',
          field: 'machineID',
          name: 'machineID',
          required: true,
          width: '20%',
          filter: false,
          style: 'fontSize:20px;color:purple;',
          position: 'absolute',
          vertical: 'middle'
        },
        {
          label: '狀態',
          field: 'machineStatus',
          name: 'machineStatus',
          required: true,
          width: '15%',
          filter: false,
          style: 'fontSize:20px;color:purple;'
          // format: val => `${val}%`,
          /* format (value) {
            if (value === '全自動') {
              return '<q-icon name="remove_red_eye"  color="green"/>'// '<i class="fa fa-star" style="font-size:36px"></i>'
            } else if (value === '半自動') {
              return '<i class="fa fa-star-half-full" style="font-size:36px"></i>'
            } else if (value === '手動') {
              return '<i class="fa fa-hand-paper-o" style="font-size:36px;color:red"></i>'
            } else if (value === '關機') {
              return '<i class="fa fa-power-off" style="font-size:36px"></i>'
            } else {
              return '<i class="fa fa-chain" style="font-size:36px;"></i>'
            }
          } */
        },
        {
          label: '警報',
          field: 'totalAlm',
          name: 'totalAlm',
          required: true,
          width: '15%',
          filter: false,
          style: 'fontSize:20px;color:purple;'
          /* format (value) {
            return '<div><q-checkbox v-model="cell.data" @blur="showInfor(cell)"/><div'
          } */
        },
        {
          label: '成品料號',
          field: 'product',
          name: 'product',
          required: true,
          width: '20%',
          filter: false,
          sort: false,
          style: 'fontSize:20px;color:purple;'
        }
      ],
      rows1: [],
      columns3: [
        {
          label: '',
          field: 'name',
          name: 'name',
          required: true,
          width: '10px',
          filter: false,
          style: 'fontSize:20px;color:purple;'
        },
        {
          label: '當前生產',
          field: 'current',
          name: 'current',
          required: true,
          width: '10px',
          filter: false,
          style: 'fontSize:20px;color:purple;'
        },
        {
          label: '下一個',
          field: 'next',
          name: 'next',
          required: true,
          width: '10px',
          filter: false,
          style: 'fontSize:20px;color:purple;'
        }
      ],
      columns2: [
        {
          label: '名稱',
          field: 'name',
          name: 'name',
          required: true,
          slot: 'col-name',
          width: '50%',
          filter: false,
          style: 'fontSize:20px;color:purple;'
        },
        {
          label: '',
          field: 'info',
          name: 'info',
          required: true,
          slot: 'col-info',
          width: '50%',
          filter: false,
          style: 'fontSize:20px;color:purple;'
        }
      ],
      columns4: [
        {
          label: '名稱',
          field: 'name',
          name: 'name',
          required: true,
          slot: 'col-name',
          width: '50%',
          filter: false,
          style: 'fontSize:20px;color:purple;'
        },
        {
          label: '',
          field: 'info',
          name: 'info',
          required: true,
          slot: 'col-info',
          width: '50%',
          filter: false,
          style: 'fontSize:20px;color:purple;'
        }
      ],
      rows4: [],
      rows3: [],
      rows2: [],
      config: {
        noHeader: false,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        responsive: false,
        messages: {
          noData: '沒有資料可供顯示.',
          noDataAfterFiltering: '沒有資料可供顯示. 請重新檢視您的搜尋條件.'
        },
        pagination: {
          rowsPerPage: 20,
          options: [20, 50, 100, 200, 500]
        }
      },
      config3: {
        noHeader: false,
        refresh: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        responsive: false,
        messages: {
          noData: '沒有資料可供顯示.',
          noDataAfterFiltering: '沒有資料可供顯示. 請重新檢視您的搜尋條件.'
        }
      },
      intervalID: undefined,
      retArr: [],
      groupArr: [],
      groupObjArrLB: [],
      groupObjArr: {},
      visibleGroupObjArr: {},
      intervalID0: {},
      updateU: undefined,
      groupObjCols: {},
      subGroup: {},
      visibleSubGroup: {},
      visibleSetting: false,
      visibleColumns2: [],
      visibleColumns3: [],
      rows5: [{
        name: '機台編號1', current: '', next: ''
      }, {
        name: '機台編號2', current: '', next: ''
      }, {
        name: '機台編號3', current: '', next: ''
      }, {
        name: '機台編號4', current: '', next: ''
      }, {
        name: '機台編號5', current: '', next: ''
      }]
    }
  },
  created () {
    // renderTable(this.$set, this.rows1, this.columns1, '成型一課')
    // createRows(this.$set, this.rows, this.columns, '成型一課')
    // this.$socket.emit('commCommand', 'getUniqueID')
    getPageSetting(this.colorArr, this.colorConditionArr, this.blink)
    /* setInterval(() => {
      renderTable(this.$set, this.rows1, this.columns1, '成型一課')
    }, 20000) */
    /* this.intervalID = setInterval(() => {
      createRows(this.$set, this.rows, this.columns, '成型一課')
    }, 200000000000) */
  },
  deactivated () {
    var oKeys = Object.keys(this.intervalID0)
    oKeys.forEach(elm => {
      this.intervalID0[elm].cancel() // window.clearInterval(this.intervalID0[elm])
    })
    window.clearInterval(this.updateU)
    // console.log('deactivated')
  },
  beforeDestroy () {
    var oKeys = Object.keys(this.intervalID0)
    // console.log('beforeDestroy')
    // console.log(oKeys)
    oKeys.forEach(elm => {
      this.intervalID0[elm].cancel() // window.clearInterval(this.intervalID0[elm])
      // console.log(elm)
    })
    window.clearInterval(this.updateU)
    // console.log('beforeDestroy')
  },
  destroyed () {
    // this.$socket.emit('deleteClientMonitor', this.pageID)
    // clearInterval(this.intervalID)
    var oKeys = Object.keys(this.intervalID0)
    oKeys.forEach(elm => {
      this.intervalID0[elm].cancel() // window.clearInterval(this.intervalID0[elm])
    })
    window.clearInterval(this.updateU)
    // console.log('destroy')
  },
  computed: {
  },
  watch: {
    subGroup: function () {
      // this.xyz()
    },
    colorConditionArr: function () {
      var from = moment().date(1).format('YYYY-MM-DD')
      var to = moment().add(1, 'month').date(0).format('YYYY-MM-DD')
      var fromIndPrev = moment().subtract(1, 'month').date(1).format('YYYY-MM-DD')
      var toIndPrev = moment().date(0).format('YYYY-MM-DD')
      this.getValidCalendar(from, to)
      this.getPrevValidCalendar(fromIndPrev, toIndPrev)
    },
    calendar: function () {
      this.selectedWorkDay()
    },
    calendarPrev: function () {
      this.selectedPrevWorkDay()
    },
    rows2: function () {
      /* this.$set(this.utilization, 'labels', [])
      this.$set(this.utilization, 'data', [])
      this.rows2.forEach(row2 => {
        if (row2._id === 'monthlyUtilization') {
          // // console.log(row2._id + ': ' + row2.info)
          this.utilization['data'].splice(this.utilization['data'].length, 0, Number(100000000000))
          this.utilization['labels'].splice(this.utilization['labels'].length, 0, row2.name)
        } else if (row2._id === 'prevMonthlyUtilization') {
          // // console.log(row2._id + ': ' + row2.info)
          this.utilization['data'].splice(this.utilization['data'].length, 0, Number(100000000000))
          this.utilization['labels'].splice(this.utilization['labels'].length, 0, row2.name)
        }
      }) */
    },
    rows3: function () {

    },
    flotcontainerAchieve: function () {
      this.$nextTick(() => {
        var Num0 = this.flotcontainerAchieve[0].data
        var Num1 = this.flotcontainerAchieve[1].data - this.flotcontainerAchieve[0].data
        /* this.myChart2.length = 0
        this.myChart2.splice(0, 0, {
          labels: ['已生產', '未生產'],
          datasets: [
            {
              backgroundColor: ['#00D8FF', '#DD1B16'],
              data: [Num0, Num1]
            }
          ]
        }) */
        Vue.set(this.myChart2, 'labels', ['已生產', '未生產'])
        Vue.set(this.myChart2, 'backgroundColor', ['#00D8FF', '#DD1B16'])
        Vue.set(this.myChart2, 'data', [Num0, Num1])
        this.temp = [Num0, Num1]
        this.show = true
      })
    },
    /* rows3: function () {
      this.$nextTick(() => {
        var arrIndex = 0
        this.rows3.filter((val, idx) => {
          arrIndex = idx
          return val['_id'] === 'predMoldCnt'
        })
        this.$set(this.myChart2[0], 'datasets', {
          // label: 'three', // labelArray[0],
          backgroundColor: ['#00D8FF', '#DD1B16'],
          data: [this.rows3[arrIndex + 1].current, (this.rows3[arrIndex].current - this.rows3[arrIndex + 1].current)]
        })
      })
    } */
    groupArr () {
      // // console.log(this.groupArr)
      if (this.groupArr.length === 0) {
        return
      }
      this.groupArr.forEach(elm => {
        /* Object.defineProperty(this.groupObjArr, elm._id, {
          value: [],
          writable: true
        }) */
        this.groupObjArrLB.splice(this.groupObjArrLB.length, 0, elm._id)
        // this.groupObjArr[elm._id] = []
        this.$set(this.groupObjArr, elm._id, [])
        this.$set(this.visibleGroupObjArr, elm._id, [])
        // this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {statusName: '停機'})
        // createRowsObj(this.$set, this.groupObjArr[elm._id], this.columns, elm._id, this)
        // createRowsObj(this.$set, this.groupObjArr, elm._id, this, this.retArr) 採用新方法
        this.$set(this.subGroup, elm._id, {})
        this.$set(this.visibleSubGroup, elm._id, [])
        elm.son.forEach(elmSon => {
          this.$set(this.subGroup[elm._id], elmSon, [])
          var subRetArr = recursiveFindMachineArr(elmSon, this.retArr)
          if (subRetArr.length > 0) {
            if (elmSon === '1A') {
              renderTableObj(this.$set, this.subGroup[elm._id][elmSon], this.columns1, subRetArr)
            } else {
              renderTableObjSMB(this.$set, this.subGroup[elm._id][elmSon], this.columns1, subRetArr)
            }
          }
          // // console.log('subGroup')
          // // console.log(elmSon)
          // // console.log(this.subGroup)
        })
        // // console.log(elm._id)
        if (this.intervalID0[elm._id] !== undefined) {
          // clearInterval(this.intervalID0[elm._id])
          this.intervalID0[elm._id].cancel()
        }
        /* this.intervalID0[elm._id] = setInterval(() => {
          // createRowsObj(this.$set, this.groupObjArr[elm._id], this.columns, elm._id, this)
          // createRowsObj(this.$set, this.groupObjArr, elm._id, this, this.retArr) 採用新的方法
          elm.son.forEach(elmSon => {
            // this.$set(this.subGroup[elm._id], elmSon, [])
            var subRetArr = recursiveFindMachineArr(elmSon, this.retArr)
            // console.log('The times up')
            if (subRetArr.length > 0) {
              // console.log(elmSon)
              // console.log(moment().toNow())
              if (elmSon === '1A') {
                renderTableObj(this.$set, this.subGroup[elm._id][elmSon], this.columns1, subRetArr)
              } else {
                renderTableObjSMB(this.$set, this.subGroup[elm._id][elmSon], this.columns1, subRetArr)
              }
            }
            // // console.log('subGroup')
            // // console.log(elmSon)
            // // console.log(this.subGroup)
          })
        }, 120000) */
        this.intervalID0[elm._id] = schedule.scheduleJob(rule, () => {
          console.log(moment())
          elm.son.forEach(elmSon => {
            var subRetArr = recursiveFindMachineArr(elmSon, this.retArr)
            if (subRetArr.length > 0) {
              if (elmSon === '1A') {
                renderTableObj(this.$set, this.subGroup[elm._id][elmSon], this.columns1, subRetArr)
              } else {
                renderTableObjSMB(this.$set, this.subGroup[elm._id][elmSon], this.columns1, subRetArr)
              }
            }
          })
        })
        this.$set(this.groupObjCols, elm._id, [])
        this.groupObjCols[elm._id].splice(this.groupObjCols[elm._id].length, 0, {
          label: elm._id,
          field: 'statusName',
          name: 'statusName',
          required: true,
          style: 'fontSize:20px;color:purple;'
        })
        this.groupObjCols[elm._id].splice(this.groupObjCols[elm._id].length, 0, {
          label: '數量',
          field: 'total',
          name: 'total',
          required: true,
          style: 'fontSize:20px;color:purple;'
        })
        // console.log('在一次')
        // console.log('log')
        if (this.updateU !== undefined) {
          clearInterval(this.updateU)
          // console.log('clearInterval')
        }
        this.updateU = setInterval(() => {
          this.xyz()
        }, 1000)
      })
      // // console.log('555555')
      // // console.log(this.groupObjArr)
      this.$forceUpdate()
    }
  },
  sockets: {
    'showIncrease': function (val) {
      this.rows1.forEach(rowData => {
        if (rowData['machineID'] === '1A01') {
          rowData['totalAlm'] = val
        }
      })
    },
    'showIncreaseOther': function (val) {
      this.rows1.forEach(rowData => {
        if (rowData['machineID'] !== '1A01') {
          rowData['totalAlm'] = val
        }
      })
    },
    'showMachineSts': function (val) {
      var arrayIndex = 0
      // // console.log(this.rows1)
      if ((val != null) && (this.rows1 !== undefined)) {
        this.rows1.find(function (element, idx, arr) {
          // // console.log(arrayIndex)
          // // console.log(arr[arrayIndex])
          arrayIndex = idx
          if (element['machineID'] === val['machineID']) {
            arr[arrayIndex]._id = val['_id']
            arr[arrayIndex].machineStatus = val['machineStatusType']
            // // console.log(val.hasOwnProperty('totalAlm'))
            if (val.hasOwnProperty('totalAlm')) {
              arr[arrayIndex].totalAlm = val['totalAlm']
            } else {
              arr[arrayIndex].totalAlm = 0
            }
            if (val.hasOwnProperty('product')) {
              arr[arrayIndex].product = val['product']
            } else {
              arr[arrayIndex].product = ''
            }
            // // console.log(arrayIndex)
            // // console.log('this.myChart2')
          }
        })
        if (val['machineID'] === '1A01') {
          // // console.log(val)
        }
      }
    },
    'getUniqueID': function (val) {
      if (val !== '') {
        this.pageID = val
        this.$socket.emit('addClientMonitor', val)
      }
    },
    'updateAlarmCount': function (val) {
      // // console.log('columns0')
      // // console.log(this.retArr)
      // // console.log(val)
      var subOrgan = this.retArr.find(elm => {
        if (elm.level === 2) {
          if (elm.son.indexOf(val.machineID) > -1) {
            return elm
          }
        }
      })
      if (subOrgan !== undefined) {
        // // console.log('columns1')
        // // console.log(this.columns1)
        // // console.log(subOrgan)
        // // console.log(this.subGroup)
        // // console.log(Object.keys(this.subGroup))
        // // console.log(Object.keys(this.subGroup[subOrgan.father]))
        // // console.log('subOrgan')
        // // console.log(this.subGroup[subOrgan.father][subOrgan._id])
        var sum = 0
        this.subGroup[subOrgan.father][subOrgan._id].forEach(elm => {
          if (elm.machineID === val.machineID) {
            this.$set(elm, 'totalAlm', val.totalAlm)
            this.$set(elm, 'product', val.product)
          }
        })
        sum = this.subGroup[subOrgan.father][subOrgan._id].map(elm => {
          return elm.totalAlm
        }).reduce(function (prev, curr, idx, arr) {
          return prev + curr
        }, 0)
        this.groupObjArr[subOrgan.father].forEach(elm => {
          if (elm.statusName === '當日警報') {
            this.$set(elm, 'total', sum)
          }
        })
      }
    }
  },
  mounted () {
    getDepartArr(this.groupArr, this.retArr)
    Vue.set(this.prevBadRate, 'data', [0, 0])
    Vue.set(this.prevBadRate, 'labels', ['不良數量', '入庫數量'])
    Vue.set(this.prevBadRate, 'color', ['pink', 'green'])
  },
  methods: {
    xyz () {
      // console.log('有進入watch')
      var level3 = this.retArr.filter(elm => {
        return elm.level === 3
      })
      level3.forEach(elm => {
        var totalFA = 0
        var totalHA = 0
        var totalM = 0
        var totalS = 0
        var totalAlm = 0
        // console.log(this.subGroup[elm._id])
        elm.son.forEach(son => {
          // console.log('this.subGroup' + son)
          // // console.log(this.subGroup[elm._id]['1A'].length)
          // console.log(this.subGroup[elm._id][son])
          // console.log(this.subGroup[elm._id][son][0])
          this.subGroup[elm._id][son].forEach(m => {
            // console.log('mmmmmmmmm')
            // console.log(m)
            totalAlm += m.totalAlm
            switch (m.machineStatus) {
              case '全自動':
                totalHA++
                break
              case '半自動':
                totalFA++
                break
              case '手動':
                totalM++
                break
              case '關機':
                totalS++
                break
            }
          })
        })
        var totalMa = totalFA + totalHA + totalM + totalS
        // console.log(totalMa)
        // console.log(this.groupObjArr)
        this.groupObjArr[elm._id].splice(0, this.groupObjArr[elm._id].length)
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '成型機共',
          'total': totalMa,
          required: true
        })
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '自動生產',
          'total': totalFA + totalHA,
          required: true
        })
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '全自動',
          'total': totalFA,
          required: true
        })
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '半自動',
          'total': totalHA,
          required: true
        })
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '手動',
          'total': totalM,
          required: true
        })
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '停機',
          'total': totalS,
          required: true
        })
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '當日警報',
          'total': totalAlm,
          required: true
        })
        this.groupObjArr[elm._id].splice(this.groupObjArr[elm._id].length, 0, {
          'statusName': '訊號異常',
          'total': 0,
          required: true
        })
      })
    },
    x () {
      createRowsObj(this.$set, this.groupObjArr, '成型一課', this, this.retArr)
    },
    selectedWorkDay () {
      // // console.log(123123123)
      // // console.log(this.calendar)
      // // console.log(this.colorConditionArr)
      // // console.log(this.colorConditionArr[8])
      // // console.log(this.colorConditionArr[8][0])
      switch (this.colorConditionArr[8][0]) {
        case 'A':
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, this.calendar.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, this.calendar.length * this.hoursADay)
          break
        case 'B':
          // // console.log('B')
          var classB = this.calendar.filter(elm => {
            return (moment(elm.date, 'YYYY/M/DD').format('ddd') !== 'Sun')
          })
          // // console.log(classB)
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, classB.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, classB.length * this.hoursADay)
          break
        case 'C':
          var classC = this.calendar.filter(elm => {
            return elm['holidayCategory'] !== '星期六、星期日'
          })
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, classC.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, classC.length * this.hoursADay)
          break
        case 'D':
          var classD = this.calendar.filter(elm => {
            return elm['isHoliday'] !== true
          })
          this.totalWorkDays.splice(0, this.totalWorkDays.length)
          this.totalWorkDays.splice(0, 0, classD.length)
          this.totalWorkHours.splice(0, this.totalWorkHours.length)
          this.totalWorkHours.splice(this.totalWorkHours.length, 0, classD.length * this.hoursADay)
          break
      }
    },
    getValidCalendar (from, to) {
      $.get('/api/getValidCalendar/' + from + '/' + to, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else {
          this.calendar.splice(0, this.calendar.length)
          results.data.forEach(elm => {
            this.calendar.splice(this.calendar.length, 0, elm)
          })
        }
      })
    },
    selectedPrevWorkDay () {
      switch (this.colorConditionArr[8][0]) {
        case 'A':
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, this.calendarPrev.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, this.calendarPrev.length * this.hoursADay)
          break
        case 'B':
          var classB = this.calendarPrev.filter(elm => {
            return (moment(elm.date, 'YYYY/M/DD').format('ddd') !== 'Sun')
          })
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, classB.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, classB.length * this.hoursADay)
          break
        case 'C':
          var classC = this.calendarPrev.filter(elm => {
            return elm['holidayCategory'] !== '星期六、星期日'
          })
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, classC.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, classC.length * this.hoursADay)
          break
        case 'D':
          var classD = this.calendarPrev.filter(elm => {
            return elm['isHoliday'] !== true
          })
          this.totalPrevWorkDays.splice(0, this.totalPrevWorkDays.length)
          this.totalPrevWorkDays.splice(0, 0, classD.length)
          this.totalPrevWorkHours.splice(0, this.totalPrevWorkHours.length)
          this.totalPrevWorkHours.splice(this.totalPrevWorkHours.length, 0, classD.length * this.hoursADay)
          break
      }
    },
    getPrevValidCalendar (from, to) {
      $.get('/api/getValidCalendar/' + from + '/' + to, {}, (results) => {
        if (results.type !== true) {
          alert(`response is not correct, err: ${results.data}`)
        } else {
          this.calendarPrev.splice(0, this.calendarPrev.length)
          results.data.forEach(elm => {
            this.calendarPrev.splice(this.calendarPrev.length, 0, elm)
          })
        }
      })
    },
    test0 () {
      return getDepartArr(this.groupArr, this.retArr)
    },
    print () {
      window.print()
    },
    printAA () {

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
    showClose () {
      if (this.show) {
        this.show = false
        this.view = ''
      } else {
        this.show = true
        this.view = 'test'
      }
    },
    openModal (cellVal) {
      this.id = cellVal
      this.$nextTick(() => {
        updateModal(this.$set, this.rows3, this.columns3, this.id, this.flotcontainerAchieve, this.flotcontainerAchieveLabel, this.currBadRate)
        updateModalHWCfg(this.$set, this.rows2, this.rows4, this.columns2, this.id, this.utilization, this.totalWorkHours, this.totalPrevWorkHours)
        /* var t = this.rows3.filter((val, idx, arr) => { // 此區域會導致圖形閃動
          if (val['_id'] === 'predMoldCnt') {
            this.myChart2.datasets = [
              {
                backgroundColor: ['#00D8FF', '#DD1B16'],
                data: [arr[idx + 1]['current'], (arr[idx]['current'] - arr[idx + 1]['current'])]
              }
            ]
            // // // console.log(arr[idx])
            // var itbenormalobject = JSON.parse(JSON.stringify(val))
            // // // console.log(itbenormalobject)
            // // // console.log(JSON.stringify(val))
          }
          return val['_id'] === 'predMoldCnt'
        })
        // // console.log(t) */
        this.myChart2.labels = ['已生產模數', '未生產模數']
        this.$refs.basicModal.show()
      })
    },
    onOk () {
    },
    onCancel () {
    },
    onShow () {
    },
    onHide () {
    },
    handler (cellval) {
      // // console.log(cellval.data)
      /* this.$q.dialog({
        title: 'Options',
        message: 'Modern front-end framework on steroids.',
        options: {
          type: 'checkbox',
          model: [],
          items: [
            {label: 'Option 1', value: 'opt1', color: 'secondary'},
            {label: 'Option 2', value: 'opt2'},
            {label: 'Option 3', value: 'opt3'}
          ]
        },
        cancel: true,
        preventClose: true,
        color: 'secondary'
      }).then(data => {
        this.$q.notify(`You selected: `) // ${JSON.stringify(data)}
      }) */
    },
    showDialog (cellval) {
      Dialog.create({
        title: 'Some title',
        message: 'Some message',
        buttons: [
          'Cancel',
          {
            label: 'Empty Trash Bin',
            handler () {
            // "this" refers to the scope of this method only,
            // not your Vue component

            // prints: undefined
            // // // console.log(this.variable)
            }
          }
        ]
      })
    },
    sel () {
    }
  }
}

/* function renderTable (fun, rows, columns, department) {
  var from = '1A01'
  var to = '1A09'
  $.get('/api/getMachineSts/' + from + '/' + to, {}, (results) => {
  // $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
    } else {
      var records = results.data
      // var size = rows.length
      // // console.log(size)
      rows.length = 0
      // var index = 0
      // var col = columns[index++].field
      records.forEach(record => {
        rows.splice(0, 0, {
          _id: record['_id'],
          machineID: record['machineID'],
          machineStatus: record['STS'],
          totalAlm: record['totalAlm'],
          product: record['product']
        })
      })
      rows.sort(function (a, b) {
        return a.machineID > b.machineID ? 1 : -1
      })
    }
  })
} */
/* function createRows (fun, rows, columns, department) {
  // // console.log(department)
  $.get('/api/updateMonitorHWCfg/' + department, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
    } else {
      var record = results.data
      // rows.length = 0
      rows.splice(0, rows.length)
      rows.splice(rows.length, 0, {
        'statusName': '成型機共',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '自動生產',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '全自動',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '半自動',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '手動',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '停機',
        'total': record[rows.length]
      })
      rows.splice(rows.length, 0, {
        'statusName': '當日警報',
        'total': 0
      })
      rows.splice(rows.length, 0, {
        'statusName': '訊號異常',
        'total': 0
      })
    }
  })
} */
function updateModalHWCfg (fun, rows, rows4, columns, machineID, utilization, totalWorkHours, totalPrevWorkHours) {
  var from = moment().format('YYYY-MM-DD')
  var to = from
  rows.length = 0
  rows4.length = 0
  var labelObj = {
    'machineID': '機台編號',
    'brand': '廠牌型號',
    'dailyAlarm': '當日警報數',
    'monthlyAlarm': '當月警報數'
  }
  var labelObj4 = {
    'monthlyUtilization': '本月稼動率',
    'prevMonthlyUtilization': '上月稼動率'
  }
  var objKeys = Object.keys(labelObj)
  objKeys.forEach(elm => {
    rows.splice(rows.length, 0, {
      _id: elm,
      name: labelObj[elm],
      info: '',
      required: true
    })
  })
  var objKeys4 = Object.keys(labelObj4)
  objKeys4.forEach(elm => {
    rows4.splice(rows4.length, 0, {
      _id: elm,
      name: labelObj4[elm],
      info: '',
      required: true
    })
  })
  $.get('/api/updateModalHWCfg/' + machineID, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
    } else {
      var record = results.data
      rows.forEach(elm => {
        if (record.hasOwnProperty(elm._id)) {
          Vue.set(elm, 'info', record[elm._id])
        }
      })
    }
  })
  $.get('/api/updateModalAlmHWCfg/' + machineID + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
    } else {
      var record = results.data
      rows.forEach(elm => {
        if (record.hasOwnProperty(elm._id)) {
          Vue.set(elm, 'info', record[elm._id])
        }
      })
    }
  })
  $.get('/api/updateModalUtilizationHWCfg/' + machineID + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
    } else {
      var record = results.data
      console.log('record')
      console.log(record)
      Vue.set(utilization, 'labels', [])
      Vue.set(utilization, 'data', [])
      rows4.forEach(elm => {
        if (record.hasOwnProperty(elm._id)) {
          if (elm._id === 'monthlyUtilization') {
            // // console.log('totalWorkHours')
            // // console.log(totalWorkHours)
            // // console.log(totalWorkHours[0])
            Vue.set(elm, 'info', `${Math.round(Number(record[elm._id]) / (totalWorkHours[0] * 3600)) / 10}%`)
            utilization['data'].splice(utilization['data'].length, 0, Number(record[elm._id]))
            utilization['labels'].splice(utilization['labels'].length, 0, '稼動時間')
            utilization['data'].splice(utilization['data'].length, 0, totalWorkHours[0] * 3600 * 1000 - Number(record[elm._id]))
            utilization['labels'].splice(utilization['labels'].length, 0, '未稼動時間')
          } else if (elm._id === 'prevMonthlyUtilization') {
            Vue.set(elm, 'info', `${Math.round(Number(record[elm._id]) / (totalPrevWorkHours[0] * 3600)) / 10}%`)
            // utilization['data'].splice(utilization['data'].length, 0, Number(record[elm._id]))
            // utilization['labels'].splice(utilization['labels'].length, 0, elm.name)
          } else {
            Vue.set(elm, 'info', record[elm._id])
          }
        }
      })
    }
  })
}
function updateModal (fun, rows, columns, machineID, flotcontainerAchieve, flotcontainerAchieveLabel, currBadRate) {
  rows.length = 0
  // var achieveRateIndex = rows.length
  var labelObj = {
    'orderNumber': '派單號碼',
    'product': '成品料號',
    'prodName': '品名',
    'moldNum': '模具編號',
    'cavities': '穴數',
    'standard': '標準週期',
    'average': '平均週期',
    'min': '最短週期',
    'predMoldCnt': '派單模數',
    'moldCount': '已生產模',
    'achieveRate': '達成率',
    // 'predStart': '(預計)開',
    'deadline': '預計完成時間 關',
    'historyFailRate': '歷史不良'
  }
  var arr = Object.keys(labelObj)
  arr.forEach(function (elm) {
    rows.splice(rows.length, 0, {
      _id: elm,
      current: '',
      name: labelObj[elm],
      required: true
    })
    /* if (elm === 'moldCount') {
      achieveRateIndex = rows.length
    } */
  })
  /* rows.splice(rows.length, 0, {
    _id: 'orderNumber',
    current: '',
    name: '派單號碼'
  })
  rows.splice(rows.length, 0, {
    _id: 'product',
    current: '',
    name: '成品料號'
  })
  rows.splice(rows.length, 0, {
    _id: 'prodName',
    current: '',
    name: '品名'
  })
  rows.splice(rows.length, 0, {
    _id: 'moldNum',
    current: '',
    name: '模具編號'
  })
  rows.splice(rows.length, 0, {
    _id: 'cavities',
    current: '',
    name: '穴數'
  })
  rows.splice(rows.length, 0, {
    _id: 'standard',
    current: '',
    name: '標準週期'
  })
  rows.splice(rows.length, 0, {
    _id: 'average',
    current: '',
    name: '平均週期'
  })
  rows.splice(rows.length, 0, {
    _id: 'min',
    current: '',
    name: '最短週期'
  })
  rows.splice(rows.length, 0, {
    _id: 'predMoldCnt',
    current: 0,
    name: '派單模數'
  })
  rows.splice(rows.length, 0, {
    _id: 'moldCount',
    current: 0,
    name: '已生產模'
  })
  var achieveRateIndex = rows.length
  rows.splice(rows.length, 0, {
    _id: 'achieveRate',
    current: '',
    name: '達成率'
  })
  rows.splice(rows.length, 0, {
    _id: 'predStart',
    current: '',
    name: '(預計)開'
  })
  rows.splice(rows.length, 0, {
    _id: 'deadline',
    current: '',
    name: '預計完成時間 關'
  })
  rows.splice(rows.length, 0, {
    _id: 'historyFailRate',
    current: '',
    name: '歷史不良'
  }) */
  $.get('/api/getMachineCurrInfo/' + machineID, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
    } else {
      var record = results.data
      // console.log('getMachineCurrInfo')
      // console.log(record)
      /* for (let index = 0; index < rows.length; index++) {
        fun(rows[index], 'current', record[rows[index]._id])
      }
      var achieveRate = Math.floor(100 * rows[achieveRateIndex - 1].current / rows[achieveRateIndex - 2].current)
      fun(rows[achieveRateIndex], 'current', (achieveRate + '%'))
      // // console.log(achieveRate)
      flotcontainerAchieve.length = 0
      flotcontainerAchieveLabel.length = 0
      flotcontainerAchieveLabel = ['已生產', '未生產']
      flotcontainerAchieve.splice(0, 0, {
        data: Number(rows[achieveRateIndex - 1].current || 0)
      })
      flotcontainerAchieve.splice(1, 0, {
        data: Number(rows[achieveRateIndex - 2].current || 0)
      })
      // // console.log(flotcontainerAchieveLabel)
      // // console.log(flotcontainerAchieve) */
      // // console.log(achieveRateIndex)
      // // console.log('record')
      // // console.log(record)
      var first = record[0]
      var predMoldCnt = 0
      // console.log('warehousing')
      var warehousing = record.reduce(function (acc, elm) {
        // console.log(elm.warehousing)
        return acc + (elm.warehousing || 0)
      }, 0)
      var rowAchieveRate = null
      var moldCount = record.reduce(function (acc, elm) {
        return acc + (elm.moldCount || 0)
      }, 0)
      rows.forEach(elm => {
        if (first.hasOwnProperty(elm._id)) {
          if (elm._id === 'min') {
            Vue.set(elm, 'current', Math.round(first[elm._id] * 10) / 10)
          } else if (elm._id === 'predMoldCnt') {
            Vue.set(elm, 'current', first[elm._id])
            predMoldCnt = first[elm._id]
          } else if (elm._id === 'moldCount') {
            Vue.set(elm, 'current', moldCount)
            // moldCount = first[elm._id]
          } else if (elm._id === 'deadline') {
            Vue.set(elm, 'current', moment(parseInt(first[elm._id].split('/Date(')[1].split(')/')[0])).format('YYYY/M/DD'))
          } else {
            Vue.set(elm, 'current', first[elm._id])
          }
        } else if (elm._id === 'achieveRate') {
          rowAchieveRate = elm
        } else if (elm._id === 'historyFailRate') {
          if (warehousing === 0) {
            Vue.set(elm, 'current', 0)
            Vue.set(currBadRate, 'data', [0, 0])
            Vue.set(currBadRate, 'labels', ['不良數量', '入庫數量'])
          } else {
            Vue.set(elm, 'current', (first.badNum || 0) / warehousing)
            Vue.set(currBadRate, 'data', [first.badNum, warehousing])
            Vue.set(currBadRate, 'labels', ['不良數量', '入庫數量'])
          }
        }
      })
      flotcontainerAchieve.splice(0, 0, {
        data: Number(moldCount || 0)
      })
      flotcontainerAchieve.splice(1, 0, {
        data: Number(predMoldCnt || 0)
      })
      if (rowAchieveRate !== null) {
        if ((predMoldCnt || 0) === 0) {
          Vue.set(rowAchieveRate, 'current', `${0}%`)
        } else {
          Vue.set(rowAchieveRate, 'current', `${Math.round(moldCount / predMoldCnt * 1000) / 10}%`)
        }
      }
    }
  })
}
function getDepartArr (level3, retArr) {
  $.get('/api/getDepartObjAll/', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      results.data.sort(function (a, b) {
        return a.level > b.level ? -1 : a.level < b.level ? 1 : a._id > b._id ? 1 : -1
      })
      // var retArr = []
      results.data.forEach(elm => {
        retArr.splice(retArr.length, 0, elm)
      })
      results.data.forEach(elm => {
        if (elm.level === 3) {
          level3.splice(level3.length, 0, elm)
        }
      })
      return level3
    }
  })
}
function createRowsObj (fun, rows, department, refresh, organArr, subGroup) { // this.retArr
  // refresh.$nextTick(function () {
  // console.log(department)
  var machineIDs = recursiveFindMachineArr(department, organArr)
  // console.log(machineIDs.length)
  // console.log(machineIDs)
  if (machineIDs.length > 0) {
    createRowsObj1(fun, rows, department, machineIDs, refresh, organArr, subGroup)
  } else {
    zeroMachine(rows, department)
  }
  // })
}
function zeroMachine (rows, department) {
  rows[department].splice(0, rows[department].length)
  rows[department].splice(rows[department].length, 0, {
    'statusName': '成型機共',
    'total': 0,
    required: true
  })
  rows[department].splice(rows[department].length, 0, {
    'statusName': '自動生產',
    'total': 0,
    required: true
  })
  rows[department].splice(rows[department].length, 0, {
    'statusName': '全自動',
    'total': 0,
    required: true
  })
  rows[department].splice(rows[department].length, 0, {
    'statusName': '半自動',
    'total': 0,
    required: true
  })
  rows[department].splice(rows[department].length, 0, {
    'statusName': '手動',
    'total': 0,
    required: true
  })
  rows[department].splice(rows[department].length, 0, {
    'statusName': '停機',
    'total': 0,
    required: true
  })
  rows[department].splice(rows[department].length, 0, {
    'statusName': '當日警報',
    'total': 0,
    required: true
  })
  rows[department].splice(rows[department].length, 0, {
    'statusName': '訊號異常',
    'total': 0,
    required: true
  })
}
function createRowsObj1 (fun, rows, department, machineIDs, refresh, organArr, subGroup) {
  // // console.log(department)
  // // console.log('createRowsObj1')
  // // console.log(organArr)
  // var machineIDs = recursiveFindMachineArr(department, organArr)// ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
  $.get('/api/updateMonitorHWCfgV3/' + machineIDs, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
      zeroMachine(rows, department)
    } else {
      var docs1 = results.data
      // rows.length = 0
      var arrayRes = Array(6)
      arrayRes[0] = docs1.length
      var autoArray = docs1.filter((val) => {
        return val['STS'] === '全自動'
      })
      arrayRes[2] = autoArray.length
      autoArray = docs1.filter((val) => {
        return val['STS'] === '半自動'
      })
      arrayRes[3] = autoArray.length
      autoArray = docs1.filter((val) => {
        return val['STS'] === '手動'
      })
      arrayRes[4] = autoArray.length
      autoArray = docs1.filter((val) => {
        return val['STS'] === '關機'
      })
      arrayRes[5] = autoArray.length
      arrayRes[1] = arrayRes[2] + arrayRes[3]
      rows[department].splice(0, rows[department].length)
      rows[department].splice(rows[department].length, 0, {
        'statusName': '成型機共',
        'total': arrayRes[rows[department].length],
        required: true
      })
      rows[department].splice(rows[department].length, 0, {
        'statusName': '自動生產',
        'total': arrayRes[rows[department].length],
        required: true
      })
      rows[department].splice(rows[department].length, 0, {
        'statusName': '全自動',
        'total': arrayRes[rows[department].length],
        required: true
      })
      rows[department].splice(rows[department].length, 0, {
        'statusName': '半自動',
        'total': arrayRes[rows[department].length],
        required: true
      })
      rows[department].splice(rows[department].length, 0, {
        'statusName': '手動',
        'total': arrayRes[rows[department].length],
        required: true
      })
      rows[department].splice(rows[department].length, 0, {
        'statusName': '停機',
        'total': arrayRes[rows[department].length],
        required: true
      })
      rows[department].splice(rows[department].length, 0, {
        'statusName': '當日警報',
        'total': 0,
        required: true
      })
      rows[department].splice(rows[department].length, 0, {
        'statusName': '訊號異常',
        'total': 0,
        required: true
      })
      /* rows.splice(rows.length, 0, {
        'statusName': '系統啟動',
        'total': 0
      }) */
      /* var subArr = organArr.find(elm => {
        return elm._id === department
      })
      subArr.son.forEach(elm => {
        subGroup[department][elm].forEach(function (element, idx, arr) {
          var val = docs1.find(elmDoc1 => {
            return elmDoc1.machineID === element.machineID
          })
          if (element['machineID'] === val['machineID']) {
            Vue.$set(element, '_id', val['_id'])
            Vue.$set(element, 'machineStatus', val['machineStatusType'])
            // // console.log(val.hasOwnProperty('totalAlm'))
            if (val.hasOwnProperty('totalAlm')) {
              Vue.$set(element, 'totalAlm', val['totalAlm'])
            } else {
              Vue.$set(element, 'totalAlm', 0)
            }
            if (val.hasOwnProperty('product')) {
              Vue.$set(element, 'product', val['product'])
            } else {
              Vue.$set(element, 'product', '')
            }
          }
        })
      }) */
      // refresh.$forceUpdate()
    }
  })
}
function renderTableObj (fun, rows, columns, machineIDs) {
  var from = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  var to = moment().add(0, 'days').format('YYYY-MM-DD HH:mm:ss')
  /* if (rows.length === 0) {
    machineIDs.forEach(machineID => {
      rows.splice(0, 0, {
        _id: '',
        machineID: machineID,
        machineStatus: '關機',
        totalAlm: 0,
        product: ''
      })
    })
    rows.sort(function (a, b) {
      return a.machineID > b.machineID ? 1 : -1
    })
  } */
  $.get('/api/getMachineStsV2/' + machineIDs + '/' + from + '/' + to, {}, (results) => {
  // $.get('/api/getMachineRecords/' + machineID + '/' + reportDate, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('Empty~')
    } else {
      var records = results.data
      // var size = rows.length
      // rows.length = 0
      // rows.splice(0, rows.length)
      // var index = 0
      // var col = columns[index++].field
      var machineIDArr = Object.keys(records)
      if (rows.length !== 0) {
        machineIDArr.forEach(record => {
          var row = rows.filter(elm => {
            return elm.machineID === record.machineID
          })
          if (row.length === 1) {
            fun(row[0], 'last', records[record]['last'])
            fun(row[0], 'machineID', records[record]['machineID'])
            fun(row[0], 'STS', records[record]['STS'])
            fun(row[0], 'totalAlm', records[record]['totalAlm'])
            fun(row[0], 'product', records[record]['product'])
          } else {
            console.log('row.length > 1')
            console.log(row)
          }
        })
      } else {
        rows.splice(0, rows.length)
        machineIDArr.forEach(record => {
          rows.splice(0, 0, {
            _id: records[record]['last'],
            machineID: records[record]['machineID'],
            machineStatus: records[record]['STS'],
            totalAlm: records[record]['totalAlm'],
            product: records[record]['product']
          })
        })
        rows.sort(function (a, b) {
          return a.machineID > b.machineID ? 1 : -1
        })
      }
    }
  })
}
function renderTableObjSMB (fun, rows, columns, machineIDs) {
  var from = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  var to = moment().add(0, 'days').format('YYYY-MM-DD HH:mm:ss')
  $.get('/api/getMachineStsSMBV2/' + machineIDs + '/' + from + '/' + to, {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // console.log('no data')
    } else {
      var records = results.data
      // console.log('getMachineStsSMBV2')
      // console.log(records)
      var machineIDArr = Object.keys(records)
      if (rows.length !== 0) {
        machineIDArr.forEach(record => {
          var row = rows.filter(elm => {
            return elm.machineID === record.machineID
          })
          if (row.length === 1) {
            fun(row[0], 'last', records[record]['last'])
            fun(row[0], 'machineID', records[record]['machineID'])
            fun(row[0], 'STS', records[record]['STS'])
            fun(row[0], 'totalAlm', records[record]['totalAlm'])
            fun(row[0], 'product', records[record]['product'])
          } else {
            console.log('row.length > 1')
            console.log(row)
          }
        })
      } else {
        rows.splice(0, rows.length)
        machineIDArr.forEach(record => {
          rows.splice(0, 0, {
            _id: records[record]['last'],
            machineID: records[record]['machineID'],
            machineStatus: records[record]['STS'],
            totalAlm: records[record]['totalAlm'],
            product: records[record]['product']
          })
        })
        rows.sort(function (a, b) {
          return a.machineID > b.machineID ? 1 : -1
        })
      }
    }
  })
}
function recursiveFindMachineArr (label, organArr) {
  var tgt = organArr.find(elm => {
    if (elm._id === label) {
      return elm
    }
  })
  if (tgt === null || tgt === undefined) {
    return [] // [label]
  } else if (tgt.level < 1) {
    return []
  } else if (tgt.level === 1) {
    return [label]
  } else {
    var retArr = []
    tgt.son.forEach(elm => {
      var subRetArr = recursiveFindMachineArr(elm, organArr)
      if (subRetArr.length > 0) {
        retArr = retArr.concat(subRetArr)
      }
    })
    return retArr
  }
}
function getPageSetting (colorArr, colorConditionArr, blink) {
  $.get('/api/getPageSetting', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      // alert('沒有機台資料')
      // // console.log('沒有機台資料')
      // // // console.log(results.data)
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
  // .icon-svg30:before{
  //   content : url("../assets/icon/cbor2-mih9q.svg");
  //   }
  .icon-svg31:before{
    content : url("../assets/icon/cbunv-29e8f.svg");
    }
  .icon-svg32:before{
    content : url("../assets/icon/cbv0c-yrs86.svg");
    }
  .icon-svg33:before{
    content : url("../assets/icon/cbggp-n12pn.svg");
    }
  .icon-svg34:before{
    content : url("../assets/icon/cbunh-4jyjp.svg");
    }
  .icon-svg53:before{
    content : url("../assets/small32/Chart.png");
  }
  .icon-svg54:before{
    content : url("../assets/small32/Color-dial.png");
  }
  .icon-svg58:before{
    content : url("../assets/small32/printer.png");
  }
  .icon-halfAuto:before{
    content : url("../assets/small32/cbor2-mih9q.png");
  }
  .icon-auto:before{
    content : url("../assets/small32/cbv0c-yrs86.png");
  }
  .icon-manual:before{
    content : url("../assets/small32/cbunv-29e8f.png");
    font-size: 1px
  }
</style>
