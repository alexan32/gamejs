import { Coord, distanceBetweenTwoPoints } from "../../engine/src/utils.js";

export class CollisionMap{

    //takes an array. 
    // -1:  collision.
    // 99: standin for infinity.
    constructor(arr){
        this.map = arr;
        // this.map = [
        //     [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],
        //     [-1,  99,  -1,  99,  99,  99,  99,  99,  99,  -1],
        //     [-1,  99,  -1,  -1,  -1,  99,  99,  99,  99,  -1],
        //     [-1,  99,  99,  99,  -1,  99,  99,  99,  99,  -1],
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],
        //     [-1,  99,  99,  99,  -1,  99,  99,  99,  99,  -1],
        //     [-1,  99,  99,  99,  -1,  99,  99,  99,  99,  -1],
        //     [-1,  99,  99,  99,  99,  99,  99,  99,  99,  -1],
        //     [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
        // ];
        this.copy = JSON.parse(JSON.stringify(this.map));
        // this.logMap(this.map);
        this.dimensionY = this.map.length;
        this.dimensionX = this.map[0].length;
    }

    astar(x1, y1, x2, y2){};

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
                    var dist = (distanceBetweenTwoPoints(currentNode.x, currentNode.y, neighbor.x, neighbor.y) > 1.0) ? 1.4 : 1.0;
                    if(this.copy[neighbor.y][neighbor.x] > currentValue + dist && currentValue + dist < movement + 0.001){
                        this.copy[neighbor.y][neighbor.x] = currentValue + dist;
                        seen.push(neighbor.toString());
                    }
                }
            }
            visited.push(currentNode);
        }
        this.logMap(this.copy);
        console.log(visited)
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
                var str = arr[y][x].toString();
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