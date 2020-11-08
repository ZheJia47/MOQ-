var moment = require('moment')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
require('./DefectiveTable.js')()
exports.getMOQAnalysis= getMOQAnalysis

function getMOQAnalysis (machineIDs, from, to, res) {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName);
      var totalProducts = []
      var orderRecords = []
      var orderReports = []

      getMachineProductRecords(db, machineIDs, from, to, function(totalProducts) {
        client.close()
	while ( totalProducts.length > 0 ) {
	  retrieveEachOrderRecords(totalProducts, function(orderRecords) {
	    var orderData = []
			    	  
	    orderData = buildMOQAnalysisData( orderRecords )

	    orderReports.push( orderData )
					     
	    if ( totalProducts.length == 0 ) {
	      //// console.log( 'in orderReport[0] : ' + JSON.stringify(orderReports[0]) )
	      return( orderReports )
	    }
	  	      	      	    	    
	   })
    }
	   if ( totalProducts.length == 0 ) {
      MongoClient.connect(config.dbUrl, function(err, client) {
        if (err) {
        } else {
          var orderList = []
          // orderReports.forEach(orderReport => {
          for (var day = 0; day < moment.duration(moment(to).diff(moment(from))).asDays(); day++) {
            // orderList.push({'派單號碼': {$eq: orderReport.orderNumber}})
            var dayStr = moment(from).add(day, 'd').format('YYMMDD')
            // orderList.push({'派單號碼': {$regex: '/' + dayStr + '*/'}})
            orderList.push({'派單號碼': new RegExp(dayStr)})
            //console.log(dayStr)
          }
          client.db('pmDB').collection('製令單明細').find({$or: orderList}).toArray(function(err1, docs1) {
            if(err1) {
              console.log('fail')
              res.send({
                type: true,
                data: orderReports
                   })
            } else {
              var orderNumberObj = {}
              var deadlineWarehousingObj = {}
              var deadline = {}
              var MOQ = {}
              var retArr = []
              docs1.forEach(doc => {
                orderNumberObj[doc['派單號碼']] = doc['派單數量']
                deadlineWarehousingObj[doc['派單號碼']] = doc['最終入庫日期']
                deadline[doc['派單號碼']] = doc['最遲完成日']
                MOQ[doc['派單號碼']] = doc['MOQ']
                var internalObj = {}
                internalObj['orderNumber'] = doc['派單號碼']
                internalObj['product'] = doc['貨品編號']
                internalObj['prodName'] = doc['品名']
                internalObj['MOQ'] = doc['MOQ']
                internalObj['targetCount'] = doc['派單數量']
                internalObj['diffMOQ'] = (doc['派單數量'] < doc['MOQ']) ? (doc['派單數量'] - doc['MOQ']) / doc['MOQ'] : 0
                internalObj['warehousing'] = doc['實際入庫量']
                internalObj['diffWarehousing'] = (doc['實際入庫量'] - doc['派單數量']) / doc['派單數量']
                internalObj['deadline'] = doc['最遲完成日']
                internalObj['deadlineWarehousing'] = doc['最終入庫日期']
                retArr.splice(retArr.length, 0, internalObj)
              })
              /* orderReports.forEach(orderReport => {
                orderReport['targetCount'] = orderNumberObj[orderReport['orderNumber']]
                orderReport['diffMOQ'] = (orderNumberObj[orderReport['orderNumber']] - orderReport['MOQ']) / orderReport['MOQ']
                orderReport['diffWarehousing'] = (orderReport['warehousing'] - orderNumberObj[orderReport['orderNumber']]) / orderNumberObj[orderReport['orderNumber']]
                orderReport['deadlineWarehousing'] = deadlineWarehousingObj[orderReport['orderNumber']]
                orderReport['deadline'] = deadline[orderReport['orderNumber']]
                // orderReport['MOQ'] = MOQ[orderReport['orderNumber']]
              }) */
              res.send({
                type: true,
                data: retArr
              })
            }
          })
        }
      })
	   }
	// } // while
      })      
    }
  })
}
function retrieveEachOrderRecords(totalProducts, callback) {
  //  // console.log('retrieveEachOrderRecords')
    var orderNumber = totalProducts[0].orderNumber
    var totalLength = totalProducts.length
    var i
    var j = 0
    var orderRecords = []
    var removeProductsIndexes = [] 
    
  //// console.log(totalProducts[0].product)
  //// console.log("totalLength : " + totalLength)
    orderRecords.push( totalProducts[0] )
    removeProductsIndexes.push( 0 );
    for ( i = 1  ; i < totalLength ; i++ ) {
      if ( totalProducts[i].orderNumber === orderNumber ) {
         orderRecords.push( totalProducts[i] )
         removeProductsIndexes.push( i );
      }
    }
  
    // remove this product from totalProducts from the back of array
    removeProductsIndexes.reverse();
    for ( i = 0 ; i < orderRecords.length ; i++ ) {
      totalProducts.splice( removeProductsIndexes[i], 1 )
    }
    
    callback( orderRecords )
  }

  function getMachineProductRecords (db, machineIDs, from, to, callback) {
    var totalRecords = []
    var i
    //var records = []
  //// console.log('machineIDs.length : ' +  machineIDs.length)
  
    var tmp = 0
  
    for ( i = 0 ; i < machineIDs.length ; i++ ) {
      //// console.log( 'i : ' + i )
  
      getEachMachineProductRecords (db, machineIDs[i], from, to, function(records) {
        tmp++
        //// console.log( 'tmp : ' + tmp )
        //// console.log('EachMachine record : ' +  records.length)
        totalRecords = totalRecords.concat(records)
        //// console.log('totleRecords : ' + totalRecords.length)
  
        if ( tmp == machineIDs.length ) {
        //// console.log( 'callback ')
    callback( totalRecords )
        }
      })
    }
  }
  function getEachMachineProductRecords (db, machineID, from, to, callback) {
    var col = db.collection(machineID)
    var records = []

    //// console.log(machineID)
    col.find({ $and : [{trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}, {machineStatusType: {$ne: '系統啟動'}}, {machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) {
      if (err) {
	// console.log( 'err' )
        reject(err)
      } else {
	var j

	for ( j = 0  ; j < docs.length ; j++ ) {
          if ((docs[j].orderNumber !== undefined) && (docs[j].orderNumber !== "") && (docs[j].orderNumber !== null)) {
	    records.push( docs[j] )
          }
        }
        //// console.log('records.length : ' + records.length)
      }
      //// console.log('records.length : ' + records.length)
      callback(records)
    })
} 