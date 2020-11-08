require('dotenv').load()
var express = require('express')
var moment = require('moment')
var path = require('path')
var fs = require('fs')
// var util = require('util')
var formidable = require('formidable')
var morgan = require('morgan')
var bodyParser = require('body-parser')
// var jwt = require('jsonwebtoken')
// var expressJwt = require('express-jwt')
// var mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/vuelogin')
// var User = require('./models')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var opcodes = require('./opcodes.js')
var io = require('socket.io')
var app = express()
var http = require('http')
var server = http.createServer(app)
require('./Utilization.js')()
require('./Abnormal.js')()
require('./AbnormalTable.js')()
require('./DefectiveTable.js')()

app.set('port', process.env.PORT || 3001)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.all('*', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'POST,GET')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
app.get('/api/testDateTime', function (req, res) {
  // console.log('1')
  MongoClient.connect(config.dbUrl, function(err, client) {
    // console.log('2')
    var m = moment(moment('2018-06-16 12:00:00', 'YYYY-MM-DD HH:mm:ss').add(2,'hours')).toDate()
    // console.log(m)
    client.db('timeTest').collection('momentToDate').find({'Now':  { $gt: m }}).toArray(function (err, docs) {
      // console.log('3')
      docs.forEach(doc => {
        // console.log('5')
        // console.log(doc)
        // console.log(moment(doc['Now']).format('YYYY/MM/DD HH:mm:ss'))
      })
      // console.log('4')
      res.send({
        type: true,
        data: docs
      });
      client.close()
    })
  })
})
app.get('/api/getDetectiveTableData/:machineIDArr/:from/:to/:index', function (req, res) {
  var machineIDs = req.params.machineIDArr.split(",")
  var index = req.params.index
// console.log('getdetectiveTableData`');
//// console.log('machineIDs : ' + machineIDs)

  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
//// console.log([from.toString(), to.toString()])
	
	//machineIDs = ["1A01", "1A02"]
	
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
      client.close()
    } else {
      var db = client.db(config.dbName);

      getDetectiveTableDataMachineRecords (db, machineIDs, from, to, index, function(detectiveTableDataReport) {
	  //// console.log('detectiveTableDataReport : ' +  JSON.stringify(detectiveTableDataReport))

	  // temperary fill in
	  if ( detectiveTableDataReport.length == 0 ) {
		// console.log('data empty')
	 	var defectiveData = {
		    arm : 0,
		    machine: 0,
		    change: 0,
		    moldCount : 0,
		    targetCount : 0,
		    warehousing : 0,
		    index : index,
		    badNum: 0,
	   	    badRate: 0
		}
		detectiveTableDataReport[machineIDs[0]] = defectiveData
	  }

	  res.send({
	      type:true,
	      data: detectiveTableDataReport
    })
    client.close()
      })
    }
  })      
})
var MOQAnalysis = require('./MOQAnalysis.js')
app.get('/api/getMOQAnalysis/:machineIDArr/:from/:to/', function (req, res) {
  var machineIDs = req.params.machineIDArr.split(",")
// console.log('getMOQAnalysis');
//// console.log('machineIDs : ' + machineIDs)

  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
//// console.log([from.toString(), to.toString()])
	
	//machineIDs = ["1A01", "1A02"]
	MOQAnalysis.getMOQAnalysis(machineIDs, from, to, res)
})
app.get('/api/getDetectiveData1/:from/:to', function (req, res) {
  var fromRecv = req.params.from
  var toRecv = req.params.to
  // console.log(fromRecv)
  var monthCnt = moment(toRecv).diff(moment(fromRecv), 'M') + 1
  var from = moment(moment(fromRecv + '-01').date(1).format('YYYY-MM-DD 00:00:00')).toDate()
  var to = moment(moment(toRecv + '-01').add(1, 'month').date(0).format('YYYY-MM-DD 23:59:59')).toDate()

  /* var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate() */
  // var to = moment(moment(from).add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // console.log(from)
  // console.log(to)
  // var from = moment(moment(reportDate).format('YYYY-MM-DD')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  // console.log('fromRecv')
  // // console.log(moment(fromRecv, 'M'))
  // console.log(moment(fromRecv).format('YYYY/M'))
  var idx = 0
  var machines = {}
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
      client.close()
    } else {
      var promises = []
      var docs = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08','1A09']
        docs.forEach(doc => {
          var machineID = doc
          promises.push(getEachMachineRecords1(client.db(config.dbName), machineID, from, to).then(results => {
            machines[machineID] = results
          }))
        })
      retArray = []
      var nameInfoStr = [{key: 'arm', value: '機械手警報次數'},
        {key: 'machine', value: '成型機警報次數'},
        {key: 'change', value: '換模次數'},
        {key: 'produce', value: '生產模次'},
        {key: 'pred', value: '應產數量'},
        {key: 'safe', value: '入庫數量'},
        {key: 'bad', value: '不良數量'},
        {key: 'defective', value: '平均不良率'}
      ]
      Promise.all(promises).then(() => {
        docs.forEach(doc => { // 1A01
          nameInfoStr.forEach(nameInfo => { // 每個項目逐一處理
            retArray.splice(retArray.length, 0, {
              department: '成型一課',
              zone: '1A區',
              machineID: doc,
              nameInfo: nameInfo.value
            })
            var obj = {}
            for (var ind = 0; ind < monthCnt; ind++) { // monthCnt 只是累計的月份，不適要拜訪的月份，因此跨年度會有問題
              machines[doc].forEach(elm => {
                var mCnt = -1
                var trigTime = elm.trigTime || ''
                if (trigTime !== '') {
                  mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                }
                var orderNumber = elm.orderNumber || ''
                if ((mCnt === ind) && (orderNumber !== '')) {
                  if (!obj.hasOwnProperty(orderNumber)) {
                    obj[orderNumber] = elm
                  }
                }
              })
              objArray = Object.keys(obj).map(i => obj[i])
              if (doc === '1A04') {
                // console.log(objArray)
              }
              switch (nameInfo.key) {
                case nameInfoStr[0].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    return item.note === '機械手故障'
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc++
                  }, 0))
                  break
                case nameInfoStr[1].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    return item.note === '成型機故障'
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc++
                  }, 0))
                  break
                case nameInfoStr[2].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    return item.note === '更換模具、模仁'
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc++
                  }, 0))
                  break
                case nameInfoStr[3].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.moldCount
                  }, 0))
                  break
                case nameInfoStr[4].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    var cavities = acc.cavities + 0
                    return acc + curr.moldCount * parseInt(cavities)
                  }, 0) + 0) || 0
                  break
                case nameInfoStr[5].key:
                  retArray[retArray.length - 1][ind.toString()] = (objArray.reduce(function(acc, curr, currIndex, arr) {
                    var warehousing = curr.warehousing 
                  return acc + warehousing
                  }, 0))
                  break
                case nameInfoStr[6].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.badNum
                  }, 0))
                  break
                case nameInfoStr[7].key:
                  retArray[retArray.length - 1][ind.toString()] = (((machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.badNum
                  }, 0))) / (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.moldCount * parseInt(acc.cavities)
                  }, 0)) + 0) || 0
                  break
              }
            }
          })
        })
        res.send({
          type: true,
          data: retArray
        })
        client.close()
      })
    }
  })
})
app.get('/api/getDetectiveData/:from/:to', function (req, res) {
  var fromRecv = req.params.from
  var toRecv = req.params.to
  var monthCnt = moment(toRecv).diff(moment(fromRecv), 'M') + 1
  var from = moment(moment(fromRecv).date(1).format('YYYY-M-D 00:00:00')).toDate()
  var to = moment(moment(toRecv).add(1, 'month').date(0).format('YYYY-M-D 23:59:59')).toDate()
  // console.log(from)
  // console.log(to)
  // var from = moment(moment(reportDate).format('YYYY-MM-DD')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  var idx = 0
  var machines = {}
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var promises = []
      var docs = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08','1A09']
        docs.forEach(doc => {
          var machineID = doc
          promises.push(getEachMachineRecords1(client.db(config.dbName), machineID, from, to).then(results => {
            machines[machineID] = results
          }))
        })
      retArray = []
      var nameInfoStr = [{key: 'arm', value: '機械手警報次數'},
        {key: 'machine', value: '成型機警報次數'},
        {key: 'change', value: '換模次數'},
        {key: 'produce', value: '生產模次'},
        {key: 'pred', value: '應產數量'},
        {key: 'safe', value: '入庫數量'},
        {key: 'bad', value: '不良數量'},
        {key: 'defective', value: '平均不良率'}
      ]
      Promise.all(promises).then(() => {
        docs.forEach(doc => {
          nameInfoStr.forEach(nameInfo => {
            retArray.splice(retArray.length, 0, {
              department: '成型一課',
              zone: '1A區',
              machineID: doc,
              nameInfo: nameInfo.value
            })
            var obj = {}
            for (var ind = 0; ind < monthCnt; ind++) {
              machines[doc].forEach(elm => {
                var mCnt = -1
                var trigTime = elm.trigTime || ''
                if (trigTime !== '') {
                  mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                }
                var orderNumber = elm.orderNumber || ''
                if ((mCnt === ind) && (orderNumber !== '')) {
                  if (!obj.hasOwnProperty(orderNumber)) {
                    obj[orderNumber] = elm
                  }
                }
              })
              objArray = Object.keys(obj).map(i => obj[i])
              if (doc === '1A04') {
                // console.log(objArray)
              }
              switch (nameInfo.key) {
                case nameInfoStr[0].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    return item.note === '機械手故障'
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc++
                  }, 0))
                  break
                case nameInfoStr[1].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    return item.note === '成型機故障'
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc++
                  }, 0))
                  break
                case nameInfoStr[2].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    return item.note === '更換模具、模仁'
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc++
                  }, 0))
                  break
                case nameInfoStr[3].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.moldCount
                  }, 0))
                  break
                case nameInfoStr[4].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    var cavities = acc.cavities + 0
                    return acc + curr.moldCount * parseInt(cavities)
                  }, 0) + 0) || 0
                  break
                case nameInfoStr[5].key:
                  retArray[retArray.length - 1][ind.toString()] = (objArray.reduce(function(acc, curr, currIndex, arr) {
                    var warehousing = curr.warehousing 
                  return acc + warehousing
                  }, 0))
                  break
                case nameInfoStr[6].key:
                  retArray[retArray.length - 1][ind.toString()] = (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.badNum
                  }, 0))
                  break
                case nameInfoStr[7].key:
                  retArray[retArray.length - 1][ind.toString()] = (((machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.badNum
                  }, 0))) / (machines[doc].filter(function(item, index, array) {
                    var mCnt = -1
                    var trigTime = item.trigTime || ''
                    if (trigTime !== '') {
                      mCnt = moment(trigTime).diff(moment(fromRecv), 'M')
                    }
                    return ((item.machineStatusType === '全自動') || (item.machineStatusType === '半自動')) && (item.orderNumber !== '') && (mCnt === ind)
                  }).reduce(function(acc, curr, currIndex, arr) {
                    return acc + curr.moldCount * parseInt(acc.cavities)
                  }, 0)) + 0) || 0
                  break
              }
            }
          })
        })
        res.send({
          type: true,
          data: retArray
        })
      })
      client.close()
    }
  })
})
function getEachMachineRecords1 (db, machineID, from, to) {
  return new Promise((resolve, reject) => {
    var records = []
    var col = db.collection(machineID)
    // // console.log(machineID)
    // // console.log([db, machineID, from, to, machines])
    col.find({$and: [{trigTime: {$gte: from, $lt: to}, lastTrigTime: {$gte: from}, machineStatusType: {$ne: '系統啟動'}}]}).toArray(function (err, docs) {
      if (err) {
        reject(err)
      } else {
        // // console.log('from')
        // // console.log(docs)
        docs.forEach(doc => {
          if (doc['orderNumber'] !== undefined) {
            records.push(doc)
          }
        })
        resolve(records)
        // // console.log(from)
        // // console.log(to)
      }
    })
  })
}
var noteConfigSetting = require('./noteConfigSetting.js')
app.get('/api/getNoteSelectedItem/', function (req, res) {
  noteConfigSetting.getNoteSelectedItem(res)
})
var DailyReportProps = require('./DailyReportProps.js')
app.get('/api/getMachineListRecords/:department/:machineIDs/:reportDate', function (req, res) {
  var machineIDs = req.params.machineIDs.split(',')
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(from).add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var department = req.params.department
  DailyReportProps.getDailyReportProps(machineIDs, from, to, res)
})
app.get('/api/getDepartmentList/:department', function (req, res) {
  var department = req.params.department
  // // console.log(machineID)
  // MongoClient.connect(config.dbUrl + config.dbName).then(db => {
  MongoClient.connect(config.dbUrl, function(err0, client){
    if (err0) {
      res.send({
        type: false,
        data: 'Error occured: ' + err0
      })
      client.close()
    } else {
      var col = client.db(config.dbName).collection(config.machineListColName)
      col.find().toArray(function (err, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
          client.close()
        } else {
          var departmentObj = {}
          var zoneObj = {}
          docs.forEach(element => {
            if(!departmentObj.hasOwnProperty(element['department'])) {
              departmentObj[element['department']] = Object.keys(departmentObj).length
            }
            if(element['department'] === department) {
              var machineIDsplit = (element['machineID']).substr(0, 2)
              if(!zoneObj.hasOwnProperty(machineIDsplit)) {
                zoneObj[machineIDsplit] = Object.keys(zoneObj).length
              }
            }
          })
          res.send({
            type: true,
            data: {
              department: departmentObj,
              zone: zoneObj
            }
          })
          client.close()
          console.log({
            department: departmentObj,
            zone: zoneObj
          })
        }
      })
    }
  })
})
var IntegratedDailyReport = require('./IntegratedDailyReport.js')
app.get('/api/getDailyIntegratedReport/:machineIDs/:reportDate', function (req, res) {
  var machineIDs = req.params.machineIDs.split(',')
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(from).add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  IntegratedDailyReport.getDailyIntegratedReport(machineIDs, from, to, res)
})
function integratedDailyAcc(retArray) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
      client.close()
    } else {
      var retAccArr = []
      retArray.forEach(ret => {
        var machineID = ret.machineID
        var orderNumber = ret.orderNumber
        var acc = 0
        var predMoldCnt = 0
        client.db(config.dbName).collection(machineID).find({$and: [{'orderNumber': orderNumber}, {$or: [{'machineStatusType': '半自動'}, {'machineStatusType': '全自動'}]}]}).toArray(function(err2, docs2) {
          if (err2) {
            acc = 0
          } else {
            predMoldCnt = docs2[0].predMoldCnt
            // console.log(predMoldCnt)
            acc = docs2.reduce(function (previousValue, currentValue, index, array) {
              return previousValue + currentValue.moldCount  
            }, 0)
          }
          retAccArr.splice(retAccArr.length, 0, {
            machineID: machineID,
            orderNumber: orderNumber,
            accMoldCnt: acc,
            percentage: acc / predMoldCnt
          })
        })
      })
    }
  })
}
var monitor = require('./monitor.js') 
//----------------------------------------------------------------------------
app.get('/api/updateMonitorHWCfgV3/:machineIDs', function (req, res) {
  var subStr = firstDailyPoint.split(':')
  // var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var machineIDs = req.params.machineIDs.split(",")
  monitor.updateMonitorHWCfgV3(machineIDs, res)
})
app.get('/api/getMachineStsV2/:machineIDs/:from/:to', function (req, res) {
  var subStr = firstDailyPoint.split(':')
  var from = (moment(req.params.to).hours() * 60 + moment(req.params.to).minutes()) > (parseInt(subStr[0]) * 60 + parseInt(subStr[1])) ? moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').toDate() : moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').subtract(1,'day').toDate()
  var to = (moment(req.params.to).hours() * 60 + moment(req.params.to).minutes()) > (parseInt(subStr[0]) * 60 + parseInt(subStr[1])) ? moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').add(1,'day').toDate() : moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').toDate()
  // var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(0,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var machineIDs = req.params.machineIDs.split(",")
  monitor.getMachineStsV2(machineIDs, from, to, res, monitorModalClientList)
})
app.get('/api/getMachineStsSMBV2/:machineIDs/:from/:to', function (req, res) {
  var subStr = firstDailyPoint.split(':')
  var from = (moment(req.params.to).hours() * 60 + moment(req.params.to).minutes()) > (parseInt(subStr[0]) * 60 + parseInt(subStr[1])) ? moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').toDate() : moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').subtract(1,'day').toDate()
  var to = (moment(req.params.to).hours() * 60 + moment(req.params.to).minutes()) > (parseInt(subStr[0]) * 60 + parseInt(subStr[1])) ? moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').add(1,'day').toDate() : moment(moment(req.params.to).format('YYYY-MM-DD') + ' ' + firstDailyPoint, 'YYYY-MM-DD HH:mm').toDate()
  // var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var machineIDs = req.params.machineIDs.split(",")
  monitor.getMachineStsSMBV2(machineIDs, from, to, res, monitorModalClientList)
})
//----------------------------------------------------------------------------
app.get('/api/updateMonitorHWCfg/:department', function (req, res) {
  var department = req.params.department
  var arrayRes = Array(6)
  var replacerArray = []
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName)
      var  i = 0
      db.collection(config.machineListColName).find({'department': department}).count()
        .then(function(idx0) {
          arrayRes[0] = idx0
        })
      db.collection(config.machineListColName).find({'department': department}, {}, function (err0, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
          client.close()
        } else {          
          var idx= 0
          docs.forEach(doc0 => {
            replacerArray.splice(replacerArray.length, 0, {
              'machineID': doc0.machineID
            })
            idx++
            if (arrayRes[0] === idx) {
              var jsonText = JSON.stringify(replacerArray)
              db.collection('lastDeviceID').find({'machineID': {$gte: '1A01', $lte: '1A09'}}).toArray( function (err1, docs1) {
                if (err1) {
                  res.send({
                    type: false,
                    data: 'Error occured: ' + err1
                  })
                } else {
                  docs1.forEach(doc1 =>{
                    db.collection(doc1.machineID).findOne({'_id': doc1.last}, function(err2, doc2) {
                      for(recv in monitorModalClientList) {
                        monitorModalClientList[recv].emit('showMachineSts', doc2)
                      }
                    })
                  })
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
                  res.send({
                    type: true,
                    data: arrayRes
                  })
                  client.close()
                }
              })
            }
          }) 
        }
      })
    }
  })
})
app.get('/api/updateModalHWCfg/:machineID', function (req, res) {
  var machineID = req.params.machineID
  monitor.updateModalHWCfg(machineID, res)
})
app.get('/api/updateModalAlmHWCfg/:machineID/:from/:to', function (req, res) {
  var subStr = firstDailyPoint.split(':')
  var mfrom = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').date(1).format('YYYY-MM-DD HH:mm:ss')).toDate()
  var mto = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'month').date(1).format('YYYY-MM-DD HH:mm:ss')).toDate()
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var machineID = req.params.machineID
  monitor.updateModalAlmHWCfg(machineID, mfrom, mto, from, to, res)
})
app.get('/api/updateModalUtilizationHWCfg/:machineID/:from/:to', function (req, res) {
  var subStr = firstDailyPoint.split(':')
  var mfrom = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').subtract(2, 'month').date(1).format('YYYY-MM-DD HH:mm:ss')).toDate()
  var mto = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(0,'month').date(1).format('YYYY-MM-DD HH:mm:ss')).toDate()
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var machineID = req.params.machineID
  monitor.updateModalUtilizationHWCfg(machineID, mfrom, mto, from, to, res)
})
app.get('/api/getMachineCurrInfo/:machineID', function (req, res) {
  var machineID = req.params.machineID
  monitor.getMachineCurrInfo(machineID, res)
})
app.get('/api/getMachineSts/:from/:to', function (req, res) {
  var from = req.params.from
  var to = req.params.to
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName)
      var col = db.collection(config.machineListColName)
      // console.log('property')
      // console.log(hwCfgList)
      // console.log('1111111')
      var selected = hwCfgList.filter(function (elm) {
        // console.log(elm['machineID'])
        if ((from <= elm['machineID']) && (to >= elm['machineID']))
        {
          return elm
        }
      })
      // console.log('property')
      // console.log(selected)
      selected.forEach(elm => {
        // console.log(elm['machineID'])
        // console.log(elm['propertyNum'])
      })
      col.find({'machineID': {$gte: from, $lt: to}}, {}, function (err, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
          client.close()
        } else {
          docs.forEach(doc => {
            // console.log(doc.machineID)
          })  
          /* res.send({
            type: true,
            data: null
          }) */
        }
      })
    }
    db.collection('lastDeviceID').find({}).toArray( function (err0, docs0){
      if (err0) {
        res.send({
          type: false,
          data: 'Error occured: ' + err0
        })
        client.close()
      } else {
        docs0.forEach(doc0 => {
          // console.log(doc0.machineID)
          // console.log(doc0.STS)
        })
        res.send({
          type: true,
          data: docs0
        })
        client.close()
      }
    })
  })
})
var shiftTable = require('./shiftTable.js')
app.get('/api/updateShiftTable/:machineID/:tgtDate/:shift/:newData', function (req, res) {
  var machineID = req.params.machineID
  var tgtDate = req.params.tgtDate
  var shift = req.params.shift
  var newData = (req.params.newData === 'true')
  // console.log(machineID)
  // console.log(tgtDate)
  // console.log(shift)
  // console.log(newData)
  shiftTable.updateShiftTable(machineID, tgtDate, shift, newData, res)
  shiftTable.updateShiftTable1(machineID, tgtDate, shift, newData, res)
})
app.get('/api/loadDefaultSettingShiftTable/:machineIDs/:tgtDate', function (req, res) {
  var machineIDs = req.params.machineIDs.split(',')
  var tgtDate = req.params.tgtDate
  shiftTable.loadDefaultSettingShiftTable2(machineIDs, tgtDate, res)
  machineIDs.forEach(machineID => {
    shiftTable.loadDefaultSettingShiftTable(machineID, tgtDate, res)
    shiftTable.loadDefaultSettingShiftTable1(machineID, tgtDate, res)
  })
  res.send({
    type: true,
    data: true
  })
})
app.get('/api/getValidCalendar/:from/:to', function (req, res) {
  var from = req.params.from
  var to = req.params.to
  shiftTable.getValidCalendar(from, to, res)
})
app.get('/api/getCalendar/:machineID/:year/:month/:day', function (req, res) {
  var year =  req.params.year
  var month = req.params.month
  var day = req.params.day
  var machineID = req.params.machineID // '1A09'
  // console.log(year+ '/' + month + '/' + day)
  var V = config.dbUrl + 'calendar' + year
  // MongoClient.connect(config.dbUrl + config.calendar).then(db => {
  shiftTable.getCalendar(machineID, year, month, day, res)
})
app.get('/api/getshiftRecord/:machineIDs/:year/:month/:day', function (req, res) {
  var year =  req.params.year
  var month = req.params.month
  var day = req.params.day
  var machineIDs = req.params.machineIDs.split(',') // '1A09'
  // console.log(year+ '/' + month + '/' + day)
  var V = config.dbUrl + 'calendar' + year
  // MongoClient.connect(config.dbUrl + config.calendar).then(db => {
  shiftTable.getshiftRecord(machineIDs, year, month, day, res)
})
//---------------------------------------------------------------------------
var RegisterProps = require('./RegisterProps.js')
app.get('/api/getMachineRecords/:machineID/:reportDate/:reportDateTo', function (req, res) {
  var machineID = req.params.machineID
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var reportDateTo = moment(req.params.reportDateTo).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  var to = moment(moment(reportDateTo).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  RegisterProps.getMachineRecords(machineID, from, to, res)
})
app.get('/api/getMachineRecordsWA/:machineID/:reportDate/:reportDateTo', function (req, res) {
  var machineID = req.params.machineID
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var reportDateTo = moment(req.params.reportDateTo).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  var to = moment(moment(reportDateTo).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  RegisterProps.getMachineRecordsWA(machineID, from, to, res)
})
app.get('/api/getRegisterCompare/:machineID/:reportDate/:reportDateTo', function (req, res) {
  var machineID = req.params.machineID
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var reportDateTo = moment(req.params.reportDateTo).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  var to = moment(moment(reportDateTo).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  if (machineID.indexOf('1A') > -1) {
    RegisterProps.getRegisterCompare(machineID, from, to, res)
  } else {
    RegisterProps.getRegisterCompareExcept1A(machineID, from, to, res)
  }
})
app.get('/api/getRegisterCompareAlm/:machineID/:reportDate/:reportDateTo', function (req, res) {
  var machineID = req.params.machineID
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var reportDateTo = moment(req.params.reportDateTo).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  var to = moment(moment(reportDateTo).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  if (machineID.indexOf('1A') > -1) {
    RegisterProps.getRegisterCompareAlm(machineID, from, to, res)
  } else {
    RegisterProps.getRegisterCompareAlmExcept1A(machineID, from, to, res)
  }
})
app.get('/api/getMachineAlarmRecords/:machineID/:reportDate/:reportDateTo', function (req, res) {
  var machineID = req.params.machineID
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var reportDateTo = moment(req.params.reportDateTo).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  var to = moment(moment(reportDateTo).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  RegisterProps.getMachineAlarmRecords(machineID, from, to, res)
})
app.get('/api/getMachineRecordsNew/:machineID/:reportDate/:reportDateTo', function (req, res) {
  var machineID = req.params.machineID
  var reportDate = moment(req.params.reportDate).format('YYYY-MM-DD HH:mm:ss')
  var reportDateTo = moment(req.params.reportDateTo).format('YYYY-MM-DD HH:mm:ss')
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(reportDate).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  // var to = moment(moment(reportDate).format('YYYY-MM-DD 23:59:59')).toDate()
  var to = moment(moment(reportDateTo).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  RegisterProps.getMachineRecordsNew(machineID, from, to, res)
})
app.get('/api/buildTableByRealData/:machineID/:reportDate/:reportDateTo', function (req, res) {
  var machineID = req.params.machineID
  var from = moment(moment(req.params.reportDate).format('YYYY-MM-DD') + ' ' + firstDailyPoint).toDate()
  var to = moment(moment(req.params.reportDateTo).add(1,'day').format('YYYY-MM-DD') + ' ' + firstDailyPoint).toDate()
  RegisterProps.buildTableByRealData(machineID, from, to, res)
})
app.get('/api/getCalendar/:machineID/:year', function (req, res) {
  var year = req.params.year
  var machineID = req.params.machineID
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: 'Error occured: ' + err0
      })
    } else {
      client.db(config.calendarDbNamePrefix + year).collection(machineID).find().toArray(function (err, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
          client.close()
        } else {
          // // console.log(JSON.stringify(docs, null, 2))
          res.send({
            type: true,
            data: docs
          })
          client.close()
        }
      })
    }
  })
})
app.get('/api/calendar/:machineID/:year', function (req, res) {
  var year = req.params.year
  var machineID = req.params.machineID
  MongoClient.connect(config.dbUrl + config.calendarDbNamePrefix + year).then(db => {
    var col = db.collection(machineID)
    // col.find({Trig_Time: {$gte: date}}).toArray(function (err, docs) {
    // col.find().toArray(function (err, docs) {
    col.find().toArray(function (err, docs) {
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        // // console.log(JSON.stringify(docs, null, 2))
        res.send({
          type: true,
          data: docs
        })
      }
      db.close()
    })
  }).catch(err => {
    if (err) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.calendarDbNamePrefix + year}`
      })
    }
  })
})

app.get('/api/getOrderList', function (req, res) {
  RegisterProps.getOrderList(res)
  // MongoClient.connect(config.dbUrl + config.dbName).then(db => {
  /* MongoClient.connect(config.dbUrl, function (err0, client) {
    var col = client.db(config.dbName).collection(config.orderListColName)
    col.find().toArray(function (err, docs) {
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        // // console.log(JSON.stringify(docs, null, 2))
        res.send({
          type: true,
          data: docs
        })
      }
      client.close()
      // db.close()
    })
  }) */ /* .catch(err => {
    if (err) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    }
  }) */
})

app.get('/api/getMachineList', function (req, res) {
  // // console.log(machineID)
  // MongoClient.connect(config.dbUrl + config.dbName).then(db => {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {

    } else {
      //var col = client.db(config.dbName).collection(config.machineListColName)
      var col = client.db(config.dbName).collection('organization')
      col.find({'level': 1}).toArray(function (err, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else {
          var newDocs = docs.map(x => {
            return {'machineID': x._id}
          })
          console.log(newDocs)
          res.send({
            type: true,
            data: newDocs
          })
        }
        client.close()
      // db.close()
      })
    }
  }) /* .catch(err => {
    if (err) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    }
  }) */
})

app.get('/api/getDepartmentList', function (req, res) {
  // // console.log(machineID)
  var departmentList = []
  // MongoClient.connect(config.dbUrl + config.dbName).then(db => {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    var col = client.db(config.dbName).collection(config.machineListColName)
    col.find().toArray(function (err, docs) {
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        docs.forEach(doc => {
          if (departmentList.indexOf(doc.department) === -1) {
            departmentList.push(doc.department)
          }
        })
        res.send({
          type: true,
          data: departmentList
        })
      }
      client.close()
      // db.close()
    })
  }) /* .catch(err => {
    if (err) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    }
  }) */
})

app.post('/api/fileUpload', function (req, res) {
  // // console.log(JSON.stringify(req.body, null, 2))
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) {
      throw err
    }
    // // console.log(files)
    var oldpath = files.file.path
    var newpath = path.resolve(path.join(config.uploadFolder) + files.file.name)
    // // console.log(newpath)
    var readStream = fs.createReadStream(oldpath)
    var writeStream = fs.createWriteStream(newpath)

    readStream.pipe(writeStream)
    readStream.on('end', function () {
      // Operation done
      fs.unlinkSync(oldpath)
      res.send({
        type: true,
        data: [{
        }]
      })
      // MongoClient.connect(config.dbUrl + config.dbName).then(db => {
      MongoClient.connect(config.dbUrl, function (err0, client) {
        var col = client.db(config.dbName).collection(config.calHandleCommandColName)
        col.insertOne({
          fileName: files.file.name,
          opcode: opcodes.notify_upload_opcode
        })/* .then(result => {
          db.close()
        }) */
      })
    })
  })
})

app.get('/api/getFileMappingTable', function (req, res) {
  // // console.log(machineID)
  MongoClient.connect(config.dbUrl + config.fileMappingDbName).then(db => {
    var col = db.collection(config.fileNameColName)
    col.find().toArray(function (err, docs) {
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        res.send({
          type: true,
          data: docs
        })
      }
      db.close()
    })
  }).catch(err => {
    if (err) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    }
  })
})

app.post('/api/setFileName', function (req, res) {
  // // console.log(JSON.stringify(req.body, null, 2))
  res.send({
    type: true
  })
  MongoClient.connect(config.dbUrl + config.dbName).then(db => {
    var col = db.collection(config.calHandleCommandColName)
    col.insertOne({
      opcode: opcodes.set_file_name_opcode,
      tgtDocId: req.body.type,
      fileName: req.body.name
    }).then(result => {
      db.close()
    })
  })
})

app.post('/api/setSheetName', function (req, res) {
  // // console.log(JSON.stringify(req.body, null, 2))
  res.send({
    type: true
  })
  MongoClient.connect(config.dbUrl + config.dbName).then(db => {
    var col = db.collection(config.calHandleCommandColName)
    col.insertOne({
      opcode: opcodes.set_sheet_name_opcode,
      tgtDocId: req.body.type,
      sheetName: req.body.name
    }).then(result => {
      db.close()
    })
  })
})

app.post('/api/setIndexName', function (req, res) {
  // // console.log(JSON.stringify(req.body, null, 2))
  res.send({
    type: true
  })
  MongoClient.connect(config.dbUrl + config.dbName).then(db => {
    var col = db.collection(config.calHandleCommandColName)
    col.insertOne({
      opcode: opcodes.set_index_name_opcode,
      tgtDocId: req.body.type,
      keyName: req.body.name
    }).then(result => {
      db.close()
    })
  })
})

app.post('/api/uploadAllFiles', function (req, res) {
  // // console.log(JSON.stringify(req.body, null, 2))
  res.send({
    type: true
  })
  MongoClient.connect(config.dbUrl + config.dbName).then(db => {
    var col = db.collection(config.calHandleCommandColName)
    col.insertOne({
      opcode: opcodes.upload_all_files
    }).then(result => {
      db.close()
    })
  })
})
function getEachMachineRecords (db, machineID, from, to) {
  return new Promise((resolve, reject) => {
    var records = []
    var col = db.collection(machineID)

    // // console.log(machineID)
    // // console.log([db, machineID, from, to, machines])
    col.find({ $and: [{trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}, {machineStatusType: {$ne: '系統啟動'}}]}).toArray(function (err, docs) {
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


function getEachMachineProductRecords (db, machineID, from, to, callback) {
    var col = db.collection(machineID)
    var records = []

    //// console.log(machineID)
    col.find({ $and : [{trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}, {machineStatusType: {$ne: '系統啟動'}}, {machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) {
      if (err) {
	// console.log( 'err' )
        reject(err)
      } else {
	var j

	for ( j = 0  ; j < docs.length ; j++ ) {
          if ((docs[j].orderNumber !== undefined) && (docs[j].orderNumber !== "") && (docs[j].orderNumber !== null)) {
	    records.push( docs[j] )
          }
        }
        //// console.log('records.length : ' + records.length)
      }
      //// console.log('records.length : ' + records.length)
      callback(records, machineID)
    })
} 


function getMachineProductRecords (db, machineIDs, from, to, callback) {
  var totalRecords = {} // totalRecords = []
  var i
  //var records = []
//// console.log('machineIDs.length : ' +  machineIDs.length)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {
    //// console.log( 'i : ' + i )

    getEachMachineProductRecords (db, machineIDs[i], from, to, function(records, machineID) {
      //// console.log( 'tmp : ' + tmp )
      //// console.log('EachMachine record : ' +  records.length)
      totalRecords[machineID] = records // totalRecords = totalRecords.concat(records)
      if (records.length > 0) {
        totalRecords[machineID][0]['machineID'] = machineID
      }
      //// console.log('totleRecords : ' + totalRecords.length)
      tmp++
      if ( tmp == machineIDs.length ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
    })
  }
}


function getEachMachineMoldProductRecords (db, machineID, moldNum, from, to, callback) {
    var col = db.collection(machineID)
    var records = []

//// console.log('getEachMachineMoldProductrecords')
//    // console.log(machineID)
    col.find({ $and: [{moldNum: moldNum}, {trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}]}).toArray(function (err, docs) {
      if (err) {
	// console.log( 'err' )
        //reject(err)
      } else {
	callback(docs)
        //// console.log('docs.length : ' + docs.length)
      }
    })
} 


function getProductOrderEachMachineRecords (db, machineID, product, from, to, callback) {
    var col = db.collection(machineID)
    var records = []

//// console.log('getEachMachineMoldProductrecords')
//    // console.log(machineID)
    col.find({ $and: [{product: product}, {orderNumber:{$exists:true,$nin:[null,""]}}, {trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}]}).toArray(function (err, docs) {
      if (err) {
	// console.log( err )
        //reject(err)
      } else {
        //// console.log('docs.length : ' + docs.length)
	callback(docs)
      }
    })
} 


function getMachineMoldProductAnalysisRecords (db, machineIDs, moldNum, from, to, callback) {

//function getMachineMoldProductRecords (db, machineIDs, from, to, callback) {
  var totalRecords = []
  var i
  //var records = []
//// console.log('getMachineMoldProductrecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getEachMachineMoldProductRecords (db, machineIDs[i], moldNum, from, to, function(records) {
      tmp++
      if ( records.length > 0 ) {
        //// console.log('EachMachine record : ' +  records.length)
      	totalRecords = totalRecords.concat(records)
      	//// console.log('totleRecords : ' + totalRecords.length)
      }

      if ( tmp == machineIDs.length ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
    })
  }
}


function getMachineMoldProductRecords (db, machineIDs, from, to, callback) {
  var totalRecords = []
  var i
  //var records = []
//// console.log('getMachineMoldProductrecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getEachMachineProductRecords (db, machineIDs[i], from, to, function(records, machineID) {
      tmp++
      //// console.log( 'tmp : ' + tmp )
      //// console.log('EachMachine record : ' +  records.length)
      totalRecords = totalRecords.concat(records)
      //// console.log('totleRecords : ' + totalRecords.length)

      if ( tmp == machineIDs.length ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
    })
  }
}


function getMachineMoldProductAnalysisRecords (db, machineIDs, moldNum, from, to, callback) {
//function getMachineMoldProductRecords (db, machineIDs, from, to, callback) {
  var totalRecords = []
  var i
  //var records = []
//// console.log('getMachineMoldProductrecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getEachMachineMoldProductRecords (db, machineIDs[i], moldNum, from, to, function(records) {
      tmp++
      if ( records.length > 0 ) {
        // console.log('EachMachine record : ' +  records.length)
      	totalRecords = totalRecords.concat(records)
      	// console.log('totleRecords : ' + totalRecords.length)
      }

      if ( tmp == machineIDs.length ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
    })
  }
}


function getMachineProductAnalysisRecords (db, machineIDs, product, from, to, callback) {
  var totalRecords = []
  var i
//// console.log('getMachineProductAnalysisRecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getProductOrderEachMachineRecords (db, machineIDs[i], product, from, to, function(records) {
      tmp++
      //// console.log( 'tmp : ' + tmp )
      if ( records.length > 0 ) {
        //// console.log('EachMachine record : ' +  records.length)
      	totalRecords = totalRecords.concat(records)
      	//// console.log('totleRecords : ' + totalRecords.length)
      }

      if ( tmp == machineIDs.length ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
    })
  }
}


function getOrderFromEachMachineRecords (clientData, machineID, orderArr) {
  var records = []
  clientData.db(config.dbName).collection(machineID).find({$or: orderArr}).toArray(function (err1, docs) {
    if (err1) {
      reject(err)
      // console.log('2')
      // socket.emit('getTotalTargetCountFail', data)
    } else {
      orderArr.forEach(elm => {
        var subDocs = docs.filter(doc => {
          if (((doc['machineStatusType'] === '半自動') || (doc['machineStatusType']  === '全自動')) && (elm.orderNumber === doc.orderNumber)) {
            return doc
          }
        })
        //// console.log('subDocs')
        //// console.log(machineID)
        //// console.log(subDocs)
        var total = subDocs.reduce(function (previousValue, currentValue, index, array) {
          return previousValue + currentValue.moldCount  
        }, 0)
        var obj = {
          totalTargetCount: total * subDocs[0].cavities
        }
        records.push(obj)
      })
      resolve(records)
    }
  })
}

app.get('/api/getPeriodMachineRecords_BK/:departmentID/:from/:to', function (req, res) {
  var departmentIDT = req.params.departmentID
  // console.log(departmentIDT)
  var departmentID = '1A01'
  var from = new Date(req.params.from)
  var to = new Date(req.params.to)
  // console.log([from, to])

  var machines = {}
  // MongoClient.connect(config.dbUrl + config.dbName).then(db => {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    db = client.db(config.dbName)
    var col = db.collection(config.machineListColName)
    col.find({department: departmentID}).toArray(function (err, docs) {
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
        client.close()
      } else {
        var promises = []
        docs.forEach(doc => {
          var machineID = doc.machineID
          promises.push(getEachMachineRecords(db, machineID, from, to).then(results => {
            machines[machineID] = results
          }))
        })

        Promise.all(promises).then(() => {
          res.send({
            type: true,
            data: machines
          })
          client.close()
          // db.close()
        }).catch(err => {
          // console.log(err)
          res.send({
            type: false
          })
          client.close()
          // db.close()
        })
      }
    })
  }) /* .catch(err => {
    if (err) {
      res.send({
        type: false,
        data: `Can't connect to ${config.dbUrl}${config.dbName}`
      })
    }
  }) */
})
// --------------------------------------------------------Increase-----------------------------
var layout = require('./layout.js')
app.get('/api/getProductArr', function (req, res) {
  layout.getProductArr(res)
})
app.get('/api/getMoldArr', function (req, res) {
  layout.getMoldArr(res)
})
// --------------------------------------------------------Test-----------------------------
app.get('/api/getAbnormalTable/:machineIDArr/:from/:to/:Ind', function (req, res) {
  var machineIDs = req.params.machineIDArr.split(",")
  var Ind = req.params.Ind
  // console.log('getAbnormalTable');
//// console.log('machineIDs : ' + machineIDs)

  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
//// console.log([from.toString(), to.toString()])

  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName);

      getAbnormalTableMachineRecords (db, machineIDs, from, to, Ind, function(abnormalTableReport) {
	  //// console.log('abnormalTableReport : ' +  JSON.stringify(abnormalTableReport))
	  res.send({
	      type:true,
	      data: abnormalTableReport
    })
    client.close()
      })
    }
  })
})
app.get('/api/getWorkDays/:machineID/:from/:to/:calMethod', function (req, res) {
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).subtract(parseInt(subStr[0]), 'hours').subtract(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(0,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var machineArrary = req.params.machineID.split(',')
  var startDate =  moment(from).format('YYYY/M/DD')
  var endDate =  moment(to).format('YYYY/M/DD')
  var calMethod = req.params.calMethod
  var first = false
  var second = false
  var third = false
  var machines = {}
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
      client.close()
    } else {
      var promises = []
      var db = client.db('calendar' + moment(startDate).year())
      machineArrary.forEach(machineID => {
        promises.push(getEachWorkDays(client, machineID, from, to, calMethod).then(results => {
          machines[machineID] = results
        }))
      })
      var resData = {}
      Promise.all(promises).then(() => {
        res.send({
          type: true,
          data: machines // resData
        })
        client.close()
      })
    }
  })
})
function getEachWorkDays (client, machineID, startDate, endDate, calMethod) {
  return new Promise((resolve, reject) => {
    client.db('calendar' + moment(startDate).year()).collection(machineID).find({$and: [{date: {$gte: startDate}}, {date: {$lte: endDate}}]}).toArray(function (err2, docs) {
      if(err2) {
        reject(err)
      } else {
        var docsFilter = []
        if (calMethod === 'D') {
          docsFilter = docs.filter(doc => {
            return doc.isHoliday === false
          })
        } else if (calMethod === 'C') {
          docsFilter = docs.filter(doc => {
            return doc.holidayCategory !== '星期六、星期日'
          })
        } else if (calMethod === 'B') {
          docsFilter = docs.filter(doc => {
            return moment(doc._id).format('e') === 0
          })
        } else {
          docsFilter = docs
        }
        var days = docsFilter.filter(doc => {
          return (doc['first'] === true) || (doc['second'] === true) || (doc['third'] === true)
        })
        resolve(days.length)
      }
    })
  })
}
app.get('/api/getWorkDays/:machineID/:from/:to', function (req, res) {
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).subtract(parseInt(subStr[0]), 'hours').subtract(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(0,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var machineArrary = req.params.machineID.split(',')
  var startDate =  moment(from).format('YYYY/M/DD')
  var endDate =  moment(to).format('YYYY/M/DD')
  var first = false
  var second = false
  var third = false
  var machines = {}
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var promises = []
      var db = client.db('calendar' + moment(startDate).year())
      machineArrary.forEach(machineID => {
        // promises.push(getEachWorkDays(client, machineID, from, to, calMethod).then(results => {
        promises.push(getEachWorkDays(client, machineID, from, to).then(results => {
          machines[machineID] = results
        }))
      })
      var resData = {}
      Promise.all(promises).then(() => {
        res.send({
          type: true,
          data: machines // resData
        })
        client.close()
      })
    }
  })
})
function getEachWorkDays (client, machineID, startDate, endDate) {
  return new Promise((resolve, reject) => {
    client.db('calendar' + moment(startDate).year()).collection(machineID).find({$and: [{date: {$gte: startDate}}, {date: {$lte: endDate}}]}).toArray(function (err2, docs) {
      if(err2) {
        reject(err)
      } else {
        var days = docs.filter(doc => {
          return (doc['first'] === true) || (doc['second'] === true) || (doc['third'] === true)
        })
        resolve(days.length)
      }
    })
  })
}
  var IntegratedPeriodlyReportProps = require('./IntegratedPeriodlyReportProps.js')
  app.get('/api/getPeriodMachineRecords/:machineIDs/:from/:to', function (req, res) {
    var subStr = firstDailyPoint.split(':')
    var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var machineIDs = req.params.machineIDs.split(",")
      IntegratedPeriodlyReportProps.getPeriodMachineRecords(machineIDs, from, to, res)
  })
  var machines = [{
    machineID: '1A01',
    totalAlm: 0,
    product: '4825-2802',
    cavities: 1,
    sortStartTime: '',
    startTime: '2016/6/1 13:02:20',
    endTime: '2016/6/1 16:28:20',
    duration: '3:25:53', // 排班工作時間累計
    moldCount: 420,
    targetCount: 420,
    warehousing: 408,
    badNum: 12,
    badRate: 2.9,
    standard: 28,
    min: 29.2,
    average: 29.4,
    performance: 95.2,
    deadline: '6/5'
  }, {
    machineID: '1A01',
    totalAlm: 0,
    product: '4825-2802',
    cavities: 1,
    sortStartTime: '',
    startTime: '2016/6/1 13:02:20',
    endTime: '2016/6/1 16:28:20',
    duration: '32:20:07', // 排班工作時間累計
    moldCount: 4227,
    targetCount: 4227,
    warehousing: 4188,
    badNum: 39,
    badRate: 0.9,
    standard: 28,
    min: 27.3,
    average: 27.5,
    performance: 101.7,
    deadline: '5/28'
  }]
  
// ----------成品料號製程分析-----------
var ProductProcessAnalysis = require('./ProductProcessAnalysis.js')
app.get('/api/getProductProcessAnalysis/:machineIDs/:product/:from/:to', function (req, res) {
  var machineIDs = req.params.machineIDs.split(",")
  var product = req.params.product
//// console.log('getProductProcessAnalysis');
//// console.log('machineIDs : ' + machineIDs.toString())
//// console.log('product : ' + product)

  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
//// console.log([from.toString(), to.toString()])
  ProductProcessAnalysis.getProductProcessAnalysis(machineIDs, product, from, to, res)
})
  
// ----------成品料號製程分析-----------
var MoldProcessAnalysis = require('./MoldProcessAnalysis.js')
app.get('/api/getMoldProcessAnalysis/:machineIDs/:moldNum/:from/:to', function (req, res) {
  var machineIDs = req.params.machineIDs.split(",")
  var moldNum = req.params.moldNum
// console.log('getMoldProcessAnalysis');
// console.log('machineIDs : ' + machineIDs.toString())
// console.log('moldNum : ' + moldNum)
  var DBmoldNum = moldNum // "MM".concat(moldNum)
// console.log('moldNum : ' + DBmoldNum)
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
// console.log([from.toString(), to.toString()])
  MoldProcessAnalysis.getMoldProcessAnalysis(machineIDs, DBmoldNum, from, to, res)
})
var MoldPeriodMachineRecords = require('./MoldPeriodReportProps.js')
app.get('/api/getMoldPeriodMachineRecords/:machineIDs/:from/:to/:MoldReportFrom/:MoldReportTo', function (req, res) {
  var MoldReportFrom = req.params.MoldReportFrom
  var MoldReportTo = req.params.MoldReportTo
  var machineIDs = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'] // req.params.machineIDs.split(",")
// console.log('getMoldPeriodMachineRecords');
//// console.log('machineIDs : ' + machineIDs)

  var subStr = firstDailyPoint.split(':')
//// console.log(moment(req.params.from).format('YYYY-MM-DD HH:mm:ss'))
//// console.log(moment(req.params.to).format('YYYY-MM-DD HH:mm:ss'))
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  MoldPeriodMachineRecords.getMoldPeriodMachineRecords(machineIDs, from, to, res, MoldReportFrom, MoldReportTo)
//// console.log([from.toString(), to.toString()])
})
var ProductPeriodReportProps = require('./ProductPeriodReportProps.js')  
  app.get('/api/getProductPeriodMachineRecords/:machineID/:from/:to/:ProductReportFrom/:ProductReportTo', function (req, res) {
    var ProductReportFrom = req.params.ProductReportFrom
    var ProductReportTo = req.params.ProductReportTo
    var machineIDs = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'] // req.params.machineID.split(",")
  // console.log('getProductPeriodMachineRecords');
  // console.log('machineIDs : ' + machineIDs)
    var subStr = firstDailyPoint.split(':')
  // console.log(moment(req.params.from).format('YYYY-MM-DD HH:mm:ss'))
  // console.log(moment(req.params.to).format('YYYY-MM-DD HH:mm:ss'))
    var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
    ProductPeriodReportProps.getProductPeriodMachineRecords(machineIDs, from, to, res, ProductReportFrom, ProductReportTo) 
  })
  app.get('/api/getUtilizationMachineRecords/:machineIDs/:from/:to', function (req, res) {
    var machineIDs = req.params.machineIDs.split(",")
  //// console.log('getUtilizationMachineRecords');
  //// console.log('machineIDs : ' + machineIDs)
  
    var subStr = firstDailyPoint.split(':')
    var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  //// console.log([from.toString(), to.toString()])
    
    
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
  // console.log('failed to connect')
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
      } else {
        var db = client.db(config.dbName);
  
        var totalProducts = [] 
        var machineRecords = []
        var utilizationReport = []
  
        getMachineProductRecords (db, machineIDs, from, to, function(totalProducts) {
          /* if ( totalProducts.length === 0 ) {
            res.send({
              type:true,
              data: utilizationReport
            })
            client.close()
          }
          while ( totalProducts.length > 0 ) { */
            var index = 0
            var totalProductsKeys = Object.keys(totalProducts)
            totalProductsKeys.forEach(totalProductsKey => {
        //// console.log( 'totalProducts.length : ' + totalProducts.length)
        // console.log(totalProductsKey)
        retrieveEachMachineRecords (totalProducts[totalProductsKey], totalProductsKey,  function(machineRecordsA, machineID) {
          
                var utilizationData = []
      
      //// console.log( 'totalProducts.length : ' + totalProducts.length)
      //// console.log( 'machineRecords.length : ' + machineRecords.length)
          utilizationData = buildUtilizationData( machineRecordsA, machineID )
   
          utilizationReport.push( utilizationData )
      //// console.log('utilizatioReport.length : ' + utilizationReport.length)
      index++
              if (index === totalProductsKeys.length) { // if ( totalProducts.length == 0 ) {
              //var machineID = machineRecords[0].machineID
              //// console.log('machineID : ' + machineID)
              getMachineInfoRecords(db, machineIDs, function(machineRecords) {
            if ( machineRecords == undefined ) {
                  // console.log( 'machineInfo is undefined' )
                res.send({
                    type:true,
                    data: utilizationReport
                })
                client.close()
            } else {
                        //// console.log( 'In  machineRecords.length : ' + machineRecords.length )
                        //// console.log( 'In  machineRecords[0] : ' + JSON.stringify(machineRecords[0]) )
                        //// console.log( 'In  utilizationReport : ' + JSON.stringify(utilizationReport) )
                        //// console.log( 'In  machineRecords : ' + JSON.stringify(machineRecords) )
            var i
            for ( i = 0 ; i < utilizationReport.length ; i++ ) {
          var machineID = utilizationReport[i].machineID
          var j
          //// console.log('machineID : ' + machineID)
          for ( j = 0 ; j < machineRecords.length ; j++ ) {
              if ( machineID == machineRecords[j].machineID ) {
                utilizationReport[i].propertyNum = machineRecords[j].propertyNum
                utilizationReport[i].brand = machineRecords[j].brand
            break;
              }
          }
            }
  
                res.send({
                    type:true,
                    data: utilizationReport
                })
                client.close()
        }
          })
      }	    
        })
    }) // while	
        })
      }
    })      
  })
  app.get('/api/getAbnormalListData/:machineIDs/:from/:to', function (req, res) {
    var machineIDs = req.params.machineIDs.split(",")
    // console.log('getAbnormalListData');
  //// console.log('machineIDs : ' + machineIDs)
  
    var subStr = firstDailyPoint.split(':')
    var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
  //// console.log([from.toString(), to.toString()])
  // console.log(from)
  // console.log(to)
    
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
  // console.log('failed to connect')
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
        client.close()
      } else {
        var db = client.db(config.dbName);
  
        getAbnormalMachineRecords (db, machineIDs, from, to, function(abnormalListReport) {
      // console.log('abnormalListReport : ' +  JSON.stringify(abnormalListReport))
      // var resArr = []
      var resObj = {}
      // var obj = {}
      Object.keys(abnormalListReport).forEach(machineID => {
        var resArr = []
        var obj = {}
        resArr.splice(0, resArr.length)
        abnormalListReport[machineID].sort((a, b) => {
          return moment(a.trigTime).isBefore(moment(b.trigTime)) ? -1 : 1
        })
        abnormalListReport[machineID].forEach((elm, idx, orgArr) => {
          // console.log('elm0000000000')
          // console.log(elm)
          if (idx < orgArr.length) {
            if (idx === 0) {
              obj = Object.assign({}, elm)
            /* } else if (elm.machineStatusType !== obj.machineStatusType) {
              obj.duration = moment(obj.lastTrigTime).diff(moment(obj.trigTime))
              resArr.push(obj)
              obj = elm */
            } else if (elm.note !== obj.note) {
              obj.duration = moment(obj.lastTrigTime).diff(moment(obj.trigTime))
              resArr.push(obj)
              obj = elm
            } else if (moment(obj.lastTrigTime).isSame(moment(elm.trigTime))) {
              obj.lastTrigTime = elm.lastTrigTime
            } else if (!moment(obj.lastTrigTime).isSame(moment(elm.trigTime))) {
              obj.duration = moment(obj.lastTrigTime).diff(moment(obj.trigTime))
              resArr.push(obj)
              obj = Object.assign({}, elm)
            }
            if (idx === (orgArr.length - 1)) {
              obj.duration = moment(obj.lastTrigTime).diff(moment(obj.trigTime))
              resArr.push(obj)
            }
          }
        })
        resObj[machineID] = resArr
      })
      // console.log(abnormalListReport)
      // console.log('PPPPPPPPPPPPP')
      // console.log(resObj)
      res.send({
          type:true,
          data: resObj
      })
      client.close()
        })
      }
    })      
  })
  var curveProps = require('./CurveProps.js')
app.get('/api/getDefectiveTable/:machineIDArr/:from/:to/:ind/:index', function (req, res) {
  var machineIDs = req.params.machineIDArr.split(",")
  var ind = req.params.ind
  var index = req.params.index
  //// console.log('getdefectiveTable');
//// console.log('machineIDs : ' + machineIDs)
  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
//// console.log([from.toString(), to.toString()])	
	//machineIDs = ["1A01", "1A02"]	
  curveProps.getDefectiveTable(machineIDs, from, to, ind, index, res)      
})
app.get('/api/getDefectiveTable_BK/:range/:dt/:months/:keyTxt', function (req, res) {
  var range = (req.params.range).split(',')
  var keyTxt = (req.params.keyTxt).split(',')
  var dataRet1 = {}
  var dataRetT = {}
  MongoClient.connect(config.dbUrl, function (err, client) {
    if (err) {
    } else {
      client.db(config.dbName).collection('organization').find({}).toArray(function (err1, docs) {
        if(err1) {

        } else {
          // console.log(docs)
          // console.log(range)
          range.forEach(subRange => {
            var root = docs.find(function(elm) {
              return elm._id === subRange
            })
            // console.log(root)
            if (root.son === '') {
            } else {
              // console.log(root.son)
              root.son.forEach(sn => { // 開始執行1A01, 1A02, 1A03...等資料計算並填入結構
                dataRet1[sn] = []
                var obj1 = {}
                var obj2 = {}
                var objVal1 = [1004.6, 5.0, 3.8, 2.0, 1001.8, 2.0, 6.2, 4.0, 1003.0, 4.5, 3.1, 1004.5]
                var objVal2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                for (var i = 0; i < keyTxt.length; i++) {
                  obj1[keyTxt[i]] = objVal1[i]
                  obj2[keyTxt[i]] = objVal2[i]
                }
                dataRet1[sn].splice(dataRet1[sn].length, 0, obj1)
                dataRet1[sn].splice(dataRet1[sn].length, 0, obj2)
              })
            }
            dataRetT[root._id] = dataRet1 // 相同區馭完成標記對應區域
          })
          res.send({
            type: true,
            data: dataRetT
          })
          client.close()
        }
      })
    }
  })
})
var sysCommonSetting = require('./sysCommonSetting.js')
app.get('/api/getSysCommonSettingList', function (req, res) {
  sysCommonSetting.getSysCommonSettingList(res)
})
app.get('/api/getPageSetting', function (req, res) {
  sysCommonSetting.getPageSetting(res)
})
app.get('/api/getPageSettingRegister', function (req, res) {
  sysCommonSetting.getPageSettingRegister(res)
})
var permissionSetting = require('./permissionSetting.js')
app.get('/api/getPermissionList', function (req, res) {
  permissionSetting.getPermissionList(res)
})
app.get('/api/checkUser/:userName/:userPassword', function (req, res) {
  permissionSetting.checkUser(req, res)
})
app.get('/api/getPermissionDetail/:user', function (req, res) {
  permissionSetting.getPermissionDetail(req, res)
})
var prodDepartSetting = require('./prodDepartSetting.js')
app.get('/api/getPropertyNumber', function (req, res) {
  prodDepartSetting.getPropertyNumber(res)
})
app.get('/api/getOrganizationStructure', function (req, res) {
  prodDepartSetting.getOrganizationStructure(res)
})
app.get('/api/getDepartObj', function (req, res) {
  prodDepartSetting.getDepartObj(res)
})
app.get('/api/getDepartObjAll', function (req, res) {
  prodDepartSetting.getDepartObjAll(res)
})
app.get('/api/firstDailyPoint', function (req, res) {
  // console.log(firstDailyPoint)
  res.send({
    type: true,
    data: firstDailyPoint
  })
})
var shiftTimeConfig = require('./shiftTimeConfig.js')
app.get('/api/shiftTimeConfig', function (req, res) {
  shiftTimeConfig.getShiftNameArr(res)
})
app.get('/api/getShiftClock', function (req, res) {
  shiftTimeConfig.getShiftClock(res)
})
var firstDailyPoint = ''
var hwCfgList = []
function getFirstDailyPoint () {
  // console.log(config.dbUrl)
  MongoClient.connect(config.dbUrl, function (err, client) {
    if (err) {
      // console.log('Data is gone')
      var initDoc = {
        '_id': 'timeSlicePoint',
        '日切換點': '08:00',
        '時段點1': '12:00',
        '時段點2': '16:30',
        '時段點3': '20:00',
        '時段點4': '23:00'
      }
      // client.db(config.dbName).collection(config.sysConfig).insertOne(initDoc)
      firstDailyPoint = '08:00'
      // console.log('new')
      // console.log(firstDailyPoint)
    } else {
      var doc = client.db(config.dbName).collection(config.sysConfig).findOne({'_id': config.timeSlicePoint})
      Promise.all([doc]).then((val) => {
        firstDailyPoint = (val[0])['日切換點']
        // console.log(val)
        // console.log(firstDailyPoint)
      }).catch(err => {
        // console.log('Data is gone')
        var initDoc = {
          '_id': 'timeSlicePoint',
          '日切換點': '08:00',
          '時段點1': '12:00',
          '時段點2': '16:30',
          '時段點3': '20:00',
          '時段點4': '23:00'
        }
        client.db(config.dbName).collection(config.sysConfig).insertOne(initDoc)
        firstDailyPoint = '08:00'
        // console.log('new')
        // console.log(firstDailyPoint)
      })
    }
  })
}
function getHwCfg () {
  MongoClient.connect(config.dbUrl, function (err, client) {
    if (err) {
    } else {
      client.db(config.dbName).collection(config.machineListColName).find({}).toArray(function (err1, docs) {
        if(err1) {

        } else {
          hwCfgList = docs
        }
      })
    }
  })
}
function test () {
  MongoClient.connect(config.dbUrl, function (err, client) {
    if (err) {
    } else {
      var Level1 = [{
        _id: '1A01', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI14', abridge: '機台'
      }, {
        _id: '1A02', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI52', abridge: '機台'
      }, {
        _id: '1A03', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI34', abridge: '機台'
      }, {
        _id: '1A04', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI20', abridge: '機台'
      }, {
        _id: '1A05', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI18', abridge: '機台'
      }, {
        _id: '1A06', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI17', abridge: '機台'
      }, {
        _id: '1A07', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI16', abridge: '機台'
      }, {
        _id: '1A08', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI15', abridge: '機台'
      }, {
        _id: '1A09', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台'
      }]
      var Level2 = [{
        _id: '1A', father: '成型一課', son: ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], level: 2, levelName: '區',  data: ''
      }, {
        _id: '1B', father: '成型一課', son: [], level: 2, levelName: '區',  data: ''
      }, {
        _id: '1C', father: '成型一課', son: [], level: 2, levelName: '區', data: ''
      }]
      var Level3 = [{
        _id: '成型一課', father: '全廠', son: ['1A', '1B', '1C'], level: 3, levelName: '課',  data: ''
      }, {
        _id: '成型二課', father: '全廠', son: ['2A', '2B', '2C'], level: 3, levelName: '課', data: ''
      }]
      var Level4 = [{
        _id: '全廠', father: 'organization', son: ['成型一課', '成型二課'], level: 4, levelName: '廠',  data: ''
      }]
      client.db(config.dbName).collection('organization').drop()
      client.db(config.dbName).collection('organization').insertMany(Level1)
      client.db(config.dbName).collection('organization').insertMany(Level3)
      client.db(config.dbName).collection('organization').insertMany(Level4)
      client.db(config.dbName).collection('organization').insertMany(Level2).then(doc => {
        // console.log('1111111')
        // console.log(doc.ops)
        var tmp = (doc.ops).filter(function(Item, Index, Arr) {
          return Item._id === '1A'
        })
        // console.log(tmp)
      })
    }
  })
}
function getEachMachineRecordsForOrder (client, machineID) {
  // console.log('getEachMachineRecordsForOrder')
  return new Promise((resolve, reject) => {
    var records = []

    client.db('ldm').collection(machineID).find({$or: [{machineStatusType: '半自動'}, {machineStatusType: '全自動'}]}).toArray(function (err, docs) {
      if (err) {
// console.log('failed to find')
        reject(err)
      } else {
//// console.log( docs )
        docs.forEach(doc => {
          if (doc['orderNumber'] !== undefined) {
            records.push(doc)
          }
	  else {
	    // console.log('ordernumber undefined')
	  }
        })
//// console.log(records)
        resolve(records)
      }
    })
  })
}
function setOrderNumberDB () {
  // console.log(config.dbUrl)
  MongoClient.connect(config.dbUrl, function (err, client) {
    if (err) {
      
    } else {
      var machineIDarr = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
      var promises = []
      var machines = {}
      machineIDarr.forEach(machineID => {
        promises.push(getEachMachineRecordsForOrder(client, machineID).then(results => {
          machines[machineID] = results
        }))
      })
      var propObj = {}
      var propIdx = 0 
      Promise.all(promises).then(() => {
        var objKeys = Object.keys(machines)
        objKeys.forEach(key => {
          (machines[key]).forEach(doc => {
            var orderNumber = doc.orderNumber || ''
            if (orderNumber.length > 3) {
              if(!propObj.hasOwnProperty(doc.orderNumber)) {
                propObj[doc.orderNumber] = propIdx++
              }
            }
          })
        })
        // console.log(Object.keys(propObj))
        var orderNumberList = Object.keys(propObj)
        var arr = []
        orderNumberList.forEach(orderN => {
          var obj = {}
          var product = ''
          objKeys.forEach(key => {
            var f = (machines[key]).filter(doc => {
              return doc.orderNumber === orderN
            })
            if (f.length > 0) {
              product = f[0].product
              var total = f.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + currentValue.moldCount  
              }, 0)
              obj[key] = total
            } else {
              obj[key] = 0
            }
          })
          arr.splice(arr.length, 0, {
            '_id': orderN,
            'product': product,
            'moldCount': obj,
            'warehousing': 0
          })
        })
        // console.log(arr)
        try {
          var db = client.db('ldm')
          db.collections(function(err, cols){
            var exit = cols.some(col => {
              // console.log(col.s.name)
              return col.s.name === 'settedOrderNumberList' ? true : false
            })
            // console.log(exit)
            if (!exit) {
              client.db('ldm').collection('settedOrderNumberList').insertMany(arr)
            }
          })   
        } catch (e) {
          // console.log(e)
        }
      })
    }
  })
}
function updateOrderNumberDB () {
  // console.log(config.dbUrl)
  MongoClient.connect(config.dbUrl, function (err, client) {
    if (err) {
      
    } else {
      var machineIDarr = ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09']
      var promises = []
      var machines = {}
      machineIDarr.forEach(machineID => {
        promises.push(getEachMachineRecordsForOrder(client, machineID).then(results => {
          machines[machineID] = results
        }))
      })
      var propObj = {}
      var propIdx = 0 
      Promise.all(promises).then(() => {
        var objKeys = Object.keys(machines)
        objKeys.forEach(key => {
          (machines[key]).forEach(doc => {
            var orderNumber = doc.orderNumber || ''
            if (orderNumber.length > 3) {
              if(!propObj.hasOwnProperty(doc.orderNumber)) {
                propObj[doc.orderNumber] = propIdx++
              }
            }
          })
        })
        // console.log(Object.keys(propObj))
        var orderNumberList = Object.keys(propObj)
        var arr = []
        MongoClient.connect(config.dbUrl, function(err, client) {
          if (err) {
            socket.emit('setOrderNumberFail', data)
          } else {
            var arr = []
            orderNumberList.forEach(orderN => {
              // M#O#Q
              arr.splice(arr.length, 0, {
                '派單號碼': {$eq: orderN}
              })
            })
            //client.db('pmDB').collection('成型派單明細').find({$or: arr}, function(err1, orderDetail) {
            client.db('pmDB').collection('製令單明細').find({$or: arr}, function(err1, orderDetail) {
              if (err1) {
                // console.log('Server not found')
              } else if (orderDetail.length === 0) {
                // console.log('data not found')
              } else {
                orderDetail.forEach(order => {
                  objKeys.forEach(key => {
                    client.db(config.dbName).collection(key).updateMany({
                      'orderNumber': {$eq: order['派單號碼']}
                    }, {
                      $set: {
                        'MOQ': order['M#O#Q#'],
                        'createDate': order['開單_日期'],
                        'deadlineWarehousing': order['最終入庫日期']
                      }
                    })
                  })
                })
              }
            })
          }
        })
        // console.log(arr)
      })
    }
  })
}

var clientList = {}
var clientListIndex = 0
var monitorModalClientList = {}
var monitorModalClientIndex = 0
var dailyReportIntegratedClientList = {}
var dailyReportIntegratedClientIndex = 0
server.listen(app.get('port'), function () {
  // console.log('Express server listening on port ' + app.get('port'))
  getFirstDailyPoint()
  getHwCfg()
  //test()
  // setOrderNumberDB()
  // updateOrderNumberDB()
})

var socket = io.listen(server)
socket.on('connection', function (client) {
  // console.log('A connection was established')
  client.on('disconnect', function () {
    // console.log('Server has disconnected')
  })
  //----------------------------------
  client.on('setNewUser', function (data) {
    permissionSetting.setNewUser(data, socket)
  })
  client.on('deleteUser', function (data) {
    permissionSetting.deleteUser(data, socket)
  })
  //----------------------------------
  client.on('setNewOrganization', function (data) {
    prodDepartSetting.setNewOrganization(data, socket)
  })
  client.on('updateOrganization', function (data) {
    prodDepartSetting.updateOrganization(data, socket)
  })
  client.on('deleteOrganization', function (data) {
    prodDepartSetting.deleteOrganization(data, socket)
  })
  //----------------------------------
  client.on('saveUserSettingDetail', function (data) {
    permissionSetting.saveUserSettingDetail(data, socket)
  })
  //----------------------------------
  client.on('setNoteInfo', function (data) {
    console.log(data)
    var id = data._id
    var machineID = data.machineID
    var note = data.note
    MongoClient.connect(config.dbUrl, function (err, client) {
      if (err) {
        socket.emit('setNoteInfoRes', '')
      } else {
        client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
          elms.forEach(elm => {
            var str3 = elm.data
        client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).find({$and: [{trigTime: {$gte: moment(data.trigTimeFullType, 'YYYY-MM-DD HH:mm:ss.SSS').toDate()}}, {$or: [{machineStatusType: '全自動'}, {machineStatusType: '半自動'}]}, {moldCount: {$gt: 0}}]}).sort({trigTime: 1}).limit(1).toArray(function(err1, docs1) {
          docs1.forEach(doc => {
            // console.log(doc)
            // client.db(config.dbName).collection(machineID).updateMany({$and: [{trigTime: {$gte: moment(data.trigTimeFullType, 'YYYY-MM-DD HH:mm:ss.SSS').toDate(), $lt: moment(doc.trigTime).toDate()}}, {$or: [{machineStatusType: '關機'}, {machineStatusType: '手動'}]}]}, {$set: {'note': note}})
            client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).updateMany({$and: [{trigTime: {$gte: moment(data.trigTimeFullType, 'YYYY-MM-DD HH:mm:ss.SSS').toDate(), $lt: moment(doc.trigTime).toDate()}}]}, {$set: {'note': note}}, function(err2, res) {
              console.log(res)
              client.close()
            })
          })
          socket.emit('setNoteInfoRes', 'success')
        })
      })
    })
        // client.db(config.dbName).collection(machineID).updateMany({trigTime: {$gte: moment(data.trigTimeFullType)}, trigTime: {$lt: moment(doc.trigTime)}, machineStatusType: {$or: [{$eq: '關機'}, {$eq: '手動'}]}})
        
        /* var doc = client.db(config.dbName).collection(machineID).findOneAndUpdate({_id: ObjectID(id)}, {$set: {'note': note}}, {returnOriginal : false})
        Promise.all([doc]).then((val) => {
          // all loaded
          // console.log(val)
          // console.log('doc')
          socket.emit('setNoteInfoRes', val[0].value)
          // console.log(val[0].value)
          client.close()
        }).catch(err => {
          socket.emit('setNoteInfoRes', '')
          client.close()
        }) */
      }
    })
  })
  client.on('commCommand', function (data) {
    var objectId = new ObjectID();
    socket.emit(data, objectId)
    // console.log(objectId)
  })
  client.on('addClientMonitor', function (data) {
    if(!monitorModalClientList.hasOwnProperty(data))
    {
      monitorModalClientList[data] = socket
      monitorModalClientIndex++
      // console.log(monitorModalClientList)
    }
  })
  client.on('deleteClientMonitor', function (data) {
    if(monitorModalClientList.hasOwnProperty(data))
    {
      delete monitorModalClientList[data]
      monitorModalClientIndex--
      // console.log(monitorModalClientList)
    }
  })
  //---------------------------------------
  client.on('addClientDailyReportIntegrated', function (data) {
    if(!dailyReportIntegratedClientList.hasOwnProperty(data))
    {
      dailyReportIntegratedClientList[data] = socket
      dailyReportIntegratedClientIndex++
      // console.log(dailyReportIntegratedClientList)
    }
  })
  client.on('deleteClientDailyReportIntegrated', function (data) {
    if(dailyReportIntegratedClientList.hasOwnProperty(data))
    {
      delete dailyReportIntegratedClientList[data]
      dailyReportIntegratedClientIndex--
      // console.log(dailyReportIntegratedClientList)
    }
  })
  client.on('reqUpdateShiftDailyReportIntegrated', function (data) {
    var machineID = data.machineID
    var orderNumber = data.orderNumber
    var reportDate = moment(data.reportDate).format('YYYY-MM-DD')
    var trigTime = moment(data.trigTime).format('HH:mm:ss').toString()
    var lastTrigDate = moment(data.lastTrigTime).format('YYYY-MM-DD')
    IntegratedDailyReport.reqUpdateShiftDailyReportIntegrated(machineID, orderNumber, reportDate, trigTime ,lastTrigDate, socket)
  })
  client.on('reqUpdateAccDailyReportIntegrated', function (data) {
    var machineID = data.machineID
    var orderNumber = data.orderNumber
    var tgtfinishTime = ''
    MongoClient.connect(config.dbUrl, function(err, client){
      if (err) {
      } else {
        var predMoldCnt = 0
        var acc = 0
        client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
          elms.forEach(elm => {
            var str3 = elm.data
            client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report')).find({$and: [{'orderNumber': orderNumber}, {$or: [{'machineStatusType': '半自動'}, {'machineStatusType': '全自動'}]}]}).sort({trigTime: 1}).toArray(function(err3, docs3) {
              if (err3) {
                acc = 0
              } else {
                predMoldCnt = docs3[0].predMoldCnt
                acc = docs3.reduce(function (previousValue, currentValue, index, array) {
                  return previousValue + currentValue.moldCount  
                }, 0)
                tgtfinishTime = moment(docs3[docs3.length - 1].lastTrigTime).format('YYYY-MM-DD HH:mm:ss.SSS')
              }
              // console.log(predMoldCnt)
            var retObj = {
              machineID: machineID,
              orderNumber: orderNumber,
              accMoldCnt: acc,
              percentage: predMoldCnt === 0 ? 0 : acc / predMoldCnt,
              tgtfinishTime: tgtfinishTime
            }
            socket.emit('updateAccDailyReportInteg', retObj)
            client.close()
          })
        })
      })
      }
    })
  })
  //---------------------------------------
  client.on('clrMulOrderNumber', function (data) {
    var machineID = data.machineID
    RegisterProps.clrMulOrderNumber(data, machineID, socket)
  })
  client.on('coptToMachineDB', function (data) {
    RegisterProps.coptToMachineDB(data, socket)
  })
  client.on('deleteToMachineDB', function (data) {
    RegisterProps.deleteToMachineDB(data, socket)
  })
  client.on('copyAllToMachineDB', function (data) {
    var subStr = firstDailyPoint.split(':')
    var from = moment(moment(data.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var to = moment(moment(data.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
    RegisterProps.copyAllToMachineDB(data, socket, from, to)
  })
  client.on('deleteAllToMachineDB', function (data) {
    var subStr = firstDailyPoint.split(':')
    var from = moment(moment(data.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var to = moment(moment(data.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
    RegisterProps.deleteAllToMachineDB(data, socket, from, to)
  })
  client.on('failToClrOrderNumber', function (data) {
    var id = data._id
    var machineID = data.machineID
    var orderNumber = data.orderNumber
    RegisterProps.failToClrOrderNumber(id, machineID, orderNumber, socket)
  })
  client.on('clrOrderNumber', function (data) {
    var id = data._id
    var machineID = data.machineID
    var orderNumber = data.orderNumber
    RegisterProps.clrOrderNumber(data, machineID, orderNumber, socket)
  })
  client.on('setOrderNumber', function (data) {
    // console.log(data)

    var id = data._id
    var machineID = data.machineID
    var orderNumber = data.orderNumber
    var trigTime = data.trigTime

    RegisterProps.setOrderNumber(id, machineID, orderNumber, trigTime, socket, data)
      // find the original record, because we need to get complete information for response
  })

  client.on('setMoldNumber', function (data) {
    RegisterProps.setMoldNumber(data, socket)
  })

  client.on('setWarehousingPeriodlyReport', function (data) {
    // var endTime = data.lastTrigTime // moment(moment(data.endTime).format('M/DD HH:mm:ss')).toDate()
    var subStr = firstDailyPoint.split(':')
    var endTime = moment(moment(data.lastTrigTime).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
    var machineID = data.machineID
    var warehousing = data.warehousing
    var product = data.product
    var orderNumber = data.orderNumber
    var lastID = data.lastID
    // console.log(data)
    // console.log(data.warehousing)
    // console.log(endTime)
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
        socket.emit('setWarehousingFail', data)
      } else {
        // client.db(config.dbName).collection(machineID).updateMany({'product': product}, {$set:{'warehousing': 0}}, function(err2){
        client.db(config.dbName).collection(machineID).updateMany({'orderNumber': orderNumber}, {$set:{'warehousing': 0}}, function(err2) {
          if (err2) {
            socket.emit('setWarehousingFail', data)
            client.close()
          } else {
            client.db(config.dbName).collection('settedOrderNumberList').updateOne({'_id': orderNumber}, {$set: {'warehousing': parseInt(warehousing)}}, { upsert: true })
            client.db(config.dbName).collection(machineID).findOneAndUpdate( {'_id': ObjectID(lastID)}, {$set: {'warehousing': parseInt(warehousing)}}, {returnOriginal: false}, function (err1, doc) {
              if (err1) {
                socket.emit('setWarehousingFail', data)
                client.close()
              } else {
                // console.log(doc)
                if (doc.value !== null) {
                  if (doc.value['warehousing'] === parseInt(warehousing)) {
                    socket.emit('setWarehousingSuccess', doc)
                    client.close()
                  } else {
                    socket.emit('setWarehousingFail', data)
                    client.close()
                  }
                } else {
                  socket.emit('setWarehousingFail', data)
                  client.close()
                }
              }
            })
          }
        })
      }
    })
  })
  client.on('setBadNumPeriodlyReport', function (data) {
    var lastID = data.lastID
    var machineID = data.machineID
    var badNum = data.badNum
    var product = data.product
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
        socket.emit('setBadNumFail', data)
        client.close()
        // console.log('1')
      } else {
          client.db(config.dbName).collection(machineID).findOneAndUpdate({'_id': ObjectID(lastID)}, {$set: {'badNum': parseInt(badNum)}}, {returnOriginal: false}, function (err1, doc) {
          if (err1) {
            // console.log('2')
            socket.emit('setBadNumFail', data)
            client.close()
          } else {
            // console.log('3')
            // console.log(doc.value)
            // console.log(data)
            if (doc.value['badNum'] === parseInt(badNum)) {
              socket.emit('setBadNumSuccess', doc)
              client.close()
            } else {
              socket.emit('setBadNumFail', data)
              client.close()
            }
          }
        })
      }
    })
  })
  client.on('setWarehousing', function (data) {
    // // console.log(data)
    var id = data._id
    var machineID = data.machineID
    var warehousing = data.warehousing
    var product = data.product

    MongoClient.connect(config.dbUrl + config.dbName).then(db => {
      var col = db.collection(machineID)

      // find the original record, because we need to get complete information for response
      col.find({'_id': ObjectID(id)}).toArray(function (err, docs) {
        if (err) {
          socket.emit('setWarehousingFail', data)
        } else {
          if (docs.length === 0) {
            // console.log('no data')
            data.warehousing = ''
            socket.emit('setWarehousingFail', data)
          } else {
            var doc = docs[0]
            var newWarehousing

            // notify the server that the order number is changed, and wait for product update
            col = db.collection(config.calHandleCommandColName)
            col.insertOne({
              id: id,
              machineID: machineID,
              warehousing: warehousing,
              product: product,
              opcode: opcodes.set_warehousing_opcode
            }).then(result => {
              // // console.log(result)
              col = db.collection(machineID)
              var timeout = 0

              // query the change per second
              var waitFunc = setInterval(function () {
                timeout++
                // doc['moldNum'] = moldNum

                // maximum wait 30 secs, if timeout, just reply the origin record
                if (timeout >= 5) {
                  clearInterval(waitFunc)
                  data.warehousing = doc.warehousing
                  socket.emit('setWarehousingFail', data)
                  db.close()
                } else {
                  // query the record and judge the product has changed or not yet
                  col.find({'product': product}).limit(1).toArray(function (err, docs) {
                    if (err) {
                      data.warehousing = ''
                      socket.emit('setWarehousingFail', data)
                    } else {
                      if (docs.length === 0) {
                        // console.log('no data')
                        data.warehousing = ''
                        socket.emit('setWarehousingFail', data)
                      } else {
                        doc = docs[0]
                        newWarehousing = doc['warehousing']
                        if (newWarehousing !== undefined && newWarehousing === Number(warehousing)) {
                          clearInterval(waitFunc)
                          socket.emit('setWarehousingSuccess', doc)
                          db.close()
                        }
                      }
                    }
                  })
                }
              }, 1000)
            })
          }
        }
      })
    }).catch(err => {
      if (err) {
        data.moldNum = ''
        socket.emit('setWarehousingFail', data)
      }
    })
  })

  client.on('getTotalTargetCount', function (data) {
    // console.log(data)
    var machineID = data.machineID // Object.keys(data)
    var arr = data.orderArr
    //var machines = {}
    MongoClient.connect(config.dbUrl, function(err, clientData) {
      if (err) {
        socket.emit('getTotalTargetCountFail', data)
        // console.log('1')
      } else {
        var orderArr = []
        if (arr.length > 0) {
          arr.forEach(elm => {
            orderArr.splice(orderArr.length, 0, {
              'orderNumber': elm
            })
          })
        }
// console.log(machines)
        var resData = []
        var ackData = {}

        // console.log(orderArr)
        clientData.db(config.dbName).collection(machineID).find({$or: orderArr}).toArray(function (err1, docs) {
          if (err1) {
            clientData.close()
            // reject(err)
            // console.log('2')
            // socket.emit('getTotalTargetCountFail', data)
          } else {
            orderArr.forEach(elm => {
              var subDocs = docs.filter(doc => {
                if (((doc['machineStatusType'] === '半自動') || (doc['machineStatusType']  === '全自動')) && (elm.orderNumber === doc.orderNumber)) {
                  return doc
                }
              })
              // console.log('subDocs')
              var total = subDocs.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + currentValue.moldCount  
              }, 0)
              var obj = {
                totalTargetCount: total * subDocs[0].cavities
              }
              var warehousing = subDocs.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + currentValue.warehousing  
              }, 0)
              // records.push(obj)
              resData.splice(
                resData.length, 0, {
                  machineID: machineID, 
                  orderNumber: subDocs[0].orderNumber,
                  total: total,
                  totalTargetCount: total * subDocs[0].cavities,
                  warehousing: warehousing
                }
              )
            })
            //// console.log(resData)
            socket.emit('getTotalTargetCountSuccess', resData)
            clientData.close()
          }
        })
      }
    })
  })
  client.on('sysCommonSettingUpdateRule', function (data) {
    sysCommonSetting.sysCommonSettingUpdateRule(data, socket)
  })
  client.on('sysCommonSettingUpdateColor', function (data) {
    sysCommonSetting.sysCommonSettingUpdateColor(data, socket)
  })
  client.on('sysCommonSettingUpdateFont', function (data) {
    sysCommonSetting.sysCommonSettingUpdateFont(data, socket)
  })
  client.on('sysCommonSettingUpdateSize', function (data) {
    sysCommonSetting.sysCommonSettingUpdateSize(data, socket)
  })
  client.on('writeClockSetting', function (data) {
    shiftTimeConfig.writeClockSetting(data, socket)
  })
  client.on('writeShiftSetting', function (data) {
    shiftTimeConfig.writeShiftSetting(data, socket)
  })
  client.on('writeNewNote', function (data) {
    noteConfigSetting.writeNewNote(data, socket)
  })
  client.on('deleteNote', function (data) {
    noteConfigSetting.deleteNote(data, socket)
  })
  client.on('setMoldCount', function (data) {
    // console.log(data)
    var id = data._id
    var machineID = data.machineID
    var moldCount = data.moldCount
    MongoClient.connect(config.dbUrl, function (err, client) {
      if (err) {
        socket.emit('setMoldcountErr', '')
      } else {
        client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
          elms.forEach(elm => {
            var str3 = elm.data
        client.db(config.dbName).collection(machineID.indexOf('1A') > -1 ? machineID : (str3 + 'Report')).findOneAndUpdate({_id: ObjectID(id)}, {$set: {'moldCount': moldCount}}, {returnOriginal : false})
          })
        client.close()
        })
      }
    })
  })
  client.on('clrAlmRecordAll', function (data) {
    var machineID = data.machineID
    var from = moment(data.from).toDate()
    var to = moment(data.to).add(1, 'd').toDate()
    RegisterProps.clrRegisterAlmRecordAll(machineID, from, to, socket)
  })
})


