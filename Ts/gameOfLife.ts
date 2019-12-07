// The html element.
class Cgolpitch extends HTMLElement {

    // The width of the field.
    private width: number;

    // The height of the field.
    private height: number;

    // The cell array.
    // Cells who are dead are 0.
    // Cells who are alive are 1.
    // Cells who were alive at one point are 2.
    private cells1: number[][];

    public generationCount: number;

    private interv: number;

    private init: boolean;

    // The observed attributes.
    public static get observedAttributes() { return ["width", "height"]; }
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
        this.setWidth = this.setWidth.bind(this);
        this.setHeight = this.setHeight.bind(this);
        this.gameLoop=this.gameLoop.bind(this);
        window.addEventListener("resize", this.onResizeEvent);
        this.generationCount = 0;
        this.init = false;
        console.log("cgol initialised");
    }

    // This method is called when the website has been loaded.
    public connectedCallback(): void {
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
        <textarea id="level" cols="${this.width}"></textarea>
        </div>
        <button id="loadlevel">Load Level</button>
        </div>
        `
            ;
        this.shadowRoot.getElementById("start").addEventListener("click", this.startGame);
        this.shadowRoot.getElementById("stop").addEventListener("click", this.pauseGame);
        this.shadowRoot.getElementById("clear").addEventListener("click", this.clearGame);
        this.shadowRoot.getElementById("width").addEventListener("change", this.setWidth);
        this.shadowRoot.getElementById("height").addEventListener("change", this.setHeight);
        this.shadowRoot.getElementById("width").innerText = String(this.width);
        this.shadowRoot.getElementById("height").innerText = String(this.height);

        this.createGrid();

    }

    // This method is called when the website has been disconnected.
    public disconnectedCallback(): void {
        console.log("Disconnected");
    }

    // This method is called when a attribute has been changed.
    public attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
        if (this.init === false) {
            console.log("not initialised");

            return;
        }

        if (attrName === "width") {
            this.widthProp = +newVal;
        } else if (attrName === "height") {
            this.heightProp = +newVal;
        }
    }

    public startGame(): void {
        this.interv = setInterval(this.gameLoop, 100);
    }

    public pauseGame(): void {
        clearInterval(this.interv);
    }

    public clearGame(): void {
        clearInterval(this.interv);
        this.generationCount = 0;
        this.setGenerationCount(this.generationCount);
        this.createGrid();
    }

    public loadLevel(): void {
        // Load Level
    }

    public onResizeEvent(): (this: Window, ev: UIEvent) => any {
        console.log("resize");

        this.resizeGrid();
        return;
    }

    // This method creates a dom grid.
    private createGrid(): void {
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

    private setWidth(event: Event): void{
        const t = event.target as HTMLInputElement;
        if (isNaN(Number(t.value))) {
            alert("Please put in a number for the width.");
            return;
        }
        
        this.widthProp = Number(t.value);
    }

    private setHeight(event: Event): void{
        const t = event.target as HTMLInputElement;
        if (isNaN(Number(t.value))) {
            alert("Please put in a number for the height.");
            return;
        }
        this.heightProp = Number(t.value);
    }

    private resizeGrid(): void{
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
                } else if (this.cells1[index][j] === 1) {
                    temp.style.backgroundColor = "black";
                } else {
                    temp.style.backgroundColor = "green";
                }
                temp.addEventListener("click", this.mouseOverDiv);
                container.appendChild(temp);
            }
        }
    }

    // This event fires when one of the grid elements is clicked.
    private mouseOverDiv(e) {
        const t = e.target as HTMLElement;
        const x = t.getAttribute("PosX");
        const y = t.getAttribute("PosY");

        // Checken ob zelle schon tot oder lebendig ist

        if (this.cells[Number(y)][Number(x)] === 0) {
            this.cells[Number(y)][Number(x)] = 1;
            t.style.backgroundColor = "black";
        } else {
            this.cells[Number(y)][Number(x)] = 0;
            t.style.backgroundColor = "white";
        }

        console.log(y + " " + x);
    }

    private setGenerationCount(num: number): void{
        this.shadowRoot.getElementById("count").innerText = String(this.generationCount);
    }

    // The main game loop.
    private gameLoop(): void {
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
                }else if (index - 1 < 0) {
                    upperLeft = this.cells1[this.cells1.length - 1][this.cells1[index].length - 1 - j];
                }else if (j - 1 < 0) {
                    upperLeft = this.cells1[index - 1][this.cells1[index].length - 1];
                }else{
                    upperLeft = this.cells1[index - 1][j - 1];
                }

                if (index + 1 > this.cells1.length - 1 && j - 1 < 0) {
                    downerLeft = this.cells1[0][this.cells1[index].length - 1];
                }else if (index + 1 > this.cells1.length - 1) {
                    downerLeft = this.cells1[0][this.cells1[index].length - 1 - j];
                }else if (j - 1 < 0) {
                    downerLeft = this.cells1[index + 1][this.cells1[index].length - 1];
                }else{
                    downerLeft = this.cells1[index + 1][j - 1];
                }

                if (index - 1 < 0 && j + 1 > this.cells1[index].length - 1) {
                    upperRight = this.cells1[this.cells1.length - 1][0];
                }else if (index - 1 < 0) {
                    upperRight = this.cells1[this.cells1.length - 1][1 + j];
                }else if (j + 1 > this.cells1[index].length - 1) {
                    upperRight = this.cells1[index - 1][0];
                }else{
                    upperRight = this.cells1[index - 1][j + 1];
                }

                if (index + 1 > this.cells1.length - 1 && j + 1 > this.cells1[index].length - 1) {
                    downerRight = this.cells1[0][0];
                }else if (index + 1 > this.cells1.length - 1) {
                    downerRight = this.cells1[0][j + 1];
                }else if (j + 1 > this.cells1[index].length - 1) {
                    downerRight = this.cells1[index + 1][0];
                }else{
                    downerRight = this.cells1[index + 1][j + 1];
                }

                // Downer Right

                if (index - 1 < 0) {
                    upperNeighbour = this.cells1[this.cells1.length - 1][j];
                } else {
                    upperNeighbour = this.cells1[index - 1][j];
                }

                if (index + 1 > this.cells1.length - 1) {
                    downerNeighbour = this.cells1[0][j];
                } else {
                    downerNeighbour = this.cells1[index + 1][j];
                }

                if (j - 1 < 0) {
                    leftNeighbour = this.cells1[index][this.cells1[index].length - 1];
                } else {
                    leftNeighbour = this.cells1[index][j - 1];
                }

                if (j + 1 > this.cells1[index].length - 1) {
                    rightNeighbour = this.cells1[index][0];
                } else {
                    rightNeighbour = this.cells1[index][j + 1];
                }

                let arrayNeighbour: Number[];
                arrayNeighbour = [upperNeighbour, downerNeighbour,
                    leftNeighbour, rightNeighbour, upperLeft, upperRight,
                    downerRight, downerLeft];

                arrayNeighbour.forEach(element => {
                    if (element === 1) {
                        liveCellCount++;
                    }
                });

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

        this.setGenerationCount(this.generationCount);
    }

    // This method creates a 2d number array.
    private Create2DArray(height: number, width: number): number[][] {
        const arr = new Array(height);

        for (let i = 0; i < height; i++) {
            arr[i] = new Array(width);
        }

        return arr;
    }

    // This method gets the number array.
    public get cells(): number[][] {
        return this.cells1;
    }

    // This method sets the number array.
    public set cells(value: number[][]) {
        this.cells1 = value;
    }

    // This method gets the width of the field.
    public get widthProp(): number {
        return this.width;
    }

    // This method sets the width of the field.
    public set widthProp(width: number) {
        if (width < 10) {
            width = 10;
        }

        this.width = width;
        this.shadowRoot.getElementById("width").innerText = String(this.width);
        this.resizeGrid();
        console.log("Width changed to " + this.width);
    }

    // This method gets the height of the field.
    public get heightProp(): number {
        return this.height;
    }

    // This method sets the height of the field.
    public set heightProp(height: number) {
        if (height < 10) {
            height = 10;
        }

        this.height = height;
        this.shadowRoot.getElementById("height").innerText = String(this.height);
        this.resizeGrid();
        console.log("Height changed to " + this.height);
    }
}

window.customElements.define("cgol-pitch", Cgolpitch);
