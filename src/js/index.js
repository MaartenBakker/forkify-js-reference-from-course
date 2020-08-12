import { elements, renderLoadingSpinner, clearLoadingSpinner } from './views/base'

import Search from './models/Search'
import List from './models/List'
import Recipe from './models/Recipe'
import Likes from './models/Likes'

import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'

const globalState = {
    search: null,
    recipe: null,
    likes: new Likes()
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

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipeView();
        renderLoadingSpinner(elements.recipeView);
        
        if (globalState.search) {
            searchView.highlightSelected(id);
        }

        // Create new recipe object
        globalState.recipe = new Recipe(id);

        try {
        // Get recipe data
            await globalState.recipe.importRecipeData();
            // Calculate servings and time
            globalState.recipe.calculateServings();
            // Render recipe

            globalState.recipe.parseIngredients();
            recipeView.renderRecipe(globalState.recipe, globalState.likes.isLiked(globalState.recipe.id));

        } catch (error) {
            console.log(error);
        } finally {
            clearLoadingSpinner();
        }
    }
};

const controlLikeButton = () => {

    if(!globalState.likes) {
        globalState.likes = new Likes();
    }

    const id = globalState.recipe.id;
    const isLiked = globalState.likes.isLiked(id);

    if(!isLiked) { 
       const newLike = globalState.likes.addLike(globalState.recipe);
       likesView.toggleLikesButton(true);
       likesView.renderLike(newLike);

    } else if (isLiked) {
        globalState.likes.deleteLike(id);
        likesView.toggleLikesButton(false);
        likesView.removeLike(id);

    }

    likesView.toggleLikeMenu(globalState.likes.getNumberOfLikes());
};

const controlRecipeServingsUpdate = event => {

    if (event.target.matches('.btn-decrease, .btn-decrease *' )) {
        globalState.recipe.updateServings('decrease');

    } else if (event.target.matches('.btn-increase, .btn-increase *' )) {
        globalState.recipe.updateServings('increase');

    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLikeButton();
    }

    recipeView.renderRecipe(globalState.recipe, globalState.likes.isLiked(globalState.recipe.id));
};


['hashchange', 'load'].forEach(event => addEventListener(event, controlRecipe));

elements.recipeView.addEventListener('click', controlRecipeServingsUpdate);
elements.recipeView.addEventListener('click', event =>{

    if (event.target.matches('.recipe__btn-add, .recipe__btn-add *' )) {
        controlList();
    }

})


// LIST

const controlList = () => {

    if(!globalState.list) {
        globalState.list = new List();
    }

    globalState.recipe.ingredients.forEach(element => globalState.list.addIngredient(element));
    globalState.list.ingredients.forEach((value, key) => listView.renderIngredient(value, key));
}

const controlDeleteShoppingItem = id => {

    globalState.list.deleteIngredient(id);
    listView.deleteIngredient(id);

}

elements.shoppingList.addEventListener('click', event => {

    const id = event.target.closest('.shopping__item').dataset.itemid;
    
    if (event.target.matches('shopping__delete, .shopping__delete *')) {
        controlDeleteShoppingItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value);
        globalState.list.updateIngredientCount(id, value);
    }
    
})

// LIKES

window.addEventListener('load', ()=> {
    if (globalState.likes) {
        globalState.likes.loadStoredData().forEach(likesView.renderLike);
    };

    likesView.toggleLikeMenu(globalState.likes.getNumberOfLikes());
});
 