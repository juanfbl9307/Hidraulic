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
    var pipe = new Pipe(diameter, material);
    var heightLoss = Math.pow(((flowRate / 1000) / (0.2785 * pipe.material * (Math.pow(pipe.diameter / 1000, 2.63)))), (1 / 0.54));
    return parseFloat(heightLoss.toFixed(4));
}
//Function of veolcity (m/s)
function velocity(flowRate, diameter, material) {
    var pipe = new Pipe(diameter, material);
    var velocity = (flowRate / 1000) / ((Math.PI * Math.pow(pipe.diameter / 1000, 2)) / 4);
    return parseFloat(velocity.toFixed(3));
}

//Function of height loss for the lenght of the pipe (m)
function lossByFriction(heightLoss, totalL) {
    var lossByFriction = heightLoss * totalL;
    return parseFloat(lossByFriction.toFixed(3));
}
//Function of the sumary of heights (m)
function totalHeight(staticHeight, criticHeight) {
    var totalHeight = staticHeight + criticHeight;
    return totalHeight;
}
//Function of the pump power in HP
function pumpPower(flowRate, totalHeight, efficiency) {
    var pump = new Pump(efficiency / 100);
    var pumpPower = (flowRate * totalHeight) / (75 * (pump.n));
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
    var diameterArray = diameterList();

    //Condition of velocity checked
    if (checkVelocity) {
        var min = document.getElementById("minVelocity").value;
        var max = document.getElementById("maxVelocity").value;
        min = parseFloat(min);
        max = parseFloat(max);
        var velMin = max;
        var diameter = 0;

        for (let i = 0; i < diameterArray.length; i++) {
            diameterAux = diameterArray[i];
            materialAux = material;
            velocityAux = velocity(flowRate, diameterAux, materialAux);
            if (velocityAux < max && velocityAux > min && velocityAux < velMin) {
                velMin = velocityAux;
                diameter = diameterAux;
            }
        }
        graphGradient(min, max, velMin, diameter);
        

        result.innerHTML += "Minimun diameter = " + diameter + " (mm)<br/>"
    }

    //Condition of maximun height loss
    if (checkLoss) {
        var max = document.getElementById("heightlLossNumber").value;
        max = parseFloat(max);
        var heightLossMin = max;
        var diameter = 0;

        for (let i = 0; i < diameterArray.length; i++) {
            diameterAux = diameterArray[i];
            materialAux = material;
            heighLossAux = heightLossed(flowRate, diameterAux, materialAux);
            if (heighLossAux < max) {
                heightLossMin = heighLossAux;
                diameter = diameterAux;
            }
        }
        result.innerHTML += "Minimun diameter = " + diameter + " (mm) milimiters<br/>"
    }

    var heightLossed = heightLoss(flowRate, diameter, material);
    var totalLenght = criticLenght * (1 + (equivalentLenght / 100));
    var totalH = parseFloat((lossByFriction(heightLossed, totalLenght) + totalHeight(staticHeight, criticHeight)).toFixed(3));

    //Output of the result, changing the inner HTML of the id = result
    result.innerHTML += "Height loss = " + heightLossed + " (m/m) meters/meters<br/>"
        + "Velocity = " + velocity(flowRate, diameter, material) + " (m/s)<br/>"
        + "Total loss = " + lossByFriction(heightLossed, totalLenght) + " (m) meters <br/>"
        + "Total height = " + totalH + " (m) meters <br/>"
        + "Pump power = " + pumpPower(flowRate, totalH, efficiency) + " (HP) Horse Power";

}

//Function to switch the values of diameter by the material
function changeDiameters(material, diameter) {
    var material = document.getElementById("materials").value;
    var diameter = document.getElementById("diameters");
    var diameterArray = [];
    diameter.innerHTML = "";

    //Catalog of diameters in different materials
    switch (material) {
        case (pipes[0].roughness):
            diameterArray = pipes[0].diameters;
            break;
        case (pipes[1].roughness):
            diameterArray = pipes[1].diameters;
            break;
        case (pipes[2].roughness):
            diameterArray = pipes[2].diameters;
            break;
    }

    for (var option in diameterArray) {
        var newOption = document.createElement("option");
        newOption.value = diameterArray[option];
        newOption.innerHTML = diameterArray[option];
        diameter.options.add(newOption);
    }

    return diameterArray;
}
//Adding the diameters to arraylist
function diameterList() {
    var material = document.getElementById("materials");
    var diameterArray = [];

    //Catalog of diameters in different materials
    switch (material.value) {
        case (pipes[0].roughness):
            diameterArray = pipes[0].diameters;
            break;
        case (pipes[1].roughness):
            diameterArray = pipes[1].diameters;
            break;
        case (pipes[2].roughness):
            diameterArray = pipes[2].diameters;
            break;
    }
    return diameterArray;
}
//Function to disable chekboxes
function ckChange(el) {
    var ckName = document.getElementsByName(el.name);
    for (var i = 0, c; c = ckName[i]; i++) {
        c.disabled = !(!el.checked || c === el);
    }
}

pipes = [
    {
        "material": "pvc",
        "roughness": "150",
        "diameters": [" ", "15.7", "20.9", "26.6", "35", "40.9", "52.5", "62.7", "77.9", "102.3"]
    },
    {
        "material": "ironcast",
        "roughness": "140",
        "diameters": [" ", "58.4", "83.8", "109", "135", "160", "52.5", "213", "267"]
    },
    {
        "material": "concrete",
        "roughness": "130",
        "diameters": [" ", "225", "300", "375", "450", "525", "600", "750"]
    }
]


//General variables
var result = document.getElementById("result");
var button = document.getElementById("calculate");
var material = document.getElementById("materials");
var checkLoss = document.getElementById("heightLoss");
var checkVelocity = document.getElementById("velocity");
//Button to get results of calculates
button.addEventListener("click", getResults);

function graphGradient(vmin, vmax, vel, diameter) {
    canvas = document.getElementById("graphic");
    //text in canvas
    text = canvas.getContext("2d");
    text.font = "15px Arial";
    text.fillText("Vmin", 0, 120);
    text.fillText("Vmax", 260, 120);
    var xDistance = 300 * (((vmax - vmin) / (vel - vmin))/100)
    text.fillText(diameter, (xDistance)-10, 30);
    //lines in canvas
    lines = canvas.getContext("2d");
    lines.beginPath();
    lines.moveTo(xDistance, 40);
    lines.lineTo(xDistance, 130);
    lines.stroke();
    ///Graphic of gradient
    graphic = canvas.getContext("2d");
    gradient = graphic.createLinearGradient(0, 0, 300, 0);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "red");
    graphic.fillStyle = gradient;
    graphic.fillRect(0, 50, 300, 50);
}

















