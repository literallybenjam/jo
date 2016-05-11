/* jslint asi:true, browser:true */
/* globals System, Control */

var Jo = {
    control: undefined,
    handleEvent: undefined,
    init: undefined,
    logic: undefined,
    render: undefined,
    setup: undefined,
    scrn: {
        button: 32,
        border: 24,
        width: 256,
        height: 192,
        layout: undefined,
        resized: true,
    },
    system: undefined
}

Jo.handleEvent = function(e) {

    var k;

    switch (e.type) {

        case "keydown":
            k = e.code || e.key || e.keyIdentifier || e.keyCode;
            if (document.documentElement.hasAttribute("data-jo-ctls-visible")) {
                document.documentElement.removeAttribute("data-jo-ctls-visible");
                Jo.scrn.resized = true;
            }
            if (!document.documentElement.dataset.joLayout) {
                Jo.setup();
                break;
            }
            if (k === "Tab" || k === "U+0009" || k === 0x09) {
                if (!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)) {
                    if (document.body.requestFullscreen) document.body.requestFullscreen();
                    else if (document.body.mozRequestFullScreen) document.body.mozRequestFullScreen();
                    else if (document.body.webkitRequestFullscreen) document.body.webkitRequestFullscreen();
                    else if (document.body.msRequestFullscreen) document.body.msRequestFullscreen();
                }
                else {
                    if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    else if (document.msExitFullscreen) document.msExitFullscreen();
                }
            }
            break;

        case "resize":
            Jo.scrn.resized = true;
            break;

        case "touchstart":
            if (!document.documentElement.hasAttribute("data-jo-ctls-visible")) {
                document.documentElement.setAttribute("data-jo-ctls-visible", "");
                Jo.scrn.resized = true;
            }
            if (!document.documentElement.dataset.joLayout) {
                Jo.setup();
                break;
            }
            if (e.target.id.substr(0, 8) === "jo-ctrl-") Jo.ctrl.active[e.target.id.substr(8)] = true;
            break;

    }

}

Jo.init = function() {

    if (typeof System === "undefined" || !System) throw new Error("(jo.js) System module not loaded");
    if (typeof Control === "undefined" || !Control) throw new Error("(jo.js) Control module not loaded");

    //  System setup:

    Jo.system = new System("2d", "2d");

    Jo.system.canvases[0].height = Jo.scrn.height;
    Jo.system.canvases[1].height = Jo.scrn.height;
    Jo.system.canvases[0].width = Jo.scrn.width;
    Jo.system.canvases[1].width = Jo.scrn.width;
    document.getElementById("jo-scrn-tp").appendChild(Jo.system.canvases[0]);
    document.getElementById("jo-scrn-bt").appendChild(Jo.system.canvases[1]);

    //  Control setup:

    Jo.control = new Control(true);
    Jo.control.add("action").addKeys("action", 0x58, "U+0058", "KeyX", "X", "x").linkElement("action", "jo-ctrl-actn");
    Jo.control.add("down").addKeys("down", 0x28, "ArrowDown", "Down").linkElement("down", "jo-ctrl-dnrw");
    Jo.control.add("exit").addKeys("exit", 0x5A, "U+005A", "KeyZ", "Z", "z").linkElement("exit", "jo-ctrl-exit");
    Jo.control.add("left").addKeys("left", 0x25, "ArrowLeft", "Left").linkElement("left", "jo-ctrl-lfrw");
    Jo.control.add("look").addKeys("look", 0x53, "U+0053", "KeyS", "S", "s").linkElement("look", "jo-ctrl-look");
    Jo.control.add("menu").addKeys("menu", 0x41, "U+0041", "KeyA", "A", "a").linkElement("menu", "jo-ctrl-menu");
    Jo.control.add("right").addKeys("right", 0x27, "ArrowRight", "Right").linkElement("right", "jo-ctrl-rtrw");
    Jo.control.add("select").addKeys("select", 0x57, "U+0057", "KeyW", "W", "w").linkElement("select", "jo-ctrl-selc");
    Jo.control.add("start").addKeys("start", 0x51, "U+0051", "KeyQ", "Q", "q").linkElement("start", "jo-ctrl-strt");
    Jo.control.add("up").addKeys("up", 0x26, "ArrowUp", "Up").linkElement("up", "jo-ctrl-uprw");

    //  Adding event listeners:

    window.addEventListener("keydown", Jo, false);
    window.addEventListener("resize", Jo, false);
    window.addEventListener("touchstart", Jo, false);

}

Jo.scrn.layout = function() {

    //  Variable setup:

    var bdy_h = window.innerHeight - 4 * Jo.scrn.border;
    var bdy_w = window.innerWidth - 4 * Jo.scrn.border;
    var uni_h = Jo.scrn.height;
    var uni_w = Jo.scrn.width;
    var scr_h;
    var scr_w;
    var tmp_h;
    var tmp_w;
    var ctl_d;

    if (document.documentElement.hasAttribute("data-jo-ctls-visible")) ctl_d = Jo.scrn.button * 3;
    else ctl_d = 0;

    //  Wide layout:

    if (bdy_w > 2 * uni_w * bdy_h / uni_h) {

        //  Initial width and height setup:

        bdy_h = window.innerHeight - 2 * Jo.scrn.border;
        if (bdy_h < uni_h) scr_h = bdy_h;
        else scr_h = uni_h * Math.floor(bdy_h / uni_h);
        scr_w = Math.floor(uni_w * scr_h / uni_h);
        if (bdy_w / 2 < scr_w) {
            if (bdy_w < 2 * uni_w) scr_w = Math.floor(bdy_w / 2);
            else scr_w = uni_w * Math.floor(bdy_w / (2 * uni_w));
            scr_h = Math.floor(uni_h * scr_w / uni_w);
        }

        //  Choosing layout and finalizing sizes:

        if (bdy_h === scr_h || bdy_w - (scr_w * 2) > ctl_d) {
            document.documentElement.dataset.joLayout = "4";
            tmp_w = bdy_w - ctl_d;
            if (tmp_w / 2 < scr_w) {
                if (tmp_w < 2 * uni_w) scr_w = Math.floor(tmp_w / 2);
                else scr_w = uni_w * Math.floor(tmp_w / (2 * uni_w));
                scr_h = Math.floor(uni_h * scr_w / uni_w);
            }
        }

        else {
            document.documentElement.dataset.joLayout = "3";
            tmp_h = bdy_h - ctl_d;
            if (tmp_h < scr_h) {
                if (tmp_h < uni_h) scr_h = tmp_h;
                else scr_h = uni_h * Math.floor(tmp_h / uni_h);
                scr_w = Math.floor(uni_w * scr_h / uni_h);
            }
        }

    }

    //  Narrow layout:

    else {

        //  Initial width and height setup:

        bdy_w = window.innerWidth - 2 * Jo.scrn.border;
        if (bdy_w < uni_w) scr_w = bdy_w;
        else scr_w = uni_w * Math.floor(bdy_w / uni_w);
        scr_h = Math.floor(uni_h * scr_w / uni_w);
        if (bdy_h / 2 < scr_h) {
            if (bdy_h < 2 * uni_h) scr_h = Math.floor(bdy_h / 2);
            else scr_h = uni_h * Math.floor(bdy_h / (2 * uni_h));
            scr_w = Math.floor(uni_w * scr_h / uni_h);
        }

        //  Choosing layout and finalizing sizes:

        if (bdy_w === scr_w || bdy_h - (scr_h * 2) > ctl_d) {
            document.documentElement.dataset.joLayout = "2";
            tmp_h = bdy_h - ctl_d;
            if (tmp_h / 2 < scr_h) {
                if (tmp_h < 2 * uni_h) scr_h = Math.floor(tmp_h / 2);
                else scr_h = uni_h * Math.floor(tmp_h / (2 * uni_h));
                scr_w = Math.floor(uni_w * scr_h / uni_h);
            }
        }

        else {
            document.documentElement.dataset.joLayout = "1";
            tmp_w = bdy_w - uni_h;
            if (tmp_w < scr_w) {
                if (tmp_w < uni_w) scr_w = tmp_w;
                else scr_w = uni_w * Math.floor(tmp_w / uni_w);
                scr_h = Math.floor(uni_h * scr_w / uni_w);
            }
        }

    }

    //  Applying layout:

    Jo.system.canvases[0].style.width = scr_w + "px";
    Jo.system.canvases[0].style.height = scr_h + "px";
    Jo.system.canvases[1].style.width = scr_w + "px";
    Jo.system.canvases[1].style.height = scr_h + "px";

}

Jo.logic = function() {

}

Jo.render = function() {

    var k;

    if (Jo.scrn.resized) Jo.scrn.layout();

    window.requestAnimationFrame(Jo.render);

}

Jo.setup = function() {

    //  Calling logic and render functions:

    Jo.logic();
    Jo.render();

}

window.addEventListener("load", Jo.init, false);
