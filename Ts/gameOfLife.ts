
class cgolpitch extends HTMLElement{
    private width: number;
    private height: number;
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
        console.log(this.width);
        console.log(this.height);
        this.attachShadow({mode:'open'});
        //TODO: button clicked wird in shadow dom nicht erkannt
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
        `
        ;
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
 