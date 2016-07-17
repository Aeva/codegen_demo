

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


var __dirty_scene = true;
var dom_update = function () {
    if (__dirty_scene) {
        __dirty_scene = false;

        var ctx = document.getElementById("center_guide");
        ctx.innerHTML = "";

        for (var x=0; x<map.length; x+=1) {
            var column = map[x];
            for (var y=0; y<column.length; y+=1) {
                map[x][y].update_elements(true);
            }
        }
    }
    // update other things here

    update_fps();
    requestAnimationFrame(dom_update);
};
