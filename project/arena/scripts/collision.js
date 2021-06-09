import { Coord, distanceBetweenTwoPoints, EventBus } from "../../../engine/src/utils.js";
import { environment as env } from "../environment.js";
import { input, viewFrame } from "../../../engine/main.js";

export class CollisionMap{

    /* Takes a 2D array, where -1 indicates a "collision" or unreachable location, and all other values set to a Max value
       such as 999999 as a stand in for infinity. This array should only include terrain collisions. Collisions due to 
       a creature or a temporary effect occupying a space should be applied before pathfinding via the 'populate()' function.
    */
    constructor(arr, x, y){
        this.map = arr;
        this.calculationMap = JSON.parse(JSON.stringify(this.map));

        this.dimensionY = this.map.length;
        this.dimensionX = this.map[0].length;

        this.worldPosition = new Coord(x, y);

        this.events = new EventBus();
        this.subscriptions = {};
        this.subscriptions["mousedown"] = input.events.on("mousedown", this.onMouseDown.bind(this));

        this.temporaryCollisions = [];
    }

    onMouseDown(event){
        var tileX = Math.floor((event.x + viewFrame.worldPosition.x) / env.tileSize);
        var tileY = Math.floor((event.y + viewFrame.worldPosition.y) / env.tileSize);
        var tile = this.getNode(tileX, tileY);
        if(tile != null){
            this.events.trigger("tileClicked", {"tile": tile, x: tileX, y: tileY})
        }
    }

    /* A* Algorithm implementation. Returns path to goal(x2, y2) from start(x1, y1) as list of coordinates*/
    astar(x1, y1, x2, y2, tempCollisions=[]){
        this.calculationMap = this.getPopulatedMap(tempCollisions)

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


    /* Returns a list with a Coord for each node that can be reached from position x,y with a set movement*/
    getAvailableMoves(x, y, movement, tempCollisions=[]){
        var seen = [new Coord(x, y).toString()];
        var visited = [];
        this.calculationMap = this.getPopulatedMap(tempCollisions);
        this.calculationMap[y][x] = 0;
        while(seen.length > 0){
            var nodeString = seen.shift().split(",");
            var currentNode = new Coord(nodeString[0], nodeString[1]);
            var currentValue = this.calculationMap[currentNode.y][currentNode.x];
            if(currentValue <= movement + 0.001){
                var neighbors = this.getNeighbors(currentNode.x, currentNode.y);
                for(var neighbor of neighbors){
                    // Math.round(distanceBetweenTwoPoints(current.x, current.y, successor.x, successor.y) * 10) / 10;
                    var dist = Math.round(distanceBetweenTwoPoints(currentNode.x, currentNode.y, neighbor.x, neighbor.y) * 10) / 10;
                    if(this.calculationMap[neighbor.y][neighbor.x] > currentValue + dist && currentValue + dist <= movement){
                        this.calculationMap[neighbor.y][neighbor.x] = currentValue + dist;
                        seen.push(neighbor.toString());
                    }
                }
            }
            visited.push(currentNode);
        }
        this.logMap(this.calculationMap);
        return visited;
    };


    /* Returns the neighbors (aka successors) of a node positioned at x,y */
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


    /*Safe retrieval of node at x,y position. Returns null if out of bounds.*/
    getNode(x, y){
        if((x < 0 || x > this.dimensionX) || (y < 0 || y > this.dimensionY)){
            return null;
        }
        return this.calculationMap[y][x];
    };

    /*  tile is not a collision
    */
    canEnter(x, y, tempCollisions=[]){
        this.calculationMap = this.getPopulatedMap(tempCollisions);
        const tileData = this.getNode(x, y);
        return tileData != -1 && tileData != null
    }

    /*  Use this to update the copy with variable collisions before pathfinding.
        Takes an array of Coords as input.
    */
    getPopulatedMap(tempCollisions=[]){
        this.calculationMap = JSON.parse(JSON.stringify(this.map));
        tempCollisions.forEach(coord => {
            this.calculationMap[coord.y][coord.x] = -1;
        });
        return this.calculationMap
    }


    /* logs map for debug purposes.*/
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
        console.debug(asString);
    }

}