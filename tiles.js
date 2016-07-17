

function BasicTile (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.neighbors = null;
};


BasicTile.prototype = {
    "__screen_x" : function () {
        return (this.y + this.x) * 32;
    },

    "__screen_y" : function (z_mod) {
        z_mod = z_mod || 0;
        return (this.y - this.x) * 16 - (this.z + z_mod)*32;
    },

    "__screen_z" : function (z_mod) {
        z_mod = z_mod || 0;
        return Math.round((this.y - this.x) * 100 + z_mod);
    },

    "__depth" : function () {
        var repeats = 0;
        if (this.neighbors !== null) {
            for (var n=0; n<this.neighbors.length; n+=1) {
                var tile = this.neighbors[n];
                var dist = Math.floor(Math.abs(this.z-tile.z));
                if (tile.z < this.z && dist > repeats) {
                    repeats = dist;
                }
            }
        }
        return repeats;
    },
};


function TerrainTile (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.neighbors = null;
    this.elements = [];
};
TerrainTile.prototype = Object.create(BasicTile.prototype);
TerrainTile.prototype.update_elements = function (dont_cascade) {
    dont_cascade = dont_cascade || false;
    var total_elements = this.__depth() + 1;
    var offset = total_elements - this.elements.length;
    if (offset > 0) {
        // add elements
        for (var i=0; i<offset; i+=1) {
            var div = document.createElement("div");
            div.className = "tile";
            this.elements.push(div);
        }
    }
    else if (offset < 0) {
        // remove elements
        var removed = this.elements.pop();
        if (removed.parentElement) {
            removed.parentElement.removeChild(removed);
        }
    }

    // update the divs for this grid
    var ctx = document.getElementById("center_guide");
    for (var i=0; i<this.elements.length; i+=1) {
        var div = this.elements[i];
        div.className = "tile";
        div.style.left = "" + this.__screen_x() + "px";
        div.style.top = "" + this.__screen_y(-i) + "px";
        div.style.zIndex = this.__screen_z(-i);
        if (!div.parentElement) {
            ctx.appendChild(div);
        }
    }
    if (!dont_cascade) {
        for (var i=0; i<this.neighbors.length; i+=1) {
            this.neighbors[i].update_elements(true);
        }
    }
    return;
};
