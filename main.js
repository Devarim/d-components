import DLoading from './DLoading/main';
import DModal from './DModal/main';
import DCalendar from './DCalendar/main';
import DPagination from './DPagination/main';

export default {
    install(Vue) {
        Vue.use(DLoading);
        Vue.use(DModal);
        Vue.use(DCalendar);
        Vue.use(Notifications);
        Vue.use(DPagination);
    }
}