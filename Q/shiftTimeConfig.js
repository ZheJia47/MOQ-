var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getShiftNameArr = getShiftNameArr
exports.writeClockSetting = writeClockSetting
exports.writeShiftSetting = writeShiftSetting
exports.getShiftClock = getShiftClock

function getShiftNameArr (res) {
  var retObj = {}
  var arr = Object.keys(shift).filter(elm => {
    return elm !== '_id'
  })
  arr.forEach(elm => {
    retObj[elm] = shift[elm]
  })
  retObj = {}
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else { 
      client.db(config.dbName).collection('sysConfig').find({$or: [{_id: 'timeSlicePoint0'}, {_id: 'shiftCfg'}]}).toArray(function(err0, docs0) {
        if (err0) {
          res.send({
            type: false,
            data: 'Error occured: ' + err0
          })
        } else {
          var shiftCfg = {}
          var timeSlicePoint = {}
          if (docs0 !== null) {
            docs0.forEach(elm => {
              if (elm._id === 'timeSlicePoint0') {
                timeSlicePoint = elm
              } else if (elm._id === 'shiftCfg') {
                shiftCfg = elm
              }
            })
          }
          var arr0 = Object.keys(shiftCfg).filter(elm => {
            return elm !== '_id'
          })
          arr0.forEach(elm => {
            retObj[elm] = shiftCfg[elm]
          })
          res.send({
            type: true,
            data: retObj
          })
        }
        client.close()
      })
    }
  })
}

var initDoc = {
  _id: 'timeSlicePoint',
  0: '08:00', // '日切換點'
  1: '12:00',
  2: '16:30',
  3: '20:00',
  4: '23:00'
}
/* var shift = {
  '_id': 'shiftCfg',
  '日班': {'from': 0, 'to': 2, key: 'first'},
  '加班': {'from': 2, 'to': 3, key: 'second'},
  '夜班': {'from': 3, 'to': 0, key: 'third'}
} */
var shift = {
  '_id': 'shiftCfg',
  '日班': {'from': 0, 'to': 2, key: '1'},
  '加班': {'from': 2, 'to': 3, key: '2'},
  '小夜班': {'from': 3, 'to': 4, key: '3'},
  '夜班': {'from': 4, 'to': 0, key: '4'}
}
function writeShiftSetting (data, socket) {
  // console.log('writeShiftSetting: '  + data)
  shift = data
  // data['obj'].forEach(elm => {
    var keys = Object.keys(data)
    keys.forEach(key => {
  // console.log('writeShiftSetting: '  + key + ':' + data[key])
})
// })
} 
function writeClockSetting (data, socket) {
  initDoc = data
  // console.log('writeClockSetting: ' + data['obj'])
}
function getShiftClock (res) {
  var retArr = []
  retArr.splice(retArr.length, 0, shift)
  retArr.splice(retArr.length, 0, initDoc)
  res.send({
    type: true,
    data: retArr
  })
}