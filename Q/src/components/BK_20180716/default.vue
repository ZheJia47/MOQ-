<template>
  <q-layout ref="layout" view="hHh LpR lfr" class="bg-grey-4" :left-class="leftClass" :left-style="leftStyle">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        >
          <!--<q-icon name="menu" />-->
        </q-btn>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen1 = !leftDrawerOpen1"
          aria-label="Menu"
          icon="menu"
        >
          <!--<q-icon name="menu" />-->
        </q-btn>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen2 = !leftDrawerOpen2"
          aria-label="Menu"
          icon="menu"
        >
        </q-btn>
        <q-toolbar-title>
          龍達塑膠成型機生產管理系統
          <span slot="subtitle">Version 4.1</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer
      v-model="leftDrawerOpen2"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        link
        inset-delimiter
        separator
        no-border
        highlight
        v-if="typeClick==='monitor'"
      >
        <q-item>
          <q-btn
          flat
          aria-label="Menu"
          label="全廠"
          icon="remove_red_eye"
          :text-color="subTypeClick==='全廠'?'red':'green'"
          color="green"
          @click="subTypeClick='全廠'"
        />
        </q-item>
        <q-item>
          <q-btn
          flat
          aria-label="Menu"
          label="成型一課"
          icon="remove_red_eye"
          :text-color="subTypeClick==='成型一課'?'red':'green'"
          color="green"
          @click="subTypeClick='成型一課'"
        />
        </q-item>
        <q-item>
          <q-btn
          flat
          aria-label="Menu"
          label="成型二課"
          icon="remove_red_eye"
          :text-color="subTypeClick==='成型二課'?'red':'green'"
          @click="subTypeClick='成型二課'"
        />
        </q-item>
        <q-item>
          <q-btn
          flat
          aria-label="Menu"
          label="成型三課"
          icon="remove_red_eye"
          color="green"
          :text-color="subTypeClick==='成型三課'?'red':'green'"
          @click="subTypeClick='成型三課'"
        />
        </q-item>
      </q-list>
      <q-list
        link
        inset-delimiter
        separator
        no-border
        highlight
        v-else-if="typeClick==='Report'"
      >
        <q-item v-for="(report, key) in reportArr" v-bind:key="key" v-if="report !== 'Utilization'">
          <q-btn
          flat
          aria-label="Menu"
          :label="key"
          icon="remove_red_eye"
          color="green"
          :text-color="subTypeClick===key?'red':'green'"
          @click="openModal1(), subTypeClick=key, selectedReport=report"
        />
        </q-item>
      </q-list>
      <q-list
        link
        inset-delimiter
        separator
        no-border
        highlight
        v-else-if="typeClick==='Abnormal'"
      >
        <q-item v-for="(report, key) in abnormalArr" v-bind:key="key">
          <q-btn
          flat
          aria-label="Menu"
          :label="key"
          icon="remove_red_eye"
          color="green"
          :text-color="subTypeClick===key?'red':'green'"
          @click="openModal1(), subTypeClick=key"
        />
        </q-item>
      </q-list>
      <q-list
        link
        inset-delimiter
        separator
        no-border
        highlight
        v-else-if="typeClick==='sysConfig'"
      >
        <q-item v-for="(report, key) in sysConfigArr" v-bind:key="key">
          <q-btn
          flat
          aria-label="Menu"
          :label="key"
          icon="remove_red_eye"
          color="green"
          :text-color="subTypeClick===key?'red':'green'"
          @click="openModal1(), subTypeClick=key"
        />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-layout-drawer
      v-model="leftDrawerOpen1"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        link
        inset-delimiter
        separator
        no-border
        highlight
      >
      <q-item>
      <q-btn
          flat
          aria-label="Menu"
          @click="$router.push('/monitor'), typeClick='monitor'"
          label="機台監控"
          icon="remove_red_eye"
          color="green"
        >
          <!--<q-icon name="remove_red_eye" color="green"/>
          機台監控-->
        </q-btn>
      </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          @click="$router.push('/RegisterProps'), typeClick='RegisterProps'"
          label="資料登錄"
          icon="remove_red_eye"
          color="green"
        >
        <!--<q-icon name="remove_red_eye"  color="green"/>
          資料登錄-->
        </q-btn>
        </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          @click="openModal(), typeClick='Report'"
          :label="types[0].label"
          icon="remove_red_eye"
          color="green"
        >
        <!--<q-icon name="remove_red_eye"  color="green"/>
          {{dialog.label}}-->
        </q-btn>
      </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          label="稼動報表"
          icon="remove_red_eye"
          color="green"
          @click="openModal1(), typeClick='Utilization', report='Utilization', selectedReport='Utilization'"
        >
      </q-btn>
      </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          :label="types[2].label"
          icon="remove_red_eye"
          color="green"
          @click="openModalAlm(), typeClick='Abnormal'"
        >
        </q-btn>
       </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          label="參數設定"
          icon="remove_red_eye"
          color="green"
          @click="typeClick='sysConfig'"
        >
        </q-btn>
        </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          label="工作排程"
          icon="remove_red_eye"
          color="green"
          @click="typeClick='ShiftTable'"
        >
        </q-btn>
        </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          label="使用說明"
          icon="remove_red_eye"
          color="green"
          @click="typeClick='ProductionStatisticsTable'"
        >
        </q-btn>
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-layout-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
    >
      <q-list
        link
        inset-delimiter
        separator
        no-border
        highlight
      >
        <q-item item to="/monitor">
          <q-item-side icon="remove_red_eye" color="green"/>
          <q-item-main label="機台監控" />
        </q-item>
        <q-item item to="/RegisterProps">
          <q-item-side icon="remove_red_eye"  color="green"/>
          <q-item-main label="資料登錄" />
        </q-item>
        <q-item v-if="selectItem!=='生產報表'"
          link
          @click.native="openModal()"
          v-ripple.mat
        >
          <q-item-side :icon="types[0].icon" />
          <q-item-main :label="types[0].label" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
        <!--<q-collapsible label="生產報表">
          <q-item @open="showing = true">
            <q-collapsible label="日">
              <q-item to="/DailyReport" class="bg-blue">
                <font color="white">
                <q-item-side class="fa fa-table" />
                <q-item-main label="明細" />
                </font>
              </q-item>
              <q-item to="/IntegratedDailyReport" class="bg-blue">
                <font color="white">
                <q-item-side class="fa fa-table" />
                <q-item-main label="整合" />
                </font>
              </q-item>
            </q-collapsible>
          </q-item>
          <q-item v-for="(value, key) in productionReport" v-bind:key="key" :to="{ name: 'PeriodReport', params: {period: key} }">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>
        </q-collapsible>-->
        <q-collapsible v-if="selectItem==='生產報表'" label="生產報表">
          <q-item @open="showing = true">
            <q-item-side class="fa fa-table" />
            <q-collapsible label="日">
              <q-item to="/DailyReport" class="bg-blue">
                <font color="white">
                <q-item-side class="fa fa-table" />
                <q-item-main label="明細" />
                </font>
              </q-item>
              <q-item to="/IntegratedDailyReport" class="bg-blue">
                <font color="white">
                <q-item-side class="fa fa-table" />
                <q-item-main label="整合" />
                </font>
              </q-item>
            </q-collapsible>
          </q-item>
          <div v-for="(value, key) in productionReport" v-bind:key="key">
            <q-item :to="{name: 'PeriodReport', params: {period: key}}">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>
          </div>
        </q-collapsible>
        <q-collapsible v-if="selectItem==='生產報表'" label="成品料號-生產報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
            <!--<q-item :to="{name: 'ProductPeriodReport', params: {period: key}}">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>-->
          </div>
        </q-collapsible>
        <q-collapsible v-if="selectItem==='生產報表'" label="模具編號-生產報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
            <!--<q-item :to="{name: 'MoldPeriodReport', params: {period: key}}">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>-->
          </div>
        </q-collapsible>
        <q-collapsible label="稼動報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
            <!--<q-item :to="{name: 'Utilization', params: {period: key}}">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>-->
          </div>
        </q-collapsible>
        <q-collapsible label="異常報表">
        </q-collapsible>
        <q-item item to="/ShiftTable1">
          <q-item-side class="fa fa-pencil" />
          <q-item-main label="工作排程" />
        </q-item>
        <q-collapsible label="參數設定">
          <div v-for="(value, key) in sysConfig" v-bind:key="key">
            <q-item :to="{name: 'sysConfig', params: {period: key}}" >
              <q-item-side class="fa fa-table" />
              <q-item-main :label="value" />
            </q-item>
          </div>
        </q-collapsible>
        <q-collapsible label="使用說明">
          <q-item :to="{name: 'ProductionStatisticsTable'}" >
            <q-item-side class="fa fa-table" />
            <q-item-main label="ProductionStatisticsTable" />
          </q-item>
        </q-collapsible>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-modal :ref="types[0].ref" :content-css="{padding: '300px', maxWidth: '100%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
    <q-list highlight>
      <!--<q-list-header>請選擇報表類別</q-list-header>-->
      <q-collapsible label="請選擇報表類別">
      <q-item v-for="(report, key) in reportArr" v-bind:key="key" v-if="report !== 'Utilization'">
        <q-radio   v-model="selectedReport" :val="report" :label="key" @focus="showSel()"/>
        <!--<q-checkbox v-if="report==='Report'" v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
        <q-checkbox v-if="report==='Report'" v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>-->
      </q-item>
      </q-collapsible>
    </q-list>
    <!--<p class="caption">成型單位選擇</p>-->
    <q-list highlight>
      <!--<q-list-header>成型單位選擇</q-list-header>-->
    <q-collapsible label="成型單位選擇">
    <q-item>
      <q-item-main>
      <q-radio v-model="radio1" val="全廠" label="全廠" color="primary" style="margin-left: 10px"/>
    </q-item-main >
    </q-item>
    <q-item v-for="(depratArr, key) in depratObj" v-bind:key="key">
      <q-item-main>
        <q-radio  v-model="radio1" :val="key" :label="key" @blur="blurDepart1()" color="secondary" style="margin-left: 10px" />
         &nbsp;&nbsp;
        <q-checkbox v-if="radio1===key" v-for="deprat in depratArr" v-bind:key="deprat" v-model="checked" :val="deprat" :label="deprat" >
          &nbsp;&nbsp;
        </q-checkbox>
        <q-checkbox v-if="radio1!==key" v-for="deprat in depratArr" v-bind:key="deprat" v-model="checked" :val="deprat" :label="deprat" disable>
        &nbsp;&nbsp;
        </q-checkbox>
      </q-item-main >
    </q-item>
    </q-collapsible>
    </q-list>
    <q-list highlight>
    <!--<q-list-header>請選擇報表時間</q-list-header>
        <p class="caption">請選擇報表時間</p>-->
        <q-collapsible :label="str">
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="daily" label="日" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDate" />
      <q-checkbox v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
      <q-checkbox v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>
      </q-item-main>
    </q-item>
    <q-item>
      <q-item-main>
        <q-radio  v-model="reportProps" val="weekly" label="週" />
        &nbsp;&nbsp;
      <!--<input type="date" v-model="selectedWeek" />-->
      <select v-model="selectedYearWeekly">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;&nbsp;第
      <select v-model="selectedWeek">
      <option v-for="week in weeksInYear" v-bind:key="week" :value="week"> {{week}}</option>
      </select>
      週&nbsp;&nbsp;
        {{dateFrom}} ~ {{dateTo}}
      </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="tenDays" label="旬" />
        &nbsp;&nbsp;
        <input type="month" name="yearMonthTenDays" v-model="yearMonthTenDays" />
        <!--<div class="col-lg-6 col-sm-12">-->
          <select id="tenDays" name="tenDays" v-model="selectedTenDays">
            <option value="early">上旬</option>
            <option value="middle">中旬</option>
            <option value="late">下旬</option>
          </select>
          {{dateFromTenDays}} ~ {{dateToTenDays}}
        <!--</div>-->
      </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="monthly" label="月" />
      &nbsp;&nbsp;
       <input type="month" name="yearMonth" v-model="yearMonth" />
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="quarterly" label="季" />
      &nbsp;&nbsp;
      <select v-model="selectedYearQuarter">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;&nbsp;第
      <select v-model="selectedQuarter">
        <option v-for="quarter in 4" v-bind:key="quarter" :value="quarter"> {{quarter}}</option>
      </select>
      季
      {{dateFromQuarter}} ~ {{dateToQuarter}}
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="yearly" label="年" />
      &nbsp;&nbsp;
      <select v-model="selectedYear">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;-&nbsp;
      <select v-model="selectedYearTo">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="period" label="期間" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDatePeriod" />
      &nbsp; - &nbsp;
      <input type="date" v-model="selectedDatePeriodTo" />
    </q-item-main >
    </q-item>
        </q-collapsible>
    </q-list>
    {{radioSel}}
    <q-btn color="primary" @click="Enter()" label="確定" />
    <q-btn color="primary" @click="closeModal()" label="關閉" />
    </q-modal-layout>
  </q-modal>

  <q-modal :ref="types[1].ref" :content-css="{padding: '300px', maxWidth: '100%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
  <q-list highlight>
    <q-item>{{selectedReportKey}}</q-item>
  </q-list>
    <q-list highlight>
      <q-collapsible label="成型單位選擇">
      <!--<q-list-header>成型單位選擇</q-list-header>-->
    <q-item>
      <q-item-main>
      <q-radio v-model="radio1" val="全廠" label="全廠" color="primary" style="margin-left: 10px"/>
    </q-item-main >
    </q-item>
    <q-item v-for="(depratArr, key) in depratObj" v-bind:key="key">
      <q-item-main>
        <q-radio  v-model="radio1" :val="key" :label="key" @blur="blurDepart1()" color="secondary" style="margin-left: 10px" />
         &nbsp;&nbsp;
        <q-checkbox v-if="radio1===key" v-for="deprat in depratArr" v-bind:key="deprat" v-model="checked" :val="deprat" :label="deprat" >
          &nbsp;&nbsp;
        </q-checkbox>
        <q-checkbox v-if="radio1!==key" v-for="deprat in depratArr" v-bind:key="deprat" v-model="checked" :val="deprat" :label="deprat" disable>
        &nbsp;&nbsp;
        </q-checkbox>
      </q-item-main >
    </q-item>
      </q-collapsible>
    </q-list>
    <q-list highlight>
    <!--<q-list-header>請選擇報表時間</q-list-header>
        <p class="caption">請選擇報表時間</p>-->
        <q-collapsible :label="str">
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="daily" label="日" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDate" />
      <q-checkbox v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
      <q-checkbox v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>
      </q-item-main>
    </q-item>
    <q-item>
      <q-item-main>
        <q-radio  v-model="reportProps" val="weekly" label="週" />
        &nbsp;&nbsp;
      <!--<input type="date" v-model="selectedWeek" />-->
      <select v-model="selectedYearWeekly">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;&nbsp;第
      <select v-model="selectedWeek">
      <option v-for="week in weeksInYear" v-bind:key="week" :value="week"> {{week}}</option>
      </select>
      週&nbsp;&nbsp;
        {{dateFrom}} ~ {{dateTo}}
      </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="tenDays" label="旬" />
        &nbsp;&nbsp;
        <input type="month" name="yearMonthTenDays" v-model="yearMonthTenDays" />
        <!--<div class="col-lg-6 col-sm-12">-->
          <select id="tenDays" name="tenDays" v-model="selectedTenDays">
            <option value="early">上旬</option>
            <option value="middle">中旬</option>
            <option value="late">下旬</option>
          </select>
          {{dateFromTenDays}} ~ {{dateToTenDays}}
        <!--</div>-->
      </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="monthly" label="月" />
      &nbsp;&nbsp;
       <input type="month" name="yearMonth" v-model="yearMonth" />
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="quarterly" label="季" />
      &nbsp;&nbsp;
      <select v-model="selectedYearQuarter">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;&nbsp;第
      <select v-model="selectedQuarter">
        <option v-for="quarter in 4" v-bind:key="quarter" :value="quarter"> {{quarter}}</option>
      </select>
      季
      {{dateFromQuarter}} ~ {{dateToQuarter}}
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="yearly" label="年" />
      &nbsp;&nbsp;
      <select v-model="selectedYear">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;-&nbsp;
      <select v-model="selectedYearTo">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="period" label="期間" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDatePeriod" />
      &nbsp; - &nbsp;
      <input type="date" v-model="selectedDatePeriodTo" />
    </q-item-main >
    </q-item>
        </q-collapsible>
    </q-list>
    {{radioSel}}
    <q-btn color="primary" @click="Enter1()" label="確定" />
    <q-btn color="primary" @click="closeModal1()" label="關閉" />
    </q-modal-layout>
  </q-modal>
  <q-modal :ref="types[2].ref" :content-css="{padding: '300px', maxWidth: '100%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
    <q-list highlight>
      <!--<q-list-header>請選擇報表類別</q-list-header>-->
      <q-collapsible label="請選擇報表類別">
      <q-item v-for="(report, key) in abnormalArr" v-bind:key="key">
        <q-radio   v-model="selectedAlmReport" :val="report" :label="key" @focus="showSel1()"/>
        <!--<q-checkbox v-if="report==='Report'" v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
        <q-checkbox v-if="report==='Report'" v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>-->
      </q-item>
      </q-collapsible>
    </q-list>
    <!--<p class="caption">成型單位選擇</p>-->
    <q-list highlight>
      <!--<q-list-header>成型單位選擇</q-list-header>-->
    <q-collapsible label="成型單位選擇">
    <q-item>
      <q-item-main>
      <q-radio v-model="radio1" val="全廠" label="全廠" color="primary" style="margin-left: 10px"/>
    </q-item-main >
    </q-item>
    <q-item v-for="(depratArr, key) in depratObj" v-bind:key="key">
      <q-item-main>
        <q-radio  v-model="radio1" :val="key" :label="key" @blur="blurDepart1()" color="secondary" style="margin-left: 10px" />
         &nbsp;&nbsp;
        <q-checkbox v-if="radio1===key" v-for="deprat in depratArr" v-bind:key="deprat" v-model="checked" :val="deprat" :label="deprat" >
          &nbsp;&nbsp;
        </q-checkbox>
        <q-checkbox v-if="radio1!==key" v-for="deprat in depratArr" v-bind:key="deprat" v-model="checked" :val="deprat" :label="deprat" disable>
        &nbsp;&nbsp;
        </q-checkbox>
      </q-item-main >
    </q-item>
    </q-collapsible>
    </q-list>
    <q-list highlight>
    <!--<q-list-header>請選擇報表時間</q-list-header>
        <p class="caption">請選擇報表時間</p>-->
        <q-collapsible :label="str">
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="daily" label="日" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDate" />
      <q-checkbox v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
      <q-checkbox v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>
      </q-item-main>
    </q-item>
    <q-item>
      <q-item-main>
        <q-radio  v-model="reportProps" val="weekly" label="週" />
        &nbsp;&nbsp;
      <!--<input type="date" v-model="selectedWeek" />-->
      <select v-model="selectedYearWeekly">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;&nbsp;第
      <select v-model="selectedWeek">
      <option v-for="week in weeksInYear" v-bind:key="week" :value="week"> {{week}}</option>
      </select>
      週&nbsp;&nbsp;
        {{dateFrom}} ~ {{dateTo}}
      </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="tenDays" label="旬" />
        &nbsp;&nbsp;
        <input type="month" name="yearMonthTenDays" v-model="yearMonthTenDays" />
        <!--<div class="col-lg-6 col-sm-12">-->
          <select id="tenDays" name="tenDays" v-model="selectedTenDays">
            <option value="early">上旬</option>
            <option value="middle">中旬</option>
            <option value="late">下旬</option>
          </select>
          {{dateFromTenDays}} ~ {{dateToTenDays}}
        <!--</div>-->
      </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="monthly" label="月" />
      &nbsp;&nbsp;
       <input type="month" name="yearMonth" v-model="yearMonth" />
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="quarterly" label="季" />
      &nbsp;&nbsp;
      <select v-model="selectedYearQuarter">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;&nbsp;第
      <select v-model="selectedQuarter">
        <option v-for="quarter in 4" v-bind:key="quarter" :value="quarter"> {{quarter}}</option>
      </select>
      季
      {{dateFromQuarter}} ~ {{dateToQuarter}}
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="yearly" label="年" />
      &nbsp;&nbsp;
      <select v-model="selectedYear">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年&nbsp;-&nbsp;
      <select v-model="selectedYearTo">
        <option v-for="year in range(2017, 2020)" v-bind:key="year" :value="year"> {{year}}</option>
      </select>
      年
    </q-item-main >
    </q-item>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="period" label="期間" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDatePeriod" />
      &nbsp; - &nbsp;
      <input type="date" v-model="selectedDatePeriodTo" />
    </q-item-main >
    </q-item>
        </q-collapsible>
    </q-list>
    {{radioSel}}
    <q-btn color="primary" @click="EnterAlm()" label="確定" />
    <q-btn color="primary" @click="closeModalAlm()" label="關閉" />
    </q-modal-layout>
  </q-modal>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import moment from 'moment'
var _ = require('underscore')._

export default {
  name: 'LayoutDefault',
  data () {
    return {
      typeClick: '',
      subTypeClick: '',
      str: '請選擇報表時間    ',
      selectItem: '',
      IntegratedDailyReport: true,
      DailyReport: false,
      leftDrawerOpen: this.$q.platform.is.desktop,
      leftDrawerOpen1: this.$q.platform.is.desktop,
      leftDrawerOpen2: this.$q.platform.is.desktop,
      selectedDatePeriod: moment().format('YYYY-MM-DD'),
      selectedDatePeriodTo: '',
      selectedYear: moment().year(),
      selectedYearTo: '',
      dateFromQuarter: '',
      dateToQuarter: '',
      dateFromTenDays: '',
      dateToTenDays: '',
      yearMonthTenDays: moment().format('YYYY-MM'),
      ppp: 'Lolita',
      week: 'weekly',
      checked: [],
      radioSel: '',
      radio1: '全廠',
      depratObj: {'成型一課': ['全課', '1A', '1B', '1C'], '成型二課': ['全課', '2A', '2B', '2C']},
      reportProps: 'daily',
      selectedDate: moment().format('YYYY-MM-DD'),
      selectedWeek: moment().week() - 1,
      selectedYearWeekly: moment().year(),
      selectedYearQuarter: moment().year(),
      selectedTenDays: '',
      yearMonth: moment().format('YYYY-MM'), // yearmonth,
      selectedQuarter: undefined, // moment().quarter() - 1,
      selectedDateFrom: moment().format('YYYY-MM-DD'),
      selectedDateTo: moment().format('YYYY-MM-DD'),
      selectedReportKey: 'A.生產報表',
      selectedAlmReport: 'Abnormal',
      selectedReport: 'Report',
      reportArr: {
        'A.生產報表': 'Report',
        'B1.平均不良率': 'ProductionStatisticsTable',
        'B2.平均不良率': 'Curve',
        'C.成品料號生產統計表': 'ProductReport',
        'D.模具編號生產統計表': 'MoldReport',
        'E.成品料號製程分析': 'ProductProcessAnalysis',
        'F.模具編號製程分析': 'MoldNumProcessAnalysis',
        'G.生產未達MOQ統計表': 'MOQ',
        'H.稼動率報表': 'Utilization'
      },
      abnormalArr: {
        '異常時數分類統計表': 'AbnormalTable',
        '異常時數統計圓形圖': 'AbnormalPie',
        '異常明細表': 'Abnormal'
      },
      sysConfigArr: {
        '系統共用參數設定': 'sysCommonSetting',
        '生產單位編制設定': 'prodDepartSetting',
        '班別時間表設定': 'shiftTimeConfig',
        '備註選填代號設定': 'noteConfigSetting',
        '實際預計完成時間格式': 'timeFormatSetting',
        '權限設定': 'permissionSetting',
        '資料備份': 'backup'
      },
      checkDis: false,
      position: 'right',
      leftClass: {
        'bg-dark': true,
        'text-white': true
      },
      leftStyle: {
        'width': '10em'
      },
      sideBarShow: {
        report: false
      },
      showing: false,
      types: [
        {
          icon: 'remove_red_eye',
          label: '生產報表',
          // label: 'basicModal',
          ref: 'basicModal'
        },
        {
          icon: 'remove_red_eye',
          label: '生產報表',
          // label: 'basicModal',
          ref: 'basicModal1'
        },
        {
          icon: 'remove_red_eye',
          label: '異常報表',
          ref: 'basicModalAlm'
        },
        {
          icon: 'remove_red_eye',
          label: '異常報表',
          ref: 'basicModalAlm1'
        }
      ],
      productionReport: {
        'weekly': '週',
        'tenDays': '旬',
        'monthly': '月',
        'quarterly': '季',
        'yearly': '年',
        'period': '自訂期間'
      },
      sysConfig: {
        'sysCommonSetting': '系統共用參數設定',
        'prodDepartSetting': '生產單位編制設定',
        'shiftTimeConfig': '班別時間表設定',
        'noteConfigSetting': '備註選填代號設定',
        'timeFormatSetting': '實際預計完成時間格式',
        'permissionSetting': '權限設定',
        'backup': '資料備份'
      }
    }
  },
  created () {
    var date = moment().date()
    if (date <= 10) {
      this.selectedTenDays = 'early'
    } else if (date <= 20) {
      this.selectedTenDays = 'middle'
    } else {
      this.selectedTenDays = 'late'
    }
    this.selectedQuarter = moment().quarter() - 1
    this.selectedYearTo = this.selectedYear
    this.selectedDatePeriodTo = this.selectedDatePeriod
    var dateStr = ''
    if (this.reportProps === 'daily') {
      dateStr = this.selectedDate
    } else if (this.reportProps === 'weekly') {
      dateStr = this.dateFrom + ' ~ ' + this.dateTo
    } else if (this.reportProps === 'tenDays') {
      dateStr = this.dateFromTenDays + ' ~ ' + this.dateToTenDays
    } else if (this.reportProps === 'monthly') {
      dateStr = this.yearMonth
    } else if (this.reportProps === 'quarterly') {
      dateStr = this.dateFromQuarter + ' ~ ' + this.dateToQuarter
    } else if (this.reportProps === 'yearly') {
      dateStr = this.selectedYear + ' ~ ' + this.selectedYearTo
    } else {
      dateStr = this.reportProps
    }
    this.str = '請選擇報表時間    ' + dateStr
  },
  beforeRouteUpdate (to, from, next) {
    // just use `this`
    // this.name = to.params.name
    next()
  },
  computed: {
    dateFrom: function () {
      if (this.period === 'weekly') {
        return moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
      } else if (this.period === 'tenDays') {
      } else if (this.period === 'monthly') {
        return moment(this.yearMonth).date(1).format('YYYY-MM-DD')
      } else if (this.period === 'quarterly') {
      } else if (this.period === 'yearly') {
        return moment(this.selectedYear, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
      } else {
        return moment(this.selectedDateFrom).format('YYYY-MM-DD')
      }
    },
    dateTo: function () {
      if (this.period === 'weekly') {
        return moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
      } else if (this.period === 'tenDays') {
      } else if (this.period === 'monthly') {
        return moment(this.yearMonth).add(1, 'month').date(0).format('YYYY-MM-DD')
      } else if (this.period === 'quarterly') {
      } else if (this.period === 'yearly') {
        return moment(this.selectedYear, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
      } else {
        return moment(this.selectedDateTo).format('YYYY-MM-DD')
      }
    },
    weeksInYear: function () {
      return moment(`${this.selectedYearWeekly}`, 'YYYY').weeksInYear()
    }
  },
  watch: {
    selectedReport: function () {
      // console.log('111')
      // console.log(this.selectedReport)
      this.selectedReportKey = (_.invert(this.reportArr))[this.selectedReport]
      // console.log(this.selectedReportKey)
    },
    reportProps: function () {
      var dateStr = ''
      if (this.reportProps === 'daily') {
        dateStr = this.selectedDate
      } else if (this.reportProps === 'weekly') {
        dateStr = this.dateFrom + ' ~ ' + this.dateTo
      } else if (this.reportProps === 'tenDays') {
        dateStr = this.dateFromTenDays + ' ~ ' + this.dateToTenDays
      } else if (this.reportProps === 'monthly') {
        dateStr = this.yearMonth
      } else if (this.reportProps === 'quarterly') {
        dateStr = this.dateFromQuarter + ' ~ ' + this.dateToQuarter
      } else if (this.reportProps === 'yearly') {
        dateStr = this.selectedYear + ' ~ ' + this.selectedYearTo
      } else {
        dateStr = this.reportProps
      }
      this.str = '請選擇報表時間    ' + dateStr
    },
    checked: function () {
      if (this.checked.includes('全課')) {
      }
    },
    yearMonthTenDays: function () {
      if (this.selectedTenDays === 'early') {
        this.dateFromTenDays = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
        this.dateToTenDays = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
      } else if (this.selectedTenDays === 'middle') {
        this.dateFromTenDays = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
        this.dateToTenDays = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
      } else {
        this.dateFromTenDays = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
        this.dateToTenDays = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
      }
    },
    selectedTenDays: function () {
      // console.log(this.selectedTenDays)
      if (this.selectedTenDays === 'early') {
        this.dateFromTenDays = moment(this.yearMonthTenDays).date(1).format('YYYY-MM-DD')
        this.dateToTenDays = moment(this.yearMonthTenDays).date(10).format('YYYY-MM-DD')
      } else if (this.selectedTenDays === 'middle') {
        this.dateFromTenDays = moment(this.yearMonthTenDays).date(11).format('YYYY-MM-DD')
        this.dateToTenDays = moment(this.yearMonthTenDays).date(20).format('YYYY-MM-DD')
      } else {
        this.dateFromTenDays = moment(this.yearMonthTenDays).date(21).format('YYYY-MM-DD')
        this.dateToTenDays = moment(this.yearMonthTenDays).add(1, 'month').date(0).format('YYYY-MM-DD')
      }
    },
    selectedQuarter: function () {
      if (this.selectedQuarter === 1) {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(2).date(31).format('YYYY-MM-DD')
      } else if (this.selectedQuarter === 2) {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(3).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(5).date(30).format('YYYY-MM-DD')
      } else if (this.selectedQuarter === 3) {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(6).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(8).date(30).format('YYYY-MM-DD')
      } else {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(9).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
      }
    },
    selectedYearQuarter: function () {
      if (this.selectedQuarter === 1) {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(0).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(2).date(31).format('YYYY-MM-DD')
      } else if (this.selectedQuarter === 2) {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(3).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(5).date(30).format('YYYY-MM-DD')
      } else if (this.selectedQuarter === 3) {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(6).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(8).date(30).format('YYYY-MM-DD')
      } else {
        this.dateFromQuarter = moment(this.selectedYearQuarter, 'YYYY').month(9).date(1).format('YYYY-MM-DD')
        this.dateToQuarter = moment(this.selectedYearQuarter, 'YYYY').month(11).date(31).format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    openURL,
    focusIntegratedDailyReport () {
      this.DailyReport = false
      // console.log(this.IntegratedDailyReport)
      // console.log(this.DailyReport)
    },
    focusDailyReport () {
      this.IntegratedDailyReport = false
      // console.log(this.IntegratedDailyReport)
      // console.log(this.DailyReport)
    },
    range: function (start, end) {
      var array = []
      var j = 0
      for (var i = start; i <= end; i++, j++) {
        array[j] = i
      }
      return array
    },
    openModal () {
      // console.log('LLK~')
      this.$nextTick(() => {
        this.$refs.basicModal.show()
      })
    },
    openModal1 () {
      this.$nextTick(() => {
        this.$refs.basicModal1.show()
      })
    },
    openModalAlm () {
      // console.log('LLK~')
      this.$nextTick(() => {
        this.$refs.basicModalAlm.show()
      })
    },
    openModalAlm1 () {
      this.$nextTick(() => {
        this.$refs.basicModalAlm1.show()
      })
    },
    closeModal () {
      // console.log(this.checked)
      // console.log(this.radio1)
      this.$refs.basicModal.hide()
    },
    closeModal1 () {
      // console.log(this.checked)
      // console.log(this.radio1)
      this.$refs.basicModal1.hide()
    },
    closeModalAlm () {
      // console.log(this.checked)
      // console.log(this.radio1)
      this.$refs.basicModalAlm.hide()
    },
    closeModalAlm1 () {
      // console.log(this.checked)
      // console.log(this.radio1)
      this.$refs.basicModalAlm1.hide()
    },
    blurDepart1 () {
      // this.checked = ['1A']
    },
    showSel () {
      // console.log(this.selectedReport)
    },
    showSel1 () {
      // console.log(this.selectedAlmReport)
    },
    Enter () {
      this.$refs.basicModal.hide()
      this.selectItem = '' // '生產報表'
      // console.log('egg')
      // console.log(this.selectedReport)
      var zoneS = {}
      switch (this.radio1) {
        case '全廠':
          zoneS = {'全廠': this.depratObj}
          break
        case '成型一課':
          zoneS = {'成型一課': this.checked}
          break
        case '成型二課':
          zoneS = {'成型二課': this.checked}
          break
        default:
          zoneS = {'全廠': this.depratObj}
          break
      }
      switch (this.selectedReport) {
        case 'Report':
          // this.$router.push('/DailyReport')
          if (this.reportProps === 'daily') {
            if (this.DailyReport) {
              this.$router.push({name: 'DailyReportProps', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
              // console.log(this.selectedDate)
            } else if (this.IntegratedDailyReport) {
              // this.$router.push({name: 'IntegratedDailyReport', params: {selectedDate: this.selectedDate, department: this.radio1, zone: this.checked}})
              this.$router.push({name: 'IntegratedDailyReport', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
            }
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'PeriodReportWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'PeriodReportTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'PeriodReportMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'PeriodReportQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'PeriodReportYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          // console.log(this.$route.path)
          break
        case 'ProductionStatisticsTable':
          this.$router.push({path: '/DefectiveTable'})
          // console.log(this.selectedReport)
          break
        case 'Curve':
          this.$router.push({name: 'PeriodReport', params: {period: this.reportProps}})
          // console.log(this.selectedReport)
          break
        case 'ProductReport':
          // this.$router.push({name: 'ProductPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProductPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProductPeriodReportWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProductPeriodReportTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProductPeriodReportMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProductPeriodReportQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProductPeriodReportYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'ProductPeriodReport1', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          // console.log(this.selectedReport)
          break
        case 'MoldReport':
          // this.$router.push({name: 'MoldPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'MoldPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'MoldPeriodReportWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'MoldPeriodReportTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'MoldPeriodReportMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'MoldPeriodReportQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'MoldPeriodReportYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'MoldPeriodReport1', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          // console.log(this.selectedReport)
          break
        case 'Utilization':
          // this.$router.push({name: 'Utilization', params: {period: this.reportProps}})
          // console.log(this.selectedReport)
          break
        case 'MOQ':
          // console.log(this.selectedReport)
          break
        case 'ProductProcessAnalysis':
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProcessAnalysisReportDaily', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProcessAnalysisReportWeekly', params: {reportType: 'productAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProcessAnalysisReportTenDays', params: {reportType: 'productAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProcessAnalysisReportMonthly', params: {reportType: 'productAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProcessAnalysisReportQuarterly', params: {reportType: 'productAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProcessAnalysisReportYearly', params: {reportType: 'productAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'ProcessAnalysisReport1', params: {reportType: 'productAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          // console.log(this.selectedReport)
          break
        case 'MoldNumProcessAnalysis':
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProcessAnalysisReportDaily', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProcessAnalysisReportWeekly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProcessAnalysisReportTenDays', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProcessAnalysisReportMonthly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProcessAnalysisReportQuarterly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProcessAnalysisReportYearly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'ProcessAnalysisReport1', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          // console.log(this.selectedReport)
          break
      }
    },
    Enter1 () {
      this.$refs.basicModal1.hide()
      this.selectItem = '' // '生產報表'
      var zoneS = {}
      switch (this.radio1) {
        case '全廠':
          zoneS = {'全廠': this.depratObj}
          break
        case '成型一課':
          zoneS = {'成型一課': this.checked}
          break
        case '成型二課':
          zoneS = {'成型二課': this.checked}
          break
        default:
          zoneS = {'全廠': this.depratObj}
          break
      }
      // console.log('egg')
      // console.log(this.selectedReport)
      // console.log('too bad')
      if (this.selectedReport === 'Utilization') {
        // console.log('Hello')
      } else {
        // console.log('else')
        // console.log(this.selectedReport)
      }
      switch (this.selectedReport) {
        case 'Report':
          // this.$router.push('/DailyReport')
          if (this.reportProps === 'daily') {
            if (this.DailyReport) {
              this.$router.push({name: 'DailyReportProps', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
              // console.log(this.selectedDate)
            } else if (this.IntegratedDailyReport) {
              // this.$router.push({name: 'IntegratedDailyReport', params: {selectedDate: this.selectedDate, department: this.radio1, zone: this.checked}})
              this.$router.push({name: 'IntegratedDailyReport', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
            }
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'PeriodReportWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'PeriodReportTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'PeriodReportMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'PeriodReportQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'PeriodReportYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
          }
          // console.log(this.$route.path)
          break
        case 'ProductionStatisticsTable':
          this.$router.push({path: '/DefectiveTable'})
          // console.log(this.selectedReport)
          break
        case 'Curve':
          this.$router.push({name: 'PeriodReport', params: {period: this.reportProps}})
          // console.log(this.selectedReport)
          break
        case 'ProductReport':
          // this.$router.push({name: 'ProductPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProductPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProductPeriodReportWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProductPeriodReportTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProductPeriodReportMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProductPeriodReportQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProductPeriodReportYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'ProductPeriodReport1', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          // console.log(this.selectedReport)
          break
        case 'MoldReport':
          // this.$router.push({name: 'MoldPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'MoldPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'MoldPeriodReportWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'MoldPeriodReportTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'MoldPeriodReportMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'MoldPeriodReportQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'MoldPeriodReportYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'MoldPeriodReport1', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          // console.log(this.selectedReport)
          break
        case 'Utilization':
          // console.log('1')
          /* if (this.reportProps !== 'daily') {
            this.$router.push({name: 'Utilization', params: {period: this.reportProps}})
          } */
          // console.log(this.selectedReport)
          // console.log(this.reportProps)
          // console.log('this.reportProps')
          if (this.reportProps === 'daily') {
            // console.log('this.UtilizationDaily')
            this.$router.push({name: 'UtilizationDaily', params: {period: this.reportProps, departmentS: this.radio1, zoneS: zoneS, selectedDateS: this.selectedDate}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'UtilizationWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'UtilizationTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'UtilizationMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'UtilizationQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'UtilizationYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'Utilization1', params: {period: this.reportProps, department: this.radio1, zone: this.checked, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
          }
          break
        case 'MOQ':
          // console.log(this.selectedReport)
          break
        case 'Table':
          this.getStatus(this.$router.push('/WeeklyReport')) // ({name: 'test', params: {period: 'weekly'}}))
          // console.log(this.selectedReport)
          break
        default:
          // console.log('nock')
          break
      }
    },
    EnterAlm () {
      this.$refs.basicModalAlm.hide()
      this.selectItem = '' // '生產報表'
      // console.log('egg')
      // console.log(this.selectedAlmReport)
      var zoneS = {}
      switch (this.radio1) {
        case '全廠':
          zoneS = {'全廠': this.depratObj}
          break
        case '成型一課':
          zoneS = {'成型一課': this.checked}
          break
        case '成型二課':
          zoneS = {'成型二課': this.checked}
          break
        default:
          zoneS = {'全廠': this.depratObj}
          break
      }
      switch (this.selectedAlmReport) {
        case 'AbnormalTable':
          // console.log('AbnormalTable')
          break
        case 'AbnormalPie':
          // console.log('AbnormalPie')
          break
        case 'Abnormal':
          if (this.reportProps === 'daily') {
            // console.log('this.AbnormalReportDaily')
            this.$router.push({name: 'AbnormalReportDaily', params: {period: this.reportProps, departmentS: this.radio1, zoneS: zoneS, selectedDateS: this.selectedDate}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'AbnormalReportWeekly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'AbnormalReportTenDays', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'AbnormalReportMonthly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'AbnormalReportQuarterly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'AbnormalReportYearly', params: {period: this.reportProps, department: this.radio1, zoneS: zoneS, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'AbnormalReport1', params: {period: this.reportProps, department: this.radio1, zone: this.checked, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
          }
          // console.log('Abnormal')
          break
      }
    }
  }
}
</script>
<style lang="stylus">
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
.q-item.router-link-active, .q-item:focus
  background: rgba(0,0,0,0);
.q-item-side
  color: white;
  min-width: 1em;
.layout-aside-left
  left: 0;
  width: 250px;
</style>
