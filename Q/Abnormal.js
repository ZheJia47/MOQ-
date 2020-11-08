
module.exports = function() {
    this.getEachMachineAbnormalRecords = function(db, machineID, from, to, callback) {
	    //// console.log('getEachMachineAbnormalRecords')
	    var col = db.collection(machineID)
	    // // console.log('machineID : ' + machineID)

	    // col.find({ $and: [{orderNumber:{$exists:true,$nin:[null,""]}}, {machineStatusType: '警報'}, {machineStatusType: {$ne: '警報-通信'}}, {trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}]}).toArray(function (err, docs) {
				col.find({ $and: [{note: {$regex: '故障'}}, {machineStatusType: {$regex: '^((?!警報).)*$'}}, {trigTime: {$gte: from, $lt: to}}, {lastTrigTime: {$gte: from}}]}).toArray(function (err, docs) {
			if (err) {
		    // console.log( err )
		    //reject(err)
		} else {
		    //// console.log('docs.length : ' + docs.length)
		    if ( docs.length == 0 ) {
					callback(null)
		    } else {
			callback(docs)
		    }
		}
	    })
    },
		
    this.getAbnormalMachineRecords = function(db, machineIDs, from, to, callback) {
	    // console.log('getAbnormalMachineRecords')
	    var toetalRecords = []
	    var i
	    //// console.log('machineIDs.length : ' +  machineIDs.length)
	    var abnormalListReport = {}
	    var tmp = 0
	    
	    //for ( i = 0 ; i < machineIDs.length ; i++ ) {
	    machineIDs.forEach(machineID => {
	    
	        getEachMachineAbnormalRecords (db, machineID, from, to, function(records) {
	    	    //// console.log('machineID : ' + machineID)
		
		    if ( records !== null ) {
		    	//// console.log('records[0] : ' + JSON.stringify(records[0]))
		    	var abnormalList = buildAbnormalListData(records)

			abnormalListReport[machineID] = abnormalList
		    }

		    tmp++
		    //// console.log('tmp : ' +  tmp)
		    if ( tmp == machineIDs.length ) {
	    		//// console.log('abnormalListReport : ' +  JSON.stringify(abnormalListReport))
	    		callback( abnormalListReport )
		    }
		})		    
	    })

    },
    this.buildAbnormalListData = function( machineRecords ) {
	    //// console.log('machineRecords[0] : ' + JSON.stringify(machineRecords[0]))
	    var machineID = machineRecords[0].machineID
	    //// console.log('machineID : ' + machineID)
	    var abnormalList = []
	  
	    //// console.log('BuildUtil machineID : ' + machineID)
	    machineRecords.forEach(doc => {
	       //// console.log('doc : ' + JSON.stringify(doc))
		var duration = doc.lastTrigTime.getTime() - doc.trigTime.getTime()

		var abnormalData = {
			trigTime : doc.trigTime,
			lastTrigTime : doc.lastTrigTime,
			totalArmErr : duration,
			noteSymbol : doc.noteSymol,
			note : doc.note,
			duration: duration,
			machineStatusType: doc.machineStatusType
		}

		abnormalList.push( abnormalData ) 
	    })

	    return( abnormalList )
    }, 
    this.extend = function(obj, src) {
    	    for (var key in src) {
       	    	if (src.hasOwnProperty(key)) obj[key] = src[key];
	    }    	   
    	    return obj;
    }
}
