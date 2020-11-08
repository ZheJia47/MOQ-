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
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          龍達塑膠成型機生產管理系統
          <span slot="subtitle">Version 3.1</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-item :to="{ name: 'test', params: {period: 'Lolita'} }">
          <q-item-side class="fa fa-eye" />
          <q-item-main label="test" />
        </q-item>
        <q-item item to="/monitor">
          <q-item-side class="fa fa-eye" />
          <q-item-main label="機台監控" />
        </q-item>
        <q-item item to="/RegisterProps">
          <q-item-side class="fa fa-pencil" />
          <q-item-main label="資料登錄" />
        </q-item>
        <q-item
          link
          v-for="dialog in types"
          :key="dialog.label"
          @click.native="openModal()"
          v-ripple.mat
        >
          <q-item-side :icon="dialog.icon" />
          <q-item-main :label="dialog.label" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
        <q-collapsible label="生產報表">
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
          <!--<q-item to="/WeeklyReport">-->
          <q-item v-for="(value, key) in productionReport" v-bind:key="key" :to="{ name: 'PeriodReport', params: {period: key} }">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>
        </q-collapsible>
        <q-collapsible label="生產報表">
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
        <q-collapsible label="成品料號-生產報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
            <q-item :to="{name: 'ProductPeriodReport', params: {period: key}}">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>
          </div>
        </q-collapsible>
        <q-collapsible label="模具編號-生產報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
            <q-item :to="{name: 'MoldPeriodReport', params: {period: key}}">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>
          </div>
        </q-collapsible>
        <q-collapsible label="稼動報表">
          <div v-for="(value, key) in productionReport" v-bind:key="key">
            <q-item :to="{name: 'Utilization', params: {period: key}}">
            <q-item-side class="fa fa-table" />
            <q-item-main :label="value" />
          </q-item>
          </div>
        </q-collapsible>
        <q-item item to="/ShiftTable1">
          <q-item-side class="fa fa-pencil" />
          <q-item-main label="班表" />
        </q-item>
        <q-item item to="/Register">
          <q-item-side class="fa fa-pencil" />
          <q-item-main label="資料登錄" />
        </q-item>
        <q-item :to="{ name: 'ProductionStatisticsTable' }">
          <!--<q-item to="/MonthlyReport">-->
            <q-item-side class="fa fa-table" />
            <q-item-main label="生產管理項目統計表" />
          </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-modal ref="basicModal" :content-css="{padding: '300px', maxWidth: '100%'}">
    <q-modal-layout
    header-style="min-height: 100px"
    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
    footer-class="bg-primary some-class"
    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
  >
    <q-list highlight>
      <q-list-header>請選擇報表類別</q-list-header>
      <q-item v-for="(report, key) in reportArr" v-bind:key="key">
        <q-radio   v-model="selectedReport" :val="report" :label="key" @focus="showSel()"/>
        <q-checkbox v-if="report==='Report'" v-model="DailyReport" label="明細" @focus="focusDailyReport()"/>
        <q-checkbox v-if="report==='Report'" v-model="IntegratedDailyReport" label="整合" @focus="focusIntegratedDailyReport()"/>
      </q-item>
    </q-list>
    <p class="caption">成型單位選擇</p>
    <q-list highlight>
      <q-list-header>成型單位選擇</q-list-header>
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
      <q-item-separator />
    </q-list>
      <q-item-separator />
    <q-list highlight>
    <!--<q-list-header>請選擇報表時間</q-list-header>
        <p class="caption">請選擇報表時間</p>-->
        <q-collapsible 請選擇報表時間>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="daily" label="日" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDate" />
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
    </q-collapsible>
    <q-item>
      <q-item-main>
      <q-radio  v-model="reportProps" val="period" label="期間" />
      &nbsp;&nbsp;
      <input type="date" v-model="selectedDatePeriod" />
      &nbsp; - &nbsp;
      <input type="date" v-model="selectedDatePeriodTo" />
    </q-item-main >
    </q-item>
    </q-list>
    {{radioSel}}
    <q-btn color="primary" @click="Enter()">確定</q-btn>
    <q-btn color="primary" @click="closeModal()">關閉</q-btn>
    </q-modal-layout>
  </q-modal>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import moment from 'moment'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      IntegratedDailyReport: true,
      DailyReport: false,
      leftDrawerOpen: this.$q.platform.is.desktop,
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
      selectedReport: 'Report',
      reportArr: {
        'A.生產報表': 'Report',
        'B1.平均不良率': 'ProductionStatisticsTable',
        'B2.平均不良率': 'Curve',
        'C.成品料號生產統計表': 'ProductReport',
        'D.模具編號生產統計表': 'MoldReport',
        'E.成品料號製程分析': 'Table',
        'F.模具編號製程分析': 'Table',
        'G.生產未達MOQ統計表': 'MOQ'
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
          label: '生產報表',
          ref: 'basicModal'
        }
      ],
      productionReport: {
        'weekly': '週',
        'tenDays': '旬',
        'monthly': '月',
        'quarterly': '季',
        'yearly': '年',
        'period': '自訂期間'
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
      console.log(this.selectedTenDays)
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
      console.log(this.IntegratedDailyReport)
      console.log(this.DailyReport)
    },
    focusDailyReport () {
      this.IntegratedDailyReport = false
      console.log(this.IntegratedDailyReport)
      console.log(this.DailyReport)
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
      console.log('LLK~')
      this.$nextTick(() => {
        this.$refs.basicModal.show()
      })
    },
    closeModal () {
      console.log(this.checked)
      console.log(this.radio1)
      this.$refs.basicModal.hide()
    },
    blurDepart1 () {
      // this.checked = ['1A']
    },
    showSel () {
      console.log(this.selectedReport)
    },
    Enter () {
      this.$refs.basicModal.hide()
      console.log('egg')
      console.log(this.selectedReport)
      switch (this.selectedReport) {
        case 'Report':
          // this.$router.push('/DailyReport')
          if (this.reportProps === 'daily') {
            if (this.DailyReport) {
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
              this.$router.push({name: 'DailyReportProps', params: {selectedDateS: this.selectedDate, departmentS: this.radio1, zoneS: zoneS}})
              console.log(this.selectedDate)
            } else if (this.IntegratedDailyReport) {
              this.$router.push({name: 'IntegratedDailyReport', params: {selectedDate: this.selectedDate, department: this.radio1, zone: this.checked}})
            }
          } else {
            this.$router.push({name: 'PeriodReport', params: {period: this.reportProps, department: this.radio1, zone: this.checked}})
          }
          console.log(this.$route.path)
          break
        case 'ProductionStatisticsTable':
          this.$router.push({path: '/DefectiveTable'})
          console.log(this.selectedReport)
          break
        case 'Curve':
          this.$router.push({name: 'PeriodReport', params: {period: this.reportProps}})
          console.log(this.selectedReport)
          break
        case 'ProductReport':
          this.$router.push({name: 'ProductPeriodReport', params: {period: this.reportProps}})
          console.log(this.selectedReport)
          break
        case 'MoldReport':
          this.$router.push({name: 'MoldPeriodReport', params: {period: this.reportProps}})
          console.log(this.selectedReport)
          break
        case 'Utilization':
          this.$router.push({name: 'Utilization', params: {period: this.reportProps}})
          console.log(this.selectedReport)
          break
        case 'MOQ':
          console.log(this.selectedReport)
          break
        case 'Table':
          this.getStatus(this.$router.push('/WeeklyReport')) // ({name: 'test', params: {period: 'weekly'}}))
          console.log(this.selectedReport)
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
