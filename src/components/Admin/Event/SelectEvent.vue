<template>
  <div class="event-selection-container">
    <div class="card event-list-card">
      <h2>Event List</h2>
      <input type="text" v-model="searchQuery" placeholder="Search Event" />
      <ul>
        <li v-for="event in filteredEvents" :key="event.id" @click="selectCar(event.id)" :class="{ active: selectedCarId === event.id }">
          {{ event.name }} {{ event.model }} ({{ event.startTime }})
        </li>
      </ul>
    </div>

    <div class="card event-details-card">
      <h2>Event Details</h2>
      <div v-if="selectedEvent">
        <div>
          <label>Make:</label>
          <span>{{ selectedEvent.name }}</span>
        </div>
        <div>
          <label>Model:</label>
          <span>{{ selectedEvent.model }}</span>
        </div>
        <div>
          <label>Year:</label>
          <span>{{ selectedEvent.startTime }}</span>
        </div>
        <div>
          <label>Category:</label>
          <span>{{ selectedEvent.category }}</span>
        </div>
        <div>
          <label>Price Group:</label>
          <span>{{ selectedEvent.priceGroup }}</span>
        </div>
        <div>
          <label>License Plate:</label>
          <span>{{ selectedEvent.endTime }}</span>
        </div>
      </div>
      <div v-else>
        <p>No event selected.</p>
      </div>
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
  name: 'EventSelection',
  data() {
    return {
      events: [],
      selectedCarId: '',
      selectedEvent: null,
      searchQuery: '',
    };
  },
  mounted() {
    this.fetchEvent();
  },
  methods: {
    fetchEvent() {
      const token = localStorage.getItem('token');
      axios
          .get('/api/admin/events/all'
              , {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
          .then((response) => {
            this.events = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    selectCar(eventId) {
      this.selectedCarId = eventId;
      this.selectedEvent = this.events.find((event) => event.id === this.selectedCarId);
    },
  },
  computed: {
    filteredEvents() {
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return this.events.filter((event) => {
          const makeModel = `${event.name} ${event.model}`.toLowerCase();
          return makeModel.includes(query);
        });
      }
      return this.events;
    },
  },
};
</script>

<style scoped>
.event-selection-container {
  display: flex;
  justify-content: space-between;
}

.card {
  padding: 20px;
  border-radius: 2px;
  background-color: #6610f2;
  width: 45%;
  box-shadow: black 0px 0px 5px 0px;
}

.event-list-card {
  margin: 20px;
}

.event-list-card h2 {
  margin-bottom: 10px;
}

.event-list-card input[type="text"] {
  margin-bottom: 10px;
}

.event-list-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-list-card li {
  cursor: pointer;
  padding: 5px;
  margin-bottom: 5px;
}

.event-list-card li:hover,
.event-list-card li.active {
  background-color: #6610f2;
}

.event-details-card {
  margin: 20px;
  background-color: #6610f2;
}

.event-details-card h2 {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

span {
  margin-left: 10px;
}
</style>
