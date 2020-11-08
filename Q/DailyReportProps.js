var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getDailyReportProps = getDailyReportProps

function getDailyReportProps (machineIDs, from, to, res) {
  var retArray = []
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var idx= 0
      machineIDs.forEach(machineID => {
        /* if (machineID === '1B04') { // 20191111 add
          machineID = 'PIPI08Report'
        } else if (machineID === '1B03') { // 20191111 add
          machineID = 'PIPI98Report'
        } else if (machineID === '1B02') { // 20191111 add
          machineID = 'PIPI97Report'
        } else if (machineID === '1B01') { // 20191111 add
          machineID = 'PIPI96Report'
        } */
        client.db(config.dbName).collection('organization').find({_id: machineID}).toArray(function(err, elms) {
          elms.forEach(elm => {
            var str3 = elm.data
        var col = client.db(config.dbName).collection((machineID.indexOf('1A') > -1) ? machineID : (str3 + 'Report'))
        col.find({trigTime: {$gte: from, $lt: to}, machineStatusType: {$ne: '系統啟動'}, machineStatusType: {$ne: '警報-通信'}}).toArray(function (err1, docs1) {
          if (err1) {
            res.send({
              type: false,
              data: 'Error occured: ' + err1
            })
            client.close()
          } else {
            idx++
            docs1.forEach(doc1 => {
              if (doc1['orderNumber'] === undefined) {
                doc1['orderNumber'] = ''
              }
              retArray.splice(retArray.length, 0, doc1)
            })
            if(idx === machineIDs.length) {
              res.send({
                type: true,
                data: retArray
              })
              client.close()
            }
          }
        })
      })
    })
      })
    }
  })
}