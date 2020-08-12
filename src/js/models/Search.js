import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
        this.searchResults;
    }

    async getResults() {
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.searchResults = result.data.recipes;
``        } catch (error) {
            console.log("Could not fetch recipes..." + error)
        } 
    }
};