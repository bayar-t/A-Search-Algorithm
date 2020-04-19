function removefromArray(arr, el) {
  for (var i = arr.length-1; i>=0; i--) {
    if (arr[i] == el) {
      arr.splice(i,1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  //var d = abs(a.i-b.i) + abs(a.j-b.j);
  return d;
}

var cols = 50;
var rows = 50;
var grid = new Array(cols);
var openSet = []
var closedSet = []
var start;
var end;
var w, h;
var path = [];

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if(random(1) < 0.4) {
    this.wall = true;
  }

  this.show = function(col) {
  //  fill(col);
    if (this.wall) {
    //  for (var i = 0; i < this.neighbors.length; i++) {
    //    if (this.neighbors[i].wall) {
      //    fill(0);
      //    noStroke();
      //    ellipse(this.i*w +w/2, this.j*h+h/2, w/2, h/2);
      //  } else {
        fill(0);
        noStroke();
        ellipse(this.i*w + w/2, this.j*h + h/2, w/2, h/2);


      }
    //  fill(0);
    //  noStroke();
    //  ellipse(this.i*w + w/2, this.j*h + h/2, w/2, h/2);
    }


  this.addNeighbors = function(grid) {
    if (i < cols -1) {
      this.neighbors.push(grid[this.i+1][this.j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[this.i-1][this.j]);
    }
    if (j < rows -1) {
      this.neighbors.push(grid[this.i][this.j+1])
    }
    if (j > 0) {
      this.neighbors.push(grid[this.i][this.j-1])
    }
    if (i > 0 && j > 0 ) {
      this.neighbors.push(grid[i-1][j-1]);
    }
    if (i < cols-1 && j > 0 ) {
      this.neighbors.push(grid[i+1][j-1]);
    }
    if (i > 0 && j < rows -1 ) {
      this.neighbors.push(grid[i-1][j+1]);
    }
    if (i < cols-1 && j < rows-1 ) {
      this.neighbors.push(grid[i+1][j+1]);
    }
  }
  this.contains = function(x,y) {
    return (x > this.i && x < this.i + this.w && y > this.j && j < this.j + this.w);
  }
}

function setup() {
  createCanvas(400,400);
  console.log('A*');
  w= width/cols;
  h = height/rows;

  //2d array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j< rows; j++) {
      grid[i][j] = new Cell(i, j);
    }

  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j< rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);


}

function mousePressed() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if(grid[i][j].contains(mouseX,mouseY)) {
        grid[i][j].wall = true;
        grid[i][j].show();
      }
    }
  }
}

function draw() {
  if (openSet.length > 0){
    var lowest = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowest].f) {
        lowest = i;
      }
    }
    var current = openSet[lowest];

    if (current == end) {

      noLoop();
      console.log("Done");
    }

    removefromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + heuristic(neighbor, current);
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor,end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }

    }

  } else {
    console.log("no solution");
    return;
    noLoop();

  }
  background(255);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
//  for (var i = 0; i < closedSet.length; i++) {
    //closedSet[i].show(color(0,200,255));
  //}
//  for (var i = 0; i < openSet.length; i++) {
  //  openSet[i].show(color(25,255,25));
//  }

  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }


  //for (var i = 0; i < path.length; i++) {
  //  path[i].show(color(0,0,255));
  //}
  stroke(255,0,0);
//  strokeWeight(w/2);
//  noFill();
  beginShape();
  strokeWeight(w/2);
  noFill();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w/2, path[i].j * h + h/2)
  }
  endShape();
}
