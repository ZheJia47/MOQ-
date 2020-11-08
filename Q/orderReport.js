var MongoClient = require("mongodb").MongoClient
var config = require('./index.js')
var moment = require('moment')
exports.getOrderReportPromise = getOrderReportPromise
exports.getOrderReport = getOrderReport

function getOrderReportPromise(from, to) {
  return new Promise((resolve, reject) => {
    var records = []
    var reportDateStr = []

    MongoClient.connect(config.dbUrl, function (err0, client) {
      if (err0) {
        res.send({
          type: false,
          data: sendBack
        })
      } else {
        var dd = moment.duration(moment(to).diff(moment(from))).asDays()
        for(var idx = 0; idx < dd; idx++) {
          reportDateStr.push({'回報日期': {$eq: moment(from).subtract(1, 'd').add(idx, 'd').format('YYYYMMDD')}})
        }
        //console.log('旗標')
        //console.log(reportDateStr)
        client.db('pmDB').collection('製令回報').find({ $or: reportDateStr}).toArray(function (err, docs) {
          client.close()
          if (err) {
            reject(err)
          } else {
            resolve(docs)
          }
        })
      }
    })
  })
}

function getOrderReport(from, to, callback) {
    var records = []
    var reportDateStr = []

    MongoClient.connect(config.dbUrl, function (err0, client) {
      if (err0) {
        res.send({
          type: false,
          data: sendBack
        })
      } else {
        var dd = moment.duration(moment(to).diff(moment(from))).asDays()
        for(var idx = 0; idx < dd; idx++) {
          reportDateStr.push({'回報日期': {$eq: moment(from).subtract(1, 'd').add(idx, 'd').format('YYYYMMDD')}})
        }
        //console.log('旗標')
        //console.log(reportDateStr)
        client.db('pmDB').collection('製令回報').find({ $or: reportDateStr}).toArray(function (err, docs) {
          client.close()
          if (err) {
            callback([])
          } else {
            callback(docs)
          }
        })
      }
    })
}