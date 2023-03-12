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

var previousPlates = [
  { 
    plateIndex: 0,
    harmonicIndex: null,
    harmonicFreq: null
  },
  {
  	plateIndex: 1,
    harmonicIndex: null,
    harmonicFreq: null
  },
  {
  	plateIndex: 2,
    harmonicIndex: null,
    harmonicFreq: null
  }
]

var ratios = [1.5, 1.333, 1.25]


function findNextHarmonic(ratio) {
		
	var previousPlateIndex = previousPlates[0].plateIndex
		
	var newPlate = {
		plateIndex: null,
		harmonicIndex: null,
		freq: null
	}	
	
	var minimumDistance = Infinity
	
	for (var i = 0; i < plates.length; i++) {
		if(i == previousPlates[0].plateIndex || i == previousPlates[1].plateIndex) continue
		for (var j = 0; j < plates[previousPlateIndex].length; j++) {
			for (var k = 0; k < plates[i].length; k++) {
				var plateAFreq = plates[previousPlateIndex][j]
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
					
					newPlate.plateIndex = i
					newPlate.harmonicIndex = k
					newPlate.harmonicFreq = plates[i][k]
				}
			}
		}
	}

	return newPlate
}

function removeElement(array, index) {
	var newArray = []
	
	for (var i = 0; i < array.length; i++) {
		if (i == index) continue
		newArray.push(array[i])
	}

	return newArray	
}


function neighborPlates() {
	var unusedPlateIndices = []
	
	var i1 = previousPlates[0].plateIndex
	var h1 = previousPlates[0].harmonicIndex
	var i2 = previousPlates[1].plateIndex
	var h2 = previousPlates[1].harmonicIndex
	var i3 = previousPlates[2].plateIndex
	var h3 = previousPlates[2].harmonicIndex

	
	var plateIndices = [i1, i2, i3]
		
	for (var i = 0; i < plates.length; i++) {
		if (i == i1 || i == i2 || i == i3) continue
		unusedPlateIndices.push(i)
	}
		
	var minDistance = Infinity
	var neighbor1 = null
	for (var i = 0; i < unusedPlateIndices.length; i++) {
		var distance = Math.abs(unusedPlateIndices[i] - i1)
		
		if (distance < minDistance) {
			minDistance = distance
			neighbor1 = unusedPlateIndices[i]	
		}
	}
	
	var index = unusedPlateIndices.indexOf(neighbor1)
	unusedPlateIndices = removeElement(unusedPlateIndices, index)
	
	minDistance = Infinity
	var neighbor2 = null		
	for (var i = 0; i < unusedPlateIndices.length; i++) {
		var distance = Math.abs(unusedPlateIndices[i] - i2)
		
		if (distance < minDistance) {
			minDistance = distance
			neighbor2 = unusedPlateIndices[i]	
		}
	}
	
	var index = unusedPlateIndices.indexOf(neighbor2)
	unusedPlateIndices = removeElement(unusedPlateIndices, index)
		
	var neighbor3 = unusedPlateIndices[0]
	
	outlet(1, neighbor1, h1, neighbor2, h2, neighbor3, h3)	
}


function bang() {
	var ratio = ratios[Math.floor(Math.random() * ratios.length)]
	
	var newPlate = findNextHarmonic(ratio)
	
	previousPlates[2] = previousPlates[1]
	previousPlates[1] = previousPlates[0]
	previousPlates[0] = newPlate
	
	neighborPlates()
	
	outlet(0, newPlate.plateIndex, newPlate.harmonicIndex)
}