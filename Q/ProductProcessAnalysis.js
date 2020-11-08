var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getProductProcessAnalysis = getProductProcessAnalysis

function getProductProcessAnalysis (machineIDs, product, from, to, res) {
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

      getMachineProductAnalysisRecords (db, machineIDs, product, from, to, function(totalProducts) {
        client.close()
        // 為修改成跨機台不合併，原始concact合併的陣列改為物件，以key作為迴圈限制，再將value部分的陣列投入
        // 只需在最外一層增加迴圈即可
      var keyArr = Object.keys(totalProducts)
      keyArr.forEach(elm => {
        while ( totalProducts[elm].length > 0 ) {
          totalMoldProducts[elm].sort((a, b) => {
            return a.trigTime < b.trigTime ? -1 : a.trigTime > b.trigTime ? 1 : a.lastTrigTime < b.lastTrigTime ? -1 : 1
          })
          retrieveEachOrderRecords (totalProducts[elm], function(orderRecords) {
                var orderData = []
	  
	          orderData = buildProductAnalysisData ( orderRecords )
 
	          orderReports.push( orderData )
            if ( totalProducts[elm].length == 0 ) {
//	          // console.log( 'in productReport[0] : ' + JSON.stringify(productReport[0]) )
	            return( orderReports )
	          }
	        })	    
        }
      })

	    //// console.log( 'Reports.length : ' + Reports.length )
//// console.log( 'out orderReports[0] : ' + JSON.stringify(orderReports[0]) )

     	    if ( totalProducts.length == 0 ) {
	      //// console.log( 'send productReport' )
	      res.send({
	        type:true,
          data: orderReports
        })
	    }
	//} // while 

      })
    }
  })
}
function getMachineProductAnalysisRecords (db, machineIDs, product, from, to, callback) {
  var totalRecords = []
  var i
//// console.log('getMachineProductAnalysisRecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getProductOrderEachMachineRecords (db, machineIDs[i], product, from, to, function(records) {
      tmp++
      //// console.log( 'tmp : ' + tmp )
      if ( records.length > 0 ) {
        //// console.log('EachMachine record : ' +  records.length)
        // totalRecords = totalRecords.concat(records)
        totalRecords[records[0].machineID] = records
      	//// console.log('totleRecords : ' + totalRecords.length)
      }

      if ( tmp == machineIDs.length ) {
    	//// console.log( 'callback ')
	callback( totalRecords )
      }
    })
  }
}
function getProductOrderEachMachineRecords (db, machineID, product, from, to, callback) {
    var col = db.collection(machineID)
    var records = []
    var productCond
    if (product === 'XXXX-XXXX') {
      productCond = [{}]
    } else {
      productCond = [{product: product}]
    }
//// console.log('getEachMachineMoldProductrecords')
//    // console.log(machineID)
    col.find({$and: [{$or: productCond, "orderNumber":{$exists:true,$nin:[null,""],$ne:''}, trigTime: {$gte: from, $lt: to}, lastTrigTime: {$gte: from}}, {machineStatusType: {$ne: '系統啟動'}}, {machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) {
      if (err) {
	// console.log( err )
        //reject(err)
      } else {
        //// console.log('docs.length : ' + docs.length)
	callback(docs)
      }
    })
}
function buildProductAnalysisData( orderRecords ) {
  var orderNumber = orderRecords[0].orderNumber
  var moldNum = orderRecords[0].moldNum
  var machineID = orderRecords[0].machineID
  var totalAlm = 0
  var cavities
  var startTime = orderRecords[0].trigTime
  var endTime = orderRecords[orderRecords.length - 1].lastTrigTime
  var duration = 0
  var moldCount = 0
  var targetCount = 0
  var warehousing = 0
  var badNum = 0
  var badRate = 0
  var standard
  var minArray = []
  var min = 0
  var average = 0
  var changeMold = 0
  if ( orderRecords[0].cavities === null ) {
    cavities = 0
  } else {
    cavities = orderRecords[0].cavities
  }

  if ( orderRecords[0].standard === null ) {
    standard = 0
  } else {
    standard = orderRecords[0].standard
  }

  orderRecords.forEach(doc => {
    if (( doc['machineStatus'] === '警報' )  && (doc['machineStatus'] !== '通信失敗')) {
      totalAlm++;
    }

    if ( doc['note'] === '更換模具、模仁' ) {
      changeMold++
    }

    if ( (doc['machineStatusType'] === '全自動') || (doc['machineStatusType'] === '半自動' ) ) {
      duration += doc['lastTrigTime'] - doc['trigTime']
      moldCount += doc['moldCount']
    }

    warehousing += doc['warehousing']  

    if ( doc['min'] !== undefined && doc['min'] !== null && doc['min'] != 0 ) {
      minArray.push( doc['min'] )
    }
  })

  if ( minArray.length > 0 ) {
    min = Math.min( ...minArray )
    //// console.log('min : ' + min)
  }  
  else {
    min = 0
  }

  targetCount = moldCount * cavities
  badNum = targetCount - warehousing

  if ( targetCount == 0 ) {
    badRate = 0
  } else {
    badRate = badNum / targetCount
  }

  average = duration / moldCount

  var orderData = {
    orderNumber : orderNumber,
    moldNum : moldNum,
    machineID: machineID,
    totalAlm: totalAlm,
    cavities: cavities,
    startTime: startTime,
    endTime: endTime,
    duration: duration, // new Date(duration * 1000).toISOString().substr(11, 8),
    moldCount: moldCount,
    targetCount: targetCount,
    warehousing: warehousing,
    badNum: badNum,
    badRate: badRate,
    standard: standard,
    min: min,
    average: average,
    performance: standard / Math.round(average /100) * 10 
  }
//// console.log( 'in :  productData : ' + JSON.stringify(productData) );
  return( orderData )
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
      if ( totalProducts[i].orderNumber !== undefined && totalProducts[i] !== null 
        && totalProducts[i].orderNumber === orderNumber ) {
         orderRecords.push( totalProducts[i] )
         removeProductsIndexes.push( i );
      } else if ( totalProducts[i].orderNumber !== undefined && totalProducts[i] !== null 
        && totalProducts[i].orderNumber !== orderNumber 
        && totalProducts[i].orderNumber !== '') {
        break
     }
    }
  
    // remove this product from totalProducts from the back of array
    removeProductsIndexes.reverse();
    for ( i = 0 ; i < orderRecords.length ; i++ ) {
      totalProducts.splice( removeProductsIndexes[i], 1 )
    }
    
    callback( orderRecords )
  }