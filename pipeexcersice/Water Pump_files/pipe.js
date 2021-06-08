class Pipe {

    constructor(d, m) {
        this.diameter = d;
        this.material = m;
    }
}
class Pump {

    constructor(efficiency) {
        this.n = efficiency;
    }

}
//Function of heighLoss (m/m)
function heightLoss(flowRate, diameter, material) {
    var flowRate = flowRate;
    var pipeAux = new Pipe(diameter, material);
    var heightLo = Math.pow(((flowRate / 1000) / (0.2785 * pipeAux.diameter * (Math.pow(pipeAux.diameter / 1000, 2.63)))), (1 / 0.54));
    return parseFloat(heightLo.toFixed(5));
}
//Function of veolcity (m/s)
function velocity(flowRate, diameter, material) {
    var flowRate = flowRate;
    var pipeAux = new Pipe(diameter, material);
    var velocity = (flowRate / 1000) / ((Math.PI * Math.pow(pipeAux.diameter / 1000, 2)) / 4);
    return parseFloat(velocity.toFixed(5));
}

//Function of height loss for the lenght of the pipe (m)
function lossByFriction(heightL, totalL) {
    var lossByFriction = heightL * totalL;
    return parseFloat(lossByFriction.toFixed(3));
}
//Function of the sumary of heights (m)
function totalHeight(staticHeight, criticHeight) {
    var totalH = staticHeight + criticHeight;
    return totalH;
}
//Function of the pump power in HP
function pumpPower(flowRate, totalH, efficiency) {
    var pump = new Pump(efficiency);
    var pumpPower = (flowRate * totalH) / (75 * (pump.n / 100));
    return parseFloat(pumpPower.toFixed(3));
}
//Function of get all the results
function getResults() {
    result.innerHTML = "";

    //Entrance of all the values
    var material = document.getElementById("materials").value;
    var diameter = document.getElementById("diameters").value;
    var flowRate = document.getElementById("flow").value;
    var criticLenght = document.getElementById("criticLenght").value;
    var equivalentLenght = document.getElementById("equivalentLenght").value;
    var staticHeight = document.getElementById("staticHeight").value;
    var criticHeight = document.getElementById("criticHeight").value;
    var efficiency = document.getElementById("efficiency").value;
    var checkLoss = document.getElementById("heightLoss").checked;
    var checkVelocity = document.getElementById("velocity").checked;

    //Changing the values to Integers
    efficiency = parseInt(efficiency);
    staticHeight = parseInt(staticHeight);
    criticHeight = parseInt(criticHeight);
    criticLenght = parseInt(criticLenght);
    equivalentLenght = parseInt(equivalentLenght);
    material = parseInt(material);
    diameter = parseInt(diameter);
    flowRate = parseInt(flowRate);
    var diameterArray = change(material, diameter);

    //Condition of velocity checked
    if (checkVelocity) {
        var min = document.getElementById("minVelocity").value;
        var max = document.getElementById("maxVelocity").value;
        min = parseFloat(min);
        max = parseFloat(max);
        var velMin = max;
        var diameter = 0;

        for (let i = 0; i < diameterArray.length; i++) {
            diameterAux = diameterArray[i].diameter;
            materialAux = diameterArray[i].material;
            velocityAux = velocity(flowRate, diameterAux, materialAux);
            if (velocityAux < max && velocityAux > min && velocityAux < velMin) {
                velMin = velocityAux;
                diameter = diameterAux;
            }
        }
        result.innerHTML += "Minimun diameter = " + diameter + " (mm)<br/>"
    }

    //Condition of maximun height loss
    if (checkLoss) {
        var max = document.getElementById("heightlLossNumber").value;
        max = parseFloat(max);
        var heightLossMin = max;
        var diameter = 0;

        for (let i = 0; i < diameterArray.length; i++) {
            diameterAux = diameterArray[i].diameter;
            materialAux = diameterArray[i].material;
            heighLossAux = heightLoss(flowRate, diameterAux, materialAux);
            if (heighLossAux < max && heighLossAux < heightLossMin) {
                heightLossMin = heighLossAux;
                diameter = diameterAux;
            }
        }
        result.innerHTML += "Minimun diameter = " + diameter + " (mm) milimiters<br/>"
    }

    var heightL = heightLoss(flowRate, diameter, material);
    var totalL = criticLenght * (1 + (equivalentLenght / 100));
    var totalH = parseFloat((lossByFriction(heightL, totalL) + totalHeight(staticHeight, criticHeight)).toFixed(3));

    //Output of the result, changing the inner HTML of the id = result
    result.innerHTML += "Height loss = " + heightL + " (m/m) meters/meters<br/>"
        + "Velocity = " + velocity(flowRate, diameter, material) + " (m/s)<br/>"
        + "Total loss = " + lossByFriction(heightL, totalL) + " (m) meters <br/>"
        + "Total height = " + totalH + " (m) meters <br/>"
        + "Pump power = " + pumpPower(flowRate, totalH, efficiency) + " (HP) Horse Power";

}

//Function to switch the values of diameter by the material
function change(mat, diam) {
    var mat = document.getElementById("materials");
    var diam = document.getElementById("diameters");
    var diameterArray = [];
    diam.innerHTML = "";

    //Catalog of diameters in different materials
    switch (mat.value) {
        case ("150"):
            var optionArray = ["|", "15.7|15.7", "20.9|20.9", "26.6|26.6", "35|35", "40.9|40.9", "52.5|52.5", "62.7|62.7", "77.9|77.9", "102.3|102.3"];
            break;
        case ("140"):
            var optionArray = ["|", "58.4|58.4", "83.8|83.8", "109|109", "135|135", "160|160", "52.5|52.5", "213|213", "267|267"];
            break;
        case ("130"):
            var optionArray = ["|", "225|225", "300|300", "375|375", "450|450", "525|525", "600|600", "750|750"];
            break;
    }

    for (var option in optionArray) {
        var pair = optionArray[option].split("|");
        var newOption = document.createElement("option");
        newOption.value = pair[0];
        newOption.innerHTML = pair[1];
        diam.options.add(newOption);
        diameterArray.push(new Pipe(pair[0], mat.value));
    }
    return diameterArray;
}



var result = document.getElementById("result");
var button = document.getElementById("calculate");
var material = document.getElementById("materials");
var checkLoss = document.getElementById("heightLoss");
var checkVelocity = document.getElementById("velocity");

button.addEventListener("click", getResults);



function ckChange(el) {
    var ckName = document.getElementsByName(el.name);
    for (var i = 0, c; c = ckName[i]; i++) {
     c.disabled = !(!el.checked || c === el);
    }
  }








