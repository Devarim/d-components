<template>

    <div class="v-pagination" v-if="data">
        <span @click="openpage(1)" class="page"> &laquo; </span>
        <span v-if="data.current_page - size_page_show > 1" class="page" @click="openpage(1)"> 1 </span>
        <span v-if="data.current_page - size_page_show > 2" > ... </span>
        <span v-for="(i, index) in arrayPagination" :key="index" @click="openpage(i)" class="page" 
        :class="{'currentPage': i == data.current_page }"> {{i}} </span>
        <span v-if="data.current_page + size_page_show < data.last_page - 1"> ... </span>
        <span v-if="data.current_page + size_page_show < data.last_page" class="page" @click="openpage(data.last_page)"  > {{data.last_page}} </span>
        <span @click="openpage(data.last_page)" class="page"> &raquo; </span>
    </div>

</template>

<script>


function range (start, end) { 

    return Array.from({length: (end - start + 1)}, (v, k) => k + start);
}


export default {
    name: "DPagination",
    
    data () {
        return {
            size_page_show : 5,
        }
    },

    props : {
        data : ""

    },

    computed : {
        arrayPagination () {
            
            if(this.data.current_page) {
                var startPage = (this.data.current_page - this.size_page_show <= 0 ? 1 : this.data.current_page - this.size_page_show);
                var endPage = (this.data.current_page + this.size_page_show > this.data.last_page ? this.data.last_page : this.data.current_page + this.size_page_show);
                return range(startPage,endPage);
            }
            return [];  
        }
    },

    methods : {
        openpage (page) {
            this.$emit('open-page', page);
        }
    },
}

</script>
<style>

.v-pagination { -webkit-user-select: none; -moz-user-select: none; -khtml-user-select: none; -ms-user-select: none;  }
.v-pagination .page { font-size: 8pt; color: #666; padding: 5px; border-radius: 5px; box-shadow: 1px 1px 3px #999; background-color: #EEE; margin: 5px; min-width: 25px; display: inline-block; text-align: center; }
.v-pagination .page:hover { cursor: pointer; box-shadow: 1px 1px 3px #666; background: #FFF; }
.v-pagination .currentPage {  background: #FFF; }

.valertfade-enter-active, .valertfade-leave-active { transition: opacity 1s; }
.valertfade-enter, .valertfade-leave-to { opacity: 0; }

</style>

