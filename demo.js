"use strict";


// 2D array for storing terrain tiles and other things
var map = [];


// convinience method to make code look a bit cleaner
var define_getter = function (object, property, callback) {
    Object.defineProperty(object, property, {"get" : callback});
};


var BasicTile = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    define_getter(this, "__screen_x", function () {
        return (this.y + this.x) * 32;
    });

    define_getter(this, "__screen_y", function () {
        return (this.y - this.x) * 16 - this.z*32;
    });

    define_getter(this, "__screen_z", function () {
        return Math.round(((this.y - this.x) + this.z) * 100);
    });

    this.neighbors = null;
};
BasicTile.prototype = Object.create(null);
BasicTile.prototype.draw = function () {
    var style = "";
    style += "left:" + this.__screen_x + "px;";
    style += "top:" + this.__screen_y + "px;";
    style += "z-index: " + this.__screen_z + ";";
    return "<div class='tile' style='" + style + "'></div>\n";
};


var update_fps = (function () {
    var last_update = 0;
    var last_time = 0;
    var samples = [];
    return function () {
        var now = performance.now();
        var dt = now - last_time;
        last_time = now;
        samples.push(1000/dt);
        if (now - last_update > 1000) {
            last_update = now;
            var sum = 0;
            for (var i=0; i<samples.length; i+=1) {
                sum += samples[i];
            }
            var average = sum/samples.length;
            samples = [];
            var ticker = document.getElementById("fps_counter");
            ticker.innerHTML = "fps: " + Math.round(average);
        }
    };
})();


var basic_redraw = function () {
    var acc = "";
    for (var x=0; x<map.length; x+=1) {
        var column = map[x];
        for (var y=0; y<column.length; y+=1) {
            acc += column[y].draw();
        }
    }
    
    var ctx = document.getElementById("center_guide");
    ctx.innerHTML = acc;

    update_fps();
    requestAnimationFrame(basic_redraw);
};


// generate the terrain
var load_map = function () {
    var map = window.map = [];
    var area = 10;
    var low = Math.floor(area/2) * -1;
    var high = Math.floor(area/2);
    for (var x=low; x<=high; x+=1) {
        var column = [];
        for (var y=low; y<=high; y+=1) {
            column.push(new BasicTile(x, y));
        }
        map.push(column);
    }
};


addEventListener("load", function () {
    load_map();
    basic_redraw();
});
