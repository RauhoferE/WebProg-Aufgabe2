var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// The html element.
var Cgolpitch = /** @class */ (function (_super) {
    __extends(Cgolpitch, _super);
    // The constructor of the element.
    function Cgolpitch() {
        var _this = _super.call(this) || this;
        // The audio played on the website.
        _this.audioElement = new Audio("mp3/Chad_Crouch_-_Algorithms.mp3");
        _this.attachShadow({ mode: "open" });
        _this.mouseOverDiv = _this.mouseOverDiv.bind(_this);
        _this.onResizeEvent = _this.onResizeEvent.bind(_this);
        _this.startGame = _this.startGame.bind(_this);
        _this.pauseGame = _this.pauseGame.bind(_this);
        _this.clearGame = _this.clearGame.bind(_this);
        _this.setWidth = _this.setWidth.bind(_this);
        _this.setHeight = _this.setHeight.bind(_this);
        _this.gameLoop = _this.gameLoop.bind(_this);
        _this.loadLevel = _this.loadLevel.bind(_this);
        _this.changeColorSpectrum01 = _this.changeColorSpectrum01.bind(_this);
        _this.changeColorSpectrum02 = _this.changeColorSpectrum02.bind(_this);
        _this.randomiseArray = _this.randomiseArray.bind(_this);
        window.addEventListener("resize", _this.onResizeEvent);
        _this.generationCount = 0;
        _this.init = false;
        _this.colorDeadcells = "white";
        _this.colorLiveCells = "black";
        _this.colorCellsWhoDied = "green";
        return _this;
    }
    Object.defineProperty(Cgolpitch, "observedAttributes", {
        // The observed attributes.
        get: function () {
            return ["width", "height"];
        },
        enumerable: true,
        configurable: true
    });
    // This method is called when the website has been loaded.
    Cgolpitch.prototype.connectedCallback = function () {
        this.width = +this.getAttribute("width");
        this.height = +this.getAttribute("height");
        this.shadowRoot.innerHTML = "\n        <style>\n            #field{\n                display: grid;\n            }\n        </style>\n        <div style=\"margin:20px;\">\n        <div id=\"field\"></div>\n        <button id=\"start\">Start</button>\n        <button id=\"stop\">Stop</button>\n        <button id=\"clear\">Clear</button>\n        <span>Generation: </span>\n        <span id=\"count\">0</span>\n        <div style=\"margin-top:10px;float: right;position: relative;\">\n        <span>Width: </span>\n        <textarea id=\"width\"></textarea>\n        <span>Height: </span>\n        <textarea id=\"height\" ></textarea>\n        <span>Level: </span>\n        <textarea id=\"level\" cols=\"60\"></textarea>\n        </div>\n        <button id=\"loadlevel\">Load Level</button>\n        <button id=\"changeColor01\">Change Color to #1</button>\n        <button id=\"changeColor02\">Change Color to #2</button>\n        <button id=\"randomise\">Randomise Cells</button>\n        </div>\n        ";
        this.shadowRoot.getElementById("start").addEventListener("click", this.startGame);
        this.shadowRoot.getElementById("stop").addEventListener("click", this.pauseGame);
        this.shadowRoot.getElementById("clear").addEventListener("click", this.clearGame);
        this.shadowRoot.getElementById("width").addEventListener("change", this.setWidth);
        this.shadowRoot.getElementById("height").addEventListener("change", this.setHeight);
        this.shadowRoot.getElementById("loadlevel").addEventListener("click", this.loadLevel);
        this.shadowRoot.getElementById("changeColor01").addEventListener("click", this.changeColorSpectrum01);
        this.shadowRoot.getElementById("changeColor02").addEventListener("click", this.changeColorSpectrum02);
        this.shadowRoot.getElementById("randomise").addEventListener("click", this.randomiseArray);
        this.shadowRoot.getElementById("width").innerText = String(this.width);
        this.shadowRoot.getElementById("height").innerText = String(this.height);
        this.createGrid();
    };
    // This method is called when a attribute has been changed.
    Cgolpitch.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (this.init === false) {
            return;
        }
        if (attrName === "width") {
            this.widthProp = +newVal;
        }
        else if (attrName === "height") {
            this.heightProp = +newVal;
        }
    };
    // This method starts or resumes the game loop.
    Cgolpitch.prototype.startGame = function () {
        this.audioElement.play();
        this.interv = setInterval(this.gameLoop, 100);
    };
    // This method pauses the game.
    Cgolpitch.prototype.pauseGame = function () {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        clearInterval(this.interv);
    };
    // This method resets the game.
    Cgolpitch.prototype.clearGame = function () {
        clearInterval(this.interv);
        this.generationCount = 0;
        this.setGenerationCount(this.generationCount);
        this.createGrid();
    };
    // This method loads the level from the textbox.
    Cgolpitch.prototype.loadLevel = function () {
        this.pauseGame();
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        var s = this.shadowRoot.getElementById("level");
        var rows = s.value.split("\n");
        var longestRow = 10;
        var height = 10;
        var currentHeight = 0;
        rows.forEach(function (element) {
            currentHeight++;
            if (element.length > 10) {
                longestRow = element.length;
            }
        });
        if (currentHeight > height) {
            height = currentHeight;
        }
        rows.forEach(function (element) {
            if (element.length < longestRow) {
                element = element + "0".repeat(longestRow - element.length);
            }
        });
        if (rows.length < height) {
            for (var r = rows.length; r < height; r++) {
                rows.push("0".repeat(longestRow));
            }
        }
        var arr = this.Create2DArray(height, longestRow);
        for (var index = 0; index < arr.length; index++) {
            for (var j = 0; j < arr[index].length; j++) {
                arr[index][j] = 0;
            }
        }
        var temp = 0;
        rows.forEach(function (element) {
            for (var index = 0; index < element.length; index++) {
                if (element.charAt(index) === "1") {
                    arr[temp][index] = 1;
                }
                else {
                    arr[temp][index] = 0;
                }
            }
            temp++;
        });
        this.cells1 = arr;
        this.width = longestRow;
        this.height = height;
        this.resizeGrid();
    };
    // This method is fired when the window is resized.
    Cgolpitch.prototype.onResizeEvent = function () {
        this.resizeGrid();
        return;
    };
    // This method creates a dom grid.
    Cgolpitch.prototype.createGrid = function () {
        this.cells = this.Create2DArray(this.height, this.width);
        var windoWidth = window.innerWidth - 40;
        var windowHeight = window.innerHeight;
        var cellWidth = windoWidth / this.width;
        var container = this.shadowRoot.getElementById("field");
        container.style.gridTemplateColumns = "repeat(" + this.width + ", " + cellWidth + "px)";
        container.style.gridTemplateRows = "repeat(" + this.height + ", " + cellWidth + "px)";
        container.style.width = windoWidth.toString() + "px";
        container.style.width = windowHeight.toString() + "px";
        // Delete all childs from container
        while (container.firstChild != null) {
            container.removeChild(container.firstChild);
        }
        for (var index = 0; index < this.height; index++) {
            for (var j = 0; j < this.width; j++) {
                var temp = document.createElement("div");
                temp.style.border = "1px solid #0000FF";
                temp.style.width = "100%";
                temp.style.height = "100%";
                temp.style.backgroundColor = this.colorDeadcells;
                temp.setAttribute("PosY", index.toString());
                temp.setAttribute("PosX", j.toString());
                this.cells[index][j] = 0;
                temp.addEventListener("click", this.mouseOverDiv);
                container.appendChild(temp);
            }
        }
        this.init = true;
    };
    // This method sets the number of columns of the grid.
    Cgolpitch.prototype.setWidth = function (event) {
        var t = event.target;
        if (isNaN(Number(t.value))) {
            alert("Please put in a number for the width.");
            return;
        }
        this.widthProp = Number(t.value);
    };
    // This method sets the number of columns of the grid.
    Cgolpitch.prototype.setHeight = function (event) {
        var t = event.target;
        if (isNaN(Number(t.value))) {
            alert("Please put in a number for the height.");
            return;
        }
        this.heightProp = Number(t.value);
    };
    // This method resizes the current grid.
    Cgolpitch.prototype.resizeGrid = function () {
        var windoWidth = window.innerWidth - 40;
        var windowHeight = window.innerHeight;
        var cellWidth = windoWidth / this.width;
        var container = this.shadowRoot.getElementById("field");
        container.style.gridTemplateColumns = "repeat(" + this.width + ", " + cellWidth + "px)";
        container.style.gridTemplateRows = "repeat(" + this.height + ", " + cellWidth + "px)";
        container.style.width = windoWidth.toString() + "px";
        container.style.width = windowHeight.toString() + "px";
        // Delete all childs from container
        while (container.firstChild != null) {
            container.removeChild(container.firstChild);
        }
        for (var index = 0; index < this.height; index++) {
            for (var j = 0; j < this.width; j++) {
                var temp = document.createElement("div");
                temp.style.border = "1px solid #0000FF";
                temp.style.width = "100%";
                temp.style.height = "100%";
                temp.setAttribute("PosY", index.toString());
                temp.setAttribute("PosX", j.toString());
                if (this.cells1[index][j] === 0) {
                    temp.style.backgroundColor = this.colorDeadcells;
                }
                else if (this.cells1[index][j] === 1) {
                    temp.style.backgroundColor = this.colorLiveCells;
                }
                else {
                    temp.style.backgroundColor = this.colorCellsWhoDied;
                }
                temp.addEventListener("click", this.mouseOverDiv);
                container.appendChild(temp);
            }
        }
    };
    // This event fires when one of the grid elements is clicked.
    Cgolpitch.prototype.mouseOverDiv = function (e) {
        var t = e.target;
        var x = t.getAttribute("PosX");
        var y = t.getAttribute("PosY");
        // Checken ob zelle schon tot oder lebendig ist
        if (this.cells[Number(y)][Number(x)] === 0) {
            this.cells[Number(y)][Number(x)] = 1;
            t.style.backgroundColor = this.colorLiveCells;
        }
        else {
            this.cells[Number(y)][Number(x)] = 0;
            t.style.backgroundColor = this.colorDeadcells;
        }
    };
    // This method pushes the generation count to the label.
    Cgolpitch.prototype.setGenerationCount = function (num) {
        this.shadowRoot.getElementById("count").innerText = String(this.generationCount);
    };
    // The main game loop.
    Cgolpitch.prototype.gameLoop = function () {
        var newArr = this.Create2DArray(this.height, this.width);
        for (var index = 0; index < newArr.length; index++) {
            for (var j = 0; j < newArr[index].length; j++) {
                newArr[index][j] = this.cells1[index][j];
            }
        }
        for (var index = 0; index < this.cells1.length; index++) {
            var _loop_1 = function (j) {
                var liveCellCount = 0;
                var upperNeighbour = 0;
                var downerNeighbour = 0;
                var leftNeighbour = 0;
                var rightNeighbour = 0;
                var upperLeft = 0;
                var upperRight = 0;
                var downerLeft = 0;
                var downerRight = 0;
                if (index - 1 < 0 && j - 1 < 0) {
                    upperLeft = this_1.cells1[this_1.cells1.length - 1][this_1.cells1[index].length - 1];
                }
                else if (index - 1 < 0) {
                    upperLeft = this_1.cells1[this_1.cells1.length - 1][this_1.cells1[index].length - 1 - j];
                }
                else if (j - 1 < 0) {
                    upperLeft = this_1.cells1[index - 1][this_1.cells1[index].length - 1];
                }
                else {
                    upperLeft = this_1.cells1[index - 1][j - 1];
                }
                if (index + 1 > this_1.cells1.length - 1 && j - 1 < 0) {
                    downerLeft = this_1.cells1[0][this_1.cells1[index].length - 1];
                }
                else if (index + 1 > this_1.cells1.length - 1) {
                    downerLeft = this_1.cells1[0][this_1.cells1[index].length - 1 - j];
                }
                else if (j - 1 < 0) {
                    downerLeft = this_1.cells1[index + 1][this_1.cells1[index].length - 1];
                }
                else {
                    downerLeft = this_1.cells1[index + 1][j - 1];
                }
                if (index - 1 < 0 && j + 1 > this_1.cells1[index].length - 1) {
                    upperRight = this_1.cells1[this_1.cells1.length - 1][0];
                }
                else if (index - 1 < 0) {
                    upperRight = this_1.cells1[this_1.cells1.length - 1][1 + j];
                }
                else if (j + 1 > this_1.cells1[index].length - 1) {
                    upperRight = this_1.cells1[index - 1][0];
                }
                else {
                    upperRight = this_1.cells1[index - 1][j + 1];
                }
                if (index + 1 > this_1.cells1.length - 1 && j + 1 > this_1.cells1[index].length - 1) {
                    downerRight = this_1.cells1[0][0];
                }
                else if (index + 1 > this_1.cells1.length - 1) {
                    downerRight = this_1.cells1[0][j + 1];
                }
                else if (j + 1 > this_1.cells1[index].length - 1) {
                    downerRight = this_1.cells1[index + 1][0];
                }
                else {
                    downerRight = this_1.cells1[index + 1][j + 1];
                }
                // Downer Right
                if (index - 1 < 0) {
                    upperNeighbour = this_1.cells1[this_1.cells1.length - 1][j];
                }
                else {
                    upperNeighbour = this_1.cells1[index - 1][j];
                }
                if (index + 1 > this_1.cells1.length - 1) {
                    downerNeighbour = this_1.cells1[0][j];
                }
                else {
                    downerNeighbour = this_1.cells1[index + 1][j];
                }
                if (j - 1 < 0) {
                    leftNeighbour = this_1.cells1[index][this_1.cells1[index].length - 1];
                }
                else {
                    leftNeighbour = this_1.cells1[index][j - 1];
                }
                if (j + 1 > this_1.cells1[index].length - 1) {
                    rightNeighbour = this_1.cells1[index][0];
                }
                else {
                    rightNeighbour = this_1.cells1[index][j + 1];
                }
                var arrayNeighbour = void 0;
                arrayNeighbour = [upperNeighbour, downerNeighbour,
                    leftNeighbour, rightNeighbour, upperLeft, upperRight,
                    downerRight, downerLeft];
                arrayNeighbour.forEach(function (element) {
                    if (element === 1) {
                        liveCellCount++;
                    }
                });
                var t = this_1.cells1[index][j];
                if (liveCellCount < 2) {
                    if (t === 1) {
                        newArr[index][j] = 2;
                    }
                }
                if (liveCellCount === 3) {
                    newArr[index][j] = 1;
                }
                if (liveCellCount > 3) {
                    if (t === 1) {
                        newArr[index][j] = 2;
                    }
                }
            };
            var this_1 = this;
            for (var j = 0; j < this.cells1[index].length; j++) {
                _loop_1(j);
            }
        }
        var areEqual = true;
        for (var index = 0; index < newArr.length; index++) {
            for (var j = 0; j < newArr[index].length; j++) {
                if (newArr[index][j] !== this.cells1[index][j]) {
                    areEqual = false;
                    break;
                }
            }
        }
        if (areEqual && this.generationCount !== 0) {
            this.pauseGame();
            return;
        }
        this.cells1 = newArr;
        this.resizeGrid();
        this.generationCount++;
        this.setGenerationCount(this.generationCount);
    };
    // This method creates a 2d number array.
    Cgolpitch.prototype.Create2DArray = function (height, width) {
        var arr = new Array(height);
        for (var i = 0; i < height; i++) {
            arr[i] = new Array(width);
        }
        return arr;
    };
    // This method randomises the cells.
    Cgolpitch.prototype.randomiseArray = function () {
        this.pauseGame();
        var c = this.Create2DArray(this.heightProp, this.widthProp);
        for (var index = 0; index < c.length; index++) {
            for (var index2 = 0; index2 < c[index].length; index2++) {
                var val = Math.round(Math.random());
                c[index][index2] = val;
            }
        }
        this.cells1 = c;
        this.resizeGrid();
    };
    // This method changes the color spectrum.
    Cgolpitch.prototype.changeColorSpectrum01 = function () {
        this.pauseGame();
        this.colorDeadcells = "#64E84A";
        this.colorLiveCells = "#52FFCE";
        this.colorCellsWhoDied = "#52D1FF";
        this.resizeGrid();
    };
    // This method also changes the color spectrum.
    Cgolpitch.prototype.changeColorSpectrum02 = function () {
        this.pauseGame();
        this.colorDeadcells = "white";
        this.colorLiveCells = "black";
        this.colorCellsWhoDied = "green";
        this.resizeGrid();
    };
    Object.defineProperty(Cgolpitch.prototype, "cells", {
        // This method gets the number array.
        get: function () {
            return this.cells1;
        },
        // This method sets the number array.
        set: function (value) {
            this.cells1 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cgolpitch.prototype, "widthProp", {
        // This method gets the width of the field.
        get: function () {
            return this.width;
        },
        // This method sets the width of the field.
        set: function (width) {
            if (width < 10) {
                width = 10;
            }
            this.width = width;
            this.shadowRoot.getElementById("width").innerText = String(this.width);
            this.resizeGrid();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cgolpitch.prototype, "heightProp", {
        // This method gets the height of the field.
        get: function () {
            return this.height;
        },
        // This method sets the height of the field.
        set: function (height) {
            if (height < 10) {
                height = 10;
            }
            this.height = height;
            this.shadowRoot.getElementById("height").innerText = String(this.height);
            this.resizeGrid();
        },
        enumerable: true,
        configurable: true
    });
    return Cgolpitch;
}(HTMLElement));
window.customElements.define("cgol-pitch", Cgolpitch);
