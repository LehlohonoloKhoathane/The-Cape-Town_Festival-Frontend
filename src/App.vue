<template>
  <div class="app">
    <navbar></navbar>
    <div class="app-container">
      <div class="app-content">
        <!-- Your content -->
        <router-view :currencyData="currencyData"></router-view>
      </div>

    </div>
  </div>
</template>

<script>
import Navbar from './components/Main/Navigation/Navbar.vue';
import Footer from "@/components/Main/General/Footer.vue";
/*import { currencySymbol, setCurrencySymbol } from './store/currencyStore';*/
import axios from "axios";
import {currencySymbol} from "@/store/store";
import { app, database } from '@/firebaseConfig';
import { ref, get } from 'firebase/database'; // Import Firebase database functions


export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      currencyData: currencySymbol,
    };
  },



  async created() {
    // Reference to Firebase database
    const db = ref(database); 

    try {
      // Fetch data from the Firebase database
      const snapshot = await get(db);
      if (snapshot.exists()) {
        this.currencyData = snapshot.val();
        console.log(this.currencyData);
      } else {
        console.log('No data available in Firebase');
      }
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  },



  // async created() {
  //   const response = await axios.get('http://localhost:8080/api/settings/read');
  //   console.log(response.data);
  //   this.currencyData = response.data;
  // },
};
</script>



<style>

</style>
