var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomEventEmitter, CustomFetch } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import { FETCH_REGION_DATA_EVENT } from "./constants";
import bookModel from "../../model";
export default class SetRegion extends HTMLElement {
    constructor() {
        super();
        this.regionData = null;
        this.template = document.querySelector("#tp-region");
        this.fetchAndRender = this.fetchAndRender.bind(this);
    }
    connectedCallback() {
        this.fetchAndRender();
        bookModel.subscribeToBookStateUpdate(this.fetchAndRender);
    }
    discinnectedCallback() {
        bookModel.unsubscribeToBookStateUpdate(this.fetchAndRender);
    }
    fetchAndRender() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.regionData = (yield yield CustomFetch.fetch("../../../assets/json/region.json"));
                this.render();
                CustomEventEmitter.dispatch(FETCH_REGION_DATA_EVENT, {
                    regionData: this.regionData,
                });
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get region data.");
            }
        });
    }
    render() {
        const regionElementsFragment = this.createRegionElementsFragment();
        const container = this.querySelector(".regions");
        container.innerHTML = "";
        container.appendChild(regionElementsFragment);
    }
    createRegionElementsFragment() {
        if (!this.regionData) {
            throw new Error("regionData is null.");
        }
        const fragment = new DocumentFragment();
        const regionData = this.regionData["region"];
        const favoriteRegions = Object.keys(bookModel.regions);
        for (const [key, value] of Object.entries(regionData)) {
            const regionElement = this.createRegionElement(this.template, key, value, favoriteRegions);
            fragment.appendChild(regionElement);
        }
        return fragment;
    }
    createRegionElement(template, key, value, favoriteRegions) {
        const regionElement = cloneTemplate(template);
        const checkbox = regionElement.querySelector("input");
        checkbox.value = value;
        checkbox.checked = favoriteRegions.includes(key);
        checkbox.addEventListener("change", this.createCheckboxChangeListener(checkbox));
        const spanElement = regionElement.querySelector("span");
        if (spanElement)
            spanElement.textContent = key;
        return regionElement;
    }
    createCheckboxChangeListener(checkbox) {
        return () => {
            const spanElement = checkbox.nextElementSibling;
            if (!spanElement || typeof spanElement.textContent !== "string") {
                throw new Error("Invalid checkbox element: No sibling element or missing text content.");
            }
            const key = spanElement.textContent;
            if (checkbox.checked) {
                bookModel.addRegion(key);
            }
            else {
                bookModel.removeRegion(key);
            }
        };
    }
}
//# sourceMappingURL=SetRegion.js.map