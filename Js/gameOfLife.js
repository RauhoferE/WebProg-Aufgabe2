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
        console.log(this.width);
        console.log(this.height);
        this.attachShadow({ mode: 'open' });
        //TODO: button clicked wird in shadow dom nicht erkannt
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
        this.shadowRoot.innerHTML = `
        <style>
        .dead{
            background: white;
            width: 1vw;
            height: 1vw;
            border: 0.05vw;
            border-color: grey;
            float: left;
            color: white;
            border-style: solid;
        }
        .alive{
            background: blue;
            width: 1vw;
            height: 1vw;
            border: 1vw;
        }
        </style>
        `;
        for (let index = 0; index < this.height; index++) {
            var row = document.createElement("div");
            for (let j = 0; j < this.width; j++) {
                var temp = document.createElement("div");
                temp.setAttribute("class", "dead");
                row.appendChild(temp);
            }
            this.shadowRoot.appendChild(row);
        }
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
