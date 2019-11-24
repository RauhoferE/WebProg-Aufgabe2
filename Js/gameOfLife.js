class cgolpitch extends HTMLElement {
    /**
     *
     */
    constructor() {
        super();
        this.width = 10;
        this.height = 10;
        console.log("cgol initialised");
    }
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
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
        `;
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
    }
    get widthProp() {
        return this.width;
    }
    set widthProp(width) {
        if (width < 10) {
            throw new Error();
        }
        this.width = width;
    }
    get heightProp() {
        return this.height;
    }
    set heightProp(height) {
        if (height < 10) {
            throw new Error();
        }
        this.width = height;
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
    }
}
window.customElements.define('cgol-pitch', cgolpitch);
