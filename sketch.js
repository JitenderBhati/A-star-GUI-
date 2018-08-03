let rows = 100;
let cols=100;
var grid = new Array(rows);
var openSet=[];
var closedSet=[];
var start, end;
var w,h;
var path=[];

function removeFromArray(arr, elt){
  for(var i=arr.length-1; i>=0; i--){
    if(arr[i]==elt)
      arr.splice(i,1);
  }
}

function heriustic(a,b){
  var d = dist(a.i,a.j,b.i,b.j);
  return d;
}

function Spot(i,j){
  this.i=i;
  this.j=j;
  this.f=0;
  this.g=0;
  this.h=0;
  this.wall = false;
  if(random(1)<0.3){
    this.wall = true;
  }
  this.previous = undefined;
  this.neighbour = [];
  this.show = function(col){
    fill(col);
    if(this.wall)
      fill(0);
    //stroke(0);
    noStroke();
    rect(this.i*w, this.j*h,w-1, h-1);
  }

  this.addNeighbour = function(grid)
  {
    var i = this.i;
    var j = this.j;
    if(i<rows-1)
      this.neighbour.push(grid[i+1][j]);
    if(j<cols-1)
      this.neighbour.push(grid[i][j+1]);
    if(i>0)
      this.neighbour.push(grid[i-1][j]);
    if(j>0)
      this.neighbour.push(grid[i][j-1]);
    if(i>0&& j>0)
      this.neighbour.push(grid[i-1][j-1]);
    if(i<rows-1 && j>0)
      this.neighbour.push(grid[i+1][j-1]);
    if(j>0 && i<rows-1)
       this.neighbour.push(grid[i+1][j-1]);
    if(i<rows-1 && j<cols-1)
         this.neighbour.push(grid[i+1][j+1]);
  }
}

function setup(){
    createCanvas(800, 650);
    background(0);
    w = width/cols;
    h = height/rows;
    for(var i=0; i<rows; i++){
      grid[i]=new Array(cols);
    }
    for(var i=0; i<rows; i++){
      for(var j=0; j<cols; j++){
        grid[i][j] = new Spot(i,j);
      }
    }

    for(var i=0; i<rows; i++){
      for(var j=0; j<cols; j++){
        grid[i][j].addNeighbour(grid);
      }
    }
    start = grid[0][0];
    end = grid[rows-1][cols-1];
    start.wall = false;
    end.wall = false;
    openSet.push(start);
}

function draw()
{
  if(openSet.length>0){
    var winner=0;
    for(var i=0; i<openSet.length; i++){
      if(openSet[i].f<openSet[winner].f){
        winner=i;
      }
    }
    var current = openSet[winner];
    if(current===end){
      console.log("Done!!");
      noLoop();
    }
    closedSet.push(current);
    removeFromArray(openSet, current);
    var neighbours = current.neighbour;
    for(var i=0; i<neighbours.length; i++){
      var neighbor = neighbours[i];
      if(!closedSet.includes(neighbor)&&!neighbor.wall){
        var tempG = current.g + 1
        var newPath = false;
        if(openSet.includes(neighbor)){
          if(tempG<neighbor.g){
            newPath =true;
            neighbor.g = tempG;
          }
        }
        else {
          newPath = true;
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        if(newPath){
        neighbor.h = heriustic(neighbor,end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
      }
      }
    }
  background(0);
  for(var i=0; i<rows; i++){
    for(var j=0; j<cols; j++){
      grid[i][j].show(color(255));
    }
  }

  for(var i=0; i<closedSet.length; i++){
    closedSet[i].show(color(255,0,0));
  }

  for(var i=0; i<openSet.length; i++){
    openSet[i].show(color(0,255,0));
  }
  path = [];
  var temp =current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }

  for(var i=0; i<path.length; i++){
    path[i].show(color(0,0,255));
  }
}
else {
  console.log('no Solution');
  noLoop();
}
}
