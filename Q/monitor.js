var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var moment = require('moment')
exports.updateMonitorHWCfgV3 = updateMonitorHWCfgV3
exports.getMachineStsV2 = getMachineStsV3
exports.getMachineStsSMBV2 = getMachineStsSMBV3
exports.updateModalHWCfg = updateModalHWCfg
exports.updateModalAlmHWCfg = updateModalAlmHWCfg
exports.updateModalUtilizationHWCfg = updateModalUtilizationHWCfg
exports.getMachineCurrInfo = getMachineCurrInfo1
exports.getHomotypeID = getHomotypeID
exports.getAvailableMachineID = getAvailableMachineID

function updateMonitorHWCfgV2 (machineIDs, selectedDate, res) {
  var department = req.params.department
  var arrayRes = Array(6)
  var replacerArray = []
  // console.log('1')
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      // console.log('2')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      // console.log('3')
      var db = client.db(config.dbName)
      var  i = 0
      db.collection(config.machineListColName).find({'department': department}, {}, function (err0, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else {         
          var idx= 0
          docs.forEach(doc0 => {
            replacerArray.splice(replacerArray.length, 0, {
              $eq: ['machineID', doc0.machineID]
            })
            idx++
            if (arrayRes[0] === idx) {
              var jsonText = JSON.stringify(replacerArray)
              db.collection('lastDeviceID').find({$or: replacerArray}).toArray( function (err1, docs1) {
                if (err1) {
                  res.send({
                    type: false,
                    data: 'Error occured: ' + err1
                  })
                } else {
                  res.send({
                    type: true,
                    data: docs1
                  })
                  client.close()
                  // console.log('client.close')
                }
              })
            }
          }) 
        }
      })
    }
  })
}

function updateMonitorHWCfgV3 (machineIDs, res) {
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
          var idx= 0
          // arrayRes[0] = docs.length
          machineIDs.forEach(machineID => {
            replacerArray.splice(replacerArray.length, 0, {
              'machineID': {$eq: machineID}
            })
          })
            idx++
            // if (arrayRes[0] === idx) {
              db.collection('lastDeviceID').find({$or: replacerArray}).toArray( function (err1, docs1) {
                client.close()
                  // console.log('client.close')
                if (err1) {
                  res.send({
                    type: false,
                    data: 'Error occured: ' + err1
                  })
                } else {
                  // console.log(55555)
                  // console.log(docs1)
                  res.send({
                    type: true,
                    data: docs1
                  })
                }
              })
            // }
          // }) 
    }
  })
}

function getMachineStsV2 (machineIDs, from, to, res, monitorModalClientList) {
  var replacerArray = []
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      machineIDs.forEach(machineID => {
        replacerArray.splice(replacerArray.length, 0, {
          'machineID': {$eq: machineID}
        })
      })
      var db = client.db(config.dbName)
      var col = db.collection(config.machineListColName)
      client.db(config.dbName).collection('lastDeviceID').find({$or: replacerArray}).toArray( function (err0, docs0){
        if (err0) {
          res.send({
            type: false,
            data: 'Error occured: ' + err0
          })
          client.close()
        } else {
          res.send({
            type: true,
            data: docs0
          })
          var idx = 0
          machineIDs.forEach(machineID => {
            db.collection(machineID).find({trigTime: {$gte: from, $lt: to}}).toArray(function (err2, docs2) {
              if (err2) {
                idx++
              } else {
                idx++
                var almCount = docs2.filter(elm => {
                  return (elm.machineStatus || '警報') === '警報'
                })
                var socketSendBack = {}
                socketSendBack['machineID'] = machineID
                socketSendBack['totalAlm'] = almCount.length
                docs2.sort(function (a, b) {
                  return a.trigTime > b.trigTime ? 1 : -1
                })
                socketSendBack['product'] = ''
                // console.log('socketSendBack')
                // console.log(socketSendBack)
                if (docs2 .length > 0) {
                  if (docs2[docs2.length - 1].hasOwnProperty('product')) {
                    socketSendBack['product'] = docs2[docs2.length - 1].product
                  }
                }
                for(recv in monitorModalClientList) {
                  // monitorModalClientList[recv].emit('updateAlarmCount', socketSendBack)
                }
              }
              if (idx === machineIDs.length) {
                client.close()
              }
            })
          })
          /* if (idx === machineIDs.length) {
            client.close()
          } */
        }
      })
    }
  })
}

function getMachineStsV3 (machineIDs, from, to, res, monitorModalClientList) {
  var replacerArray = []
  var retObj = {}
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      machineIDs.forEach(machineID => {
        replacerArray.splice(replacerArray.length, 0, {
          'machineID': {$eq: machineID}
        })
      })
      // console.log(moment(from).toDate())
      // console.log(moment(to).toDate())
      var db = client.db(config.dbName)
      var col = db.collection(config.machineListColName)
          var idx = 0
          machineIDs.forEach(machineID => {
            db.collection(machineID).find({$and: [{product: {$ne: ''}}, {product: {$exists: true}}]}).sort({trigTime: -1}).limit(1).toArray(function(e, d) {
            db.collection(machineID).find({trigTime: {$gte: from, $lt: to}, machineStatusType: {$ne: '警報-通信'}}).sort({ _id: -1 }).toArray(function (err2, docs2) {
              var socketSendBack = {}
              idx++
              if (err2) {
              } else if (docs2.length === 0) {
                socketSendBack['machineID'] = machineID
                socketSendBack['totalAlm'] = 0
                socketSendBack['product'] = d[0].product || ''
                socketSendBack['last'] = ''
                socketSendBack['STS'] = '關機'
              } else {
                var almCount = docs2.filter(elm => {
                  // return (elm.machineStatus || '警報') === '警報'
                  return elm.machineStatusType.indexOf('警報') > -1
                })
                // console.log('警報')
                // console.log(almCount)
                socketSendBack['machineID'] = machineID
                socketSendBack['totalAlm'] = almCount.length
                /* docs2.sort(function (a, b) {
                  return a.trigTime > b.trigTime ? 1 : -1
                }) */
                socketSendBack['product'] = ''
                // console.log('socketSendBack')
                //// console.log(socketSendBack)
                if (docs2 .length > 0) {
                  // if (docs2[docs2.length - 1].hasOwnProperty('product')) {
                    socketSendBack['product'] = d.length > 0 ? d[0].product || '': '' // docs2[docs2.length - 1].product
                  // }
                }
                /* for(recv in monitorModalClientList) {
                  monitorModalClientList[recv].emit('updateAlarmCount', socketSendBack)
                } */
                //// console.log(docs2[0])
                socketSendBack['last'] = docs2[0]._id
                // socketSendBack['STS'] = docs2[0].machineStatusType
                var nonAlmCount = docs2.filter(elm => {
                  if ((elm.machineStatus || '警報') !== '警報') {
                    return elm
                  }
                })
                if (nonAlmCount.length > 0) {
                  socketSendBack['STS'] = nonAlmCount[0].machineStatusType
                } else {
                  socketSendBack['STS'] = '停機'
                }
              }
              retObj[machineID] = socketSendBack
              if (idx === machineIDs.length) {
                client.close()
                res.send({
                  type: true,
                  data: retObj
                })
              }
            })
          })
        })
    }
  })
}
function getMachineStsSMBV3 (machineIDs, from, to, res, monitorModalClientList) {
  var replacerArray = []
  var retObj = {}
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      machineIDs.forEach(machineID => {
        // console.log(machineID)
        replacerArray.splice(replacerArray.length, 0, {
          _id: {$eq: machineID} // 'machineID': {$eq: machineID}
        })
      })
      client.db(config.dbName).collection('organization').find({$or: replacerArray}).toArray(function (err0, docs0) {
      var db = client.db(config.dbName)
      // var col = db.collection(config.machineListColName)
          var idx = 0
          // console.log(docs0)
          docs0.forEach(doc => { // machineIDs.forEach(machineID => {
            var machineID = doc._id
            var colName = doc.data
            /* if (machineID === '1B01') {
              colName = 'PIPI96'
            } else if (machineID === '1B02') {
              colName = 'PIPI97'
            } else if (machineID === '1B03') {
              colName = 'PIPI98'
            } else if (machineID === '1B04') {
              colName = 'PIPI08'
            } */
            console.log(from)
            console.log(to)
            db.collection(colName + 'Report').find({trigTime: {$gte: from, $lt: to}, machineStatusType: {$ne: '警報-通信'}}).sort({trigTime: -1}).limit(1).toArray(function(e, d) {
              db.collection(colName + 'Report').find({trigTime: {$gte: from, $lt: to}}).sort({ lastTrigTime: -1 }).toArray(function (err2, docs2) {
              var socketSendBack = {}
              idx++
              console.log(colName + ' ' + docs2.length)
              if (err2) {
              } else if (docs2.length === 0) {
                socketSendBack['machineID'] = machineID
                socketSendBack['totalAlm'] = 0
                socketSendBack['product'] = d.length > 0 ? d[0].product || '' : ''
                socketSendBack['last'] = ''
                socketSendBack['STS'] = '關機'
              } else {
                var almCount = docs2.filter(elm => {
                  return (elm.machineStatus || '警報') === '警報'
                })
                socketSendBack['machineID'] = machineID
                socketSendBack['totalAlm'] = almCount.length
                /* docs2.sort(function (a, b) {
                  return a.trigTime > b.trigTime ? 1 : -1
                }) */
                socketSendBack['product'] = ''
                // console.log('socketSendBack')
                // console.log(socketSendBack)
                if (docs2 .length > 0) {
                  // if (docs2[docs2.length - 1].hasOwnProperty('product')) {
                    socketSendBack['product'] = d.length > 0 ? d[0].product || '' : '' // docs2[docs2.length - 1].product
                  // }
                }
                /* for(recv in monitorModalClientList) {
                  monitorModalClientList[recv].emit('updateAlarmCount', socketSendBack)
                } */
                // console.log(docs2[0])
                socketSendBack['last'] = docs2[0]._id
                // socketSendBack['STS'] = docs2[0].machineStatusType
                var nonAlmCount = docs2.filter(elm => {
                  if ((elm.machineStatus || '警報') !== '警報') {
                    return elm
                  }
                })
                socketSendBack['STS'] = nonAlmCount[0].machineStatusType
              }
              retObj[machineID] = socketSendBack
              if (idx === machineIDs.length) {
                client.close()
                // console.log('This is a test')
                // console.log(retObj['1B01'])
                res.send({
                  type: true,
                  data: retObj
                })
                }
              })
            })
          })
        })
    }
  })
}
function updateModalHWCfg(machineID, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName)
      db.collection(config.machineListColName).find({'machineID': machineID}, {}, function (err0, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
          client.close()
        } else {
          docs.forEach(doc0 => {
            //// console.log(doc0)
            res.send({
              type: true,
              data: doc0
            })
            client.close()
          })
        }
      })
    }
  })
}
function updateModalAlmHWCfg(machineID, mfrom, mto, from, to, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection(machineID).find({trigTime: {$gte: mfrom, $lt: mto}, machineStatusType: {$ne: '警報-通信'}}).toArray(function (err2, docs2) {
              client.close()
              if (err2) {
                res.send({
                  type: false,
                  data: 'Error occured: ' + err2
                })
              } else {
                var almCount = docs2.filter(elm => {
                  return (elm.machineStatus || '警報') === '警報'
                })
                var socketSendBack = {}
                socketSendBack['machineID'] = machineID
                socketSendBack['monthlyAlarm'] = almCount.length
                var dailyAlarm = almCount.filter(elm => {
                  return (moment(elm.trigTime) >= moment(from)) && (moment(elm.trigTime) < moment(to))
                })
                socketSendBack['dailyAlarm'] = dailyAlarm.length
                res.send({
                  type: true,
                  data: socketSendBack
                })
              }
            })
    }
  })
}
function updateModalUtilizationHWCfg(machineID, mfrom, mto, from, to, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      // console.log('show')
      // console.log(mfrom)
      // console.log(mto)
      client.db(config.dbName).collection(machineID).find({$or: [{'machineStatusType': '全自動'}, {'machineStatusType': '半自動'}], trigTime: {$gte: mfrom, $lt: mto}, machineStatusType: {$ne: '警報-通信'}}).toArray(function (err2, docs2) {
        client.close()
        if (err2) {
          res.send({
            type: false,
            data: 'Error occured: ' + err2
          })
        } else {
          // console.log('天')
          // console.log(docs2.length)
          var mid = moment(moment(mfrom).add(1, 'month').format('YYYY-MM-DD HH:mm:ss')).toDate()
          var prvUtilization = docs2.filter(elm => {
            return (moment(elm.trigTime) >= moment(mfrom)) && (moment(elm.trigTime) < moment(mid))
          }).reduce((prev, curr, idx, arr) => {
            return prev + moment.duration(moment(curr['lastTrigTime']).diff(moment(curr['trigTime'])))
          }, 0)
          var utilization = docs2.filter(elm => {
            return (moment(elm.trigTime) >= moment(mid)) && (moment(elm.trigTime) < moment(mto))
          }).reduce((prev, curr, idx, arr) => {
            return prev + moment.duration(moment(curr['lastTrigTime']).diff(moment(curr['trigTime'])))
          }, 0)
          var socketSendBack = {}
          socketSendBack['machineID'] = machineID
          socketSendBack['prevMonthlyUtilization'] = prvUtilization
          socketSendBack['monthlyUtilization'] = utilization
          // console.log(mid)
          // console.log(utilization)
          // console.log(prvUtilization)
          res.send({
            type: true,
            data: socketSendBack
          })
        }
      })
    }
  })
}
function getMachineCurrInfo (machineID, res) {
  var _id = undefined
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName)
      var col = db.collection('lastDeviceID')
      col.find({'machineID': machineID}, {}, function (err, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
          client.close()
        } else {
          // console.log(machineID)
          var col1 = db.collection(machineID)
          docs.forEach(doc => {
            // console.log(doc.last)
            _id = doc.last
            col1.find({'_id': _id}, {}, function (err0, docs0) {
              if (err0) {
                // console.log('ERRRR')
                res.send({
                  type: false,
                  data: 'Error occured: ' + err0
                })
                client.close()
              } else {
                docs0.forEach(doc0 => {
                  // console.log(doc0)
                  res.send({
                    type: true,
                    data: doc0
                  })
                  client.close()
                })
              }
            })
          })   
        }
      })
    }
  })
}
function getMachineCurrInfo1 (machineID, res) {
  var _id = undefined
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection(machineID).find({$and: [{'orderNumber': {$ne: ''}}, {'orderNumber': {$ne: null}}, {'machineStatus': {$ne: '警報'}}], 'orderNumber': {$exists: true}}).sort({ _id: -1 }).limit(1).toArray(function (err, docs) {
        if (err) {
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
          client.close()
        } else if (docs.length === 0) {
          res.send({
            type: true,
            data: []
          })
          client.close()
        } else {
          client.db(config.dbName).collection(machineID).find({'orderNumber': docs[0].orderNumber, 'machineStatus': {$ne: '警報'}}).sort({ _id: -1 }).toArray(function (err1, docs0) {
            if (err1) {
              res.send({
                type: false,
                data: 'Error occured: ' + err1
              })
              client.close()
            } else {
          docs0.forEach(doc0 => {
            // console.log(doc0)
            /*res.send({
              type: true,
              data: doc0
            })*/
          })
          client.db('pmDB').collection('製令單明細').find({'派單號碼': docs[0].orderNumber}).toArray(function (err2, docs1) {
            if (!err2 && docs1.length > 0) {
              docs0[0]['predMoldCnt'] = docs1['派單數量'] || 0
            }
            res.send({
              type: true,
              data: docs0
            })
            client.close()
          })
        }
      })
        }
      })
    }
  })
}
function getHomotypeID (machineID, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db('pmDB').collection('成型機規格表').find().toArray(function(err1, docs) {
        client.close()
        if (err1) {
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
        } else {
          var machineIDObj = docs.filter(doc => {
            return doc['機台編號'] === machineID
          })
          var machineIDArr = docs.find(doc => {
            return (doc['型號規格'] === machineIDObj['型號規格']) && (doc['機台編號'] !== machineID)
          })
          res.send({
            type: false,
            data: machineIDArr
          })
        }
      })
    }
  })
}
function getAvailableMachineID (machineID, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db('pmDB').collection('成型機規格表').find().toArray(function(err1, docs) {
        client.close()
        if (err1) {
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
        } else {
          var machineIDObj = docs.filter(doc => {
            return doc['機台編號'] === machineID
          })
          var machineIDArr = docs.find(doc => {
            return (doc['型號規格'] === machineIDObj['型號規格']) && (doc['機台編號'] !== machineID)
          })
          res.send({
            type: false,
            data: machineIDArr
          })
        }
      })
    }
  })
} 