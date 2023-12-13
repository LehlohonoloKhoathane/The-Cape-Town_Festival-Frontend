<template>
  <div class="content-container">

    <div class="content-header">
      <h1><i class="fas fa-event"> </i>
        Event Management
      </h1>
      <div class="search-bar-container">
        <div class="search-bar">
            <div class="search-input">
              <input v-model="searchQuery" placeholder="Search..." type="text" />
              <button @click="resetSearch" class="read-button button">
                <i class="fas fa-search"> </i> Reset
              </button>
            </div>
            <router-link to="/admin/events/create" class="add-button button">
              <i class="fas fa-event"> </i> Add Event
            </router-link>
        </div>
      </div>

    </div>
    <table>
      <thead>
      <tr>
        <th @click="sortEvents('id')">ID  <i class="fas fa-sort"></i></th>
        <th @click="sortEvents('make')">NAme  <i class="fas fa-sort"></i></th>
        <th @click="sortEvents('model')">Details  <i class="fas fa-sort"></i></th>
        <th @click="sortEvents('startTime')">Start Time  <i class="fas fa-sort"></i></th>
        <th @click="sortEvents('category')">Type  <i class="fas fa-sort"></i></th>
        <th @click="sortEvents('priceGroup')">Price Group  <i class="fas fa-sort"></i></th>
        <th @click="sortEvents('available')">Available  <i class="fas fa-sort"></i></th>
        <th class="actions-column">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event in filteredEvents" :key="event.id">
        <td v-if="!event.editing">{{ event.id }}</td>
        <td v-else>
          <input type="text" v-model="event.id" disabled>
        </td>
        <td v-if="!event.editing">{{ event.name }}</td>
        <td v-else>
          <input type="text" v-model="event.name">
        </td>
        <td v-if="!event.editing">{{ event.model }}</td>
        <td v-else>
          <input type="text" v-model="event.model">
        </td>
        <td v-if="!event.editing">{{ event.startTime }}</td>
        <td v-else>
          <input type="text" v-model="event.startTime">
        </td>
        <td v-if="!event.editing">{{ event.category }}</td>
        <td v-else>
          <input type="text" v-model="event.category">
        </td>
        <td v-if="!event.editing">{{ event.priceGroup }}</td>
        <td v-else>
          <input type="text" v-model="event.priceGroup">
        </td>
        <td v-if="!event.editing">
          <input type="checkbox" v-model="event.available" :disabled="event.editing">
        </td>
        <td v-else>
          <input type="checkbox" v-model="event.available">
        </td>
        <td>
          <template v-if="!event.editing">
            <button @click="deleteEvent(event.id)" class="delete-button button">
              <i class="fas fa-trash"></i> Delete
              </button>
            <button @click="editEvent(event)" class="update-button button"><i class="fas fa-edit"></i> Edit</button>
            <button @click="openEventView(event.id)" class="read-button button"><i class="fas fa-eye"></i> Read</button>
          </template>
          <template v-else>
            <button @click="saveCar(event)" class="update-button button">Save</button>
            <button @click="cancelEdit(event)" class="delete-button button">Cancel</button>
          </template>
        </td>
      </tr>
      </tbody>
    </table>
    <loading-modal v-if="loading" show/>

    <confirmation-modal
        :show="showConfirmationModal"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    >
      <template v-if="eventToDelete">
        <div>
          <p>Are you sure you want to delete this Event?</p>
          <hr>
          <p>ID: {{ eventToDelete.id }}</p>
          <p>Event Name: {{ eventToDelete.name }}</p>
          <p>Details: {{ eventToDelete.model }}</p>
          <p>Start Time: {{ eventToDelete.startTime }}</p>
          <p>End Time: {{ eventToDelete.endTime }}</p>
          <p>Category: {{ eventToDelete.category }}</p>
          <p>Price Group: {{ eventToDelete.priceGroup }}</p>
          <p>Available: {{ eventToDelete.available }}</p>
          <hr>
          <p><b>Warning!!!</b> This action cannot be undone.</p>
        </div>
      </template>
    </confirmation-modal>
    <SuccessModal v-if="successModal.show" @close="closeModal" @cancel="closeModal" :show="successModal.show" :message="successModal.message"></SuccessModal>
    <FailureModal v-if="failModal.show"    @close="closeModal" @cancel="closeModal" :show="failModal.show"    :message="failModal.message">   </FailureModal>


  </div>
</template>


<script>
import axios from "axios";
import LoadingModal from "../../Main/Modals/LoadingModal.vue";
import SuccessModal from "@/components/Main/Modals/SuccessModal.vue";
import ConfirmationModal from "@/components/Main/Modals/confirmationmodal.vue";
import FailureModal from "@/components/Main/Modals/FailureModal.vue";
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
  data() {
    return {
      events: [], // Placeholder for the list of events
      loading: false,
      sortBy: "",
      searchQuery: "",
      showConfirmationModal: false, // Flag to show/hide the confirmation modal
      eventToDelete: null, // Placeholder for the event ID that is being deleted
      successModal: {
        show: false,
        message: ""
      }, // Placeholder for the success modal
      failModal: {
        show: false,
        message: ""
      }, // Placeholder for the failure modal
    };
  },
  components: {
    ConfirmationModal,
    LoadingModal,
    SuccessModal,
    FailureModal,
  },
  computed: {
    sortedEvents() {
      if (this.sortBy) {
        const sorted = [...this.events];
        sorted.sort((a, b) => (a[this.sortBy] > b[this.sortBy] ? 1 : -1));
        return sorted;
      }
      return this.events;
    },
    filteredEvents() {
      const query = this.searchQuery.toLowerCase();
      return this.sortedEvents.filter((event) => {
        for (const key in event) {
          if (
              typeof event[key] === "string" &&
              event[key].toLowerCase().includes(query)
          ) {
            return true;
          }
        }
        return false;
      });
    },
  },
  methods: {
    fetchEvent() {
      this.loading = true;
      const token = localStorage.getItem("token");
      axios
          .get("/api/admin/events/all", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            this.events = response.data;
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.failModal.message = "Failed to fetch events. Please try again.";
            this.failModal.show = true;
          })
          .finally(() => {
            this.loading = false;
          });
    },
    closeModal() {
      this.successModal.show = false;
      this.failModal.show = false;
      this.showConfirmationModal = false;
    },
    deleteEvent(eventId) {
      this.showConfirmationModal = true;
      this.eventToDelete = this.events.find((event) => event.id === eventId);
    },
    cancelDelete() {
      this.showConfirmationModal = false;
      this.eventToDelete = null;
    },
    confirmDelete() {
      if (this.eventToDelete) {
        this.loading = true;
        const token = localStorage.getItem("token");
        axios
            .delete(`/api/admin/events/delete/${this.eventToDelete.id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then((response) => {
              this.fetchEvent();
              console.log(response);
              console.log("Event deleted");
              this.successModal.show = true; // Show success modal
              this.successModal.message = "Event ID: "+this.eventToDelete.id+ "was deleted successfully! Please refresh the page to see the changes."
            })
            .catch((error) => {
              console.log(error);
              console.log("Event not deleted");
              this.failModal.show = true; // Show failure modal
              this.failModal.message = error.response.data.message;
            })
            .finally(() => {
              this.loading = false;
              this.showConfirmationModal = false;
              this.eventToDelete = null;

            });
      }
    },
    openEventView(eventId) {
      const token = localStorage.getItem("token");
      this.$router.push(`/admin/events/read/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    sortEvents(sortBy) {
      this.sortBy = sortBy;
    },
    resetSearch() {
      this.searchQuery = "";
    },
    editEvent(event) {
      event.editing = true;
    },
    saveCar(event) {
      this.pushUpdatedCar(event);
      event.editing = false;
      this.loading = true;
    },
    pushUpdatedCar(event) {
      const token = localStorage.getItem("token");
      axios
          .put(`/api/admin/events/update/${event.id}`, event, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            console.log(response);
            console.log("Event updated");
            this.loading = false;
            this.successModal.show = true; // Show success modal
            this.successModal.message = "Event ID: " + event.id + " was updated successfully"; // Show success modal


          })
          .catch((error) => {
            console.log(error);
            console.log("Event not updated");
            this.loading = false;
            this.failModal.show = true; // Show fail modal
            this.failModal.message = "Event ID: " + event.id + "was not updated successfully"; // Show success modal

          })
          .finally(() => {
            this.loading = false;


          });
    },
    cancelEdit(event) {
      event.editing = false;
    },
    closeSuccessFailModal() {

      this.successModal.show = false;
      this.failModal.show = false;
    },
  },
  created() {
    this.fetchEvent();
  },

};
</script>


<style>
.content-header {
  text-align: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search-input {
  display: flex;
  align-items: center;
}

.search-input input {
  margin-right: 10px;
}

.checkbox-container input[type="checkbox"] {
  margin-right: 10px;
}

</style>