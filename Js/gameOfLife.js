// The html element.
class Cgolpitch extends HTMLElement {
    /**
     *
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.mouseOverDiv = this.mouseOverDiv.bind(this);
        this.onResizeEvent = this.onResizeEvent.bind(this);
        this.startGame = this.startGame.bind(this);
        this.pauseGame = this.pauseGame.bind(this);
        this.clearGame = this.clearGame.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        window.addEventListener("resize", this.onResizeEvent);
        this.generationCount = 0;
        this.init = false;
        console.log("cgol initialised");
    }
    // The observed attributes.
    static get observedAttributes() { return ["width", "height"]; }
    // This method is called when the website has been loaded.
    connectedCallback() {
        this.width = +this.getAttribute("width");
        this.height = +this.getAttribute("height");
        console.log(this.width);
        console.log(this.height);
        this.shadowRoot.innerHTML = `
        <style>
            #field{
                display: grid;
            }
        </style>
        <div id="field"></div>
        <button id="start">Start</button>
        <button id="stop">Stop</button>
        <button id="clear">Clear</button>
        `;
        this.shadowRoot.getElementById("start").addEventListener("click", this.startGame);
        this.shadowRoot.getElementById("stop").addEventListener("click", this.pauseGame);
        this.shadowRoot.getElementById("clear").addEventListener("click", this.clearGame);
        this.createGrid();
    }
    // This method is called when the website has been disconnected.
    disconnectedCallback() {
        console.log("Disconnected");
    }
    // This method is called when a attribute has been changed.
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (this.init === false) {
            console.log("not initialised");
            return;
        }
        if (attrName === "width") {
            this.widthProp = +newVal;
        }
        else if (attrName === "height") {
            this.heightProp = +newVal;
        }
    }
    startGame() {
        this.interv = setInterval(this.gameLoop, 500);
    }
    pauseGame() {
        clearInterval(this.interv);
    }
    clearGame() {
        clearInterval(this.interv);
        this.generationCount = 0;
        this.createGrid();
    }
    loadLevel() {
        // Load Level
    }
    onResizeEvent() {
        console.log("resize");
        this.createGrid();
        return;
    }
    // This method creates a dom grid.
    createGrid() {
        console.log("CreateGrid");
        this.cells = this.Create2DArray(this.height, this.width);
        const windoWidth = window.innerWidth - 20;
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
                this.cells[index][j] = 0;
                temp.addEventListener("click", this.mouseOverDiv);
                container.appendChild(temp);
            }
        }
        this.init = true;
    }
    resizeGrid() {
        const windoWidth = window.innerWidth - 20;
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
                    temp.style.backgroundColor = "white";
                }
                else if (this.cells1[index][j] === 1) {
                    temp.style.backgroundColor = "black";
                }
                else {
                    temp.style.backgroundColor = "greem";
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
            t.style.backgroundColor = "black";
        }
        else {
            this.cells[Number(y)][Number(x)] = 0;
            t.style.backgroundColor = "white";
        }
        console.log(t.id);
    }
    // The main game loop.
    gameLoop() {
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
                if (upperNeighbour === 1) {
                    liveCellCount++;
                }
                if (downerNeighbour === 1) {
                    liveCellCount++;
                }
                if (leftNeighbour === 1) {
                    liveCellCount++;
                }
                if (rightNeighbour === 1) {
                    liveCellCount++;
                }
                const t = this.cells1[index][j];
                if (liveCellCount < 2) {
                    if (t === 1) {
                        this.cells1[index][j] = 2;
                    }
                }
                if (liveCellCount === 3) {
                    this.cells1[index][j] = 1;
                }
                if (liveCellCount > 3) {
                    if (t === 1) {
                        this.cells1[index][j] = 2;
                    }
                }
            }
        }
        this.resizeGrid();
        this.generationCount++;
    }
    // This method creates a 2d number array.
    Create2DArray(height, width) {
        const arr = new Array(height);
        for (let i = 0; i < height; i++) {
            arr[i] = new Array(width);
        }
        return arr;
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
        this.createGrid();
        console.log("Width changed to " + this.width);
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
        this.createGrid();
        this.width = height;
        console.log("Height changed to " + this.height);
    }
}
window.customElements.define("cgol-pitch", Cgolpitch);
//# sourceMappingURL=gameOfLife.js.map