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
import { cloneTemplate } from "../../utils/helpers";
import bookStore from "../../modules/BookStore";
export default class LibrarySearchByBook extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const isbn = new URLSearchParams(location.search).get("isbn");
        this.fetchList(isbn);
    }
    fetchList(isbn) {
        return __awaiter(this, void 0, void 0, function* () {
            const favoriteLibraries = bookStore.regions;
            if (Object.entries(favoriteLibraries).length === 0)
                return;
            for (const regionName in favoriteLibraries) {
                const detailCodes = Object.values(favoriteLibraries[regionName]);
                if (detailCodes.length === 0)
                    return;
                const regionCode = detailCodes[0].slice(0, 2);
                detailCodes.forEach((detailCode) => {
                    this.fetchLibrarySearchByBook(isbn, regionCode, detailCode);
                });
            }
        });
    }
    fetchLibrarySearchByBook(isbn, region, dtl_region) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams({
                isbn,
                region,
                dtl_region,
            });
            const url = `/library-search-by-book?${searchParams}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this.render(data, isbn);
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get library search by book.`);
            }
        });
    }
    render({ libraries }, isbn) {
        if (libraries.length < 1)
            return;
        const container = document.querySelector(".library-search-by-book");
        if (!container)
            return;
        const listElement = document.createElement("ul");
        const fragment = new DocumentFragment();
        libraries.forEach(({ homepage, libCode, libName }) => {
            const element = this.createLibrarySearchResultItem(isbn, homepage, libCode, libName);
            if (element) {
                fragment.appendChild(element);
            }
        });
        listElement.appendChild(fragment);
        container.appendChild(listElement);
    }
    createLibrarySearchResultItem(isbn, homepage, libCode, libName) {
        const template = document.querySelector("#tp-librarySearchByBookItem");
        if (!template)
            return null;
        const cloned = cloneTemplate(template);
        const link = cloned.querySelector("a");
        if (!link)
            return null;
        cloned.dataset.code = libCode;
        link.textContent = libName;
        link.href = homepage;
        this.loanAvailable(isbn, libCode, cloned);
        return cloned;
    }
    loanAvailable(isbn, libCode, el) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hasBook, loanAvailable } = yield this.fetchLoadnAvailabilty(isbn, libCode);
            const hasBookEl = el.querySelector(".hasBook");
            const isAvailableEl = el.querySelector(".loanAvailable");
            if (hasBookEl) {
                hasBookEl.textContent = hasBook === "Y" ? "소장" : "미소장";
            }
            if (isAvailableEl) {
                const isLoanAvailable = loanAvailable === "Y";
                isAvailableEl.textContent = isLoanAvailable
                    ? "대출 가능"
                    : "대출 불가";
                if (isLoanAvailable) {
                    el.dataset.available = "true";
                }
            }
        });
    }
    fetchLoadnAvailabilty(isbn13, libCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams({
                isbn13,
                libCode,
            });
            const url = `/book-exist?${searchParams}`;
            try {
                const result = yield CustomFetch.fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get book exist.`);
            }
        });
    }
}
//# sourceMappingURL=LibrarySearchByBook.js.map