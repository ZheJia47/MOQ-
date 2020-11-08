var moment = require('moment')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.minPeriodConstruct = minPeriodConstruct
exports.buildTableByRealData = buildTableByRealData // 創建新資料表用
var pwrOn = 0
var semiAutoOn = 1
var autoOn = 2
var almOn = 3
var moldCnt = 4
var armAlmOn = 5

function minPeriodConstruct (machineID, from, to, docs, callback)
{
  var dateStr = machineID + moment(from).format('YYYYMMDD')
  var diff = moment.duration(moment(to).diff(moment(from))).days()
  //// console.log('minPeriodConstruct')
  //// console.log(from)
  //// console.log(to)
  //// console.log(dateStr)
  //// console.log(diff)
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
callback(docs)
      /* res.send({
        type: false,
        data: 'Error occured: ' + err
      }) */
    } else {
      var moldCountDocs = docs.filter(doc => {
        if (doc.hasOwnProperty('moldCount') && doc.hasOwnProperty('machineStatusType')) {
          if (doc.machineStatusType === '全自動' || doc.machineStatusType === '半自動') {
            return doc
          }
        }
      })
      if (machineID.indexOf('1A') > -1) {
      getMachineRecords (client, machineID, from, to, function(docs1) {
        docs1.sort((a, b) => {
          return a.Time > b.Time ? 1 : -1
        })
        // console.log('moldCountDocs : length = ' + moldCountDocs.length)
          moldCountDocs.forEach((elm, idx0, subArr0) => {
            var active = false
            var subDocs2 = docs1.filter((elm1, idx, subArr) => {
              if ((moment(elm.trigTime) <= moment(elm1.Time)) && (moment(elm.lastTrigTime) >= moment(elm1.Time))) {// && (idx + 1) < subArr.length)//20200527 add
                return elm1
              }
            })
            var subDocs1 = subDocs2.filter((elm1, idx, subArr) => {
              if ((moment(elm.trigTime) <= moment(elm1.Time)) && (moment(elm.lastTrigTime) >= moment(elm1.Time)) && (elm1.portAsByte[semiAutoOn] | elm1.portAsByte[autoOn])) {// && (idx + 1) < subArr.length)//20200527 add
                if (idx > 0) {
                  if (elm1.portAsByte[pwrOn] & (elm1.portAsByte[semiAutoOn] | elm1.portAsByte[autoOn]) & (elm1.portAsByte[moldCnt] & !subArr[idx - 1].portAsByte[moldCnt])) {// & !subArr[idx + 1].portAsByte[moldCnt])) {
                    if (!active) {
                      active = true
                      return elm1 // 若回傳為取得魔術陣列，則此return必須刪除，若為最短周期就必須要回傳
                    } else {
                      return elm1
                    }
                  }
                } else if (idx === 0) {
                  if (elm1.portAsByte[pwrOn] & (elm1.portAsByte[semiAutoOn] | elm1.portAsByte[autoOn]) & elm1.portAsByte[moldCnt]) {// & !subArr[idx + 1].portAsByte[moldCnt])) {
                    return elm1
                  }
                }
              }
            })
            subDocs1.sort((a, b) => {
              return a._id > b._id ? 1 : -1
            })
            var arr1 = []
            subDocs1.forEach((doc1, idx, arr) => {
              if ((idx + 1) < arr.length) {
                var diff = moment.duration(moment(arr[idx + 1].Time).diff(moment(doc1.Time))).asMilliseconds()
                if (diff < 0) {
                  /*// console.log('-----------------')20200306
                  // console.log(arr[idx + 1]._id + '   ' + moment(arr[idx + 1].Time))
                  // console.log(doc1._id + '   ' + moment(doc1.Time))*/
                } else {
                  arr1.push(diff)
                  if (diff < 25000) {
                    /*// console.log('-----------------' + diff)20200306
                    // console.log(arr[idx + 1].Time)
                    // console.log(doc1.Time)*/
                  }
                }
              }
            })
            //// console.log(elm.trigTime)
            //// console.log(elm.lastTrigTime)
            //// console.log(subDocs1.length)
            //// console.log(arr1.length)
            //// console.log(Math.min( ...arr1 ))
            var tgt = docs.find(doc => {
              return doc.trigTime === elm.trigTime
            })
            if (arr1.length > 0) {
              // // console.log(Math.min( ...arr1 ))
              tgt.min = Math.round(Math.min( ...arr1 ) / 100) / 10
              minDataFix (client, machineID, tgt, tgt.min)
            }
            /* // console.log('checkPartition')
            if ((idx0 + 1) < subArr0.length) {
              // 修正邊界條件
              if (moment(elm.lastTrigTime).isSame(moment(subArr0[idx0 + 1].trigTime))) {
                // console.log('find target')
                var sT = checkPartition(elm.trigTime)
                var sE = checkPartition(elm.lastTrigTime)
                // console.log(sT)
                // console.log(sE)
                if (sT > -1 && sE > -1) {
                  // 處理時間未分割在正確兩個區段
                  if (sT === sE) {
                    // console.log('slice error ' + moment(elm.lastTrigTime).format('YYYY-MM-DD HH:mm:ss.SSS'))
                    var subDocs2 = docs1.find(elm2 => {
                      if ((moment(subArr0[idx0 + 1].trigTime) <= moment(elm2.Time)) && (moment(subArr0[idx0 + 1].lastTrigTime) >= moment(elm2.Time))) {// && (idx + 1) < subArr.length)
                        if (moment(elm2.Time) > moment(moment(subArr0[idx0 + 1].trigTime).format('YYYY-MM-DD ') + initDoc[initDoc.hasOwnProperty(sE + 1) ? sE + 1: 0]))
                          if (elm2.portAsByte[moldCnt]) {
                            return elm2
                          }
                      }
                    })
                    if (subDocs2 !== undefined && subDocs2 !== null) {
                      if (subDocs2.hasOwnProperty('Time')) {
                        // console.log(moment(subDocs2.Time).format('YYYY-MM-DD HH:mm:ss.SSS'))
                        trigTimeFix (client, machineID, subArr0[idx0 + 1], subDocs2.Time)
                        lastTrigTimeAndMoldcntFix (client, machineID, elm, subDocs2.Time)
                      }
                    }
                  } else {
                  var subDocs2 = docs1.find(elm2 => {
                    if ((moment(elm.trigTime) <= moment(elm2.Time)) && (moment(subArr0[idx0 + 1].lastTrigTime) >= moment(elm2.Time))) {// && (idx + 1) < subArr.length)
                      var fixDays = moment(subArr0[idx0 + 1].trigTime).isSameOrAfter(moment(moment(subArr0[idx0 + 1].trigTime).format('YYYY-MM-DD ') + '00:00:00.000')) && moment(subArr0[idx0 + 1].trigTime).isBefore(moment(moment(subArr0[idx0 + 1].trigTime).format('YYYY-MM-DD ') + initDoc[0])) ? 1 : 0
                      if (moment(elm2.Time) >= moment(moment(subArr0[idx0 + 1].trigTime).format('YYYY-MM-DD ') + initDoc[sE]).subtract(fixDays, 'd'))
                        if (elm2.portAsByte[moldCnt]) {
                          return elm2
                        }
                    }
                  })
                  //// console.log('slice point: '+ subDocs2.Time)
                  if (subDocs2 !== undefined && subDocs2 !== null) {
                    if (subDocs2.hasOwnProperty('Time')) {
                      if (!moment(elm.lastTrigTime).isSame(subDocs2.Time)) {
                        // console.log('slice point error '+ sE)
                        // console.log(moment(elm.trigTime).format('YYYY-MM-DD HH:mm:ss.SSS'))
                        // console.log(moment(elm.lastTrigTime).format('YYYY-MM-DD HH:mm:ss.SSS'))
                        // console.log(moment(subDocs2.Time).format('YYYY-MM-DD HH:mm:ss.SSS'))
                        // console.log(moment(from).format('YYYY-MM-DD HH:mm:ss.SSS'))
                        // console.log(moment(to).format('YYYY-MM-DD HH:mm:ss.SSS'))
                        if (elm.moldCount > 0) {
                          trigTimeFix (client, machineID, subArr0[idx0 + 1], subDocs2.Time)
                          lastTrigTimeAndMoldcntFix (client, machineID, elm, subDocs2.Time)
                        } else if (elm.moldCount === 0) {
                          trigTimeAndMoldcntFix (client, machineID, subArr0[idx0 + 1], subDocs2.Time)
                          lastTrigTimeFix (client, machineID, elm, subDocs2.Time)
                        }
                      } else if (!moment(subArr0[idx0 + 1].trigTime).isSame(subDocs2.Time)) {
                        // console.log(moment(subArr0[idx0 + 1].trigTime).format('YYYY-MM-DD HH:mm:ss.SSS'))
                        trigTimeFix (client, machineID, subArr0[idx0 + 1], subDocs2.Time)
                      }
                    }
                    } else {
                      lastTrigTimeFix(client, machineID, elm, subArr0[idx0 + 1].lastTrigTime)
                      deleteDoc(client, machineID, subArr0[idx0 + 1])
                      // console.log('checkPartition: ' + subArr0[idx0 + 1].lastTrigTime)
                      // console.log(subArr0[idx0 + 1]._id)
                      // console.log(elm._id)
                    }
                  }
                }
              } else {
                //// console.log('checkPartition0')
              }
            } else {
              //// console.log('checkPartition1')
            } */
          })
          callback(docs)
          client.close()
          // constructAlarmRecord(docs1, from, machineID)
          //constructAlarmRecordDays (docs1, from, to, machineID)
      })
      } else {
        getMachineRecordsExcept1A (client, machineID, from, to, function(docs1) {
          docs1.sort((a, b) => {
            return a.Time > b.Time ? 1 : -1
          })
          // console.log('moldCountDocs : length = ' + moldCountDocs.length)
            moldCountDocs.forEach((elm, idx0, subArr0) => {
              var active = false
              var subDocs2 = docs1.filter((elm1, idx, subArr) => {
                if ((moment(elm.trigTime) <= moment(elm1.Time)) && (moment(elm.lastTrigTime) >= moment(elm1.Time))) {// && (idx + 1) < subArr.length)//20200527 add
                  return elm1
                }
              })
              var subDocs1 = subDocs2.filter((elm1, idx, subArr) => {
                if ((moment(elm.trigTime) <= moment(elm1.Time)) && (moment(elm.lastTrigTime) >= moment(elm1.Time)) && (elm1.portAsByteCmb[semiAutoOn] === 1 | elm1.portAsByteCmb[autoOn] === 1)) {// && (idx + 1) < subArr.length)//20200527 add
                  if (idx > 0) {
                    if (elm1.portAsByteCmb[pwrOn] === 1 & (elm1.portAsByteCmb[semiAutoOn] === 1 | elm1.portAsByteCmb[autoOn] === 1) & (elm1.portAsByteCmb[moldCnt] === 1 && subArr[idx - 1].portAsByteCmb[moldCnt] === 0)) {// & !subArr[idx + 1].portAsByte[moldCnt])) {
                      if (!active) {
                        active = true
                        return elm1 // 若回傳為取得魔術陣列，則此return必須刪除，若為最短周期就必須要回傳
                      } else {
                        return elm1
                      }
                    }
                  } else if (idx === 0) {
                    if (elm1.portAsByteCmb[pwrOn] === 1 & (elm1.portAsByteCmb[semiAutoOn] === 1 | elm1.portAsByteCmb[autoOn] === 1) & elm1.portAsByteCmb[moldCnt] === 1) {// & !subArr[idx + 1].portAsByte[moldCnt])) {
                      return elm1
                    }
                  }
                }
              })
              subDocs1.sort((a, b) => {
                return a._id > b._id ? 1 : -1
              })
              var arr1 = []
              subDocs1.forEach((doc1, idx, arr) => {
                if ((idx + 1) < arr.length) {
                  var diff = moment.duration(moment(arr[idx + 1].Time).diff(moment(doc1.Time))).asMilliseconds()
                  if (diff < 0) {
                    /*// console.log('-----------------')20200306
                    // console.log(arr[idx + 1]._id + '   ' + moment(arr[idx + 1].Time))
                    // console.log(doc1._id + '   ' + moment(doc1.Time))*/
                  } else {
                    arr1.push(diff)
                    if (diff < 25000) {
                      /*// console.log('-----------------' + diff)20200306
                      // console.log(arr[idx + 1].Time)
                      // console.log(doc1.Time)*/
                    }
                  }
                }
              })
              var tgt = docs.find(doc => {
                return doc.trigTime === elm.trigTime
              })
              if (arr1.length > 0) {
                // // console.log(Math.min( ...arr1 ))
                tgt.min = Math.round(Math.min( ...arr1 ) / 100) / 10
                minDataFix (client, machineID, tgt, tgt.min)
              }
            })
            callback(docs)
            client.close()
        })
      }
    }
  })
}
function checkPartition (Time) {
  var initDocKeys = (Object.keys(initDoc)).filter(elm => { return elm !== '_id'})
  var sectionFlg = -1
  var from = (moment(Time).format('YYYY-MM-DD HH:mm') < (moment(Time).format('YYYY-MM-DD') + ' ' + initDoc[0])) ? moment(Time).subtract(1, 'd') : moment(Time)
  initDocKeys.forEach((objKey, index, orgArr) => {
    var t1 = moment(from).format('YYYY-MM-DD') + ' ' + initDoc[objKey]
    var t2 = t1
    if (index === (orgArr.length - 1)) {
      t2 = moment(from).add(1, 'days').format('YYYY-MM-DD') + ' ' + initDoc[0]
    } else {
      t2 = moment(from).format('YYYY-MM-DD') + ' ' + initDoc[orgArr[index + 1]]
    }
    if ((moment(Time) >= moment(t1)) && (moment(Time) < moment(t2))) {
      sectionFlg = index
    }
  })
  return sectionFlg
}
function getMachineRecords (client, machineID, from, to, callback) {
  var totalRecords = []
  var i
  //var diff = Math.ceil(moment.duration(moment(to).diff(moment(from))).asDays())
  var diff = moment.duration(moment(to).diff(moment(from))).asDays()
  // var diff = moment(to).diff(moment(from)) / 1000 / 3600 / 24
  /* // console.log('getMachineRecords: ' + diff)
  // console.log(from)
  // console.log(to) */
  var tmp = 0
  var ii = 2
  for ( i = 0 ; (i - ii) <= (diff) ; i++ ) {
    // var dateStr = machineID + moment(from).subtract(ii, 'minutes').add(i, 'days').format('YYYYMMDD')
    var dateStr = machineID + moment(from).subtract(ii, 'days').add(i, 'days').format('YYYYMMDD')
    // console.log(dateStr)
    concactArray (client, dateStr, function(records) {
      // tmp++
      //// console.log( 'tmp : ' + tmp )
      if ( records.length > 0 ) {
        //// console.log('EachMachine record : ' +  records.length)
        totalRecords = totalRecords.concat(records)
      	//// console.log('totleRecords : ' + totalRecords.length)
      }
      if ( tmp == (diff + ii)) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
      tmp++
    })
  }
}
function getMachineRecordsExcept1A (client, machineID, from, to, callback) {
  prodDepartSetting.getPropertyByMachineID(machineID, function(propertyId) {
    concactArrayExceptA(client, propertyId[0], from, to, function(records) {
      callback(records)
    })
  })
}
function concactArray (client, dateStr, callback) {
  //// console.log(dateStr)
  client.db('saveRealData').collection(dateStr).find().toArray(function(err1, docs1) {
    if (err1) {
      callback([])
    } else {
      callback(docs1)
    }
  })
}
function concactArrayExceptA (client, propertyId, from, to, callback) {
  //// console.log(dateStr)
  client.db('ldm').collection(propertyId + 'Record').find({Time: {$gte: moment(from).subtract(2, 'd').toDate(), $lte: moment(to).add(2, 'd').toDate()}}).toArray(function(err1, docs1) {
    if (err1) {
      callback([])
    } else {
      callback(docs1)
    }
  })
}
function minDataFix (client, machineID, doc, min) {
  client.db(config.dbName).collection(machineID).updateOne({_id: doc._id}, {$set: {min: min}}, {upsert: true})
}
function trigTimeFix (client, machineID, doc, Time) {
  client.db(config.dbName).collection(machineID).updateOne({_id: doc._id}, {$set: {trigTime: Time}}, {upsert: true})
}
function lastTrigTimeFix (client, machineID, doc, Time) {
  client.db(config.dbName).collection(machineID).updateOne({_id: doc._id}, {$set: {lastTrigTime: Time}}, {upsert: true})
}
function trigTimeAndMoldcntFix (client, machineID, doc, Time) {
  client.db(config.dbName).collection(machineID).updateOne({_id: doc._id}, {$set: {trigTime: Time}, $inc: {moldCount: 1}}, {upsert: true})
}
function lastTrigTimeAndMoldcntFix (client, machineID, doc, Time) {
  client.db(config.dbName).collection(machineID).updateOne({_id: doc._id}, {$set: {lastTrigTime: Time}, $inc: {moldCount: 1}}, {upsert: true})
}
function deleteDoc (client, machineID, doc) {
  client.db(config.dbName).collection(machineID).deleteOne({_id: doc._id})
}
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
function buildTableByRealData (machineID, from, to, res)
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
      if (machineID.indexOf('1A') > -1) {
      getMachineRecords (client, machineID, from, to, function(docs1) {
        docs1.sort((a, b) => {
          return a.Time > b.Time ? 1 : -1
        })
          client.close()
          // constructAlarmRecord(docs1, from, machineID)
          if (docs1.length === 0) {
            // console.log('長度為0')
            res.send({
              type: true,
              data: []
            })
          } else {
            constructAlarmRecordDays (docs1, from, to, machineID, function () {
              res.send({
                type: true,
                data: [0, 1, 2]
              })
            })
          }
      })
      } else {
        getMachineRecordsExcept1A (client, machineID, from, to, function(docs1) {
          console.log('docs1.length')
          console.log(docs1.length)
          docs1.sort((a, b) => {
            return a.Time > b.Time ? 1 : -1
          })
          console.log(docs1[0])
          docs1.forEach(elm => {
            elm['portAsByte'] = []
            elm['portAsByteCmb'].forEach(elmCmp => {
              elm['portAsByte'].splice(elm['portAsByte'].length, 0, (elmCmp === 1) ? true : false)
            })
          })
            client.close()
            // constructAlarmRecord(docs1, from, machineID)
            if (docs1.length === 0) {
              // console.log('長度為0')
              res.send({
                type: true,
                data: []
              })
            } else {
              constructAlarmRecordDaysExcept1A (docs1, from, to, machineID, function () {
                res.send({
                  type: true,
                  data: [0]
                })
              })
            }
        })
      }
    }
  })
}
function constructAlarmRecordDays (realData, from, to, machineID, callback) {
  var diff = moment.duration(moment(to).diff(moment(from))).asDays()
  var i = 0
  var daysIdx = 0
  // console.log('constructAlarmRecordDays')
  // console.log(diff)
  // console.log(realData.length)
  for (i = 0; i < diff; i++) {
    var from1 = from
    constructAlarmRecord(realData, moment(from1).add(i, 'days'), machineID, function (saveRecord) {
      // daysIdx++ 20191121刪
      // console.log('daysIdx')
      // console.log(from1)
      makeDataRecord(machineID, saveRecord, moment(from).add(i, 'days'), function () {
        daysIdx++
        if (daysIdx === diff) {
          callback()
        }
      })
    })
  }
}
function constructAlarmRecord (realData, from, machineID, callback) {
  realData.sort((a, b) => {
    return (a._id > b._id) ? 1 : -1
  })
  if (realData.length === 0) {
    // console.log('No record data')
    callback([])
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
    // // console.log(moment(realData[0].Time))
    // // console.log(moment.utc(realData[0].Time))
    // // console.log(moment(realData[0].Time, 'tw'))
    // // console.log(moment(moment(from)))
    // // console.log(moment(moment(from).format('YYYY-MM-DD')))
    // // console.log(moment(moment(from).format('YYYY-MM-DD') + ' ' + initDoc[1]))
    /* var t1 = moment(from).format('YYYY-MM-DD ') + ' ' + initDoc[1]
    var t2 = moment(from).format('YYYY-MM-DD ') + ' ' + initDoc[2]
    var t3 = moment(from).format('YYYY-MM-DD ') + ' ' + initDoc[3]
    var t4 = moment(from).format('YYYY-MM-DD ') + ' ' + initDoc[4]
    var t5 = moment(from).add(1, 'days').format('YYYY-MM-DD ') + ' ' + initDoc[0] */
    var initDocKeys = (Object.keys(initDoc)).filter(elm => { return elm !== '_id'})
    // // console.log(moment(t4))
    // // console.log(moment(t5))
    // 確認是+8小時 還是utc之後即可
    // from 已經是經過日切割點處理的
    aDay = realData.filter(elm => {
      return ((moment(elm.Time).add(0, 'hours') >= moment(from)) && (moment(elm.Time).add(0, 'hours') < moment(from).add(1, 'days').add(10, 'minutes')))
    })
    var endTime = moment(from).add(1, 'days').toDate()
    var idxrFirstRalData = realData.indexOf(aDay[0])
    aDay.forEach((elm, idx, arr) => {
      var over = moment(elm.Time).isAfter(moment(from).add(1, 'days'))
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
      /* if (idx > 0) {
        if (elm.portAsByte[pwrOn]) {
          if ((!arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn]) | (!arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn])) {
            autoBeginArr.push(elm)
            sectionArr.push(sectionFlg)
            prevSectionFlg = sectionFlg // 若自動開始，因自動開始而分段，不須再因時間分段
          } else if (((arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn]) | (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn])) && (autoBeginArr.length > autoEndArr.length)) {
            autoEndArr.push(elm)
            prevSectionFlg = sectionFlg // 若自動結束，因自動結束分段，則不須因時間分段
          } else if (((prevSectionFlg) !== sectionFlg) && (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) {
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
        if ((!arr[idx - 1].portAsByte[pwrOn] & elm.portAsByte[pwrOn]) |
        // if ((elm.portAsByte[pwrOn] &  !elm.portAsByte[semiAutoOn] & !elm.portAsByte[pwrOn]) |
        (arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn] & elm.portAsByte[pwrOn]) |
        (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn] & elm.portAsByte[pwrOn])) {
          manualBeginArr.push(elm)
        } else if ((arr[idx - 1].portAsByte[pwrOn] & !elm.portAsByte[pwrOn]) |
        (!arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[pwrOn]) |
        (!arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn] & elm.portAsByte[pwrOn])) {
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
        }
      } */
      if (idx > 0) {
        if (elm.portAsByte[pwrOn]) {
          if (!arr[idx - 1].portAsByte[pwrOn] & (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) { // 20191121 新增條件，避免在開機之前已經產生自動生產信號
            //if (over) return
            autoBeginArr.push(elm)
            //sectionArr.push(sectionFlg)
            prevSectionFlg = sectionFlg
          /*} else if (!arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn]) {
            //if (over) return
            //        autoBeginArr.push(elm)
            //sectionArr.push(sectionFlg)
            prevSectionFlg = sectionFlg // 若自動開始，因自動開始而分段，不須再因時間分段
            if ((arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn]) && (autoBeginArr.length > autoEndArr.length)) { // 20191111 add 避免瞬間切換
              autoEndArr.push(elm)
            } else if (!arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[autoOn]) {
              //autoEndArr.push(elm)
            } else if (!arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[autoOn]) { // 20200506增加
              autoEndArr.push(elm)
            }
            autoBeginArr.push(elm)*/
          } else if ((!arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) | (!arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn])) {
            //if (over) return
            //        autoBeginArr.push(elm)
            //sectionArr.push(sectionFlg)
            prevSectionFlg = sectionFlg // 若自動開始，因自動開始而分段，不須再因時間分段
            if (((arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn]) | (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn])) && (autoBeginArr.length > autoEndArr.length)) { // 20191111 add 避免瞬間切換
              autoEndArr.push(elm)
            } else if (arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[autoOn]) {
              autoEndArr.push(elm)
            } else if (arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[autoOn]) { // 20200506增加
              autoEndArr.push(elm)
            }
            autoBeginArr.push(elm)
          } else if ((arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) | (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn]) && (autoBeginArr.length > autoEndArr.length)) {
            autoEndArr.push(elm)
            prevSectionFlg = sectionFlg // 若自動結束，因自動結束分段，則不須因時間分段
            if (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn]) {
              autoBeginArr.push(elm)
            }
          } else if (((prevSectionFlg) !== sectionFlg) && (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) {
            if (!arr[idx - 1].portAsByte[moldCnt] & elm.portAsByte[moldCnt]) {
              if (autoBeginArr.length > autoEndArr.length) {
                autoEndArr.push(elm)
              }
              if (sectionFlg !== -1) {
                autoBeginArr.push(elm)
              }
              sectionArr.push(elm)
              prevSectionFlg = sectionFlg
              /* // console.log('This check')
              // console.log(elm)
              // console.log(sectionFlg) */
            }
          } else if (sectionFlg === -1) {
            /* // console.log('flag')
            // console.log(elm) */
          }
        } else if (autoBeginArr.length > autoEndArr.length) {
          /* // console.log('This occur')
          // console.log(sectionFlg)
          // console.log(prevSectionFlg)
          // console.log(autoBeginArr[autoEndArr.length]) */
          autoEndArr.push(elm)
        }
        // 手動紀錄
        if (moment(elm.Time).toDate() <= endTime) {
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
        }
      } else if (idx === 0) {
        // ----------------手動關機分段程序
        if (idxrFirstRalData > 0) {
          if (realData[idxrFirstRalData - 1].portAsByte[pwrOn] & !realData[idxrFirstRalData - 1].portAsByte[semiAutoOn] & !realData[idxrFirstRalData - 1].portAsByte[autoOn]) {
            manualBeginArr.push({Time: moment(from).toDate()})
          } else if (!realData[idxrFirstRalData - 1].portAsByte[pwrOn]) {
            powerBeginArr.push({Time: moment(from).toDate()})
          }
        } else {
          powerBeginArr.push({Time: moment(from).toDate()})
        }
        if (elm.portAsByte[pwrOn] & !elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) {
          if (powerBeginArr.length > powerEndArr.length) {
            if (moment(elm.Time).isBefore(moment(from).add(1, 'd').toDate())) {
              powerEndArr.push(elm)
            } else {
              powerEndArr.push({Time: moment(from).add(1, 'd').toDate()})
            }
          }
          if (manualBeginArr.length === manualEndArr.length) {
                manualBeginArr.push(elm)
          }
        } else if (elm.portAsByte[pwrOn] & (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) {
          if (powerBeginArr.length > powerEndArr.length) {
            if (moment(elm.Time).isBefore(moment(from).add(1, 'd').toDate())) {
              powerEndArr.push(elm)
            } else {
              powerEndArr.push({Time: moment(from).add(1, 'd').toDate()})
            }
          }
          if (manualBeginArr.length > manualEndArr.length) {
            if (moment(elm.Time).isBefore(moment(from).add(1, 'd').toDate())) {
              manualEndArr.push(elm)
            } else {
              manualEndArr.push({Time: moment(from).add(1, 'd').toDate()})
            }
          }
        } else if (!elm.portAsByte[pwrOn]) {
          if (manualBeginArr.length > manualEndArr.length) {
            manualEndArr.push(elm)
            powerBeginArr.push(elm)
          } else if (powerBeginArr.length === powerEndArr.length) {
            // powerBeginArr.push(elm) 20200810
            powerBeginArr.push({Time: moment(from).toDate()})
          }
        }
        // --------------------
        if (elm.portAsByte[pwrOn] & !elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) {
          // autoBeginArr.push(elm)
          // sectionArr.push(sectionFlg)
          // manualBeginArr.push(elm)
          if (idxrFirstRalData > 0) { // 日分割前8小時內確定在日分割的有效資料前一筆為關機，因此從日分割開始作為關機的起點，因不知要往前找多久才有關機前的動作
            /* if (!realData[idxrFirstRalData - 1].portAsByte[pwrOn]) { // 20200628 因判定手動關機往前提，這個部分變多餘
              manualBeginArr.push(elm)
              powerBeginArr.push({Time: moment(from).toDate()})
              powerEndArr.push(elm)
            } else { // 日分割前就已經手動了，不確定手動要往前搜尋多久才可以確定手動開始，因此由日分割處理
              manualBeginArr.push({Time: moment(from).toDate()})
            } */
          } else { // 當前的elm為原始陣列的第一筆，但表往前8小時沒變化，視為關機
            // manualBeginArr.push(elm)
            // powerBeginArr.push({Time: moment(from).toDate()})
            // powerEndArr.push(elm)
          }
        } else if (elm.portAsByte[pwrOn] & (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) { //  // 20191121 新增條件，避免在開機之前已經產生自動生產信號
          if (realData.indexOf(elm) > 0) {
            var prevElm = realData[realData.indexOf(elm) - 1]
            if (prevElm.portAsByte[pwrOn] & (prevElm.portAsByte[semiAutoOn] | prevElm.portAsByte[autoOn])) {
              // // console.log('WXYZAA')
              if (elm.portAsByte[moldCnt]) {
                // // console.log('WXYZBB')
                autoBeginArr.push(elm)//20200523
                sectionArr.push(sectionFlg)//20200523
                prevSectionFlg = sectionFlg//20200523
              }
            } else {
              /* // console.log('WXYZ')
              // console.log(elm)
              // console.log(prevElm) */
              autoBeginArr.push(elm)//20200523
              sectionArr.push(sectionFlg)//20200523
              prevSectionFlg = sectionFlg//20200523
            }
          } else {
            // // console.log('ABCD')
              // // console.log(elm)
          autoBeginArr.push(elm)//20200523
          sectionArr.push(sectionFlg)//20200523
          prevSectionFlg = sectionFlg//20200523
          }
        } else {
          
        }
      }
    })
    // var endTime = moment(from).add(1, 'days').add(10, 'minutes').toDate()
    if (autoBeginArr.length > autoEndArr.length) {
      var tempI = 0
      for (; tempI < (autoBeginArr.length - autoEndArr.length);) {
        /* // console.log(' Hello~QQQQQQQ')
      // console.log(tempI)
      // console.log(aDay[aDay.length - 1]) */
      autoEndArr.push(aDay[aDay.length - 1])
      //// console.log(autoEndArr)
      }
      //// console.log(realData[realData.length - 1])
    }
    // 手動
    console.log('RRRRRRRRR')
    console.log(manualBeginArr.length)
    console.log(manualEndArr.length)
    if (manualBeginArr.length > manualEndArr.length) {
      // manualEndArr.push({Time: endTime})
      if (moment.duration(moment(from).add(1, 'days').diff(moment(manualBeginArr[manualBeginArr.length - 1].Time))).minutes() > 180) {
        console.log('HUAZHAHA')
        manualEndArr.push({Time: manualBeginArr[manualBeginArr.length - 1].Time})
        powerBeginArr.push({Time: manualBeginArr[manualBeginArr.length - 1].Time})
      } else {
        manualEndArr.push({Time: moment(from).add(1, 'days').toDate()})
      }
    }
    // 關機
    if (aDay.length === 0) {
      powerBeginArr.push({Time: moment(from).toDate()})
      powerEndArr.push({Time: moment(from).add(1, 'days').toDate()})
    } else if (powerBeginArr.length > powerEndArr.length) {
      powerEndArr.push({Time: endTime})
    }
    // ----------------------------------------------------------------------------------------------
    for (i = 0; i < autoBeginArr.length; i++) {
      if (moment(autoBeginArr[i].Time).isAfter(moment(from).add(1, 'days'))) {
        continue
      }
      validMoldObj[i] = []
      validMoldObj[i] = aDay.filter(elm => {
        /*// console.log(autoBeginArr[i])
        // console.log(autoEndArr[i])
        // console.log('當前ID: ' + i)
        // console.log(autoBeginArr.length)
        // console.log(autoEndArr.length)*/
        if ((elm._id >= autoBeginArr[i]._id) && (elm._id <= autoEndArr[i]._id)) {
          return elm
        }
      })
      /*// console.log('validMoldObj[i].length')
      // console.log(autoBeginArr[i]._id)
      // console.log(autoEndArr[i]._id)
      // console.log(validMoldObj[i].length)*/
      var subDocs1 = []
      var active = false
      validMoldObjEdge[i] = []
      validMoldObjEdge[i] = validMoldObj[i].filter((elm, idx, arr) => {
        if (idx > 0) {
          //if (active) {
          if ((arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn]) || //20200527 add
            (arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & !arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn]) ||
            (arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[autoOn])) {
            if (!arr[idx - 1].portAsByte[moldCnt] & elm.portAsByte[moldCnt]) {
              subDocs1.push(elm)
              if (active) {
                return elm
              }
              active = true
            }/* else if (idx === (arr.length - 1)) { // 20191122 邊界條件，因時間分段點，或負緣產生前結束自動狀態
            if (elm.portAsByte[moldCnt]) {
              subDocs1.push(elm)
              return elm
            }
          }*/
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
              subDocs1.push(elm)
            } else {
              active = true
              subDocs1.push(elm)
            }
          }
        }
        if (elm.portAsByte[moldCnt]) {
          //active = true
        }
      })
      // --------------------------20190617 新增最短周期
      /* var subDocs1 = validMoldObj[i].filter((elm1, idx, subArr) => {
        if (idx > 0) {
          if (elm1.portAsByte[pwrOn] & (elm1.portAsByte[semiAutoOn] | elm1.portAsByte[autoOn]) & (elm1.portAsByte[moldCnt] & !subArr[idx - 1].portAsByte[moldCnt])) {// & !subArr[idx + 1].portAsByte[moldCnt])) {
            return elm1
          }
        }
      }) */
      var arr1 = []
      subDocs1.forEach((doc1, idx, arr) => { // validMoldObjEdge[i]
        if ((idx + 1) < arr.length) {
          var diff = moment.duration(moment(arr[idx + 1].Time).diff(moment(doc1.Time))).asMilliseconds()
          if (diff < 0) {
            //// console.log('-----------------')
            //// console.log(arr[idx + 1]._id + '   ' + moment(arr[idx + 1].Time))
           // // console.log(doc1._id + '   ' + moment(doc1.Time))
          } else {
            arr1.push(diff)
            //// console.log(diff)
          }
        }
      })
      //// console.log(Math.min( ...arr1 ))
      var min = 0
      if (arr1.length > 0) {
        min = Math.round(Math.min( ...arr1 ) / 100) / 10
      }
      // -------------------------- 20190617 新增最短周期 結束
      //// console.log(i + ' record data')
      //// console.log(autoBeginArr[i]) // 有效的開始時間
      //// console.log(autoEndArr[i]) // 有效的結束時間
      //// console.log(sectionArr[i])
      //// console.log(validMoldObjEdge[i].length) // 有效的射出模次
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: autoBeginArr[i].portAsByte[autoOn]?'全自動' : autoBeginArr[i].portAsByte[semiAutoOn] ? '半自動' : '手動',
        machineStatusType: autoBeginArr[i].portAsByte[autoOn]?'全自動' : autoBeginArr[i].portAsByte[semiAutoOn] ? '半自動' : '手動',
        trigTime: autoBeginArr[i].Time,
        lastTrigTime: autoEndArr[i].Time,
        moldCount: validMoldObjEdge[i].length,
        min: min
      })
      // 製作警報陣列
      var almValidMoldArr = [autoBeginArr[i]].concat(subDocs1, [autoEndArr[i]]) // validMoldObjEdge[i]
      var almCnt = almValidMoldArr.reduce((prev, elm, index, arr) => {
        if (index === 0) {
          return 0
        } else if (index > 0) {
          var local = validMoldObj[i].filter(oneData => {
            if ((oneData._id >= arr[index - 1]._id) && (oneData._id < elm._id)) { // =
              return elm
            }
          })
          var oneDataIdx = 0
          for (oneDataIdx = 0; oneDataIdx < local.length; oneDataIdx++) {
            if (local[oneDataIdx].portAsByte[semiAutoOn] | local[oneDataIdx].portAsByte[autoOn]) {
              if (local[oneDataIdx].portAsByte[almOn] && (moment(local[oneDataIdx].Time).isBefore(autoEndArr[i].Time))) {
                saveRecord.splice(saveRecord.length, 0, {
                  machineStatus: '警報',
                  machineStatusType: '警報-成型機',
                  trigTime: local[oneDataIdx].Time,
                  lastTrigTime: local[oneDataIdx].Time,
                  moldCount: 0
                })
                return prev + 1
              } else if (local[oneDataIdx].portAsByte[armAlmOn] && (moment(local[oneDataIdx].Time).isBefore(autoEndArr[i].Time))) {
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
      //// console.log('alarm count = ' + almCnt)
    }
    for (i = 0; i < manualBeginArr.length; i++) {
      if (moment(manualBeginArr[i].Time).isAfter(moment(from).add(1, 'days'))) {
        continue
      }
      //// console.log('manual record' + i)
      //// console.log(manualBeginArr[i])
      //// console.log(manualEndArr[i])
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: '手動',
        machineStatusType: '手動',
        trigTime: manualBeginArr[i].Time,
        lastTrigTime: manualEndArr[i].Time,
        moldCount: 0
      })
    }
    for (i = 0; i < powerBeginArr.length; i++) {
      if (moment(powerBeginArr[i].Time).isAfter(moment(from).add(1, 'days'))) {
        continue
      }
      //// console.log('manual record' + i)
      //// console.log(powerBeginArr[i])
      //// console.log(powerEndArr[i])
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: '關機',
        machineStatusType: '關機',
        trigTime: powerBeginArr[i].Time,
        lastTrigTime: powerEndArr[i].Time,
        moldCount: 0
      })
    }
    //// console.log(saveRecord)
    //makeDataRecord(machineID, saveRecord, from, function () {
      saveRecord.sort((a, b) => {
        return moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
      })
      if (moment(saveRecord[saveRecord.length - 1].lastTrigTime).isBefore(moment(moment(from).add(1, 'days').format('YYYY-MM-DD') + ' ' + initDoc[0], 'YYYY-MM-DD HH:mm'))) {
        saveRecord.splice(saveRecord.length, 0, {
          machineStatus: '關機',
          machineStatusType: '關機',
          trigTime: moment(saveRecord[saveRecord.length - 1].lastTrigTime).toDate(),
          lastTrigTime: moment(moment(from).add(1, 'days').format('YYYY-MM-DD') + ' ' + initDoc[0], 'YYYY-MM-DD HH:mm').toDate(),
          moldCount: 0
        })
        // console.log(saveRecord[saveRecord.length - 1])
        // console.log('aDayyyyyyyyyyyy')
      }
      callback(saveRecord)
    //})
    // console.log('aDay')
    // console.log(aDay[0])
  }
}
function constructAlarmRecordDaysExcept1A (realData, from, to, machineID, callback) {
  var diff = moment.duration(moment(to).diff(moment(from))).asDays()
  var i = 0
  var daysIdx = 0
  // console.log('constructAlarmRecordDays')
  // console.log(diff)
  // console.log(realData.length)
  for (i = 0; i < diff; i++) {
    var from1 = from
    constructAlarmRecordExcept1A(realData, moment(from1).add(i, 'days'), machineID, function (saveRecord) {
      // daysIdx++ 20191121刪
      // console.log('daysIdx')
      // console.log(from1)
      makeDataRecord(machineID, saveRecord, moment(from).add(i, 'days'), function () {
        daysIdx++
        if (daysIdx === diff) {
          callback()
        }
      })
    })
  }
}
function constructAlarmRecordExcept1A (realData, from, machineID, callback) {
  realData.sort((a, b) => {
    return (a._id > b._id) ? 1 : -1
  })
  if (realData.length === 0) {
    // console.log('No record data')
    callback([])
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
    var initDocKeys = (Object.keys(initDoc)).filter(elm => { return elm !== '_id'})
    // 確認是+8小時 還是utc之後即可
    // from 已經是經過日切割點處理的
    aDay = realData.filter(elm => {
      return ((moment(elm.Time).add(0, 'hours') >= moment(from)) && (moment(elm.Time).add(0, 'hours') < moment(from).add(1, 'days').add(10, 'minutes')))
    })
    var endTime = moment(from).add(1, 'days').toDate()
    var idxrFirstRalData = realData.indexOf(aDay[0])
    aDay.forEach((elm, idx, arr) => {
      var over = moment(elm.Time).isAfter(moment(from).add(1, 'days'))
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
            //if (over) return
            autoBeginArr.push(elm)
            //sectionArr.push(sectionFlg)
            prevSectionFlg = sectionFlg
          } else if ((!arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) | (!arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn])) {
            prevSectionFlg = sectionFlg // 若自動開始，因自動開始而分段，不須再因時間分段
            if (((arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn]) | (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn])) && (autoBeginArr.length > autoEndArr.length)) { // 20191111 add 避免瞬間切換
              autoEndArr.push(elm)
            } else if (arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[autoOn]) {
              autoEndArr.push(elm)
            } else if (arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[semiAutoOn] & elm.portAsByte[autoOn]) { // 20200506增加
              autoEndArr.push(elm)
            }
            autoBeginArr.push(elm)
          } else if ((arr[idx - 1].portAsByte[semiAutoOn] & !elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) | (arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn]) && (autoBeginArr.length > autoEndArr.length)) {
            autoEndArr.push(elm)
            prevSectionFlg = sectionFlg // 若自動結束，因自動結束分段，則不須因時間分段
            if (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn]) {
              autoBeginArr.push(elm)
            }
          } else if (((prevSectionFlg) !== sectionFlg) && (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) {
            if (!arr[idx - 1].portAsByte[moldCnt] & elm.portAsByte[moldCnt]) {
              if (autoBeginArr.length > autoEndArr.length) {
                autoEndArr.push(elm)
              }
              if (sectionFlg !== -1) {
                autoBeginArr.push(elm)
              }
              sectionArr.push(elm)
              prevSectionFlg = sectionFlg
            }
          } else if (sectionFlg === -1) {
            /* // console.log('flag')
            // console.log(elm) */
          }
        } else if (autoBeginArr.length > autoEndArr.length) {
          autoEndArr.push(elm)
        }
        // 手動紀錄
        if (moment(elm.Time).toDate() <= endTime) {
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
        }
      } else if (idx === 0) {
        // ----------------手動關機分段程序
        if (idxrFirstRalData > 0) {
          if (realData[idxrFirstRalData - 1].portAsByte[pwrOn] & !realData[idxrFirstRalData - 1].portAsByte[semiAutoOn] & !realData[idxrFirstRalData - 1].portAsByte[autoOn]) {
            manualBeginArr.push({Time: moment(from).toDate()})
          } else if (!realData[idxrFirstRalData - 1].portAsByte[pwrOn]) {
            powerBeginArr.push({Time: moment(from).toDate()})
          }
        } else {
          powerBeginArr.push({Time: moment(from).toDate()})
        }
        if (elm.portAsByte[pwrOn] & !elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) {
          if (powerBeginArr.length > powerEndArr.length) {
            if (moment(elm.Time).isBefore(moment(from).add(1, 'd').toDate())) {
              powerEndArr.push(elm)
            } else {
              powerEndArr.push({Time: moment(from).add(1, 'd').toDate()})
            }
          }
          if (manualBeginArr.length === manualEndArr.length) {
                manualBeginArr.push(elm)
          }
        } else if (elm.portAsByte[pwrOn] & (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) {
          if (powerBeginArr.length > powerEndArr.length) {
            if (moment(elm.Time).isBefore(moment(from).add(1, 'd').toDate())) {
              powerEndArr.push(elm)
            } else {
              powerEndArr.push({Time: moment(from).add(1, 'd').toDate()})
            }
          }
          if (manualBeginArr.length > manualEndArr.length) {
            if (moment(elm.Time).isBefore(moment(from).add(1, 'd').toDate())) {
              manualEndArr.push(elm)
            } else {
              manualEndArr.push({Time: moment(from).add(1, 'd').toDate()})
            }
          }
        } else if (!elm.portAsByte[pwrOn]) {
          if (manualBeginArr.length > manualEndArr.length) {
            manualEndArr.push(elm)
            powerBeginArr.push(elm)
          } else if (powerBeginArr.length === powerEndArr.length) {
            // powerBeginArr.push(elm) 20200810
            powerBeginArr.push({Time: moment(from).toDate()})
          }
        }
        // --------------------
        if (elm.portAsByte[pwrOn] & !elm.portAsByte[semiAutoOn] & !elm.portAsByte[autoOn]) {
          if (idxrFirstRalData > 0) { // 日分割前8小時內確定在日分割的有效資料前一筆為關機，因此從日分割開始作為關機的起點，因不知要往前找多久才有關機前的動作
          } else { // 當前的elm為原始陣列的第一筆，但表往前8小時沒變化，視為關機
          }
        } else if (elm.portAsByte[pwrOn] & (elm.portAsByte[semiAutoOn] | elm.portAsByte[autoOn])) { //  // 20191121 新增條件，避免在開機之前已經產生自動生產信號
          if (realData.indexOf(elm) > 0) {
            var prevElm = realData[realData.indexOf(elm) - 1]
            if (prevElm.portAsByte[pwrOn] & (prevElm.portAsByte[semiAutoOn] | prevElm.portAsByte[autoOn])) {
              if (elm.portAsByte[moldCnt]) {
                autoBeginArr.push(elm)//20200523
                sectionArr.push(sectionFlg)//20200523
                prevSectionFlg = sectionFlg//20200523
              }
            } else {
              autoBeginArr.push(elm)//20200523
              sectionArr.push(sectionFlg)//20200523
              prevSectionFlg = sectionFlg//20200523
            }
          } else {
          autoBeginArr.push(elm)//20200523
          sectionArr.push(sectionFlg)//20200523
          prevSectionFlg = sectionFlg//20200523
          }
        } else {
          
        }
      }
    })
    if (autoBeginArr.length > autoEndArr.length) {
      var tempI = 0
      for (; tempI < (autoBeginArr.length - autoEndArr.length);) {
      autoEndArr.push(aDay[aDay.length - 1])
      }
    }
    // 手動
    if (manualBeginArr.length > manualEndArr.length) {
      //manualEndArr.push({Time: manualBeginArr[manualBeginArr.length - 1].Time})
      //powerBeginArr.push({Time: manualBeginArr[manualBeginArr.length - 1].Time})
      if (moment.duration(moment(from).add(1, 'days').diff(moment(manualBeginArr[manualBeginArr.length - 1].Time))).minutes() > 180) {
        console.log('HUAZHAHA')
        manualEndArr.push({Time: manualBeginArr[manualBeginArr.length - 1].Time})
        powerBeginArr.push({Time: manualBeginArr[manualBeginArr.length - 1].Time})
      } else {
        manualEndArr.push({Time: moment(from).add(1, 'days').toDate()})
      }
    }
    // 關機
    if (aDay.length === 0) {
      powerBeginArr.push({Time: moment(from).toDate()})
      powerEndArr.push({Time: moment(from).add(1, 'days').toDate()})
    } else if (powerBeginArr.length > powerEndArr.length) {
      powerEndArr.push({Time: endTime})
    }
    // ----------------------------------------------------------------------------------------------
    for (i = 0; i < autoBeginArr.length; i++) {
      if (moment(autoBeginArr[i].Time).isAfter(moment(from).add(1, 'days'))) {
        continue
      }
      validMoldObj[i] = []
      validMoldObj[i] = aDay.filter(elm => {
        if ((elm._id >= autoBeginArr[i]._id) && (elm._id <= autoEndArr[i]._id)) {
          return elm
        }
      })
      var subDocs1 = []
      var active = false
      validMoldObjEdge[i] = []
      validMoldObjEdge[i] = validMoldObj[i].filter((elm, idx, arr) => {
        if (idx > 0) {
          if ((arr[idx - 1].portAsByte[autoOn] & elm.portAsByte[autoOn]) || //20200527 add
            (arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[semiAutoOn] & !arr[idx - 1].portAsByte[autoOn] & !elm.portAsByte[autoOn]) ||
            (arr[idx - 1].portAsByte[semiAutoOn] & elm.portAsByte[autoOn])) {
            if (!arr[idx - 1].portAsByte[moldCnt] & elm.portAsByte[moldCnt]) {
              subDocs1.push(elm)
              if (active) {
                return elm
              }
              active = true
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
              subDocs1.push(elm)
            } else {
              active = true
              subDocs1.push(elm)
            }
          }
        }
        if (elm.portAsByte[moldCnt]) {
        }
      })
      // --------------------------20190617 新增最短周期
      var arr1 = []
      subDocs1.forEach((doc1, idx, arr) => { // validMoldObjEdge[i]
        if ((idx + 1) < arr.length) {
          var diff = moment.duration(moment(arr[idx + 1].Time).diff(moment(doc1.Time))).asMilliseconds()
          if (diff < 0) {
          } else {
            arr1.push(diff)
          }
        }
      })
      var min = 0
      if (arr1.length > 0) {
        min = Math.round(Math.min( ...arr1 ) / 100) / 10
      }
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: autoBeginArr[i].portAsByte[autoOn]?'全自動' : autoBeginArr[i].portAsByte[semiAutoOn] ? '半自動' : '手動',
        machineStatusType: autoBeginArr[i].portAsByte[autoOn]?'全自動' : autoBeginArr[i].portAsByte[semiAutoOn] ? '半自動' : '手動',
        trigTime: autoBeginArr[i].Time,
        lastTrigTime: autoEndArr[i].Time,
        moldCount: validMoldObjEdge[i].length,
        min: min
      })
      // 製作警報陣列
      var almValidMoldArr = [autoBeginArr[i]].concat(subDocs1, [autoEndArr[i]]) // validMoldObjEdge[i]
      var almCnt = almValidMoldArr.reduce((prev, elm, index, arr) => {
        if (index === 0) {
          return 0
        } else if (index > 0) {
          var local = validMoldObj[i].filter(oneData => {
            if ((oneData._id >= arr[index - 1]._id) && (oneData._id < elm._id)) { // =
              return elm
            }
          })
          var oneDataIdx = 0
          for (oneDataIdx = 0; oneDataIdx < local.length; oneDataIdx++) {
            if (local[oneDataIdx].portAsByte[semiAutoOn] | local[oneDataIdx].portAsByte[autoOn]) {
              if (local[oneDataIdx].portAsByte[almOn] && (moment(local[oneDataIdx].Time).isBefore(autoEndArr[i].Time))) {
                saveRecord.splice(saveRecord.length, 0, {
                  machineStatus: '警報',
                  machineStatusType: '警報-成型機',
                  trigTime: local[oneDataIdx].Time,
                  lastTrigTime: local[oneDataIdx].Time,
                  moldCount: 0
                })
                return prev + 1
              } else if (local[oneDataIdx].portAsByte[armAlmOn] && (moment(local[oneDataIdx].Time).isBefore(autoEndArr[i].Time))) {
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
    }
    for (i = 0; i < manualBeginArr.length; i++) {
      if (moment(manualBeginArr[i].Time).isAfter(moment(from).add(1, 'days'))) {
        continue
      }
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: '手動',
        machineStatusType: '手動',
        trigTime: manualBeginArr[i].Time,
        lastTrigTime: manualEndArr[i].Time,
        moldCount: 0
      })
    }
    for (i = 0; i < powerBeginArr.length; i++) {
      if (moment(powerBeginArr[i].Time).isAfter(moment(from).add(1, 'days'))) {
        continue
      }
      saveRecord.splice(saveRecord.length, 0, {
        machineStatus: '關機',
        machineStatusType: '關機',
        trigTime: powerBeginArr[i].Time,
        lastTrigTime: powerEndArr[i].Time,
        moldCount: 0
      })
    }
      saveRecord.sort((a, b) => {
        return moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
      })
      if (moment(saveRecord[saveRecord.length - 1].lastTrigTime).isBefore(moment(moment(from).add(1, 'days').format('YYYY-MM-DD') + ' ' + initDoc[0], 'YYYY-MM-DD HH:mm'))) {
        saveRecord.splice(saveRecord.length, 0, {
          machineStatus: '關機',
          machineStatusType: '關機',
          trigTime: moment(saveRecord[saveRecord.length - 1].lastTrigTime).toDate(),
          lastTrigTime: moment(moment(from).add(1, 'days').format('YYYY-MM-DD') + ' ' + initDoc[0], 'YYYY-MM-DD HH:mm').toDate(),
          moldCount: 0
        })
      }
      callback(saveRecord)
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
// ------------------------------------自動創建
var firstDailyPoint = '08:00'
const schedule = require('./node_modules/node-schedule/lib/schedule.js')
// const schedule = require('node-shedule')
// const sinon = require('sinon')
// const clock = sinon.useFakeTimers(Date.now())
//initTimer()
function initTimer() {
 // console.log('The first row')
 let rule = new schedule.RecurrenceRule()
 rule.second = 0
 let job = schedule.scheduleJob(rule, function () {
   if ((moment().minute() % 15) === 0) {
    // console.log('success')
    autoBuild()
   }
 // // console.log(moment().minute())
  })
 return job
}
function autoBuild () {
  //var to = moment(moment(from).add(1,'day').format('YYYY-MM-DD') + ' ' + firstDailyPoint).toDate()
  var from = moment(moment().format('YYYY-MM-DD') + ' ' + firstDailyPoint).toDate()
  var to = moment().toDate()
  if (to < from) {
    from = moment(from).subtract(1, 'day').toDate()
  }
  // console.log(to)
  // console.log(from)
  // console.log(moment(from).subtract(1, 'day').toDate())
  getMachineParamArr(function(machineIDs) {
    machineIDs.forEach(machineID => {
      buildTableByRealDataTimer(machineID, from, to)
    })
  })
}
function getMachineParamArr(callback) {
  callback(['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'])
}
function buildTableByRealDataTimer (machineID, from, to)
{
  // var dateStr = machineID + moment(from).format('YYYYMMDD')
  // var diff = moment.duration(moment(to).diff(moment(from))).days()
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
    } else {
      getMachineRecords (client, machineID, from, to, function(docs1) {
          client.close()
          // constructAlarmRecord(docs1, from, machineID)
          //if (docs1.length === 0) {
          //} else {
            constructAlarmRecordDaysTimer (docs1, from, to, machineID, function () {
            })
          //}
      })
    }
  })
}
function constructAlarmRecordDaysTimer (realData, from, to, machineID, callback) {
  var diff = moment.duration(moment(to).diff(moment(from))).asDays()
  var i = 0
  var daysIdx = 0
  // console.log('constructAlarmRecordDaysTimer')
  // console.log(diff)
  // console.log(realData.length)
  for (i = 0; i < diff; i++) {
    constructAlarmRecord(realData, moment(from).add(i, 'days'), machineID, function (saveRecord) {
      daysIdx++
      // console.log(daysIdx)
      compareDataRecord(machineID, saveRecord, from, to, function () {
        daysIdx++
        if (daysIdx === diff) {
          callback()
        }
      })
    })
  }
}
function compareDataRecord(machineID, saveRecord, from, to, callback0) {
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
        // var to = moment(from).add(1, 'days').toDate()
        // console.log(from0)
        // console.log(to)
        client.db(config.dbName).collection('machineRecord' + callback[0]).find({trigTime: {$gte: from0, $lt: to}}).toArray(function (err1, docs) { // trigTime: {$gte: from, $lt: to}
          if (saveRecord.length === 0) {
            // console.log('makeDataRecord length === 0')
            // client.db(config.dbName).collection('machineRecord' + callback[0]).find({trigTime: {$gte: from0}}).toArray(function(err1, docs1) {
              // console.log(to)
              if (docs.length === 0) {
                client.db(config.dbName).collection('machineRecord' + callback[0]).insertOne({
                  machineStatus: '關機',
                  machineStatusType: '關機',
                  trigTime: from0,
                  lastTrigTime: to,
                  moldCount: 0
                }, function () {
                  client.close()
                  callback0()
                })
              } else {
              client.db(config.dbName).collection('machineRecord' + callback[0]).findOneAndUpdate({trigTime: {$lte: from0}, machineStatus: {$ne: '警報'}}, {$set: {lastTrigTime: to}}, {sort: {trigTime: -1 }}, function (err9, ddd) {
                client.close()
                callback0()
              })
            }
          } else {
            var lackDocs = saveRecord.filter(elm => {
              if (!docs.some(doc => { return ((moment(elm.trigTime) === moment(doc.trigTime)) && (elm.machineStatusType === doc.machineStatusType)) ? true : false})) {
                return elm
              }
            })
            var updateDocs = saveRecord.filter(elm => {
              if (docs.some(doc => { return ((moment(elm.trigTime) === moment(doc.trigTime)) && (elm.machineStatusType === doc.machineStatusType) && (moment(elm.lastTrigTime) > moment(doc.lastTrigTime))) ? true : false})) {
                return elm
              }
            })
            updateDocs.forEach(elm => {
              client.db(config.dbName).collection('machineRecord' + callback[0]).updateOne({trigTime: elm.trigTime, machineStatusType: elm.machineStatusType}, {$set: {lastTrigTime: elm.lastTrigTime}})
            })
            /* client.db(config.dbName).collection('machineRecord' + callback[0]).insertMany(lackDocs, function () {
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