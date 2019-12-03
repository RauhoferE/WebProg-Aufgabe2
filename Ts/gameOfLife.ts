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
        this.attachShadow({mode: 'open'});
        this.mouseOverDiv=this.mouseOverDiv.bind(this);
        console.log("cgol initialised");
    }

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
        <div id="field">
        </div>
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
    }

    private mouseOverDiv(e) {
        let t = e.target as HTMLElement;
        let x = t.getAttribute("PosX");
        let y = t.getAttribute("PosY");
        t.style.backgroundColor = "black";        
        //Checken ob zelle schon tot oder lebendig ist
        this.cells[Number(y)][Number(x)] = 1;
        console.log(t.id);
    }

    private Create2DArray(height: number, width: number): number[][] {
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
            // throw new Error("Error value has to be atleast 10");
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
            //throw new Error("Error value has to be atleast 10");
        }
        this.createGrid();

        this.width = height;
        console.log("Height changed to " + this.height);
    }
}

window.customElements.define("cgol-pitch", Cgolpitch);
