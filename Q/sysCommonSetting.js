
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var sysSettingCol = 'sysCommonSetting'
exports.getSysCommonSettingList = getSysCommonSettingList
exports.getPageSetting = getPageSetting
exports.getPageSettingRegister=getPageSettingRegister
exports.sysCommonSettingUpdateRule=sysCommonSettingUpdateRule
exports.sysCommonSettingUpdateColor=sysCommonSettingUpdateColor
exports.sysCommonSettingUpdateFont=sysCommonSettingUpdateFont
exports.sysCommonSettingUpdateSize=sysCommonSettingUpdateSize

var rowData = [
  {_id: 1, rule: [5], fontBackground: '#a2aa33', fontSized: '30', fontColor: '#e0e0e0', fontBold: true, fontItalic: true, fontBlink: true},
  {_id: 2, rule: [90], fontBackground: '#ffffff', fontSized: '20', fontColor: 'a2aa33', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 3, rule: [85], fontBackground: '#dd4814', fontSized: '10', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 4, rule: [1.1], fontBackground: '#ffffff', fontSized: '20', fontColor: '#ff0000', fontBold: false, fontItalic: true, fontBlink: false},
  {_id: 5, rule: [0.9], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: true, fontItalic: false, fontBlink: false},
  {_id: 6, rule: [3], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 7, rule: [50], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 8, rule: [0], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 9, rule: ['B'], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 10, rule: [24], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 101, rule: [1.03], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 102, rule: [0, 30], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 103, rule: [0, 30], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 104, rule: [0, 1], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 105, rule: [0, 1], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 106, rule: [0, 30], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 201, rule: [0], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 202, rule: [0], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 203, rule: [0], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 204, rule: [0], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 205, rule: [3], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false},
  {_id: 206, rule: [3], fontBackground: '#ffffff', fontSized: '20', fontColor: '#000000', fontBold: false, fontItalic: false, fontBlink: false}
]

function getSysCommonSettingList (res) {
  var rowDataArr = []
  /* rowData.forEach(row => {
    row.rule.forEach((elm, idx) => {
      row['data' + idx] = elm
    })
    rowDataArr.splice(rowDataArr.length, 0, row)
  }) */
  /*res.send({
    type: true,
    data: rowData
  })*/
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection(sysSettingCol).find({}).toArray(function(err1, docs1) {
        client.close()
        if (err1) {
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
        } else if (docs1.length === 0) {
          initialSysCommonSettingCol(res)
        } else {
          res.send({
            type: true,
            data: docs1
          })
        }
      })
    }
  })
}
function setNewUser (data, socket) {
  var insertData = {}
  dtKeys.forEach(dtKey => {
    insertData[dtKey] = data[dtKey] || ''
  })
  dataRet.splice(dataRet.length, 0, insertData)
  // console.log(dataRet)
}

function getPageSetting (res) {
  /*var retData = rowData.filter(row => {
    return (row._id < 100) || ((row._id > 200) && (row._id < 300))
  })
  res.send({
    type: true,
    data: retData
  })*/
  // client.close()
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection(sysSettingCol).find({$and: [{$or: [{_id: {$lt: 100}}, {_id: {$gt: 200}}]}, {_id: {$lt: 300}}]}).toArray(function(err1, docs1) {
        client.close()
        if (err1) {
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
        } else if (docs1.length === 0) {
          res.send({
            type: true,
            data: docs1
          })
        } else {
          res.send({
            type: true,
            data: docs1
          })
        }
      })
    }
  })
}
function getPageSettingRegister (res) {
  /*var retData = rowData.filter(row => {
    return (row._id < 100) || ((row._id < 200))
  })
  res.send({
    type: true,
    data: retData
  })*/
  // client.close()
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection(sysSettingCol).find({$or: [{_id: {$lt: 100}}, {_id: {$lt: 200}}]}).toArray(function(err1, docs1) {
        client.close()
        if (err1) {
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
        } else if (docs1.length === 0) {
          //initialSysCommonSettingCol(res)
        } else {
          res.send({
            type: true,
            data: docs1
          })
        }
      })
    }
  })
}
function checkUser (req, res) {
  var userName = req.params.userName
  var userPassword = req.params.userPassword
  var findUser = dataRet.find(elm => {
    // console.log(elm.symbol)
    return (elm.symbol === userName) && (elm.password === userPassword)
  })
  if (findUser !== undefined) {
    // console.log('findUser')
    // console.log(findUser)
    res.send({
      type: true,
      login: true,
      data: findUser
    })
    // client.close()
  } else {
    // console.log('findUser')
    // console.log(findUser + 'fail')
    res.send({
      type: true,
      login: false
    })
    // client.close()
  }
}

function sysCommonSettingUpdateRule (data, socket) {
  // console.log('sysCommonSettingUpdateRule')
  // console.log(data)
  /*var tgt = rowData.find(elm => {
    return elm._id === data._id
  })
  tgt.rule = data.rule
  // console.log(rowData)*/
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
    } else {
      client.db(config.dbName).collection(sysSettingCol).updateOne({_id: data._id}, {$set: {rule: data.rule}}, {upsert: true})
      client.close()
    }
  })
}
function sysCommonSettingUpdateColor (data, socket) {
  // console.log('sysCommonSettingUpdateColor')
  // console.log(data)
  /* var tgt = rowData.find(elm => {
    return elm._id === data._id
  })
  tgt.fontBackground = data.fontBackground
  tgt.fontColor = data.fontColor
  // console.log(rowData)*/
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
    } else {
      client.db(config.dbName).collection(sysSettingCol).updateOne({_id: data._id}, {$set: {fontBackground: data.fontBackground, fontColor: data.fontColor}}, {upsert: true})
      client.close()
    }
  })
}
function sysCommonSettingUpdateSize (data, socket) {
  // console.log('sysCommonSettingUpdateSize')
  // console.log(data)
  /*var tgt = rowData.find(elm => {
    return elm._id === data._id
  })
  tgt.fontSized = data.fontSized
  // console.log(rowData)*/
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
    } else {
      client.db(config.dbName).collection(sysSettingCol).updateOne({_id: data._id}, {$set: {fontSized: data.fontSized}}, {upsert: true})
      client.close()
    }
  })
}
function sysCommonSettingUpdateFont (data, socket) {
  // console.log('sysCommonSettingUpdateFont')
  // console.log(data)
  /*var tgt = rowData.find(elm => {
    return elm._id === data._id
  })
  tgt.fontBold = data.fontBold
  tgt.fontItalic = data.fontItalic
  tgt.fontBlink = data.fontBlink
  // console.log(rowData)*/
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
    } else {
      client.db(config.dbName).collection(sysSettingCol).updateOne({_id: data._id}, {$set: {fontBold: data.fontBold, fontItalic: data.fontItalic, fontBlink: data.fontBlink}}, {upsert: true})
      client.close()
    }
  })
}

function initialSysCommonSettingCol(res)
{
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // db未啟動
    } else {
      client.db(config.dbName).collection(sysSettingCol).insertMany(rowData)
      client.close()
      res.send({
        type: true,
        data: rowData
      })
    }
  })
}