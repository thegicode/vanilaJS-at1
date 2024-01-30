"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthlyKeywords = exports.loanItemSrch = exports.librarySearchByBook = exports.usageAnalysisList = exports.bookExist = exports.librarySearch = exports.searchKyoboBook = exports.searchNaverBook = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const naverApi_1 = require("./naverApi");
const kyoboApi_1 = require("./kyoboApi");
const libraryApi_1 = require("./libraryApi");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env.key") });
const searchNaverBook = (req, res) => (0, naverApi_1.searchBook)(req, res);
exports.searchNaverBook = searchNaverBook;
const searchKyoboBook = (req, res) => (0, kyoboApi_1.searchBookByWeb)(req, res);
exports.searchKyoboBook = searchKyoboBook;
const librarySearch = (req, res) => (0, libraryApi_1.searchOpenLibrary)(req, res);
exports.librarySearch = librarySearch;
const bookExist = (req, res) => (0, libraryApi_1.getExistBookInfo)(req, res);
exports.bookExist = bookExist;
const usageAnalysisList = (req, res) => (0, libraryApi_1.usageAnalysis)(req, res);
exports.usageAnalysisList = usageAnalysisList;
const librarySearchByBook = (req, res) => (0, libraryApi_1.searchLibraryOfBook)(req, res);
exports.librarySearchByBook = librarySearchByBook;
const loanItemSrch = (req, res) => (0, libraryApi_1.getPopularBooks)(req, res);
exports.loanItemSrch = loanItemSrch;
const monthlyKeywords = (req, res) => (0, libraryApi_1.getKeysords)(req, res);
exports.monthlyKeywords = monthlyKeywords;
