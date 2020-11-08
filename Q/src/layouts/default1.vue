<template>
  <q-layout ref="layout" view="hHh LpR lfr" class="bg-grey-4" :left-class="leftClass" :left-style="leftStyle">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <!--<q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        >
        </q-btn>-->
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen1 = !leftDrawerOpen1, leftDrawerOpen2 = false"
          aria-label="Menu"
          icon="menu"
          :disable="loginSuccess"
        >
        <q-tooltip>
          主選單
        </q-tooltip>
          <!--<q-icon name="menu" />-->
        </q-btn>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen2 = !leftDrawerOpen2, leftDrawerOpen1 = false"
          aria-label="Menu"
          icon="menu"
          :disable="loginSuccess"
        >
        <q-tooltip>
          副選單
        </q-tooltip>
        </q-btn>
        <q-toolbar-title>
          龍達塑膠成型機生產管理系統
          <span slot="subtitle">Version 4.1</span>
        </q-toolbar-title>
        {{user}}
        <q-btn
          flat
          dense
          @click="Logout, user='', $router.push('/'), page='home', loginSuccess=true, userName='', userPassword='', leftDrawerOpen1=false, leftDrawerOpen2=false"
          icon="logout"
          label="登出"
        >
        <q-icon name="fas sign-out-alt" />
        </q-btn>
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
        <q-item v-for="(key, report) in reportArr" v-bind:key="report" v-if="report !== 'Utilization'">
          <q-btn
          flat
          aria-label="Menu"
          :label="key"
          icon="remove_red_eye"
          color="green"
          :text-color="subTypeClick===key?'red':'green'"
          @click="openModal1(), subTypeClick=key, selectedReport=report"
          :disable="reportDis[report]"
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
        <q-item v-for="(key, report) in abnormalArr" v-bind:key="report">
          <q-btn
          flat
          aria-label="Menu"
          :label="key"
          icon="remove_red_eye"
          color="green"
          :text-color="subTypeClick===key?'red':'green'"
          @click="openModal1(), subTypeClick=key"
          :disable="abnormalDis[report]"
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
        <q-item v-for="(key, report) in sysConfigArr" v-bind:key="report">
          <q-btn
          flat
          aria-label="Menu"
          :label="key"
          :icon="sysConfigIcon[report]"
          color="green"
          :text-color="subTypeClick===key?'red':'green'"
          @click="sysConfigSelectedFunc(report), subTypeClick=key, sysConfigSelectedItem=report"
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
          @click="$router.push('/monitor'), typeClick='monitor', page=''"
          label="機台監控"
          icon="icon-svg26"
          color="green"
          :disable="monitorDisable"
        >
          <!--<q-icon name="remove_red_eye" color="green"/>
          機台監控-->
        </q-btn>
      </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          @click="$router.push({name: 'register', params: {user: user}}), typeClick='RegisterProps', page=''"
          label="資料登錄"
          icon="icon-svg27"
          color="green"
          :disable="registerDisable"
        >
        <!--<q-icon name="remove_red_eye"  color="green"/>
          資料登錄-->
        </q-btn>
      </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          @click="$router.push({name: 'registerAlarm'}), typeClick='RegisterAlarmProps', page=''"
          label="每日警報"
          icon="grade"
          color="red"
          :disable="registerDisable"
        >
        <!--<q-icon name="remove_red_eye"  color="green"/>
          資料登錄-->
        </q-btn>
      </q-item>
      <q-item v-show="user==='使用者10'">
        <q-btn
          flat
          aria-label="Menu"
          @click="$router.push({name: 'registerNew'}), typeClick='RegisterPropsNew', page=''"
          label="資料登錄 New"
          icon="icon-svg27"
          color="green"
          :disable="registerDisable"
        >
        <!--<q-icon name="remove_red_eye"  color="green"/>
          資料登錄-->
        </q-btn>
        </q-item>
        <q-item v-show="user==='使用者10'">
        <q-btn
          flat
          aria-label="Menu"
          @click="$router.push({name: 'RegisterCompare'}), typeClick='RegisterCompare', page=''"
          label="資料比對"
          icon="icon-svg27"
          color="green"
          :disable="registerDisable"
        >
        </q-btn>
        </q-item>
        <q-item v-show="user==='使用者10'">
        <q-btn
          flat
          aria-label="Menu"
          @click="$router.push({name: 'RegisterCompareAlm'}), typeClick='RegisterCompareAlm', page=''"
          label="警報資料比對"
          icon="icon-svg27"
          color="green"
          :disable="registerDisable"
        >
        </q-btn>
        </q-item>
        <q-item v-show="user==='使用者10'">
        <q-btn
          flat
          aria-label="Menu"
          @click="$router.push({name: 'registerWithAlarm'}), typeClick='registerWithAlarm', page=''"
          label="資料列表"
          icon="icon-svg27"
          color="green"
          :disable="registerDisable"
        >
        </q-btn>
        </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          @click="openModal(), typeClick='Report'"
          :label="types[0].label"
          icon="icon-svg11"
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
          color="green"
          @click="openModal1(), typeClick='Utilization', report='Utilization', selectedReport='Utilization'"
          icon="icon-svg24"
        >
      </q-btn>
      </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          :label="types[2].label"
          icon="icon-svg25"
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
          icon="icon-svg28"
          color="green"
          @click="typeClick='sysConfig', leftDrawerOpen1=false, leftDrawerOpen2=true"
          :disable="sysConfigDisable"
        >
        </q-btn>
        </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          label="工作排程"
          icon="icon-svg29"
          color="green"
          @click="ArrZ=recursiveConstructZoneS(orgArr, orgArr[0]['_id'], -1), $router.push({name: 'ShiftTable', params: {zoneS: ArrZ, organ: {test: orgArr}}}), typeClick='ShiftTable', page=''"
          :disable="shiftDisable"
        >
        </q-btn>
        </q-item>
      <q-item>
        <q-btn
          flat
          aria-label="Menu"
          label="使用說明"
          icon="icon-svg22"
          color="green"
          @click="typeClick='ProductionStatisticsTable', page=''"
        >
        </q-btn>
        </q-item>
      </q-list>
    </q-layout-drawer>
    <!--<q-layout-drawer
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
          </div>
        </q-collapsible>
        <q-collapsible v-if="selectItem==='生產報表'" label="模具編號-生產報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
          </div>
        </q-collapsible>
        <q-collapsible label="稼動報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
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
            <q-item :to="{name: 'sysCommonSetting', params: {period: key}}" >
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
    </q-layout-drawer>-->
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-modal :ref="types[0].ref" :content-css="{padding: '10px', maxWidth: '100%'}">
     <!-- <q-modal v-model="showModal0" :content-css="{padding: '10px', maxWidth: '100%'}" position="bottom">-->
    <q-modal-layout
    header-style="min-height: 100%"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
    <q-list highlight>
      <!--<q-list-header>請選擇報表類別</q-list-header>-->
      <q-collapsible :label="reportTypeStr">
      <q-item v-for="(key, report) in reportArr" v-bind:key="report" v-if="report !== 'Utilization'">
        <q-radio   v-model="selectedReport" :val="report" :label="key" @focus="showSel()" :disable="reportDis[report]"/>
        <!--<q-checkbox v-if="report==='Report'" v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
        <q-checkbox v-if="report==='Report'" v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>-->
        <q-field v-if="report==='ProductionStatisticsTable'" label="歷(" :label-width="12"/>
        <q-select v-if="report==='ProductionStatisticsTable'" v-model="productionStatisticsSel" :options="timesOptionArr" filter filter-placeholder="期數選擇"/>
        <q-field v-if="report==='ProductionStatisticsTable'" label=")期統計表" :label-width="12"/>
        <q-checkbox v-if="report==='ProductionStatisticsTable'" v-model="productionStatisticsTotal" label="加列全單位合計"/>
        <q-field v-if="report==='Curve'" label="歷(" :label-width="12"/>
        <q-select v-if="report==='Curve'" v-model="curveSel" :options="timesOptionArr" filter filter-placeholder="期數選擇"/>
        <q-field v-if="report==='Curve'" label=")期統計表" :label-width="12"/>
        <q-checkbox v-if="report==='Curve'" v-model="curveTotal" label="加列全單位合計"/>
        <q-select v-if="report==='ProductReport'" v-model="ProductReportFrom" :options="ProductArr" filter filter-placeholder="成品料號選擇" placeholder="XXXX-XXXX" clearable clear-value="XXXX-XXXX" @input="ProductReportTo=ProductReportFrom"/>
        <q-select v-if="report==='ProductReport'" v-model="ProductReportTo" :options="ProductArr" filter filter-placeholder="成品料號選擇" placeholder="XXXX-XXXX" clearable clear-value="XXXX-XXXX"/>
        <q-select v-if="report==='MoldReport'" v-model="MoldReportFrom" :options="MoldArr" filter filter-placeholder="模具編號選擇" placeholder="XXXX-XXXX" clearable clear-value="XXXX-XXXX" @input="MoldReportTo=MoldReportFrom"/>
        <q-select v-if="report==='MoldReport'" v-model="MoldReportTo" :options="MoldArr" filter filter-placeholder="模具編號選擇" placeholder="XXXX-XXXX" clearable clear-value="XXXX-XXXX"/>
        <q-select v-if="report==='ProductProcessAnalysis'" v-model="ProductArrSel" :options="ProductArr" filter filter-placeholder="成品料號選擇" placeholder="請選擇成品料號" clearable clear-value="XXXX-XXXX"/>
        <q-select v-if="report==='MoldNumProcessAnalysis'" v-model="MoldArrSel" :options="MoldArr" filter filter-placeholder="模具編號選擇" placeholder="請選擇模具編號" clearable clear-value="XXXX-XXXX"/>
      </q-item>
      </q-collapsible>
    </q-list>
    <!--<p class="caption">成型單位選擇</p>-->
    <q-list highlight>
      <!--<q-list-header>成型單位選擇</q-list-header>-->
    <q-collapsible :label="unitStr">
    <!--<q-item>
      <q-item-main>
      <q-radio v-model="radio1" val="全廠" label="全廠" color="primary" style="margin-left: 10px"/>
    </q-item-main >
    </q-item>-->
    <q-item v-for="(depratArr, key) in depratObj" v-bind:key="key" track-by="$index">
      <q-item-main>
        <q-radio  v-model="radio1" :val="key" :label="key" @blur="blurDepart1()" :color="depratObjColor[key]" style="margin-left: 10px" />
         &nbsp;&nbsp;
        <q-checkbox v-if="radio1===key" v-for="deprat in depratArr" v-bind:key="deprat.key" v-model="checked" :val="deprat.key" :label="deprat.value" >
          &nbsp;&nbsp;
        </q-checkbox>
        <q-checkbox v-if="radio1!==key" v-for="deprat in depratArr" v-bind:key="deprat.key" v-model="checked" :val="deprat.key" :label="deprat.value" disable>
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
      <q-radio  v-model="reportProps" val="daily" label="日" :disable="selectedReport!=='Report'"/>
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDate" />
      <q-checkbox v-show="typeClick!=='Utilization' && typeClick!=='Abnormal'" v-model="DailyReport" label="明細" :disable="selectedReport!=='Report'" @focus="focusDailyReport()"/>
      <q-checkbox v-show="typeClick!=='Utilization' && typeClick!=='Abnormal'" v-model="IntegratedDailyReport" label="整合" :disable="selectedReport!=='Report'" @focus="focusIntegratedDailyReport()"/>
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

  <q-modal :ref="types[1].ref" :content-css="{padding: '10px', maxWidth: '100%'}">
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
      <q-collapsible :label="unitStr">
      <!--<q-list-header>成型單位選擇</q-list-header>-->
    <!--<q-item>
      <q-item-main>
      <q-radio v-model="radio1" val="全廠" label="全廠" color="primary" style="margin-left: 10px"/>
    </q-item-main >
    </q-item>-->
    <q-item v-for="(depratArr, key) in depratObj" v-bind:key="key">
      <q-item-main>
        <q-radio  v-model="radio1" :val="key" :label="key" @blur="blurDepart1()" :color="depratObjColor[key]" style="margin-left: 10px" />
         &nbsp;&nbsp;
        <q-checkbox v-if="radio1===key" v-for="deprat in depratArr" v-bind:key="deprat.key" v-model="checked" :val="deprat.key" :label="deprat.value" >
          &nbsp;&nbsp;
        </q-checkbox>
        <q-checkbox v-if="radio1!==key" v-for="deprat in depratArr" v-bind:key="deprat.key" v-model="checked" :val="deprat.key" :label="deprat.value" disable>
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
      <q-radio  v-model="reportProps" val="daily" label="日"/>
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDate" />
      <q-checkbox  v-show="typeClick!=='Utilization' && typeClick!=='Abnormal'" v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
      <q-checkbox  v-show="typeClick!=='Utilization' && typeClick!=='Abnormal'" v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>
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
  <q-modal :ref="types[2].ref" :content-css="{padding: '10px', maxWidth: '100%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
    <q-list highlight>
      <!--<q-list-header>請選擇報表類別</q-list-header>-->
      <q-collapsible :label="alarmTypeStr">
      <q-item v-for="(key, report) in abnormalArr" v-bind:key="report">
        <q-radio   v-model="selectedAlmReport" :val="report" :label="key" @focus="showSel1()" :disable="abnormalDis[report]"/>
        <q-field v-if="report==='AbnormalPie'" label="當期統計圓形圖(" :label-width="12"/>
        <q-checkbox v-if="report==='AbnormalPie'" v-model="abnormalePieGroup"/>
        <q-field v-if="report==='AbnormalPie'" label="加列全單位)" :label-width="12"/>
        <q-field v-if="report==='AbnormalTable'" label="歷(" :label-width="12"/>
        <q-select v-if="report==='AbnormalTable'" v-model="abnormaleTableTimes" :options="timesOptionArr" filter filter-placeholder="期數選擇"/>
        <q-field v-if="report==='AbnormalTable'" label=")期分類統計表" :label-width="12"/>
        <!--<q-checkbox v-if="report==='Report'" v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
        <q-checkbox v-if="report==='Report'" v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>-->
      </q-item>
      </q-collapsible>
    </q-list>
    <!--<p class="caption">成型單位選擇</p>-->
    <q-list highlight>
      <q-collapsible label="異常類別">
        <q-item v-for="(obj, idx) in abnormalListArr" v-bind:key="idx">
          <q-checkbox :label="obj.value" v-model="obj.selected"/>
        </q-item>
      </q-collapsible>
    </q-list>
    <!--<p class="caption">成型單位選擇</p>-->
    <q-list highlight>
      <!--<q-list-header>成型單位選擇</q-list-header>-->
    <q-collapsible :label="unitStr">
    <!--<q-item>
      <q-item-main>
      <q-radio v-model="radio1" val="全廠" label="全廠" color="primary" style="margin-left: 10px"/>
    </q-item-main >
    </q-item>-->
    <q-item v-for="(depratArr, key) in depratObj" v-bind:key="key">
      <q-item-main>
        <q-radio  v-model="radio1" :val="key" :label="key" @blur="blurDepart1()" :color="depratObjColor[key]" style="margin-left: 10px" />
         &nbsp;&nbsp;
        <q-checkbox v-if="radio1===key" v-for="deprat in depratArr" v-bind:key="deprat.key" v-model="checked" :val="deprat.key" :label="deprat.value" >
          &nbsp;&nbsp;
        </q-checkbox>
        <q-checkbox v-if="radio1!==key" v-for="deprat in depratArr" v-bind:key="deprat.key" v-model="checked" :val="deprat.key" :label="deprat.value" disable>
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
      <q-checkbox  v-show="typeClick!=='Utilization' && typeClick!=='Abnormal'" v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
      <q-checkbox  v-show="typeClick!=='Utilization' && typeClick!=='Abnormal'" v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>
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
  <!--<div v-if="page==='home'" class="row justify-center q-mt-xl">
    <h4>歡迎使用龍達股份有限公司機台監控管理系統</h4>
  </div>
  <div v-if="page==='home'" class="row justify-center q-mt-xl">
    <h5>龍達塑膠股份有限公司</h5>
  </div>
  <div v-if="page==='home'" class="row justify-center q-mt-xl">
    <h5>成型機生產管理機台監控系統</h5>
  </div>-->
  <div class="column justify-center">
  <div v-if="page==='home'" class="row justify-center q-mt-xl">
    <h4>龍達塑膠股份有限公司射出機台監控管理系統</h4>
  </div>
 <div v-if="page==='home'" class="column justify-center bg-black q-pt-xl q-pb-xl">
  <div class="row justify-center">
    <q-input class="input-home" v-if="page==='home'" v-model="userName" color="white" dark float-label="帳號"/>
    </div>
  <div class="row justify-center q-mt-sm">
    <q-input class="input-home" v-if="page==='home'" v-model="userPassword" color="white" dark float-label="密碼" type="password"/>
  </div>
    </div>
  <div class="row justify-center q-mt-xl">
    <q-checkbox v-if="page==='home'" v-model="userNameChecked" label="記住帳號" />
    </div>
  <div class="row justify-center q-mt-md">
    <q-checkbox v-if="page==='home'" v-model="userPasswordChecked" label="記住密碼" />
  </div>
    <div v-if="page==='home'" class="row justify-center q-ml-xl q-pl-md q-mt-xl">
    <div class="col-1">
      <q-btn size="lg" outline glossy label="登錄" @click="login()"/>
      </div>
      <div class="col-1">
      <q-btn size="lg" outline glossy label="取消" @click="userNameChecked=false, userPasswordChecked=false, userName='', userPassword=''"/>
    </div>
    </div>
    </div>
  </q-layout>
</template>

<script>
import $ from 'jquery'
import { openURL } from 'quasar'
import moment from 'moment'
import Vue from 'vue'
// var _ = require('underscore')._

export default {
  name: 'LayoutDefault',
  data () {
    return {
      page: 'home',
      user: '',
      userPassword: '',
      userName: '',
      userNameChecked: false,
      userPasswordChecked: false,
      showModal0: false,
      typeClick: '',
      subTypeClick: '',
      unitStr: '成型單位選擇    全廠',
      str: '請選擇報表時間    ',
      reportTypeStr: '請選擇報表類別    ',
      alarmTypeStr: '請選擇報表類別    ',
      selectItem: '',
      IntegratedDailyReport: true,
      DailyReport: false,
      // leftDrawerOpen: false,
      leftDrawerOpen1: false, // this.$q.platform.is.desktop,
      leftDrawerOpen2: false, // this.$q.platform.is.desktop,
      dateFrom: '',
      dateTo: '',
      selectedDatePeriod: moment().format('YYYY-MM-DD'),
      selectedDatePeriodTo: '',
      selectedYear: moment().subtract(1, 'year').year(),
      selectedYearTo: '',
      dateFromQuarter: moment().subtract(1, 'quarter').date(1).format('YYYY-MM-DD'),
      dateToQuarter: moment().date(1).subtract(1, 'day').format('YYYY-MM-DD'),
      dateFromTenDays: '',
      dateToTenDays: '',
      yearMonthTenDays: moment().format('YYYY-MM'),
      week: 'weekly',
      checked: [],
      oldChecked: [],
      radioSel: '',
      radio1: '全廠',
      depratObj: {}, // {'全廠': [], '成型一課': ['全課', '1A', '1B', '1C'], '成型二課': ['全課', '2A', '2B', '2C']},
      depratObjColor: {'全廠': 'primary', '成型一課': 'secondary', '成型二課': 'secondary'},
      reportProps: 'daily',
      selectedDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      selectedWeek: moment().subtract(1, 'week').week(),
      selectedYearWeekly: moment().subtract(1, 'week').year(),
      selectedYearQuarter: moment().subtract(1, 'quarter').year(),
      selectedTenDays: '',
      yearMonth: moment().subtract(1, 'month').format('YYYY-MM'), // yearmonth,
      selectedQuarter: moment().subtract(1, 'quarter').quarter(),
      selectedDateFrom: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      selectedDateTo: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      selectedReportKey: 'A.生產報表',
      selectedAlmReport: 'Abnormal',
      selectedReport: 'Report',
      sysConfigSelectedItem: '',
      /* reportArr: {
        'A.生產報表': 'Report',
        'B.生產管理項目統計表': 'ProductionStatisticsTable',
        'C.平均不良率': 'Curve',
        'D.成品料號生產統計表': 'ProductReport',
        'E.模具編號生產統計表': 'MoldReport',
        'F.成品料號製程分析': 'ProductProcessAnalysis',
        'G.模具編號製程分析': 'MoldNumProcessAnalysis',
        'H.生產未達MOQ統計表': 'MOQ',
        'I.稼動率報表': 'Utilization'
      }, */
      reportArr: {
        'Report': 'A.生產報表',
        'ProductionStatisticsTable': 'B.生產管理項目統計表',
        'Curve': 'C.平均不良率',
        'ProductReport': 'D.成品料號生產統計表',
        'MoldReport': 'E.模具編號生產統計表',
        'ProductProcessAnalysis': 'F.成品料號製程分析',
        'MoldNumProcessAnalysis': 'G.模具編號製程分析',
        'MOQ': 'H.生產未達MOQ統計表',
        'Utilization': 'I.稼動率報表'
      },
      reportDis: {
        'Report': true,
        'ProductionStatisticsTable': true,
        'Curve': true,
        'ProductReport': true,
        'MoldReport': true,
        'ProductProcessAnalysis': true,
        'MoldNumProcessAnalysis': true,
        'MOQ': true,
        'Utilization': true
      },
      abnormalArr: {
        'AbnormalTable': '異常時數分類統計表',
        'AbnormalPie': '異常時數統計圓形圖',
        'Abnormal': '異常明細表'
      },
      abnormalDis: {
        'AbnormalTable': true,
        'AbnormalPie': true,
        'Abnormal': true
      },
      sysConfigArr: {
        'sysCommonSetting': '系統共用參數設定',
        'prodDepartSetting': '生產單位編制設定',
        'shiftTimeConfig': '班別時間表設定',
        'noteConfigSetting': '備註選填代號設定',
        // '實際預計完成時間格式': 'timeFormatSetting',
        'permissionSetting': '權限設定',
        'backup': '資料備份'
      },
      sysConfigIcon: {
        'sysCommonSetting': 'icon-svg13',
        'prodDepartSetting': 'icon-svg30',
        'shiftTimeConfig': 'icon-svg7',
        'noteConfigSetting': 'icon-svg2',
        '實際預計完成時間格式': 'icon-svg6',
        'permissionSetting': 'icon-svg3',
        'backup': 'icon-svg14'
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
      },
      abnormalListArr: [],
      MoldArr: [],
      MoldArrSel: 'XXXX-XXXX',
      ProductArr: [],
      ProductArrSel: 'XXXX-XXXX',
      managerTableTimes: 12,
      managereGroup: false,
      defectiveTableTimes: 12,
      defectiveGroup: false,
      abnormaleTableTimes: 12,
      abnormalePieGroup: false,
      ProductReportFrom: 'XXXX-XXXX',
      ProductReportTo: 'XXXX-XXXX',
      MoldReportFrom: 'XXXX-XXXX',
      MoldReportTo: 'XXXX-XXXX',
      timesOptionArr: [{
        label: '1',
        value: 1
      }, {
        label: '2',
        value: 2
      }, {
        label: '3',
        value: 3
      }, {
        label: '4',
        value: 4
      }, {
        label: '5',
        value: 5
      }, {
        label: '6',
        value: 6
      }, {
        label: '7',
        value: 7
      }, {
        label: '8',
        value: 8
      }, {
        label: '9',
        value: 9
      }, {
        label: '10',
        value: 10
      }, {
        label: '11',
        value: 11
      }, {
        label: '12',
        value: 12
      }],
      curveSel: 12,
      productionStatisticsSel: 12,
      curveTotal: false,
      productionStatisticsTotal: false,
      loginSuccess: true,
      monitorDisable: true,
      registerDisable: true,
      sysConfigDisable: true,
      shiftDisable: true,
      reportDisable: true,
      ProductionStatisticsTableDisable: true,
      CurveDisable: true,
      ProductReportDisable: true,
      MoldReportDisable: true,
      ProductProcessAnalysisDisable: true,
      MoldNumProcessAnalysisDisable: true,
      MOQDisable: true,
      UtilizationDisable: true,
      AbnormalTableDisable: true,
      AbnormalPieDisable: true,
      AbnormalDisable: true,
      orgArr: [],
      ArrZ: {}
    }
  },
  created () {
    this.$router.push({name: 'home'})
    var date = moment().date()
    if (date <= 10) {
      this.yearMonthTenDays = moment().subtract(1, 'month').format('YYYY-MM')
      this.selectedTenDays = 'late' // 'early'
    } else if (date <= 20) {
      this.selectedTenDays = 'early' // 'middle'
    } else {
      this.selectedTenDays = 'middle' // 'late'
    }
    // this.selectedYearWeekly = moment().year()
    this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
    this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
    // this.selectedQuarter = moment().quarter() - 1
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
    this.reportTypeStr = '請選擇報表類別    ' + this.reportArr[this.selectedReport]
    this.alarmTypeStr = '請選擇報表類別    ' + this.abnormalArr[this.selectedAlmReport]
    getMoldArr(this.MoldArr)
    getProductArr(this.ProductArr)
    getDepartObj(this.depratObj, this, this.orgArr)
    getAbnormalDetailAll(this.abnormalListArr)
    // console.log('orgArr')
    // console.log(this.orgArr)
  },
  beforeRouteUpdate (to, from, next) {
    // just use `this`
    // this.name = to.params.name
    next()
  },
  computed: {
    /* dateFrom: function () {
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
    }, */
    weeksInYear: function () {
      return moment(`${this.selectedYearWeekly}`, 'YYYY').weeksInYear()
    }
  },
  watch: {
    radio1 () {
      this.unitStr = '成型單位選擇    ' + this.radio1
      this.checked.splice(0, this.checked.length)
    },
    selectedReport: function () {
      // console.log('111')
      // console.log(this.selectedReport)
      this.selectedReportKey = this.reportArr[this.selectedReport]
      // this.selectedReportKey = (_.invert(this.reportArr))[this.selectedReport]
      // console.log(this.selectedReportKey)
      this.reportTypeStr = '請選擇報表類別    ' + this.reportArr[this.selectedReport]
    },
    selectedAlmReport: function () {
      this.alarmTypeStr = '請選擇報表類別    ' + this.abnormalArr[this.selectedAlmReport]
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
      // console.log('checked')
      // console.log(this.checked)
      // console.log(this.depratObj)
      // 可以多選
      // this.depratObj[this.radio1]
      /* if (this.oldChecked.length > this.checked.length) {
        if (this.checked.indexOf(this.radio1) > -1) {
          this.checked.splice(this.checked.indexOf(this.radio1), 1)
        }
      } else {
        // console.log(1111111111)
        if (this.checked.indexOf(this.radio1) > -1) {
          // this.checked.splice(0, this.checked.length)
          this.depratObj[this.radio1].forEach(obj => {
            // console.log(444444444)
            if (this.checked.indexOf(obj.key) < 0) {
              this.checked.splice(this.checked.length, 0, obj.key)
            }
          })
        }
      } */
      // 只能選一個
      if (this.checked.length > 1) {
        this.oldChecked.forEach(oc => {
          this.checked.splice(this.checked.indexOf(oc), 1)
        })
      }
      this.oldChecked = this.checked
    },
    selectedYearWeekly: function () {
      this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
      this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
    },
    selectedWeek: function () {
      if (this.selectedWeek < 1) {
        moment().week()
      }
      this.dateFrom = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(0).format('YYYY-MM-DD')
      this.dateTo = moment(`${this.selectedYearWeekly}-W${this.selectedWeek}`, 'YYYY-W').weekday(6).format('YYYY-MM-DD')
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
  mounted () {
    var value = this.$q.cookies.get('cookie_name')
    if (value !== undefined) {
      this.userName = value
    } else {
      this.userName = ''
    }
    value = this.$q.cookies.get('cookie_pw')
    if (value !== undefined) {
      this.userPassword = value
    } else {
      this.userName = ''
    }
  },
  methods: {
    openURL,
    recursiveConstructZoneS (level, key, srcLevel) {
      var idx = level.map(orgElm => {
        return orgElm._id
      }).indexOf(key)
      if (idx < 0) {
        var emptyObj = {} // 20190531 為判斷真正的level = 1 須將全部拉入
        emptyObj[key] = []
        return emptyObj
      } else if (level[idx].level === 1) {
        return {}
      } else if (level[idx].level === srcLevel) { // 正常結構為每次呼叫階層會改變，此部分是避免資料庫異常導致無窮迴圈
        return {}
      } else {
        var retArr = []
        var retObj = {}
        level[idx].son.forEach(elm => {
          var obj = {}
          obj = this.recursiveConstructZoneS(level, elm, level[idx].level)
          if (obj.hasOwnProperty(elm)) {
            retArr.splice(retArr.length, 0, obj)
          } else {
            retArr.splice(retArr.length, 0, elm)
          }
        })
        retObj[key] = retArr
        return retObj
      }
    },
    login () {
      if (this.userName === '' || this.userPassword === '') {
        this.$q.notify({
          // only required parameter is the message:
          message: '帳號或密碼錯誤',
          timeout: 3000, // in milliseconds; 0 means no timeout
          type: 'warning',
          color: 'positive',
          textColor: 'black', // if default 'white' doesn't fit
          icon: 'wifi',
          avatar: 'statics/boy-avatar.png',
          detail: 'Optional detail message.',
          position: 'top-right', // 'top', 'left', 'bottom-left' etc.
          closeBtn: true
        })
        return
      }
      if (this.userNameChecked) {
        this.$q.cookies.set('cookie_name', this.userName, {
          domain: 'localhost'
        })
      }
      if (this.userPasswordChecked) {
        this.$q.cookies.set('cookie_pw', this.userPassword, {
          domain: 'localhost'
        })
      }
      // this.user = this.userName
      // this.$router.push({name: 'monitor'})
      // this.typeClick = 'monitor'
      // this.page = ''
      // this.userPassword
      $.get('/api/checkUser/' + this.userName + '/' + this.userPassword, {}, (docs) => {
        if (docs.type !== true) {
          // alert(`response is not correct, err: ${docs.data}`)
          this.$q.notify({
            // only required parameter is the message:
            message: '帳號或密碼錯誤',
            timeout: 3000, // in milliseconds; 0 means no timeout
            type: 'warning',
            color: 'positive',
            textColor: 'black', // if default 'white' doesn't fit
            icon: 'wifi',
            avatar: 'statics/boy-avatar.png',
            detail: 'Optional detail message.',
            position: 'top-right', // 'top', 'left', 'bottom-left' etc.
            closeBtn: true
          })
        } else {
          if (docs.login === false) {
            // alert('帳號或密碼錯誤')
            this.$q.notify({
              // only required parameter is the message:
              message: '帳號或密碼錯誤',
              timeout: 3000, // in milliseconds; 0 means no timeout
              type: 'warning',
              color: 'positive',
              textColor: 'black', // if default 'white' doesn't fit
              icon: 'wifi',
              avatar: 'statics/boy-avatar.png',
              detail: 'Optional detail message.',
              position: 'top-right', // 'top', 'left', 'bottom-left' etc.
              closeBtn: true
            })
          } else if (docs.data.length === 0) {
            // alert('帳戶資料錯誤')
            this.$q.notify({
              // only required parameter is the message:
              message: '帳戶資料錯誤',
              timeout: 3000, // in milliseconds; 0 means no timeout
              type: 'warning',
              color: 'positive',
              textColor: 'black', // if default 'white' doesn't fit
              icon: 'wifi',
              avatar: 'statics/boy-avatar.png',
              detail: 'Optional detail message.',
              position: 'top-right', // 'top', 'left', 'bottom-left' etc.
              closeBtn: true
            })
          } else {
            if (this.userNameChecked) {
              this.$q.cookies.set('cookie_name', this.userName, {
                domain: 'localhost',
                secure: true
              })
            }
            // console.log(docs.data)
            this.availablePage = docs.data.detail
            this.availablePage.forEach(pg => {
              if ((this.reportDis.hasOwnProperty(pg.id)) && (pg.viewSetting === 2)) {
                this.reportDis[pg.id] = false
              } else if ((this.abnormalDis.hasOwnProperty(pg.id)) && (pg.viewSetting === 2)) {
                this.abnormalDis[pg.id] = false
              }
              if ((pg.viewSetting === 2) && (pg.id === 'shiftTable')) {
                this.shiftDisable = false
              }
              if ((pg.viewSetting === 2) && (pg.id === 'sysCommonSetting')) {
                this.sysConfigDisable = false
              }
              if ((pg.viewSetting === 2) && (pg.id === 'monitor')) {
                this.monitorDisable = false
              } else if ((pg.viewSetting === 2) && (pg.id === 'register')) {
                this.registerDisable = false
              }
            })
            this.page = ''
            this.user = docs.data.fullName
            this.loginSuccess = false
            this.typeClick = 'welcome'
            this.$router.push({name: 'welcome'})
          }
        }
      })
    },
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
        // this.showModal0 = true
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
      // this.showModal0 = false
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
      // console.log(this.depratObj)
      var zoneS = {}
      // 判斷選取的radio是否後面搭有子選單
      if (this.depratObj[this.radio1].length === 0) {
        zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1)
      } else {
        if (this.checked.indexOf(this.radio1) > -1) {
          zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1)
        } else {
          // zoneS[this.radio1] = this.checked
          // 子選單有多個被選取
          var checkedSonArr = []
          this.checked.forEach(elm => {
            checkedSonArr.splice(checkedSonArr.length, 0, this.recursiveConstructZoneS(this.orgArr, elm, -1))
          })
          Vue.set(zoneS, this.radio1, checkedSonArr)
          // zoneS = this.recursiveConstructZoneS(this.orgArr, this.checked[0], -1)
        }
      }
      /* if (this.depratObj[this.radio1].length === 0) {
        idx = this.orgArr.map(orgElm => {
          return orgElm._id
        }).indexOf(this.radio1)
        zoneS[this.radio1] = this.orgArr[idx].son
      } else {
        if (this.checked.indexOf(this.radio1) > -1) {
          idx = this.orgArr.map(orgElm => {
            return orgElm._id
          }).indexOf(this.radio1)
          zoneS[this.radio1] = this.orgArr[idx].son
        } else {
          zoneS[this.radio1] = this.checked
        }
      } */
      // console.log(zoneS)
      /* switch (this.radio1) {
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
      } */
      if (this.reportDis[this.selectedReport]) {
        return
      }
      var checkedToStr = this.checked.join()
      if (checkedToStr === '') {
        checkedToStr = '-'
      }
      // console.log(88888888)
      switch (this.selectedReport) {
        case 'Report':
          // this.$router.push('/DailyReport')
          /* if (this.reportDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            if (this.DailyReport) {
              this.$router.push({name: 'DailyReportProps', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr}})
              // console.log(this.selectedDate)
            } else if (this.IntegratedDailyReport) {
              // this.$router.push({name: 'IntegratedDailyReport', params: {selectedDate: this.selectedDate, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
              this.$router.push({name: 'IntegratedDailyReport', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr}})
              // console.log('IntegratedDailyReport')
            }
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'PeriodReportWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'PeriodReportTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'PeriodReportMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'PeriodReportQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'PeriodReportYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.$route.path)
          break
        case 'ProductionStatisticsTable':
          /* if (this.ProductionStatisticsTableDisable) {
            break
          } */
          // this.$router.push({path: '/DefectiveTable'})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'DefectiveTableDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'DefectiveTableWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'DefectiveTableTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'DefectiveTableMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'DefectiveTableQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'DefectiveTableYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else {
            this.$router.push({name: 'DefectiveTable1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'Curve':
          /* if (this.CurveDisable) {
            break
          } */
          // console.log('ABCDEFG!!!!!0')
          // console.log(this.reportProps)
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'DefectiveCurveDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'DefectiveCurveWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'DefectiveCurveTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'DefectiveCurveMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'DefectiveCurveQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'DefectiveCurveYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else {
            this.$router.push({name: 'DefectiveCurve1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          }
          // this.$router.push({name: 'DefectiveCurve', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), yearMonth: this.yearMonth, defectiveTableTimes: this.defectiveTableTimes, defectiveGroup: this.defectiveGroup}})
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'ProductReport':
          /* if (this.ProductReportDisable) {
            break
          } */
          // this.$router.push({name: 'ProductPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProductPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProductPeriodReportWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProductPeriodReportTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProductPeriodReportMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProductPeriodReportQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProductPeriodReportYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else {
            this.$router.push({name: 'ProductPeriodReport1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'MoldReport':
          /* if (this.MoldReportDisable) {
            break
          } */
          // this.$router.push({name: 'MoldPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'MoldPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'MoldPeriodReportWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'MoldPeriodReportTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'MoldPeriodReportMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'MoldPeriodReportQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'MoldPeriodReportYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else {
            this.$router.push({name: 'MoldPeriodReport1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'Utilization':
          // this.$router.push({name: 'Utilization', params: {period: this.reportProps}})
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'MOQ':
          /* if (this.MOQDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            // console.log('this.MOQAnalysisDaily')
            this.$router.push({name: 'MOQAnalysisDaily', params: {period: this.reportProps, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDateS: this.selectedDate}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'MOQAnalysisWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'MOQAnalysisTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'MOQAnalysisMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'MOQAnalysisQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'MOQAnalysisYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'MOQAnalysis1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'ProductProcessAnalysis':
          /* if (this.ProductProcessAnalysisDisable) {
            break
          } */
          // console.log(this.ProductArrSel)
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProcessAnalysisReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProcessAnalysisReportWeekly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProcessAnalysisReportTenDays', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProcessAnalysisReportMonthly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProcessAnalysisReportQuarterly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProcessAnalysisReportYearly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, Sel: this.ProductArrSel}})
          } else {
            this.$router.push({name: 'ProcessAnalysisReport1', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, Sel: this.ProductArrSel}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'MoldNumProcessAnalysis':
          /* if (this.MoldNumProcessAnalysisDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProcessAnalysisReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProcessAnalysisReportWeekly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProcessAnalysisReportTenDays', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProcessAnalysisReportMonthly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProcessAnalysisReportQuarterly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProcessAnalysisReportYearly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, Sel: this.MoldArrSel}})
          } else {
            this.$router.push({name: 'ProcessAnalysisReport1', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, Sel: this.MoldArrSel}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
      }
      this.$forceUpdate()
    },
    Enter1 () {
      this.$refs.basicModal1.hide()
      this.selectItem = '' // '生產報表'
      /* var zoneS = {}
      zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1) */
      var zoneS = {}
      // var idx
      // 判斷選取的radio是否後面搭有子選單
      if (this.depratObj[this.radio1].length === 0) {
        zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1)
      } else {
        if (this.checked.indexOf(this.radio1) > -1) {
          zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1)
        } else {
          // zoneS[this.radio1] = this.checked
          // 子選單有多個被選取
          var checkedSonArr = []
          this.checked.forEach(elm => {
            checkedSonArr.splice(checkedSonArr.length, 0, this.recursiveConstructZoneS(this.orgArr, elm, -1))
          })
          Vue.set(zoneS, this.radio1, checkedSonArr)
          // zoneS = this.recursiveConstructZoneS(this.orgArr, this.checked[0], -1)
        }
      }
      /* var idx
      if (this.depratObj[this.radio1].length === 0) {
        idx = this.orgArr.map(orgElm => {
          return orgElm._id
        }).indexOf(this.radio1)
        zoneS[this.radio1] = this.orgArr[idx].son
      } else {
        if (this.checked.indexOf(this.radio1) > -1) {
          idx = this.orgArr.map(orgElm => {
            return orgElm._id
          }).indexOf(this.radio1)
          zoneS[this.radio1] = this.orgArr[idx].son
        } else {
          zoneS[this.radio1] = this.checked
        }
      } */
      /* switch (this.radio1) {
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
      } */
      // console.log('egg')
      // console.log(this.selectedReport)
      // console.log('too bad')
      if (this.selectedReport === 'Utilization') {
        // console.log('Hello')
      } else {
        // console.log('else')
        // console.log(this.selectedReport)
      }
      if (this.reportDis[this.selectedReport]) {
        return
      }
      var checkedToStr = this.checked.join()
      if (checkedToStr === '') {
        checkedToStr = '-'
      }
      switch (this.selectedReport) {
        case 'Report':
          /* if (this.reportDisable) {
            break
          } */
          // this.$router.push('/DailyReport')
          if (this.reportProps === 'daily') {
            if (this.DailyReport) {
              this.$router.push({name: 'DailyReportProps', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr}})
              // console.log(this.selectedDate)
            } else if (this.IntegratedDailyReport) {
              // this.$router.push({name: 'IntegratedDailyReport', params: {selectedDate: this.selectedDate, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
              this.$router.push({name: 'IntegratedDailyReport', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr}})
            }
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'PeriodReportWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'PeriodReportTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'PeriodReportMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'PeriodReportQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'PeriodReportYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
          }
          this.page = ''
          // console.log(this.$route.path)
          break
        case 'ProductionStatisticsTable':
          /* if (this.ProductionStatisticsTableDisable) {
            break
          } */
          // this.$router.push({path: '/DefectiveTable'})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'DefectiveTableDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'DefectiveTableWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'DefectiveTableTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'DefectiveTableMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'DefectiveTableQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'DefectiveTableYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else {
            this.$router.push({name: 'DefectiveTable1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, defectiveGroup: this.productionStatisticsTotal, defectiveTableTimes: this.productionStatisticsSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'Curve':
          /* if (this.CurveDisable) {
            break
          } */
          // console.log('ABCDEFG!!!!!')
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'DefectiveCurveDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'DefectiveCurveWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'DefectiveCurveTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'DefectiveCurveMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'DefectiveCurveQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'DefectiveCurveYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          } else {
            this.$router.push({name: 'DefectiveCurve1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, defectiveGroup: this.curveTotal, defectiveTableTimes: this.curveSel, topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
          }
          // this.$router.push({name: 'DefectiveCurve', params: {period: this.reportProps}})
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'ProductReport':
          /* if (this.ProductReportDisable) {
            break
          } */
          // this.$router.push({name: 'ProductPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProductPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProductPeriodReportWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProductPeriodReportTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProductPeriodReportMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProductPeriodReportQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProductPeriodReportYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
          } else {
            this.$router.push({name: 'ProductPeriodReport1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, ProductReportFrom: this.ProductReportFrom, ProductReportTo: this.ProductReportTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'MoldReport':
          /* if (this.MoldReportDisable) {
            break
          } */
          // this.$router.push({name: 'MoldPeriodReport', params: {period: this.reportProps}})
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'MoldPeriodReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'MoldPeriodReportWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'MoldPeriodReportTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'MoldPeriodReportMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'MoldPeriodReportQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'MoldPeriodReportYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
          } else {
            this.$router.push({name: 'MoldPeriodReport1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, MoldReportFrom: this.MoldReportFrom, MoldReportTo: this.MoldReportTo}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'Utilization':
          /* if (this.reportDis['Utilization']) {
            break
          } */
          // console.log('1')
          /* if (this.reportProps !== 'daily') {
            this.$router.push({name: 'Utilization', params: {period: this.reportProps}})
          } */
          // console.log(this.selectedReport)
          // console.log(this.reportProps)
          // console.log('this.reportProps')
          if (this.reportProps === 'daily') {
            // console.log('this.UtilizationDaily')
            this.$router.push({name: 'UtilizationDaily', params: {period: this.reportProps, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDateS: this.selectedDate}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'UtilizationWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'UtilizationTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'UtilizationMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'UtilizationQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'UtilizationYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'Utilization1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
          }
          this.page = ''
          break
        case 'MOQ':
          /* if (this.MOQDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            // console.log('this.MOQAnalysisDaily')
            this.$router.push({name: 'MOQAnalysisDaily', params: {period: this.reportProps, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDateS: this.selectedDate}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'MOQAnalysisWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'MOQAnalysisTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'MOQAnalysisMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'MOQAnalysisQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'MOQAnalysisYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
          } else {
            this.$router.push({name: 'MOQAnalysis1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'ProductProcessAnalysis':
          /* if (this.ProductProcessAnalysisDisable) {
            break
          } */
          // console.log(this.ProductArrSel)
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProcessAnalysisReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProcessAnalysisReportWeekly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProcessAnalysisReportTenDays', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProcessAnalysisReportMonthly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProcessAnalysisReportQuarterly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, Sel: this.ProductArrSel}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProcessAnalysisReportYearly', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, Sel: this.ProductArrSel}})
          } else {
            this.$router.push({name: 'ProcessAnalysisReport1', params: {reportType: 'productAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, Sel: this.ProductArrSel}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'MoldNumProcessAnalysis':
          /* if (this.MoldNumProcessAnalysisDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            this.$router.push({name: 'ProcessAnalysisReportDaily', params: {selectedDateS: this.selectedDate, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'ProcessAnalysisReportWeekly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'ProcessAnalysisReportTenDays', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'ProcessAnalysisReportMonthly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'ProcessAnalysisReportQuarterly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, Sel: this.MoldArrSel}})
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'ProcessAnalysisReportYearly', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, Sel: this.MoldArrSel}})
          } else {
            this.$router.push({name: 'ProcessAnalysisReport1', params: {reportType: 'MoldNumAnalysis', period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, Sel: this.MoldArrSel}})
            // this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zone: this.checked}})
          }
          this.page = ''
          // console.log(this.selectedReport)
          break
        case 'Table':
          this.getStatus(this.$router.push('/WeeklyReport')) // ({name: 'test', params: {period: 'weekly'}}))
          this.page = ''
          // console.log(this.selectedReport)
          break
        default:
          this.page = ''
          // console.log('nock')
          break
      }
    },
    EnterAlm () {
      this.$refs.basicModalAlm.hide()
      this.selectItem = '' // '生產報表'
      // console.log('egg')
      // console.log(this.selectedAlmReport)
      // zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1)
      var zoneS = {}
      // var idx
      // 判斷選取的radio是否後面搭有子選單
      if (this.depratObj[this.radio1].length === 0) {
        zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1)
      } else {
        if (this.checked.indexOf(this.radio1) > -1) {
          zoneS = this.recursiveConstructZoneS(this.orgArr, this.radio1, -1)
        } else {
          // zoneS[this.radio1] = this.checked
          // 子選單有多個被選取
          var checkedSonArr = []
          this.checked.forEach(elm => {
            checkedSonArr.splice(checkedSonArr.length, 0, this.recursiveConstructZoneS(this.orgArr, elm, -1))
          })
          Vue.set(zoneS, this.radio1, checkedSonArr)
          // zoneS = this.recursiveConstructZoneS(this.orgArr, this.checked[0], -1)
        }
      }
      /* var idx
      if (this.depratObj[this.radio1].length === 0) {
        idx = this.orgArr.map(orgElm => {
          return orgElm._id
        }).indexOf(this.radio1)
        zoneS[this.radio1] = this.orgArr[idx].son
      } else {
        if (this.checked.indexOf(this.radio1) > -1) {
          idx = this.orgArr.map(orgElm => {
            return orgElm._id
          }).indexOf(this.radio1)
          zoneS[this.radio1] = this.orgArr[idx].son
        } else {
          zoneS[this.radio1] = this.checked
        }
      } */
      /* switch (this.radio1) {6
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
      } */
      if (this.abnormalDis[this.selectedAlmReport]) {
        return
      }
      var checkedToStr = this.checked.join()
      if (checkedToStr === '') {
        checkedToStr = '-'
      }
      switch (this.selectedAlmReport) {
        case 'AbnormalTable':
          /* if (this.AbnormalTableDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            // console.log('this.AbnormalTableDaily')
            this.$router.push({name: 'AbnormalTableDaily', params: {period: this.reportProps, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDateS: this.selectedDate, abnormaleTableTimes: this.abnormaleTableTimes}})
            this.page = ''
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'AbnormalTableWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, abnormaleTableTimes: this.abnormaleTableTimes}})
            this.page = ''
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'AbnormalTableTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, abnormaleTableTimes: this.abnormaleTableTimes}})
            this.page = ''
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'AbnormalTableMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, abnormaleTableTimes: this.abnormaleTableTimes}})
            this.page = ''
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'AbnormalTableQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, abnormaleTableTimes: this.abnormaleTableTimes}})
            this.page = ''
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'AbnormalTableYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, abnormaleTableTimes: this.abnormaleTableTimes}})
            this.page = ''
          } else {
            this.$router.push({name: 'AbnormalTable1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, abnormaleTableTimes: this.abnormaleTableTimes}})
            this.page = ''
          }
          this.page = ''
          // console.log('AbnormalTable')
          break
        case 'AbnormalPie':
          /* if (this.AbnormalPieDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            // console.log('this.AbnormalPieDaily')
            this.$router.push({name: 'AbnormalPieDaily', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDateS: this.selectedDate, group: this.abnormalePieGroup, orgArr: Object.assign({}, this.orgArr), topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
            this.page = ''
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'AbnormalPieWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek, group: this.abnormalePieGroup, orgArr: Object.assign({}, this.orgArr), topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
            this.page = ''
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'AbnormalPieTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays, group: this.abnormalePieGroup, orgArr: Object.assign({}, this.orgArr), topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
            this.page = ''
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'AbnormalPieMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth, group: this.abnormalePieGroup, orgArr: Object.assign({}, this.orgArr), topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
            this.page = ''
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'AbnormalPieQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter, group: this.abnormalePieGroup, orgArr: Object.assign({}, this.orgArr), topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
            this.page = ''
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'AbnormalPieYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo, group: this.abnormalePieGroup, orgArr: Object.assign({}, this.orgArr), topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
            this.page = ''
          } else {
            this.$router.push({name: 'AbnormalPie1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo, group: this.abnormalePieGroup, orgArr: Object.assign({}, this.orgArr), topName: (this.checked.length <= 0) ? this.radio1 : this.checked[0]}})
            this.page = ''
          }
          this.page = ''
          // console.log('AbnormalPie')
          break
        case 'Abnormal':
          /* if (this.AbnormalDisable) {
            break
          } */
          if (this.reportProps === 'daily') {
            // console.log('this.AbnormalReportDaily')
            this.$router.push({name: 'AbnormalReportDaily', params: {period: this.reportProps, departmentS: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDateS: this.selectedDate}})
            this.page = ''
          } else if (this.reportProps === 'weekly') {
            this.$router.push({name: 'AbnormalReportWeekly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearWeekly: this.selectedYearWeekly, selectedWeek: this.selectedWeek}})
            this.page = ''
          } else if (this.reportProps === 'tenDays') {
            this.$router.push({name: 'AbnormalReportTenDays', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonthTenDays: this.yearMonthTenDays, selectedTenDays: this.selectedTenDays}})
            this.page = ''
          } else if (this.reportProps === 'monthly') {
            this.$router.push({name: 'AbnormalReportMonthly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, yearMonth: this.yearMonth}})
            this.page = ''
          } else if (this.reportProps === 'quarterly') {
            this.$router.push({name: 'AbnormalReportQuarterly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYearQuarter: this.selectedYearQuarter, selectedQuarter: this.selectedQuarter}})
            this.page = ''
          } else if (this.reportProps === 'yearly') {
            this.$router.push({name: 'AbnormalReportYearly', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedYear: this.selectedYear, selectedYearTo: this.selectedYearTo}})
            this.page = ''
          } else {
            this.$router.push({name: 'AbnormalReport1', params: {period: this.reportProps, department: (zoneS.hasOwnProperty(this.radio1) ? this.radio1 : this.checked[0]), zoneS: zoneS, checked: checkedToStr, selectedDatePeriod: this.selectedDatePeriod, selectedDatePeriodTo: this.selectedDatePeriodTo}})
            this.page = ''
          }
          this.page = ''
          // console.log('Abnormal')
          break
      }
    },
    sysConfigSelectedFunc (val) {
      // console.log(this.subTypeClick)
      // console.log(this.sysConfigSelectedItem)
      // console.log(val)
      // console.log('sysConfigSelectedFunc')
      this.$router.push({name: val})
      this.page = ''
    },
    Logout () {
      this.$router.push({name: 'home'})
      this.page = 'home'
      this.monitorDisable = true
      this.registerDisable = true
      this.sysConfigDisable = true
      this.shiftDisable = true
      this.reportDisable = true
      this.ProductionStatisticsTableDisable = true
      this.CurveDisable = true
      this.ProductReportDisable = true
      this.MoldReportDisable = true
      this.ProductProcessAnalysisDisable = true
      this.MoldNumProcessAnalysisDisable = true
      this.MOQDisable = true
      this.UtilizationDisable = true
      this.AbnormalTableDisable = true
      this.AbnormalPieDisable = true
      this.AbnormalDisable = true
      var reportDisKeys = Object.keys(this.reportDis)
      reportDisKeys.forEach(reportDisKey => {
        this.reportDis[reportDisKey] = true
      })
      var abnormalDisKeys = Object.keys(this.abnormalDis)
      abnormalDisKeys.forEach(abnormalDisKey => {
        this.abnormalDis[abnormalDisKey] = true
      })
      // this.$forceUpdate()
    }
  }
}

function getMoldArr (MoldArr) {
  // // console.log([departmentID, from, to])
  // init the records in the rows
  MoldArr.splice(0, MoldArr.length)
  MoldArr.length = 0
  var records
  $.get('/api/getMoldArr/', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      records = results.data
      /* records.sort(function (a, b) {
        return a._id > b._id ? 1 : -1
      }) */
      // console.log('mold array')
      // console.log(records)
      for (var record in records) {
        var option = {}
        option = {
          label: (records[record]), // ['_id'],
          value: (records[record]) // ['_id']
        }
        MoldArr.splice(MoldArr.length, 0, option)
      }
    }
  })
}
function getProductArr (ProductArr) {
  // // console.log([departmentID, from, to])
  // init the records in the rows
  ProductArr.splice(0, ProductArr.length)
  ProductArr.length = 0
  var records
  $.get('/api/getProductArr/', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      records = results.data
      /* records.sort(function (a, b) {
        return a._id > b._id ? 1 : -1
      }) */
      // console.log(records)
      for (var record in records) {
        // if ((records[record])['_id'].indexOf('-') !== -1) {
        var option = {}
        option = {
          label: (records[record]), // ['貨品編號'],
          value: (records[record]) // ['貨品編號']
        }
        ProductArr.splice(ProductArr.length, 0, option)
        // }
      }
    }
  })
}
/* function getDepartObj (depratObj, tgt, retArr) {
  $.get('/api/getDepartObj/', {}, (results) => {
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else if (results.data.length === 0) {
      alert('沒有機台資料')
    } else {
      var depratObjKeys = Object.keys(results.data)
      depratObjKeys.forEach(depratObjKey => {
        // {'全廠': [], '成型一課': ['全課', '1A', '1B', '1C'], '成型二課': ['全課', '2A', '2B', '2C']}
        var arr = []
        results.data[depratObjKey].forEach(elm => {
          var obj = {}
          if (elm === '全課') {
            obj['key'] = depratObjKey
            obj['value'] = elm
          } else {
            obj['key'] = elm
            obj['value'] = elm
          }
          arr.splice(arr.length, 0, obj)
        })
        Vue.set(depratObj, depratObjKey, arr)
      })
      // console.log('getDepartObj')
      // console.log(depratObj)
    }
  })
} */
function getDepartObj (depratObj, tgt, retArr) {
  $.get('/api/getDepartObjAll/', {}, (results) => { // 20190530 若有問題就分開
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
      // retArr = results.data
      // --------------------------------
      results.data.forEach(elm => {
        if (elm.level > 3) {
          Vue.set(depratObj, elm._id, [])
        } else if (elm.level > 2) {
          var arr = []
          var obj = {}
          if (arr.length === 0) {
            obj['key'] = elm._id
            obj['value'] = '全' + elm.levelName
            arr.splice(arr.length, 0, obj)
          }
          elm.son.forEach(son => {
            var obj1 = {}
            if (arr.length > 0) {
              obj1['key'] = son
              obj1['value'] = son
            }
            arr.splice(arr.length, 0, obj1)
          })
          Vue.set(depratObj, elm._id, arr)
        }
      })
      // console.log('getDepartObj')
      // console.log(depratObj)
    }
  })
}
function getAbnormalDetailAll (retArr) {
  $.get('/api/getNoteSelectedItem', {}, (results) => { // 直接回傳Object
    if (results.type !== true) {
      alert(`response is not correct, err: ${results.data}`)
    } else {
      var objKeys = Object.keys(results.data)
      retArr.splice(0, retArr.length)
      /* Object.keys(retObj).forEach(key => {
        Vue.delete(retObj, key)
      }) */
      if (objKeys.length > 0) {
        objKeys.forEach(abnormal => {
          var value = results.data[abnormal]
          if ((value.indexOf('故障') > -1) || (value.indexOf('異常') > -1)) {
            retArr.splice(retArr, 0, {id: abnormal, value: value, selected: false})
          }
        })
        retArr.sort((a, b) => {
          return a.id > b.id ? 1 : -1
        })
      }
    }
  })
}
/* function recursiveConstructZoneS (level, key, srcLevel) {
  var idx = level.map(orgElm => {
    return orgElm._id
  }).indexOf(key)
  if (idx < 0) {
    return {}
  } else if (level[idx].level === 1) {
    return {}
  } else if (level[idx].level === srcLevel) { // 正常結構為每次呼叫階層會改變，此部分是避免資料庫異常導致無窮迴圈
    return {}
  } else {
    var retArr = []
    var retObj = {}
    level[idx].son.forEach(elm => {
      var obj = {}
      obj = recursiveConstructZoneS(level, elm, level[idx].level)
      if (obj.hasOwnProperty(elm)) {
        retArr.splice(retArr.length, 0, obj)
      } else {
        retArr.splice(retArr.length, 0, elm)
      }
    })
    retObj[key] = retArr
    return retObj
  }
} */
</script>
<style lang="stylus">
  h4{
     font-family: Microsoft JhengHei;
     font-size:180%;
     font-weight:600;
    }
  h5{
     font-family: Microsoft JhengHei;
     font-size:100%;
     font-weight:300;
    }
  h1{
     font-family: Microsoft JhengHei;
     font-size:150%;
     font-weight:600;
    }
   span{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
    }
  .q-btn{
     font-family: Microsoft JhengHei;
     font-size:120%;
     font-weight:bold;
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
  .input-home
  {
     text-color:#FFFFFF;
     font-family: Microsoft JhengHei;
     font-size:150%;
     font-weight:bold;
    }
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
.icon-svg2:before{
  content : url("../assets/small32/102-253-938.png");
}
.icon-svg3:before{
  content : url("../assets/small32/Accounts.png");
}
.icon-svg6:before{
  content : url("../assets/small32/Check-mark.png");
}
.icon-svg7:before{
  content : url("../assets/small32/clock.png");
}
.icon-svg11:before{
  content : url("../assets/small32/file.png");
}
.icon-svg13:before{
  content : url("../assets/small32/gear.png");
}
.icon-svg14:before{
  content : url("../assets/small32/HDD1.png");
}
.icon-svg22:before{
  content : url("../assets/small32/Question-Mark.png");
}
.icon-svg24:before{
  content : url("../assets/small32/Train.png");
}
.icon-svg25:before{
  content : url("../assets/small32/Error.png");
}
.icon-svg26:before{
  content : url("../assets/small32/cb3iv-9l627.png");
}
.icon-svg27:before{
  content : url("../assets/small32/cbexx-bko7j.png");
}
.icon-svg28:before{
  content : url("../assets/small32/cbggp-n12pn.png");
}
.icon-svg29:before{
  content : url("../assets/small32/cbunh-4jyjp.png");
}
.icon-svg30:before{
  content : url("../assets/small32/Tree.png");
}
</style>
