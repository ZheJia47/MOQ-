
module.exports = function() {
    this.getEachMachineOrderRecords = function(db, machineID, from, to, callback) {
	    var col = db.collection(machineID)
	    var records = []

		console.log('getEachMachineOrderRecords')
		//console.log(machineID)
		//console.log([from.toString(), to.toString()])
	    col.find({orderNumber:{$exists:true,$nin:[null,""]}},{trigTime: {$gte: from, $lt: to}, lastTrigTime: {$gte: from}}).toArray(function (err, docs) {
		if (err) {
		    console.log( 'err' )
		    reject(err)
		} else {
		    //console.log('docs.length : ' + docs.length)
		    callback(docs)
		}
	    })    
    },
    this.getDefectiveTableMachineRecords = function(db, machineIDs, from, to, Ind, Index, callback) {
	    //console.log('getDefectiveTableMachineRecords')
	    var toetalRecords = []
	    //
	    //console.log('machineIDs.length : ' +  machineIDs.length)
	    //console.log('machineIDs : ' + machineIDs)
	    var defectiveTableReport = []
	    var tmp = 0
	    
	    machineIDs.forEach(machineID => {
	    
		// use Abnormal.js function
	        getEachMachineOrderRecords (db, machineID, from, to, function(records) {
	    	    //console.log('machineID : ' + machineID)
		
		    if ( records !== null ) {
		    	//console.log('records[0] : ' + JSON.stringify(records[0]))
		    	var defectiveData = buildDefectiveTable(machineID, Ind, Index, records)

			defectiveTableReport.push( defectiveData )
		    }

		    tmp++
		    //console.log('tmp : ' +  tmp)
		    if ( tmp == machineIDs.length ) {
	    		//console.log('abnormalListReport : ' +  JSON.stringify(abnormalListReport))
	    		callback( defectiveTableReport )
		    }
		})		    
	    })
    },
    this.buildDefectiveTable = function( machineID, ind, index, machineRecords ) {
	    //console.log('machineRecords[0] : ' + JSON.stringify(machineRecords[0]))
	    var totalMoldCount = 0
	    var cavities = 0
	    var totalTargetCount = 0
	    var totalWarehousing= 0
	    var totalChangeMold = 0
	  
	    machineRecords.forEach(doc => {

	        //console.log('doc.Note : ' + doc.Note)
		//var duration = doc.lastTrigTime.getTime() - doc.trigTime.getTime()
		    /*
		if ( doc.machineStatusType == '全自動' || doc.machineStatusType == '半自動' ) {
		    totalMoldCount += doc.moldCount
		    totalWarehousing += doc.warehousing
		} 
		    */

	    	if ( doc['cavities'] === null ) {
		    cavities = 0
		} else {
				cavities = doc[cavities] || 0
				console.log('cavities: ' + cavities)
	    	}

		if ( doc['machineStatusType'] === '全自動' || doc['machineStatusType'] === '半自動' ) {
		    totalMoldCount += doc['moldCount']
		    totalWarehousing += doc['warehousing']
		    totalTargetCount += (doc['moldCount'] * cavities)
		} 

		//if ( doc.note == '警報' ) {
		if ( doc['note'] === '警報' ) {
		    totalChangeMold++
		}
	    })

	    var defectiveData = {
		machineID : machineID,
		totalMoldCount : totalMoldCount,
		totalTargetCount : totalTargetCount,
		totalWarehousing : totalWarehousing,
		totalChangeMold : totalChangeMold,
		ind : ind,
		index : index
	    }

	    return( defectiveData)
    },
    this.getDetectiveTableDataMachineRecords = function(db, machineIDs, from, to, Index, callback) {
	    console.log('getDetectiveTableDataMachineRecords')
	    var toetalRecords = []
	    //
	    //console.log('machineIDs.length : ' +  machineIDs.length)
	    //console.log('machineIDs : ' + machineIDs)
	    var detectiveTableDataReport = {}
		var tmp = 0
	    machineIDs.forEach(machineID => {
	    
		// use Abnormal.js function
	        getEachMachineOrderRecords (db, machineID, from, to, function(records) {
	    	    //console.log('machineID : ' + machineID)
		    //console.log('records.length : ' + records.length)
		
		    if ( records !== null ) {
		    	//console.log('records[0] : ' + JSON.stringify(records[0]))
		    	var detectiveData = buildDetectiveDataTable(machineID, Index, records)
	    		//console.log('out detectiveData : ' + JSON.stringify(detectiveData))

			detectiveTableDataReport[machineID] = detectiveData
		    }

		    tmp++
		    //console.log('tmp : ' +  tmp)
		    if ( tmp == machineIDs.length ) {
	    		//console.log('detectivetableDataReport : ' +  JSON.stringify(detectiveTableDataReport))
	    		callback( detectiveTableDataReport )
		    }
		})		    
	    })
    },
    this.buildDetectiveDataTable = function( machineID, index, machineRecords ) {
	    //console.log('machineRecords[0] : ' + JSON.stringify(machineRecords[0]))
	    var arm = 0
	    var machine = 0
	    var change = 0
	    var moldCount = 0
	    var cavities = 0
	    var targetCount = 0
	    var warehousing= 0
		// console.log('I am LLK')
		var t = machineRecords.reduce(function (acc, machineSingleID, currIndex, arr) {
			/* if (machineSingleID.hasOwnProperty('note')) {
				console.log(machineSingleID)			
			} */
			if (machineSingleID.note === '成型機故障') {
				//console.log('YYYYYYYY' + acc)	
				return acc + 1
			} else {
				return acc
			}
		}, 0)

		// console.log('成型機故障 === ' + t)

	    machineRecords.forEach(doc => {

	        //console.log('doc.Note : ' + doc.Note)
		//var duration = doc.lastTrigTime.getTime() - doc.trigTime.getTime()
	    	if ( doc['cavities'] === null || doc[cavities] === undefined ) {
		    cavities = 0
		} else {
	            cavities = doc[cavities]
	    	}

		//if ( doc.note == '警報' ) {
		if ( doc['note'] === '機械手故障' ) {
		    arm++
		}

		if ( doc['note'] === '成型機故障' ) {
		    machine++
		}

		if ( doc['note'] === '更換模具、模仁' ) {
		    change++
		}

		if ( doc['machineStatusType'] === '全自動' || doc['machineStatusType'] === '半自動' ) {
		    moldCount += doc['moldCount']
		    warehousing += doc['warehousing']
		    targetCount += doc['moldCount'] * cavities
		} 
	    })

		// console.log( machineID + ':' + machine)
	    //console.log( 'targetCount  ' + targetCount )
	    var detectiveData = {
		arm : arm,
		machine : machine,
		change : change,
		moldCount : moldCount,
		targetCount : targetCount,
		warehousing : warehousing,
		index : index,
		badNum : 0,
		badRate : 0
	    }
	    //console.log('in detectiveData : ' + JSON.stringify(detectiveData))

	    return( detectiveData)
    },
    this.buildMOQAnalysisData = function( machineRecords ) {
	    //console.log('machineRecords[0] : ' + JSON.stringify(machineRecords[0]))
	    var orderNumber = machineRecords[0].orderNumber
	    var createDate = machineRecords[0].createDate
	    var product = machineRecords[0].product
	    var prodName = machineRecords[0].prodName
	    var MOQ = machineRecords[0].MOQ
	    var targetCount = 0
	    var cavities
	    var warehousing= 0
	    var deadline = machineRecords[0].deadline
	    var deadlineWarehousing = machineRecords[0].deadlineWarehousing
	  
	    machineRecords.forEach(doc => {

	        //console.log('doc.Note : ' + doc.Note)
		//var duration = doc.lastTrigTime.getTime() - doc.trigTime.getTime()
	    	if ( doc['cavities'] === null || doc[cavities] === undefined ) {
		    cavities = 0
		} else {
	            cavities += doc[cavities]
	    	}

		if ( doc['machineStatusType'] == '全自動' || doc['machineStatusType'] == '半自動' ) {
		    warehousing += doc['warehousing']
		    targetCount += doc['moldCount'] * cavities
		} 
	    })

	    var MOQAnalysisData = {
		createDate : createDate,
		orderNumber : orderNumber,
		product : product,
		prodName : prodName,
		MOQ : MOQ,
		targetCount : targetCount,
		diffMOQ : (targetCount - MOQ) / MOQ,
		warehousing : warehousing,
		diffWarehousing : (warehousing - targetCount) / targetCount,
		deadline : deadline,
		deadlineWarehousing : deadlineWarehousing,
		badRate : 0
	    }

	    return( MOQAnalysisData )
    }
}
