import Home from "@/components/Main/General/Home.vue";
import EventList from "@/components/Main/Event/EventList.vue";
import Login from "@/components/Main/User/Login.vue";
import Signup from "@/components/Main/User/Signup.vue";

const eventRoutes = [

    {
        path: '/event/var',
        name: '',
        component: EventList,
    },

];

export default eventRoutes;
