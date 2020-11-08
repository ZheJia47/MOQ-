var moment = require('moment')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var shiftDb = 'shiftDatabase'
var organizationDb = 'organization'
exports.getDailyIntegratedReport = getDailyIntegratedReport
exports.reqUpdateShiftDailyReportIntegrated = reqUpdateShiftDailyReportIntegrated1

function getDailyIntegratedReport (machineIDs, from, to, res) {
  var retObj = {}
  var test = {}
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var idx= 0
      machineIDs.forEach(machineID => {
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
        client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).find({trigTime: {$gte: from, $lt: to},
          $where: 'this.orderNumber.length > 3',
          orderNumber: {$type : "string"},
          machineStatusType: {$ne: '警報-通信'}
        }).sort({'orderNumber': 1, 'trigTime': 1}).toArray(function(err1, docs1) {
          if (err1) {
            // console.log('Error occured: ' + err0)
          } else {
            if(!test.hasOwnProperty(machineID)) {
              test[machineID] = idx++
            }
            // var idx = 0
            var retArray = []
            var propIdx = 0
            var propObj = {}
            if(docs1.length > 0) {
              docs1.forEach(doc1 => {
                if(!propObj.hasOwnProperty(doc1.orderNumber)) {
                  propObj[doc1.orderNumber] = propIdx++
                }
              })
              Object.keys(propObj).map(function(objectKey, indexMap) {
                var value = propObj[objectKey]
                var orderNumberDocs = docs1.filter(function(val) {
                  if(val.orderNumber === objectKey) {
                    return val
                  }
                })
                var filterAuto = orderNumberDocs.filter(function(val, index) {
                  if((val['machineStatusType'] === '半自動') || (val['machineStatusType'] === '全自動')) {
                    return val
                  }
                })
                if (filterAuto.length === 0) {
                  return
                }
                var filterAutoAlm = orderNumberDocs.filter(function(val, index) {
                  // if((val['machineStatusType'] === '警報') && (val['machineStatus'] !== '通信失敗')) {
                  if(((val['machineStatus'] || '警報') === '警報') && (val['machineStatus'] !== '通信失敗')) {
                    return val
                  }
                })
                var total = ((filterAuto.filter(function(val, index, arr) {
                  var min = val.min || 0
                    return min > 0
                })).sort(function(a,b) {
                  return a.min > b.min ? 1 : -1
                }))
                var min = 0
                if (total.length !== 0) {
                  min = total[0].min
                }
                var duration = (filterAuto.reduce(function (previousValue, currentValue, index, array) {
                  return previousValue + (currentValue.lastTrigTime - currentValue.trigTime)
                }, 0))
                var moldCount = (filterAuto.reduce(function (previousValue, currentValue, index, array) {
                  return previousValue + currentValue.moldCount  
                }, 0))
                retArray.splice(retArray.length, 0, {
                  machineID: machineID,
                  first: false,
                  second: false,
                  third: false,
                  totalAlm: filterAutoAlm.length,
                  orderNumber: filterAuto[0].orderNumber,
                  product: filterAuto[0].product,
                  cavities: filterAuto[0].cavities || 0,
                  trigTime: filterAuto[0].trigTime,
                  lastTrigTime: filterAuto[filterAuto.length - 1].lastTrigTime,
                  duration: duration,
                  moldCount: moldCount,
                  predProductCnt: (filterAuto.reduce(function (previousValue, currentValue, index, array) {
                    return previousValue + currentValue.moldCount * currentValue.cavities 
                  }, 0)),
                  standard: filterAuto[0].standard,
                  min: min,
                  average: (duration / moldCount),
                  performance: 0,
                  predMoldCnt: filterAuto[0].targetCount, // .predMoldCnt,
                  accMoldCnt: 0,
                  percentage: filterAuto[0].accMoldCnt / filterAuto[0].targetCount, // .predMoldCnt, 
                  tgtfinishTime:  filterAuto[filterAuto.length - 1].lastTrigTime,
                  deadline: filterAuto[filterAuto.length - 1].deadline
                })
              })
            }
            retObj[machineID] = retArray
            var objKeys = Object.keys(retObj)
            if(objKeys.length === machineIDs.length) {
              res.send({
                type: true,
                data: retObj
              })
              client.close()
            }
          }
        })
      })
    })
      })
    }
  })
}

function reqUpdateShiftDailyReportIntegrated (machineID, orderNumber, reportDate, trigTime ,lastTrigDate, socket) {
  var lastTrigTime = ''
  if(reportDate < lastTrigDate) {
    lastTrigTime = moment(moment(moment(data.lastTrigTime).format('HH:mm:ss')).hour() + 24).toString() + ':' + 
    moment(moment(moment(data.lastTrigTime).format('HH:mm:ss')).minute()).toString() + ':' +
    moment(moment(moment(data.lastTrigTime).format('HH:mm:ss')).second()).toString()
  } else {
    lastTrigTime = moment(data.lastTrigTime).format('HH:mm:ss').toString()
  }
  
  // console.log('calendar' + moment(reportDate).year())
  // console.log(trigTime)
  // console.log(lastTrigTime)
  // console.log(data.lastTrigTime)
  var startDate =  moment(reportDate).format('YYYY/M/DD')
  var first = false
  var second = false
  var third = false
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
    } else {
      client.db('calendar' + moment(reportDate).year()).collection(machineID).findOne({_id: {$eq: startDate}}, function(err2, doc2){
        if(err2) {
          first = false
          second = false
          third = false
          // console.log('err2')
        } else {
          var predMoldCnt = 0
          var acc = 0
          first = doc2['first']
          second = doc2['second']
          third = doc2['third']
          var retObj = {
            machineID: machineID,
            orderNumber: orderNumber,
            first: first,
            second: second,
            third: third,
            accMoldCnt: acc,
            percentage: 0
          }
          socket.emit('updateShiftDailyReportInteg', retObj)
          client.close()
        }
      })
    }
  })
}

function reqUpdateShiftDailyReportIntegrated1 (machineID, orderNumber, reportDate, trigTime ,lastTrigDate, socket) {
  var startDate =  Number(moment(reportDate, 'YYYY-MM-DD 00:00:00').format('YYYYMMDD'))
  var first = false
  var second = false
  var third = false
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
    } else {
      client.db(config.dbName).collection(organizationDb).findOne({_id: machineID}, function (err1, doc1) {
        if (err1) {
          client.close()
        } else if (doc1 === null) {
          client.close()
        } else {
          client.db(shiftDb).collection(doc1.data).findOne({_id: {$eq: startDate}}, function(err2, doc2){
            if(err2) {
              client.close()
            } else {
              var retObj = {
                machineID: machineID,
                shiftData: doc2
              }
              socket.emit('updateShiftDailyReportInteg', retObj)
              client.close()
            }
          })
        }
      })
    }
  })
}