<template>
    <div class="home-container">
        <sui-grid>
            <sui-grid-column style="padding-left: 1rem; padding-right: 2rem;">
                <div class="search-bar">
                    <sui-input 
                    v-model="searchStr"
                    class="search-input" 
                    type="search"
                    placeholder="Search by beer name..." 
                    icon="search"/>
                </div>
                <div class="home-content">
                    <div class="home-title-container">
                        <span class="home-title"><strong>Discover</strong> your favorite beer.</span>
                    </div>
                    <sui-grid-row :columns="1">
                        <sui-grid-column class="filter-dropdown-container">
                            <sui-dropdown class="filter-dropdown" 
                            text="Filters"
                            selection
                            multiple
                            floating
                            >
                                <sui-dropdown-menu>
                                    <sui-dropdown-item 
                                    v-for="filter in filters" 
                                    :key="filter.param">
                                        <sui-checkbox
                                        v-if="filter.type === filterTypes.checkbox" 
                                        :label="filter.text"
                                        v-model="filter.isSelected"
                                        @change="handleFilter(filter)"/>
                                        <sui-dropdown-divider/>
                                        <sui-input
                                        class="filter-input" 
                                        v-if="filter.type === filterTypes.input"
                                        :placeholder="filter.text" 
                                        v-model="filter.value"
                                        @change="handleFilter(filter)"
                                        />
                                    </sui-dropdown-item>
                                </sui-dropdown-menu>
                            </sui-dropdown>
                        </sui-grid-column>
                    </sui-grid-row>
                    <sui-grid v-if="currentQueries.length > 0" style="margin-top: .5rem; margin-bottom: .5rem;">
                        <sui-grid-column :width="4" v-for="query in currentQueries" :key="query.param">
                            <sui-button basic :content="query.description(query.value)" icon="close" @click="removeFilter(query)"/>
                        </sui-grid-column>
                    </sui-grid>
                    <sui-segment basic class="booze-list-container">
                        <sui-dimmer :active="isLoading">
                            <sui-loader>Loading booze... </sui-loader>
                        </sui-dimmer>
                        <sui-card-group class="booze-list" v-if="beers.length >0" :items-per-row="3" stackable>
                            <BeerPreview v-for="beer in beers" 
                            :key="beer.id" 
                            :beer="beer" 
                            @openModal="viewDetailed($event)"/>
                        </sui-card-group>
                        <Pagination :total="maxBeers" @pageChange="handlePageChange"/>
                    </sui-segment>
                </div>
            </sui-grid-column>
        </sui-grid>
        <BeerDetailed v-if="selectedBeer" :open="showDetailedModal" :beer="selectedBeer" @closeModal="closeModal"/>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import {SET_BEERS_ACTION} from '../store/types'
import BeerPreview from '../components/BeerPreview'
import BeerDetailed from '../components/BeerDetailed'
import Pagination from '../components/Pagination'

const DELAY = 200;
const FILTER_TYPES = {
    checkbox: 1,
    input: 2
};

export default {
    components: {
        BeerPreview,
        BeerDetailed,
        Pagination
    },
    data() {
        return {
            selectedBeer: null,
            isLoading: false,
            searchStr: '',
            timeout: false,
            filterQueries: [],
            flickityOptions: {
                initialIndex: 0,
                prevNextButtons: false,
                pageDots: false,
                wrapAround: false
            },
            filters: [
                {
                    text: 'ABV < 12%',
                    isSelected: false,
                    param: 'abv_lt',
                    value: 12,
                    type: FILTER_TYPES.checkbox,
                    description: (val) => `ABV is less than ${val}`
                },
                {
                    text: 'ABV >= 12%',
                    isSelected: false,
                    param: 'abv_gt',
                    value: 12,
                    type: FILTER_TYPES.checkbox,
                    description: (val) => `ABV is greater than or equal to ${val}`
                },
                {
                    text: 'IBU < 40',
                    isSelected: false,
                    param: 'ibu_lt',
                    value: 40,
                    type: FILTER_TYPES.checkbox,
                    description: (val) => `IBU is less than ${val}`
                },
                {
                    text: 'IBU >= 40',
                    isSelected: false,
                    param: 'ibu_gt',
                    value: 40,
                    type: FILTER_TYPES.checkbox,
                    description: (val) => `IBU is greater than or equal to ${val}`
                },
                {
                    text: 'EBC < 8',
                    isSelected: false,
                    param: 'ebc_lt',
                    value: 8,
                    type: FILTER_TYPES.checkbox,
                    description: (val) => `EBC is less than ${val}`
                },
                {
                    text: 'EBC >= 8',
                    isSelected: false,
                    param: 'ebc_gt',
                    value: 8,
                    type: FILTER_TYPES.checkbox,
                    description: (val) => `EBC is greater than or equal to ${val}`
                },
                {
                    text: 'Yeast type...',
                    value: '',
                    param: 'yeast',
                    type: FILTER_TYPES.input,
                    description: (val) => `Yeast type contains ${val}`
                },
                {
                    text: 'Hops type...',
                    value: '',
                    param: 'hops',
                    type: FILTER_TYPES.input,
                    description: (val) => `Hops type contains ${val}`
                },
                {
                    text: 'Malt type...',
                    value: '',
                    param: 'malt',
                    type: FILTER_TYPES.input,
                    description: (val) => `Malt type contains ${val}`
                }
            ]
        }
    },

    mounted(){
        this.load(this.getPageQuery(1));
    },
    computed: {
        ... mapState({
            beers: state => state.beers,
        }),
        ...mapGetters([
            'savedBeers'
        ]),
        showDetailedModal() {
            return this.selectedBeer !== undefined && this.selectedBeer !== null
        },
        maxBeers() {
            if(this.searchStr.trim().length > 0 || this.filterQueries.length > 0){
                return this.beers.length;
            }
            return 325;
        },
        filterTypes() {
            return FILTER_TYPES
        },
        currentQueries() {
            return this.filters.filter(f => 
                (f.isSelected && f.type === FILTER_TYPES.checkbox) ||
                (f.value.toString().trim() !== '' && f.type === FILTER_TYPES.input)
            )
        }
    },
    methods: {
        ...mapActions({
            getBeers: SET_BEERS_ACTION
        }),
        viewDetailed(beer) {
            this.selectedBeer = beer;
        },
        closeModal() {
            this.selectedBeer = null;
        },
        load(query) {
            this.isLoading = true;
            this.getBeers(query);
            setTimeout(() => this.isLoading = false, 1000);
        },
        handlePageChange(page) {
            this.load(this.getPageQuery(page));
        },
        getPageQuery(page) {
            return `page=${page}`;
        },
        getSearchQuery() {
            if(!this.searchStr || this.searchStr.trim() === '')
                return ''
            const search = this.searchStr.trim().split(' ').join('_');
            return `beer_name=${search}`
        },
        handleFilter(filter) {
            let filterIdx = this.getFilterQueryIndex(filter.param);
            const query = this.buildFilterQuery(filter);
            const hasQuery = filterIdx > -1;
            if(!hasQuery){
                if(query !== '')
                    this.filterQueries.push(query);
            }
            else if(!filter.isSelected && filter.type === FILTER_TYPES.checkbox) {
                // remove the filter from filter queries
                this.filterQueries.splice(filterIdx, 1);
            }
            else if(filter.type === FILTER_TYPES.input) {
                this.filterQueries.splice(filterIdx, 1);
                if(query !== '')
                    this.filterQueries.push(query);
            }
            this.load(this.buildFilterQueries(this.filterQueries))
        },
        buildFilterQuery(filter) {
            let query = '';
            if(filter.type === FILTER_TYPES.checkbox){
                // checkbox
                query = `${filter.param}=${filter.value}`;
            }
            else if(filter.type === FILTER_TYPES.input){
                // input
                if (filter.value.trim() !== ''){
                    const val = filter.value.trim().split(' ').join('_');
                    query = `${filter.param}=${val}`;
                }
            }
            return query;
        },
        buildFilterQueries(queries){
            const query = queries.join("&")
            return query;
        },
        getFilterQueryIndex(param) {
            return this.filterQueries.findIndex(q => q.indexOf(param) > -1);
        },
        removeFilter(filter) {
            if(filter.type === FILTER_TYPES.checkbox) {
                filter.isSelected = false;
            }
            else if(filter.type === FILTER_TYPES.input) {
                filter.value = '';
            }
            this.handleFilter(filter);
        }
    },
    watch: {
        searchStr(val) {
            if(this.timeout) 
                clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                if(this.filterQueries.length > 0) {
                    const queries = [...this.filterQueries, this.getSearchQuery(val)]
                    this.load(this.buildFilterQueries(queries));
                }
                else {
                    this.load(this.getSearchQuery(val))
                }
            }, DELAY);

        }
    }
}
</script>

<style scoped>
.home-container {
    background-color: #ecf0ff;
    padding-left: 2rem;
}
.home-content {
    margin-top: 3rem;
    margin-bottom: 3rem;
}
.home-title-container {
    margin-bottom: 1rem !important;
    margin-top: 1rem !important;
}
.home-title {
    font-size: 3rem;
}
.user-container {
    background-color: #fff;
    position: fixed !important;
    right: 0;
    height: 100%;
    padding-top: 4rem !important;
    overflow: auto;
}
.search-bar {
    width: 33%;
}
.search-input {
    width: 100%;
    margin-top: 3rem;
}
/* .beer-image {
    height: 350px;
} */
.booze-list-container {
    background: inherit !important; 
    border: 0 !important;
}
.booze-list {
    padding: 1rem;
    margin-bottom: 1rem !important;
    max-height: 460px; 
    overflow: auto;
}
.filter-dropdown-container {
    text-align: right !important;
}
.user-avi {
    height: 56px !important;
    width: 56px !important;
}
.saved-beer-text {
    font-size: 16px;
    font-weight: bold;
}
.user-tab-container {
    margin-bottom: 2rem !important;
}
.saved-beer-title {
    font-size: 2rem;
}
.user-px-3  {
    padding-left: 3rem !important;
    padding-right: 1rem !important;
}
/* .filter-dropdown {
    margin-left: auto;
} */
</style>