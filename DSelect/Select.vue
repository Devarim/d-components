<template>
    <div class="d-select">
        <input type="text" v-model="termo" @blur="outFocus" @focus="focus">
        <input type="hidden" :name="name" v-model="value"  >
        <div class="lista" :class="{ hidden : hideList }">
            <d-option v-for="option in optionsFilter" :key="name+'_'+option[keyValue]" :value="option[keyValue]" @click="selecionar()" @selected='selected(option)' >
                {{option[keyShow]}}
            </d-option>
        </div>
    </div>
</template>
<script>
import DOption from "./Option";
export default {
    name: 'DSelect',
    components : {
        DOption
    },
    props: {
        name: {},
        keyValue: {},
        keyShow: {},
        options: {},
        value: {},
    },
    data () {
        return {
            termo_: '',
            hideList : true,
        }
    },
    computed : {
        termo : {
            get () {
                return this.termo_;
            },
            set (value) {
                var retorno = this._search(value);
                if(retorno.length > 1) {
                    this.setInputValue(0);
                } else if(retorno.length === 1) {
                    this.setInputValue(retorno[0][this.keyValue]);
                } 
                this.termo_ = value; 
                
            }
        },
        optionsFilter () {
            if(this.termo == "") return this.options;
            return this._search(this.termo);
        }
    },
    methods : { 
        _search(strParam) {
            if(strParam == null) return [];
            let strTerm = strParam.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            let regex = new RegExp(strTerm,'i');
            let options = this.options.filter((item) => {
                return regex.test(item[this.keyShow].normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            });
            return options;
        },
        setInputValue(value) {
            if(!value) value = 0;
            this.$emit('input',value)
            this.$emit('change',value)
        },
        selected (value) {
            this.termo = value[this.keyShow];
            this.setInputValue(value[this.keyValue])
        },
        outFocus () {
            setTimeout(() => {
                if(this.value === 0) {
                    this.termo = "";
                }
                var retorno = this.optionsFilter;
                 if(retorno.length === 1) {
                    this.termo = retorno[0][this.keyShow];
                } 
                
                this.hideList = true;
            }, 500);
        },
        focus () {
            setTimeout(() => {
                this.hideList = false;
            }, 500);
        }
    },
    created() {
        if(this.value) {
            let option = this.options.find((item) => {
                if(item[this.keyValue] == this.value)
                    return item;
            });
            if(option) {
                option.emmit = false;
                this.selected(option);
            }
        }
    },
    watch : {
        options(newValue, oldValue) {
            if (this.value) {
                if( newValue && oldValue.length == 0) {
                    let option = newValue.find((item) => {
                        if(item[this.keyValue] == this.value)
                            return item;
                    });
                    if(option) {
                        this.selected(option);
                    } 
                } else {
                    this.termo = "";
                }
            }
            if ( newValue && newValue.length <= 0 || !newValue) {
                this.termo = "";
            }
        },
    },
}
</script>
<style>
.d-select {
  position: relative;
}
.d-select .lista {
    margin: 0px;
    padding: 0px;
    list-style: none;
    position: absolute;
    background-color: #FFF;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
    box-shadow: 0px 1px 3px -2px #000;
    max-height: 200px;
    overflow-x: auto;

}
.d-select .lista div {
    margin: 0px;
    padding: 0.3rem;
    padding-left: 0.5rem;
    list-style: none;
    background: #FFF;
    border-bottom: 1px solid #EEE;
}
.d-select .lista div:hover {
    background: #F6F6F6;
    cursor: pointer;
    border-bottom: 1px solid #9AC88C;
}
.d-select .hidden {
    display: none;
}
</style>
