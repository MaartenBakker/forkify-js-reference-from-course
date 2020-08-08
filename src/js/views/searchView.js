import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = null;
};

export const clearSearchResults = () => {
    elements.searchResultsList.innerHTML = '';
}; 

const reduceRecipeTitle = (recipeTitle, limit = 17) => {
    // let wordArray;

    if (recipeTitle.length >= limit) {

        // wordArray = recipeTitle.split(' ');
        // recipeTitle = '';

        // for (const [index, word] of wordArray.entries()) {
        //     if (recipeTitle.length + word.length > limit ) {
        //         break;
        //     } else {
        //         recipeTitle += index === 0? word : ` ${word}`;
        //     }
        // }
        // recipeTitle += '...';

        recipeTitle = `${
            recipeTitle.split(' ')
            .reduce((acc, cur) => (acc.length + cur.length <= limit)? `${acc} ${cur}` : `${acc}`, ``)
        }...`
    }

    return recipeTitle;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src=${recipe.image_url} alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${reduceRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

// type is 'prev' or 'next
const getSingleButtonMarkup = (page, type) => {
    const [pageToGoTo, direction] = type === 'prev'? [page - 1, 'left'] : [page + 1, 'right'];

    return ( `
        <button class="btn-inline results__btn--${type}" data-goto=${pageToGoTo}>
        <span>Page ${pageToGoTo}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${direction}"></use>
            </svg>
        </button>
        `);
};



const clearPageButtons = () => elements.resultsPageButtons.innerHTML = '';



const renderPaginationButtons = (page, numberOfResults, resultsPerPage) => {
    const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);
    let button;
    clearPageButtons();

    if (numberOfPages > 1) {

        if (page === 1) {
            button = getSingleButtonMarkup(page, 'next');
        }
    
        else if (page === numberOfPages) {
            button = getSingleButtonMarkup(page, 'prev');
        }
    
        else {
            button = getSingleButtonMarkup(page, 'prev') +
                     getSingleButtonMarkup(page, 'next');
        }

        elements.resultsPageButtons.insertAdjacentHTML("afterbegin", button);
    }


};

export const renderResults = (searchResults, page = 1, resultsPerPage = 10) => {

    const start = (page - 1) * resultsPerPage;
    const end = start + resultsPerPage;

    searchResults.slice(start, end).forEach(renderRecipe);
    renderPaginationButtons(page, searchResults.length, resultsPerPage);
};