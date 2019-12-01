class Cgolpitch extends HTMLElement {
    private width: number;
    private height: number;
    private cells1: number[][];

    public static get observedAttributes() { return ["width", "height"]; }
    /**
     *
     */
    constructor() {
        super();
        console.log("cgol initialised");
    }

    public connectedCallback(): void {
        this.width = +this.getAttribute("width");
        this.height = +this.getAttribute("height");
        console.log(this.width);
        console.log(this.height);
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
        </style>
        `
        ;
        this.createGrid();
    }

    public disconnectedCallback(): void {
        console.log("Disconnected");
    }
    public attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
        console.log("callback" + newVal);
        if (newVal === "") {
            console.log("null");

            return;
        }

        if (attrName === "width") {
          this.widthProp = +newVal;
      } else if (attrName === "height") {
          this.heightProp = +newVal;
      }
    }

    public createGrid() {

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
                temp.addEventListener("mouseover", function(event) {
                    // TODO Variable außerhalb von klasse definieren
                    let t = event.target as Element;
                    // TODO: Geht nicht kann keine objekte von innerhalb rufen!!!!!!!!!!!!!!!!!!!!!
                    console.log(t.id);
                });
                container.appendChild(temp);
            }
        }

        console.log(this.shadowRoot);
        
        this.shadowRoot.appendChild(container);
    }

    public Create2DArray(height: number, width: number): number[][] {
        const arr = new Array(height);

        for (let i = 0; i < height; i++) {
           arr[i] = new Array(width);
        }

        return arr;
    }

    public get cells(): number[][] {
        return this.cells1;
    }
    public set cells(value: number[][]) {
        this.cells1 = value;
    }

    public get widthProp(): number {
        return this.width;
    }

    public set widthProp(width: number) {
        if (width < 10) {
            throw new Error("Error value has to be atleast 10");
            }

        this.width = width;
        this.createGrid();
        console.log("Width changed to " + this.width);
    }

    public get heightProp(): number {
        return this.height;
    }

    public set heightProp(height: number) {
        if (height < 10) {
            throw new Error("Error value has to be atleast 10");
        }
        this.createGrid();

        this.width = height;
        console.log("Height changed to " + this.height);
    }
}

window.customElements.define("cgol-pitch", Cgolpitch);
