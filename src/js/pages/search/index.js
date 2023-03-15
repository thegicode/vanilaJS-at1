

import { NavGnb, BookDescription, CheckboxFavoriteBook, LibraryBookExist } from '/js/components/index.js'

import AppSearch from './AppSearch.js'
import InputSearch from './InputSearch.js'
import BookList from './BookList.js'
import BookItem from './BookItem.js'
import TestElement from './TestElement.js'

customElements.define('nav-gnb', NavGnb)
customElements.define('book-list', BookList)
customElements.define('app-search', AppSearch)
customElements.define('input-search', InputSearch)
customElements.define('book-item', BookItem)
customElements.define('book-description', BookDescription)
customElements.define('library-book-exist', LibraryBookExist)
customElements.define('checkbox-favorite-book', CheckboxFavoriteBook)
customElements.define('test-element', TestElement)
