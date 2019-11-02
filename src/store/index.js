import Vue from 'vue'
import Vuex from 'vuex'
import {
  TOGGLE_SAVE_BEER_MUTATION,
  SET_BEERS_MUTATION,
  TOGGLE_SAVE_BEER_ACTION,
  SET_BEERS_ACTION
} from './types'
import { getItem, setItem } from './storage'
import beerApi from './api';
import { Beer } from '../models';
import { MAX_BEERS } from '../constants';

Vue.use(Vuex)


const isSaved = (savedBeerIDs, beer) => savedBeerIDs.indexOf(beer.id) > -1;
const addDefault = (query) => `${query}&per_page=${MAX_BEERS}`;

export default new Vuex.Store({
  state: {
    beers: [],
    savedBeerIDs: getItem('savedBeers') || []
  },
  getters: {
    savedBeers: state => {
      return state.beers.filter(b => state.savedBeerIDs.indexOf(b.id) > -1);
    }
  },
  mutations: {
    [TOGGLE_SAVE_BEER_MUTATION] (state, beer) {
      beer.isSaved = !beer.isSaved;
      if(beer.isSaved) {
        const alreadySaved = isSaved(state.savedBeerIDs,beer);
        if (!alreadySaved) {
          state.savedBeerIDs.push(beer.id);
        }
      }
      else {
        const idx = state.savedBeerIDs.indexOf(beer.id)
        if(idx > -1){
          const copy = [...state.savedBeerIDs];
          copy.splice(idx, 1);
          state.savedBeerIDs = copy;
        }
      }
      setItem('savedBeers', state.savedBeerIDs);
    },
    [SET_BEERS_MUTATION] (state, beers) {
      state.beers = beers;
    }
  },
  actions: {
    [TOGGLE_SAVE_BEER_ACTION] ({commit}, beer) {
      commit(TOGGLE_SAVE_BEER_MUTATION, beer);
    },
    async [SET_BEERS_ACTION] ({ commit, state }, query) {
      try {
        const result = await beerApi.getBeers(addDefault(query));
        commit(SET_BEERS_MUTATION, result.data.map(b => 
            new Beer(
              b.id,
              b.name,
              b.tagline,
              b.description,
              b.image_url,
              b.abv,
              b.ingredients,
              b.food_pairing,
              b.brewers_tips,
              isSaved(state.savedBeerIDs, b)
            )
          )
        );
      } catch(e) {
        // TODO add some error handling mutations
      }
    }
  }
})
