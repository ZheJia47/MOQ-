var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getProductArr = getProductArr
exports.getMoldArr = getMoldArr

function getProductArr (res) {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: 'Error occured: ' + err0
      })
    } else {
    // var col = client.db(config.dbName).collection('productNumberList')
    var col = client.db('pmDB').collection('製令單明細')
    col.find().toArray(function (err, docs) {
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
        client.close()
      } else {
        var retArr = [] // docs.filter(doc => {
        docs.forEach(doc => {
          // if ((doc['_id']).toString().indexOf('-') !== -1) {
          if ((doc['貨品編號']).toString().indexOf('-') !== -1) {
            // return doc
            if (retArr.indexOf(doc['貨品編號']) === -1) {
              retArr.push(doc['貨品編號'])
            }
          }
        })
        retArr.sort((a, b) => {
          return a > b? 1 : -1
        })
        res.send({
          type: true,
          data: retArr
        })
      }
      client.close()
    })
  }
  })
}

function getMoldArr (res) {
  MongoClient.connect(config.dbUrl, function (err0, client) {
    if (err0) {
      res.send({
        type: false,
        data: 'Error occured: ' + err0
      })
    } else {
    var col = client.db(config.prodDBName).collection('模具明細')
    col.find().toArray(function (err, docs) {
      if (err) {
        res.send({
          type: false,
          data: 'Error occured: ' + err
        })
        client.close()
      } else {
        var moldNumArr = []
        moldNumArr.length = 0
        // console.log(docs)
        docs.forEach(doc => {
          // moldNumArr.splice(moldNumArr.length, 0, {_id: doc['模具編號']})
          if ((doc['模具編號'] || '').toString().indexOf('-') !== -1) {
            if (moldNumArr.indexOf(doc['模具編號']) === -1) {
              moldNumArr.push(doc['模具編號'])
            }
          }
        })
        moldNumArr.sort((a, b) => {
          return a > b ? 1 : -1
        })
        res.send({
          type: true,
          data: moldNumArr
        })
      }
      client.close()
    })
  }
  })
}