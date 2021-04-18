/* global io createCanvas width height mouseX mouseY mouseDragged fill ellipse stroke strokeWeight keyCode keyPressed pmouseX pmouseY line background noFill*/

// client-side js

let socket = io();
let brushSize = 5;
let currentColor = '#000000';
let batch = [];


//using p5 library
function setup(){
  createCanvas(window.innerWidth-30, window.innerHeight*9/10);
  document.getElementById('brushSize').innerHTML = brushSize;
}

function draw(){
  
}

function mouseDragged(){
  
  currentColor = document.getElementById('penColor').value;
  
  let segment = {
      x1: pmouseX,
      y1: pmouseY,
      x2: mouseX,
      y2: mouseY,
      color:currentColor,
      canvasWidth: width,
      canvasHeight: height,
      size: brushSize,
      id: (new Date()).getMilliseconds()
    }
  
  batch.push(segment);

  fill(segment.color);
  stroke(segment.color);
  strokeWeight(segment.size);
  line(segment.x1, segment.y1, segment.x2, segment.y2);
  
}


socket.on('drawBatch', function(data){
  
  for(let i in data){
    let segment = data[i];
    let xScale = width/segment.canvasWidth;
    let yScale = height/segment.canvasHeight;
    fill(segment.color);
    stroke(segment.color);
    strokeWeight(segment.size);
    line(segment.x1 * xScale, segment.y1 * yScale, segment.x2 * xScale, segment.y2 * yScale);
  }
})


socket.on('clientClear', function(){
  background(255);
})



function sendBatch(){

  if(batch.length > 0){
    socket.emit('newBatch', batch);
    //batch = [segment];
    batch = [];
  }
  
}


function keyPressed(){
  if(keyCode === 32){
    batch = [];
    socket.emit('serverClear');
  }
}



setInterval(sendBatch, 120);


document.getElementById('clearButton').addEventListener('click', function(){
  batch = [];
  socket.emit('serverClear');
})



document.getElementById('plusButton').addEventListener('click', function(){
  brushSize ++;
  brushSize = Math.min(40, brushSize);
  document.getElementById('brushSize').innerHTML = brushSize;
})




document.getElementById('minusButton').addEventListener('click', function(){
  brushSize --;
  brushSize = Math.max(1, brushSize);
  document.getElementById('brushSize').innerHTML = brushSize;
})