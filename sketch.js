let parent;
let outputImage;
let targetImage;
function setup(){
    var canvas = createCanvas(300, 200);
    canvas.parent("canvasHolder");
    outputImage = createGraphics(width, height);
    outputImage.background(50);
    parent = document.getElementById("canvasHolder");
    var dropzone = select("#dropzone");
    dropzone.drop(gotFile);
    windowResized();
    background(10);
    $(document).ready(function () {
        bsCustomFileInput.init()
      })
}


function draw(){
    background(150);
    image(outputImage, 0, 0);
}

function gotFile(file){
    targetImage = createImg(file.data);
    targetImage.hide();
    console.log(targetImage);
    outputImage.image(targetImage,0,0,width,height);
}

function windowResized(){
    w = parent.offsetWidth;
    //BUG: without -4 canvas height starts to grow to infinity
    h = parent.offsetHeight-4;
    var newOutput = createGraphics(
        outputImage.width*w/width,
        outputImage.height*h/height
    );
    newOutput.image(outputImage,0,0,w,h);
    outputImage = newOutput;
    newOutput.remove();
    resizeCanvas(w, h, false);

}