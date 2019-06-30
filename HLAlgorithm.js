
var outputGraphics;
var targetImage;
var lookingForBetterScore;
class HLAlgorithm {
    constructor(tr) {
        targetImage = createGraphics(tr.width,tr.height);
        targetImage.image(tr,0,0);
        outputGraphics = createGraphics(targetImage.width, targetImage.height);
        this.clearGraphics(color(0));
        this.lastGenerationScore = Infinity;
        this.generationCounter = 0;
        console.log("created");
    }

    clearGraphics(color) {
        outputGraphics.loadPixels();
        for (let i = 0; i < outputGraphics.width; i++) {
            for (let j = 0; j < outputGraphics.height; j++) {
                outputGraphics.set(i, j, color);
            }
        }
        outputGraphics.updatePixels();
    }

    showOutputImage() {
        return outputGraphics;
    }

    calculateNextGeneration() {
        this.stepCounter = 0;
        lookingForBetterScore = true;
        while (lookingForBetterScore) {
            this.generateNextStep();
            this.stepCounter++;
            console.log("STEP: " + this.stepCounter);
        }
        this.generationCounter++;
        console.log(this.generationCounter);
    }

    generateNextStep(){
        let currentStepGraphics = createGraphics(targetImage.width,targetImage.height);
        currentStepGraphics.image(outputGraphics,0,0);
        currentStepGraphics.angleMode(RADIANS);
        currentStepGraphics.translate(currentStepGraphics.width/2, currentStepGraphics.height/2);
        let angle = random(0,2*PI);
        currentStepGraphics.rotate(angle);
        currentStepGraphics.noStroke();
        let r = currentStepGraphics.height/abs(sin(angle));
        if(abs(tan(angle)) <= currentStepGraphics.height/currentStepGraphics.width){
            r = currentStepGraphics.width/abs(cos(angle));
        }
        currentStepGraphics.fill(
            color(random(0,255),random(0,255),random(0,255),255));
        currentStepGraphics.ellipse(random(-r,r),random(-15,15),random(1,100),random(1,100));
        var currentStepScore = this.calculateScore(currentStepGraphics);
        if(currentStepScore < this.lastGenerationScore){
            this.lastGenerationScore = currentStepScore;
            outputGraphics.image(currentStepGraphics,0,0);
            lookingForBetterScore = false;
        }
        currentStepGraphics.remove();
    }

    calculateScore(graphToCheck){
        let sc = 0;
        targetImage.loadPixels();
        graphToCheck.loadPixels();
        let pixelCount = 4 * targetImage.width * targetImage.height;
        for (let i = 0; i < pixelCount; i++) {
            //console.log(targetImage.pixels[i], graphToCheck.pixels[i]);
            sc += this.calculateScoreForPixel(
                [targetImage.pixels[i],targetImage.pixels[i+1],
                targetImage.pixels[i+2],targetImage.pixels[i+3]],
                [graphToCheck.pixels[i],graphToCheck.pixels[i+1],
                graphToCheck.pixels[i+2],graphToCheck.pixels[i+3]]
            )
        }
        return sc;
    }

    calculateScoreForPixel(targetPixel, actualPixel) {
        let [tRed, tGreen, tBlue, tAlpha] = targetPixel;
        let [aRed, aGreen, aBlue, aAlpha] = actualPixel;
        let score = 0;
        score += Math.abs(tRed - aRed);
        score += Math.abs(tGreen - aGreen);
        score += Math.abs(tBlue - aBlue);
        //score += Math.abs(tAlpha - aAlpha);
        if(isNaN(score)){
            score = 0;
        }
        return sqrt(score);
    }
}