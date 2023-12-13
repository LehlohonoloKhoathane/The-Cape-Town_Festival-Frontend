<template>
  <div class="card-container card-container-admin">
    <div class="form-container-admin">
      <LoadingModal v-if="loadingModal.show" :show="loadingModal.show"></LoadingModal>
      <form @submit.prevent="addCar">
        <h2 class="form-header">Add Event</h2>
        <div class="form-group">
          <label for="make">Make:</label>
          <input id="make" v-model="event.name" required type="text">
        </div>
        <div class="form-group">
          <label for="model">Model:</label>
          <input id="model" v-model="event.model" required type="text">
        </div>
        <div class="form-group">
          <label for="startTime">Year:</label>
          <input id="startTime" v-model="event.startTime" required type="number">
        </div>
        <div class="form-group">
          <label for="category">Category:</label>
          <input id="category" v-model="event.category" required type="text">
        </div>
        <div class="form-group">
          <label for="priceGroup">Price Group:</label>

          <select id="priceGroup" v-model="event.priceGroup" required>
            <option value="ECONOMY">Music</option>
            <option value="STANDARD">Art</option>
            <option value="LUXURY">Film </option>
            <option value="PREMIUM">Religious</option>
            <option value="EXOTIC">cultural</option>
            <option value="SPECIAL">Food & Drinks</option>
            <option value="OTHER">Other</option>
            <option value="NONE">None</option>
          </select>

        </div>
        <div class="form-group">
          <label for="endTime">License Plate:</label>
          <input id="endTime" v-model="event.endTime" required type="text">
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="button-container">
          <button class="confirm-button button" type="submit"><i class="fas fa-check"></i> Confirm</button>
        </div>
      </form>
    </div>
    <!-- Add the SuccessModal component -->
    <SuccessModal
        v-if="successModal.show"
        key="successModal"
        :message="successModal.message"
        :show="successModal.show"
        @cancel="closeModal"
        @close="closeModal"
        @confirm="closeModal"
        @ok="closeModal"
    ></SuccessModal>
    <!-- Add the FailureModal component -->
    <FailureModal
        v-if="failModal.show"
        key="failModal"
        :message="failModal.message"
        :show="failModal.show"
        @cancel="closeModal"
        @close="closeModal"
    ></FailureModal>
  </div>

</template>

<script>
import axios from "axios";
import {PriceGroup} from "@/enums/PriceGroup";
import SuccessModal from "@/components/Main/Modals/SuccessModal.vue";
import FailureModal from "@/components/Main/Modals/FailureModal.vue";
import LoadingModal from "@/components/Main/Modals/LoadingModal.vue";
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
  components: {LoadingModal, FailureModal, SuccessModal},
  data() {
    return {
      event: {
        make: 'Culture Celebration',
        details: 'Celebration,',
        startTime: '2023/12/02; 16:00',
        endTime: '2023/12/02; 16:00',
        type: 'Culture',
        priceGroup: PriceGroup.TieredPricing
      },
      errorMessage: '' ,// Added error message data property
      successModal: {
        show: false,
        message: ""
      },
      failModal: {
        show: false,
        message: ""
      },
      loadingModal: {
        show: false,
      },

    };
  },
  methods: {
    addCar() {
      this.loadingModal.show = true;

      this.errorMessage = ''; // Reset the error message
      const token = localStorage.getItem('token');

      axios.post('/api/admin/events/create', this.event
          , {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            // Handle success
            console.log('Event added successfully');
            console.log(response.data);
            console.log(response);
            this.loadingModal.show = false;
            this.successModal.message = 'Event added successfully';
            this.successModal.show = true;

          })
          .catch(error => {
            // Handle error
            console.log(error);
            if (error.response && error.response.status === 400) {
              // Display an error message to the user
              this.errorMessage = 'Invalid data. Please check the entered values.';
              console.log(error.response.data); // The response data contains details about the validation errors or data issues
              console.log(error.response.status);
              console.log(error.response);
              this.failModal.message = 'Invalid data. Please check the entered values.';
              this.failModal.show = true;
            } else {
              // Display a generic error message
              this.errorMessage = 'An error occurred while adding the event.';
              this.failModal.message = 'An error occurred while adding the event.';
              this.failModal.show = true;
            }
          });

      // You can access the event object using 'this.event' in this method
      console.log('Adding event:', this.event);

      // Reset the form after adding the event
      this.resetForm();
    },
    closeModal() {
      this.successModal.show = false;
      this.failModal.show = false;
      this.showConfirmationModal = false;
    },

    resetForm() {
      // Reset the form fields
      this.event = {
        id: '',
        make: '',
        model: '',
        startTime: 0,
        category: '',
        priceGroup: '',
        endTime: ''
      };
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 5px;
}
</style>
