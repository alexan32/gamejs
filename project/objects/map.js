import { Coord, distanceBetweenTwoPoints } from "../../engine/src/utils.js";

export class CollisionMap{

    //takes an array. 
    // -1:  collision.
    // 99: standin for infinity.
    constructor(arr){
        this.map = arr;
        // this.map = [
        //     //0   1    2    3    4    5    6    7    8    9
        //     [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],  // 0
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],  // 1
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],  // 2
        //     [-1,  99,  -1,  99,  99,  99,  99,  99,  99,  -1],  // 3
        //     [-1,  99,  -1,  -1,  -1,  99,  99,  99,  99,  -1],  // 4
        //     [-1,  99,  99,  99,  -1,  99,  99,  99,  99,  -1],  // 5
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],  // 6
        //     [-1,  99,  99,  99,  -1,  99,  99,  99,  99,  -1],  // 7 
        //     [-1,  99,  99,  99,  -1,  99,  99,  99,  99,  -1],  // 8
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],  // 9
        //     [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],  // 10
        // ];
        this.copy = JSON.parse(JSON.stringify(this.map));
        this.dimensionY = this.map.length;
        this.dimensionX = this.map[0].length;
    }


    astar(x1, y1, x2, y2){
        var buildNode = (x, y, g, h, parent)=>{return {"x":x, "y":y, "g":g, "h":h, "f":g+h, "parent":parent};}
        var open = [buildNode(x1, y1, 0, 0, null)];
        var closed = [];
        var goalNode = null;

        while(open.length > 0 && goalNode == null){

            //get node with least f in open list
            var smallestF = 9999;
            var smallestIndex = 0;
            for(var i=0; i<open.length; i++){
                var f = open[i].g + open[i].h;
                if(f < smallestF){
                    smallestF = f;
                    smallestIndex = i;
                }
            }
            var current = open.splice(smallestIndex, 1)[0];
            var successors = this.getNeighbors(current.x, current.y);

            // console.log(`open length: ${open.length}. closed length: ${closed.length}. smallest f: ${smallestF}`);
            for(var i=0; i<successors.length; i++){

                var successor = successors[i];
                // g = movement cost from starting point to given square
                // h = estimated movement cost to move from square to final destination
                // f = g + h
                var g = current.g + Math.round(distanceBetweenTwoPoints(current.x, current.y, successor.x, successor.y) * 10) / 10;
                var h = Math.round(distanceBetweenTwoPoints(successor.x, successor.y, x2, y2)* 10) / 10;
                var f = g + h;

                // if node is goal, done. else find f.
                if(successor.x == x2 && successor.y == y2){
                    goalNode = buildNode(successor.x, successor.y, g, h, current);
                    console.log("goal found! distance: ", goalNode.g);
                    break;
                }
                //if node with same position in OPEN and has lower f, skip
                var skip = false;
                for(let i=0; i<open.length; i++){
                    if(open[i].x == successor.x && open[i].y == successor.y && open[i].f < f){
                        skip = true;
                        break;
                    }
                }
                //if node with same position in CLOSED with lower f, skip. else add to OPEN
                if(!skip){
                    for(let i=0; i<closed.length; i++){
                        if(closed[i].x == successor.x && closed[i].y == successor.y && closed[i].f < f){
                            skip = true;
                            break;
                        }
                    }
                }
                if(!skip){
                    open.push(buildNode(successor.x, successor.y, g, h, current))
                }
            }
            // add current node to closed
            closed.push(current);
        }

        var path = [];
        if(goalNode != null){
            var current = goalNode;
            var done = false;
            while(current != null){
                path.unshift(new Coord(current.x, current.y));
                current = current.parent;
            }
        }
        return path;
    };

    getAvailableMoves(x, y, movement){
        var seen = [new Coord(x, y).toString()];
        var visited = [];
        this.copy = JSON.parse(JSON.stringify(this.map));
        this.copy[y][x] = 0;
        while(seen.length > 0){
            var nodeString = seen.shift().split(",");
            var currentNode = new Coord(nodeString[0], nodeString[1]);
            var currentValue = this.copy[currentNode.y][currentNode.x];
            if(currentValue <= movement + 0.001){
                var neighbors = this.getNeighbors(currentNode.x, currentNode.y);
                for(var neighbor of neighbors){
                    // Math.round(distanceBetweenTwoPoints(current.x, current.y, successor.x, successor.y) * 10) / 10;
                    var dist = Math.round(distanceBetweenTwoPoints(currentNode.x, currentNode.y, neighbor.x, neighbor.y) * 10) / 10;
                    if(this.copy[neighbor.y][neighbor.x] > currentValue + dist && currentValue + dist <= movement){
                        this.copy[neighbor.y][neighbor.x] = currentValue + dist;
                        seen.push(neighbor.toString());
                    }
                }
            }
            visited.push(currentNode);
        }
        this.logMap(this.copy);
        return visited;
    };

    getNeighbors(x, y){
        var neighbors = [];
        if(this.getNode(x,y) == null){
            return [];
        }
        var up = this.getNode(x, y-1) || -1;
        var down = this.getNode(x, y+1) || -1;
        var left = this.getNode(x-1, y) || -1;
        var right = this.getNode(x+1, y) || -1;
        var tr = this.getNode(x+1, y-1) || -1;
        var tl = this.getNode(x-1, y-1) || -1;
        var br = this.getNode(x+1, y+1) || -1;
        var bl = this.getNode(x-1, y+1) || -1;
        if(up != -1 && left != -1 && tl != -1){
            neighbors.push(new Coord(x-1, y-1));
        }
        if(up != -1 && right != -1 && tr != -1){
            neighbors.push(new Coord(x+1, y-1));
        }
        if(down != -1 && left != -1 && bl != -1){
            neighbors.push(new Coord(x-1, y+1));
        }
        if(down != -1 && right != -1 && br != -1){
            neighbors.push(new Coord(x+1, y+1))
        }
        if(up != -1){
            neighbors.push(new Coord(x, y-1));
        }
        if(down != -1){
            neighbors.push(new Coord(x, y+1));
        }
        if(right != -1){
            neighbors.push(new Coord(x+1, y));
        }
        if(left != -1){
            neighbors.push(new Coord(x-1, y));
        }
        return neighbors;
    };

    getNode(x, y){
        if((x < 0 || x > this.dimensionX) || (y < 0 || y > this.dimensionY)){
            return null;
        }
        return this.copy[y][x];
    };

    logMap(arr){
        var asString = "";
        for(let y=0; y<arr.length; y++){
            for(let x=0; x<arr[y].length; x++){
                var str = (Math.round(arr[y][x] * 10) / 10).toString();
                var spc = "";
                switch(str.length){
                    case 1: spc = "    "
                        break;
                    case 2: spc = "   "
                        break;
                    case 3: spc = "  "
                        break;
                    case 4: spc = " "
                        break;
                }
                asString += str + spc;
            }
            asString += "\n";
        }
        console.log(asString);
    }

}