var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch } from "../../utils/index";
import bookModel from "../../model";
import FavoriteItemView from "./FavoriteItemView";
export default class FavoriteItem extends HTMLElement {
    constructor(isbn) {
        super();
        this.loadingComponent = null;
        this.libraryButton = null;
        this._isbn = null;
        this._isbn = isbn;
        this.view = new FavoriteItemView(this);
    }
    connectedCallback() {
        this.loadingComponent = this.querySelector("loading-component");
        this.libraryButton = this.querySelector(".library-button");
        this.hideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");
        this.addEvents();
        this.fetchData();
    }
    disconnectedCallback() {
        this.removeEvents();
    }
    get isbn() {
        return this._isbn;
    }
    addEvents() {
        var _a, _b;
        (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onLibrary.bind(this));
        (_b = this.hideButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.onHideLibrary.bind(this));
    }
    removeEvents() {
        var _a, _b;
        (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onLibrary);
        (_b = this.hideButton) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", this.onHideLibrary);
    }
    fetchData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/usage-analysis-list?isbn13=${this._isbn}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this.renderView(data);
            }
            catch (error) {
                this.view.renderError();
                console.error(error);
                throw new Error(`Fail to get usage analysis list.`);
            }
            (_a = this.loadingComponent) === null || _a === void 0 ? void 0 : _a.hide();
        });
    }
    renderView(data) {
        const newData = data.book;
        delete newData.vol;
        this.view.render(newData);
    }
    onLibrary() {
        const isbn = this._isbn;
        if (this.libraryBookExist && this.libraryButton) {
            this.libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, bookModel.getLibraries());
            this.view.updateOnLibrary();
        }
    }
    onHideLibrary() {
        var _a;
        const list = (_a = this.libraryBookExist) === null || _a === void 0 ? void 0 : _a.querySelector("ul");
        list.innerHTML = "";
        this.view.updateOnHideLibrary();
    }
}
//# sourceMappingURL=FavoriteItem.js.map