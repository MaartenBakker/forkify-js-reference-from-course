import uniqid from 'uniqid'

export default class Likes {

    constructor() {
        this.likes = new Map();
    }

    addLike(recipe) {
        this.likes.set(recipe.id, recipe);
        this.persistData();
        return recipe;
    }

    deleteLike(id) {
        if (this.likes.has(id)) {
            this.likes.delete(id);
            this.persistData();
        }
    }

    isLiked(id) {
        return this.likes.has(id);
    }

    getNumberOfLikes() {
        return this.likes.size;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(Array.from(this.likes)));
    }

    loadStoredData() {
        const data = new Map(JSON.parse(localStorage.getItem('likes')));
        if (data) {
            this.likes = data;
        }
        return data;``
    }

     
};