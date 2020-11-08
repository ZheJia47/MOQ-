
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getPropertyNumber = getPropertyNumber
exports.getOrganizationStructure = getOrganizationStructure
exports.setNewOrganization = setNewOrganization
exports.deleteOrganization = deleteOrganization
exports.updateOrganization = updateOrganization
exports.getDepartObj = getDepartObj
exports.getDepartObjAll = getDepartObjAll
exports.retArr = retArr0
exports.getPropertyByMachineID = getPropertyByMachineID

function getPropertyNumber (res) {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.prodDBName)
      db.collection('成型機規格表').find({}).toArray(function (err1, docs) {
        if (err1) {
          // console.log('data not found')
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
          client.close()
        } else if (docs.length === 0) {
          res.send({
            type: false,
            data: 'data not found'
          })
          client.close()
        } else {
          var retArr = []
          retArr.splice(0, retArr.length)
          docs.forEach(doc => {
            if (doc['財產編號'] !== null) {
              retArr.splice(retArr.length, 0, doc['財產編號'])
            }
          })
          retArr.sort(function (a, b) {
            return a > b ? 1 : -1
          })
          res.send({
            type:true,
            data: retArr
          })
          client.close()
        }
      })
    }
  })
}
var retArr0 = [{
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
}] /*, {
  _id: '全局', father: 'organization1', son: ['全廠'], level: 5, levelName: '局', data: '', linked: true
}]*/
function getOrganizationStructure (res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('organization').find({}).toArray(function(err1, docs1) {
        client.close()
        if (err1) {
        } else if(docs1.length === 0) {
          initialOrganizationDocs(res)
        } else {
          res.send({
            type:true,
            data: docs1 // retArr 
          })
        }
      })
    }
  })
  /* MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName)
      db.collection('成型機規格表').find({}).toArray(function (err1, docs) {
        if (err1) {
          // console.log('data not found')
          res.send({
            type: false,
            data: 'Error occured: ' + err1
          })
        } else if (docs.length === 0) {
          res.send({
            type: false,
            data: 'data not found'
          })
        } else {
          var retArr = []
          retArr.splice(0, retArr.length)
          docs.forEach(doc => {
            if (doc['財產編號'] !== null) {
              retArr.splice(retArr.length, 0, doc['財產編號'])
            }
          })
          retArr.sort(function (a, b) {
            return a > b ? 1 : -1
          })
          res.send({
            type:true,
            data: retArr
          })
        }
      })
    }
  }) */
}
function setNewOrganization(data, socket) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('organization').insertOne(data)
      client.db(config.dbName).collection('organization').updateOne({
        _id: data.father
      }, {
        $addToSet: {son: data._id}
      }, {
        multi: true,
        upsert: true
      })
      client.close()
    }
  })
  //retArr.splice(retArr.length, 0, data)
  //// console.log('setNewOrganization')
  //// console.log(retArr)
}
function updateOrganization(data, socket) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('organization').updateOne(data[0], {$set: data[1]}, {upsert: true})
      client.db(config.dbName).collection('organization').updateOne({
        _id: data[1].father
      }, {
        $addToSet: {son: data[1]._id}
      }, {
        multi: true,
        upsert: true
      })
      client.close()
      // console.log('updateOrganization')
    }
  })
}
function deleteOrganization(data, socket) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('organization').remove({_id: data.test})
      if (data.hasOwnProperty('father')) {
        client.db(config.dbName).collection('organization').updateOne({
          _id: data.father
        }, {
          $pull: {son: data.test}
        }, {
          multi: true,
          upsert: true
        })
      }
      client.close()
    }
  })
  /*retArr.forEach(function (ret, idx, arr) {
    if (data.test === ret._id) {
      arr.splice(idx, 1)
      // console.log('242424257777777')
      // console.log(ret)
    }
  })
  // console.log('deleteOrganization')
  // console.log(retArr)
  // console.log('data')
  // console.log(data)*/
}
function getDepartObj (res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('organization').find({}).toArray(function(err1, docs1) {
        client.close()
        if (err1) {
          res.send({
            type:false,
            data: 'Error occured: ' + err1
          })
        } else if(docs1.length === 0) {
          // initialOrganizationDocs(res)
          res.send({
            type:true,
            data: [] // retArr 
          })
        } else {
          var arr = []
          arr = docs1.filter(elm => {
            return elm.level > 1
          })
          res.send({
            type:true,
            data: arr
          })
        }
      })
    }
  })
  /* var arr = []
  arr = retArr.filter(elm => {
    return elm.level > 1
  })
  res.send({
    type:true,
    data: arr
  }) */
}
function getDepartObjAll (res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('organization').find({}).toArray(function(err1, docs1) {
        client.close()
        if (err1) {
          res.send({
            type:false,
            data: 'Error occured: ' + err1
          })
        } else if(docs1.length === 0) {
          res.send({
            type:true,
            data: [] // retArr 
          })
        } else {
          res.send({
            type:true,
            data: docs1 // retArr 
          })
        }
      })
    }
  })
}
function initialOrganizationDocs(res) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      client.db(config.dbName).collection('organization').insertMany(retArr0)
      client.close()
      res.send({
        type:true,
        data: retArr0
      })
    }
  })
}

function getPropertyByMachineID (machineID, callback) {
  MongoClient.connect(config.dbUrl, function(err, client){
    if (err) {
      return callback([])
    } else {
      client.db(config.dbName).collection('organization').find({'_id': machineID}).toArray(function(err1, docs1) {
        client.close()
        if (err1) {
          callback([])
        } else if(docs1.length === 0) {
          callback([])
        } else {
          callback([docs1[0].data])
        }
      })
    }
  })
}