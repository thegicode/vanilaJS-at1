import Publisher from "../utils/Publisher";

const cloneDeep = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

const STORAGE_NAME = "BookWorld";

const initialState: IBookState = {
    libraries: {},
    regions: {},
    category: {},
    categorySort: [],
};

export const bookStateUpdatePublisher = new Publisher();
export const categoryBookUpdatePublisher = new Publisher();
export const regionUpdatePublisher = new Publisher();
export const detailRegionUpdatePublisher = new Publisher();

class BookStore {
    private state: IBookState;

    constructor() {
        this.state = this.loadStorage() || cloneDeep(initialState);
    }

    private loadStorage() {
        try {
            const storageData = localStorage.getItem(STORAGE_NAME);
            return storageData ? JSON.parse(storageData) : null;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get state from localStorage.");
        }
    }

    private setStorage(newState: IBookState) {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(newState));
        } catch (error) {
            console.error(error);
        }
    }

    reset() {
        this.state = cloneDeep(initialState);
        this.storage = cloneDeep(initialState);
    }

    get storage() {
        return cloneDeep(this.state);
    }

    set storage(newState) {
        this.setStorage(newState);
        this.state = newState;
    }

    get category() {
        return cloneDeep(this.state.category);
    }

    set category(newCategory) {
        const newState = this.storage;
        newState.category = newCategory;
        this.storage = newState;
    }

    get categorySort() {
        return cloneDeep(this.state.categorySort);
    }
    set categorySort(newSort) {
        const newState = this.state;
        newState.categorySort = newSort;
        this.storage = newState;
    }

    get libraries() {
        return cloneDeep(this.state.libraries);
    }

    set libraries(newLibries) {
        const newState = this.state;
        newState.libraries = newLibries;
        this.storage = newState;
    }

    get regions() {
        return cloneDeep(this.state.regions);
    }
    set regions(newRegions) {
        const newState = this.state;
        newState.regions = newRegions;
        this.storage = newState;
    }

    addCategory(name: string) {
        const newCategory = this.category;
        newCategory[name] = [];
        this.category = newCategory;
    }

    addCategorySort(name: string) {
        const newCategorySort = this.categorySort;
        newCategorySort.push(name);
        this.categorySort = newCategorySort;
    }

    hasCategory(name: string) {
        return name in this.category;
    }

    renameCategory(prevName: string, newName: string) {
        const newCategory = this.category;
        newCategory[newName] = newCategory[prevName];
        delete newCategory[prevName];
        this.category = newCategory;
    }

    renameCategorySort(prevName: string, newName: string) {
        const newCategorySort = this.categorySort;
        const index = newCategorySort.indexOf(prevName);
        newCategorySort[index] = newName;
        this.categorySort = newCategorySort;
    }

    deleteCategory(name: string) {
        const newFavorites = this.category;
        delete newFavorites[name];
        this.category = newFavorites;
    }

    changeCategory(draggedKey: string, targetKey: string) {
        const newSort = this.categorySort;
        const draggedIndex = newSort.indexOf(draggedKey);
        const targetIndex = newSort.indexOf(targetKey);
        newSort[targetIndex] = draggedKey;
        newSort[draggedIndex] = targetKey;

        this.categorySort = newSort;
    }

    addBookInCategory(name: string, isbn: string) {
        const newCategory = this.category;
        newCategory[name].unshift(isbn);
        this.category = newCategory;

        categoryBookUpdatePublisher.notify();
    }

    hasBookInCategory(name: string, isbn: string) {
        return this.category[name].includes(isbn);
    }

    removeBookInCategory(name: string, isbn: string) {
        const newCategory = this.category;
        const index = newCategory[name].indexOf(isbn);
        if (index !== -1) {
            newCategory[name].splice(index, 1);
            this.category = newCategory;
        }

        categoryBookUpdatePublisher.notify();
    }

    addLibrary(code: string, name: string) {
        const newLibries = this.libraries;
        newLibries[code] = name;
        this.libraries = newLibries;
    }

    removeLibrary(code: string) {
        const newLibries = this.libraries;
        delete newLibries[code];
        this.libraries = newLibries;
    }

    hasLibrary(code: string) {
        return code in this.libraries;
    }

    addRegion(name: string) {
        const newRegion = this.regions;
        newRegion[name] = {};
        this.regions = newRegion;

        regionUpdatePublisher.notify();
    }

    removeRegion(name: string) {
        const newRegions = this.regions;
        delete newRegions[name];
        this.regions = newRegions;

        regionUpdatePublisher.notify();
    }

    addDetailRegion(
        regionName: string,
        detailName: string,
        detailCode: string
    ) {
        const newRegions = this.regions;
        newRegions[regionName][detailName] = detailCode;
        this.regions = newRegions;

        detailRegionUpdatePublisher.notify();
    }

    removeDetailRegion(regionName: string, detailName: string) {
        const newRegions = this.regions;
        delete newRegions[regionName][detailName];
        this.regions = newRegions;

        detailRegionUpdatePublisher.notify();
    }
}

const bookStore = new BookStore();

export default bookStore;