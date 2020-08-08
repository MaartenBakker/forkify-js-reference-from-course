import axios from 'axios';
import { elements } from '../views/base';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async importRecipeData() {
        try {
            const importedRecipeData = (await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)).data.recipe;
            
            this.title = importedRecipeData.title;
            this.author = importedRecipeData.publisher;
            this.img = importedRecipeData.image_url;
            this.url = importedRecipeData.source_url;
            this.ingredients = importedRecipeData.ingredients;

            this.calculateCookingTime();

        } catch (error) {
            console.log(error);
        }
    }

    calculateCookingTime() {
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3);
        this.time = periods * 15;
    }

    calculateServings() {
        this.servings = 4;
    }
    
    parseIngredients() {
        const ingredientsMap = new Map();
        ingredientsMap.set('tablespoons', 'tbsp');
        ingredientsMap.set('tablespoon', 'tbsp');
        ingredientsMap.set('ounces', 'oz');
        ingredientsMap.set('ounce', 'oz');
        ingredientsMap.set('teaspoons', 'tsp');
        ingredientsMap.set('teaspoon', 'tsp');
        ingredientsMap.set('cups', 'cup');
        ingredientsMap.set('pounds', 'pound');



        const parsedIngredients = this.ingredients.map(ingredient => {
            // uniform units
            ingredient = ingredient.toLowerCase();

            ingredientsMap.forEach((value, key) => {

                ingredient = ingredient.replace(key, value);

            });

            // remove ()
           
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // split into count, unit, ingredient
            const singleIngredientAsArray = ingredient.split(' ');
            let units = [];
            ingredientsMap.forEach((value, key) => units.push(value));


            let unitIndex = singleIngredientAsArray.findIndex(word => units.includes(word));
           
            let ingredientAsObject = {
                count: 1,
                unit: '',
                ingredient: ''
            };

            if (unitIndex > -1){

                const countStrings = singleIngredientAsArray.slice(0, unitIndex);
                let count;
                if (countStrings.length === 1) {
                    count = eval(singleIngredientAsArray[0].replace('-','+'));
                } else {
                    count = eval(countStrings.join('+').replace('-','+'));
                }

                if (count && count % 1 !== 0) {
                    count = count.toFixed(2);
                }

                if (count) {
                    ingredientAsObject.count = count;
                }

                ingredientAsObject.unit = singleIngredientAsArray[unitIndex];
                ingredientAsObject.ingredient = singleIngredientAsArray.slice(unitIndex + 1).join(' ');

            } else if (parseInt(singleIngredientAsArray[0])) {

                ingredientAsObject.count = parseInt(singleIngredientAsArray[0]);
                ingredientAsObject.ingredient = singleIngredientAsArray.slice(1).join(' ');
                
            } else if (unitIndex === -1) {

                ingredientAsObject.ingredient = ingredient;

            }
    
            return ingredientAsObject;
        });

        this.ingredients = parsedIngredients;

    }
}