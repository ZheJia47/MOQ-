
module.exports = function() {
    this.getAbnormalTableMachineRecords = function(db, machineIDs, from, to, Ind, callback) {
	    // console.log('getAbnormalTableMachineRecords')
	    var toetalRecords = []
	    var i
	    //// console.log('machineIDs.length : ' +  machineIDs.length)
	    //// console.log('machineIDs : ' + machineIDs)
	    var abnormalTableReport = {}
	    var tmp = 0
	    
	    machineIDs.forEach(machineID => {
	    
		// use Abnormal.js function
	        getEachMachineAbnormalRecords (db, machineID, from, to, function(records) {
	    	    //// console.log('machineID : ' + machineID)
		
		    if ( records !== null ) {
		    	//// console.log('records[0] : ' + JSON.stringify(records[0]))
		    	var abnormalList = buildAbnormalTableData(Ind, records)

			abnormalTableReport[machineID] = abnormalList
		    }

		    tmp++
		    //// console.log('tmp : ' +  tmp)
		    if ( tmp == machineIDs.length ) {
	    		//// console.log('abnormalListReport : ' +  JSON.stringify(abnormalListReport))
	    		callback( abnormalTableReport )
		    }
		})		    
	    })
    },
    this.buildAbnormalTableData = function( Ind, machineRecords ) {
	    //// console.log('machineRecords[0] : ' + JSON.stringify(machineRecords[0]))
	    //// console.log('machineID : ' + machineID)
	    var totalMoldErr = 0
	    var totalMachineErr = 0
	    var totalArmErr= 0
	    var totalOtherErr = 0
	  
	    machineRecords.forEach(doc => {

	        //// console.log('doc.Note : ' + doc.Note)
		//var duration = doc.lastTrigTime.getTime() - doc.trigTime.getTime()
		if ( doc.note == '模具故障' ) {
		    totalMoldErr += doc.lastTrigTime.getTime() - doc.trigTime.getTime()
		}

		if ( doc.note == '成型機故障' ) {
		    totalMachineErr += doc.lastTrigTime.getTime() - doc.trigTime.getTime()
		}

		if ( doc.note == '機械手故障' ) {
		    totalArmErr += doc.lastTrigTime.getTime() - doc.trigTime.getTime()
		}

		if ( doc.note == '其它設備異常' ) {
		    totalOtherErr += doc.lastTrigTime.getTime() - doc.trigTime.getTime()
		}
	    })

	    var abnormalData = {
		totalMoldErr : totalMoldErr,
		totalMachineErr : totalMachineErr,
		totalArmErr : totalArmErr,
		totalOtherErr : totalOtherErr,
		index : Ind
	    }

	    return( abnormalData )
    }
}
