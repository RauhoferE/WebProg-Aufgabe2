var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Cgolpitch = /** @class */ (function (_super) {
    __extends(Cgolpitch, _super);
    /**
     *
     */
    function Cgolpitch() {
        var _this = _super.call(this) || this;
        console.log("cgol initialised");
        return _this;
    }
    Object.defineProperty(Cgolpitch, "observedAttributes", {
        get: function () { return ["width", "height"]; },
        enumerable: true,
        configurable: true
    });
    Cgolpitch.prototype.connectedCallback = function () {
        this.width = +this.getAttribute("width");
        this.height = +this.getAttribute("height");
        console.log(this.width);
        console.log(this.height);
        this.attachShadow({ mode: "open" });
        this.createGrid();
    };
    Cgolpitch.prototype.disconnectedCallback = function () {
        console.log("Disconnected");
    };
    Cgolpitch.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        console.log("callback");
        if (newVal === null) {
            return;
        }
        if (attrName === "width") {
            this.widthProp = +newVal;
        }
        else if (attrName === "height") {
            this.heightProp = +newVal;
        }
    };
    Cgolpitch.prototype.createGrid = function () {
        this.shadowRoot.innerHTML = "\n        <body>\n        </body>\n        ";
        this.cells = this.Create2DArray(this.height, this.width);
        var windoWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var cellWidth = windoWidth / this.width;
        var cellHeight = windowHeight / this.height;
        var container = document.createElement("div");
        for (var index = 0; index < this.height; index++) {
            for (var j = 0; j < this.width; j++) {
                var temp = document.createElement("div");
                temp.style.width = cellWidth.toString();
                temp.style.height = cellHeight.toString();
                temp.style.marginLeft = (j * cellWidth).toString();
                temp.style.marginTop = (index * cellHeight).toString();
                this.cells[index - 1][j - 1] = 0;
                temp.addEventListener("mouseover", function (event) {
                    // TODO Variable außerhalb von klasse definieren
                    var t = event.target;
                    // TODO: Geht nicht kann keine objekte von innerhalb rufen!!!!!!!!!!!!!!!!!!!!!
                    console.log(t.id);
                });
                container.appendChild(temp);
            }
        }
        this.shadowRoot.appendChild(container);
    };
    Cgolpitch.prototype.Create2DArray = function (height, width) {
        var arr = new Array(height);
        for (var i = 0; i < height; i++) {
            arr[i] = new Array(width);
        }
        return arr;
    };
    Object.defineProperty(Cgolpitch.prototype, "cells", {
        get: function () {
            return this.cells1;
        },
        set: function (value) {
            this.cells1 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cgolpitch.prototype, "widthProp", {
        get: function () {
            return this.width;
        },
        set: function (width) {
            if (width < 10) {
                throw new Error("Error value has to be atleast 10");
            }
            this.width = width;
            this.createGrid();
            console.log("Width changed to " + this.width);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cgolpitch.prototype, "heightProp", {
        get: function () {
            return this.height;
        },
        set: function (height) {
            if (height < 10) {
                throw new Error("Error value has to be atleast 10");
            }
            this.createGrid();
            this.width = height;
            console.log("Height changed to " + this.height);
        },
        enumerable: true,
        configurable: true
    });
    return Cgolpitch;
}(HTMLElement));
window.customElements.define("cgol-pitch", Cgolpitch);
//# sourceMappingURL=gameOfLife.js.map