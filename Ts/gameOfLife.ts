class cgolpitch extends HTMLElement{
    width: number;
    height: number;
    /**
     *
     */
    constructor() {
        super();
        this.width = 10;
        this.height = 10;
        console.log("cgol initialised");
    }

    connectedCallback(){
        this.attachShadow({mode:'open'});
        //TODO: button clicked wird in shadow dom nicht erkannt
        this.shadowRoot.innerHTML = `
        <div>
            <button id="one">
            &#x1F44C
            </button>
            <button id="two" >
            &#x1F44D
            </button>
            <button id="three" >
            &#x1F44E
            </button>
        </div>
        `
        ;
    }

    disconnectedCallback() {
    
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      
    }

    public get widthProp() : number{
        return this.width;
    }

    public set widthProp(width : number){
        if (width < 10) {
            throw new Error();
        }

        this.width = width;
    }
   
    public get heightProp() : number{
        return this.height;
    }

    public set heightProp(height : number){
        if (height < 10) {
            throw new Error();
        }

        this.width = height;
    }

    
};

class cell{
    upNeighbor : cell;
    downNeighbor : cell;
    leftNeighbor : cell;
    rightNeighbor : cell;
    isAlive : boolean;

    /**
     *
     */
    constructor(leftNeighbor) {
        this.leftNeighbor = leftNeighbor;
        this.downNeighbor = null;
        this.rightNeighbor = null;
        this.upNeighbor = null;
        this.isAlive = false;
    }


}
window.customElements.define('cgol-pitch', cgolpitch);
 