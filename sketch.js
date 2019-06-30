let parent;
let outputImage;
let targetGraphics;
var targetImage;
let ready = false;
let algo;
function preload() {
    tr = loadImage('watermelon.png');
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
    // let wm = loadImage('watermelon.png');
    // outputImage.image(outputGraphics,0,0,width,height);
    // image(outputImage,0,0);
}


function draw() {
    if(ready){
        //background(255);
        image(targetImage,0,0,width/2,height);
        algo.calculateNextGeneration();
        image(algo.showOutputImage(), width/2,0,width/2,height);
    }

}

function gotFile(file) {
    var tempImg = createImg(file.data);
    targetImage = createGraphics(tempImg.width, tempImg.height);
    targetImage.image(tempImg, 0, 0);
    tempImg.hide();
    algo = new HLAlgorithm(targetImage);
    ready = true;
    console.log(algo.calculateScoreForPixel([0,0,0,0],[10,10,10,10]));
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