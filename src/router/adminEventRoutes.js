import Events from "@/components/Admin/Event/EventManagment.vue";
import CreateEvent from "@/components/Admin/Event/CreateEvent.vue";
import DeleteEvent from "@/components/Admin/Event/DeleteEvent.vue";
import UpdateEvent from "@/components/Admin/Event/UpdateEvent.vue";
import ViewEvent from "@/components/Admin/Event/ViewEvent.vue";
import AdminDash from "@/components/Admin/AdminDash.vue";
import ErrorPage from "@/components/Main/General/ErrorPage.vue";
import users from "@/components/Admin/User/UserManagement.vue";
import events from "@/components/Admin/Event/EventManagment.vue";
import EventManagment from "@/components/Admin/Event/EventManagment.vue";

const adminEventRoutes = [
    {
        path: 'events',
        components: {
            adminContent: EventManagment,
        },
    },
    {
        path: 'events/create',
        components: {
            adminContent: CreateEvent,
        },
    },
    {
        path: 'events/update',
        components: {
            adminContent: UpdateEvent,
        },
    },
    {
        path: 'events/delete',
        components: {
            adminContent: DeleteEvent,
        },
    },
    {
        path: 'events/read/:id',
        name: 'ViewEvent',
        components: {
            adminContent: ViewEvent,
        },
    },
    {
        path: 'dashboard',
        name: 'Dashboard',
        components: { adminContent: AdminDash,
        },
    },
    {   path: '/admin/:pathMatch(.*)*',
        name: 'AdminErrorPage',
        components: { adminContent: ErrorPage }
    },


    ///////////////////////////////



];

export default adminEventRoutes;
