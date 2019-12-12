// The html element.
class Cgolpitch extends HTMLElement {
    // The constructor of the element.
    constructor() {
        super();
        // The audio played on the website.
        this.audioElement = new Audio("mp3/Chad_Crouch_-_Algorithms.mp3");
        this.attachShadow({ mode: "open" });
        this.mouseOverDiv = this.mouseOverDiv.bind(this);
        this.onResizeEvent = this.onResizeEvent.bind(this);
        this.startGame = this.startGame.bind(this);
        this.pauseGame = this.pauseGame.bind(this);
        this.clearGame = this.clearGame.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.setHeight = this.setHeight.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.loadLevel = this.loadLevel.bind(this);
        this.changeColorSpectrum01 = this.changeColorSpectrum01.bind(this);
        this.changeColorSpectrum02 = this.changeColorSpectrum02.bind(this);
        this.randomiseArray = this.randomiseArray.bind(this);
        window.addEventListener("resize", this.onResizeEvent);
        this.generationCount = 0;
        this.init = false;
        this.colorDeadcells = "white";
        this.colorLiveCells = "black";
        this.colorCellsWhoDied = "green";
    }
    // The observed attributes.
    static get observedAttributes() {
        return ["width", "height"];
    }
    // This method is called when the website has been loaded.
    connectedCallback() {
        this.width = +this.getAttribute("width");
        this.height = +this.getAttribute("height");
        this.shadowRoot.innerHTML = `
        <style>
            #field{
                display: grid;
            }
        </style>
        <div style="margin:20px;">
        <div id="field"></div>
        <button id="start">Start</button>
        <button id="stop">Stop</button>
        <button id="clear">Clear</button>
        <span>Generation: </span>
        <span id="count">0</span>
        <div style="margin-top:10px;float: right;position: relative;">
        <span>Width: </span>
        <textarea id="width"></textarea>
        <span>Height: </span>
        <textarea id="height" ></textarea>
        <span>Level: </span>
        <textarea id="level" cols="60"></textarea>
        </div>
        <button id="loadlevel">Load Level</button>
        <button id="changeColor01">Change Color to #1</button>
        <button id="changeColor02">Change Color to #2</button>
        <button id="randomise">Randomise Cells</button>
        </div>
        `;
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
    }
    // This method is called when a attribute has been changed.
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (this.init === false) {
            return;
        }
        if (attrName === "width") {
            this.widthProp = +newVal;
        }
        else if (attrName === "height") {
            this.heightProp = +newVal;
        }
    }
    // This method starts or resumes the game loop.
    startGame() {
        this.audioElement.play();
        this.interv = setInterval(this.gameLoop, 100);
    }
    // This method pauses the game.
    pauseGame() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        clearInterval(this.interv);
    }
    // This method resets the game.
    clearGame() {
        clearInterval(this.interv);
        this.generationCount = 0;
        this.setGenerationCount(this.generationCount);
        this.createGrid();
    }
    // This method loads the level from the textbox.
    loadLevel() {
        this.pauseGame();
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        const s = this.shadowRoot.getElementById("level");
        const rows = s.value.split("\n");
        let longestRow = 10;
        let height = 10;
        let currentHeight = 0;
        rows.forEach((element) => {
            currentHeight++;
            if (element.length > 10) {
                longestRow = element.length;
            }
        });
        if (currentHeight > height) {
            height = currentHeight;
        }
        rows.forEach((element) => {
            if (element.length < longestRow) {
                element = element + "0".repeat(longestRow - element.length);
            }
        });
        if (rows.length < height) {
            for (let r = rows.length; r < height; r++) {
                rows.push("0".repeat(longestRow));
            }
        }
        const arr = this.Create2DArray(height, longestRow);
        for (let index = 0; index < arr.length; index++) {
            for (let j = 0; j < arr[index].length; j++) {
                arr[index][j] = 0;
            }
        }
        let temp = 0;
        rows.forEach((element) => {
            for (let index = 0; index < element.length; index++) {
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
    }
    // This method is fired when the window is resized.
    onResizeEvent() {
        this.resizeGrid();
        return;
    }
    // This method creates a dom grid.
    createGrid() {
        this.cells = this.Create2DArray(this.height, this.width);
        const windoWidth = window.innerWidth - 40;
        const windowHeight = window.innerHeight;
        const cellWidth = windoWidth / this.width;
        const container = this.shadowRoot.getElementById("field");
        container.style.gridTemplateColumns = `repeat(${this.width}, ${cellWidth}px)`;
        container.style.gridTemplateRows = `repeat(${this.height}, ${cellWidth}px)`;
        container.style.width = windoWidth.toString() + "px";
        container.style.width = windowHeight.toString() + "px";
        // Delete all childs from container
        while (container.firstChild != null) {
            container.removeChild(container.firstChild);
        }
        for (let index = 0; index < this.height; index++) {
            for (let j = 0; j < this.width; j++) {
                const temp = document.createElement("div");
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
    }
    // This method sets the number of columns of the grid.
    setWidth(event) {
        const t = event.target;
        if (isNaN(Number(t.value))) {
            alert("Please put in a number for the width.");
            return;
        }
        this.widthProp = Number(t.value);
    }
    // This method sets the number of columns of the grid.
    setHeight(event) {
        const t = event.target;
        if (isNaN(Number(t.value))) {
            alert("Please put in a number for the height.");
            return;
        }
        this.heightProp = Number(t.value);
    }
    // This method resizes the current grid.
    resizeGrid() {
        const windoWidth = window.innerWidth - 40;
        const windowHeight = window.innerHeight;
        const cellWidth = windoWidth / this.width;
        const container = this.shadowRoot.getElementById("field");
        container.style.gridTemplateColumns = `repeat(${this.width}, ${cellWidth}px)`;
        container.style.gridTemplateRows = `repeat(${this.height}, ${cellWidth}px)`;
        container.style.width = windoWidth.toString() + "px";
        container.style.width = windowHeight.toString() + "px";
        // Delete all childs from container
        while (container.firstChild != null) {
            container.removeChild(container.firstChild);
        }
        for (let index = 0; index < this.height; index++) {
            for (let j = 0; j < this.width; j++) {
                const temp = document.createElement("div");
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
    }
    // This event fires when one of the grid elements is clicked.
    mouseOverDiv(e) {
        const t = e.target;
        const x = t.getAttribute("PosX");
        const y = t.getAttribute("PosY");
        // Checken ob zelle schon tot oder lebendig ist
        if (this.cells[Number(y)][Number(x)] === 0) {
            this.cells[Number(y)][Number(x)] = 1;
            t.style.backgroundColor = this.colorLiveCells;
        }
        else {
            this.cells[Number(y)][Number(x)] = 0;
            t.style.backgroundColor = this.colorDeadcells;
        }
    }
    // This method pushes the generation count to the label.
    setGenerationCount(num) {
        this.shadowRoot.getElementById("count").innerText = String(this.generationCount);
    }
    // The main game loop.
    gameLoop() {
        const newArr = this.Create2DArray(this.height, this.width);
        for (let index = 0; index < newArr.length; index++) {
            for (let j = 0; j < newArr[index].length; j++) {
                newArr[index][j] = this.cells1[index][j];
            }
        }
        for (let index = 0; index < this.cells1.length; index++) {
            for (let j = 0; j < this.cells1[index].length; j++) {
                let liveCellCount = 0;
                let upperNeighbour = 0;
                let downerNeighbour = 0;
                let leftNeighbour = 0;
                let rightNeighbour = 0;
                let upperLeft = 0;
                let upperRight = 0;
                let downerLeft = 0;
                let downerRight = 0;
                if (index - 1 < 0 && j - 1 < 0) {
                    upperLeft = this.cells1[this.cells1.length - 1][this.cells1[index].length - 1];
                }
                else if (index - 1 < 0) {
                    upperLeft = this.cells1[this.cells1.length - 1][this.cells1[index].length - 1 - j];
                }
                else if (j - 1 < 0) {
                    upperLeft = this.cells1[index - 1][this.cells1[index].length - 1];
                }
                else {
                    upperLeft = this.cells1[index - 1][j - 1];
                }
                if (index + 1 > this.cells1.length - 1 && j - 1 < 0) {
                    downerLeft = this.cells1[0][this.cells1[index].length - 1];
                }
                else if (index + 1 > this.cells1.length - 1) {
                    downerLeft = this.cells1[0][this.cells1[index].length - 1 - j];
                }
                else if (j - 1 < 0) {
                    downerLeft = this.cells1[index + 1][this.cells1[index].length - 1];
                }
                else {
                    downerLeft = this.cells1[index + 1][j - 1];
                }
                if (index - 1 < 0 && j + 1 > this.cells1[index].length - 1) {
                    upperRight = this.cells1[this.cells1.length - 1][0];
                }
                else if (index - 1 < 0) {
                    upperRight = this.cells1[this.cells1.length - 1][1 + j];
                }
                else if (j + 1 > this.cells1[index].length - 1) {
                    upperRight = this.cells1[index - 1][0];
                }
                else {
                    upperRight = this.cells1[index - 1][j + 1];
                }
                if (index + 1 > this.cells1.length - 1 && j + 1 > this.cells1[index].length - 1) {
                    downerRight = this.cells1[0][0];
                }
                else if (index + 1 > this.cells1.length - 1) {
                    downerRight = this.cells1[0][j + 1];
                }
                else if (j + 1 > this.cells1[index].length - 1) {
                    downerRight = this.cells1[index + 1][0];
                }
                else {
                    downerRight = this.cells1[index + 1][j + 1];
                }
                // Downer Right
                if (index - 1 < 0) {
                    upperNeighbour = this.cells1[this.cells1.length - 1][j];
                }
                else {
                    upperNeighbour = this.cells1[index - 1][j];
                }
                if (index + 1 > this.cells1.length - 1) {
                    downerNeighbour = this.cells1[0][j];
                }
                else {
                    downerNeighbour = this.cells1[index + 1][j];
                }
                if (j - 1 < 0) {
                    leftNeighbour = this.cells1[index][this.cells1[index].length - 1];
                }
                else {
                    leftNeighbour = this.cells1[index][j - 1];
                }
                if (j + 1 > this.cells1[index].length - 1) {
                    rightNeighbour = this.cells1[index][0];
                }
                else {
                    rightNeighbour = this.cells1[index][j + 1];
                }
                let arrayNeighbour;
                arrayNeighbour = [upperNeighbour, downerNeighbour,
                    leftNeighbour, rightNeighbour, upperLeft, upperRight,
                    downerRight, downerLeft];
                arrayNeighbour.forEach((element) => {
                    if (element === 1) {
                        liveCellCount++;
                    }
                });
                const t = this.cells1[index][j];
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
            }
        }
        let areEqual = true;
        for (let index = 0; index < newArr.length; index++) {
            for (let j = 0; j < newArr[index].length; j++) {
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
    }
    // This method creates a 2d number array.
    Create2DArray(height, width) {
        const arr = new Array(height);
        for (let i = 0; i < height; i++) {
            arr[i] = new Array(width);
        }
        return arr;
    }
    // This method randomises the cells.
    randomiseArray() {
        this.pauseGame();
        const c = this.Create2DArray(this.heightProp, this.widthProp);
        for (let index = 0; index < c.length; index++) {
            for (let index2 = 0; index2 < c[index].length; index2++) {
                const val = Math.round(Math.random());
                c[index][index2] = val;
            }
        }
        this.cells1 = c;
        this.resizeGrid();
    }
    // This method changes the color spectrum.
    changeColorSpectrum01() {
        this.pauseGame();
        this.colorDeadcells = "#64E84A";
        this.colorLiveCells = "#52FFCE";
        this.colorCellsWhoDied = "#52D1FF";
        this.resizeGrid();
    }
    // This method also changes the color spectrum.
    changeColorSpectrum02() {
        this.pauseGame();
        this.colorDeadcells = "white";
        this.colorLiveCells = "black";
        this.colorCellsWhoDied = "green";
        this.resizeGrid();
    }
    // This method gets the number array.
    get cells() {
        return this.cells1;
    }
    // This method sets the number array.
    set cells(value) {
        this.cells1 = value;
    }
    // This method gets the width of the field.
    get widthProp() {
        return this.width;
    }
    // This method sets the width of the field.
    set widthProp(width) {
        if (width < 10) {
            width = 10;
        }
        this.width = width;
        this.shadowRoot.getElementById("width").innerText = String(this.width);
        this.resizeGrid();
    }
    // This method gets the height of the field.
    get heightProp() {
        return this.height;
    }
    // This method sets the height of the field.
    set heightProp(height) {
        if (height < 10) {
            height = 10;
        }
        this.height = height;
        this.shadowRoot.getElementById("height").innerText = String(this.height);
        this.resizeGrid();
    }
}
window.customElements.define("cgol-pitch", Cgolpitch);
//# sourceMappingURL=gameOfLife.js.map