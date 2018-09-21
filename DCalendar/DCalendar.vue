<template>
    <div>
        <table class="calendar">
            <thead>
                <tr>
                    <td colspan="7">
                        <div class="calendar-back" @click="backMonth()" :class="{'disable': backMonthIsLessMinDate }" >&laquo;</div>
                        <div class="calendar-title">{{month}} - {{year}}</div>
                        <div class="calendar-next" @click="nextMonth()" :class="{'disable': nextMonthIsMoreMaxDate }" >&raquo;</div>
                    </td>
                </tr>
                <tr class="title-day-weeks">
                    <td>D</td>
                    <td>S</td>
                    <td>T</td>
                    <td>Q</td>
                    <td>Q</td>
                    <td>S</td>
                    <td>S</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in weeksInMonth" :key="'rw'+row" >
                    <d-day v-for="count in daysWeek" :key="row+count" :position="(count+1)+(row*7)" :date="date" @selected="selectedDay" :max-date="momentMaxDate" :min-date="momentMinDate" :date-selected="dateSelected" :disable-dates="disableDates" :options="options"></d-day>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>

import moment from 'moment';
import 'moment/locale/pt-br';
import DDay from './DDay';

export default {
    name: "DCalendar",

    props : [
        "maxDate",
        "minDate",
        "disableDates",
        "multiple",
        "value",
        "options"
    ],
    created () {

        let xDate = (xdate) => {
            return moment(xdate).startOf('day').format("X");
        }
        
        if(this.value && this.value.constructor != [].constructor ) {
            this.selectedDay(this.value);
        } else if(this.value && this.value.constructor == [].constructor && this.value.length > 0 ) {
            this.value.forEach((item) => {
                this.selectedDay(item);
            })
        } else if(this.minDate && xDate(this.minDate) > xDate(this.value) ) {
            this.date = moment(this.minDate).format('YYYY-MM-DD');
        } else if(this.maxDate && xDate(this.maxDate) < xDate(this.value) ) {
            this.date = moment(this.maxDate).format('YYYY-MM-DD');
        } 
    },

    components : {
        DDay
    },
    data () {
        return {
            date : moment().format('YYYY-MM-DD'),
            dateSelected: [ ],
            daysWeek : [...Array(7).keys()],
        }
    },

    computed : {
        month () {
            return moment(this.date).format("MMMM");
        },
        year () {
            return moment(this.date).format("YYYY");
        },
        weeksInMonth () {
            let lastWeek = "";
            if(moment(this.date).endOf('month').week() == 1) {
                lastWeek = moment(this.date).endOf('month').subtract(1,'week').week() + 1;
            } else {
                lastWeek = moment(this.date).endOf('month').week();
            }
            let count = lastWeek - moment(this.date).startOf('month').week();
            
            return [...Array(count+1).keys()];
        },
        backMonthIsLessMinDate() {
            let nextDate = moment(this.date).subtract(1,'month').startOf('month');
            return this.isLessMinDate(nextDate, true);
        },
        nextMonthIsMoreMaxDate() {
            let nextDate = moment(this.date).add(1,'month').startOf('month');
            return this.isMoreMaxDate(nextDate, true);
        },
        momentMaxDate() {
            return this.maxDate ? moment(this.maxDate) : null;
        },
        momentMinDate() {
            return this.minDate ? moment(this.minDate) : null
        }
    },
    methods : {
        isLessMinDate (date,byMonth) {
            if(!this.minDate) return false;
            if(byMonth)
                return this.minDate && moment(this.minDate).startOf('month').startOf('day').format('X') > moment(date).format('X');
            else
                return this.minDate && moment(this.minDate).startOf('day').format('X') > moment(date).format('X');
        },
        isMoreMaxDate (date,byMonth) {
            if(!this.maxDate) return false;
            if(byMonth)
                return this.maxDate && moment(this.maxDate).endOf('month').endOf('day').format('X') < moment(date).format('X');
            else 
                return this.maxDate && moment(this.maxDate).endOf('day').format('X') < moment(date).format('X');
        },
        inRemoveDate(date) {
            if(this.disableDates == undefined) return false;
            return this.disableDates !== null && this.disableDates.indexOf(moment(date).format('YYYY-MM-DD')) >= 0;
        },
        nextMonth() {
            let nextDate = moment(this.date).add(1,'month').startOf('month');
            if(!this.nextMonthIsMoreMaxDate) {
                this.date = nextDate.format('YYYY-MM-DD');
                this.$emit('changeMonth',nextDate);
            }
        },
        backMonth () {
            let nextDate = moment(this.date).subtract(1,'month').startOf('month');
            if(!this.backMonthIsLessMinDate) {
                this.date = nextDate.format('YYYY-MM-DD');
                this.$emit('changeMonth',nextDate);
            }
        },

        selectedDay (date) {
            if(!this.isMoreMaxDate(date) && !this.isLessMinDate(date) && !this.inRemoveDate(date)) {
                let dateFormat = moment(date).format('YYYY-MM-DD');
                this.date = dateFormat;
                this.$emit('selected',this.date);
                if (this.multiple) {
                    let index = this.dateSelected.indexOf(dateFormat);
                    if ( index >= 0 ) this.dateSelected.splice(index, 1);
                    else this.dateSelected.push(dateFormat);
                    this.$emit('input',this.dateSelected);
                } else {
                    this.dateSelected = dateFormat;
                    this.$emit('input',this.date);
                }
            } 
        }
    },
    watch : {
        minDate(newValue,oldValue) { 
            // this.date = newValue;
        },
        maxDate(newValue,oldValue) { 
            // this.date = newValue;
        },
        value(newValue, oldValue){
            this.dateSelected = newValue
            
        }
    }

}
</script>
<style>
.calendar-back,.calendar-title,.calendar-next {
    display: inline-block;
    min-height: 32px;
    min-width: 32px;
    line-height: 32px;
}

.calendar-next, .calendar-back  {
    width: 32px;
    text-align: center;
}
.calendar-next:hover, .calendar-back:hover  {
    background: #EEE;
    cursor: pointer;
}
.calendar-next.disable, .calendar-back.disable  {
    opacity: 0;
}
.calendar-next.disable:hover, .calendar-back.disable:hover  {
    background: none !important;
    cursor: default;
}
.calendar-back {
    float: left;
}
.calendar-next {
    float: right;
}
.calendar-title {
    text-align: center;
    width: calc(100% - 64px);
    transition: all 0.5s;
}
.title-day-weeks td {
    text-align: center;
    min-height: 32px;
    min-width: 32px;
    line-height: 32px;
}

.calendar {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.55);
}
.calendar thead {
    background: #DDD;
}
.calendar thead .weekend {
    background: #CCC;
}
.calendar tbody {
    background: #EEE;
}
</style>
