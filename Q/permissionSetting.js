
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getPermissionList = getPermissionList
exports.getPermissionDetail = getPermissionDetail
exports.setNewUser = setNewUser
exports.deleteUser = deleteUser
exports.checkUser = checkUser1
exports.saveUserSettingDetail = saveUserSettingDetail

var dataRet = [{
  'symbol': 'admin',
  'fullName': '管理者',
  'password': 'admin',
  'select': '',
  'selected': false,
  'color': 'amber',
  detail: [
    {
      id: 'monitor', viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'register', viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'Report',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'ProductionStatisticsTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'Curve',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'ProductReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'MoldReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'ProductProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'MoldNumProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'MOQ',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'Utilization',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'AbnormalTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'AbnormalPie',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'Abnormal',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'calendar',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'shiftTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'sysCommonSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'permissionSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'backup',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    }
  ]}, {
  'symbol': 'user0',
  'fullName': '使用者',
  'password': 'user0',
  'select': '',
  'selected': false,
  'color': 'amber',
  detail: [
    {
      id: 'monitor',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'register',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'Report',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'ProductionStatisticsTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'Curve',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'ProductReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'MoldReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'ProductProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'MoldNumProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'MOQ',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'Utilization',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'AbnormalTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'AbnormalPie',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'Abnormal',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
    },
    {
      id: 'calendar',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'shiftTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'sysCommonSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'permissionSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    },
    {
      id: 'backup',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
    }
  ]}, {
    'symbol': 'user10',
    'fullName': '使用者10',
    'password': 'user10',
    'select': '',
    'selected': false,
    'color': 'amber',
    detail: [
      {
        id: 'monitor',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'register',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
      },
      {
        id: 'Report',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
      },
      {
        id: 'ProductionStatisticsTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'Curve',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'ProductReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'MoldReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'ProductProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'MoldNumProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'MOQ',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'Utilization',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'AbnormalTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'AbnormalPie',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'Abnormal',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
      },
      {
        id: 'calendar',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
      },
      {
        id: 'shiftTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
      },
      {
        id: 'sysCommonSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
      },
      {
        id: 'permissionSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
      },
      {
        id: 'backup',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 2, exportExcel: 2, print: 2
      }
    ]
}]
var dtKeys = ['symbol', 'fullName', 'password', 'select', 'selected', 'color']
function getPermissionList (res) {
  var retArr = []
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else { 
      client.db(config.dbName).collection('user').find({}).toArray(function(err0, docs0) {
        client.close()
        // console.log('getPermissionList')
        // console.log(docs0)
        client.close()
        if (err0) {
          res.send({
            type: false,
            data: 'Error occured: ' + err0
          })
        } else if (docs0.length === 0) {
          dataRet.forEach(dataRetSingle => {
            var obj = {}
            dtKeys.forEach(dtKey => {
              obj[dtKey] = dataRetSingle[dtKey]
            })
            retArr.splice(retArr.length, 0, obj)
          })
          // console.log(retArr)
          res.send({
            type: true,
            data: retArr
          })
        } else {
          docs0.forEach(dataRetSingle => {
            var obj = {}
            dtKeys.forEach(dtKey => {
              obj[dtKey] = dataRetSingle[dtKey]
            })
            retArr.splice(retArr.length, 0, obj)
          })
          // console.log(retArr)
          res.send({
            type: true,
            data: retArr
          })
        }
      })
    }
  })

  /*dataRet.forEach(dataRetSingle => {
    var obj = {}
    dtKeys.forEach(dtKey => {
      obj[dtKey] = dataRetSingle[dtKey]
    })
    retArr.splice(retArr.length, 0, obj)
  })
  // console.log(retArr)
  res.send({
    type: true,
    data: retArr
  })*/
}
function setNewUser (data, socket) {
  var insertData = {}
  dtKeys.forEach(dtKey => {
    insertData[dtKey] = data[dtKey] || ''
  })
  insertData['detail'] = detail
  // dataRet.splice(dataRet.length, 0, insertData)
  // // console.log(dataRet)
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // 通報使用者新增錯誤
    } else {
      insertData['_id'] = data['symbol']
      client.db(config.dbName).collection('user').insertOne(insertData)
      client.close()
    }
  })
}
function deleteUser (data, socket) {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      // 通報使用者新增錯誤
    } else { 
      client.db(config.dbName).collection('user').remove({_id: data['symbol']})
      client.close()
    }
  })
}
var columns2Obj = {
  pagePermissionSetting: '頁面權限設定',
  colorSetting: '欄位色彩設定',
  formFirstSection: '成型一課',
  formSecondSection: '成型二課',
  formThirdSection: '成型三課',
  updateData: '資料寫入',
  exportExcel: '匯出EXECEL',
  print: '列印'
}
var detail = [
  {
    id: 'monitor',  viewSetting: 2, colorSetting: 2, formFirstSection: 2, formSecondSection: 2, formThirdSection: 2, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'register',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 2, exportExcel: 2, print: 2
  },
  {
    id: 'Report',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 2, exportExcel: 2, print: 2
  },
  {
    id: 'ProductionStatisticsTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'Curve',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'ProductReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'MoldReport',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'ProductProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'MoldNumProcessAnalysis',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'MOQ',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'Utilization',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'AbnormalTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'AbnormalPie',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'Abnormal',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 0, exportExcel: 2, print: 2
  },
  {
    id: 'calendar',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 2, exportExcel: 2, print: 2
  },
  {
    id: 'shiftTable',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 2, exportExcel: 2, print: 2
  },
  {
    id: 'sysCommonSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 2, exportExcel: 2, print: 2
  },
  {
    id: 'permissionSetting',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 2, exportExcel: 2, print: 2
  },
  {
    id: 'backup',  viewSetting: 2, colorSetting: 2, formFirstSection: 1, formSecondSection: 1, formThirdSection: 1, updateData: 2, exportExcel: 2, print: 2
  }
]
/* function getPermissionDetail (req, res) {
  var user = req.params.user
  var obj = {}
  var userElm = dataRet.find(tgtUser => {
    return tgtUser.symbol === user
  })
  // console.log('getPermissionDetail')
  // console.log(userElm)
  // console.log(userElm.detail)
  var userDetail = userElm.detail
  userDetail.forEach(elm => {
    obj[elm.id] = elm
  })
  res.send({
    type: true,
    data: obj
  })
} */
function getPermissionDetail (req, res) {
  var userName = req.params.user
  var obj = {}
  var userDetail
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('user').find({_id: userName}).toArray(function(err1, docs) {
        client.close()
        if (err1) {
          // console.log('check user 1')
          res.send({
            type: true,
            login: false
          })
        } else if (docs.length === 0) {
          if (userName === 'user0') {
            var userElm = dataRet.find(tgtUser => {
              return tgtUser.symbol === userName
            })
            userDetail = userElm.detail
            userDetail.forEach(elm => {
              obj[elm.id] = elm
            })
            res.send({
              type: true,
              data: obj
            })
          } else if (userName === 'user10') {
            var userElm = dataRet.find(tgtUser => {
              return tgtUser.symbol === userName
            })
            userDetail = userElm.detail
            userDetail.forEach(elm => {
              obj[elm.id] = elm
            })
            res.send({
              type: true,
              data: obj
            })
          } else if (userName === 'admin') {
            var userElm = dataRet.find(tgtUser => {
              return tgtUser.symbol === userName
            })
            userDetail = userElm.detail
            userDetail.forEach(elm => {
              obj[elm.id] = elm
            })
            res.send({
              type: true,
              data: obj
            })
          } else {
            // console.log('check user 2')
            res.send({
              type: true,
              login: false
            })
          }
        } else {
          docs.forEach(doc => {
            if (doc.hasOwnProperty('detail')) {
              userDetail = doc.detail
            } else {
              userDetail = detail
            }
          })
          userDetail.forEach(elm => {
            obj[elm.id] = elm
          })
          res.send({
            type: true,
            data: obj
          })
        }
      })
    }
  })
}
function checkUser1 (req, res) {
  var userName = req.params.userName
  var userPassword = req.params.userPassword
  var findUser = {}
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('user').find({_id: userName}).toArray(function(err1, docs) {
        client.close()
        if (err1) {
          // console.log('check user 1')
          res.send({
            type: true,
            login: false
          })
        } else if (docs.length === 0) {
          if (userName === 'user0') {
            findUser = dataRet.find(elm => {
              // console.log(elm.symbol)
              return (elm.symbol === userName) && (elm.password === userPassword)
            })
            res.send({
              type: true,
              login: true,
              data: findUser
            })
          } else if (userName === 'user10') {
            findUser = dataRet.find(elm => {
              // console.log(elm.symbol)
              return (elm.symbol === userName) && (elm.password === userPassword)
            })
            res.send({
              type: true,
              login: true,
              data: findUser
            })
          } else if (userName === 'admin') {
            findUser = dataRet.find(elm => {
              // console.log(elm.symbol)
              return (elm.symbol === userName) && (elm.password === userPassword)
            })
            res.send({
              type: true,
              login: true,
              data: findUser
            })
          } else {
            // console.log('check user 2')
            res.send({
              type: true,
              login: false
            })
          }
        } else {
          docs.forEach(doc => {
            if (doc.password === userPassword) {
              findUser = doc
            }
          })
          res.send({
            type: true,
            login: true,
            data: findUser
          })
        }
      })
    }
  })
  /*var findUser = dataRet.find(elm => {
    // console.log(elm.symbol)
    return (elm.symbol === userName) && (elm.password === userPassword)
  })
  if (findUser !== undefined) {
    // // console.log('findUser')
    // // console.log(findUser)
    res.send({
      type: true,
      login: true,
      data: findUser
    })
  } else {
    // // console.log('findUser')
    // // console.log(findUser + 'fail')
    res.send({
      type: true,
      login: false
    })
  }*/
}
function checkUser (req, res) {
  var userName = req.params.userName
  var userPassword = req.params.userPassword
  var findUser = dataRet.find(elm => {
    // console.log(elm.symbol)
    return (elm.symbol === userName) && (elm.password === userPassword)
  })
  if (findUser !== undefined) {
    // // console.log('findUser')
    // // console.log(findUser)
    res.send({
      type: true,
      login: true,
      data: findUser
    })
  } else {
    // // console.log('findUser')
    // // console.log(findUser + 'fail')
    res.send({
      type: true,
      login: false
    })
  }
}

function saveUserSettingDetail (data, socket) {
  var objKeys = Object.keys(data)
  objKeys.forEach(objKey => {
    MongoClient.connect(config.dbUrl, function(err, client) {
      if (err) {
        // 通報使用者新增錯誤
      } else {
        data[objKey].splice(0, 1)
        data[objKey].splice(0, 1)
        data[objKey].forEach(elm => {
          delete elm['pagePermissionSetting']
          delete elm['__index']
        })
        client.db(config.dbName).collection('user').updateOne({_id: objKey}, {$set: {detail: data[objKey]}}, {upsert: true})
        client.close()
      }
    })
  })
  /* objKeys.forEach(objKey => {
    var user = dataRet.find(dR => {
      return dR.symbol === objKey
    })
    if (user !== null) {
      user.detail = data[objKey]
    }
  })
  // console.log(dataRet) */
}