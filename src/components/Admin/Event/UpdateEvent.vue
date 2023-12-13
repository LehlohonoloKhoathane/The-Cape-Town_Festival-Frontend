<template>
  <div class="content-container">
    <div class="card-container">
      <h1>Update  Events</h1>
      <h2>List of {{ category }} Events</h2>
      <table>
        <thead>
        <tr>
          <th @click="sortEvents('id')">ID</th>
          <th @click="sortEvents('make')">Name</th>
          <th @click="sortEvents('model')">Details</th>
          <th @click="sortEvents('startTime')">Start Time</th>
          <th @click="sortEvents('endTime')">End Time</th>
          <th @click="sortEvents('category')">Type</th>
          <th @click="sortEvents('priceGroup')">Price</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="event in sortedEvents" :key="event.id">
          <td>{{ event.id }}</td>
          <td>
            <input v-model="event.name" :disabled="!event.editMode" />
          </td>
          <td>
            <input v-model="event.model" :disabled="!event.editMode" />
          </td>
          <td>
            <input v-model="event.startTime" :disabled="!event.editMode" />
          </td>
          <td>
            <input v-model="event.category" :disabled="!event.editMode" />
          </td>
          <td>
            <select v-model="event.priceGroup" :disabled="!event.editMode" required>
              <option value="ECONOMY">General Admission</option>
              <option value="STANDARD">VIP</option>
              <option value="LUXURY">Early Bird Tickets</option>
              <option value="PREMIUM">Group or Family Packages</option>
              <option value="EXOTIC">Tiered Pricing:</option>
              <option value="SPECIAL">SPECIAL</option>
              <option value="OTHER">OTHER</option>
              <option value="NONE">NONE</option>
            </select>
          </td>

          <td>
            <input v-model="event.endTime" :disabled="!event.editMode" />
          </td>
          <td>
            <button @click="toggleEditMode(event)">
              {{ event.editMode ? 'Save' : 'Edit' }}
            </button>
          </td>
          <td>
            <button @click="deleteEvent(event.id)">Delete</button>
          </td>
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
  name: 'EditCar',
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
            this.events = response.data.map((event) => ({
              ...event,
              editMode: false,
            }));
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
          .delete(`/api/admin/events/delete/${eventId}`, {
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
    toggleEditMode(event) {
      if (event.editMode) {
        this.updateCar(event);
      }
      event.editMode = !event.editMode;
    },
    updateCar(event) {
      const token = localStorage.getItem('token');
      axios
          .put(`/api/admin/events/update/${event.id}`, event, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            console.log(response);
            console.log('Event updated');
          })
          .catch((error) => {
            console.log(error);
            console.log('Event not updated');
          });
    },
  },
  computed: {
    sortedEvents() {
      let sortedEvents = [...this.events];

      if (this.sortColumn) {
        sortedEvents.sort((a, b) => {
          let valueA = a[this.sortColumn];
          let valueB = b[this.sortColumn];

          if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
          }

          if (valueA < valueB) {
            return this.sortDirection === 'asc' ? -1 : 1;
          }
          if (valueA > valueB) {
            return this.sortDirection === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      return sortedEvents;
    },
  },
};
</script>

<style scoped>
/* Add custom styles for the component */
</style>
