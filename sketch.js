let parent;
let outputImage;
let targetGraphics;
var targetImage;
let ready = false;
let algo;

function preload() {

}

function setup() {
    var canvas = createCanvas(300, 200);
    canvas.parent("canvasHolder");
    outputImage = createGraphics(width, height);
    outputImage.background(150);
    parent = document.getElementById("canvasHolder");
    var dropzone = select("#dropzone");
    dropzone.drop(gotFile);
    // windowResized();
    background(10);
    $(document).ready(function () {
        bsCustomFileInput.init()
    })
}


function draw() {
    if (ready) {
        image(targetImage, 0, 0, width / 2, height);
        algo.calculateNextGeneration();
        image(algo.showOutputImage(), width / 2, 0, width / 2, height);
        text(algo.generationCounter, 20, 70);
        text(frameRate(),20,100);
    }

}

function gotFile(file) {
    loadImage(file.data, tempImg => {
        targetImage = createGraphics(tempImg.width, tempImg.height);
        targetImage.image(tempImg, 0, 0);
        algo = new HCAlgorithm(targetImage);
        algo.applySettings(coordinateSystems.CARTESIAN,null,null);
        ready = true;
    })

}

function windowResized() {
    // w = parent.offsetWidth;
    // //BUG: without -4 canvas height starts to grow to infinity
    // h = parent.offsetHeight-4;
    // var newOutput = createGraphics(
    //     outputImage.width*w/width,
    //     outputImage.height*h/height
    // );
    // newOutput.image(outputImage,0,0,w,h);
    // outputImage = newOutput;
    // newOutput.remove();
    // resizeCanvas(w, h, false);

}