

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


var __draw_cache = null;
var caching_redraw = function () {
    if (__draw_cache === null) {
        __draw_cache = "";
        for (var x=0; x<map.length; x+=1) {
            var column = map[x];
            for (var y=0; y<column.length; y+=1) {
                __draw_cache += column[y].draw();
            }
        }
    }

    var ctx = document.getElementById("center_guide");
    ctx.innerHTML = __draw_cache;
    
    update_fps();
    requestAnimationFrame(caching_redraw);
};
