import uniqid from 'uniqid'

export default class List {

    constructor() {
        this.ingredients = new Map();
    }

    addIngredient(ingredientAsObject) {    
        this.ingredients.set(uniqid(), ingredientAsObject);
        return ingredientAsObject;
    }

    deleteIngredient(id) {
        if (this.ingredients.has(id)) {
            this.ingredients.delete(id);
        }
    }

    updateIngredientCount(id, newCount) {
        this.ingredients.get(id).count = newCount;
    }

};