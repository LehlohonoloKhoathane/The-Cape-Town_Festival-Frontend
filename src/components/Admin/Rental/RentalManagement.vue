<template>
  <div class="content-container">
    <div class="content-header">
      <h1>
        <i class="fas fa-file-contract"></i> RSVP Management
      </h1>
      <div class="search-bar-container">
        <div class="search-bar">
          <div class="search-input">
            <input v-model="searchQuery" placeholder="Search..." type="text" />
            <button @click="resetSearch" class="read-button  button">
              <i class="fas fa-search"></i> Reset
            </button>
          </div>
          <router-link to="/admin/RSVPs/create" class="add-button button">
            <i class="fas fa-contact-book"></i> Add Rental
          </router-link>
        </div>
      </div>
    </div>
    <table>
      <thead>
      <tr>
        <th @click="sortRentals('id')">ID <i class="fas fa-sort"></i></th>
<!--        <th @click="sortRentals('user.userName')">User <i class="fas fa-sort"></i></th>-->
        <th @click="sortRentals('user.firstName')">First Name <i class="fas fa-sort"></i></th>
        <th @click="sortRentals('user.lastName')">Last Name <i class="fas fa-sort"></i></th>
        <th @click="sortRentals('event.name')">Event Name <i class="fas fa-sort"></i></th>
        <th @click="sortRentals('event.model')">Event Details <i class="fas fa-sort"></i></th>
        <th @click="sortRentals('issuer')">Issuer <i class="fas fa-sort"></i></th>
        <th @click="sortRentals('dateRented')">Date RSVP </th>
        <th @click="sortRentals('dateReturned')">Date Returned </th>
        <th @click="sortRentals('receiver')">Receiver </th>
        <th @click="sortRentals('finePaid')">Amount Paid </th>
        <th class="actions-column">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="RSVP in filteredRentals" :key="RSVP.rentalId">
        <td v-if="!RSVP.editing">{{ RSVP.rentalId  }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.rentalId " >
        </td>
<!--        <td v-if="!RSVP.editing">{{ RSVP.user.userName }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.user.userName">
        </td>-->
        <td v-if="!RSVP.editing">{{ RSVP.user.firstName }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.user.firstName">
        </td>
        <td v-if="!RSVP.editing">{{ RSVP.user.lastName }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.user.lastName">
        </td>
        <td v-if="!RSVP.editing">{{ RSVP.event.name }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.event.name">
        </td>
        <td v-if="!RSVP.editing">{{ RSVP.event.model }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.event.model">
        </td>
        <td v-if="!RSVP.editing">{{ typeof RSVP.issuer === 'string' ? RSVP.issuer.toLowerCase() : RSVP.issuer }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.issuer">
        </td>

        <td v-if="!RSVP.editing">{{ RSVP.issuedDate }}</td>
        <td v-else>
        <input type="text" v-model="RSVP.issuedDate">
      </td>
        <td v-if="!RSVP.editing">{{ RSVP.returnedDate }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.returnedDate">
        </td>
        <td v-if="!RSVP.editing">{{ RSVP.receiver }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.receiver">
        </td>
        <td v-if="!RSVP.editing">{{ RSVP.fine }}</td>
        <td v-else>
          <input type="text" v-model="RSVP.fine">
        </td>
        <td>
          <div v-if="!RSVP.editing">
            <button @click="editRental(RSVP)" class="update-button button">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button @click="deleteRental(RSVP.rentalId)" class="delete-button button">
              <i class="fas fa-trash-alt"></i> Delete
            </button>

            <button @click="openRentalView(RSVP.rentalId)" class="read-button button" ><i class="fas fa-eye"></i> Read</button>
          </div>
          <div v-else>
            <button @click="saveRental(RSVP)" class="accept-button button">
              <i class="fas fa-save"></i> Save
            </button>
            <button @click="cancelEdit(RSVP)" class="cancel-button button">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
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
          <p> {{ rentalToDelete }} <!--{{ rentalToDelete.user.lastName }}--></p>
<!--          <p>Event: {{ rentalToDelete.event.model }}</p>-->
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
import ConfirmationModal from "@/components/Main/Modals/ConfirmationModal.vue";
import LoadingModal from "@/components/Main/Modals/LoadingModal.vue";
import SuccessModal from "@/components/Main/Modals/SuccessModal.vue";
import FailureModal from "@/components/Main/Modals/FailureModal.vue";
import process from "process";
import baseURL from "@/api.js";
/*const backendUrl = process.env.VUE_APP_BACKEND_URL;*/
// Add this line to set a default base URL for your API
// axios.defaults.baseURL = 'http://localhost:8080';

// Add an interceptor for every request
// axios.interceptors.request.use(
//     config => {
//       const token = localStorage.getItem('token');

//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }

//       return config;
//     },
//     error => {
//       return Promise.reject(error);
//     }
// );


export default {
  name: "RentalManagement",
  components: {
    ConfirmationModal,
    LoadingModal,
    SuccessModal,
    FailureModal,
  },
  data() {
    return {
      RSVPs: [],
      sortedRentalsList: [],
      user: {
        id:"", // Get the ID from the route params
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roles: [{ roleName: "USER" }], // Updated to match the backend structure
      },



      sortBy: null, // Your sort option
      searchQuery: "",
      loading: false,
      showConfirmationModal: false,
      rentalToDelete: null,
      successModal: {
        show: false,
        message: "",
      },
      failModal: {
        show: false,
        message: "",
      },
     /* backendUrl: process.env.VUE_APP_BACKEND_URL,*/
    };
  },
  methods: {
    getRentals() {
      this.loading = true;
      const token = localStorage.getItem('token');

      // Assuming you have authenticated the user with Firebase and have access to Firestore
      // Fetch data from Firestore collection 'RSVPs'
      db.collection('RSVPs')
        .get()
        .then((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });

          this.RSVPs = data;
          this.sortedRentalsList = [...this.RSVPs]; // Assign to data property instead of computed property
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.showFailureModal('Failed to fetch RSVPs. Please try again.');
        });
    },

    sortRentals(sortKey) {
      if (this.sortedRentalsList.length === 0) {
        return;
      }

      const currentSortKey = this.sortedRentalsList[0]._sortKey;
      let sortOrder = 'asc';

      if (currentSortKey === sortKey && this.sortedRentalsList[0]._sortOrder === 'asc') {
        sortOrder = 'desc';
      }

      this.sortedRentalsList.sort((a, b) => {
        const valueA = this.getPropertyValue(a, sortKey);
        const valueB = this.getPropertyValue(b, sortKey);

        let comparison = 0;
        if (valueA > valueB) {
          comparison = 1;
        } else if (valueA < valueB) {
          comparison = -1;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });

      this.sortedRentalsList.forEach((RSVP) => {
        RSVP._sortKey = sortKey;
        RSVP._sortOrder = sortOrder;
      });
    },
    getPropertyValue(object, key) {
      const keys = key.split('.');
      let value = object;
      for (const k of keys) {
        value = value[k];
      }
      return value;
    },
    deleteRental(RSVP) {
      console.log("Deleting RSVP: ", RSVP);
      this.rentalToDelete = RSVP;
      this.showConfirmationModal = true;
    },
    confirmDeleteRental() {
      if (this.rentalToDelete) {
      //  const rentalId = this.rentalToDelete.rentalId;  //was this
        const rentalId = this.rentalToDelete;  //should be this LMAO
        console.log("Deleting RSVP with id: ", rentalId);
        this.loading = true;
        const token = localStorage.getItem('token');
        axios
            .delete(`/api/admin/RSVPs/delete/${rentalId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then(() => {
              this.showSuccessModal("Rental deleted successfully.");
              this.getRentals();
            })
            .catch((error) => {
              this.loading = false;
              this.showFailureModal("Failed to delete RSVP. Please try again.");
            });
      }
      this.showConfirmationModal = false;
    },
    cancelDeleteRental() {
      this.rentalToDelete = null;
      this.showConfirmationModal = false;
    },
    editRental(RSVP) {
      RSVP.editing = true;
      RSVP.id = RSVP.rentalId; // Add this line to set RSVP.id to RSVP.rentalId
      console.log("Editing RSVP button sent this id: ", RSVP.id );
    },
    
    saveRental(RSVP) {
      // Create a temporary RSVP object without authorities
      const tempRental = {
        rentalId: RSVP.id,
        userId: RSVP.user.id,
        eventId: RSVP.event.id,
        receiver: RSVP.receiver,
        issuer: RSVP.issuer,
        issuedDate: RSVP.issuedDate,
        returnedDate: RSVP.returnedDate,
        fine: Math.floor(RSVP.fine),
        // Add other properties as needed
      };

      // Remove editing flag before updating
      delete tempRental.editing;

      this.loading = true;

      // Update the document in Firestore
      db.collection('RSVPs')
        .doc(tempRental.rentalId)
        .set(tempRental) // Use set to completely overwrite the document
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
      const token = localStorage.getItem('token');
      this.$router.push(`/admin/RSVPs/read/${rentalId}`
          , {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    },
    resetSearch() {
      this.searchQuery = "";
      this.sortedRentalsList = this.RSVPs;
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
    searchNestedProperty(obj, query) {
      for (const key in obj) {
        if (
            typeof obj[key] === 'string' &&
            obj[key].toLowerCase().includes(query)
        ) {
          return true;
        }
      }
      return false;
    },
    updateSortOption(option) {
      this.sortBy = option;
    },
  },



  computed: {
    sortedRentalsList() {
      if (this.sortBy) {
        const sorted = [...this.RSVPs];
        sorted.sort((a, b) => (a[this.sortBy] > b[this.sortBy] ? 1 : -1));
        return sorted;
      }
      return this.RSVPs;
    },
    filteredRentals() {
      const query = this.searchQuery.toLowerCase();
      return this.sortedRentalsList.filter((RSVP) => {
        for (const key in RSVP) {
          if (
              typeof RSVP[key] === 'string' &&
              RSVP[key].toLowerCase().includes(query)
          ) {
            return true;
          }
          // Check nested properties
          if (
              typeof RSVP[key] === 'object' &&
              this.searchNestedProperty(RSVP[key], query)
          ) {
            return true;
          }
        }
        return false;
      });
    },



  },


  created() {
    this.getRentals();
  },

};
</script>

<style >

</style>