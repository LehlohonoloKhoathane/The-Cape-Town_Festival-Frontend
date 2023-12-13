<template>
  <div class="content-container">
    <div class="card-container">
      <h1>List of {{ category }} Events</h1>
      <table>
        <thead>
        <tr>
          <th @click="sortEvents('id')">ID</th>
          <th @click="sortEvents('make')">Make</th>
          <th @click="sortEvents('model')">Model</th>
          <th @click="sortEvents('startTime')">Year</th>
          <th @click="sortEvents('category')">Category</th>
          <th @click="sortEvents('priceGroup')">Price Group</th>
          <th @click="sortEvents('endTime')">License Plate</th>
          <th>Delete</th>
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
          <td><button @click="deleteEvent(event.id)">Delete</button></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// Add this line to set a default base URL for your API
axios.defaults.baseURL = 'http://localhost:8080';

// Add an interceptor for every request
axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    }
);
export default {
  name: 'DeleteEvent',
  data() {
    return {
      events: [],
      category: '',
      sortColumn: '', // Current column to sort by
      sortDirection: '', // Current sort direction
    };
  },
  mounted() {
    this.fetchEvent();
  },
  methods: {
    fetchEvent() {
      const category = 'all';
      const token = localStorage.getItem('token');
      axios
          .get(`/api/events/${category}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            this.events = response.data;
            this.category = category;
          })
          .catch((error) => {
            console.log(error);
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
    deleteEvent(eventId) {
      const token = localStorage.getItem('token');
      axios
          .delete(`api/admin/events/delete/${eventId}`
              , {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
          .then((response) => {
            this.fetchEvent();
            console.log(response);
            console.log('Event deleted');
          })
          .catch((error) => {
            console.log(error);
            console.log('Event not deleted');
          });
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

<style scoped>
/* Add custom styles for the component */
</style>
