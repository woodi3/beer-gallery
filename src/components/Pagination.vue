<template>
    <div class="pagination-container">
        <sui-button animated v-if="activePage !== 1" @click="goBack">
            <sui-button-content visible>Back</sui-button-content>
            <sui-button-content hidden>
                <sui-icon name="left arrow" />
            </sui-button-content>
        </sui-button>
        <sui-button-group v-if="activePage !== lastBtn">
            <sui-button v-for="(btn) in sliceThree" 
            :key="btn"
            :active="btn === activePage"
            @click="changePage(btn)">
                {{btn}}
            </sui-button>
        </sui-button-group>
        <sui-button-group v-if="moreThanThree" style="margin-right: .25rem;">
            <sui-button
            :disabled="true">
                ...
            </sui-button>
            <sui-button
            @click="changePage(lastBtn)"
            :active="lastBtn === activePage">
                {{lastBtn}}
            </sui-button>
        </sui-button-group>
        <sui-button animated v-if="activePage !== lastBtn" @click="goNext">
            <sui-button-content visible>Next</sui-button-content>
            <sui-button-content hidden>
                <sui-icon name="right arrow" />
            </sui-button-content>
        </sui-button>
    </div>
</template>

<script>
export default {
    props: {
        'total': {
            type: Number,
            required: true,
        },
        'amountPerPage': {
            type: Number,
            default: 25
        }
    },
    data() {
        return {
            activePage: 1
        }
    },
    mounted(){
        window.addEventListener("keydown", e => {
            if(e.key === "ArrowLeft") {
                this.goBack();
            }
            else if (e.key === "ArrowRight") {
                this.goNext();
            }
        });
    },
    computed: {
        btnAmount(){
            return [...Array(Math.ceil(this.total/this.amountPerPage)).keys()].map(x => ++x);
        },
        sliceThree(){
            const i = this.activePage - 1;
            const slice= this.btnAmount.slice(i, i+3);
            const idxOfLast = slice.indexOf(this.lastBtn);
            if(idxOfLast > -1) {
                slice.splice(idxOfLast, 1);
            }
            return slice;
        },
        lastBtn(){
            return this.btnAmount[this.btnAmount.length - 1];
        },
        moreThanThree() {
            return this.btnAmount.length > 3;
        }
    },
    methods: {
        changePage(btn) {
            this.activePage = btn;
            this.$emit('pageChange', btn);
        },
        goBack() {
            if(this.activePage === 1)
                return;
            this.activePage--;
            this.changePage(this.activePage)
        },
        goNext() {
            if(this.activePage === this.lastBtn)
                return;
            this.activePage++;
            this.changePage(this.activePage)
        }
    }
}
</script>
<style scoped>
.pagination-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
}
</style>