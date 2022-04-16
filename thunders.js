//alert("loaded");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

class point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    distance(p2) {
        return Math.sqrt(Math.pow(this.x - p2.x, 2) + Math.pow(this.y - p2.y, 2));
    }

    pointOnLine(p2, ratio) {
        return new point(this.x + (p2.x - this.x) * ratio, this.y + (p2.y - this.y) * ratio);
    }

    add(x,y){
        this.x += x
        this.y += y
    }

    randomizeX(d){
        this.x += Math.round(Math.random() * d) - d/2;
    }
}

random = Math.random;

function random(coef){
    return random() * coef;
}

function random_(coef=1){
    return (Math.random()-0.5) * 2 * coef;
}

function drawLine_(x1, y1, x2, y2, width=2, color='#e8d20c'){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width
    ctx.stroke();
}

function drawLine(p1,p2, width=2, color='#e8d20c' ){
    drawLine_(p1.x, p1.y, p2.x, p2.y, width, color);
    // drawLine_(p1.x, p1.y, p2.x, p2.y, width, 'white');
    // let offset = 5
    // drawLine_(p1.x+offset, p1.y+offset, p2.x+offset, p2.y+offset, width/3, 'rgb(86,242,255)');
    // drawLine_(p1.x-offset, p1.y-offset, p2.x-offset, p2.y-offset, width/3, 'rgb(238,35,24)');
}

function complementaryDist(x){
    return Math.sqrt(1 - Math.pow(x, 2));
}

function recursiveDrawThunder(p1,p2,branches,lineWidth=2, p1ratio=0, p2ratio=1){
    if(branches == 0){
        drawLine(p1,p2,lineWidth * (1 - Math.max(p1ratio, p2ratio)));
        return;
    }

    let newRatio = random()
    newRatio = newRatio * p1ratio + (1-newRatio) * p2ratio
    let p3 = p1.pointOnLine(p2, newRatio);

    p3.randomizeX(
        Math.min(
            p1.distance(p3),
            p2.distance(p3)
        ) *
        Math.sqrt(branches)/2
    );

    recursiveDrawThunder(p1,p3, branches - 1, lineWidth, p1ratio, newRatio);
    recursiveDrawThunder(p3,p2, branches - 1, lineWidth, newRatio, p2ratio);

    if(random() <= 0.2){ // is there a chance for a new branch to spawn?
        let newRatio = random()
        let p4 = p1.pointOnLine(p2, newRatio);
        p4.randomizeX(p1.distance(p2)*1.5)
        p4.add(0, p1.distance(p2)*random()*0.6)

        recursiveDrawThunder(p1,p4, branches - 1, lineWidth, p1ratio, newRatio);
    }
}

function drawThunder(){ //$(document).ready(function() {
    let scaleFactor = 4
    p1 = new point(canvas.clientWidth*scaleFactor/2, 30)
    p2 = new point(canvas.clientWidth*scaleFactor/2 + 30, canvas.clientHeight*scaleFactor - 50)
    
    ctx.scale(1/scaleFactor,1/scaleFactor)

    ctx.fillStyle = '#3477eb';
    recursiveDrawThunder(
        p1,
        p2,
        10,
        15,
    );
}   //);

//drawThunder();

const buton = document.getElementById('generate');

function drawFunction(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawThunder();
    ctx.scale(4,4)
}

buton.addEventListener('click', drawFunction);
drawFunction()