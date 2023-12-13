import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from "@/components/Admin/AdminPage.vue";
import adminRoutes from './adminRoutes';
import adminEventRoutes from './adminEventRoutes';
import adminUserRoutes from './adminUserRoutes';
import navRoutes from './navRoutes';
import EventList from "@/components/Main/Event/EventList.vue";
import Home from "@/components/Main/General/Home.vue";
import eventRoutes from './eventRoutes';
import UserProfile from "@/components/Main/User/UserProfile.vue";
import adminRentalRoutes from "@/router/adminRentalRoutes";
import Rental from "@/components/Main/Rental/Rental.vue";
import ReturnRental from "@/components/Main/Rental/ReturnRental.vue";
import HelpCenter from "@/components/Main/Help/HelpCenter.vue";
import Faq from "@/components/Main/Help/Faq.vue";
import adminFaqRoutes from "@/router/adminFaqRoutes";
import adminHelpCenterRoutes from "@/router/adminHelpCenterRoutes";
import adminDriverRoutes from "@/router/adminDriverRoutes";
import Booking from "@/components/Main/Rental/Booking/Booking.vue";
import adminBookingRoutes from './adminBookingRoutes';
import AboutUs from "@/components/Main/About/AboutUs.vue";
import adminAboutUsRoutes from "@/router/adminAboutUsRoutes";
import ContactUs from "@/components/Main/About/ContactUs.vue";
import adminContactUsRoutes from "@/router/adminContactUsRoutes";
import adminDamageReportRoutes from "@/router/adminDamageReportRoutes";
import EditProfile from "@/components/Main/User/EditProfile.vue";


import Driver from "@/components/Main/Driver/DriverList.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...navRoutes,
    ...eventRoutes,
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/aboutUs/:id',
      name: 'AboutUs',
      component: AboutUs
    },
    {
      path: '/contactUs',
      name: 'ContactUs',
      component: ContactUs
    },
    {
      path: '/RSVP/:eventId',
      name: 'Rental',
      component: Rental,
    },
    {
      path: '/RSVP/return/:rentalId',
      name: 'ReturnRental',
      component: ReturnRental,
    },
    // You have a CreateRental route commented out, uncomment and add if needed
    /*{
      path: '/RSVP/create/',
      name: 'CreateRental',
      component: CreateRental,
    },*/


        {
            path: '/events/list/:category/:available',
            name: 'EventList',
            component: EventList,
        },
        {
            path: '/user/profile/:id',
            name: 'UserProfile',
            component: UserProfile,
        },
        {
            path: '/help-center',
            name: 'HelpCenter',
            component: HelpCenter,
        },
        {
            path: '/booking',
            name: 'Booking',
            component: Booking,
        },
        {
            path: '/driver',
            name: 'Driver',
            component: Driver,
        },


        {
            path: '/faq',
            name: 'Faq',
            component: Faq,
        },

        {
            path: '/admin',
            component: AdminPage,
            children: [
                ...adminRoutes,
                ...adminEventRoutes,
                ...adminUserRoutes,
                ...adminRentalRoutes,
                ...adminFaqRoutes,
                ...adminHelpCenterRoutes,
                ...adminDriverRoutes,
            ],
        },

    {
      path: '/events/list/:category/:available',
      name: 'EventList',
      component: EventList,
    },
    {
      path: '/user/profile/profile',
      name: 'UserProfile',
      component: UserProfile,
    },
    {
      path: '/edit-profile',
      name: 'EditProfile',
      component: EditProfile,
    },
    {
      path: '/help-center',
      name: 'HelpCenter',
      component: HelpCenter,
    },
    {
      path: '/booking',
      name: 'Booking',
      component: Booking,
    },
    {
      path: '/faq',
      name: 'Faq',
      component: Faq,
    },

    {
      path: '/admin',
      component: AdminPage,
      children: [
        ...adminRoutes,
        ...adminEventRoutes,
        ...adminUserRoutes,
        ...adminRentalRoutes,
        ...adminBookingRoutes,
        ...adminFaqRoutes,
        ...adminHelpCenterRoutes,
        ...adminAboutUsRoutes,
        ...adminContactUsRoutes,
        ...adminDamageReportRoutes,
          ...adminDriverRoutes
      ],
    },


    {
      path: '/error',
      component: () => import('@/components/Main/General/ErrorPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'ErrorPage',
      component: () => import('@/components/Main/General/ErrorPage.vue'),
    },
  ],
});
export default router;