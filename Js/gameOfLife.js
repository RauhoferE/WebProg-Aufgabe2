class Cgolpitch extends HTMLElement {
    /**
     *
     */
    constructor() {
        super();
        console.log("cgol initialised");
    }
    static get observedAttributes() { return ["width", "height"]; }
    connectedCallback() {
        this.width = +this.getAttribute("width");
        this.height = +this.getAttribute("height");
        console.log(this.width);
        console.log(this.height);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
        </style>
        `;
        console.log(this.shadowRoot.innerHTML);
        this.createGrid();
    }
    disconnectedCallback() {
        console.log("Disconnected");
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        console.log("callback" + newVal);
        if (newVal === "") {
            console.log("null");
            return;
        }
        if (attrName === "width") {
            this.widthProp = +newVal;
        }
        else if (attrName === "height") {
            this.heightProp = +newVal;
        }
    }
    createGrid() {
        this.cells = this.Create2DArray(this.height, this.width);
        const windoWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const cellWidth = windoWidth / this.width;
        const cellHeight = windowHeight / this.height;
        const container = document.createElement("div");
        for (let index = 0; index < this.height; index++) {
            for (let j = 0; j < this.width; j++) {
                const temp = document.createElement("div");
                temp.style.width = cellWidth.toString();
                temp.style.height = cellHeight.toString();
                temp.style.marginLeft = (j * cellWidth).toString();
                temp.style.marginTop = (index * cellHeight).toString();
                this.cells[index][j] = 0;
                temp.addEventListener("mouseover", function (event) {
                    // TODO Variable außerhalb von klasse definieren
                    let t = event.target;
                    // TODO: Geht nicht kann keine objekte von innerhalb rufen!!!!!!!!!!!!!!!!!!!!!
                    console.log(t.id);
                });
                container.appendChild(temp);
            }
        }
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(container);
    }
    Create2DArray(height, width) {
        const arr = new Array(height);
        for (let i = 0; i < height; i++) {
            arr[i] = new Array(width);
        }
        return arr;
    }
    get cells() {
        return this.cells1;
    }
    set cells(value) {
        this.cells1 = value;
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
window.customElements.define("cgol-pitch", Cgolpitch);
//# sourceMappingURL=gameOfLife.js.map