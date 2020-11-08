var moment = require('moment')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.minPeriodConstruct = minPeriodConstruct
exports.buildTableByRealData = buildTableByRealData // 創建新資料表用
function getMachineRecords (client, machineID, from, to, callback) {
  var totalRecords = []
  var i
  //var diff = Math.ceil(moment.duration(moment(to).diff(moment(from))).asDays())
  var diff = moment.duration(moment(to).diff(moment(from))).days()
  var tmp = 0

  for ( i = 0 ; i <= diff ; i++ ) {
    var dateStr = machineID + moment(from).add(i, 'days').format('YYYYMMDD')
    concactArray (client, dateStr, function(records) {
      // tmp++
      //// console.log( 'tmp : ' + tmp )
      if ( records.length > 0 ) {
        //// console.log('EachMachine record : ' +  records.length)
        totalRecords = totalRecords.concat(records)
      	//// console.log('totleRecords : ' + totalRecords.length)
      }
      if ( tmp == diff ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
      tmp++
    })
  }
}
function concactArray (client, dateStr, callback) {
  // console.log(dateStr)
  client.db('saveRealData').collection(dateStr).find().toArray(function(err1, docs1) {
    if (err1) {
      callback([])
    } else {
      callback(docs1)
    }
  })
}
var pwrOn = 0
var semiAutoOn = 1
var autoOn = 2
var almOn = 3
var moldCnt = 4
var armAlmOn = 5

var pwrOn = 0
var semiAutoOn = 1
var autoOn = 2
var almOn = 3
var moldCnt = 4
var armAlmOn = 5
// 以日為單位，每日載入這個參數，現在已經可以每日執行了，應該先跑起來
var initDoc = {
  _id: 'timeSlicePoint',
  0: '08:00', // '日切換點'
  1: '12:00',
  2: '16:30',
  3: '20:00',
  4: '23:00'
}
// from - 當日分割點
// prev - 前一刻的時間
// to - 最後的時間
function buildTableByRealData15 (machineID, from, to, prev, res)
{
  var dateStr = machineID + moment(from).format('YYYYMMDD')
  var diff = moment.duration(moment(to).diff(moment(from))).days()
  // console.log('minPeriodConstruct')
  // console.log(from)
  // console.log(to)
  // console.log(dateStr)
  // console.log(diff)
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      getMachineRecords (client, machineID, from, to, function(docs1) {
          client.close()
          // constructAlarmRecord(docs1, from, machineID)
          if (docs1.length === 0) {
            // 當日尚未有資料，保持前一刻狀態
          } else {
            constructAlarmRecordDays (docs1, from, to, prev, machineID, function () {
              // 更新
            })
          }
      })
    }
  })
}
function constructAlarmRecordDays (realData, from, to, prev, machineID, callback) {
  var diff = moment.duration(moment(to).diff(moment(from))).days()
  var i = 0
  var daysIdx = 0
  // console.log('constructAlarmRecordDays')
  // console.log(diff)
  // console.log(realData.length)
  for (i = 0; i < diff; i++) {
    constructAlarmRecord(realData, moment(from).add(i, 'days'), prev, machineID, function () {
      daysIdx++
      // console.log(daysIdx)
      if (daysIdx === diff) {
        callback()
      }
    })
  }
}
function constructAlarmRecord (realData, from, prev, machineID, callback) {
  realData.sort((a, b) => {
    return (a._id > b._id) ? 1 : -1
  })
  if (realData.length === 0) {
    // console.log('No record data')
    callback()
  } else {
    var saveRecord = []
    var powerBeginArr = []
    var powerEndArr = []
    var manualBeginArr = []
    var autoBeginArr = []
    var manualEndArr = []
    var autoEndArr = []
    var sectionArr = []
    var validMoldObj = {}
    var validMoldObjEdge = {}
    var sectionFlg = -1
    var prevSectionFlg = -1
    var aDay = []
    var subStr = initDoc[0].split(':')
    // 確認是否用utc函式可以讓時間正常
    // console.log('Utc test')
    // console.log(moment(realData[0].Time))
    var initDocKeys = (Object.keys(initDoc)).filter(elm => { return elm !== '_id'})
    // // console.log(moment(t4))
    // // console.log(moment(t5))
    // 確認是+8小時 還是utc之後即可
    // from 已經是經過日切割點處理的
    aDay = realData.filter(elm => {
      return ((moment(elm.Time).add(0, 'hours') >= moment(prev)) && (moment(elm.Time).add(0, 'hours') < moment(from).add(1, 'days').add(10, 'minutes')))
    })
    var idxrFirstRalData = realData.indexOf(aDay[0])
    aDay.forEach((elm, idx, arr) => {
      // prevSectionFlg = sectionFlg
      sectionFlg = -1
      initDocKeys.forEach((objKey, index, orgArr) => {
        var t1 = moment(from).format('YYYY-MM-DD') + ' ' + initDoc[objKey]
        var t2 = t1
        if (index === (orgArr.length - 1)) {
          t2 = moment(from).add(1, 'days').format('YYYY-MM-DD') + ' ' + initDoc[0]
        } else {
          t2 = moment(from).format('YYYY-MM-DD') + ' ' + initDoc[orgArr[index + 1]]
        }
        if ((moment(elm.Time) >= moment(t1)) && (moment(elm.Time) < moment(t2))) {
          sectionFlg = index
        }
      })
      if (idx > 0) {
        if (elm.portAsByte[pwrOn]) {
          if (!arr[idx - 1].portAsByte[pwrOn] & (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) { // 20191121 新增條件，避免在開機之前已經產生自動生產信號
            autoBeginArr.push(elm)
            //sectionArr.push(sectionFlg)
            prevSectionFlg = sectionFlg
          } else if ((!arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn]) | (!arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn])) {
            autoBeginArr.push(elm)
            //sectionArr.push(sectionFlg)
            prevSectionFlg = sectionFlg // 若自動開始，因自動開始而分段，不須再因時間分段
            if (((arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn]) | (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn])) && (autoBeginArr.length > autoEndArr.length)) { // 20191111 add 避免瞬間切換
              autoEndArr.push(elm)
            }
          } else if (((arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn]) | (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn])) && (autoBeginArr.length > autoEndArr.length)) {
            autoEndArr.push(elm)
            prevSectionFlg = sectionFlg // 若自動結束，因自動結束分段，則不須因時間分段
          } else if ((prevSectionFlg !== sectionFlg) && (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) {
            if (!arr[idx - 1].portAsByte[moldCnt] & elm.portAsByte[moldCnt]) {
              if (autoBeginArr.length > autoEndArr.length) {
                autoEndArr.push(elm)
              }
              if (sectionFlg !== -1) {
                autoBeginArr.push(elm)
              }
              sectionArr.push(sectionFlg)
              prevSectionFlg = sectionFlg
            }
          }
        } else if (autoBeginArr.length > autoEndArr.length) {
          autoEndArr.push(elm)
        }
        // 手動紀錄
        if ((!arr[idx - 1].portAsByte[pwrOn] & elm.portAsByte[pwrOn] & (!elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn])) | // 20191121 新增條件，避免在開機之前已經產生自動生產信號
        // if ((elm.portAsByte[pwrOn] &  !elm.portAsByte[semiAutoOn] & !elm.portAsByte[pwrOn]) |
        (!elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn] & arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[pwrOn]) | // 20191111 增加判斷需當下都無自動
        (!elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn] & arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[pwrOn])) {
          manualBeginArr.push(elm)
        } else if ((arr[idx - 1].portAsByte[pwrOn] & !elm.portAsByte[pwrOn]) |
        (!arr[idx - 1].portAsByte[semiAutoOn] & !arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[pwrOn]) | // 20191111 需判斷兩個的前一刻都不是自動，才是有效的手動結束
        (!arr[idx - 1].portAsByte[semiAutoOn] & !arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn] & elm.portAsByte[pwrOn])) {
          if (manualBeginArr.length > manualEndArr.length) {
            manualEndArr.push(elm)
          } else {
            // 應歸納為前一刻的資料
          }
        }
        // 關機紀錄
        if (arr[idx - 1].portAsByte[pwrOn] & !elm.portAsByte[pwrOn]) {
        // if (!elm.portAsByte[pwrOn]) {
          powerBeginArr.push(elm)
        } else if (!arr[idx - 1].portAsByte[pwrOn] & elm.portAsByte[pwrOn]) {
          if (powerBeginArr.length > powerEndArr.length) {
            powerEndArr.push(elm)
          } else {
            // 應歸納為前一刻的資料
          }
        }
      } else if (idx === 0) {
        if (elm.portAsByte[pwrOn] & !elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) {
          // autoBeginArr.push(elm)
          // sectionArr.push(sectionFlg)
          // manualBeginArr.push(elm)
          if (idxrFirstRalData > 0) { // 日分割前8小時內確定在日分割的有效資料前一筆為關機，因此從日分割開始作為關機的起點，因不知要往前找多久才有關機前的動作
            if (!realData[idxrFirstRalData - 1].portAsByte[pwrOn]) {
              manualBeginArr.push(elm)
              powerBeginArr.push({Time: moment(from).toDate()})
              powerEndArr.push(elm)
            } else { // 日分割前就已經手動了，不確定手動要往前搜尋多久才可以確定手動開始，因此由日分割處理
              manualBeginArr.push({Time: moment(from).toDate()})
            }
          } else { // 當前的elm為原始陣列的第一筆，但表往前8小時沒變化，視為關機
            manualBeginArr.push(elm)
            powerBeginArr.push({Time: moment(from).toDate()})
            powerEndArr.push(elm)
          }
        } else if (elm.portAsByte[pwrOn] & (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) { // 20191121 新增條件，避免在開機之前已經產生自動生產信號
          autoBeginArr.push(elm)
          sectionArr.push(sectionFlg)
          prevSectionFlg = sectionFlg
        }
      }
    })
    var endTime = moment(from).add(1, 'days').add(10, 'minutes').toDate()
    if (autoBeginArr.length > autoEndArr.length) {
      // console.log(' Hello~Auto')
      // console.log(autoBeginArr.length)
      // console.log(autoEndArr.length)
      // console.log(sectionArr.length)
      // autoEndArr.push(realData[realData.length - 1])
      autoEndArr.push({Time: endTime})
      // console.log(realData[realData.length - 1])
    }
    // 手動
    if (manualBeginArr.length > manualEndArr.length) {
      manualEndArr.push({Time: endTime})
    }
    // 關機
    if (powerBeginArr.length > powerEndArr.length) {
      powerEndArr.push({Time: endTime})
    }
    // ----------------------------------------------------------------------------------------------
    for (i = 0; i < autoBeginArr.length; i++) {
      validMoldObj[i] = []
      validMoldObj[i] = aDay.filter(elm => {
        if ((elm._id >= autoBeginArr[i]._id) && (elm._id <= autoEndArr[i]._id)) {
          return elm
        }
      })
      // console.log(validMoldObj[i].length)
      var active = false
      validMoldObjEdge[i] = []
      validMoldObjEdge[i] = validMoldObj[i].filter((elm, idx, arr) => {
        if (idx > 0) {
          //if (active) {
          if (!arr[idx - 1].portAsByte[moldCnt] & elm.portAsByte[moldCnt]) {
            if (active) {
              return elm
            }
            active = true
          } else if (idx === (arr.length - 1)) { // 20191122 邊界條件，因時間分段點，或負緣產生前結束自動狀態
            if (elm.portAsByte[moldCnt]) {
              return elm
            }
          }
        } else if (idx === 0) {
          if (elm.portAsByte[moldCnt]) {
            var v = sectionArr.map(x => x._id).find(x => {
              if (x === elm._id) {
                return x
              }
            })
            if (v !== undefined) {
              active = true
            }
          }
        }
        if (elm.portAsByte[moldCnt]) {
          //active = true
        }
      })
      // --------------------------20190617 新增最短周期
      var subDocs1 = validMoldObj[i].filter((elm1, idx, subArr) => {
        if (idx > 0) {
          if (elm1.portAsByte[pwrOn] & (elm1.portAsByte[semiAutoOn] | elm1.portAsByte[autoOn]) & (elm1.portAsByte[moldCnt] & !subArr[idx - 1].portAsByte[moldCnt])) {// & !subArr[idx + 1].portAsByte[moldCnt])) {
            return elm1
          }
        }
      })
      var arr1 = []
      validMoldObjEdge[i].forEach((doc1, idx, arr) => { // subDocs1
        if ((idx + 1) < arr.length) {
          var diff = moment.duration(moment(arr[idx + 1].Time).diff(moment(doc1.Time))).asMilliseconds()
          if (diff < 0) {
            // console.log('-----------------')
            // console.log(arr[idx + 1]._id + '   ' + moment(arr[idx + 1].Time))
            // console.log(doc1._id + '   ' + moment(doc1.Time))
          } else {
            arr1.push(diff)
          }
        }
      })
      // console.log(Math.min( ...arr1 ))
      var min = 0
      if (arr1.length > 0) {
        min = Math.round(Math.min( ...arr1 ) / 100) / 10
      }
      // -------------------------- 20190617 新增最短周期 結束
      // console.log(i + ' record data')
      // console.log(autoBeginArr[i]) // 有效的開始時間
      // console.log(autoEndArr[i]) // 有效的結束時間
      // console.log(sectionArr[i])
      // console.log(validMoldObjEdge[i].length) // 有效的射出模次
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: autoBeginArr[i].portAsByte[semiAutoOn] ? '半自動' : autoBeginArr[i].portAsByte[autoOn]?'全自動' : '手動',
        machineStatusType: autoBeginArr[i].portAsByte[semiAutoOn] ? '半自動' : autoBeginArr[i].portAsByte[autoOn]?'全自動' : '手動',
        trigTime: autoBeginArr[i].Time,
        lastTrigTime: autoEndArr[i].Time,
        moldCount: validMoldObjEdge[i].length,
        min: min
      })
      // 製作警報陣列
      var almValidMoldArr = [autoBeginArr[i]].concat(validMoldObjEdge[i], [autoEndArr[i]])
      var almCnt = almValidMoldArr.reduce((prev, elm, index, arr) => {
        if (index === 0) {
          return 0
        } else if (index > 0) {
          var local = validMoldObj[i].filter(oneData => {
            if ((oneData._id >= arr[index - 1]._id) && (oneData._id <= elm._id)) {
              return elm
            }
          })
          var oneDataIdx = 0
          for (oneDataIdx = 0; oneDataIdx < local.length; oneDataIdx++) {
            if (local[oneDataIdx].portAsByte[semiAutoOn] | local[oneDataIdx].portAsByte[autoOn]) {
              if (local[oneDataIdx].portAsByte[almOn]) {
                // console.log('machine Alarm')
                // console.log(local[oneDataIdx])
                saveRecord.splice(saveRecord.length, 0, {
                  machineStatus: '警報',
                  machineStatusType: '警報-成型機',
                  trigTime: local[oneDataIdx].Time,
                  lastTrigTime: local[oneDataIdx].Time,
                  moldCount: 0
                })
                return prev + 1
              } else if (local[oneDataIdx].portAsByte[armAlmOn]) {
                // console.log('arm Alarm')
                // console.log(local[oneDataIdx])
                saveRecord.splice(saveRecord.length, 0, {
                  machineStatus: '警報',
                  machineStatusType: '警報-機械手',
                  trigTime: local[oneDataIdx].Time,
                  lastTrigTime: local[oneDataIdx].Time,
                  moldCount: 0
                })
                return prev + 1
              }
            }
          }
          return prev
        }
      }, 0)
      // console.log('alarm count = ' + almCnt)
    }
    for (i = 0; i < manualBeginArr.length; i++) {
      // console.log('manual record' + i)
      // console.log(manualBeginArr[i])
      // console.log(manualEndArr[i])
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: '手動',
        machineStatusType: '手動',
        trigTime: manualBeginArr[i].Time,
        lastTrigTime: manualEndArr[i].Time,
        moldCount: 0
      })
    }
    for (i = 0; i < powerBeginArr.length; i++) {
      // console.log('manual record' + i)
      // console.log(powerBeginArr[i])
      // console.log(powerEndArr[i])
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: '關機',
        machineStatusType: '關機',
        trigTime: powerBeginArr[i].Time,
        lastTrigTime: powerEndArr[i].Time,
        moldCount: 0
      })
    }
    // console.log(saveRecord)
    makeDataRecord(machineID, saveRecord, from, function () {
      callback()
    })
    // console.log('aDay')
    // console.log(aDay[0])
  }
}


var prodDepartSetting = require('./prodDepartSetting.js')
function makeDataRecord (machineID, saveRecord, from, callback0) {
  prodDepartSetting.getPropertyByMachineID(machineID, function(callback) {
    // console.log('88888888888')
    // console.log(callback)
    MongoClient.connect(config.dbUrl, function(err, client){
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        var from0 = moment(from).toDate()
        var to = moment(from).add(1, 'days').toDate()
        // console.log(from0)
        // console.log(to)
        client.db(config.dbName).collection('machineRecord' + callback[0]).deleteMany({trigTime: {$gte: from0, $lt: to}}, function () { // trigTime: {$gte: from, $lt: to}
          if (saveRecord.length === 0) {
            // console.log('makeDataRecord length === 0')
            // client.db(config.dbName).collection('machineRecord' + callback[0]).find({trigTime: {$gte: from0}}).toArray(function(err1, docs1) {
              // console.log(to)
            client.db(config.dbName).collection('machineRecord' + callback[0]).findOneAndUpdate({trigTime: {$lt: from0}, machineStatus: {$ne: '警報'}}, {$set: {lastTrigTime: to}}, {sort: {trigTime: -1 }}, function (err9, ddd) {
              // console.log(err9)
              client.close()
              callback0()
            })
          } else {
            /* client.db(config.dbName).collection('machineRecord' + callback[0]).insertMany(saveRecord, function () {
              client.close()
              callback0()
            }) */
            for (var base = 0, end = 0; base < saveRecord.length; base = end) {
              end = ((saveRecord.length - base) > 1000) ? base + 1000 : (saveRecord.length)
              client.db(config.dbName).collection('machineRecord' + callback[0]).insertMany(saveRecord.slice(base, end), function () {
                if (base === end) {
                  client.close()
                  callback0()
                }
              })
            }
          }
        })
      }
    })
  })
}