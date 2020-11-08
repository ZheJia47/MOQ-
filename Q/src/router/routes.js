
// export default [
const routes = [
  {
    path: '/',
    component: () => import('layouts/default1'),
    name: 'home',
    children: [
      // { path: '', component: () => import('pages/index') }
      { path: '/RegisterCompare', component: () => import('components/RegisterCompare'), name: 'RegisterCompare', props: true, meta: {keepAlive: false} },
      { path: '/RegisterCompareAlm', component: () => import('components/RegisterCompareAlm'), name: 'RegisterCompareAlm', props: true, meta: {keepAlive: false} },
      { path: '/welcome', component: () => import('components/welcome'), name: 'welcome', props: true },
      { path: '/test/:period', component: () => import('components/test'), name: 'test', props: true, meta: {keepAlive: false} },
      { path: '/monitor', component: () => import('components/monitor'), name: 'monitor', props: true, meta: {keepAlive: false} },
      { path: '/RegisterProps/:user', component: () => import('components/RegisterProps'), name: 'register', props: true, meta: {keepAlive: false} },
      { path: '/RegisterAlarmProps', component: () => import('components/RegisterAlarmProps'), name: 'registerAlarm', props: true, meta: {keepAlive: false} },
      { path: '/RegisterPropsNew', component: () => import('components/RegisterPropsNew'), name: 'registerNew', props: true, meta: {keepAlive: false} },
      { path: '/RegisterWithAlarmProps', component: () => import('components/RAProps'), name: 'registerWithAlarm', props: true, meta: {keepAlive: false} },
      { path: '/DailyReportProps/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/DailyReportProps'), props: true, name: 'DailyReportProps', meta: {keepAlive: false} },
      { path: '/IntegratedDailyReport/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/IntegratedDailyReport'), props: true, name: 'IntegratedDailyReport', meta: {keepAlive: false} },
      // { path: '/PeriodReport/:period', component: () => import('components/IntegratedPeriodlyReportProps'), props: true, name: 'PeriodReportD', meta: {keepAlive: false} },
      // { path: '/ProductPeriodReport/:period', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReport', meta: {keepAlive: false} },
      // { path: '/MoldPeriodReport/:period', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReport', meta: {keepAlive: false} },
      // { path: '/PeriodUtilization/:period', component: () => import('components/UtilizationProps'), props: true, name: 'Utilization', meta: {keepAlive: false} },
      { path: '/ShiftTable/:zoneS/:organ', component: () => import('components/ShiftTable2'), name: 'ShiftTable', props: true, meta: {keepAlive: false} },
      { path: '/ProductionStatisticsTable', component: () => import('components/ProductionStatisticsTable'), props: true, name: 'ProductionStatisticsTable' },
      { path: '/DefectiveTable', component: () => import('components/DefectiveTable'), props: true, name: 'DefectiveTable', meta: {keepAlive: false} },
      { path: '/DefectiveCurve/:period/:department/:zoneS/:departmentS/:yearMonth/:defectiveTableTimes/:defectiveGroup', component: () => import('components/CurveProps'), props: true, name: 'DefectiveCurve', meta: {keepAlive: false} },

      { path: '/sysConfig/sysCommonSetting', component: () => import('components/sysCommonSetting'), props: true, name: 'sysCommonSetting', meta: {keepAlive: false} },
      { path: '/sysConfig/prodDepartSetting', component: () => import('components/prodDepartSetting1'), props: true, name: 'prodDepartSetting', meta: {keepAlive: false} },
      { path: '/sysConfig/shiftTimeConfig', component: () => import('components/shiftTimeConfig'), props: true, name: 'shiftTimeConfig', meta: {keepAlive: false} },
      { path: '/sysConfig/noteConfigSetting', component: () => import('components/noteConfigSetting'), props: true, name: 'noteConfigSetting', meta: {keepAlive: false} },
      { path: '/sysConfig/timeFormatSetting', component: () => import('components/timeFormatSetting'), props: true, name: 'timeFormatSetting', meta: {keepAlive: false} },
      { path: '/sysConfig/permissionSetting', component: () => import('components/permissionSetting'), props: true, name: 'permissionSetting', meta: {keepAlive: false} },
      { path: '/sysConfig/backup', component: () => import('components/backup'), props: true, name: 'backup', meta: {keepAlive: false} },

      { path: '/PeriodReport/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/IntegratedPeriodlyReportProps'), props: true, name: 'PeriodReportWeekly', meta: {keepAlive: false} },
      { path: '/PeriodReport/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/IntegratedPeriodlyReportProps'), props: true, name: 'PeriodReportTenDays', meta: {keepAlive: false} },
      { path: '/PeriodReport/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/IntegratedPeriodlyReportProps'), props: true, name: 'PeriodReportMonthly', meta: {keepAlive: false} },
      { path: '/PeriodReport/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/IntegratedPeriodlyReportProps'), props: true, name: 'PeriodReportQuarterly', meta: {keepAlive: false} },
      { path: '/PeriodReport/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/IntegratedPeriodlyReportProps'), props: true, name: 'PeriodReportYearly', meta: {keepAlive: false} },
      { path: '/PeriodReport/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/IntegratedPeriodlyReportProps'), props: true, name: 'PeriodReport', meta: {keepAlive: false} },

      { path: '/PeriodUtilization/:period/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/UtilizationProps'), props: true, name: 'UtilizationDaily', meta: {keepAlive: false} },
      { path: '/PeriodUtilization/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/UtilizationProps'), props: true, name: 'UtilizationWeekly', meta: {keepAlive: false} },
      { path: '/PeriodUtilization/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/UtilizationProps'), props: true, name: 'UtilizationTenDays', meta: {keepAlive: false} },
      { path: '/PeriodUtilization/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/UtilizationProps'), props: true, name: 'UtilizationMonthly', meta: {keepAlive: false} },
      { path: '/PeriodUtilization/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/UtilizationProps'), props: true, name: 'UtilizationQuarterly', meta: {keepAlive: false} },
      { path: '/PeriodUtilization/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/UtilizationProps'), props: true, name: 'UtilizationYearly', meta: {keepAlive: false} },
      { path: '/PeriodUtilization/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/UtilizationProps'), props: true, name: 'Utilization1', meta: {keepAlive: false} },

      { path: '/ProductPeriodReport/:ProductReportFrom/:ProductReportTo/:period/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReportDaily', meta: {keepAlive: false} },
      { path: '/ProductPeriodReport/:ProductReportFrom/:ProductReportTo/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReportWeekly', meta: {keepAlive: false} },
      { path: '/ProductPeriodReport/:ProductReportFrom/:ProductReportTo/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReportTenDays', meta: {keepAlive: false} },
      { path: '/ProductPeriodReport/:ProductReportFrom/:ProductReportTo/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReportMonthly', meta: {keepAlive: false} },
      { path: '/ProductPeriodReport/:ProductReportFrom/:ProductReportTo/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReportQuarterly', meta: {keepAlive: false} },
      { path: '/ProductPeriodReport/:ProductReportFrom/:ProductReportTo/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReportYearly', meta: {keepAlive: false} },
      { path: '/ProductPeriodReport/:ProductReportFrom/:ProductReportTo/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/ProductPeriodReportProps'), props: true, name: 'ProductPeriodReport1', meta: {keepAlive: false} },

      { path: '/MoldPeriodReport/:MoldReportFrom/:MoldReportTo/:period/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReportDaily', meta: {keepAlive: false} },
      { path: '/MoldPeriodReport/:MoldReportFrom/:MoldReportTo/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReportWeekly', meta: {keepAlive: false} },
      { path: '/MoldPeriodReport/:MoldReportFrom/:MoldReportTo/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReportTenDays', meta: {keepAlive: false} },
      { path: '/MoldPeriodReport/:MoldReportFrom/:MoldReportTo/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReportMonthly', meta: {keepAlive: false} },
      { path: '/MoldPeriodReport/:MoldReportFrom/:MoldReportTo/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReportQuarterly', meta: {keepAlive: false} },
      { path: '/MoldPeriodReport/:MoldReportFrom/:MoldReportTo/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReportYearly', meta: {keepAlive: false} },
      { path: '/MoldPeriodReport/:MoldReportFrom/:MoldReportTo/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/MoldPeriodReportProps'), props: true, name: 'MoldPeriodReport1', meta: {keepAlive: false} },

      { path: '/ProcessAnalysis/:reportType/:Sel/:period/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/ProcessAnalysis'), props: true, name: 'ProcessAnalysisReportDaily', meta: {keepAlive: false} },
      { path: '/ProcessAnalysis/:reportType/:Sel/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/ProcessAnalysis'), props: true, name: 'ProcessAnalysisReportWeekly', meta: {keepAlive: false} },
      { path: '/ProcessAnalysis/:reportType/:Sel/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/ProcessAnalysis'), props: true, name: 'ProcessAnalysisReportTenDays', meta: {keepAlive: false} },
      { path: '/ProcessAnalysis/:reportType/:Sel/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/ProcessAnalysis'), props: true, name: 'ProcessAnalysisReportMonthly', meta: {keepAlive: false} },
      { path: '/ProcessAnalysis/:reportType/:Sel/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/ProcessAnalysis'), props: true, name: 'ProcessAnalysisReportQuarterly', meta: {keepAlive: false} },
      { path: '/ProcessAnalysis/:reportType/:Sel/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/ProcessAnalysis'), props: true, name: 'ProcessAnalysisReportYearly', meta: {keepAlive: false} },
      { path: '/ProcessAnalysis/:reportType/:Sel/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/ProcessAnalysis'), props: true, name: 'ProcessAnalysisReport1', meta: {keepAlive: false} },

      { path: '/AbnormalReport/:period/:department/:zoneS/:selectedDateS/:checked', component: () => import('components/Abnormal'), props: true, name: 'AbnormalReportDaily', meta: {keepAlive: false} },
      { path: '/AbnormalReport/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/Abnormal'), props: true, name: 'AbnormalReportWeekly', meta: {keepAlive: false} },
      { path: '/AbnormalReport/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/Abnormal'), props: true, name: 'AbnormalReportTenDays', meta: {keepAlive: false} },
      { path: '/AbnormalReport/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/Abnormal'), props: true, name: 'AbnormalReportMonthly', meta: {keepAlive: false} },
      { path: '/AbnormalReport/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/Abnormal'), props: true, name: 'AbnormalReportQuarterly', meta: {keepAlive: false} },
      { path: '/AbnormalReport/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/Abnormal'), props: true, name: 'AbnormalReportYearly', meta: {keepAlive: false} },
      { path: '/AbnormalReport/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/Abnormal'), props: true, name: 'AbnormalReport1', meta: {keepAlive: false} },

      { path: '/AbnormalTable/:period/:department/:zoneS/:selectedDateS/:abnormaleTableTimes/:checked', component: () => import('components/AbnormalTable1'), props: true, name: 'AbnormalTableDaily', meta: {keepAlive: false} },
      { path: '/AbnormalTable/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:abnormaleTableTimes/:checked', component: () => import('components/AbnormalTable1'), props: true, name: 'AbnormalTableWeekly', meta: {keepAlive: false} },
      { path: '/AbnormalTable/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:abnormaleTableTimes/:checked', component: () => import('components/AbnormalTable1'), props: true, name: 'AbnormalTableTenDays', meta: {keepAlive: false} },
      { path: '/AbnormalTable/:period/:department/:zoneS/:yearMonth/:abnormaleTableTimes/:checked', component: () => import('components/AbnormalTable1'), props: true, name: 'AbnormalTableMonthly', meta: {keepAlive: false} },
      { path: '/AbnormalTable/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:abnormaleTableTimes/:checked', component: () => import('components/AbnormalTable1'), props: true, name: 'AbnormalTableQuarterly', meta: {keepAlive: false} },
      { path: '/AbnormalTable/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:abnormaleTableTimes/:checked', component: () => import('components/AbnormalTable1'), props: true, name: 'AbnormalTableYearly', meta: {keepAlive: false} },
      { path: '/AbnormalTable/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:abnormaleTableTimes/:checked', component: () => import('components/AbnormalTable1'), props: true, name: 'AbnormalTable1', meta: {keepAlive: false} },

      { path: '/AbnormalPie/:period/:department/:zoneS/:selectedDateS/:checked/:group/:orgArr/:topName', component: () => import('components/AbnormalPie1'), props: true, name: 'AbnormalPieDaily', meta: {keepAlive: false} },
      { path: '/AbnormalPie/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked/:group/:orgArr/:topName', component: () => import('components/AbnormalPie1'), props: true, name: 'AbnormalPieWeekly', meta: {keepAlive: false} },
      { path: '/AbnormalPie/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked/:group/:orgArr/:topName', component: () => import('components/AbnormalPie1'), props: true, name: 'AbnormalPieTenDays', meta: {keepAlive: false} },
      { path: '/AbnormalPie/:period/:department/:zoneS/:yearMonth/:checked/:group/:orgArr/:topName', component: () => import('components/AbnormalPie1'), props: true, name: 'AbnormalPieMonthly', meta: {keepAlive: false} },
      { path: '/AbnormalPie/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked/:group/:orgArr/:topName', component: () => import('components/AbnormalPie1'), props: true, name: 'AbnormalPieQuarterly', meta: {keepAlive: false} },
      { path: '/AbnormalPie/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked/:group/:orgArr/:topName', component: () => import('components/AbnormalPie1'), props: true, name: 'AbnormalPieYearly', meta: {keepAlive: false} },
      { path: '/AbnormalPie/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked/:group/:orgArr/:topName', component: () => import('components/AbnormalPie1'), props: true, name: 'AbnormalPie1', meta: {keepAlive: false} },

      { path: '/MOQAnalysis/:period/:department/:zoneS/:selectedDateS/:checked', component: () => import('components/MOQAnalysis'), props: true, name: 'MOQAnalysisDaily', meta: {keepAlive: false} },
      { path: '/MOQAnalysis/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/MOQAnalysis'), props: true, name: 'MOQAnalysisWeekly', meta: {keepAlive: false} },
      { path: '/MOQAnalysis/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/MOQAnalysis'), props: true, name: 'MOQAnalysisTenDays', meta: {keepAlive: false} },
      { path: '/MOQAnalysis/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/MOQAnalysis'), props: true, name: 'MOQAnalysisMonthly', meta: {keepAlive: false} },
      { path: '/MOQAnalysis/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/MOQAnalysis'), props: true, name: 'MOQAnalysisQuarterly', meta: {keepAlive: false} },
      { path: '/MOQAnalysis/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/MOQAnalysis'), props: true, name: 'MOQAnalysisYearly', meta: {keepAlive: false} },
      { path: '/MOQAnalysis/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/MOQAnalysis'), props: true, name: 'MOQAnalysis1', meta: {keepAlive: false} },

      { path: '/DefectiveTable/:topName/:defectiveGroup/:defectiveTableTimes/:period/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/DefectiveTable1'), props: true, name: 'DefectiveTableDaily', meta: {keepAlive: false} },
      { path: '/DefectiveTable/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/DefectiveTable1'), props: true, name: 'DefectiveTableWeekly', meta: {keepAlive: false} },
      { path: '/DefectiveTable/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/DefectiveTable1'), props: true, name: 'DefectiveTableTenDays', meta: {keepAlive: false} },
      { path: '/DefectiveTable/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/DefectiveTable1'), props: true, name: 'DefectiveTableMonthly', meta: {keepAlive: false} },
      { path: '/DefectiveTable/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/DefectiveTable1'), props: true, name: 'DefectiveTableQuarterly', meta: {keepAlive: false} },
      { path: '/DefectiveTable/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/DefectiveTable1'), props: true, name: 'DefectiveTableYearly', meta: {keepAlive: false} },
      { path: '/DefectiveTable/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/DefectiveTable1'), props: true, name: 'DefectiveTable1', meta: {keepAlive: false} },

      { path: '/DefectiveCurve/:topName/:defectiveGroup/:defectiveTableTimes/:period/:departmentS/:zoneS/:selectedDateS/:checked', component: () => import('components/CurveProps1'), props: true, name: 'DefectiveCurveDaily', meta: {keepAlive: false} },
      { path: '/DefectiveCurve/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedYearWeekly/:selectedWeek/:checked', component: () => import('components/CurveProps1'), props: true, name: 'DefectiveCurveWeekly', meta: {keepAlive: false} },
      { path: '/DefectiveCurve/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:yearMonthTenDays/:selectedTenDays/:checked', component: () => import('components/CurveProps1'), props: true, name: 'DefectiveCurveTenDays', meta: {keepAlive: false} },
      { path: '/DefectiveCurve/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:yearMonth/:checked', component: () => import('components/CurveProps1'), props: true, name: 'DefectiveCurveMonthly', meta: {keepAlive: false} },
      { path: '/DefectiveCurve/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedYearQuarter/:selectedQuarter/:checked', component: () => import('components/CurveProps1'), props: true, name: 'DefectiveCurveQuarterly', meta: {keepAlive: false} },
      { path: '/DefectiveCurve/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedYear/:selectedYearTo/:checked', component: () => import('components/CurveProps1'), props: true, name: 'DefectiveCurveYearly', meta: {keepAlive: false} },
      { path: '/DefectiveCurve/:topName/:defectiveGroup/:defectiveTableTimes/:period/:department/:zoneS/:selectedDatePeriod/:selectedDatePeriodTo/:checked', component: () => import('components/CurveProps1'), props: true, name: 'DefectiveCurve1', meta: {keepAlive: false} }

      /* { path: '/WeeklyReport', component: () => import('components/IntegratedPeriodlyReport'), props: { period: 'weekly' } },
      { path: '/TenDaysReport', component: load('IntegratedPeriodlyReport'), props: { period: 'tenDays' } },
      { path: '/MonthlyReport', component: load('IntegratedPeriodlyReport'), props: { period: 'monthly' } },
      { path: '/QuarterlyReport', component: load('IntegratedPeriodlyReport'), props: { period: 'quarterly' } },
      { path: '/YearlyReport', component: load('IntegratedPeriodlyReport'), props: { period: 'yearly' } },
      { path: '/PeriodReport', component: load('IntegratedPeriodlyReport'), props: { period: 'period' } }, */

      /* { path: '/ProductWeeklyReport', component: () => import('components/ProductPeriodReport'), props: { period: 'weekly' } },
      { path: '/ProductTenDaysReport', component: () => import('components/ProductPeriodReport'), props: { period: 'tenDays' } },
      { path: '/ProductMonthlyReport', component: () => import('components/ProductPeriodReport'), props: { period: 'monthly' } },
      { path: '/ProductQuarterlyReport', component: () => import('components/ProductPeriodReport'), props: { period: 'quarterly' } },
      { path: '/ProductYearlyReport', component: () => import('components/ProductPeriodReport'), props: { period: 'yearly' } },
      { path: '/ProductPeriodReport', component: () => import('components/ProductPeriodReport'), props: { period: 'period' } },

      { path: '/MoldWeeklyReport', component: () => import('components/MoldPeriodReport'), props: { period: 'weekly' } },
      { path: '/MoldTenDaysReport', component: () => import('components/MoldPeriodReport'), props: { period: 'tenDays' } },
      { path: '/MoldMonthlyReport', component: () => import('components/MoldPeriodReport'), props: { period: 'monthly' } },
      { path: '/MoldQuarterlyReport', component: () => import('components/MoldPeriodReport'), props: { period: 'quarterly' } },
      { path: '/MoldYearlyReport', component: () => import('components/MoldPeriodReport'), props: { period: 'yearly' } },
      { path: '/MoldPeriodReport', component: () => import('components/MoldPeriodReport'), props: { period: 'period' } },

      { path: '/DailyUtilization', component: () => import('components/Utilization'), props: { period: 'daily' } },
      { path: '/WeeklyUtilization', component: () => import('components/Utilization'), props: { period: 'weekly' } },
      { path: '/TenDaysUtilization', component: () => import('components/Utilization'), props: { period: 'tenDays' } },
      { path: '/MonthlyUtilization', component: () => import('components/Utilization'), props: { period: 'monthly' } },
      { path: '/QuarterlyUtilization', component: () => import('components/Utilization'), props: { period: 'quarterly' } },
      { path: '/YearlyUtilization', component: () => import('components/Utilization'), props: { period: 'yearly' } },
      { path: '/PeriodUtilization', component: () => import('components/Utilization'), props: { period: 'period' } }, */
    ]
  }

  /* { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  } */
]
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/404')
  })
}
export default routes
