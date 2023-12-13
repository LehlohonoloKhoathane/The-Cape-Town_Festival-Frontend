<template>
  <div class="card-container ">
    <div class="form-container">
    <div class="event-profile">
      <h1><i class="fas fa-event"></i> Event Profile: </h1>
      <div class="profile-details" v-if="event">
        <div>
          <p><label>Name:</label><span>{{ event.name }}</span></p>

          <p><label>Details:</label><span>{{ event.model }}</span></p>

          <p><label>Start Time:</label><span>{{ event.startTime }}</span></p>

          <p><label>End Time: </label>{{ event.endTime }}</p>

          <p><label>Category:</label><span>{{ event.category }}</span></p>

          <p><label>Price Group:</label><span>{{ event.priceGroup }}</span></p>

          
          <!-- <p> <label>Available: </label>{{ event.available }}</p>  -->
          </div>
      </div>
      <div v-else>
        <p>Loading event profile...</p>
      </div>
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
  name: 'ViewCar',
  data() {
    return {
      event: null,
    };
  },
  mounted() {
    this.fetcheventProfile();
  },
  methods: {
    fetcheventProfile() {
      // Assuming you have the event ID or any other identifier to fetch the event's profile
      const eventId = this.$route.params.id// Get the category from the route parameter
      const token = localStorage.getItem('token');
      axios
          .get(`/api/admin/events/read/${eventId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            this.event = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
    },
  },
};
</script>

<style scoped>
.card-container {

padding: 50px;
  justify-content: center;
}
.event-profile {
  margin-top: 20px;
}

.event-profile h1 {
  margin-bottom: 10px;
}

.profile-details div {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

span {
  margin-left: 10px;
}
</style>


