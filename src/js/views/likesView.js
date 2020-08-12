import { elements } from './base'
import * as searchView from './searchView'

export const toggleLikesButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numberOfLikes => {
    elements.likesMenu.style.visibility = numberOfLikes > 0 ? 'visible' : 'hidden';

};

export const renderLike = recipe => {

    const markup = `
        <li>
            <a class="likes__link" href="#${recipe.id}">
                <figure class="likes__fig">
                    <img src="${recipe.img}" alt="${recipe.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${searchView.reduceRecipeTitle(recipe.title)}</h4>
                    <p class="likes__author">${recipe.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const removeLike = id => {

    const elementToRemove = document.querySelector(`.likes__link, a[href="#${id}"]`).parentElement;
    
    if (elementToRemove) {
        elementToRemove.parentElement.removeChild(elementToRemove);
    }
};


// export const clearLikesMenu = () => {
//     elements.likesList.innerHTML = '';
// };