class Cgolpitch extends HTMLElement {
    /**
     *
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.mouseOverDiv = this.mouseOverDiv.bind(this);
        console.log("cgol initialised");
    }
    static get observedAttributes() { return ["width", "height"]; }
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
        <div id="field">
        </div>
        `;
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
        const windoWidth = window.innerWidth - 20;
        const windowHeight = window.innerHeight;
        const cellWidth = windoWidth / this.width;
        const container = this.shadowRoot.getElementById("field");
        container.style.gridTemplateColumns = `repeat(${this.width}, ${cellWidth}px)`;
        container.style.gridTemplateRows = `repeat(${this.height}, ${cellWidth}px)`;
        container.style.width = windoWidth.toString() + "px";
        container.style.width = windowHeight.toString() + "px";
        for (let index = 0; index < this.height; index++) {
            for (let j = 0; j < this.width; j++) {
                const temp = document.createElement("div");
                temp.style.border = "1px solid #0000FF";
                temp.style.width = "100%";
                temp.style.height = "100%";
                temp.setAttribute("PosY", index.toString());
                temp.setAttribute("PosX", j.toString());
                this.cells[index][j] = 0;
                temp.addEventListener("mouseover", this.mouseOverDiv);
                container.appendChild(temp);
            }
        }
    }
    mouseOverDiv(e) {
        let t = e.target;
        let x = t.getAttribute("PosX");
        let y = t.getAttribute("PosY");
        t.style.backgroundColor = "black";
        console.log(t.id);
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
            // throw new Error("Error value has to be atleast 10");
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
            //throw new Error("Error value has to be atleast 10");
        }
        this.createGrid();
        this.width = height;
        console.log("Height changed to " + this.height);
    }
}
window.customElements.define("cgol-pitch", Cgolpitch);
//# sourceMappingURL=gameOfLife.js.map