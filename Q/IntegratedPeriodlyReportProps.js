var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var orderReport = require('./orderReport.js')
exports.getPeriodMachineRecords = getPeriodMachineRecords2

function getPeriodMachineRecords (machineIDs, from, to, res) {
  // console.log('getPeriodMachineRecords')
  // console.log('machineIDs : ' + machineIDs)
    // console.log([from, to])
  
    var machines = {}
  
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
  // console.log('failed to connect')
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        var db = client.db(config.dbName)
        var col = db.collection(config.machineListColName)
        var promises = []
        machineIDs.forEach(machineID => {
  // console.log('machineID : ' + machineID)
          promises.push(getEachMachineRecords(db, machineID, from, to).then(results => {
            machines[machineID] = results
          }))
        })
   // console.log(machines)
        // var resData = []
        var ackData = {}
        Promise.all(promises).then(() => {
          var objKeys = Object.keys(machines)
          objKeys.forEach(keyID => {
            var resData = []
            var auto = machines[keyID].filter(rowData => {
              if ('orderNumber' in rowData) {
                var orderNumber = rowData.orderNumber || ''
                if (orderNumber.length > 3) {
                  if ((rowData['machineStatusType'] === '半自動') || (rowData['machineStatusType']  === '全自動')) {
                    return rowData
                  }
                }
              }
            })
            auto.sort(function(a,b) {
              return a.trigTime > b.trigTime ? 1 : -1;
            })
            var almRecords = machines[keyID].filter(rowData => {
              if ('orderNumber' in rowData) {
                var orderNumber = rowData.orderNumber || ''
                if (orderNumber.length > 3) {
                  // if ((rowData['machineStatusType'] === '警報')  && (rowData['machineStatus'] !== '通信失敗')) {
                  if (((rowData['machineStatus'] || '警報') === '警報')  && (rowData['machineStatus'] !== '通信失敗')) {
                    return rowData
                  }
                }
              }
            })
            almRecords.sort(function(a,b) {
              return a.trigTime > b.trigTime ? 1 : -1;
            })
            var propIdx = 0
            var propObj = {}
            auto.forEach(doc1 => {
              if(!propObj.hasOwnProperty(doc1.orderNumber)) {
                propObj[doc1.orderNumber] = propIdx++
              }
            })
          Object.keys(propObj).map(function(objectKey, indexMap) {
            var value = propObj[objectKey]
            var orderNumberDocs = auto.filter(function(val) {
              if(val.orderNumber === objectKey) {
                return val
              }
            })
            var total = ((orderNumberDocs.filter(function(val, index, arr) {
              var min = val.min || 0
              return min > 0
            })).sort(function(a,b) {
              return a.min > b.min ? 1 : -1
            }))
            var min = 0
            if (total.length !== 0) {
              min = total[0].min
            }
            var warehousing = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.warehousing  
            }, 0))
            /* var badNum = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.badNum  
            }, 0)) */
            var  moldCount = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.moldCount  
            }, 0))
            var targetCount = moldCount * orderNumberDocs[0].cavities
            var badNum = targetCount - warehousing
            var badRate = 0 
            // if (moldCount * orderNumberDocs[0].cavities !== 0) {
            if (targetCount !== 0) {
              badRate = badNum / targetCount // (moldCount * orderNumberDocs[0].cavities)
            }
            var duration = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + (currentValue.lastTrigTime - currentValue.trigTime)
            }, 0))
            var average = duration / moldCount
            var almRecord = almRecords.filter(function(val) {
              if(val.orderNumber === objectKey) {
                return val
              }
            })
            resData.splice(resData.length, 0, {
              machineID: keyID,
              totalAlm: almRecord.length,
              orderNumber: orderNumberDocs[0].orderNumber,
              product: orderNumberDocs[0].product,
              cavities: orderNumberDocs[0].cavities,
              startTime: orderNumberDocs[0].trigTime, // '2016/6/1 13:02:20',
              endTime: orderNumberDocs[orderNumberDocs.length - 1].lastTrigTime, // '2016/6/1 16:28:20',
              duration: duration, // '3:25:53', // 排班工作時間累計
              moldCount: moldCount,
              targetCount: targetCount, // moldCount * orderNumberDocs[0].cavities,
              warehousing: warehousing,
              badNum: badNum,
              badRate: badRate,
              standard: orderNumberDocs[0].standard,
              min: min,
              average: average,
              performance: orderNumberDocs[0].standard / average,
              deadline: orderNumberDocs[orderNumberDocs.length - 1].deadline,
              lastID: orderNumberDocs[orderNumberDocs.length - 1]._id
            })
          })
          ackData[keyID] = resData
        })
        res.send({
          type: true,
          data: ackData // resData
        })
        client.close()
      }).catch(err => {
        // console.log(err)
        res.send({
          type: false
        })
        client.close()
      })
    }
  })
}
function getPeriodMachineRecords2 (machineIDs, from, to, res) {
  // console.log('getPeriodMachineRecords')
  // console.log('machineIDs : ' + machineIDs)
    // console.log([from, to])
  
    var machines = {}
    var inhousingArr = {}
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
  // console.log('failed to connect')
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        var db = client.db(config.dbName)
        var col = db.collection(config.machineListColName)
        var promises = []
        machineIDs.forEach(machineID => {
  // console.log('machineID : ' + machineID)
          promises.push(getEachMachineRecords(db, machineID, from, to).then(results => {
            machines[machineID] = results
          }))
        })
        promises.push(orderReport.getOrderReportPromise(from, to).then(results => {
          inhousingArr['製令回報單'] = results
        }))
   // console.log(machines)
        // var resData = []
        var ackData = {}
        Promise.all(promises).then(() => {
          console.log('製令回報單 讀取結果')
          console.log(inhousingArr['製令回報單'].length)
          var objKeys = Object.keys(machines)
          objKeys.forEach(keyID => {
            /* var ihArr = inhousingArr['製令回報單'].filter(ih => {
              return ih['回報自訂類別一'] === keyID
            })
            ihArr.sort((a, b) => {
              return a['回報日期'] > b['回報日期'] ? 1 : -1
            })
            console.log(keyID + ' ' + ihArr.length) */
            var resData = []
            var auto = machines[keyID].filter(rowData => {
              if ('orderNumber' in rowData) {
                var orderNumber = rowData.orderNumber || ''
                if (orderNumber.length > 3) {
                  if ((rowData['machineStatusType'] === '半自動') || (rowData['machineStatusType']  === '全自動')) {
                    return rowData
                  }
                }
              }
            })
            auto.sort(function(a,b) {
              return a.trigTime > b.trigTime ? 1 : -1;
            })
            var almRecords = machines[keyID].filter(rowData => {
              if ('orderNumber' in rowData) {
                var orderNumber = rowData.orderNumber || ''
                if (orderNumber.length > 3) {
                  // if ((rowData['machineStatusType'] === '警報')  && (rowData['machineStatus'] !== '通信失敗')) {
                  if (((rowData['machineStatus'] || '警報') === '警報')  && (rowData['machineStatus'] !== '通信失敗')) {
                    return rowData
                  }
                }
              }
            })
            almRecords.sort(function(a,b) {
              return a.trigTime > b.trigTime ? 1 : -1;
            })
            var propIdx = 0
            var propObj = {}
            var orderNumberDocs = []
            auto.forEach((doc1, docIdx, arrAuto) => {
              orderNumberDocs.push(doc1)
              if ((docIdx + 1) < arrAuto.length) {
                if (doc1.orderNumber === arrAuto[docIdx + 1].orderNumber) {
                  return
                }
              }
            /*  if(!propObj.hasOwnProperty(doc1.orderNumber)) {
                propObj[doc1.orderNumber] = propIdx++
              }
            }) */
          // Object.keys(propObj).map(function(objectKey, indexMap) {
            // var value = propObj[objectKey]
            /* var orderNumberDocs = auto.filter(function(val) {
              if(val.orderNumber === objectKey) {
                return val
              }
            }) */
            var total = ((orderNumberDocs.filter(function(val, index, arr) {
              var min = val.min || 0
              return min > 0
            })).sort(function(a,b) {
              return a.min > b.min ? 1 : -1
            }))
            var min = 0
            if (total.length !== 0) {
              min = total[0].min
            }
            /*var warehousing = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.warehousing  
            }, 0))*/
            var warehousing = inhousingArr['製令回報單'].filter(ih => {
              return (ih['回報自訂類別一'] === keyID) && (ih['製令單號'] === ('MK20' + orderNumberDocs[0].orderNumber))
            }).reduce(function (previousValue, currentValue, index, array) {
              return previousValue + (currentValue['完工報驗數'] || 0)  
            }, 0)
            /* var badNum = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.badNum  
            }, 0)) */
            var  moldCount = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.moldCount  
            }, 0))
            var targetCount = moldCount * orderNumberDocs[0].cavities
            var badNum = targetCount - warehousing
            var badRate = 0 
            // if (moldCount * orderNumberDocs[0].cavities !== 0) {
            if (targetCount !== 0) {
              badRate = badNum / targetCount // (moldCount * orderNumberDocs[0].cavities)
            }
            var duration = (orderNumberDocs.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + (currentValue.lastTrigTime - currentValue.trigTime)
            }, 0))
            var average = duration / moldCount
            var almRecord = almRecords.filter(function(val) {
              /* if(val.orderNumber === objectKey) {
                return val
              } */
              if ((val.trigTime >= orderNumberDocs[0].trigTime) && (val.trigTime < orderNumberDocs[orderNumberDocs.length - 1].lastTrigTime)) {
                return val
              }
            })
            resData.splice(resData.length, 0, {
              machineID: keyID,
              totalAlm: almRecord.length,
              orderNumber: orderNumberDocs[0].orderNumber,
              product: orderNumberDocs[0].product,
              cavities: orderNumberDocs[0].cavities,
              startTime: orderNumberDocs[0].trigTime, // '2016/6/1 13:02:20',
              endTime: orderNumberDocs[orderNumberDocs.length - 1].lastTrigTime, // '2016/6/1 16:28:20',
              duration: duration, // '3:25:53', // 排班工作時間累計
              moldCount: moldCount,
              targetCount: targetCount, // moldCount * orderNumberDocs[0].cavities,
              warehousing: warehousing,
              badNum: badNum,
              badRate: badRate,
              standard: orderNumberDocs[0].standard,
              min: min,
              average: average,
              performance: orderNumberDocs[0].standard / average,
              deadline: orderNumberDocs[orderNumberDocs.length - 1].deadline,
              lastID: orderNumberDocs[orderNumberDocs.length - 1]._id
            })
            orderNumberDocs.splice(0, orderNumberDocs.length)
          })
          ackData[keyID] = resData
        })
        res.send({
          type: true,
          data: ackData // resData
        })
        client.close()
      }).catch(err => {
        // console.log(err)
        res.send({
          type: false
        })
        client.close()
      })
    }
  })
}
function getEachMachineRecords (db, machineID, from, to) {
  return new Promise((resolve, reject) => {
    var records = []
    var col = db.collection(machineID)

    // // console.log(machineID)
    // // console.log([db, machineID, from, to, machines])
    col.find({ $and: [{trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}, {machineStatusType: {$ne: '系統啟動'}}, {machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) {
      if (err) {
        reject(err)
      } else {
        docs.forEach(doc => {
          if (doc['orderNumber'] !== undefined) {
            records.push(doc)
          }
        })
        resolve(records)
      }
    })
  })
}