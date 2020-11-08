var moment = require('moment')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var machineProperty = require('./machineProperty.js')
var shiftDb = 'shiftDatabase'
var organizationDb = 'organization'
exports.updateShiftTable = updateShiftTable
exports.updateShiftTable1 = updateShiftTable1 // New
exports.loadDefaultSettingShiftTable = loadDefaultSettingShiftTable
exports.loadDefaultSettingShiftTable1 = loadDefaultSettingShiftTable1
exports.loadDefaultSettingShiftTable2 = loadDefaultSettingShiftTable2
exports.getValidCalendar = getValidCalendar
exports.getCalendar = getCalendar
exports.getshiftRecord = getshiftRecord1

function updateShiftTable (machineID, tgtDate, shift, newData, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var year = moment(tgtDate, 'YYYY-MM-DD').add(0, 'd').format('Y')
      var id = moment(tgtDate, 'YYYY-MM-DD').add(0, 'd').format('YYYY/M/D')
      var db = client.db('calendar' + year)
      var col = db.collection(machineID)
      //col.update({'_id': {$eq: id}}, {$set: {[shift]:newData}})
      col.findOneAndUpdate({'_id': {$eq: id}}, {$set: {[shift]:newData}}, {returnOriginal: false}, function (err0, doc) {
        if (err0) {
          res.send({
            type: false,
            data: 'Error occured: ' + err0
          })
          client.close()
        } else {
          // console.log(doc)
          // // console.log(doc.value[shift])
          res.send({
            type: true,
            data:  (shift===4) ? doc.value[shift]: true
          })
          client.close()
        }
      })
    } 
  }) 
}
function updateShiftTable1 (machineID, tgtDate, shift0, newData, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var year = moment(tgtDate, 'YYYY-MM-DD').add(0, 'd').format('Y')
      var id = Number(moment(tgtDate, 'YYYY-MM-DD').add(0, 'd').format('YYYYMMDD'))
      client.db('ldm').collection('sysConfig').find({$or: [{_id: 'timeSlicePoint0'}, {_id: 'shiftCfg'}]}).toArray(function(err2, docs2) {
       //------------------------------------------------
          var shiftObj = docs2.find(doc => { return doc._id === 'shiftCfg' })
          var shiftKeys = Object.keys(shiftObj).filter(elm => {return elm !== '_id'})
          var shift = {}
          shiftKeys.forEach(elm => {
            shift[elm] = shiftObj[elm]
            if (shift[elm]['key'] == shift0) {
              shift[elm]['work'] = newData
            } else {
              shift[elm]['work'] = false
            }
          })
          //------------------------------------------------
          var initDocObj = docs2.find(doc => { return doc._id === 'timeSlicePoint0'})
          var initDocKeys = Object.keys(initDocObj).filter(elm => {return elm !== '_id'})
          var initDoc = {}
          initDocKeys.forEach(elm => {
            initDoc[elm] = initDocObj[elm]
          })
          //------------------------------------------------
              var day = moment(tgtDate, 'YYYY-MM-DD').add(0, 'days').format('YYYYMMDD')
              var day1 = moment(tgtDate, 'YYYY-MM-DD').add(0, 'days').format('YYYY/M/DD')
              obj = {
                _id: Number(day),
                date: new Date(day1),
                shift: shift,
                initDoc: initDoc
              }
              //client.db('shiftDatabase').collection(machineID.data).insertOne(obj)
      client.db(config.dbName).collection(organizationDb).findOne({_id: machineID}, function (err1, doc1) {
        if (err1) {
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
          client.close()
        } else {
          client.db(shiftDb).collection(doc1.data).findOne({'_id': id}, function (err2, doc2) {
            // console.log('test Docs')
            // console.log(machineID)
            // console.log(id)
            // console.log(doc1)
            // console.log(doc2)
            if (err2) {
              // 錯誤
              client.close()
            } else if (doc2 === null) {
              // 尚未被加入
              // console.log('nnnnnn')
              // console.log(obj)
              // console.log(doc1.data)
              client.db(shiftDb).collection(doc1.data).insertOne(obj)
              client.close()
            } else {
              // console.log('test Docs__')
              // console.log(shift0)
              // console.log(newData)
              shiftKeys.forEach(elm => {
                shift[elm] = shiftObj[elm]
                if (shift[elm]['key'] == shift0) {
                  shift[elm]['work'] = newData
                } else {
                  if (doc2.hasOwnProperty('shift')) {
                    if (doc2['shift'].hasOwnProperty(elm)) {
                      if (doc2['shift'][elm].hasOwnProperty('work')) {
                        shift[elm]['work'] = doc2['shift'][elm]['work']
                      } else {
                        shift[elm]['work'] = false
                      }
                    } else {
                      shift[elm]['work'] = false
                    }
                  } else {
                    shift[elm]['work'] = false
                  }
                }
              })
              client.db(shiftDb).collection(doc1.data).updateOne({'_id': id}, {$set: {shift: shift, initDoc: initDoc}})
              client.close()
            }
          })
          /*client.db(shiftDb).collection(doc1.data).findOneAndUpdate({'_id': id}, {$set: {[shift]:newData}}, {returnOriginal: false}, function (err0, doc) {
            if (err0) {
              res.send({
                type: false,
                data: 'Error occured: ' + err0
              })
              client.close()
            } else {
              // console.log(doc)
              // console.log(doc.value[shift])
              res.send({
                type: true,
                data: doc.value[shift]
              })
              client.close()
            }
          })*/
        }
      })
    })
    } 
  }) 
}
function loadDefaultSettingShiftTable2 (machineIDs, tgtDate, res) {
  var ret = []
  //var beginDay = Number(moment((year + '/' + month + '/' + day), 'YYYY/M/DD').format('YYYYMMDD'))
  //var endDay = Number(moment((year + '/' + month + '/' + day), 'YYYY/M/DD').add(6, 'days').format('YYYYMMDD'))
  //// console.log(beginDay + '     ' + endDay)
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      /* res.send({
        type: false,
        data: 'Error occured: ' + err
      }) */
    } else {
      // console.log(machineIDs)
      var machineIDArr = []
      machineIDs.forEach(elm => {
        machineIDArr.splice(machineIDArr.length, 0, {_id: elm})
      })
      client.db(config.dbName).collection(organizationDb).find({$or: machineIDArr}).toArray(function (err1, docs) {
        if (err1) {
          client.close()
          /* res.send({
            type: true,
            data: true
          }) */
        } else {
          if (docs.length > 0) { // 至少有一個查得到財產編號
            setDefaultShiftRecords(client, docs, tgtDate, function(records) {
              client.close()
              /* res.send({
                type: true,
                data: true
              }) */
            })
          } else {
            client.close()
            /* res.send({
              type: true,
              data: true
            }) */
          }
        }
      })
    }
  })
}
function setDefaultShiftRecords (client, machineIDs, tgtDate, callback) {
  client.db('ldm').collection('sysConfig').find({$or: [{_id: 'timeSlicePoint0'}, {_id: 'shiftCfg'}]}).toArray(function(err, docs) {
    if (err) {
      // 資料庫沒開返回
      callback(false)
    } else {
      // 先不考慮兩個少一個，但這樣情況就是載入預設
      //------------------------------------------------
      var shiftObj = docs.find(doc => { return doc._id === 'shiftCfg' })
      var shiftKeys = Object.keys(shiftObj).filter(elm => {return elm !== '_id'})
      var shift = {}
      var i = 0
      shiftKeys.forEach(elm => {
        i++
        shift[elm] = shiftObj[elm]
        if (i === shiftKeys.length) {
          shift[elm]['work'] = false
        } else {
          shift[elm]['work'] = true
        }
      })
      //------------------------------------------------
      var initDocObj = docs.find(doc => { return doc._id === 'timeSlicePoint0'})
      var initDocKeys = Object.keys(initDocObj).filter(elm => {return elm !== '_id'})
      var initDoc = {}
      initDocKeys.forEach(elm => {
        initDoc[elm] = initDocObj[elm]
      })
      //------------------------------------------------
      var beginDay = moment(tgtDate, 'YYYY-MM-DD').format('YYYYMMDD')
      var endDay = moment(tgtDate, 'YYYY-MM-DD').add(5, 'days').format('YYYYMMDD')
      machineIDs.forEach(machineID => {
        var arr = []
        var obj = {}
        for (var idx = 0; idx < 6; idx++) {
          var day = Number(moment(tgtDate, 'YYYY-MM-DD').add(idx, 'days').format('YYYYMMDD'))
          var day1 = moment(tgtDate, 'YYYY-MM-DD').add(idx, 'days').format('YYYY/M/DD')
          obj = {
            _id: day,
            date: new Date(day1),
            shift: shift,
            initDoc: initDoc
          }
          // client.db(shiftDb).collection(machineID.data).insertOne(obj)
          client.db(shiftDb).collection(machineID.data).updateOne({'_id': day}, {$set: obj}, {upsert: true})
        }
      })
      // console.log(1111111111111111111111111111111111111111111111111111111111111111)
      callback(true)
    }
  })
}
function loadDefaultSettingShiftTable1 (machineID, tgtDate, res) {
  if (machineID === '1A01') {
    var day = moment(tgtDate, 'YYYY-MM-DD').format('YYYYMMDD')
    var day1 = moment(tgtDate, 'YYYY-MM-DD').format('YYYY/M/DD')
    var findElm = pty.some(elm => {
      return elm._id === Number(day)
    })
    if (findElm) {
      // console.log('loadDefaultSettingShiftTable1')
      // console.log(findElm)
      findElm.shift['日班'].work = true
      findElm.shift['加班'].work = true
      findElm.shift['小夜班'].work = true
    } else {
      pty.splice(pty.length, 0, {
        _id: Number(day),
        date: new Date(day1),
        shift: {'日班': {'from': 0, 'to': 2, key: '1', work: true},
        '加班': {'from': 2, 'to': 3, key: '2', work: true},
        '小夜班': {'from': 3, 'to': 4, key: '3', work: true},
        '夜班': {'from': 4, 'to': 0, key: '4', work: false}},
        initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}

      })
    }
  }
}
function loadDefaultSettingShiftTable (machineID, tgtDate, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var year = moment(tgtDate, 'YYYY-MM-DD').add(0, 'd').format('Y')
      var id = moment(tgtDate, 'YYYY-MM-DD').add(0, 'd').format('YYYY/M/DD')
      var id1 = moment(tgtDate, 'YYYY-MM-DD').add(1, 'd').format('YYYY/M/DD')
      var id2 = moment(tgtDate, 'YYYY-MM-DD').add(2, 'd').format('YYYY/M/DD')
      var id3 = moment(tgtDate, 'YYYY-MM-DD').add(3, 'd').format('YYYY/M/DD')
      var id4 = moment(tgtDate, 'YYYY-MM-DD').add(4, 'd').format('YYYY/M/DD')
      var id5 = moment(tgtDate, 'YYYY-MM-DD').add(5, 'd').format('YYYY/M/DD')
      // console.log('id: ' + id)
      // console.log('id1: ' + id1)
      // console.log('id2: ' + id2)
      // console.log('id3: ' + id3)
      // console.log('id4: ' + id4)
      // console.log('id5: ' + id5)
      var db = client.db('calendar' + year)
      /* db.collection(machineID).updateMany({$or: [{'_id': id},
      {'_id': id1},
      {'_id': id2},
      {'_id': id3},
      {'_id': id4},
      {'_id': id5
      }]}, {$set: {'1':true, '2':true, '3':true}}) */
      db.collection(machineID).updateMany({$and: [{data: {$gte: id}}, {date: {$lte: id5}}]}, {$set: {'1':true, '2':true, '3':true}})
      client.close()
    }
  })
}

function getValidCalendar (from, to, res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var year = moment(from).year()
      var db = client.db('calendar' + year)
      db.collection('1A01').find({date: {$gte: new Date(moment(from).add(8, 'hours')), $lte: new Date(moment(to).add(1,'day').add(8, 'hours'))}}).toArray(function(err1, docs) {
        if (err1) {
          res.send({
            type: false,
            data: []
          })
        } else {
          res.send({
            type: true,
            data: docs
          })
        }
        client.close()
      })
    }
  })
}

function getCalendar (machineID, year, month, day, res) {
  MongoClient.connect(config.dbUrl, function(err0, client) { 
    if (err0) {
      res.send({
        type: false,
        data: 'Error occured: ' + err0
      })
      return
    }
    var index = 0
    var docsN = []
    client.db('calendar' + year).collections(function(err1, collections) {
      // // console.log(collections.map(elm => elm.s.name))
      if (err1) {
        res.send({
          type: false,
          data: 'Error occured: ' + err1
        })
        client.close()
      } else if (collections.map(elm => elm.s.name).indexOf(machineID) < 0) {
        res.send({
          type: true,
          data: []
        })
        client.close()
      } else {
        client.db('calendar' + year).collection(machineID).find({'date': {$gte: new Date(year + '/' + month + '/' + day)}}).toArray(function (err, docs) {
          if (err) {
            res.send({
              type: false,
              data: 'Error occured: ' + err
            })
            client.close()
          } else {
            if (docs.length > 0) { 
              docs.forEach(doc => {
                if (index < 7) {
                  docsN.push(doc)
                  index++
                }
              })
              res.send({
                type: true,
                data: docsN
              })
              client.close()
            }
          }      
        })
      }
    })
  })
}
var pty = [{
  _id: 20190101, date: new Date('2019/1/1'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: true}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190102, date: new Date('2019/1/2'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190103, date: new Date('2019/1/3'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190104, date: new Date('2019/1/4'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190105, date: new Date('2019/1/5'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190106, date: new Date('2019/1/6'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190107, date: new Date('2019/1/7'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190108, date: new Date('2019/1/8'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190109, date: new Date('2019/1/9'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190110, date: new Date('2019/1/10'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190111, date: new Date('2019/1/11'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190112, date: new Date('2019/1/12'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190113, date: new Date('2019/1/13'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}, {
  _id: 20190114, date: new Date('2019/1/14'), shift: {'日班': {'from': 0, 'to': 2, key: '1', work: false}, '加班': {'from': 2, 'to': 3, key: '2', work: false}, '小夜班': {'from': 3, 'to': 4, key: '3', work: false}, '夜班': {'from': 4, 'to': 0, key: '4', work: false}}, initDoc: { 0: '08:00', 1: '12:00', 2: '16:30', 3: '20:00', 4: '23:00'}
}]

// 讀取步驟
// 1. 先從machineID找出對應的財產編號
// 2. 以財產編號作為collection name並以時間區間作為搜尋條件透過promise找出資料
function getshiftRecord1 (machineIDs, year, month, day, res) {
  var ret = []
  var beginDay = Number(moment((year + '/' + month + '/' + day), 'YYYY/M/DD').format('YYYYMMDD'))
  var endDay = Number(moment((year + '/' + month + '/' + day), 'YYYY/M/DD').add(6, 'days').format('YYYYMMDD'))
  // console.log(beginDay + '     ' + endDay)
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var machineIDArr = []
      machineIDs.forEach(elm => {
        machineIDArr.splice(machineIDArr.length, 0, {_id: elm})
      })
      client.db(config.dbName).collection(organizationDb).find({$or: machineIDArr}).toArray(function (err, docs) {
        if (err) {
          client.close()
          res.send({
            type: true,
            data: ret
          })
        } else {
          if (docs.length > 0) { // 至少有一個查得到財產編號
            getShiftRecords(client.db('shiftDatabase'), docs, beginDay, endDay, function(records) {
              records.forEach(record => {
                var keys = Object.keys(record)
                keys.forEach(key => {
                  // console.log(record)
                  // console.log(key)
                  /* var findObj = docs.find(elm => {
                    return elm.data === key
                  }) */
                  var obj = {}
                  obj['machineID'] = key // findObj._id
                  var selectedData = record[key]
                  selectedData.forEach(elm => {
                    var day = moment(elm._id, 'YYYYMMDD').format('dddd').toLowerCase()
                    var keysName = Object.keys(elm.shift)
                    keysName.forEach(name => {
                      obj[day + elm.shift[name].key] = elm.shift[name].work
                    })
                  })
                  // console.log(selectedData)
                  ret.splice(ret.length, 0, obj)
                })
              })
              ret.sort((a, b) => {
                return a.machineID > b.machineID ? 1 : -1
              })
              client.close()
              res.send({
                type: true,
                data: ret
              })
            })
          } else { //全部都找不到
            client.close()
            res.send({
              type: true,
              data: ret
            })
          }
        }
      })
    }
  })
}
function getShiftRecords (db, machineIDs, beginDay, endDay, callback) {
  var totalRecords = []
  var i
  //var records = []
//// console.log('getMachineMoldProductrecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getEachMachineProductRecords (db, machineIDs[i], beginDay, endDay, function(records) {
      tmp++
      //// console.log( 'tmp : ' + tmp )
      //// console.log('EachMachine record : ' +  records.length)
      //totalRecords = totalRecords.concat(records)
      totalRecords.splice(totalRecords.length, 0, records)
      //// console.log('totleRecords : ' + totalRecords.length)

      if ( tmp == machineIDs.length ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
    })
  }
}
function getEachMachineProductRecords (db, machineID, beginDay, endDay, callback) {
  db.collection(machineID.data).find({_id: {$gte: Number(beginDay), $lte: Number(endDay)}}).toArray(function (err, docs) {
    var obj = {}
    obj[machineID._id] = []
    if(err) {
      callback(obj)
    } else {
      obj[machineID._id] = docs
      callback(obj)
    }
  })
}
function getshiftRecord (machineIDs, year, month, day, res) {
  machineProperty.getMachineProperty(machineIDs, function(property) {
    var propertyNumber = property.map(elm => elm.data)
    // console.log('getshiftRecord')
    // console.log(propertyNumber)
    var ret = []
    var beginDay = Number(moment((year + '/' + month + '/' + day), 'YYYY/M/DD').format('YYYYMMDD'))
    var endDay = Number(moment((year + '/' + month + '/' + day), 'YYYY/M/DD').add(6, 'days').format('YYYYMMDD'))
    // console.log(beginDay + '     ' + endDay)
    property.forEach(elm => {
      if (elm._id === '1A01') {
        var selectedData = pty.filter(elm => {
          if ((elm._id >= beginDay) && (elm._id <= endDay)) {
            return elm
          }
        })
        var obj = {}
        obj['machineID'] = elm._id
        selectedData.forEach(elm => {
          var day = moment(elm._id, 'YYYYMMDD').format('dddd').toLowerCase()
          var keysName = Object.keys(elm.shift)
          keysName.forEach(name => {
            obj[day + elm.shift[name].key] = elm.shift[name].work
          })
        })
        // console.log(selectedData)
        ret.splice(ret.length, 0, obj)
      } else {
        ret.splice(ret.length, 0, {
          machineID: elm._id
        })
      }
    })
    // console.log(ret)
    res.send({
      type: true,
      data: ret
    })
  })
}