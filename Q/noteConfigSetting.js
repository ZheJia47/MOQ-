var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getNoteSelectedItem = getNoteSelectedItem
exports.writeNewNote = writeNewNote
exports.deleteNote = deleteNote

function getNoteSelectedItem (res) {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else { 
      client.db(config.dbName).collection('sysConfig').findOne({_id: 'noteInfo'}, function(err0, docs0) {
        if (err0) {
          res.send({
            type: false,
            data: 'Error occured: ' + err0
          })
          client.close()
        } else if ((docs0 === null) || (docs0 === undefined)) {
          var obj = {
            _id: "noteInfo",
            "A": "更換模具、模仁",
            "B": "模具故障",
            "C": "成型機故障",
            "D": "機械手故障",
            "E": "其它設備異常",
            "F": "品質異常停機",
            "G": "切換生產派單"
          }
          client.db(config.dbName).collection('sysConfig').insert(obj)
          client.close()
          res.send({
            type: true,
            data: obj
          })
        } else {
          res.send({
            type: true,
            data: docs0
          })
          client.close()
        }
      })
    }
  })
}

function writeNewNote (data, socket) {
  // console.log('writeNewNote')
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      socket.emit('writeNewNoteResult', false)
    } else {
      var obj = {}
      data.forEach(elm => {
        obj[elm['symbol']] = elm['definition']
      })
      client.db(config.dbName).collection('sysConfig').updateOne({_id: 'noteInfo'}, {$set: obj}, {upsert: true})
      socket.emit('writeNewNoteResult', true)
      // console.log(obj)
      client.close()
    }
  })
}
function deleteNote (data, socket) {
  // console.log('deleteNote')
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
      socket.emit('writeNewNoteResult', false)
    } else {
      var obj = {}
      data.forEach(elm => {
        obj[elm['symbol']] = elm['definition']
      })
      // client.db(config.dbName).collection('sysConfig').deleteOne({_id: 'noteInfo'})
      // client.db(config.dbName).collection('sysConfig').insertOne({_id: 'noteInfo', obj})
      client.db(config.dbName).collection('sysConfig').replaceOne({_id: 'noteInfo'}, obj, {upsert: true})
      socket.emit('writeNewNoteResult', true)
      // console.log(obj)
      client.close()
    }
  })
}