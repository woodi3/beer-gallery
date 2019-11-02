export class Beer {
    constructor(
        id, 
        name, 
        tagline, 
        description, 
        image_url, 
        abv,
        ingredients, 
        food_pairing,
        brewers_tips,
        isSaved
    ){
        this.id = id
        this.name = name
        this.tagline = tagline
        this.description = description
        this.image_url = image_url
        this.abv = abv // alcohol percentage i believe (I'm not a beer drinker :) )
        this.ingredients = ingredients
        this.food_pairing = food_pairing
        this.brewers_tips = brewers_tips
        this.isSaved = isSaved
    }

    toggleIsSaved() {
        this.isSaved = !this.isSaved;
    }

}