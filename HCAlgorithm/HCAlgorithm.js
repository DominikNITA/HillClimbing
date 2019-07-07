
var outputGraphics;
var targetImage;
var lookingForBetterScore;
var createNextStep, shapesUsed, colorSetting;



class HCAlgorithm {
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

    applySettings(_coordinateSystem, _shapesUsed, _colorSetting){
        this.setCoordinateSystem(_coordinateSystem);
        //this.setShapesUsed(_shapesUsed);
        //this.setColorSetting(_colorSetting);
    }

    setCoordinateSystem(_coordinateSystem){
        switch(_coordinateSystem)
        {
            case coordinateSystems.CARTESIAN:
                createNextStep = (shapeWidth, shapeHeight, shapeRange, angle, copiedGraphics, currentStepGraphics) => {
                    return this.createNextStepCartesian(shapeWidth, shapeHeight, shapeRange, angle, copiedGraphics, currentStepGraphics);
                }
                break;
            case coordinateSystems.POLAR:
                createNextStep = (shapeWidth, shapeHeight, shapeRange, angle, copiedGraphics, currentStepGraphics) => {
                    return this.createNextStepPolar(shapeWidth, shapeHeight, shapeRange, angle, copiedGraphics, currentStepGraphics);
                }
                break;
            default:
                console.log("Error -> unknown coordinate system!");
                break;
        }
    }

    showOutputImage() {
        return outputGraphics;
    }

    calculateNextGeneration() {
        this.stepCounter = 0;
        lookingForBetterScore = true;
        console.time("Generation" + this.generationCounter);
        while (lookingForBetterScore) {
            this.generate();
            this.stepCounter++;
            //console.log("STEP: " + this.stepCounter);
        }
        console.timeEnd("Generation"+ this.generationCounter);
        this.generationCounter++;
        //console.log(this.generationCounter);
    }

     createNextStepCartesian(shapeWidth, shapeHeight, shapeRange, angle, copiedGraphics, currentStepGraphics){
        console.time("nextCartesian" + this.stepCounter);
        let x = parseInt(random(targetImage.width));
        let y = parseInt(random(targetImage.height));
        currentStepGraphics.translate(x,y);
        currentStepGraphics.rotate(angle);

        let ellipseWidth = shapeWidth;
        let ellipseHeight = shapeHeight;
        let range = shapeRange;

        currentStepGraphics.ellipse(0,0,ellipseWidth,ellipseHeight);
        console.timeEnd("nextCartesian" + this.stepCounter);
        this.compareScores(currentStepGraphics, copiedGraphics, x, y, range);
        currentStepGraphics.remove();
        copiedGraphics.remove();
    }

    createNextStepPolar(shapeWidth, shapeHeight, shapeRange, angle, copiedGraphics, currentStepGraphics){
        currentStepGraphics.translate(currentStepGraphics.width/2, currentStepGraphics.height/2);
        currentStepGraphics.rotate(angle);
        let r = currentStepGraphics.height/abs(sin(angle));
        if(abs(tan(angle)) <= currentStepGraphics.height/currentStepGraphics.width){
            r = currentStepGraphics.width/abs(cos(angle));
        }
        currentStepGraphics.ellipse(random(-r,r),0,shapeWidth,shapeHeight);
        this.compareScores(currentStepGraphics, copiedGraphics, 0, 0, shapeRange);
        currentStepGraphics.remove();
        copiedGraphics.remove();
    }

    compareScores(currentStepGraphics, copiedGraphics, x, y, range){
        console.time("compareScore");
        var currentStepScore = this.calculateScore2(currentStepGraphics,x,y,range);
        var previousStepScore = this.calculateScore2(copiedGraphics,x,y,range);
        if(currentStepScore < previousStepScore){
            this.lastGenerationScore = currentStepScore;
            outputGraphics.image(currentStepGraphics,0,0);
            lookingForBetterScore = false;
        }
        console.timeEnd("compareScore");
        currentStepGraphics.remove();
        copiedGraphics.remove();
    }

    generate(){
        console.time("generate");
        let currentStepGraphics = createGraphics(targetImage.width,targetImage.height);
        currentStepGraphics.image(outputGraphics,0,0);
        currentStepGraphics.angleMode(RADIANS);
        let fillColor = this.getRandomColor();
        currentStepGraphics.fill(fillColor);
        currentStepGraphics.noStroke();

        let angle = random(2*PI);
        let shapeWidth = parseInt(random(5,500));
        let shapeHeight = parseInt(random(5,500));
        let shapeRange = max([shapeWidth,shapeHeight]);


        let copiedGraphics = createGraphics(currentStepGraphics.width, currentStepGraphics.height);
        copiedGraphics.image(currentStepGraphics,0,0);
        console.timeEnd("generate");
        createNextStep(shapeWidth, shapeHeight, shapeRange, angle, copiedGraphics, currentStepGraphics);

        currentStepGraphics.remove();
        copiedGraphics.remove();
    }

    calculateScore2(graphToCheck,x,y,range){
        let sc = 0;
        targetImage.loadPixels();
        graphToCheck.loadPixels();
        for (let i = x-range/2 ; x+range/2 >= i ; i++) {
            for (let j = y-range/2; y+range/2 >= j; j++) {
                if(i<0 || j < 0 || i > targetImage.width || j > targetImage.height){
                    continue;
                }
                sc += this.calculateScoreForPixel(targetImage.get(i,j), graphToCheck.get(i,j));
            }
        }
        return sc;
    }



    calculateScore(graphToCheck){
        let sc = 0;
        targetImage.loadPixels();
        graphToCheck.loadPixels();
        let pixelCount = 4 * targetImage.width * targetImage.height;
        for (let i = 0; i < pixelCount; i+=4) {

            sc += this.calculateScoreForPixel(
                [targetImage.pixels[i],targetImage.pixels[i+1],
                targetImage.pixels[i+2],targetImage.pixels[i+3]],
                [graphToCheck.pixels[i],graphToCheck.pixels[i+1],
                graphToCheck.pixels[i+2],graphToCheck.pixels[i+3]]
            )

        }
        graphToCheck.updatePixels();
        targetImage.updatePixels();
        graphToCheck.remove();
        return sc;
    }

    calculateScoreForPixel(targetPixel, actualPixel) {
        let [tRed, tGreen, tBlue, tAlpha] = targetPixel;
        let [aRed, aGreen, aBlue, aAlpha] = actualPixel;
        let score = 0;
        score += pow(abs(tRed - aRed),2);
        score += pow(abs(tGreen - aGreen),2);
        score += pow(abs(tBlue - aBlue),2);
        //score += Math.abs(tAlpha - aAlpha);
        if(isNaN(score)){
            score = 0;
        }
        return score;
    }

    getRandomColor(){
        return color(random(0,255),random(0,255),random(0,255),255)
    }
}