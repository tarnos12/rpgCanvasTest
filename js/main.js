(function () {
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();
    var CANVAS_WIDTH = 480;
    var CANVAS_HEIGHT = 352;
    var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
                          "' height='" + CANVAS_HEIGHT + "'></canvas>");
    var ctx = canvasElement.get(0).getContext("2d");
    canvasElement.appendTo('body');
    window.addEventListener('keydown', doKeyDown, true);


    var testMap;
    var gameMap = [[],[]];

    var img = [];
    var playerImg;
    function preloadImages() {
        var images = ["dg_grounds32"];
        var playerT = ["player"];
        for (var j = 0; j < playerT.length; j++) {
            playerImg = new Image();
            playerImg.onload = function () {
                $.getJSON("https://raw.githubusercontent.com/tarnos12/rpgCanvasTest/master/json/map.json?callback=?", function (json) {
                    console.log(json); // this will show the info it in firebug console
                    testMap = json;
                    
                    for (var layer = 0; layer < testMap.layers.length; layer++) {
                        var layerRow = testMap.layers[layer].data.length / testMap.layers[layer].height;
                        var arr = testMap.layers[layer].data;
                        var newTestArr = arr.slice();
                        while (newTestArr.length) gameMap[layer].push(newTestArr.splice(0, layerRow));
                    }
                    gameLoop();
                });
                return true
            }
            playerImg.src = "images/" + playerT[j] + ".gif";
        }
        for (var i = 0; i < images.length; i++) {
            img[i] = new Image();
            img[i].onload = function () {
                return true;
            }
            img[i].src = "images/" + images[i] + ".gif";
        }

    }
    preloadImages();

    var player = {
        color: "#0AA",
        width: 32,
        height: 32,
        defaultCamX: 7,
        defaultCamY: 5,
        xPos: 0,
        yPos: 0,
        x: 0,
        y: 0,
        draw: function () {
            if (this.xPos <= this.defaultCamX) {
                this.x = (this.defaultCamX - (this.defaultCamX - this.xPos)) * 32
            }
            else if(this.xPos + this.defaultCamX >= gameMap[0][0].length){
                this.x = (this.defaultCamX + (this.xPos + this.defaultCamX - gameMap[0][0].length + 1)) * 32
            }
            else {
                this.x = this.defaultCamX * 32
            }
            if (this.yPos < this.defaultCamY) {
                this.y = (this.defaultCamY - (this.defaultCamY - this.yPos)) * 32
            }
            else if (this.yPos + this.defaultCamY >= gameMap[0].length) {
                this.y = (this.defaultCamY + (this.yPos + this.defaultCamY - gameMap[0].length + 1)) * 32
            }
            else {
                this.y = this.defaultCamY * 32
            }
            ctx.drawImage(playerImg, this.x, this.y);
        }
    };

    var gameLoop = function () {
        update();
        render();
        requestAnimFrame(gameLoop);
    };

    function update() {

    };


    function render() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        for (var layer = 0; layer < gameMap.length; layer++) {
            var row = 0,
                lastRow = gameMap[layer].length,
                drawRow = 0;

            if(player.yPos > player.defaultCamY){
                row = player.yPos - player.defaultCamY;
            }
            if (player.yPos + player.defaultCamY >= lastRow) {
                row = lastRow - CANVAS_HEIGHT / 32;
            }

            for (; row < lastRow; row++, drawRow++) {
                var col = 0,
                    lastCol = gameMap[layer][row].length,
                    drawCol = 0;

                if (player.xPos > player.defaultCamX) {
                    col = player.xPos - player.defaultCamX;
                }
                if (player.xPos + player.defaultCamX >= lastCol) {
                    col = lastCol - CANVAS_WIDTH / 32;
                }
                for (; col < lastCol; col++, drawCol++) {
                    var mapValue = gameMap[layer][row][col];
                    if (layer === 1 && mapValue > 0) {
                        gameMap[layer][row][col] = { blocked: true }
                    }
                    var image = img[0];
                    var sx = 0;
                    var sy = 0;
                    var numberTest = 0;
                    for (var imgRow = 0; imgRow < testMap.tilesets[0].imageheight / 32; imgRow += 1) {
                        for (var imgCol = 0; imgCol < testMap.tilesets[0].imagewidth / 32; imgCol += 1) {
                            numberTest++;
                            if (numberTest === mapValue) {
                                var sx = 32 * imgCol;
                                var sy = 32 * imgRow;
                                var y = drawRow * 32;
                                var x = drawCol * 32;


                                ctx.drawImage(image, sx, sy, 32, 32, x, y, 32, 32);
                            }

                        }
                    }
                }

            }
        }
        player.draw();
    }



    function doKeyDown(evt) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
                if (player.y - 32 >= 0 && gameMap[1][player.yPos - 1][player.xPos].blocked !== true) {
                    
                    player.yPos -= 1;
                }
                break;
            case 40:  /* Down arrow was pressed */
                if (player.y + 32 < CANVAS_HEIGHT && gameMap[1][player.yPos + 1][player.xPos].blocked !== true) {
                   
                    player.yPos += 1;
                }
                break;
            case 37:  /* Left arrow was pressed */
                if (player.x - 32 >= 0 && gameMap[1][player.yPos][player.xPos - 1].blocked !== true) {
                    
                    player.xPos -= 1;
                }
                break;
            case 39:  /* Right arrow was pressed */
                if (player.x + 32 < CANVAS_WIDTH && gameMap[1][player.yPos][player.xPos + 1].blocked !== true) {
                    
                    player.xPos += 1;
                }
                break;
        }
        console.log(player.xPos + ", " + player.yPos)
    }

})();
