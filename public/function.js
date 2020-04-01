const vw =
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0) /
    100;
const vh =
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0) /
    100;

window.onload = function() {
    //Onclick listeners for toggling description
    document.getElementById("header0").addEventListener("click", function() {
        toggleDes(0);
    });
    document.getElementById("header1").addEventListener("click", function() {
        toggleDes(1);
    });
    document.getElementById("header2").addEventListener("click", function() {
        toggleDes(2);
    });
    document.getElementById("header3").addEventListener("click", function() {
        toggleDes(3);
    });
    document.getElementById("header4").addEventListener("click", function() {
        toggleDes(4);
    });
    document.getElementById("header5").addEventListener("click", function() {
        toggleDes(5);
    });
    document.getElementById("header6").addEventListener("click", function() {
        toggleDes(6);
    });
    document.getElementById("header7").addEventListener("click", function() {
        toggleDes(7);
    });

    for (var i = 0; i < 8; i++) {
        var Id = "bodyer" + i;
        var x = document.getElementById(Id);
        //x.style.display = "none";
        x.style.position = "relative";
        x.style.top = "-100px";
        x.style.transform = "scale(0.5)";
        x.style.transitionDuration = "0.5s";
        x.style.height = "0";
    }

    //Onclick listener for scrolling my projects
    var right = document.getElementById("rightScroll");
    var left = document.getElementById("leftScroll");

    right.addEventListener("click", function() {
        Scroll(1);
    });
    left.addEventListener("click", function() {
        Scroll(-1);
    });

    var x = document
        .getElementById("myProjects")
        .getElementsByClassName("tile");
    for (var i = 0; i < x.length; i++) {
        x[i].style.left = "0px";
    }
};

//Toggle description by sliding it downward. Hidden by sliding upwards and shrinking to hide it
function toggleDes(index) {
    var Id = "bodyer" + index;
    var x = document.getElementById(Id);
    if (x.style.top == "-100px") {
        x.style.transform = "scale(1)";
        x.style.top = "0px";
        x.style.zIndex = "1";
        x.style.height = "200px";
    } else {
        x.style.transform = "scale(0.5)";
        x.style.top = "-100px";
        x.style.zIndex = "-1";
        x.style.height = "0";
    }
}

//Scroll left/right by the distance of the project tile width
function Scroll(dir) {
    var x = document
        .getElementById("myProjects")
        .getElementsByClassName("tile");

    switch (dir) {
        case -1:
            for (var i = 0; i < x.length; i++) {
                //e.position.left.toString();
                var temp = parseInt(x[i].style.getPropertyValue("left"));
                if (temp < 0) {
                    temp += 33 * vw;
                    var out = temp.toString() + "px";
                    x[i].style.left = out;
                }

                console.log(x[i].style.getPropertyValue("left"));
            }
            break;
        case 1:
            for (var i = 0; i < x.length; i++) {
                //e.position.left.toString();
                var temp = parseInt(x[i].style.getPropertyValue("left"));
                if (temp > -1 * (33 * vw) * 2) {
                    temp -= 33 * vw;
                    var out = temp.toString() + "px";
                    x[i].style.left = out;
                }

                console.log(x[i].style.getPropertyValue("left"));
            }
            break;
    }
}
