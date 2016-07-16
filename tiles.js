

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

    "draw" : function () {
        var tiles = "";
        for (var i=0; i<=this.__depth(); i+=1) {
            var style = "";
            style += "left:" + this.__screen_x() + "px;";
            style += "top:" + (this.__screen_y(-i)) + "px;";
            style += "z-index: " + this.__screen_z(-i) + ";";
            tiles += "<div class='tile' style='" + style + "'></div>\n";
        }
        return tiles;
    },
};
