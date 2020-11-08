/* app.get('/api/getMoldPeriodMachineRecords/:machineIDs/:from/:to', function (req, res) {
  var machineIDs = req.params.machineIDs.split(",")
// console.log('getMoldPeriodMachineRecords');
//// console.log('machineIDs : ' + machineIDs)

  var subStr = firstDailyPoint.split(':')
//// console.log(moment(req.params.from).format('YYYY-MM-DD HH:mm:ss'))
//// console.log(moment(req.params.to).format('YYYY-MM-DD HH:mm:ss'))
  var from = moment(moment(req.params.from).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate()
  var to = moment(moment(req.params.to).add(parseInt(subStr[0]), 'hours').add(parseInt(subStr[1]), 'minutes').add(1,'day').format('YYYY-MM-DD HH:mm:ss')).toDate()
//// console.log([from.toString(), to.toString()])
*/
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var config = require('./index.js')
var orderReport = require('./orderReport.js')
exports.getMoldPeriodMachineRecords = getMoldPeriodMachineRecords
function getMoldPeriodMachineRecords (machineIDs, from, to, res, MoldReportFrom, MoldReportTo) {
      MongoClient.connect(config.dbUrl, function(err, client) {
        if (err) {
    // console.log('failed to connect')
          res.send({
            type: false,
            data: 'Error occured: ' + err
          })
        } else {
          var db = client.db(config.dbName);
    
          var totalMolds = [] 
          var moldRecords = []
          var moldReports = []
          orderReport.getOrderReport(from, to, function(orderReportArr) {
          getMachineMoldProductRecords (db, machineIDs, from, to, MoldReportFrom, MoldReportTo, function(totalMolds) {
            client.close()
            while ( totalMolds.length > 0 ) {
        retrieveEachMoldRecords(totalMolds, function(moldRecords) {
                var moldData = []
        
          moldData = buildMoldData( moldRecords, orderReportArr )
     
          moldReports.push( moldData )
               if ( totalMolds.length == 0 ) {
    //	      // console.log( 'in productReport[0] : ' + JSON.stringify(productReport[0]) )
            return( moldReports )
          }
          
        }) 
      }
        //// console.log( 'moldReports.length : ' + moldReports.length )
    //// console.log( 'out moldReports[0] : ' + JSON.stringify(moldReports[0]) )
             if ( totalMolds.length == 0 ) {
          //// console.log( 'send productReport' )
          res.send({
            type:true,
            data: moldReports
          })
        }
    
    
      //} // while 
          })
        })
        }
      })
    }

function getMachineMoldProductRecords (db, machineIDs, from, to, MoldReportFrom, MoldReportTo, callback) {
  var totalRecords = []
  var i
  //var records = []
//// console.log('getMachineMoldProductrecords')
//// console.log('machineIDs.length : ' +  machineIDs.length)
//// console.log('machineIDs : ' +  machineIDs)

  var tmp = 0

  for ( i = 0 ; i < machineIDs.length ; i++ ) {

    getEachMachineProductRecords (db, machineIDs[i], from, to, MoldReportFrom, MoldReportTo, function(records) {
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
function getEachMachineProductRecords (db, machineID, from, to, MoldReportFrom, MoldReportTo, callback) {
    var col = db.collection(machineID)
    var records = []
    var arr = []
    var conditionObj = {}
    // conditionObj = {trigTime: {$gte: from, $lt: to}, lastTrigTime: {$gte: from}, moldNum: {$gte: MoldReportFrom, $lte: MoldReportTo}}
    conditionObj['trigTime'] ={$gte: from, $lt: to}
    conditionObj['lastTrigTime'] = {$gte: from}
    conditionObj['machineStatusType'] = {$ne: '系統啟動', $ne: '警報-通信'}
    // console.log('MoldReportFrom: ' + MoldReportFrom)
    // console.log('MoldReportTo: ' + MoldReportTo)
    // console.log((MoldReportFrom === 'XXXX-XXXX'))
    var MM
    var MoldReportFromArr = [] // (MoldReportFrom.split('MM'))[1].split('-')
    var MoldReportToArr = [] // (MoldReportTo.split('MM'))[1].split('-')
    if (MoldReportFrom.indexOf('MM') != -1) {
      MoldReportFromArr = (MoldReportFrom.split('MM'))[1].split('-')
    } else if (MoldReportFrom.indexOf('MS') != -1) {
      MoldReportFromArr = (MoldReportFrom.split('MS'))[1].split('-')
    } else if (MoldReportFrom.indexOf('M') != -1) {
      MoldReportFromArr = (MoldReportFrom.split('M'))[1].split('-')
    } else {
      MoldReportFromArr = MoldReportFrom.split('-')
    }
    if (MoldReportTo.indexOf('MM') != -1) {
      MoldReportToArr = (MoldReportTo.split('MM'))[1].split('-')
    } else if (MoldReportTo.indexOf('MS') != -1) {
      MoldReportToArr = (MoldReportTo.split('MS'))[1].split('-')
    } else if (MoldReportTo.indexOf('M') != -1) {
      MoldReportToArr = (MoldReportTo.split('M'))[1].split('-')
    } else {
      MoldReportToArr = MoldReportTo.split('-')
    }
    /*if ((MoldReportFrom !== 'XXXX-XXXX') || (MoldReportTo !== 'XXXX-XXXX')) {
      conditionObj['moldNum'] = {}
      if (MoldReportFrom !== 'XXXX-XXXX') {
        conditionObj['moldNum']['$gte'] = MoldReportFrom
      }
      if (MoldReportTo !== 'XXXX-XXXX') {
        conditionObj['moldNum']['$lte'] = MoldReportTo
      }
    }*/
    // console.log(conditionObj)
    //// console.log(machineID)
    col.find(conditionObj).toArray(function (err, docs) {
      if (err) {
	// console.log( 'err' )
        reject(err)
      } else {
	var j

	for ( j = 0  ; j < docs.length ; j++ ) {
          if ((docs[j].orderNumber !== undefined) && (docs[j].orderNumber !== "") && (docs[j].orderNumber !== null)) {
            var str1 = []
            var str2 = []
            //// console.log(docs[j].moldNum)
            if (docs[j].moldNum.indexOf('MM') != -1) {
              str1 = docs[j].moldNum.split('MM')
              str2 = str1[1].split('-')
            } else if (docs[j].moldNum.indexOf('MS') != -1) {
              str1 = docs[j].moldNum.split('MS')
              str2 = str1[1].split('-')
            } else if (docs[j].moldNum.indexOf('M') != -1) {
              str1 = docs[j].moldNum.split('M')
              str2 = str1[1].split('-')
            } else {
              str2 = docs[j].moldNum.split('-')
            }
            /*if ( ((Number(str2[0]) >= Number(MoldReportFromArr[0])) && (Number(str2[1]) >= Number(MoldReportFromArr[1]))) || 
            ((Number(str2[0]) >= Number(MoldReportToArr[0])) && (Number(str2[1]) >= Number(MoldReportToArr[1])))) { */
              if ( (str2[0] >= MoldReportFromArr[0]) && (str2[0] <= MoldReportToArr[0])) {
                if ((str2[1] >= MoldReportFromArr[1]) && (str2[1] <= MoldReportToArr[1])) {
              records.push( docs[j] )
                }
            } else if ((MoldReportFrom === 'XXXX-XXXX') || (MoldReportTo === 'XXXX-XXXX')) {
              records.push( docs[j] )
            }
          }
        }
        //// console.log('records.length : ' + records.length)
      }
      //// console.log('records.length : ' + records.length)
      // console.log('return: ' + machineID)
      callback(records)
    })
} 
function retrieveEachMoldRecords(totalMolds, callback) {
//  // console.log('retrieveEachMoldRecords')
  var moldNum = totalMolds[0].moldNum
  var totalLength = totalMolds.length
  var i
  var j = 0
  var moldRecords = []
  var removeMoldsIndexes = [] 
  
//// console.log("totalLength : " + totalLength)
  moldRecords.push( totalMolds[0] )
  removeMoldsIndexes.push( 0 )
  for ( i = 1  ; i < totalLength ; i++ ) {
    if ( totalMolds[i].moldNum !== undefined && totalMolds[i].moldNum !== null && totalMolds[i].moldNum === moldNum ) {
      moldRecords.push( totalMolds[i] )
      removeMoldsIndexes.push( i )
    }
  }

//// console.log('removeMoldsIndexes.length : ' + removeMoldsIndexes.length)
  // remove this product from totalProducts from the back of array
  removeMoldsIndexes.reverse();
  for ( i = 0 ; i < moldRecords.length ; i++ ) {
    totalMolds.splice( removeMoldsIndexes[i], 1 )
  }
//// console.log("totalLength : " + totalMolds.length)
  
  callback( moldRecords )
}
function buildMoldData( moldRecords, buildProductData ) {

  var moldNum = moldRecords[0].moldNum
  var moldName = moldRecords[0].moldName
  var cavities
  var totalAlm = 0
  var changeMold = 0
  var duration = 0
  var moldCount = 0
  var warehousing = 0
  var standard
  var targetCount = 0
  var badNum = 0
  var minArray = []
  var min = 0
  var average = 0
  var ordernumberObj = {}

  if ( moldRecords[0].cavities === null ) {
    cavities = 0
  } else {
    cavities = moldRecords[0].cavities
  }

  if ( moldRecords[0].standard === null ) {
    standard = 0
  } else {
    standard = moldRecords[0].standard
  }

  moldRecords.forEach(doc => {
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

  var moldData = {
    moldNum: moldNum,
    moldName: moldName,
    totalAlm: totalAlm,
    changeMold: changeMold,
    cavities: cavities,
    durationStr: duration, // 排班工作時間累計
    moldCount: moldCount,
    targetCount: targetCount,
    warehousing: warehousing,
    badNum: badNum,
    badRate: badRate,
    standard: standard,
    min: min,
    average: average,
    performance: standard / average
  }
//// console.log( 'in :  productData : ' + JSON.stringify(productData) );
  return( moldData )
}
