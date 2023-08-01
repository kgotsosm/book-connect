/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
import { books } from './data.js';

import {
  appendBooks,
  showMoreAction,
  descriptionOverlay,
  searchBooks,
  changeTheme,
  handleSearchOverlay,
  searchDialog,
  lightToggleDialog,
} from './functions.js';

/* -------------------------------------DOM ELEMENTS STORAGE OBJECT------------------------------ */

/**
 * this object has the query selectors for all the DOM elements used in the javascript
 */
export const data = {
  home: {
    root: document.documentElement,
    main: document.querySelector('[data-list-items]'),
    SHOW_MORE_BTN: document.querySelector('[data-list-button]'),
    logoText: document.querySelector('.header__text'),
    bookCards: document.querySelectorAll('preview'),
    search: document.querySelector('[data-header-search]'),
    themeBtn: document.querySelector('[data-header-settings]'),
  },
  summary: {
    overlay: document.querySelector('[data-list-active]'),
    close: document.querySelector('[data-list-close]'),
  },
  search: {
    overlay: document.querySelector('[data-search-overlay]'),
    title: document.querySelector('[data-search-title]'),
    searchBtn: document.querySelector('[data-search-overlay]').querySelectorAll('button')[1],
    searchCancelBtn: document.querySelector('[data-search-overlay]').querySelectorAll('button')[0],
  },
  theme: {
    overlay: document.querySelector('[data-settings-overlay]'),
    toggleSaveBtn: document.querySelector('[data-settings-overlay]').querySelectorAll('button')[1],
    toggleCancelBtn: document.querySelector('[data-settings-overlay]').querySelectorAll('button')[0],
  },
};

/* ---------------------------------------HOME PAGE DISPLAY-------------------------------------- */

/* calling the function to load the page with book list using an event
listener for when the page first loads  */
data.home.root.addEventListener('load', appendBooks(books));

/* use event listener to make button load more books with the
showMoreAction function */
data.home.SHOW_MORE_BTN.addEventListener('click', showMoreAction);

/* this event listener return to home button when you click on the book connect
text and logo */
data.home.logoText.addEventListener('click', (event) => {
  event.preventDefault();
  // Clear the book list on the homepage
  document.querySelector('[data-list-items]').innerHTML = '';
  // call this function to load the page again
  appendBooks(books);
});

/* make the summary overlay show when a book is clicked
 Used a for loop to iterate over all the book buttons so that
 each one can be clicked on */
const bookList = document.querySelectorAll('.preview');
// eslint-disable-next-line no-restricted-syntax
for (const singleBook of bookList) {
  singleBook.addEventListener('click', descriptionOverlay);
}

/* ----------------------------------------------SEARCH------------------------------------------ */

// this is to carry out the book search when the search button is clicked
data.search.searchBtn.addEventListener('click', searchBooks);

// this is to close the overlay when the search is done
data.search.searchBtn.addEventListener('click', (event) => {
  event.preventDefault();
  searchDialog.close();
});

// this is to close the search overlay when the cancel button is clicked
data.search.searchCancelBtn.addEventListener('click', (event) => {
  event.preventDefault();
  searchDialog.close();
});

/* event listener for the search button to bring out the overlay */
const homeSearchBtn = data.home.search;
homeSearchBtn.addEventListener('click', handleSearchOverlay);

/* ----------------------------------------LIGHT/DARK TOGGLE--------------------------------------*/

// This is the event listener that shows the light/dark toggle overlay
data.home.themeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  lightToggleDialog.showModal();
});

/* event listener for the save button in the light/dark toggle dialog */
data.theme.toggleSaveBtn.addEventListener('click', changeTheme);

/* event listener for cancel button to remove overlay */
data.theme.toggleCancelBtn.addEventListener('click', (event) => {
  event.preventDefault();
  lightToggleDialog.close();
});
