// consonance.js

// A 	11 	366.562 	542.766 	658.048 	941.944 	1714.249
// C 	2 	367.588 	540.920 	660.509 	943.585 	1721.838
// H 	10 	369.844 	544.613 	662.561 	946.662 	1724.505
// J 	6 	371.280 	545.638 	664.202 	949.739 	1732.095
// L 	7 	371.485 	548.305 	666.868 	953.021 	1738.659
// N 	14 	371.281 	550.152 	667.895 	957.741 	1741.534

inlets = 1
outlets = 2 

var a = [366.562, 542.766, 658.048, 941.944, 1714.249]
var c = [367.588, 540.920, 660.509, 943.585, 1721.838]
var h = [369.844, 544.613, 662.561, 946.662, 1724.505]
var j = [371.280, 545.638, 664.202, 949.739, 1732.095]
var l = [371.485, 548.305, 666.868, 953.021, 1738.659]
var n = [371.281, 550.152, 667.895, 957.741, 1741.534]

var plates = [a, c, h, j, l, n]

function findPlateByRatio(plateA, plateB, ratio) {
	var index = plateA.plateIndex
	
	var minimumDistance = Infinity

	for (var i = 0; i < plates.length; i++) {
		if(index == i) continue
		
		for (var j = 0; j < plates[index].length; j++) {
			for (var k = 0; k < plates[i].length; k++) {
				var plateAFreq = plates[index][j]
				var plateBFreq = plates[i][k]
					
				var plateRatio = 0.0
				if (plateAFreq > plateBFreq) {
				    plateRatio = plateAFreq / plateBFreq
				} else {
					plateRatio = plateBFreq / plateAFreq
				}
					
				var distance = Math.abs(ratio - plateRatio) 
				if (distance < minimumDistance) {
					minimumDistance = distance
					
					plateA.harmonicIndex = j
					plateA.harmonicFreq = plates[index][j]
					
					plateB.harmonicIndex = k
					plateB.harmonicFreq = plates[i][k]
					plateB.plateIndex = i
				}
			}
		}
	}
	
	return plateA, plateB
}


function findPlateByHarmonicIndex(plateA, plateB, plateC, ratio) {
	var index = plateA.plateIndex
	var otherIndex = plateB.plateIndex
	var harmonicIndex = plateA.harmonicIndex

	var minimumDistance = Infinity

	for (var i = 0; i < plates.length; i++) {
		if(index == i || otherIndex == i) continue
		
		for (var k = 0; k < plates[i].length; k++) {
			var plateAFreq = plates[index][harmonicIndex]
			var plateCFreq = plates[i][k]
					
			var plateRatio = 0.0
			
			if (plateAFreq > plateCFreq) {
			    plateRatio = plateAFreq / plateCFreq
			} else {
				plateRatio = plateCFreq / plateAFreq
			}
					
			var distance = Math.abs(ratio - plateRatio) 
			if (distance < minimumDistance) {
				minimumDistance = distance
					
				plateC.harmonicIndex = k
				plateC.harmonicFreq = plates[i][k]
				plateC.plateIndex = i
			}
		}
	}
	
	return plateA, plateB, plateC
}


function findTriad(index, ratio1, ratio2) {
	var plateA = {
		harmonicIndex: null,
		harmonicFreq: null,
		plateIndex: index,
	}
	
	var plateB = {
		harmonicIndex: null,
		harmonicFreq: null,
		plateIndex: null,
	}
	
	var plateC = {
		harmonicIndex: null,
		harmonicFreq: null,
		plateIndex: null,
	}
	
	plateA, plateB = findPlateByRatio(plateA, plateB, ratio1)
	plateA, plateB, plateC = findPlateByHarmonicIndex(plateA, plateB, plateC, ratio2)
	
		
	outlet(1, [plateA.plateIndex, 
			   plateA.harmonicIndex, 
			   plateA.harmonicFreq, 
               plateB.plateIndex, 
               plateB.harmonicIndex, 
               plateB.harmonicFreq,
			   plateC.plateIndex, 
               plateC.harmonicIndex, 
               plateC.harmonicFreq])
}

function findDyad(index, ratio) {
	var plateA = {
		harmonicIndex: null,
		harmonicFreq: null,
		plateIndex: index,
	}
	
	var plateB = {
		harmonicIndex: null,
		harmonicFreq: null,
		plateIndex: null,
	}
	
	return findPlateByRatio(plateA, plateB, ratio)
}

var previousPlate = 0;
var previousHarmonic = 0;
var ratios = [2.0, 1.5, 1.25]

function bang() {
	var ratio = ratios[Math.floor(Math.random() * ratios.length)]
	post(ratio)
	
	var plateA, plateB = findDyad(previousPlate, ratio)
	
	post(plateA.plateIndex, plateB.plateIndex)
	
}