class cgolpitch extends HTMLElement {
    /**
     *
     */
    constructor() {
        super();
        console.log("cgol initialised");
    }
    static get observedAttributes() { return ["width", "height"]; }
    connectedCallback() {
        this.width = +this.getAttribute('width');
        this.height = +this.getAttribute('height');
        this.isRunning = false;
        console.log(this.width);
        console.log(this.height);
        this.attachShadow({ mode: 'open' });
        this.createGrid();
    }
    disconnectedCallback() {
        console.log("Disconnected");
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        console.log("callback");
        if (newVal === null) {
            return;
        }
        if (attrName === 'width') {
            this.widthProp = +newVal;
        }
        else if (attrName === 'height') {
            this.heightProp = +newVal;
        }
    }
    createGrid() {
        var widthAndHeight = 80 / this.width;
        console.log(widthAndHeight);
        this.shadowRoot.innerHTML = `
        <style>
        .dead{
            background: white;
            width: ${widthAndHeight}vw;
            height: ${widthAndHeight}vw;
            border: 0.05vw;
            border-color: grey;
            float: left;
            color: white;
            border-style: solid;
        }
        .alive{
            background: blue;
            width: ${widthAndHeight}vw;
            height: ${widthAndHeight}vw;
            border: 0.05vw;
            border-color: grey;
            float: left;
            color: white;
            border-style: solid;
        }
        .container{
            margin-left:10vw;
            margin-right: 10vw;
        }
        </style>
        `;
        this.cells = this.Create2DArray(this.height, this.width);
        var container = document.createElement("div");
        container.className = ("container");
        for (let index = 1; index <= this.height; index++) {
            for (let j = 1; j <= this.width; j++) {
                var temp = document.createElement("div");
                temp.setAttribute("id", (index).toString());
                temp.setAttribute("id2", (j).toString());
                temp.setAttribute("class", "dead");
                this.cells[index - 1][j - 1] = false;
                temp.addEventListener("mouseover", function (event) {
                    var t = event.target;
                    t.setAttribute("class", "alive");
                    //TODO: Geht nicht kann keine objekte von innerhalb rufen!!!!!!!!!!!!!!!!!!!!!
                    var root = t.parentElement;
                    root.cells[+t.getAttribute("id") - 1][+t.getAttribute("id2") - 1] = true;
                    console.log(t.id);
                });
                container.appendChild(temp);
            }
        }
        this.shadowRoot.appendChild(container);
    }
    Create2DArray(height, width) {
        var arr = new Array(height);
        for (var i = 0; i < height; i++) {
            arr[i] = new Array(width);
        }
        return arr;
    }
    start() {
        while (this.isRunning) {
        }
    }
    get cells() {
        return this._cells;
    }
    set cells(value) {
        this._cells = value;
    }
    get widthProp() {
        return this.width;
    }
    set widthProp(width) {
        if (width < 10) {
            throw new Error("Error value has to be atleast 10");
        }
        this.width = width;
        this.createGrid();
        console.log("Width changed to " + this.width);
    }
    get heightProp() {
        return this.height;
    }
    set heightProp(height) {
        if (height < 10) {
            throw new Error("Error value has to be atleast 10");
        }
        this.createGrid();
        this.width = height;
        console.log("Height changed to " + this.height);
    }
}
;
class cell {
    /**
     *
     */
    constructor(leftNeighbor) {
        this.leftNeighbor = leftNeighbor;
        this.downNeighbor = null;
        this.rightNeighbor = null;
        this.upNeighbor = null;
        this.isAlive = false;
        this.wasAliveAtSomePoint = false;
    }
}
window.customElements.define('cgol-pitch', cgolpitch);
