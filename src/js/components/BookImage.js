export default class BookImage extends HTMLElement {
    constructor() {
        super();
    }
    // 즐겨찾기, 상세
    set data(objectData) {
        this.dataset.object = JSON.stringify(objectData);
        const imgElement = this.querySelector("img");
        if (imgElement && imgElement.getAttribute("src") === "") {
            this.render();
        }
    }
    connectedCallback() {
        this.render();
    }
    // search : dataset
    render() {
        const data = this.dataset.object && JSON.parse(this.dataset.object);
        let imageSrc = "";
        let imageAlt = "";
        if (data) {
            const { bookImageURL, bookname } = data;
            imageSrc = bookImageURL;
            imageAlt = bookname;
        }
        this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`;
        const imgElement = this.querySelector("img");
        if (imgElement && imgElement.getAttribute("src")) {
            this.handleError(imgElement);
        }
    }
    handleError(imgElement) {
        if (imgElement) {
            imgElement.onerror = () => {
                this.dataset.fail = "true";
                imgElement.remove();
            };
        }
    }
}
//# sourceMappingURL=BookImage.js.map