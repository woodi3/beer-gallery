<template>
    <sui-card class="beer-preview">
        <sui-card-content @click.native="openModal()">
            <sui-image :src="beer.image_url ? beer.image_url : ''" size="mini" class="right floated"/>
            <sui-card-header>{{beer.name}}</sui-card-header>
            <sui-card-meta>{{beer.tagline}}</sui-card-meta>
            <sui-card-description>
                {{beer.brewers_tips}}
            </sui-card-description>
        </sui-card-content>
        <sui-button attached="bottom" 
            :color="getLikeBtnColor()"
            @click="toggleSave(beer)">
            <sui-icon name="heart" /> 
            {{beer.isSaved ? 'Unlike' : 'Like'}}
        </sui-button>
    </sui-card>
</template>

<script>
import { mapActions } from 'vuex'
import {TOGGLE_SAVE_BEER_ACTION} from '../store/types'
export default {
    props: ['beer'],
    methods: {
        ...mapActions({
            toggleSave: TOGGLE_SAVE_BEER_ACTION
        }),
        getLikeBtnColor() {
            if(this.beer.isSaved)
                return 'pink';
        },
        openModal() {
            this.$emit('openModal', this.beer);
        }
    }
}
</script>

<style scoped>
.beer-preview:hover {
    transform: scale(1.03);
    cursor: pointer;
}
</style>