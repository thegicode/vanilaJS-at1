import { CustomEventEmitter } from "../../utils/index";
import { getState } from "../../modules/model";

export default class FavoriteRegions extends HTMLElement {
    private container: HTMLElement;

    constructor() {
        super();
        this.container = this.querySelector(".favorites") as HTMLElement;
    }

    connectedCallback() {
        this.render();
        CustomEventEmitter.add("set-detail-regions", this.render.bind(this));
    }

    disconnectedCallback() {
        CustomEventEmitter.remove("set-detail-regions", this.render);
    }

    private render() {
        this.container.innerHTML = "";
        const { regions } = getState();
        for (const regionName in regions) {
            const detaioRegions = Object.keys(regions[regionName]);
            if (detaioRegions.length > 0) {
                const titleElement = document.createElement("h3");
                titleElement.textContent = regionName;
                this.container.appendChild(titleElement);
                this.renderDetail(detaioRegions);
            }
        }
    }

    private renderDetail(detaioRegions: string[]) {
        const fragment = new DocumentFragment();
        detaioRegions.forEach((name) => {
            const element = document.createElement("p");
            element.textContent = name;
            fragment.appendChild(element);
        });
        this.container.appendChild(fragment);
    }
}
