import axios from 'axios';


const ingredientsMap = new Map();
        ingredientsMap.set('tablespoons', 'tbsp');
        ingredientsMap.set('tablespoon', 'tbsp');
        ingredientsMap.set('ounces', 'oz');
        ingredientsMap.set('ounce', 'oz');
        ingredientsMap.set('teaspoons', 'tsp');
        ingredientsMap.set('teaspoon', 'tsp');
        ingredientsMap.set('cups', 'cup');
        ingredientsMap.set('pounds', 'pound');


const makeIngredientsUniform = ingredient => {
    ingredient = ingredient.toLowerCase();

    ingredientsMap.forEach((value, key) => {

        ingredient = ingredient.replace(key, value);

    });

    return ingredient;
};

const removeParentheses = ingredient => ingredient.replace(/ *\([^)]*\) */g, ' ');

const calculateUnitIndex = singleIngredientAsArray => {

    let units = [];
    ingredientsMap.forEach((value, key) => units.push(value));
    units.push('g', 'kg');

    let unitIndex = singleIngredientAsArray.findIndex(word => units.includes(word));

    return unitIndex;
};

const calculateCount = (singleIngredientAsArray, unitIndex) => {

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

        return count;
};

const setObjectCountUnitIngredient = (ingredientAsObject, singleIngredientAsArray, unitIndex) => {

    let count = calculateCount(singleIngredientAsArray, unitIndex);
        
        if (count) {
            ingredientAsObject.count = count;
        }

        ingredientAsObject.unit = singleIngredientAsArray[unitIndex];
        ingredientAsObject.ingredient = singleIngredientAsArray.slice(unitIndex + 1).join(' ');
};

const setObjectCountIngredient = (ingredientAsObject, singleIngredientAsArray) => {

    ingredientAsObject.count = parseInt(singleIngredientAsArray[0]);
    ingredientAsObject.ingredient = singleIngredientAsArray.slice(1).join(' ');

};

const setObjectIngredient = (ingredientAsObject, ingredient) => {
    
    ingredientAsObject.ingredient = ingredient;

};


const generateIngredientObject = ingredient => {

    const singleIngredientAsArray = ingredient.split(' ');

    let unitIndex = calculateUnitIndex(singleIngredientAsArray);
    
    let ingredientAsObject = {
        count: 1,
        unit: '',
        ingredient: ''
    };

    if (unitIndex > -1){

        setObjectCountUnitIngredient(ingredientAsObject, singleIngredientAsArray, unitIndex);

    } else if (parseInt(singleIngredientAsArray[0])) {

        setObjectCountIngredient(ingredientAsObject, singleIngredientAsArray);
        
    } else if (unitIndex === -1) {

        setObjectIngredient(ingredientAsObject, ingredient);

    }

    return ingredientAsObject;
};



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
        
        const parsedIngredients = this.ingredients.map(ingredient => {
            ingredient = makeIngredientsUniform(ingredient);
           
            ingredient = removeParentheses(ingredient);
    
            return generateIngredientObject(ingredient);
        });

        this.ingredients = parsedIngredients;

    }

    // type can be increase or decrease
    updateServings(type) {

        let newServings = type === 'decrease'? this.servings - 1 : this.servings + 1;

        if (newServings < 1) {
            newServings = 1;
        }

        this.ingredients.forEach(ingredient => {

            ingredient.count *= newServings / this.servings;

        });

        this.servings = newServings;
    }
};