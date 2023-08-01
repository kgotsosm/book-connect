/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-tabs */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint linebreak-style: ["error", "windows"] */
import {
  books, genres, authors, BOOKS_PER_PAGE,
} from './data.js';

import { data } from './scripts.js';

/* ---------------------------------------GLOBAL VARIABLES--------------------------------------- */

/**
   * This is the fragment used to create the book button lists html
   */
const FRAGMENT = document.createDocumentFragment();

/* -----------------------------------------------DISPLAY---------------------------------------- */
/**
 * @typedef {object} Div
 */
/**
 * This creates the button element then loads the book information
 * before displaying it on the html page.
 *
 * @param {object} book
 * @returns {Div} FRAGMENT
 */
const createBookButtons = (book) => {
  /* create a button element for the books so each book is
    in its own card */
  const button = document.createElement('button');
  // create a class and call it preview
  button.classList.add('preview');
  // Set the button's data-preview attribute to the book's id.
  button.dataset.preview = book.id;
  // Set the button's inner HTML to the book's title and author.
  // eslint-disable-next-line operator-linebreak
  button.innerHTML = /* HTML markup for the book cards */
	`
	 <img class="preview__image" src="${book.image}" />
	 <div class="preview__info">
	   <h3 class="preview__title">${book.title}</h3>
	   <div class="preview__author">${authors[book.author]}</div>
	 </div>
   `;
  // Append the button to the FRAGMENT.
  FRAGMENT.appendChild(button);
  return FRAGMENT;
};

/**
 * This function updates the number of books left and then prints
 * that number on the button used to show more books.
 * @returns {Number} the number of books left that haven't been
 * loaded to the page
 */
export const updateBooksLeft = () => {
  const booksOnPage = data.home.bookCards;
  const booksOnPageCount = booksOnPage.length;
  const booksLeft = books.length - booksOnPageCount;
  return booksLeft;
};

/**
 * This function loads the home page of the website with
 * the books shown in a list of 36 at a time.
 * @param {object} books
 */
export const appendBooks = (books) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < BOOKS_PER_PAGE; i++) {
    // get the books from index 0 in the books object
    const book = books[i];
    createBookButtons(book);
  }
  // Append the fragment to the data-list-items div.
  data.home.main.appendChild(FRAGMENT);

  data.home.SHOW_MORE_BTN.innerHTML = `Show more <span class = "list__remaining">(${updateBooksLeft() - BOOKS_PER_PAGE})</span>`;
};

/**
     * This function will add more books to the page and update
     * the number in the show more button everytime it is clicked
     * until there are no more books left in the books object.
	 *
	 * @param {'click'} event
     */
export const showMoreAction = (event) => {
  event.preventDefault();
  const booksOnPage = document.querySelectorAll('.preview');
  const booksOnPageCount = booksOnPage.length;
  const booksLeft = books.length - booksOnPageCount;

  if (booksLeft > 36) {
    appendBooks(books.slice(booksOnPageCount, booksOnPageCount + 36));
    data.home.SHOW_MORE_BTN.innerHTML = `Show more <span class="list__remaining">(${booksLeft - BOOKS_PER_PAGE})</span>`;
  } else {
    for (let i = 0; i < booksLeft; i++) {
      const book = books[i];
      createBookButtons(book);
    }

    data.home.main.appendChild(FRAGMENT);
    data.home.SHOW_MORE_BTN.innerHTML = 'Show more <span class="list__remaining">(0)</span>';
    data.home.SHOW_MORE_BTN.disabled = true;
  }

  const bookList = document.querySelectorAll('.preview');
  for (let z = booksOnPageCount; z < books.length; z++) {
    // eslint-disable-next-line no-use-before-define
    bookList[z].addEventListener('click', descriptionOverlay);
  }
};

/* ----------------------------------------BOOK SUMMARY OVERLAY---------------------------------- */

/**
 * This handler shows the book description overlay when the book is clicked on
 * @param event
 */
export const descriptionOverlay = (event) => {
  event.preventDefault();

  const bookSummary = data.summary.overlay;
  // get the book that is clicked by getting the closest element with the identifier to
  // where the click happened.
  const book = event.target.closest('.preview');
  // get a book id to use to fetch book information
  const bookId = book.getAttribute('data-preview');
  // for loop to iterate over the book object lloking for matchind ids
  for (let i = 0; i < books.length; i++) {
    // check if the id in the books object matches that of the clicked book
    if (books[i].id === bookId) {
      // The book summary overlay html
      bookSummary.innerHTML = /* html */
        `<div class="overlay__preview">
        <img class="overlay__blur" data-list-blur="" src="${books[i].image}">
        <img class="overlay__image" data-list-image="" src="${books[i].image}">
        </div>
        <div class="overlay__content">
        <h3 class="overlay__title" data-list-title="">${books[i].title} (${new Date(books[i].published).getFullYear()})</h3>
        <div class="overlay__data" data-list-subtitle="">${authors[books[i].author]}</div>
        <p class="overlay__data overlay__data_secondary" data-list-description="">${books[i].description}</p>
        </div>
        <div class="overlay__row">
        <button class="overlay__button overlay__button_primary" data-list-close="">Close</button>
        </div>`;
    }
  }
  // show the book summary overlay when its done being created
  bookSummary.showModal();
  // when the close button is clicked, the overlay should be removed
  document.querySelector('[data-list-close]').addEventListener('click', () => {
    bookSummary.close();
  });
};

/* ----------------------------------------------SEARCH-------------------------------------------*/

/**
 * This is an array of the values of the genres object.
 */
const genreArray = Object.values(genres);
genreArray.unshift('All Genres');

/**
 * This is an array of the values of the authors object.
 */
const authorArray = Object.values(authors);
authorArray.unshift('All Authors');

/**
 * This is the dialog box for the search overlay html
 */
export const searchDialog = document.querySelector('[data-search-overlay]');

searchDialog.innerHTML = /* html */
	`<div class="overlay__content">
      <form class="overlay__form" data-search-form="" id="search">
        <label class="overlay__field">
          <div class="overlay__label">Title</div>
          <input class="overlay__input" data-search-title="" name="title" placeholder="Any">
        </label>
  
        <label class="overlay__field">
          <div class="overlay__label">Genre</div>
          <select class="overlay__input overlay__input_select" data-search-genres="" name="genre">${genreArray.map((genreArray) => `<option value="${genreArray}">${genreArray}</option>`)}</select>
        </label>
  
        <label class="overlay__field">
          <div class="overlay__label">Author</div>
          <select class="overlay__input overlay__input_select" data-search-authors="" name="author">${authorArray.map((authorArray) => `<option value="${authorArray}">${authorArray}</option>`)}</select>
        </label>
      </form>
  
      <div class="overlay__row">
        <button class="overlay__button" data-search-cancel="">Cancel</button>
        <button class="overlay__button overlay__button_primary" type="submit" form="search">Search</button>
      </div>
    </div>`;

/**
 * This handler shows the search overlay when the search button in
 * the header is clicked.
 * @param event
 */
export const handleSearchOverlay = (event) => {
  event.preventDefault();
  searchDialog.showModal();
  data.search.title.focus();
};

/**
 * This handler will run the search through the books object
 * and create new buttons with the search results then print them to the
 * html page.
 * If multiple criteria has been selected, it will show list of books that meet all the conditions
 * @param event
 * @returns
 */
export const searchBooks = (event) => {
  event.preventDefault();

  const searchText = document.querySelector('[data-search-title]').value.toLowerCase().trim();
  const selectedGenre = document.querySelector('[data-search-genres]').value;
  const selectedAuthor = document.querySelector('[data-search-authors]').value;

  let filteredBooks = books;

  if (selectedGenre !== 'All Genres') {
    const genreId = Object.keys(genres).find((key) => genres[key] === selectedGenre);
    filteredBooks = filteredBooks.filter((book) => book.genres.includes(genreId.toString()));
  }

  if (selectedAuthor !== 'All Authors') {
    const authorId = Object.keys(authors).find((key) => authors[key] === selectedAuthor);
    filteredBooks = filteredBooks.filter((book) => book.author.includes(authorId));
  }

  if (searchText !== '') {
    filteredBooks = filteredBooks.filter((book) => book.title.toLowerCase().includes(searchText));
  }

  const booksFound = filteredBooks.length > 0;
  // if there are no books found then should print message
  if ((!booksFound) || ((!searchText) && (selectedAuthor === 'All Authors') && (selectedGenre === 'All Genres'))) {
    document.querySelector('[data-list-items]').innerHTML = '';
    document.querySelector('[data-list-items]').innerHTML = `<div class = "list__message list__message_show" data-list-message = "">
                                                              <p>No results found.
                                                              Your filters may be too narrow, try again</p>
                                                          </div>`;

    // disable the show more button for the results page
    data.home.SHOW_MORE_BTN.disabled = true;

    return filteredBooks;
  }

  // Clear the book list on the homepage
  data.home.main.innerHTML = '';

  // Append the filtered books to the book list, used BOOKs_perpage to show only 36 books per page
  filteredBooks.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    createBookButtons(book);
  });
  data.home.main.appendChild(FRAGMENT);

  // disable the show more button for the results page
  data.home.SHOW_MORE_BTN.disabled = true;

  // Show the summary overlay on the search results
  const searchResultList = data.home.main;
  const searchResultBook = searchResultList.querySelectorAll('button');
  for (const singleResult of searchResultBook) {
    singleResult.addEventListener('click', descriptionOverlay);
  }
};

/* --------------------------------------TOGGLE LIGHT/DARK MODE---------------------------------- */

/**
 * This variable is the dialog box for the light/dark toggle overlay
 */
export const lightToggleDialog = document.querySelector('[data-settings-overlay]');

lightToggleDialog.innerHTML = /* html */
	`<div class="overlay__content">
                            <form class="overlay__form" data-settings-form="" id="settings">
                            <label class="overlay__field">
                              <div class="overlay__label">Theme</div>
  
                              <select class="overlay__input overlay__input_select" data-settings-theme="" name="theme">
                                <option value="day">Day</option>
                                <option value="night">Night</option>
                              </select>
                            </label>
                            </form>
  
                            <div class="overlay__row">
                            <button class="overlay__button" data-settings-cancel="">Cancel</button>
                            <button class="overlay__button overlay__button_primary" type="submit" form="settings">Save</button>
                            </div>
                            </div>`;

const day = {
  dark: '10, 10, 20',
  light: '255, 255, 255',
};

const night = {
  dark: '255, 255, 255',
  light: '10, 10, 20',
};

/**
 * This handler will switch the theme of the webpage when clicked.
 * It fetch the value attribute of each of the options and check whether they were
 * the selected option when the save button was clicked then change the theme.
 * @param event
 */
export const changeTheme = (event) => {
  event.preventDefault();
  const themeOption = document.querySelector('[data-settings-theme]').querySelectorAll('option');
  // first find the selected theme
  let selectedTheme = null;
  for (const singleOption of themeOption) {
    if (singleOption.selected) {
      selectedTheme = singleOption.value;
    }
  }
  // fetch the whole document to change its colors
  const root = document.documentElement;

  if (selectedTheme.toLocaleLowerCase() !== 'night') {
    root.style.setProperty('--color-dark', day.dark);
    root.style.setProperty('--color-light', day.light);
  } else {
    root.style.setProperty('--color-dark', night.dark);
    root.style.setProperty('--color-light', night.light);
  }
  //  close the toggle overlay
  lightToggleDialog.close();
};
