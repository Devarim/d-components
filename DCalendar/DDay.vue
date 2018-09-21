<template>
    <td class="day" :class="classDay" @click="onSelect">
        {{day}}
    </td>
</template>
<script>
import moment from 'moment';

export default {
    name: "DDay",
    props: [ 'position', 'date', 'maxDate', 'minDate', 'dateSelected', 'disableDates', "options" ],
    computed: {
        classDay () {
            return { 
                'no-day-month' : !this.theDayIsMonth, 
                'weekend': this.isWeekend, 
                'out-range' : !this.inRangeDate, 
                'selected': this.isDateSelected,
                'today' : this.isToday,
                'available' : this.inAvailableDate,
                'atention' : this.inAtentionDate,
                'busy' : this.inBusyDate,
            }
        },
        isToday() {
            return moment().startOf('day').format("X") == this.dateOfDay.format('X');
        },
        dateOfDay() {
            return moment(this.date).startOf('month').weekday(0).add(this.position - 1, 'd');
        },
        day() {
            return this.dateOfDay.format('DD');
        },
        theDayIsMonth() {
            return moment(this.date).format('MM') == this.dateOfDay.format('MM');
        },
        isWeekend() {
            return [0,6].indexOf(this.dateOfDay.weekday()) >= 0
        },
        isDateSelected() {
            if(Array.isArray(this.dateSelected)) return this.dateSelected.indexOf(this.dateOfDay.format('YYYY-MM-DD')) >= 0;
            else return this.dateSelected == this.dateOfDay.format('YYYY-MM-DD');
        },
        inDisableDates() {
            if(this.disableDates == undefined) return false;
            return this.disableDates !== null && this.disableDates.indexOf(moment(this.dateOfDay).format('YYYY-MM-DD')) >= 0;
        },
        inAvailableDate() {
            if(this.options == undefined || this.options.available == undefined) return false;
            return this.options.available !== null && this.options.available.indexOf(moment(this.dateOfDay).format('YYYY-MM-DD')) >= 0;
        },
        inBusyDate() {
            if(this.options == undefined || this.options.busy == undefined) return false;
            return this.options.busy !== null && this.options.busy.indexOf(moment(this.dateOfDay).format('YYYY-MM-DD')) >= 0;
        },
        inAtentionDate() {
            if(this.options == undefined || this.options.atention == undefined) return false;
            return this.options.atention !== null && this.options.atention.indexOf(moment(this.dateOfDay).format('YYYY-MM-DD')) >= 0;
        },
        inRangeDate() {
            let atendMaxDate = !this.maxDate || this.maxDate.endOf('day').format("X") >= this.dateOfDay.format("x");
            let atendMinDate = !this.minDate || this.minDate.startOf('day').format("X") <= this.dateOfDay.format("x");
            let notInDisableDates = !this.inDisableDates;
            return atendMaxDate && atendMinDate && notInDisableDates;
        }
    },
    methods : {
        onSelect () {
            this.$emit('selected',this.dateOfDay);
        }
    }
}
</script>
<style scoped>
.day {
    min-height: 32px;
    min-width: 32px;
    line-height: 32px;
    text-align: center;
    font-weight: 0;
    transition: all 0.2s;
    color: #666;
    border: 1px solid #DDD;
}
.day:hover:not(.out-range) {
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0px 0px 3px -1px #000;
    z-index: 9;
    position: relative;
}
.day.out-range:hover {
    font-weight: 0;
    cursor: default;
}

.no-day-month {
    color: #999;
}
.weekend {
    background-color: #E5E5E5;
}
.out-range {
    opacity: 0.3;
}
.selected {
    font-weight: 600;
    background: #C2E0C3 !important;
}
.selected, .available, .atention,.busy {
    color: #000;
    border-radius: 5px;
}
.selected.busy {
    background: #F59191;
}
.selected.atention {
    background: #fce053;
}
.available {
    background: #94E995;
}
.atention {
    background: #FBE98A;
}
.busy {
    background: #FFCACA;
}

.available.no-day-month, .atention.no-day-month, .busy.no-day-month {
    opacity: 0.3;
}
</style>

