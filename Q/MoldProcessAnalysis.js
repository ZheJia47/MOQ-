/* app.get('/api/getMoldProcessAnalysis/:machineIDs/:moldNum/:from/:to', function (req, res) {
  var machineIDs = req.params.machineIDs.split(",")
  var moldNum = req.params.moldNum
// console.log('getMoldProcessAnalysis');
// console.log('machineIDs : ' + machineIDs.toString())
// console.log('moldNum : ' + moldNum)
  var DBmoldNum = "MM".concat(moldNum)
// console.log('moldNum : ' + DBmoldNum)

  var subStr = firstDailyPoint.split(':')
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
// console.log([from.toString(), to.toString()]) */

var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
exports.getMoldProcessAnalysis = getMoldProcessAnalysis

function getMoldProcessAnalysis (machineIDs, DBmoldNum, from, to, res) {
  MongoClient.connect(config.dbUrl, function(err, client) {
    if (err) {
// console.log('failed to connect')
      res.send({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      var db = client.db(config.dbName);

      var totalMoldProducts = [] 
      var moldProductRecords = []
      var moldProductReports = []
      getMachineMoldProductAnalysisRecords (db, machineIDs, DBmoldNum, from, to, function(totalMoldProducts) {
        client.close()
      //getMachineMoldProductRecords (db, machineIDs, from, to, function(totalMolds) {
        // 為修改成跨機台不合併，原始concact合併的陣列改為物件，以key作為迴圈限制，再將value部分的陣列投入
        // 只需在最外一層增加迴圈即可
      var keyArr = Object.keys(totalMoldProducts)
      console.log('keyArr ' + keyArr.length)
      keyArr.forEach(elm => {
        totalMoldProducts[elm].sort((a, b) => {
          return a.trigTime < b.trigTime ? -1 : a.trigTime > b.trigTime ? 1 : a.lastTrigTime < b.lastTrigTime ? -1 : 1
        })
        while ( totalMoldProducts[elm].length > 0 ) {
          console.log('totalMoldProducts[elm].length ' + totalMoldProducts[elm].length)
    	    retrieveEachProductRecords (totalMoldProducts[elm], function(moldProductRecords) {
            var moldProductData = []
	          moldProductData = buildMoldProductData ( moldProductRecords )
 
	          moldProductReports.push( moldProductData )
     	      if ( totalMoldProducts[elm].length == 0 ) {
//	      // console.log( 'in productReport[0] : ' + JSON.stringify(productReport[0]) )
    	        return( moldProductReports )
	          }
          }) 
        }
      })
	  //// console.log( 'moldReports.length : ' + moldReports.length )
// console.log( 'out moldProductReports[0] : ' + JSON.stringify(moldProductReports[0]) )

     	  if ( totalMoldProducts.length == 0 ) {
	    //// console.log( 'send productReport' )
	    res.send({
	      type:true,
	      data: moldProductReports
      })
	  }
	//} // while 
      })
    }
  })
}
function getMachineMoldProductAnalysisRecords (db, machineIDs, moldNum, from, to, callback) {

//function getMachineMoldProductRecords (db, machineIDs, from, to, callback) {
  var totalRecords = []
  var i
  //var records = []
//// console.log('getMachineMoldProductrecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getEachMachineMoldProductRecords (db, machineIDs[i], moldNum, from, to, function(records) {
      tmp++
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
function getEachMachineMoldProductRecords (db, machineID, moldNum, from, to, callback) {
    var col = db.collection(machineID)
    var records = []
    // console.log(moldNum)
    var str
    if (moldNum === 'XXXX-XXXX') {
      str = [{}]
    } else {
      str = [{moldNum: moldNum}]// [{moldNum: 'MM' + (((moldNum.split('MS'))[1]).split('MM'))[0]}, {moldNum: 'MS' + (((moldNum.split('MS'))[1]).split('MM'))[0]}]
    }
    // moldCount: {$gt: 0},
    col.find({$and: [{$or: str,"orderNumber":{$exists:true,$nin:[null,""],$ne:''}, trigTime: {$gte: from, $lt: to}, lastTrigTime: {$gte: from}, machineStatusType: {$ne: '系統啟動'}, machineStatusType: {$ne: '警報-通信'}}]}).toArray(function (err, docs) { //'MM4107-0003'
      if (err) {
  // console.log( 'err' )
  // console.log( err )
  callback([])
        //reject(err)
      } else {
        // console.log(machineID + ':   ' + docs.length)
	callback(docs)
        //// console.log('docs.length : ' + docs.length)
      }
    })
} 

function retrieveEachProductRecords(totalProducts, callback) {
//  // console.log('retrieveEachProductRecords')
  var productID = totalProducts[0].orderNumber // 20200731 修改為派單號碼 totalProducts[0].product
  var totalLength = totalProducts.length
  var i
  var j = 0
  var productRecords = []
  var removeProductsIndexes = [] 
  
//// console.log(totalProducts[0].product)
//// console.log("totalLength : " + totalLength)
  productRecords.push( totalProducts[0] )
  removeProductsIndexes.push( 0 );
  /* for ( i = 1  ; i < totalLength ; i++ ) {
    if ( totalProducts[i].product !== undefined && totalProducts[i] !== null 
	    && totalProducts[i].product === productID ) {
       productRecords.push( totalProducts[i] )
       removeProductsIndexes.push( i );
    }
  } */
  // 20200731 應龍達要求修改為派單號碼
  for ( i = 1  ; i < totalLength ; i++ ) {
    if ( totalProducts[i].orderNumber !== undefined && totalProducts[i] !== null 
	    && totalProducts[i].orderNumber === productID ) {
       productRecords.push( totalProducts[i] )
       removeProductsIndexes.push( i );
    } else if (totalProducts[i].orderNumber !== undefined && totalProducts[i] !== null 
      && totalProducts[i].orderNumber !== productID
      && totalProducts[i].orderNumber !== '') {
        break
    }
  }

  // remove this product from totalProducts from the back of array
  removeProductsIndexes.reverse();
  for ( i = 0 ; i < productRecords.length ; i++ ) {
    totalProducts.splice( removeProductsIndexes[i], 1 )
  }
  
  callback( productRecords )
}
function buildMoldProductData( moldProductRecords ) {
  console.log('hk ' + moldProductRecords.length)
  var orderNumber = moldProductRecords[0].orderNumber
  var machineID = moldProductRecords[0].machineID
  var totalAlm = 0
  var product = moldProductRecords[0].product
  var startTime = moldProductRecords[0].trigTime
  var endTime = moldProductRecords[moldProductRecords.length - 1].lastTrigTime
  var duration = 0
  var cavities
  var moldCount = 0
  var warehousing = 0
  var standard
  var targetCount = 0
  var badNum = 0
  var minArray = []
  var min = 0
  var average = 0
  var changeMold = 0

  if ( moldProductRecords[0].cavities === null ) {
    cavities = 0
  } else {
    cavities = moldProductRecords[0].cavities
  }

  if ( moldProductRecords[0].standard === null ) {
    standard = 0
  } else {
    standard = moldProductRecords[0].standard
  }

  moldProductRecords.forEach(doc => {
    // if ( doc['machineStatusType'] === '警報' ) {
    if (((doc['machineStatus']) === '警報')  && (doc['machineStatus'] !== '通信失敗')) {
      totalAlm++;
    }

    if ( doc['note'] === '更換模具、模仁' ) {
      changeMold++
    }

    if ( (doc['machineStatusType'] === '全自動') || (doc['machineStatusType'] === '半自動' ) ) {
      duration += doc['lastTrigTime'] - doc['trigTime']
      moldCount += doc['moldCount']
      endTime = doc['lastTrigTime']
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

  var moldProductData = {
    orderNumber: orderNumber,
    machineID: machineID,
    totalAlm: totalAlm,
    product: product,
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
    performance: standard / Math.round(average /100) * 10,
    cavities: cavities
  }
//// console.log( 'in :  productData : ' + JSON.stringify(productData) );
  return( moldProductData )
}