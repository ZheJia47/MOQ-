var config = require('./index.js')

module.exports = function() {
    this.retrieveEachMachineRecords = function(totalMachines, machineID, callback) {
					 //// console.log('retrieveEachMachinesRecords')
					 if (totalMachines.length === 0) {
						callback([], machineID)
						 return
					 }
      	   totalMachines[0]['machineID'] = machineID // var machineID = totalMachines[0].machineID
      	   var totalLength = totalMachines.length
      	   var i
      	   var machineRecords = []
      	   var removeMachineIndexes = [] 
  
	   //// console.log('totalMachines[0].machineID : ' + totalMachines[0].machineID)
	   //// console.log('totalLength : ' + totalLength)
  	   machineRecords.push( totalMachines[0] )
  	   removeMachineIndexes.push( 0 );
  	   for ( i = 1  ; i < totalLength ; i++ ) {
    	   	/* if (( totalMachines[i].machineID !== undefined && totalMachines[i] !== null 
						&& totalMachines[i].machineID === machineID )
						|| (totalMachines[i].machineID === undefined)
						|| (totalMachines[i].machineID === null)) { */
       	       	    machineRecords.push( totalMachines[i] )
       	       	    removeMachineIndexes.push( i );
	   	// }
  	   }

	   //// console.log('machineRecords.length : ' + machineRecords.length)
	   //// console.log('removeMachineIndexes.length : ' + removeMachineIndexes.length)
  	   // remove this product from totalMachines from the back of array
  	   removeMachineIndexes.reverse();
  	   for ( i = 0 ; i < machineRecords.length ; i++ ) {
    	      // totalMachines.splice( removeMachineIndexes[i], 1 )
  	   }
  
  	   callback( machineRecords, machineID )
    },
	
    this.getMachineInfoRecords = function(db, machineIDs, callback) {
	    //// console.log('getMachineInfoRecords')
	    var col = db.collection(config.machineListColName)
	  
			//// console.log( 'machineIDs : ' + machineIDs )
	    col.find({machineID: { $in: machineIDs}}).toArray(function (err, docs) {
	    	//col.find({}).toArray(function (err, doc) {
	    	//col.findOne({machineID: machineID}, function (err, doc) {
	    	if (err) {
	    	    // console.log( 'err : ' + err )
	    	    // console.log( 'doc : ' + docs )
	    	} 
	  
	    	//// console.log( 'err : ' + err )
	    	if ( docs == undefined ) {
	            // console.log( 'Can not find doc')
	    	}
	  
	    	//// console.log( 'docs : ' + JSON.stringify(docs) )
	    	//// console.log( 'docs[0].machineID : ' + docs[0].machineID )
	    	//// console.log( 'docs[docs.length-1].machineID : ' + docs[docs.length-1].machineID )
	    	callback(docs)
	    }) 
	},
    this.buildUtilizationData = function( orderRecords, machineID ) {
	    // var machineID = orderRecords[0].machineID
	    var utilization = 0
	    var changeMoldCount = 0
	    var warningCount = 0
	    var errCount = 0
	    var moldCount = 0
	  
	    //// console.log('BuildUtil machineID : ' + machineID)
	    orderRecords.forEach(doc => {
				// if ( doc['machineStatusType'] === '警報' && doc['note'] === '更換模具、模仁' ) {
	    	if (doc['note'] === '更換模具、模仁' ) {
		    changeMoldCount++
    	    	}
	  // if ( doc['machineStatusType'] === '警報' && (doc['note'] === '機械手故障' || doc['note'] === '成型機故障') ) {
    	    	if (doc['machineStatus'] === '警報') {
				warningCount++
	    	}
						if ((doc['note'] || '').indexOf('故障') > -1) {
		    // warningCount++
		    errCount += doc['lastTrigTime'] - doc['trigTime']
	    	} 
	  
	    	if ( (doc['machineStatusType'] === '全自動') || (doc['machineStatusType'] === '半自動' ) ) {
		    utilization += doc['lastTrigTime'] - doc['trigTime']
		    moldCount += doc['moldCount']
	     	}
	    })
	  
	    var orderData = {
		  machineID: machineID,
		  propertyNum: '',
		  brand: '',
		  utilization: utilization,
		  changeMoldCount: changeMoldCount,
		  warningCount: warningCount,
		  errCount: errCount,
		  moldCount: moldCount,
		  currUtil: 0,
		  pervUtil: 0,
		  diffUtil: 0
		  //duration: new Date(duration * 1000).toISOString().substr(11, 8),
	    }
		return( orderData )
	  }
}
