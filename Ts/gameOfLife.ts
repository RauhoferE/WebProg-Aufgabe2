
class cgolpitch extends HTMLElement{
    private width: number;
    private height: number;
    private isRunning: boolean;
    private _cells: boolean[];

    public static get observedAttributes() { return ["width", "height"]; }
    /**
     *
     */
    constructor() {
        super();
        console.log("cgol initialised");
    }

    connectedCallback(){
        this.width = +this.getAttribute('width');
        this.height = +this.getAttribute('height');
        this.isRunning = false;
        console.log(this.width);
        console.log(this.height);
        this.attachShadow({mode:'open'});
        this.createGrid();
    }

    disconnectedCallback() {
        console.log("Disconnected");
        
    }
    attributeChangedCallback(attrName : string, oldVal : string, newVal : string) {
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

    public createGrid(){
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
        `
        ;
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
                temp.addEventListener("mouseover", function(event){
                    var t = event.target as Element;
                    t.setAttribute("class", "alive");
                    //TODO: Geht nicht kann keine objekte von innerhalb rufen!!!!!!!!!!!!!!!!!!!!!
                    var root = <cgolpitch>t.parentElement;
                    root.cells[+t.getAttribute("id") - 1][+t.getAttribute("id2") - 1] = true;
                    console.log(t.id);
                });
                container.appendChild(temp);
            }
        }
        this.shadowRoot.appendChild(container);
    }

    public Create2DArray(height, width) {
        var arr = new Array(height);
      
        for (var i=0;i<height;i++) {
           arr[i] = new Array(width);
        }
      
        return arr;
      }

    public start(){
        while (this.isRunning) {
            
        }
    }

    public get cells(): boolean[] {
        return this._cells;
    }
    public set cells(value: boolean[]) {
        this._cells = value;
    }

    public get widthProp() : number{
        return this.width;
    }

    public set widthProp(width : number){
        if (width < 10) {
            throw new Error("Error value has to be atleast 10");
            }

        this.width = width;
        this.createGrid();
        console.log("Width changed to " + this.width);
    }
   
    public get heightProp() : number{
        return this.height;
    }

    public set heightProp(height : number){
        if (height < 10) {
            throw new Error("Error value has to be atleast 10");
        }
        this.createGrid();

        this.width = height;
        console.log("Height changed to " + this.height);
    }
};

class cell{
    upNeighbor : cell;
    downNeighbor : cell;
    leftNeighbor : cell;
    rightNeighbor : cell;
    isAlive : boolean;
    wasAliveAtSomePoint : boolean;

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
 