import Search from './models/Search'
import { elements, renderLoadingSpinner, clearLoadingSpinner } from './views/base'
import * as searchView from './views/searchView'
import Recipe from './models/Recipe'
import * as recipeView from './views/recipeView'

const globalState = {
    search: null,
    recipe: null
}



// SEARCH
const controlSearch = async () => {
    const query = searchView.getInput().trim();
    
    if (query) {
        globalState.search = new Search(query);
    
        searchView.clearInput();
        searchView.clearSearchResults();
        renderLoadingSpinner(elements.results);

        try {
            await globalState.search.getResults();
            searchView.renderResults(globalState.search.searchResults);
        } catch (error) {
            console.log(console.error());
        } finally {
            clearLoadingSpinner();
        }
        
    } else {
        searchView.clearInput();
    }
    
    
} ;

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.resultsPageButtons.addEventListener('click', event => {
    const button = event.target.closest('.btn-inline');

    if (button) {
        const pageToGoTo = parseInt(button.dataset.goto);
        
        searchView.clearSearchResults();
        searchView.renderResults(globalState.search.searchResults, pageToGoTo);

    } 
});


// RECIPE
const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    console.log(id);

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipeView();
        renderLoadingSpinner(elements.recipeView);
        
        // Create new recipe object
        globalState.recipe = new Recipe(id);

        try {
        // Get recipe data
            await globalState.recipe.importRecipeData();
       
            // Calculate servings and time
            globalState.recipe.calculateServings();
            // Render recipe

            globalState.recipe.parseIngredients();
            console.log(globalState.recipe);
            recipeView.renderRecipe(globalState.recipe);
        } catch (error) {
            console.log(error);
        } finally {
            clearLoadingSpinner();
        }
    }

};


['hashchange', 'load'].forEach(event => addEventListener(event, controlRecipe));