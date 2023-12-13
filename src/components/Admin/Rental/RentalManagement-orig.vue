
<template>
  <div class="content-container">
    <div class="content-header">
      <h1><i class="fas fa-file-contract" ></i>
        Rental Management
      </h1>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Search..." type="text">
        <button @click="resetSearch">
          <i class="fas fa-search"> </i> Reset
        </button>
      </div>
      <div>
        <router-link class="add-button RSVP-button" to="/admin/RSVPs/create">
          <i class="fas fa-file-contract"></i> Add New Rental
        </router-link>
      </div>
    </div>
    <table>
      <thead>
      <tr>
        <th @click="sortRentals('id')">ID</th>
        <th @click="sortRentals('user.userName')">User</th>
        <th @click="sortRentals('user.firstName')">First Name</th>
        <th @click="sortRentals('user.lastName')">Last Name</th>
        <th @click="sortRentals('event.name')">Event Name</th>
        <th @click="sortRentals('event.model')">Event Details</th>

        <th @click="sortRentals('issuer')">Issuer</th>
        <th @click="sortRentals('dateRented')">Date Rented</th>
        <th @click="sortRentals('dateReturned')">Date Returned</th>
        <th @click="sortRentals('receiver')">Receiver</th>
        <th @click="sortRentals('finePaid')">Amount Paid</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody v-if="!loading">
      <tr v-for="RSVP in filteredRentals" :key="RSVP.id">
        <td>{{ RSVP.rentalId }}</td>
        <td>{{ RSVP.user ? RSVP.user.userName : '' }}</td>
        <td>{{ RSVP.user ? RSVP.user.firstName : '' }}</td>
        <td>{{ RSVP.user ? RSVP.user.lastName : '' }}</td>
        <td>{{ RSVP.event ? RSVP.event.name : '' }}</td>
        <td>{{ RSVP.event ? RSVP.event.model : '' }}</td>
        <td>{{ RSVP.issuer }}</td>
        <td>{{ RSVP.issuedDate }}</td>

        <td>{{ RSVP.returnedDate }}</td>
        <td>{{ RSVP.receiver }}</td>
        <td>{{ RSVP.finePayed }}</td>

          <!-- other table cells -->
          <td>
            <button class="delete-button" @click="deleteRental(RSVP)">
              <i class="fas fa-trash"></i> Delete
            </button>
            <template v-if="!RSVP.editing">
              <button class="update-button" @click="editRental(RSVP)">
                <i class="fas fa-edit"></i> Edit
              </button>
            </template>
            <template v-else>
              <button class="update-button" @click="saveRental(RSVP)">
                <i class="fas fa-save"></i> Save
              </button>
              <button class="delete-button" @click="cancelEdit(RSVP)">
                <i class="fas fa-times"></i> Cancel
              </button>
            </template>
            <button class="read-button" @click="openRentalView(RSVP)">
              <i class="fas fa-eye"></i> Read
            </button>
          </td>


      </tr>
      </tbody>
    </table>
    <div v-if="loading" class="loading">Loading...</div>
    <loading-modal v-if="loading" show></loading-modal>
    <confirmation-modal
        :show="showConfirmationModal"
        @confirm="confirmDeleteRental"
        @cancel="cancelDeleteRental"
    >
      <template v-if="rentalToDelete">
        <div>
          <p>Are you sure you want to delete this RSVP?</p>
          <hr>
          <h3>Rental Details:</h3>
          <p>User: {{ rentalToDelete.user.userName }}</p>
          <p>Event: {{ rentalToDelete.event.model }}</p>
          <hr>
          <p><b>Warning!!!</b> This action cannot be undone.</p>
        </div>
      </template>
    </confirmation-modal>
    <SuccessModal v-if="successModal.show" @close="closeModal" @cancel="closeModal" :show="successModal.show" :message="successModal.message"></SuccessModal>
    <FailureModal v-if="failModal.show" @close="closeModal" @cancel="closeModal" :show="failModal.show" :message="failModal.message"></FailureModal>
  </div>
</template>

<script>
import axios from "axios";
import ConfirmationModal from "@/components/Main/Modals/ConfirmationModal.vue";
import LoadingModal from "@/components/Main/Modals/LoadingModal.vue";
import SuccessModal from "@/components/Main/Modals/SuccessModal.vue";
import FailureModal from "@/components/Main/Modals/FailureModal.vue";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default {
  data() {
    return {
      loading: false,
      RSVPs: [],
      sortedRentals: [],
      showConfirmationModal: false,
      rentalToDelete: null,
      successModal: {
        show: false,
        message: '',
      },
      failModal: {
        show: false,
        message: '',
      },
      searchQuery: '',
    };
  },
  
  methods: {
    async getRentals() {
      this.loading = true;
      try {
        const response = await db.collection('RSVPs').get();
        this.RSVPs = response.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        this.sortedRentals = [...this.RSVPs];
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.showFailureModal('Failed to fetch RSVPs. Please try again.');
      }
    },


    sortRentals(sortKey) {
      this.sortedRentals = this.sortedRentals.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return -1;
        if (a[sortKey] > b[sortKey]) return 1;
        return 0;
      });
    },
    deleteRental(RSVP) {
      this.rentalToDelete = RSVP;
      this.showConfirmationModal = true;
    },
    confirmDeleteRental() {
      if (this.rentalToDelete) {
        const rentalId = this.rentalToDelete.id;
        this.loading = true;
        db.collection('RSVPs')
          .doc(rentalId)
          .delete()
          .then(() => {
            this.showSuccessModal('Rental deleted successfully.');
            this.getRentals();
          })
          .catch((error) => {
            this.loading = false;
            this.showFailureModal('Failed to delete RSVP. Please try again.');
          });
      }
      this.rentalToDelete = null;
      this.showConfirmationModal = false;
    },
    cancelDeleteRental() {
      this.rentalToDelete = null;
      this.showConfirmationModal = false;
    },
    editRental(RSVP) {
      RSVP.editing = true;
    },


    saveRental(RSVP) {
      const rentalId = RSVP.id; // Assuming the ID is stored in the RSVP object

      // Remove editing flag before updating
      delete RSVP.editing;

      this.loading = true;
      db.collection('RSVPs')
        .doc(rentalId)
        .set(RSVP) // Use set to completely overwrite the document
        .then(() => {
          this.showSuccessModal('Rental updated successfully.');
          this.getRentals();
        })
        .catch((error) => {
          this.loading = false;
          this.showFailureModal('Failed to update RSVP. Please try again.');
        });
    },


    cancelEdit(RSVP) {
      RSVP.editing = false;
    },
    openRentalView(rentalId) {
      this.$router.push(`/admin/RSVPs/read/${rentalId}`);
    },
    resetSearch() {
      this.searchQuery = "";
      this.sortedRentals = this.RSVPs;
    },
    showSuccessModal(message) {
      this.successModal = {
        show: true,
        message: message,
      };
    },
    showFailureModal(message) {
      this.failModal = {
        show: true,
        message: message,
      };
    },
    closeModal() {
      this.successModal.show = false;
      this.failModal.show = false;
    },
  },
  computed: {
    filteredRentals() {
      if (!this.searchQuery) {
        return this.sortedRentals;
      }
      return this.sortedRentals.filter((RSVP) => {
        return (
            RSVP.rentalId.toString().includes(this.searchQuery.toLowerCase()) ||
            RSVP.user.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            RSVP.event.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            RSVP.event.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            RSVP.issuer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            RSVP.issuedDate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            RSVP.dateReturned.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            RSVP.receiver.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
  },
  created() {
    this.getRentals();
  },
};
</script>