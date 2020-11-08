var moment = require('moment')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var minPeriodFindAndUpdateProcess = require('./minPeriodFindAndUpdateProcess.js')
exports.buildTableByRealData = buildTableByRealData // 創建新資料表用
exports.getMachineRecordsWA = getMachineRecordsWA
exports.getMachineRecords = getMachineRecords
exports.getMachineAlarmRecords = getMachineAlarmRecords
exports.getMachineRecordsNew = getMachineRecordsNew
exports.setOrderNumber = setOrderNumber
exports.setMoldNumber = setMoldNumber
exports.failToClrOrderNumber = failToClrOrderNumber
exports.clrOrderNumber = clrOrderNumber
exports.getRegisterCompare = getRegisterCompare
exports.getRegisterCompareAlm = getRegisterCompareAlm
exports.getRegisterCompareExcept1A = getRegisterCompareExcept1A
exports.getRegisterCompareAlmExcept1A = getRegisterCompareAlmExcept1A
exports.coptToMachineDB = coptToMachineDB
exports.deleteToMachineDB = deleteToMachineDB
exports.clrMulOrderNumber = clrMulOrderNumber
exports.deleteAllToMachineDB = deleteAllToMachineDB
exports.copyAllToMachineDB = copyAllToMachineDB
exports.clrRegisterAlmRecordAll = clrRegisterAlmRecordAll
exports.getOrderList = getOrderList
addMachineId()
function addMachineId () {
  var tgtMids = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
  var idx = 0
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
    } else {
      tgtMids.forEach(tgtMid => {
      client.db(config.dbName).collection(tgtMid).updateMany({}, {$set: {'machineID': tgtMid}}).then(() => {
        idx++
        if (tgtMids.length === idx) {
          client.close()
        }
      })
    })
    }
  })
}
function correct () {
  var tgtMid = '1A01'
  var str1 = '2020-05-22 23:00:01'
  var str2 = '2020-05-22 23:00:02'
  var str3 = ''
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
    } else {
      client.db(config.dbName).collection('hwCFG').find({machineID: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          str3 = elm.propertyNum
          // console.log(tgtMid + ': ' + str3)      
        
          client.db(config.dbName).collection('machineRecord' + str3).find({trigTime: {$gte: moment(str1, 'YYYY-MM-DD HH:mm:ss').toDate(), $lt: moment(str2, 'YYYY-MM-DD HH:mm:ss').toDate()},  $or: [{machineStatusType: '全自動'}, {machineStatusType: '半自動'}, {machineStatusType: '手動'}]}).toArray(function (err, docs) {
            // console.log('docs')
// console.log(docs)
            if (docs.length > 0) {
              client.db(config.dbName).collection(tgtMid).find({trigTime: {$gte: moment(str1, 'YYYY-MM-DD HH:mm:ss').toDate(), $lt: moment(str2, 'YYYY-MM-DD HH:mm:ss').toDate()},  $or: [{machineStatusType: '全自動'}, {machineStatusType: '半自動'}, {machineStatusType: '手動'}]}).toArray(function (err1, docs1) {
  // console.log('docs1')
  // console.log(docs1)
  client.db(config.dbName).collection(tgtMid).findOneAndUpdate({_id: ObjectID(docs1[0]._id)}, {$set: {trigTime: docs[0].trigTime, lastTrigTime: docs[0].lastTrigTime, min: docs[0].min, machineStatusType: docs[0].machineStatusType, moldCount: docs[0].moldCount}}, {returnOriginal: false}, function (err0, doc) {
    var t = doc.value
    for(var v = 1; v<docs.length; v++) {
      delete t._id
  t.lastTrigTime = docs[v].lastTrigTime
  t.trigTime = docs[v].trigTime
  t.moldCount = docs[v].moldCount
  t.min = docs[v].min
  t.machineStatusType = docs[v].machineStatusType
  client.db(config.dbName).collection(tgtMid).insertOne(t)
  }
  // console.log('YYYYYYYYYYYYYYY')
  // console.log(t)
                client.close()
  })
        })
      }
      })
    })
  })
  }
  })
}
//copy()
function copy () {
  var tgtMid = '1A05'
  var str1 = '2020-01-06 08:00:00'
  var str2 = '2020-01-08 08:00:00'
  var str3 = ''
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
    } else {
      client.db(config.dbName).collection('hwCFG').find({machineID: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          str3 = elm.propertyNum
          // console.log(tgtMid + ': ' + str3)      
        
          client.db(config.dbName).collection('machineRecord' + str3).find({trigTime: {$gte: moment(str1, 'YYYY-MM-DD HH:mm:ss').toDate(), $lt: moment(str2, 'YYYY-MM-DD HH:mm:ss').toDate()}}).toArray(function (err, docs) {
            client.db(config.dbName).collection(tgtMid).deleteMany({trigTime: {$gte: moment(str1, 'YYYY-MM-DD HH:mm:ss').toDate(), $lt: moment(str2, 'YYYY-MM-DD HH:mm:ss').toDate()}})
            client.db(config.dbName).collection(tgtMid).insertMany(docs)
  // console.log('docs')
  // console.log(docs.length)
                client.close()
          })
        })
  })
  }
  })
}
function getRegisterCompare (machineID, from, to, res) {
  var tgtMid = machineID
  var sendBack = []
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: sendBack
      })
    } else {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          // console.log(tgtMid + ': ' + str3)      
        
          client.db(config.dbName).collection('machineRecord' + str3).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '全自動'}, {machineStatusType: '半自動'}, {machineStatusType: '手動'}, {machineStatusType: '關機'}]}).sort({ trigTime: 1 }).toArray(function (err, docs) {
            // console.log('docs')
            //// console.log(docs)
            if (docs.length > 0) {
              client.db(config.dbName).collection(tgtMid.indexOf('1A') > -1 ? tgtMid : (str3 + 'Report')).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '全自動'}, {machineStatusType: '半自動'}, {machineStatusType: '手動'}, {machineStatusType: '關機'}]}).sort({ trigTime: 1 }).toArray(function (err1, docs1) {
                // console.log('docs1')
                //// console.log(docs1)
                docs.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                docs1.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                client.close()
                if (docs.length < docs1.length) {
                  docs1.forEach((doc1, idx) => {
                    if (idx < docs.length) {
                      if (moment(doc1.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        moment(doc1.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc1.moldCount !== docs[idx].moldCount ||
                        doc1.machineStatusType !== docs[idx].machineStatusType
                        ) {
                          if (doc1.trigTime !== docs[idx].trigTime) {
                            // console.log(1111111111111)
                          }
                          if (doc1.lastTrigTime !== docs[idx].lastTrigTime) {
                            // console.log(222222222222222)
                          }
                          if (doc1.moldCount !== docs[idx].moldCount) {
                            // console.log(333333333333333)
                          }
                        sendBack.push(doc1)
                        sendBack.push(docs[idx])
                        // console.log(doc1)
                        // console.log(docs[idx])
                      }
                    } else {
                      sendBack.push(doc1)
                    }
                  })
                } else {
                  docs.forEach((doc, idx) => {
                    if (idx < docs1.length) {
                      if (moment(doc.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                      moment(doc.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc.moldCount !== docs1[idx].moldCount ||
                        doc.machineStatusType !== docs1[idx].machineStatusType
                        ) {
                          if (moment(doc.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS')) {
                            // console.log(1111111111111)
                          }
                          if (moment(doc.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS')) {
                            // console.log(222222222222222)
                          }
                          if (doc.moldCount !== docs1[idx].moldCount) {
                            // console.log(333333333333333)
                          }
                          sendBack.push(doc)
                          sendBack.push(docs1[idx])
                          // console.log(doc.trigTime)
                          // console.log(docs1[idx].trigTime)
                      }
                    } else {
                      sendBack.push(doc)
                    }
                  })
                }
                // console.log(sendBack.length)
                // console.log(docs.length)
                // console.log(docs1.length)
                res.send({
                  type: true,
                  data: sendBack
                })
              })
            } else {
              res.send({
                type: true,
                data: sendBack
              })
            }
          })
        })
      })
    }
  })
}
function getRegisterCompareAlm (machineID, from, to, res) {
  var tgtMid = machineID
  var sendBack = []
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: sendBack
      })
    } else {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          // console.log(tgtMid + ': ' + str3)      
        
          client.db(config.dbName).collection('machineRecord' + str3).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '警報-機械手'}, {machineStatusType: '警報-成型機'}]}).sort({ trigTime: 1 }).toArray(function (err, docs) {
            if (docs.length > 0) {
              client.db(config.dbName).collection(tgtMid.indexOf('1A') > -1 ? tgtMid : (str3 + 'Report')).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '警報-機械手'}, {machineStatusType: '警報-成型機'}]}).sort({ trigTime: 1 }).toArray(function (err1, docs1) {
                docs.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                docs1.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                client.close()
                if (docs.length < docs1.length) {
                  docs1.forEach((doc1, idx) => {
                    if (idx < docs.length) {
                      if (moment(doc1.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        moment(doc1.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc1.machineStatusType !== docs[idx].machineStatusType
                        ) {
                        if (Math.abs(moment.duration(moment(docs[idx].trigTime).diff(moment(doc1.trigTime)))) > 2000) {
                          sendBack.push(doc1)
                          sendBack.push(docs[idx])
                          // console.log(doc1)
                          // console.log(docs[idx])
                          // console.log(Math.abs(moment.duration(moment(docs[idx].trigTime).diff(moment(doc1.trigTime)))))
                        }
                      }
                    } else {
                      sendBack.push(doc1)
                    }
                  })
                } else {
                  docs.forEach((doc, idx) => {
                    if (idx < docs1.length) {
                      if (moment(doc.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                      moment(doc.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc.machineStatusType !== docs1[idx].machineStatusType
                        ) {
                          if (Math.abs(moment.duration(moment(docs1[idx].trigTime).diff(moment(doc.trigTime)))) > 1000) {
                          sendBack.push(doc)
                          sendBack.push(docs1[idx])
                          // console.log(doc.trigTime)
                          // console.log(docs1[idx].trigTime)
                          // console.log(Math.abs(moment.duration(moment(docs1[idx].trigTime).diff(moment(doc.trigTime)))))
                          }
                      }
                    } else {
                      sendBack.push(doc)
                    }
                  })
                }
                // console.log(sendBack.length)
                // console.log(docs.length)
                // console.log(docs1.length)
                res.send({
                  type: true,
                  data: sendBack
                })
              })
            } else {
              res.send({
                type: true,
                data: docs
              })
            }
          })
        })
      })
    }
  })
}
function clrRegisterAlmRecordAll (machineID, from, to, socket) {
  var tgtMid = machineID
  var sendBack = []
  console.log(5555)
  console.log(from)
  console.log(to)
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      socket.emit('clrAlmRecordAllErr', '')
    } else {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          // client.db(config.dbName).collection(tgtMid.indexOf('1A') > -1 ? tgtMid : (str3 + 'Report')).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '警報-機械手'}, {machineStatusType: '警報-成型機'}]}).sort({ trigTime: 1 }).toArray(function (err1, docs1) {
          client.db(config.dbName).collection(tgtMid.indexOf('1A') > -1 ? tgtMid : (str3 + 'Report')).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '警報-機械手'}, {machineStatusType: '警報-成型機'}]}).count(function (err, y) {
          console.log('POIUY ' + y)
          var str3 = elm.data
          client.db(config.dbName).collection(tgtMid.indexOf('1A') > -1 ? tgtMid : (str3 + 'Report')).deleteMany({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '警報-機械手'}, {machineStatusType: '警報-成型機'}]}, function (err, t) {    
          client.close()
        socket.emit('clrAlmRecordAllSuccess', '')
        })
      })
        })
        
      })
    }
  })
}
function getRegisterCompareExcept1A (machineID, from, to, res) {
  var tgtMid = machineID
  var sendBack = []
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: sendBack
      })
    } else {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          console.log(tgtMid + ': ' + str3)      
        
          client.db(config.dbName).collection('machineRecord' + str3).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '全自動'}, {machineStatusType: '半自動'}, {machineStatusType: '手動'}, {machineStatusType: '關機'}]}).sort({ trigTime: 1 }).toArray(function (err, docs) {
            console.log(docs.length)  
            if (docs.length > 0) {
              client.db(config.dbName).collection(str3 + 'Report').find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '全自動'}, {machineStatusType: '半自動'}, {machineStatusType: '手動'}, {machineStatusType: '關機'}]}).sort({ trigTime: 1 }).toArray(function (err1, docs1) {
                console.log(docs1.length)  
                docs.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                docs1.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                client.close()
                if (docs.length < docs1.length) {
                  docs1.forEach((doc1, idx) => {
                    if (idx < docs.length) {
                      if (moment(doc1.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        moment(doc1.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc1.moldCount !== docs[idx].moldCount ||
                        doc1.machineStatusType !== docs[idx].machineStatusType
                        ) {
                          if (doc1.trigTime !== docs[idx].trigTime) {
                            // console.log(1111111111111)
                          }
                          if (doc1.lastTrigTime !== docs[idx].lastTrigTime) {
                            // console.log(222222222222222)
                          }
                          if (doc1.moldCount !== docs[idx].moldCount) {
                            // console.log(333333333333333)
                          }
                        sendBack.push(doc1)
                        sendBack.push(docs[idx])
                        // console.log(doc1)
                        // console.log(docs[idx])
                      }
                    } else {
                      sendBack.push(doc1)
                    }
                  })
                } else {
                  docs.forEach((doc, idx) => {
                    if (idx < docs1.length) {
                      if (moment(doc.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                      moment(doc.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc.moldCount !== docs1[idx].moldCount ||
                        doc.machineStatusType !== docs1[idx].machineStatusType
                        ) {
                          if (moment(doc.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS')) {
                            // console.log(1111111111111)
                          }
                          if (moment(doc.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS')) {
                            // console.log(222222222222222)
                          }
                          if (doc.moldCount !== docs1[idx].moldCount) {
                            // console.log(333333333333333)
                          }
                          sendBack.push(doc)
                          sendBack.push(docs1[idx])
                      }
                    } else {
                      sendBack.push(doc)
                    }
                  })
                }
                res.send({
                  type: true,
                  data: sendBack
                })
              })
            } else {
              res.send({
                type: true,
                data: sendBack
              })
            }
          })
        })
      })
    }
  })
}
function getRegisterCompareAlmExcept1A (machineID, from, to, res) {
  var tgtMid = machineID
  var sendBack = []
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: sendBack
      })
    } else {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          console.log(tgtMid + ': ' + str3)      
        
          client.db(config.dbName).collection('machineRecord' + str3).find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '警報-機械手'}, {machineStatusType: '警報-成型機'}]}).sort({ trigTime: 1, lastTrigTime: 1 }).toArray(function (err, docs) {
            console.log(docs.length)  
            if (docs.length > 0) {
              client.db(config.dbName).collection(str3 + 'Report').find({trigTime: {$gte: from, $lt: to},  $or: [{machineStatusType: '警報-機械手'}, {machineStatusType: '警報-成型機'}]}).sort({ trigTime: 1, lastTrigTime: 1 }).toArray(function (err1, docs1) {
                console.log(docs1.length)  
                docs.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                docs1.sort((a, b) => {
                  return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : moment(a.trigTime).isAfter(moment(b.trigTime)) ? 1 : moment(a.lastTrigTime).isBefore(moment(b.lastTrigTime)) ? -1 : 1
                })
                client.close()
                if (docs.length < docs1.length) {
                  docs1.forEach((doc1, idx) => {
                    if (idx < docs.length) {
                      if (moment(doc1.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        moment(doc1.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc1.machineStatusType !== docs[idx].machineStatusType
                        ) {
                        if (Math.abs(moment.duration(moment(docs[idx].trigTime).diff(moment(doc1.trigTime)))) > 2000) {
                          sendBack.push(doc1)
                          sendBack.push(docs[idx])
                        }
                      }
                    } else {
                      sendBack.push(doc1)
                    }
                  })
                } else {
                  docs.forEach((doc, idx) => {
                    if (idx < docs1.length) {
                      if (moment(doc.trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].trigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                      moment(doc.lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') !== moment(docs1[idx].lastTrigTime).format('YYYY-MM-DD HH:mm:ss:SSS') ||
                        doc.machineStatusType !== docs1[idx].machineStatusType
                        ) {
                          if (Math.abs(moment.duration(moment(docs1[idx].trigTime).diff(moment(doc.trigTime)))) > 1000) {
                          sendBack.push(doc)
                          sendBack.push(docs1[idx])
                        }
                      }
                    } else {
                      sendBack.push(doc)
                    }
                  })
                }
                res.send({
                  type: true,
                  data: sendBack
                })
              })
            } else {
              res.send({
                type: true,
                data: sendBack
              })
            }
          })
        })
      })
    }
  })
}
function getMachineRecords (machineID, from, to, res) {
  var needToCheck = true
  console.log('122364')
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    } else {
      /*if (machineID === '1B04') { // 20191111 add
        machineID = 'PIPI08Report'
        needToCheck = false
      } else if (machineID === '1B03') { // 20191111 add
        machineID = 'PIPI98Report'
        needToCheck = false
      } else if (machineID === '1B02') { // 20191111 add
        machineID = 'PIPI97Report'
        needToCheck = false
      } else if (machineID === '1B01') { // 20191111 add
        machineID = 'PIPI96Report'
        needToCheck = false
      }*/
      client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          console.log(str3 + 'Report')
      var col = client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report'))
      // col.find({Trig_Time: {$gte: date}}).toArray(function (err, docs) {
      // col.find().toArray(function (err, docs) {
      //col.find({trigTime: {$gte: from, $lt: to}, $and: [{machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) {
      col.find({trigTime: {$gte: from, $lt: to}, $and: [{machineStatusType: {$ne: '警報-通信'}}, {machineStatusType: {$ne: '警報-成型機'}}, {machineStatusType: {$ne: '警報-機械手'}}]}).toArray(function (err, docs) {
          client.close()
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else if (docs.length === 0) {
          res.send({
            type: false,
            data: '沒有機台資料'
          })
        } else {
          var sum1 = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '警報-通信') ? acc + 1 : acc
          }, 0)
          var sum = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '系統啟動') ? acc + 1 : acc
          }, 0)
          docs.forEach(doc => {
            if (doc['orderNumber'] === undefined) {
              doc['orderNumber'] = ''
            }
            var durationStr // = doc['durationStr'].split(':') 20191111 add
            if (doc.hasOwnProperty('durationStr')) {
              durationStr = doc['durationStr'].split(':')
            } else {
              // durationStr = (doc.lastTrigTime - doc.trigTime).split(':')
              durationStr = ('00:00:00').split(':')
            }
            var sec = parseInt(durationStr[2])
            var min = parseInt(durationStr[1])
            var hour = parseInt(durationStr[0])
            var secStr = (sec < 10) ? '0' + String(sec) : String(sec)
            var minStr = (min < 10) ? '0' + String(min) : String(min)
            var hourStr = (hour < 10) ? '0' + String(hour) : String(hour)
            doc['durationStrCor'] = hourStr + ':' + minStr + ':' + secStr
          })
          // // console.log(JSON.stringify(docs, null, 2))
          // console.log('警報-通信: ' + sum1)
          // console.log('系統啟動: ' + sum)
          //console.log('docs.length')
          //console.log(docs.length)
          /*res.send({
            type: true,
            data: docs
          })*/
          if (!needToCheck || (machineID.indexOf('1A') === -1)) {
            res.send({
              type: true,
              data: docs
            })
          } else if ((sum > 10) || (sum1 > 10)) {
            var retArr = []
            retArr = docs.filter(doc => {
              if ((doc['machineStatusType'] !== '系統啟動') && (doc['machineStatusType'] !== '警報-通信')) {
                return doc
              }
            })
            minPeriodFindAndUpdateProcess.minPeriodConstruct(machineID, from, to, retArr, function(sendBack) {
              res.send({
                type: true,
                data: sendBack
              })
            })
          } else {
            minPeriodFindAndUpdateProcess.minPeriodConstruct(machineID, from, to, docs, function(sendBack) {
              res.send({
                type: true,
                data: sendBack
              })
            })
          }
        }
        // db.close()
      })
        })
      })
    }
  })
}
function getMachineRecordsWA (machineID, from, to, res) {
  var needToCheck = true
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    } else {
      /* if (machineID === '1B04') { // 20191111 add
        machineID = 'PIPI08Report'
        needToCheck = false
      } else if (machineID === '1B03') { // 20191111 add
        machineID = 'PIPI98Report'
        needToCheck = false
      } else if (machineID === '1B02') { // 20191111 add
        machineID = 'PIPI97Report'
        needToCheck = false
      } else if (machineID === '1B01') { // 20191111 add
        machineID = 'PIPI96Report'
        needToCheck = false
      } */
      client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
      var col = client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report'))
      // col.find({Trig_Time: {$gte: date}}).toArray(function (err, docs) {
      // col.find().toArray(function (err, docs) {
      col.find({trigTime: {$gte: from, $lt: to}, $and: [{machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) {
      //col.find({trigTime: {$gte: from, $lt: to}, $and: [{machineStatusType: {$ne: '警報-通信'}}, {machineStatusType: {$ne: '警報-成型機'}}, {machineStatusType: {$ne: '警報-機械手'}}]}).toArray(function (err, docs) {
          client.close()
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else if (docs.length === 0) {
          res.send({
            type: false,
            data: '沒有機台資料'
          })
        } else {
          var sum1 = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '警報-通信') ? acc + 1 : acc
          }, 0)
          var sum = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '系統啟動') ? acc + 1 : acc
          }, 0)
          docs.forEach(doc => {
            if (doc['orderNumber'] === undefined) {
              doc['orderNumber'] = ''
            }
            var durationStr // = doc['durationStr'].split(':') 20191111 add
            if (doc.hasOwnProperty('durationStr')) {
              durationStr = doc['durationStr'].split(':')
            } else {
              // durationStr = (doc.lastTrigTime - doc.trigTime).split(':')
              durationStr = ('00:00:00').split(':')
            }
            var sec = parseInt(durationStr[2])
            var min = parseInt(durationStr[1])
            var hour = parseInt(durationStr[0])
            var secStr = (sec < 10) ? '0' + String(sec) : String(sec)
            var minStr = (min < 10) ? '0' + String(min) : String(min)
            var hourStr = (hour < 10) ? '0' + String(hour) : String(hour)
            doc['durationStrCor'] = hourStr + ':' + minStr + ':' + secStr
          })
          // // console.log(JSON.stringify(docs, null, 2))
          // console.log('警報-通信: ' + sum1)
          // console.log('系統啟動: ' + sum)
          res.send({
            type: true,
            data: docs
          })
          /*if (!needToCheck) {
            res.send({
              type: true,
              data: docs
            })
          } else if ((sum > 10) || (sum1 > 10)) {
            var retArr = []
            retArr = docs.filter(doc => {
              if ((doc['machineStatusType'] !== '系統啟動') && (doc['machineStatusType'] !== '警報-通信')) {
                return doc
              }
            })
            minPeriodFindAndUpdateProcess.minPeriodConstruct(machineID, from, to, retArr, function(sendBack) {
              res.send({
                type: true,
                data: sendBack
              })
            })
          } else {
            minPeriodFindAndUpdateProcess.minPeriodConstruct(machineID, from, to, docs, function(sendBack) {
              res.send({
                type: true,
                data: sendBack
              })
            })
          } */
        }
        // db.close()
      })
    })
  })
    }
  })
}
function coptToMachineDB (data, socket) {
  var tgtMid = data.key
  var idArr = []
  data.value.forEach(id => {
    idArr.splice(idArr.length, 0, {_id: {$eq: ObjectID(id)}})
  })
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
    } else {
      // client.db(config.dbName).collection('hwCFG').find({machineID: tgtMid}).toArray(function(err, elms) {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) { 
        elms.forEach(elm => {
          var str3 = elm.data // var str3 = elm.propertyNum
          // console.log(tgtMid + ': ' + str3)      
          client.db(config.dbName).collection('machineRecord' + str3).find({$or: idArr}).toArray(function (err, docs) {
            for (var base = 0, end = 0; base < docs.length; base = end) {
              end = ((docs.length - base) > 1000) ? base + 1000 : (docs.length)
              client.db(config.dbName).collection((tgtMid.indexOf('1A') > -1) ? tgtMid : (str3 + 'Report')).insertMany(docs.slice(base, end))
            }
            /* if (tgtMid.indexOf('1A') > -1) {
              client.db(config.dbName).collection(tgtMid).insertMany(docs)
            } else {
              client.db(config.dbName).collection(str3 + 'Report').insertMany(docs) 
            } */
            // console.log(docs)   
            socket.emit('coptToMachineDBSuccess', {})
            client.close()
          })
        })
      })
    }
  })
}
function deleteToMachineDB (data, socket) {
  var tgtMid = data.key
  var idArr = []
  data.value.forEach(id => {
    idArr.splice(idArr.length, 0, {_id: {$eq: ObjectID(id)}})
  })
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
    } else {
      // client.db(config.dbName).collection('hwCFG').find({machineID: tgtMid}).toArray(function(err, elms) {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) { 
        elms.forEach(elm => {
          var str3 = elm.data // var str3 = elm.propertyNum
          idArr.forEach(id => {
            if (tgtMid.indexOf('1A') > -1) {
              client.db(config.dbName).collection(tgtMid).deleteOne(id)
            } else {
              client.db(config.dbName).collection(str3 + 'Report').deleteOne(id)
            }
          })
        })
        client.close()
            //// console.log(docs)   
        socket.emit('deleteToMachineDBSuccess', {})
      })
    }
  })
}
function deleteAllToMachineDB (data, socket, from, to) {
  var tgtMid = data.key
  var idArr = []
  /*data.value.forEach(id => {
    idArr.splice(idArr.length, 0, {_id: {$eq: ObjectID(id)}})
  })*/
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
    } else {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          //idArr.forEach(id => {
            if (tgtMid.indexOf('1A') > -1) {
              console.log(from)
              console.log(to)
              console.log('delete all')
              client.db(config.dbName).collection(tgtMid).deleteMany({trigTime: {$gte: from, $lt: to}})
            } else {
              client.db(config.dbName).collection(str3 + 'Report').deleteMany({trigTime: {$gte: from, $lt: to}})
            }
          //})
        })
        client.close()
            //// console.log(docs)   
        socket.emit('deleteToMachineDBSuccess', {})
      })
    }
  })
}
function copyAllToMachineDB (data, socket, from, to) {
  var tgtMid = data.key
  var idArr = []
  /*data.value.forEach(id => {
    idArr.splice(idArr.length, 0, {_id: {$eq: ObjectID(id)}})
  })*/
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
    } else {
      client.db(config.dbName).collection('organization').find({_id: tgtMid}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
          // console.log(tgtMid + ': ' + str3)      
          client.db(config.dbName).collection('machineRecord' + str3).find({trigTime: {$gte: from, $lt: to}}).toArray(function (err, docs) {
            for (var base = 0, end = 0; base < docs.length; base = end) {
              end = ((docs.length - base) > 1000) ? base + 1000 : (docs.length)
              client.db(config.dbName).collection((tgtMid.indexOf('1A') > -1) ? tgtMid : (str3 + 'Report')).insertMany(docs.slice(base, end))
            }
            /* if (tgtMid.indexOf('1A') > -1) {
              client.db(config.dbName).collection(tgtMid).insertMany(docs)
            } else {
              client.db(config.dbName).collection(str3 + 'Report').insertMany(docs) 
            } */
            // console.log(docs)   
            socket.emit('coptToMachineDBSuccess', {})
            client.close()
          })
        })
      })
    }
  })
}
function clrMulOrderNumber (data, machineID, socket) {
  // console.log(data)
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // socket.emit('setOrderNumberFail', data)
    } else {
      //client.db(config.dbName).collection(machineID).updateMany({
        client.db(config.dbName).collection('hwCFG').find({machineID: machineID}).toArray(function(err, elms) {
          elms.forEach(elm => {
            var str3 = elm.propertyNum
      client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : str3 + 'Report').updateMany({
      $or: [{
        trigTime: {$gte: moment(data.trigTime, 'YYYY-MM-DD HH:mm:ss').toDate(), $lt: moment(data.lastTrigTime, 'YYYY-MM-DD HH:mm:ss').toDate()}
      }]},{
        $set: {
          'product': '',
          'standard': 0,
          'orderNumber': '',
          'performance': '',
          'deadline': '',
          'targetCount': '',
          'badNum': 0,
          'badRate': 0,
          'totalAlm': 0,
          // 'warehousing': 0,
          'componentNum': '',
          'moldNum': '',
          'moldArray': '',
          'prodName': '',
          'predMachine': '',
          'predMoldCnt': '',
          'cavities': 0,
          'standard': 0,
          'moldName':''
        }
      }, function(err3) {
        // console.log('Update Finish')
        // client.db(config.dbName).collection(machineID).findOne({'_id': ObjectID(id)}, function(err4, doc) {
          if (err3) {
            // console.log('setOrderNumberFail')
            socket.emit('clrMulOrderNumberFail', {})
          } else {
            // console.log('setOrderNumberSuccess')
            socket.emit('clrMulOrderNumberSuccess', {})
          }
        client.close()
      })
        })
      })
    }
  })
}
function setOrderNumber (id, machineID, orderNumber, trigTime, socket, data) {
  // console.log('setOrderNumber')
  // console.log(machineID)
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // console.log(000000000)
      socket.emit('setOrderNumberFail', data)
    } else {
      var col = client.db('pmDB').collection('製令單明細')//('成型派單明細')
      col.findOne({'派單號碼': {$eq: orderNumber}}, function(err, orderDetail) {
        if (err) {
          // console.log(1111111111111)
          socket.emit('setOrderNumberFail', data)
          client.close()
        } else if (orderDetail === null) {
          // console.log('1111111' + orderDetail + '02111111')
          socket.emit('setOrderNumberFail', data)
          client.close()
        } else {
          client.db('pmDB').collection('貨品編號對應可生產模具').findOne({'貨品編號':orderDetail['貨品編號']}, function(err1, moldDetail) {
            if (err1) {
              // console.log(22222222222)
              socket.emit('setOrderNumberFail', data)
              client.close()
            } else if (moldDetail === null) {
              // console.log(333333333333)
              // console.log(orderDetail)
              socket.emit('setOrderNumberFail', data)
              client.close()
            } else {
              // console.log('setOrderNumber')
              // console.log(orderDetail)
              // console.log(moldDetail)
              var moldDetailKey = []
              if (moldDetail !== null) {
                moldDetailKey = Object.keys(moldDetail)
              }
              var availableMoldKey = moldDetailKey.filter(elm => elm.includes('可生產模具')) // 可用模具
              var arr = []
              availableMoldKey.forEach(function(elm) {
                arr.splice(arr.length, 0, moldDetail[elm])
              })
              // console.log(arr)
              if (arr.length <= 0) {
                socket.emit('moldNotExit', data)
                client.close()
              } else {
              // console.log(trigTime)
              client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
                elms.forEach(elm => {
                  var str3 = elm.data
              client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).findOne({'_id': ObjectID(id)}, function(err2, doc) {
                if (err2) {
                  socket.emit('setOrderNumberFail', data)
                } else {
                  // console.log(doc)
                  client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).updateMany({$or: [{
                    'orderNumber': {$eq: orderNumber}},
                    {'_id': {$eq: ObjectID(id)}},
                    { $and: [ {'trigTime': {$lt: doc.lastTrigTime, $gte: doc.trigTime}
                  }, { $or: [
                    {'machineStatusType': {$eq: '警報-成型機'}},
                    {'machineStatusType': {$eq: '警報-機械手'}}
                  ]}]},
                    { $and: [ {'trigTime': {$lt: doc.lastTrigTime}},
                    { $or: [
                      {'orderNumber': {$exists: false}}, // 
                      {'orderNumber': {$eq: ''}}, // 
                      {'orderNumber': {$type: 'null'}}, // 
                      {'orderNumber': {$eq: orderNumber}},
                      {'_id': {$eq: ObjectID(id)}}
                    ]},
                    { $or: [
                      {'machineStatusType': {$eq: '全自動'}},
                      {'machineStatusType': {$eq: '半自動'}},
                      {'machineStatusType': {$eq: '警報-成型機'}},
                      {'machineStatusType': {$eq: '警報-機械手'}}
                    ]}]}]
                    /* { $or: [
                      {'moldNum': {$exists:false}}, // 
                      {'moldNum': {$eq:''}}, // 
                      {'moldNum': {$type: 'null'}},
                      {'_id': {$eq: ObjectID(id)}}
                    ]} */
                  },{
                    $set: {
                      machineID: machineID,
                      'product': orderDetail['貨品編號'], // 成品料號
                      'standard': 0,
                      'orderNumber': orderNumber,
                      'performance': orderDetail['成品料號'],
                      'deadline': orderDetail['最遲完成日'],
                      'targetCount': orderDetail['派單數量'],
                      'badNum': 0,
                      'badRate': 0,
                      'totalAlm': 0,
                      // 'warehousing': 0,
                      'componentNum': moldDetail['零件模號'],
                      'moldNum': arr[0],
                      'moldArray': arr,
                      'prodName': orderDetail['品名'], // orderDetail['成品名稱'],
                      'predMachine': orderDetail['生產機台'],
                      'predMoldCnt': orderDetail['派單數量'], // ['生產模數'],
                      'cavities': 0,
                      'standard': 0,
                      'moldName':'',
                      'MOQ': orderDetail['MOQ'], // orderDetail['M#O#Q#'],
                      'createDate': orderDetail['開單_日期'],
                      'deadlineWarehousing': orderDetail['最終入庫日期']
                    }
                  }, function(err3) {
                    // console.log('Update Finish')
                    client.db(config.dbName).collection(machineID).findOne({'_id': ObjectID(id)}, function(err4, doc) {
                      if (err4) {
                        socket.emit('setOrderNumberFail', data)
                      } else {
                        // console.log('setOrderNumberSuccess')
                        socket.emit('setOrderNumberSuccess', doc)
                      }
                    })
                    // console.log('id')
                    // console.log(config.dbName)
                    // console.log(machineID)
                    // console.log(orderNumber)
                    // console.log(id)
                    checkOrder(machineID, orderNumber||'')
                    client.close()
                    // 
                    // var oldOrderNumber = [doc['orderNumber'], orderNumber]
                    // oldOrderNumber.forEach(function (elm) {
                  })
                }
              })
                })
              })
            }
            }
          })
        }
      })
    }
  })
}
function failToClrOrderNumber (id, machineID, orderNumber, socket) {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      socket.emit('setOrderNumberFail', data)
    } else {
      //client.db(config.dbName).collection(machineID).updateMany({
      client.db(config.dbName).collection('hwCFG').find({machineID: machineID}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.propertyNum
      client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : str3 + 'Report').findOneAndUpdate({
        '_id': {$eq: ObjectID(id)}
      },{
        $set: {
          'product': '',
          'standard': 0,
          'orderNumber': '',
          'performance': '',
          'deadline': '',
          'targetCount': '',
          'badNum': 0,
          'badRate': 0,
          'totalAlm': 0,
          // 'warehousing': 0,
          'componentNum': '',
          'moldNum': '',
          'moldArray': '',
          'prodName': '',
          'predMachine': '',
          'predMoldCnt': '',
          'cavities': 0,
          'standard': 0,
          'moldName':''
        }
      }, {returnNewDocument: false}, function(err3, doc) {
        // console.log('Update Finish')
        // client.db(config.dbName).collection(machineID).findOne({'_id': ObjectID(id)}, function(err4, doc) {
          if (err3) {
            socket.emit('setOrderNumberFail', data)
          } else {
            // console.log('failToClrOrderNumberSuccess')
            socket.emit('failToClrOrderNumberSuccess', doc.value)
          }
          // console.log(doc.value)
          checkOrder(machineID, doc.value.orderNumber)
        // })
        // console.log('id')
        // console.log(config.dbName)
        // console.log(machineID)
        // console.log(id)
        client.close()
      })
        })
      })
    }
  })
}
function clrOrderNumber (data, machineID, orderNumber, socket) {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      socket.emit('setOrderNumberFail', data)
    } else {
      client.db(config.dbName).collection('hwCFG').find({machineID: machineID}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.propertyNum
      //client.db(config.dbName).collection(machineID).updateMany({
      client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : str3 + 'Report').findOneAndUpdate({
      $or: [{
        /* $and: [ {'trigTime': {$lt: moment(data.lastTrigTimeFullType, 'YYYY-MM-DD HH:mm:ss.SSS').toDate(), $gte: moment(data.trigTimeFullType, 'YYYY-MM-DD HH:mm:ss.SSS').toDate()}
                  }, { $or: [
                    {'machineStatusType': {$eq: '警報-成型機'}},
                    {'machineStatusType': {$eq: '警報-機械手'}}]}]
      }, { */
        '_id': {$eq: ObjectID(data._id)}
      }]},{
        $set: {
          'product': '',
          'standard': 0,
          'orderNumber': '',
          'performance': '',
          'deadline': '',
          'targetCount': '',
          'badNum': 0,
          'badRate': 0,
          'totalAlm': 0,
          // 'warehousing': 0,
          'componentNum': '',
          'moldNum': '',
          'moldArray': '',
          'prodName': '',
          'predMachine': '',
          'predMoldCnt': '',
          'cavities': 0,
          'standard': 0,
          'moldName':''
        }
      }, {returnNewDocument: false}, function(err3, doc) {
        // console.log('Update Finish')
        // client.db(config.dbName).collection(machineID).findOne({'_id': ObjectID(id)}, function(err4, doc) {
          if (err3) {
            socket.emit('setOrderNumberFail', data)
          } else {
            // console.log('setOrderNumberSuccess')
            socket.emit('setOrderNumberSuccess', doc.value)
          }
          // console.log(doc.value)
          if (doc.value !== null) {
            checkOrder(machineID, doc.value.orderNumber||'')
          }
        // })
        // console.log('id')
        // console.log(config.dbName)
        // console.log(machineID)
        // console.log(data._id)
        // console.log(data)
        client.close()
      })
        })
      })
    }
  })
}
function checkOrder (machineID, orderNumber) {
  // console.log('checkOrder')
  MongoClient.connect(config.dbUrl, function (err, client) {
    if (err) {
      
    } else {
      client.db('ldm').collection(machineID).find({$and: [{orderNumber: orderNumber}, {$or: [{machineStatusType: '半自動'}, {machineStatusType: '全自動'}]}]}).toArray(function (err, docs) {
        if (err) {
          client.close()
  // console.log('failed to find')
        } else {
          if(docs.length === 0) {
            // console.log('write ordernumber fail')
          } else {
            var total = docs.reduce(function (previousValue, currentValue, index, array) {
              // console.log(currentValue.moldCount  )
              return previousValue + currentValue.moldCount  
            }, 0)
            var objDoc = {}
            var obj = {}
            obj[machineID] = total
            objDoc = {
              '_id': orderNumber,
              'product': docs[0].product,
              'moldCount': obj
              // 'warehousing': 0
            }
            // client.db('ldm').collection('settedOrderNumberList').updateOne({'_id': orderNumber}, {$set: obj}, { upsert: true })
            // console.log('checkOrder')
            // console.log(orderNumber)
            // console.log(obj)
            // 判斷orderNumber是否存在
            client.db('ldm').collection('settedOrderNumberList').find({'_id': orderNumber}).toArray(function (err, docs) {
              if (err) {
                client.close()
              } else {
                client.close()
                if(docs.length === 0) {
                  // console.log(orderNumber)
                  // console.log(docs)
                  // orderNumber尚未產生
                  // console.log('settedOrderNumberList empty')
                  client.db('ldm').collection('settedOrderNumberList').insertOne(objDoc)
                } else {
                  // console.log(docs)
                  var doc = docs[0]
                  // console.log(doc)
                  var moldCount = doc['moldCount'] || {}
                  // console.log(moldCount)
                  // console.log(moldCount[machineID])
                  moldCount[machineID] = total
                  client.db('ldm').collection('settedOrderNumberList').updateOne({'_id': orderNumber}, {$set: {'moldCount': moldCount}}, { upsert: true })
                  // console.log(doc.moldCount)
                  // console.log('settedOrderNumberList exit')
                }
              }
            }) 
          }
        }
      })
    }
  })
}
var prodDepartSetting = require('./prodDepartSetting.js')
function getMachineRecordsNew (machineID, from, to, res) {
  prodDepartSetting.getPropertyByMachineID(machineID, function(callback) {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    } else {
      var col = client.db(config.dbName).collection('machineRecord' + callback[0])
      // col.find({Trig_Time: {$gte: date}}).toArray(function (err, docs) {
      // col.find().toArray(function (err, docs) {
      col.find({trigTime: {$gte: from, $lt: to}, $and: [{machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) { // , {machineStatusType: {$ne: '警報-成型機'}}, {machineStatusType: {$ne: '警報-機械手'}}
        client.close()
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else if (docs.length === 0) {
          res.send({
            type: false,
            data: '沒有機台資料'
          })
        } else {
          var sum1 = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '警報-通信') ? acc + 1 : acc
          }, 0)
          var sum = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '系統啟動') ? acc + 1 : acc
          }, 0)
          docs.forEach(doc => {
            if (doc['orderNumber'] === undefined) {
              doc['orderNumber'] = ''
            }
            /*var durationStr = doc['durationStr'].split(':')
            var sec = parseInt(durationStr[2])
            var min = parseInt(durationStr[1])
            var hour = parseInt(durationStr[0])
            var secStr = (sec < 10) ? '0' + String(sec) : String(sec)
            var minStr = (min < 10) ? '0' + String(min) : String(min)
            var hourStr = (hour < 10) ? '0' + String(hour) : String(hour)
            doc['durationStrCor'] = hourStr + ':' + minStr + ':' + secStr*/
          })
          // // console.log(JSON.stringify(docs, null, 2))
          // console.log('警報-通信: ' + sum1)
          // console.log('系統啟動: ' + sum)
          if ((sum > 10) || (sum1 > 10)) {
            var retArr = []
            retArr = docs.filter(doc => {
              if ((doc['machineStatusType'] !== '系統啟動') && (doc['machineStatusType'] !== '警報-通信')) {
                return doc
              }
            })
            //minPeriodFindAndUpdateProcess.minPeriodConstruct(machineID, from, to, retArr, function(sendBack) {
              res.send({
                type: true,
                data: retArr
              })
           // })
          } else {
            //minPeriodFindAndUpdateProcess.minPeriodConstruct(machineID, from, to, docs, function(sendBack) {
              res.send({
                type: true,
                data: docs
              })
            //})
          }
        }
        // db.close()
      })
    }
  })
})
}

function buildTableByRealData (machineID, from, to, res) {
  minPeriodFindAndUpdateProcess.buildTableByRealData(machineID, from, to, res)
}

function getOrderList(res) {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: `Available OrderNumber is not exit.`
      })
    } else {
      client.db('pmDB').collection('製令單明細').find().toArray(function (err, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else {
          // // console.log(JSON.stringify(docs, null, 2))
          var retArr = docs.map((doc) => {
            return doc['派單號碼']
          })
          res.send({
            type: true,
            data: retArr
          })
        }
        client.close()
      })
    }
  })
}
function getMachineAlarmRecords (machineID, from, to, res) {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    } else {
      /* if (machineID === '1B04') { // 20191111 add
        machineID = 'PIPI08Report'
      } else if (machineID === '1B03') { // 20191111 add
        machineID = 'PIPI98Report'
      } else if (machineID === '1B02') { // 20191111 add
        machineID = 'PIPI97Report'
      } else if (machineID === '1B01') { // 20191111 add
        machineID = 'PIPI96Report'
      } */
      client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
        elms.forEach(elm => {
          var str3 = elm.data
      var col = client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report'))
      // col.find({Trig_Time: {$gte: date}}).toArray(function (err, docs) {
      // col.find().toArray(function (err, docs) {
      col.find({trigTime: {$gte: from, $lt: to}, machineStatusType: {$ne: '警報-通信'}, machineStatus: {$eq: '警報'}}).toArray(function (err, docs) {
        client.close()
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else if (docs.length === 0) {
          res.send({
            type: false,
            data: '沒有機台資料'
          })
        } else {
          var sum1 = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '警報-通信') ? acc + 1 : acc
          }, 0)
          var sum = docs.reduce(function(acc, curr, index, array) {
            return (curr['machineStatusType'] === '系統啟動') ? acc + 1 : acc
          }, 0)
          docs.forEach(doc => {
            if (doc['orderNumber'] === undefined) {
              doc['orderNumber'] = ''
            }
            var durationStr // = doc['durationStr'].split(':') 20191111 add
            if (doc.hasOwnProperty('durationStr')) {
              durationStr = doc['durationStr'].split(':')
            } else {
              // durationStr = (doc.lastTrigTime - doc.trigTime).split(':')
              durationStr = ('00:00:00').split(':')
            }
            var sec = parseInt(durationStr[2])
            var min = parseInt(durationStr[1])
            var hour = parseInt(durationStr[0])
            var secStr = (sec < 10) ? '0' + String(sec) : String(sec)
            var minStr = (min < 10) ? '0' + String(min) : String(min)
            var hourStr = (hour < 10) ? '0' + String(hour) : String(hour)
            doc['durationStrCor'] = hourStr + ':' + minStr + ':' + secStr
          })
          // // console.log(JSON.stringify(docs, null, 2))
          // console.log('警報-通信: ' + sum1)
          // console.log('系統啟動: ' + sum)
          // console.log(docs.length)
          if ((sum > 10) || (sum1 > 10)) {
            var retArr = []
            retArr = docs.filter(doc => {
              if ((doc['machineStatusType'] !== '系統啟動') && (doc['machineStatusType'] !== '警報-通信')) {
                return doc
              }
            })
            res.send({
              type: true,
              data: retArr
            })
          } else {
            res.send({
              type: true,
              data: docs
            })
          }
        }
        // db.close()
      })
    })
  })
    }
  })
}
function setMoldNumber (data, socket) {
  //console.log(data)
  //console.log('data')
    var id = data._id
    var machineID = data.machineID
    var moldNum = data.moldNum
    var moldNum2 = {'模具編號': data.moldNum} // {$or: [{'模具編號': 'MM' + (data.moldNum).slice(2)}, {'模具編號': 'MS' + (data.moldNum).slice(2)}]}
    var product = data.product
    var componentNum = data.componentNum
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
        socket.emit('setMoldNumberFail', data)
      } else {
        // console.log(config.prodDBName)
        // console.log(config.moldListColName)
        // console.log(moldNum)
        // console.log(moldNum2)
        client.db(config.prodDBName).collection(config.moldListColName).findOne({$and:[{'零件模號': componentNum},  moldNum2 ]}, function(err1, doc) {
          if (err1) {
            socket.emit('findMoldListFail', data)
            client.close()
          } else {
            console.log(doc)
            if (doc === null) {
              // console.log('findMoldListFail')
              socket.emit('findMoldListFail', data)
              client.close()
            } else {
              client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
                elms.forEach(elm => {
                  var str3 = elm.data
            var promises = []
            client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).updateMany({$and: [{'product': {$eq: product}}, {'moldArray': {$elemMatch: {$eq: moldNum}}}]}, { 
              $set: { 
                "cavities" : doc['穴數'],
                "standard" : doc['成型週期'],
                "moldNum" : moldNum,
                "moldName" : doc['模具名稱   '] // "moldName" : doc[' 零  件  名  稱   ']
              } 
            }).then(() => {
              client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).findOne({'_id': ObjectID(id)}, function(err3, doc1) {
                if (err3) {
                  socket.emit('setMoldNumberFail', data)
                } else {
                  // console.log('setMoldNumberSuccess')
                  // console.log(doc1['cavities'])
                  //console.log(doc1)
                  socket.emit('setMoldNumberSuccess', doc1)
                  // process.exit(0)
                }
                client.close()
              })
            })
          })
        })
          }
          }
        })
      }
    })
}
//refresh()
function refresh() {
  var machineIDs = ['1A01', '1A02', '1A03','1A04', '1A05', '1A06','1A07', '1A08', '1A09','1B01', '1B02', '1B03','1B04']
  // console.log('refresh...')
  refreshMoldDatabase(machineIDs, '')
}
function refreshDatabase(machineIDs, res) {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    } else {
      client.db('pmDB').collection('製令單明細').find({}).sort({'派單號碼': 1}).toArray(function (err1, docs1) {
        if (err1) {

        } else {
          docs1.forEach(orderDetail => {
            machineIDs.forEach(machineID => {
              var mmachineID = ''
              if (machineID === '1B04') { // 20191111 add
                mmachineID = 'PIPI08Report'
              } else if (machineID === '1B03') { // 20191111 add
                mmachineID = 'PIPI98Report'
              } else if (machineID === '1B02') { // 20191111 add
                mmachineID = 'PIPI97Report'
              } else if (machineID === '1B01') { // 20191111 add
                mmachineID = 'PIPI96Report'
              } else {
                mmachineID = machineID
              }
              client.db(config.dbName).collection(mmachineID).updateMany({'product': orderDetail['貨品編號']}, {
                $set: {
                  'performance': orderDetail['成品料號'],
                  'deadline': orderDetail['最遲完成日'],
                  'targetCount': orderDetail['派單數量'],
                  'prodName': orderDetail['品名'], // orderDetail['成品名稱'],
                  'predMachine': orderDetail['生產機台'],
                  'predMoldCnt': orderDetail['生產模數'],
                  'MOQ': orderDetail['MOQ'], // orderDetail['M#O#Q#'],
                  'createDate': orderDetail['開單_日期'],
                  'deadlineWarehousing': orderDetail['最終入庫日期']
                }
              })
            })
          })
        }
      })
    }
  })
}
function refreshMoldDatabase(machineIDs, res) {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    } else {
      client.db(config.prodDBName).collection(config.moldListColName).find({}).toArray(function(err1, docs) {
        if (err1) {
        } else {
          machineIDs.forEach(machineID => {
            var m1machineID = ''
            if (machineID === '1B04') { // 20191111 add
              m1machineID = 'PIPI08Report'
            } else if (machineID === '1B03') { // 20191111 add
              m1machineID = 'PIPI98Report'
            } else if (machineID === '1B02') { // 20191111 add
              m1machineID = 'PIPI97Report'
            } else if (machineID === '1B01') { // 20191111 add
              m1machineID = 'PIPI96Report'
            } else {
              m1machineID = machineID
            }
            docs.forEach(doc => {
            client.db(config.dbName).collection(m1machineID).updateMany({$and: [{"moldNum" : doc['模具編號']}, {'componentNum': doc['零件模號']}]}, { 
              $set: { 
                "cavities" : doc['穴數'],
                "standard" : doc['成型週期'],
                "moldName" : doc['零件名稱   '] // "moldName" : doc[' 零  件  名  稱   ']
              } 
            }).then(() => {
              // console.log(machineID + ': ' + doc['模具編號'])
            })
          })
          })       
        }
      })
    }
  })
}