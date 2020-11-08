var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
require('./DefectiveTable.js')()
exports.getDefectiveTable = getDefectiveTable

function getDefectiveTable (machineIDs, from, to, ind, index, res)  {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName);

      getDefectiveTableMachineRecords (db, machineIDs, from, to, ind, index, function(defectiveTableReport) {
	  // console.log('defectiveTableReport : ' +  JSON.stringify(defectiveTableReport))

	  // temperary fill in
	  if ( defectiveTableReport.length == 0 ) {
		// console.log('data empty')
	 	var defectiveData = {
		    machineID : machineIDs[0],
		    totalMoldCount : 0,
		    totalTargetCount : 0,
		    totalWarehousing : 0,
		    totalChangeMold : 0,
		    ind : ind,
		    index : index
		}
		defectiveTableReport.push(defectiveData)
	  }

	  res.send({
	      type:true,
	      data: defectiveTableReport
    })
    client.close()
      })
    }
  })
}