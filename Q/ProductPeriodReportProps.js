var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var orderReport = require('./orderReport.js')
exports.getProductPeriodMachineRecords = getProductPeriodMachineRecords
function getProductPeriodMachineRecords (machineIDs, from, to, res, ProductReportFrom, ProductReportTo) {
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
      var productRecords = []
      var productReport = []
      orderReport.getOrderReport(from, to, function(orderReportArr) {
      getMachineProductRecords(db, machineIDs, from, to, ProductReportFrom, ProductReportTo, function(totalProducts) {
        client.close()
        while ( totalProducts.length > 0 ) {
    retrieveEachProductRecords(totalProducts, function(productRecords) {
            var productData = []
    
      productData = buildProductData( productRecords, orderReportArr )
 
      productReport.push( productData )
           if ( totalProducts.length == 0 ) {
//	      // console.log( 'in productReport[0] : ' + JSON.stringify(productReport[0]) )
        return( productReport )
      }
      
    }) 
        }
//// console.log( 'out productReport[0] : ' + JSON.stringify(productReport[0]) )

         if ( totalProducts.length == 0 ) {
      // console.log( 'send productReport' )
      res.send({
        type:true,
        data: productReport
      })
    }

  //} // while 
        })
      })
    }
  })
}

function getMachineProductRecords (db, machineIDs, from, to, ProductReportFrom, ProductReportTo, callback) {
  var totalRecords = []
  var i
  //var records = []
//// console.log('machineIDs.length : ' +  machineIDs.length)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {
    //// console.log( 'i : ' + i )

    getEachMachineProductRecords (db, machineIDs[i], from, to, ProductReportFrom, ProductReportTo, function(records) {
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

function getEachMachineProductRecords (db, machineID, from, to, ProductReportFrom, ProductReportTo, callback) {
  var col = db.collection(machineID)
  var records = []
  var arr = []
  arr.splice(arr.length, 0, {trigTime: {$gte: from, $lt: to}})
  arr.splice(arr.length, 0,{lastTrigTime: {$gte: from}})
  arr.splice(arr.length, 0, {machineStatusType: {$ne: '系統啟動'}})
  arr.splice(arr.length, 0, {machineStatusType: {$ne: '警報-通信'}})
  if (ProductReportFrom !== 'XXXX-XXXX') {
    arr.splice(arr.length, 0, {product: {$gte: ProductReportFrom}})
  }
  if (ProductReportTo !== 'XXXX-XXXX') {
    arr.splice(arr.length, 0, {product: {$lte: ProductReportTo}})
  }
  // console.log('getEachMachineProductRecords')
  // console.log(arr)
  //// console.log(machineID)
  col.find({$and: arr}).toArray(function (err, docs) {
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

function retrieveEachProductRecords(totalProducts, callback) {
  //  // console.log('retrieveEachProductRecords')
    var productID = totalProducts[0].product
    var totalLength = totalProducts.length
    var i
    var j = 0
    var productRecords = []
    var removeProductsIndexes = [] 
    
  //// console.log(totalProducts[0].product)
  //// console.log("totalLength : " + totalLength)
    productRecords.push( totalProducts[0] )
    for ( i = 1  ; i < totalLength ; i++ ) {
      if ( totalProducts[i] !== undefined && totalProducts[i].product === productID ) {
         productRecords.push( totalProducts[i] )
         removeProductsIndexes[j++] = i;
      }
    }
  
    // remove this product from totalProducts from the back of array
    removeProductsIndexes.reverse();
    for ( i = 0 ; i < productRecords.length ; i++ ) {
      totalProducts.splice( removeProductsIndexes[i], 1 )
    }
    
    callback( productRecords )
  }

  function buildProductData( productRecords, buildProductData) {
  
    var product = productRecords[0].product
    var prodName = productRecords[0].prodName
    var cavities = productRecords[0].cavities
    var totalAlm = 0
    var changeMold = 0
    var duration = 0
    var moldCount = 0
    var warehousing = 0
    var standard = productRecords[0].standard
    var targetCount = 0
    var badNum = 0
    var minArray = []
    var min = 0
    var average = 0
    var warehousing = 0
    var ordernumberObj = {}
    productRecords.forEach(doc => {
      if (!ordernumberObj.hasOwnProperty(doc.orderNumber)) {
        ordernumberObj[doc.orderNumber] = 0
        buildProductData.forEach(b => {
          if (b['製令單號'] === ('MK20' + doc.orderNumber)) {
            ordernumberObj[doc.orderNumber] = b['完工報驗數'] + ordernumberObj[doc.orderNumber]
          }
        })
      }
      // if ( doc['machineStatusType'] === '警報' ) {
      if (((doc['machineStatus'] || '警報') === '警報')  && (doc['machineStatus'] !== '通信失敗')) {
        totalAlm++;
      }
  
      if ( doc['note'] === '更換模具、模仁' ) {
        changeMold++
      }
  
      if ( (doc['machineStatusType'] === '全自動') || (doc['machineStatusType'] === '半自動' ) ) {
        duration += doc['lastTrigTime'] - doc['trigTime']
        moldCount += doc['moldCount']
      }
  
      // warehousing += doc['warehousing']
      warehousing = Object.values(ordernumberObj).reduce(function (previousValue, currentValue, index, array) {
        return previousValue + currentValue  
      }, 0)
  
      if ( (doc['min'] || 0) != 0 ) {
        minArray.push( doc['min'] )
      }
      if ( minArray.length > 0 ) {
        min = Math.min( ...minArray )
      }  
    })
  
    targetCount = moldCount * cavities
    badNum = targetCount - warehousing
    average = duration / moldCount
  
    var productData = {
      product: product,
      prodName: prodName,
      totalAlm: totalAlm,
      changeMold: changeMold,
      cavities: cavities,
      durationStr: duration, // 排班工作時間累計
      moldCount: moldCount,
      targetCount: targetCount,
      warehousing: warehousing,
      badNum: badNum,
      badRate: badNum / targetCount,
      standard: standard,
      min: min,
      average: average,
      performance: standard / average
    }
  //// console.log( 'in :  productData : ' + JSON.stringify(productData) );
    return( productData )
  }