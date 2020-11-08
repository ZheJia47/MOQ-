var moment = require('moment')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
//ar prodDepartSetting = require('./prodDepartSetting.js')

exports.getMachineProperty = getMachineProperty
var retArr = [{
  _id: '1A01', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI14', abridge: '機台', linked: true
}, {
  _id: '1A02', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI52', abridge: '機台', linked: true
}, {
  _id: '1A03', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI34', abridge: '機台', linked: true
}, {
  _id: '1A04', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI20', abridge: '機台', linked: true
}, {
  _id: '1A05', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI18', abridge: '機台', linked: true
}, {
  _id: '1A06', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI17', abridge: '機台', linked: true
}, {
  _id: '1A07', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI16', abridge: '機台', linked: true
}, {
  _id: '1A08', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI15', abridge: '機台', linked: true
}, {
  _id: '1A09', father: '1A', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台', linked: true
}, {
  _id: '1B01', father: '1B', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台', linked: true
}, {
  _id: '2C01', father: '2C', son: [], level: 1, levelName: '機台編號', data: 'PIPI07', abridge: '機台', linked: true
}, {
  _id: '1A', father: '成型一課', son: ['1A01', '1A02', '1A03', '1A04', '1A05', '1A06', '1A07', '1A08', '1A09'], level: 2, levelName: '區', data: '', linked: true
}, {
  _id: '1B', father: '成型一課', son: ['1B01'], level: 2, levelName: '區', data: '', linked: true
}, {
  _id: '1C', father: '成型一課', son: [], level: 2, levelName: '區', data: '', linked: true
}, {
  _id: '2C', father: '成型二課', son: ['2C01'], level: 2, levelName: '區', data: '', linked: true
}, {
  _id: '成型一課', father: '全廠', son: ['1A', '1B', '1C'], level: 3, levelName: '課', data: '', linked: true
}, {
  _id: '成型二課', father: '全廠', son: ['2A', '2B', '2C'], level: 3, levelName: '課', data: '', linked: true
}, {
  _id: '全廠', father: 'organization', son: ['成型一課', '成型二課'], level: 4, levelName: '廠', data: '', linked: true
}, {
  _id: '全局', father: 'organization1', son: ['全廠'], level: 5, levelName: '局', data: '', linked: true
}]
function getMachineProperty(machineIDs, callback) {
  // console.log('getMachineProperty')
  //// console.log(prodDepartSetting.retArr)
  var returnArr = []
  returnArr = retArr.filter(elm => {
    if ((machineIDs.indexOf(elm._id) > -1) && (elm._id !== '')){
      return elm
    }
  })
  callback(returnArr)
}