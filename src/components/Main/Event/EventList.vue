<template>
  <div class="content-container">
    <h1>List of {{ category }} Events</h1>
    <loading-modal v-if="loading" show />
    <table>
      <thead>
      <tr>
        <th @click="sortEvents('id')">ID</th>
        <th @click="sortEvents('make')">Event Name</th>
        <th @click="sortEvents('model')">Event Details</th>
        <th @click="sortEvents('startTime')">Start time</th>
        <th @click="sortEvents('category')">Category</th>
        <th @click="sortEvents('priceGroup')">Price </th>
        <th @click="sortEvents('endTime')">End Time</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event in sortedEvents" :key="event.id">
        <td>{{ event.id }}</td>
        <td>{{ event.name }}</td>
        <td>{{ event.model }}</td>
        <td>{{ event.startTime }}</td>
        <td>{{ event.category }}</td>
        <td>{{ event.priceGroup }}</td>
        <td>{{ event.endTime }}</td>
        <td>
          <button class="accept-button button" @click="rentCar(event)"><i class="fas fa-handshake"></i> Rent</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import LoadingModal from '@/components/Main/Modals/LoadingModal.vue';

export default {
  name: 'EventList',
  components: {
    LoadingModal,
  },
  data() {
    return {
      events: [],
      category: '',
      sortColumn: '',
      sortDirection: '',
      loading: false,
    };
  },
  mounted() {
    this.fetchEvent();
  },
  methods: {
    // fetchEvent() {
    //   this.loading = true;
    //   const category = this.$route.params.category;
    //   const available = this.$route.params.available === 'true'; // Convert the string to boolean

    //   let endpoint = `http://localhost:8080/api/events/list/${category}`;

    //   if (available) {
    //     endpoint = `http://localhost:8080/api/events/list/available/${category}`;
    //   }

    //   axios
    //       .get(endpoint)
    //       .then((response) => {
    //         this.events = response.data;
    //         this.category = category;
    //         this.loading = false;
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //         this.loading = false;
    //       });

    // },

    fetchEvent() {
      this.loading = true;
      const category = this.$route.params.category;
      const available = this.$route.params.available === 'true'; // Convert the string to boolean

      let dbRef = firebase.database().ref('events'); // Reference to your 'events' node in Firebase

      if (available) {
        dbRef = dbRef.orderByChild('availability').equalTo(true).equalTo(category); // Assuming 'availability' is a field in your events with a boolean value
      } else {
        dbRef = dbRef.orderByChild('category').equalTo(category); // Replace 'category' with the actual field in your events node
      }

      dbRef.once('value')
        .then((snapshot) => {
          const events = [];
          snapshot.forEach((childSnapshot) => {
            events.push(childSnapshot.val());
          });
          this.events = events;
          this.category = category;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },



    sortEvents(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    },
    rentCar(event) {
      // Perform the RSVP process here
      console.log('Renting event:', event);
      this.$router.push(`/RSVP/${event.id}`);


    },
  },
  computed: {
    sortedEvents() {
      if (this.sortColumn && this.sortDirection) {
        return this.events.sort((a, b) => {
          const aValue = a[this.sortColumn];
          const bValue = b[this.sortColumn];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return this.sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
          } else {
            return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          }
        });
      }
      return this.events;
    },
  },
};
</script>

