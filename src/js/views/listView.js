import { elements } from './base'

export const renderIngredient = (ingredient, id) => {
    const markup = `
        <li class="shopping__item" data-itemid="${id}">
            <div class="shopping__count">
                <input type="number" value="${ingredient.count}" step="${ingredient.count}" class="shopping__count-value">
                <p>${ingredient.unit}</p>
            </div>
            <p class="shopping__description">${ingredient.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    elements.shoppingList.insertAdjacentHTML('beforeend', markup);

};

export const deleteIngredient = id => {
    const ingredient = document.querySelector(`[data-itemId="${id}"]`);
    ingredient.parentElement.removeChild(ingredient);

};