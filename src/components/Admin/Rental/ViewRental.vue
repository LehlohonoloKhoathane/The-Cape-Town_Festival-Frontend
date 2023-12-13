<template>
  <div class="card-container">
    <div class="form-container">
        <div class="RSVP-profile">
          <h1>RSVP Profile</h1>
          <hr>
          <div class="profile-details" v-if="RSVP && user && event">
            <div class="section">
              <h3>Rental Details:</h3>
              <hr>
              <div class="detail-row">
                <div>
                  <label>RSVP ID:</label>
                  <span>{{ RSVP.rentalId }}</span>
                </div>
                <div>
                  <label>RSVP Date:</label>
                  <span>{{ RSVP.issuedDate }}</span>
                </div>
                <div>
                  <label>Return Date:</label>
                  <span>{{ RSVP.returnedDate }}</span>
                </div>
                <div>
                  <label>Fine:</label>
                  <span>{{ RSVP.fine }}</span>
                </div>
              </div>
            </div>
            <div class="section">
              <h3>Customer Details:</h3>
              <hr>
              <div class="detail-row">
                <div>
                  <label>Customer Name:</label>
                  <span>{{ user.userName }}</span>
                </div>
                <div>
                  <label>Customer First Name:</label>
                  <span>{{ user.firstName }}</span>
                </div>
                <div>
                  <label>Customer Last Name:</label>
                  <span>{{ user.lastName }}</span>
                </div>
                <div>
                  <label>Customer Email:</label>
                  <span>{{ user.email }}</span>
                </div>
                <div>
                  <label>Customer Phone Number:</label>
                  <span>{{ user.phoneNumber }}</span>
                </div>
              </div>
            </div>
            <div class="section">
              <h3>Event Details:</h3>
              <hr>
              <div class="detail-row">
                <div>
                  <label>Event Make:</label>
                  <span>{{ event.name }}</span>
                </div>
                <div>
                  <label>Event Model:</label>
                  <span>{{ event.model }}</span>
                </div>
                <div>
                  <label>Event Year:</label>
                  <span>{{ event.startTime }}</span>
                </div>
                <div>
                  <label>Price Group:</label>
                  <span>{{ event.priceGroup }}</span>
                </div>
                <div>
                  <label>License Plate:</label>
                  <span>{{ event.endTime }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>Loading RSVP profile...</p>
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
  name: 'ViewRental',
  data() {
    return {
      RSVP: null,
      user: null,
      event: null,
    };
  },
  mounted() {
    this.fetchRentalProfile();
    
  },
  methods: {
    fetchRentalProfile() {
      const rentalId = this.$route.params.id;
      const token = localStorage.getItem('token');
      axios
          .get(`/api/admin/RSVPs/read/${rentalId}`
              , {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
          .then((response) => {
            this.RSVP = response.data;
            this.fetchUserProfile();
            this.fetcheventProfile();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    fetchUserProfile() {
      const userId = this.RSVP.user.id;
      const token = localStorage.getItem('token');
      axios
          .get(`/api/admin/users/read/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            this.user = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    fetcheventProfile() {
      const eventId = this.RSVP.event.id;
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
  display: flex;
  padding: 50px;
  justify-content: center;

}
.RSVP-profile {
  margin-top: 20px;
}

.RSVP-profile h1 {
  margin-bottom: 10px;
}

.profile-details {
  display: flex;
  flex-wrap: wrap;
}

.section {
  flex: 1 1 50%;
  margin-right: 20px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
}

.detail-row > div {
  flex: 1 1 50%;
  display: flex;
  align-items: center;
}

label {
  font-weight: bold;
  margin-right: 10px;
}

span {
  margin-right: 10px;
}

/* Media query for narrow screens */
@media (max-width: 500px) {
  .profile-details {
    flex-direction: column; /* Stack sections vertically */
  }

  .section {
    margin-right: 0;
  }
}
</style>
