"use strict";
(() => {
  // dev/scripts/utils/CustomEventEmitter.js
  var CustomEventEmitter = class {
    constructor() {
      this._bus = document.createElement("div");
    }
    add(event, callback) {
      this._bus.addEventListener(event, callback);
    }
    remove(event, callback) {
      this._bus.removeEventListener(event, callback);
    }
    dispatch(event, detail = {}) {
      this._bus.dispatchEvent(new CustomEvent(event, { detail }));
    }
  };
  var CustomEventEmitter_default = new CustomEventEmitter();

  // dev/scripts/utils/CustomFetch.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var CustomFetch = class {
    constructor(baseOptions = {}) {
      this.defaultOptions = Object.assign({ method: "GET", headers: {
        "Content-Type": "application/json"
        // 'Authorization': `Bearer ${getToken()}`
      } }, baseOptions);
    }
    fetch(url, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const finalOptions = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), options), { timeout: 5e3 });
        try {
          const response = yield fetch(url, finalOptions);
          if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}, message: ${response.statusText}`);
          }
          const data = yield response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching data: ${error}`);
          throw new Error(`Error fetching data: ${error}`);
        }
      });
    }
  };
  var CustomFetch_default = new CustomFetch();

  // node_modules/intersection-observer/intersection-observer.js
  (function() {
    "use strict";
    if (typeof window !== "object") {
      return;
    }
    if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
      if (!("isIntersecting" in window.IntersectionObserverEntry.prototype)) {
        Object.defineProperty(
          window.IntersectionObserverEntry.prototype,
          "isIntersecting",
          {
            get: function() {
              return this.intersectionRatio > 0;
            }
          }
        );
      }
      return;
    }
    function getFrameElement(doc) {
      try {
        return doc.defaultView && doc.defaultView.frameElement || null;
      } catch (e) {
        return null;
      }
    }
    var document2 = function(startDoc) {
      var doc = startDoc;
      var frame = getFrameElement(doc);
      while (frame) {
        doc = frame.ownerDocument;
        frame = getFrameElement(doc);
      }
      return doc;
    }(window.document);
    var registry = [];
    var crossOriginUpdater = null;
    var crossOriginRect = null;
    function IntersectionObserverEntry(entry) {
      this.time = entry.time;
      this.target = entry.target;
      this.rootBounds = ensureDOMRect(entry.rootBounds);
      this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
      this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
      this.isIntersecting = !!entry.intersectionRect;
      var targetRect = this.boundingClientRect;
      var targetArea = targetRect.width * targetRect.height;
      var intersectionRect = this.intersectionRect;
      var intersectionArea = intersectionRect.width * intersectionRect.height;
      if (targetArea) {
        this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
      } else {
        this.intersectionRatio = this.isIntersecting ? 1 : 0;
      }
    }
    function IntersectionObserver2(callback, opt_options) {
      var options = opt_options || {};
      if (typeof callback != "function") {
        throw new Error("callback must be a function");
      }
      if (options.root && options.root.nodeType != 1 && options.root.nodeType != 9) {
        throw new Error("root must be a Document or Element");
      }
      this._checkForIntersections = throttle(
        this._checkForIntersections.bind(this),
        this.THROTTLE_TIMEOUT
      );
      this._callback = callback;
      this._observationTargets = [];
      this._queuedEntries = [];
      this._rootMarginValues = this._parseRootMargin(options.rootMargin);
      this.thresholds = this._initThresholds(options.threshold);
      this.root = options.root || null;
      this.rootMargin = this._rootMarginValues.map(function(margin) {
        return margin.value + margin.unit;
      }).join(" ");
      this._monitoringDocuments = [];
      this._monitoringUnsubscribes = [];
    }
    IntersectionObserver2.prototype.THROTTLE_TIMEOUT = 100;
    IntersectionObserver2.prototype.POLL_INTERVAL = null;
    IntersectionObserver2.prototype.USE_MUTATION_OBSERVER = true;
    IntersectionObserver2._setupCrossOriginUpdater = function() {
      if (!crossOriginUpdater) {
        crossOriginUpdater = function(boundingClientRect, intersectionRect) {
          if (!boundingClientRect || !intersectionRect) {
            crossOriginRect = getEmptyRect();
          } else {
            crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
          }
          registry.forEach(function(observer) {
            observer._checkForIntersections();
          });
        };
      }
      return crossOriginUpdater;
    };
    IntersectionObserver2._resetCrossOriginUpdater = function() {
      crossOriginUpdater = null;
      crossOriginRect = null;
    };
    IntersectionObserver2.prototype.observe = function(target) {
      var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
        return item.element == target;
      });
      if (isTargetAlreadyObserved) {
        return;
      }
      if (!(target && target.nodeType == 1)) {
        throw new Error("target must be an Element");
      }
      this._registerInstance();
      this._observationTargets.push({ element: target, entry: null });
      this._monitorIntersections(target.ownerDocument);
      this._checkForIntersections();
    };
    IntersectionObserver2.prototype.unobserve = function(target) {
      this._observationTargets = this._observationTargets.filter(function(item) {
        return item.element != target;
      });
      this._unmonitorIntersections(target.ownerDocument);
      if (this._observationTargets.length == 0) {
        this._unregisterInstance();
      }
    };
    IntersectionObserver2.prototype.disconnect = function() {
      this._observationTargets = [];
      this._unmonitorAllIntersections();
      this._unregisterInstance();
    };
    IntersectionObserver2.prototype.takeRecords = function() {
      var records = this._queuedEntries.slice();
      this._queuedEntries = [];
      return records;
    };
    IntersectionObserver2.prototype._initThresholds = function(opt_threshold) {
      var threshold = opt_threshold || [0];
      if (!Array.isArray(threshold))
        threshold = [threshold];
      return threshold.sort().filter(function(t, i, a) {
        if (typeof t != "number" || isNaN(t) || t < 0 || t > 1) {
          throw new Error("threshold must be a number between 0 and 1 inclusively");
        }
        return t !== a[i - 1];
      });
    };
    IntersectionObserver2.prototype._parseRootMargin = function(opt_rootMargin) {
      var marginString = opt_rootMargin || "0px";
      var margins = marginString.split(/\s+/).map(function(margin) {
        var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
        if (!parts) {
          throw new Error("rootMargin must be specified in pixels or percent");
        }
        return { value: parseFloat(parts[1]), unit: parts[2] };
      });
      margins[1] = margins[1] || margins[0];
      margins[2] = margins[2] || margins[0];
      margins[3] = margins[3] || margins[1];
      return margins;
    };
    IntersectionObserver2.prototype._monitorIntersections = function(doc) {
      var win = doc.defaultView;
      if (!win) {
        return;
      }
      if (this._monitoringDocuments.indexOf(doc) != -1) {
        return;
      }
      var callback = this._checkForIntersections;
      var monitoringInterval = null;
      var domObserver = null;
      if (this.POLL_INTERVAL) {
        monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
      } else {
        addEvent(win, "resize", callback, true);
        addEvent(doc, "scroll", callback, true);
        if (this.USE_MUTATION_OBSERVER && "MutationObserver" in win) {
          domObserver = new win.MutationObserver(callback);
          domObserver.observe(doc, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        }
      }
      this._monitoringDocuments.push(doc);
      this._monitoringUnsubscribes.push(function() {
        var win2 = doc.defaultView;
        if (win2) {
          if (monitoringInterval) {
            win2.clearInterval(monitoringInterval);
          }
          removeEvent(win2, "resize", callback, true);
        }
        removeEvent(doc, "scroll", callback, true);
        if (domObserver) {
          domObserver.disconnect();
        }
      });
      var rootDoc = this.root && (this.root.ownerDocument || this.root) || document2;
      if (doc != rootDoc) {
        var frame = getFrameElement(doc);
        if (frame) {
          this._monitorIntersections(frame.ownerDocument);
        }
      }
    };
    IntersectionObserver2.prototype._unmonitorIntersections = function(doc) {
      var index = this._monitoringDocuments.indexOf(doc);
      if (index == -1) {
        return;
      }
      var rootDoc = this.root && (this.root.ownerDocument || this.root) || document2;
      var hasDependentTargets = this._observationTargets.some(function(item) {
        var itemDoc = item.element.ownerDocument;
        if (itemDoc == doc) {
          return true;
        }
        while (itemDoc && itemDoc != rootDoc) {
          var frame2 = getFrameElement(itemDoc);
          itemDoc = frame2 && frame2.ownerDocument;
          if (itemDoc == doc) {
            return true;
          }
        }
        return false;
      });
      if (hasDependentTargets) {
        return;
      }
      var unsubscribe = this._monitoringUnsubscribes[index];
      this._monitoringDocuments.splice(index, 1);
      this._monitoringUnsubscribes.splice(index, 1);
      unsubscribe();
      if (doc != rootDoc) {
        var frame = getFrameElement(doc);
        if (frame) {
          this._unmonitorIntersections(frame.ownerDocument);
        }
      }
    };
    IntersectionObserver2.prototype._unmonitorAllIntersections = function() {
      var unsubscribes = this._monitoringUnsubscribes.slice(0);
      this._monitoringDocuments.length = 0;
      this._monitoringUnsubscribes.length = 0;
      for (var i = 0; i < unsubscribes.length; i++) {
        unsubscribes[i]();
      }
    };
    IntersectionObserver2.prototype._checkForIntersections = function() {
      if (!this.root && crossOriginUpdater && !crossOriginRect) {
        return;
      }
      var rootIsInDom = this._rootIsInDom();
      var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();
      this._observationTargets.forEach(function(item) {
        var target = item.element;
        var targetRect = getBoundingClientRect(target);
        var rootContainsTarget = this._rootContainsTarget(target);
        var oldEntry = item.entry;
        var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, targetRect, rootRect);
        var rootBounds = null;
        if (!this._rootContainsTarget(target)) {
          rootBounds = getEmptyRect();
        } else if (!crossOriginUpdater || this.root) {
          rootBounds = rootRect;
        }
        var newEntry = item.entry = new IntersectionObserverEntry({
          time: now(),
          target,
          boundingClientRect: targetRect,
          rootBounds,
          intersectionRect
        });
        if (!oldEntry) {
          this._queuedEntries.push(newEntry);
        } else if (rootIsInDom && rootContainsTarget) {
          if (this._hasCrossedThreshold(oldEntry, newEntry)) {
            this._queuedEntries.push(newEntry);
          }
        } else {
          if (oldEntry && oldEntry.isIntersecting) {
            this._queuedEntries.push(newEntry);
          }
        }
      }, this);
      if (this._queuedEntries.length) {
        this._callback(this.takeRecords(), this);
      }
    };
    IntersectionObserver2.prototype._computeTargetAndRootIntersection = function(target, targetRect, rootRect) {
      if (window.getComputedStyle(target).display == "none")
        return;
      var intersectionRect = targetRect;
      var parent = getParentNode(target);
      var atRoot = false;
      while (!atRoot && parent) {
        var parentRect = null;
        var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {};
        if (parentComputedStyle.display == "none")
          return null;
        if (parent == this.root || parent.nodeType == /* DOCUMENT */
        9) {
          atRoot = true;
          if (parent == this.root || parent == document2) {
            if (crossOriginUpdater && !this.root) {
              if (!crossOriginRect || crossOriginRect.width == 0 && crossOriginRect.height == 0) {
                parent = null;
                parentRect = null;
                intersectionRect = null;
              } else {
                parentRect = crossOriginRect;
              }
            } else {
              parentRect = rootRect;
            }
          } else {
            var frame = getParentNode(parent);
            var frameRect = frame && getBoundingClientRect(frame);
            var frameIntersect = frame && this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
            if (frameRect && frameIntersect) {
              parent = frame;
              parentRect = convertFromParentRect(frameRect, frameIntersect);
            } else {
              parent = null;
              intersectionRect = null;
            }
          }
        } else {
          var doc = parent.ownerDocument;
          if (parent != doc.body && parent != doc.documentElement && parentComputedStyle.overflow != "visible") {
            parentRect = getBoundingClientRect(parent);
          }
        }
        if (parentRect) {
          intersectionRect = computeRectIntersection(parentRect, intersectionRect);
        }
        if (!intersectionRect)
          break;
        parent = parent && getParentNode(parent);
      }
      return intersectionRect;
    };
    IntersectionObserver2.prototype._getRootRect = function() {
      var rootRect;
      if (this.root && !isDoc(this.root)) {
        rootRect = getBoundingClientRect(this.root);
      } else {
        var doc = isDoc(this.root) ? this.root : document2;
        var html = doc.documentElement;
        var body = doc.body;
        rootRect = {
          top: 0,
          left: 0,
          right: html.clientWidth || body.clientWidth,
          width: html.clientWidth || body.clientWidth,
          bottom: html.clientHeight || body.clientHeight,
          height: html.clientHeight || body.clientHeight
        };
      }
      return this._expandRectByRootMargin(rootRect);
    };
    IntersectionObserver2.prototype._expandRectByRootMargin = function(rect) {
      var margins = this._rootMarginValues.map(function(margin, i) {
        return margin.unit == "px" ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
      });
      var newRect = {
        top: rect.top - margins[0],
        right: rect.right + margins[1],
        bottom: rect.bottom + margins[2],
        left: rect.left - margins[3]
      };
      newRect.width = newRect.right - newRect.left;
      newRect.height = newRect.bottom - newRect.top;
      return newRect;
    };
    IntersectionObserver2.prototype._hasCrossedThreshold = function(oldEntry, newEntry) {
      var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
      var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1;
      if (oldRatio === newRatio)
        return;
      for (var i = 0; i < this.thresholds.length; i++) {
        var threshold = this.thresholds[i];
        if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
          return true;
        }
      }
    };
    IntersectionObserver2.prototype._rootIsInDom = function() {
      return !this.root || containsDeep(document2, this.root);
    };
    IntersectionObserver2.prototype._rootContainsTarget = function(target) {
      var rootDoc = this.root && (this.root.ownerDocument || this.root) || document2;
      return containsDeep(rootDoc, target) && (!this.root || rootDoc == target.ownerDocument);
    };
    IntersectionObserver2.prototype._registerInstance = function() {
      if (registry.indexOf(this) < 0) {
        registry.push(this);
      }
    };
    IntersectionObserver2.prototype._unregisterInstance = function() {
      var index = registry.indexOf(this);
      if (index != -1)
        registry.splice(index, 1);
    };
    function now() {
      return window.performance && performance.now && performance.now();
    }
    function throttle(fn, timeout) {
      var timer = null;
      return function() {
        if (!timer) {
          timer = setTimeout(function() {
            fn();
            timer = null;
          }, timeout);
        }
      };
    }
    function addEvent(node, event, fn, opt_useCapture) {
      if (typeof node.addEventListener == "function") {
        node.addEventListener(event, fn, opt_useCapture || false);
      } else if (typeof node.attachEvent == "function") {
        node.attachEvent("on" + event, fn);
      }
    }
    function removeEvent(node, event, fn, opt_useCapture) {
      if (typeof node.removeEventListener == "function") {
        node.removeEventListener(event, fn, opt_useCapture || false);
      } else if (typeof node.detachEvent == "function") {
        node.detachEvent("on" + event, fn);
      }
    }
    function computeRectIntersection(rect1, rect2) {
      var top = Math.max(rect1.top, rect2.top);
      var bottom = Math.min(rect1.bottom, rect2.bottom);
      var left = Math.max(rect1.left, rect2.left);
      var right = Math.min(rect1.right, rect2.right);
      var width = right - left;
      var height = bottom - top;
      return width >= 0 && height >= 0 && {
        top,
        bottom,
        left,
        right,
        width,
        height
      } || null;
    }
    function getBoundingClientRect(el) {
      var rect;
      try {
        rect = el.getBoundingClientRect();
      } catch (err) {
      }
      if (!rect)
        return getEmptyRect();
      if (!(rect.width && rect.height)) {
        rect = {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        };
      }
      return rect;
    }
    function getEmptyRect() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }
    function ensureDOMRect(rect) {
      if (!rect || "x" in rect) {
        return rect;
      }
      return {
        top: rect.top,
        y: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        x: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height
      };
    }
    function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
      var top = parentIntersectionRect.top - parentBoundingRect.top;
      var left = parentIntersectionRect.left - parentBoundingRect.left;
      return {
        top,
        left,
        height: parentIntersectionRect.height,
        width: parentIntersectionRect.width,
        bottom: top + parentIntersectionRect.height,
        right: left + parentIntersectionRect.width
      };
    }
    function containsDeep(parent, child) {
      var node = child;
      while (node) {
        if (node == parent)
          return true;
        node = getParentNode(node);
      }
      return false;
    }
    function getParentNode(node) {
      var parent = node.parentNode;
      if (node.nodeType == /* DOCUMENT */
      9 && node != document2) {
        return getFrameElement(node);
      }
      if (parent && parent.assignedSlot) {
        parent = parent.assignedSlot.parentNode;
      }
      if (parent && parent.nodeType == 11 && parent.host) {
        return parent.host;
      }
      return parent;
    }
    function isDoc(node) {
      return node && node.nodeType === 9;
    }
    window.IntersectionObserver = IntersectionObserver2;
    window.IntersectionObserverEntry = IntersectionObserverEntry;
  })();

  // dev/scripts/utils/Publisher.js
  var Publisher = class {
    constructor() {
      this.subscribers = [];
    }
    subscribe(callback) {
      this.subscribers.push(callback);
    }
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter((subscriber) => subscriber !== callback);
    }
    notify(payload) {
      this.subscribers.forEach((callback) => callback(payload));
    }
  };

  // dev/scripts/modules/BookStore.js
  var cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var STORAGE_NAME = "BookWorld";
  var initialState = {
    libraries: {},
    regions: {},
    category: {},
    categorySort: []
  };
  var publishers = {
    bookStateUpdate: new Publisher(),
    categoryUpdate: new Publisher(),
    categoryBookUpdate: new Publisher(),
    regionUpdate: new Publisher(),
    detailRegionUpdate: new Publisher()
  };
  var BookStore = class {
    constructor() {
      this.state = this.loadStorage() || cloneDeep(initialState);
    }
    loadStorage() {
      try {
        const storageData = localStorage.getItem(STORAGE_NAME);
        return storageData ? JSON.parse(storageData) : null;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to get state from localStorage.");
      }
    }
    setStorage(newState) {
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
    addCategory(name) {
      const newCategory = this.category;
      newCategory[name] = [];
      this.category = newCategory;
      publishers.categoryUpdate.notify({ type: "add", name });
    }
    addCategorySort(name) {
      const newCategorySort = this.categorySort;
      newCategorySort.push(name);
      this.categorySort = newCategorySort;
    }
    hasCategory(name) {
      return name in this.category;
    }
    renameCategory(prevName, newName) {
      const newCategory = this.category;
      newCategory[newName] = newCategory[prevName];
      delete newCategory[prevName];
      this.category = newCategory;
      this.renameCategorySort(prevName, newName);
      publishers.categoryUpdate.notify({ type: "rename", prevName, newName });
    }
    renameCategorySort(prevName, newName) {
      const newCategorySort = this.categorySort;
      const index = this.indexCategorySort(prevName);
      newCategorySort[index] = newName;
      this.categorySort = newCategorySort;
    }
    indexCategorySort(name) {
      const newCategorySort = this.categorySort;
      const index = newCategorySort.indexOf(name);
      return index;
    }
    deleteCategory(name) {
      const newFavorites = this.category;
      delete newFavorites[name];
      this.category = newFavorites;
      publishers.categoryUpdate.notify({ type: "delete", name });
    }
    deleteCatgorySort(name) {
      const newCategorySort = this.categorySort;
      const index = newCategorySort.indexOf(name);
      newCategorySort.splice(index, 1);
      this.categorySort = newCategorySort;
      return index;
    }
    changeCategory(draggedKey, targetKey) {
      const newSort = this.categorySort;
      const draggedIndex = newSort.indexOf(draggedKey);
      const targetIndex = newSort.indexOf(targetKey);
      newSort[targetIndex] = draggedKey;
      newSort[draggedIndex] = targetKey;
      this.categorySort = newSort;
      publishers.categoryUpdate.notify({
        type: "change",
        targetIndex,
        draggedIndex
      });
    }
    addBookInCategory(name, isbn) {
      const newCategory = this.category;
      newCategory[name].unshift(isbn);
      this.category = newCategory;
      publishers.categoryBookUpdate.notify();
    }
    hasBookInCategory(name, isbn) {
      return this.category[name].includes(isbn);
    }
    removeBookInCategory(name, isbn) {
      const newCategory = this.category;
      const index = newCategory[name].indexOf(isbn);
      if (index !== -1) {
        newCategory[name].splice(index, 1);
        this.category = newCategory;
      }
      publishers.categoryBookUpdate.notify();
    }
    addLibrary(code, name) {
      const newLibries = this.libraries;
      newLibries[code] = name;
      this.libraries = newLibries;
    }
    removeLibrary(code) {
      const newLibries = this.libraries;
      delete newLibries[code];
      this.libraries = newLibries;
    }
    hasLibrary(code) {
      return code in this.libraries;
    }
    addRegion(name) {
      const newRegion = this.regions;
      newRegion[name] = {};
      this.regions = newRegion;
      publishers.regionUpdate.notify();
    }
    removeRegion(name) {
      const newRegions = this.regions;
      delete newRegions[name];
      this.regions = newRegions;
      publishers.regionUpdate.notify();
    }
    addDetailRegion(regionName, detailName, detailCode) {
      const newRegions = this.regions;
      newRegions[regionName][detailName] = detailCode;
      this.regions = newRegions;
      publishers.detailRegionUpdate.notify();
    }
    removeDetailRegion(regionName, detailName) {
      const newRegions = this.regions;
      delete newRegions[regionName][detailName];
      this.regions = newRegions;
      publishers.detailRegionUpdate.notify();
    }
  };
  var bookStore = new BookStore();
  var BookStore_default = bookStore;

  // dev/scripts/components/NavGnb.js
  var NavGnb = class extends HTMLElement {
    constructor() {
      super();
      this.PATHS = [
        "/search",
        "/favorite",
        "/popular",
        "/library",
        "/setting"
      ];
      this.renderBookSize = this.renderBookSize.bind(this);
    }
    connectedCallback() {
      this.render();
      this.setSelectedMenu();
      publishers.categoryBookUpdate.subscribe(this.renderBookSize);
    }
    get bookSize() {
      return Object.values(BookStore_default.category).reduce((sum, currentArray) => sum + currentArray.length, 0);
    }
    render() {
      const paths = this.PATHS;
      this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href=".${paths[0]}">\uCC45 \uAC80\uC0C9</a>
                <a class="gnb-item" href=".${paths[1]}">\uB098\uC758 \uCC45 (<span class="size">${this.bookSize}</span>)</a>
                <a class="gnb-item" href=".${paths[2]}">\uC778\uAE30\uB300\uCD9C\uB3C4\uC11C</a>
                <a class="gnb-item" href=".${paths[3]}">\uB3C4\uC11C\uAD00 \uC870\uD68C</a>
                <a class="gnb-item" href=".${paths[4]}">\uC124\uC815</a>
            </nav>`;
    }
    setSelectedMenu() {
      const idx = this.PATHS.indexOf(document.location.pathname);
      if (idx >= 0)
        this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
    renderBookSize() {
      const sizeEl = this.querySelector(".size");
      sizeEl.textContent = this.bookSize.toString();
    }
  };

  // dev/scripts/utils/helpers.js
  function cloneTemplate(template) {
    const content = template.content.firstElementChild;
    if (!content) {
      throw new Error("Template content is empty");
    }
    return content.cloneNode(true);
  }

  // dev/scripts/pages/library/Library.js
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Library = class extends HTMLElement {
    constructor() {
      super();
      this._regionCode = null;
      this.PAGE_SIZE = 20;
      this.formElement = this.querySelector("form");
      this.itemTemplate = document.querySelector("#tp-item");
    }
    set regionCode(value) {
      this._regionCode = value;
      this.handleRegionCodeChange();
    }
    get regionCode() {
      return this._regionCode;
    }
    connectedCallback() {
    }
    handleRegionCodeChange() {
      if (!this.regionCode)
        return;
      this.showMessage("loading");
      this.fetchLibrarySearch(this.regionCode);
    }
    fetchLibrarySearch(regionCode) {
      return __awaiter2(this, void 0, void 0, function* () {
        const url = `/library-search?dtl_region=${regionCode}&page=1&pageSize=${this.PAGE_SIZE}`;
        try {
          const data = yield CustomFetch_default.fetch(url);
          this.renderLibraryList(data);
        } catch (error) {
          console.error(error);
          throw new Error("Fail to get library search data.");
        }
      });
    }
    renderLibraryList(data) {
      const {
        // pageNo, pageSize, numFound, resultNum,
        libraries
      } = data;
      if (libraries.length === 0) {
        this.showMessage("notFound");
        return;
      }
      const fragment = libraries.reduce((fragment2, lib) => this.createLibraryItem(fragment2, lib), new DocumentFragment());
      if (this.formElement) {
        this.formElement.innerHTML = "";
        this.formElement.appendChild(fragment);
      }
    }
    createLibraryItem(fragment, lib) {
      const libraryItem = cloneTemplate(this.itemTemplate);
      libraryItem.data = lib;
      if (BookStore_default.hasLibrary(lib.libCode)) {
        libraryItem.dataset.has = "true";
        fragment.prepend(libraryItem);
      } else {
        fragment.appendChild(libraryItem);
      }
      return fragment;
    }
    showMessage(type) {
      const template = document.querySelector(`#tp-${type}`);
      if (template && this.formElement) {
        this.formElement.innerHTML = "";
        const clone = cloneTemplate(template);
        this.formElement.appendChild(clone);
      }
    }
  };

  // dev/scripts/pages/library/selectors.js
  var libraryElement = document.querySelector("app-library");

  // dev/scripts/pages/library/LibraryHeader.js
  var LibraryRegion = class extends HTMLElement {
    constructor() {
      super();
      this.regionCode = null;
      this.template = null;
      this.handleDetailSelectChange = () => {
        const { value } = this.detailSelectElement;
        console.log("detailCdoe", value);
        if (libraryElement)
          libraryElement.regionCode = value;
      };
    }
    connectedCallback() {
      this.template = document.querySelector("#tp-region");
      this.detailSelectElement = this.querySelector("select");
      this.renderFavoriteRegions();
      this.detailSelectElement.addEventListener("change", this.handleDetailSelectChange);
    }
    disconnectedCallback() {
      this.detailSelectElement.removeEventListener("change", this.handleDetailSelectChange);
    }
    renderFavoriteRegions() {
      const favoriteRegions = BookStore_default.regions;
      if (Object.keys(favoriteRegions).length === 0)
        return;
      const container = this.querySelector(".region");
      const fragment = new DocumentFragment();
      for (const regionName of Object.keys(favoriteRegions)) {
        const size = Object.keys(favoriteRegions[regionName]).length;
        if (this.template && size > 0) {
          const element = this.createElement(regionName);
          fragment.appendChild(element);
        }
      }
      container.appendChild(fragment);
      if (!this.regionCode) {
        const firstInput = container.querySelector("input");
        firstInput.checked = true;
        this.renderDetailRegion(firstInput.value);
      }
    }
    createElement(regionName) {
      if (!this.template)
        return;
      const element = cloneTemplate(this.template);
      const radioElement = element.querySelector("input");
      radioElement.value = regionName;
      radioElement.addEventListener("change", () => this.handleRegionChange(radioElement.value));
      const spanElement = element.querySelector("span");
      spanElement.textContent = regionName;
      return element;
    }
    handleRegionChange(regionCode) {
      this.regionCode = regionCode;
      this.renderDetailRegion(regionCode);
    }
    renderDetailRegion(regionName) {
      this.detailSelectElement.innerHTML = "";
      const detailRegionObject = BookStore_default.regions[regionName];
      for (const [key, value] of Object.entries(detailRegionObject)) {
        const optionEl = document.createElement("option");
        optionEl.textContent = key;
        optionEl.value = value;
        this.detailSelectElement.appendChild(optionEl);
      }
      const firstOptionElement = this.detailSelectElement.querySelector("option");
      firstOptionElement.selected = true;
      this.handleDetailSelectChange();
    }
  };

  // dev/scripts/pages/library/LibraryItem.js
  var LibraryItem = class extends HTMLElement {
    constructor() {
      super();
      this.checkbox = null;
      this.libCode = "";
      this.libName = "";
      this.checkbox = this.querySelector("[name=myLibrary]");
      this.onChange = this.onChange.bind(this);
    }
    connectedCallback() {
      var _a;
      this.render();
      (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onChange);
    }
    disconnectedCallback() {
      var _a;
      (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onChange);
    }
    render() {
      const { data } = this;
      if (data === null)
        return;
      const { libCode, libName } = data;
      this.libCode = libCode;
      this.libName = libName;
      Object.entries(data).forEach(([key, value]) => {
        const element = this.querySelector(`.${key}`);
        if (element) {
          element.innerHTML = value;
        }
      });
      const hoempageLink = this.querySelector(".homepage");
      if (hoempageLink)
        hoempageLink.href = data.homepage;
      if (this.checkbox) {
        this.checkbox.checked = BookStore_default.hasLibrary(libCode);
      }
    }
    onChange() {
      var _a;
      if ((_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.checked) {
        BookStore_default.addLibrary(this.libCode, this.libName);
      } else {
        BookStore_default.removeLibrary(this.libCode);
      }
    }
  };

  // dev/scripts/pages/library/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-library", Library);
  customElements.define("library-header", LibraryRegion);
  customElements.define("library-item", LibraryItem);
})();
//# sourceMappingURL=index.js.map
