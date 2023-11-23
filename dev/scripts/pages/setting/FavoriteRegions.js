import bookModel from "../../model";
export default class FavoriteRegions extends HTMLElement {
    constructor() {
        super();
        this.container = null;
        this.render = this.render.bind(this);
    }
    connectedCallback() {
        this.container = this.querySelector(".favorites");
        this.render();
        bookModel.subscribeToBookStateUpdate(this.render);
        bookModel.subscribeToDetailRegionUpdate(this.render);
    }
    disconnectedCallback() {
        bookModel.unsubscribeToBookStateUpdate(this.render);
        bookModel.unsubscribeToDetailRegionUpdate(this.render);
    }
    render() {
        if (!this.container)
            return;
        this.container.innerHTML = "";
        const regions = bookModel.getRegions();
        for (const regionName in regions) {
            const detailRegions = Object.keys(regions[regionName]);
            if (detailRegions.length > 0) {
                const titleElement = document.createElement("h3");
                titleElement.textContent = regionName;
                this.container.appendChild(titleElement);
                this.renderDetail(detailRegions);
            }
        }
    }
    renderDetail(detailRegions) {
        if (!this.container)
            return;
        const fragment = new DocumentFragment();
        detailRegions.forEach((name) => {
            const element = document.createElement("p");
            element.textContent = name;
            fragment.appendChild(element);
        });
        this.container.appendChild(fragment);
    }
}
//# sourceMappingURL=FavoriteRegions.js.map