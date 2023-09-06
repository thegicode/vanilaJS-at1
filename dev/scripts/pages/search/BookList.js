var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Observer, CustomFetch, CustomEventEmitter } from "../../utils/index";
export default class BookList extends HTMLElement {
    constructor() {
        super();
        this.initializeProperties();
        this.bindMethods();
    }
    initializeProperties() {
        this.pagingInfo = this.querySelector(".paging-info");
        this.books = this.querySelector(".books");
    }
    bindMethods() {
        this.fetchSearchNaverBook = this.fetchSearchNaverBook.bind(this);
    }
    connectedCallback() {
        this.setupObserver();
        CustomEventEmitter.add("search-page-init", this.onSearchPageInit.bind(this));
    }
    disconnectedCallback() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        CustomEventEmitter.remove("search-page-init", this.onSearchPageInit);
    }
    setupObserver() {
        const target = this.querySelector(".observe");
        const callback = this.fetchSearchNaverBook;
        this.observer = new Observer(target, callback);
    }
    onSearchPageInit(event) {
        const customEvent = event;
        const { keyword, sort } = customEvent.detail;
        this.keyword = keyword;
        this.sort = sort;
        this.length = 0;
        if (this.keyword) {
            // onSubmit으로 들어온 경우와 브라우저
            this.handleKeywordPresent();
            return;
        }
        // keyword 없을 때 기본 화면 노출, 브라우저
        this.handleKeywordAbsent();
    }
    handleKeywordPresent() {
        this.showMessage("loading");
        this.books.innerHTML = "";
        this.fetchSearchNaverBook();
    }
    handleKeywordAbsent() {
        this.pagingInfo.hidden = true;
        this.showMessage("message");
    }
    fetchSearchNaverBook() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keyword || !this.sort)
                return;
            const keyworkd = encodeURIComponent(this.keyword);
            const searchUrl = `/search-naver-book?keyword=${keyworkd}&display=${10}&start=${this.length + 1}&sort=${this.sort}`;
            try {
                const data = yield CustomFetch.fetch(searchUrl);
                this.render(data);
            }
            catch (error) {
                console.error(error);
                throw new Error(`Failed to get books with keyword ${this.keyword}.`);
            }
        });
    }
    render(data) {
        var _a;
        const { total, display, items } = data;
        const prevLength = this.length;
        this.length += Number(display);
        this.updatePagingInfo({ total, display });
        this.pagingInfo.hidden = false;
        if (total === 0) {
            this.showMessage("notFound");
            return;
        }
        this.appendBookItems(items, prevLength);
        if (total !== this.length) {
            (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observe();
        }
    }
    updatePagingInfo({ total, display, }) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.length.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`,
        };
        for (const [key, value] of Object.entries(obj)) {
            const element = this.pagingInfo.querySelector(`.__${key}`);
            element.textContent = value;
        }
    }
    appendBookItems(items, prevLength) {
        const fragment = new DocumentFragment();
        const template = document.querySelector("#tp-book-item");
        if (!template)
            return;
        const el = template.content.firstElementChild;
        if (!el)
            return;
        items.forEach((item, index) => {
            const cloned = el.cloneNode(true);
            cloned.bookData = item;
            cloned.dataset.index = (prevLength + index).toString();
            fragment.appendChild(cloned);
        });
        this.books.appendChild(fragment);
    }
    showMessage(type) {
        const template = document.querySelector(`#tp-${type}`);
        if (!template)
            return;
        const el = template.content.firstElementChild;
        if (!el)
            return;
        const cloned = el.cloneNode(true);
        this.books.innerHTML = "";
        this.books.appendChild(cloned);
    }
}
// this.observer = new IntersectionObserver( changes => {
//     changes.forEach( change => {
//         if (change.isIntersecting) {
//             this.observer.unobserve(change.target)
//             this.fetchSearchNaverBook()
//         }
//     })
// })
//# sourceMappingURL=BookList.js.map