<template>
    <div class="card-container card-container-admin">
    <div class="form-container-admin">
        <LoadingModal v-if="loadingModal.show" :show="loadingModal.show"></LoadingModal>

        <form ref="reportForm" @submit.prevent="createReport">
            <div class="form-header">
                <h2>Create Damage Report</h2>
            </div>
            <div class="form-group">
                <label for="RSVP">Rentals:</label>
                <select v-model="selectedRental" id="RSVP" name="RSVP">
                    <option v-for="RSVP in RSVPs" :key="RSVP.id" :value="RSVP.id">
                        Rental ID: {{ RSVP.id }} User Name: {{ RSVP.user }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="dateAndTime">Date and Time:</label>
                <input id="dateAndTime" v-model="selectedDateAndTime" name="dataAndTime" type="datetime-local"  />
            </div>

            <div class="form-group">
                <label for="location">Location:</label>
                <input id="location" v-model="location" name="location" type="text"  />
            </div>

            <div class="form-group">
                <label for="description">Description:</label>
                <input id="description" v-model="description"  name="description" type="text"  />
            </div>

            <div class="form-group">
                <label for="repairCost">Repair Cost:</label>
                <input id="repairCost" v-model="repairCost" name="repairCost" type="number" />
            </div>

            <!--<button @click="goBack" class="back-button">
                <i class="fas fa-arrow-left"></i> Back
            </button>-->
            <!--<div class="form-group">
                <div class="button-container">
                    <button class="confirm-button button" type="submit"><i class="fas fa-check"></i> Confirm</button>
                </div>
            </div>-->

            <div class="form-group">
                <div class="button-container">
                    <button class="confirm-button button" type="submit"><i class="fas fa-check"></i> Save</button>
                </div>
            </div>
        </form>
    </div>
    </div>

    <div class="modal-body">

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

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

<!--<script>
import axios from "axios";
import ConfirmationModal from "@/components/Main/Modals/ConfirmationModal.vue";
import LoadingModal from "@/components/Main/Modals/LoadingModal.vue";
import SuccessModal from "@/components/Main/Modals/SuccessModal.vue";
import FailureModal from "@/components/Main/Modals/FailureModal.vue";

export default {
    components: {FailureModal, SuccessModal, LoadingModal, ConfirmationModal},
    data() {
        return {
            RSVPs: [],
                selectedRental: '', // Initialize as an empty string for single selection
                description: '',
            selectedDateAndTime: '',
                location: '',
                repairCost: 0, // Initialize with a default value
            loadingModal: {
                show: false,
            },
            errorMessage: '',
            successModal: {
                show: false,
                message: ""
            },
            failModal: {
                show: false,
                message: ""
            }
        };
    },

    mounted() {
// Fetch RSVP options from the backend and populate rentalOptions
        this.fetchRentalOptions();
    },
    methods:{
        async fetchRentalOptions(){
            this.loadingModal.show = true;
            axios
                .get('http://localhost:8080/api/admin/RSVPs/list/all')
                .then(response => {
                    this.RSVP = response.data;
                    this.loadingModal.show = false;
                })
                .catch(error => {
                    console.log(error);
                    this.failModal.message = "Failed to fetch RSVP list";
                    this.failModal.show = true;
                    this.loadingModal.show = false;
                })
                .finally(() => {
                    this.loadingModal.show = false;
                });
    },
         createReport() {
             this.loadingModal.show = true;
            this.errorMessage = '';

             const report = {
                 RSVP: {},
                 RSVPs: this.selectedRental,
                 dateAndTime: this.selectedDateAndTime,
                 location: this.location,
                 description: this.description,
                 repairCost: this.repairCost,
             };

             axios
                 .get(`http://localhost:8080/api/admin/RSVPs/read/${this.selectedRental}`)
                 .then(response => {
                     report.RSVP = response.data;

             // Make an API request to create the damage report
                axios
                    .post('http://localhost:8080/api/admin/damageReport/create', report)
                    .then(response =>{
                        console.log('Damage report added successfully')
                        console.log(response.data);
                        console.log(response);
                    })
                 })
                    .catch(error => {
                        console.log(error);
                        if (error.response && error.response.status === 400) {
                            this.errorMessage = 'Invalid data. Please check the entered values.';
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response);
                        } else {
                            this.errorMessage = 'An error occurred while adding the Damage Report.';
                        }
                    });
             this.resetForm();
        },
        resetForm() {
            this.damageReport = {
                selectedRental: '',
                description: '',
                dateAndTime: '',
                location: '',
                repairCost: ''
            };
        },
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>-->
<script>
import axios from "axios";
import ConfirmationModal from "@/components/Main/Modals/ConfirmationModal.vue";
import LoadingModal from "@/components/Main/Modals/LoadingModal.vue";
import SuccessModal from "@/components/Main/Modals/SuccessModal.vue";
import FailureModal from "@/components/Main/Modals/FailureModal.vue";

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
    components: { FailureModal, SuccessModal, LoadingModal, ConfirmationModal },
    data() {
        return {
            RSVPs: [],
            selectedRental: '',
            description: '',
            selectedDateAndTime: '',
            location: '',
            repairCost: 0,
            loadingModal: {
                show: false,
            },
            errorMessage: '',
            successModal: {
                show: false,
                message: "",
            },
            failModal: {
                show: false,
                message: "",
            },
        };
    },

    mounted() {
        this.fetchRentalOptions();
    },

    methods: {
        async fetchRentalOptions() {
            this.loadingModal.show = true;
            try {
                const token = localStorage.getItem('token');
                console.log("token", localStorage.getItem('token'))
                const response = await axios.get('http://localhost:8080/api/admin/RSVPs/list/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.RSVPs = response.data;
            } catch (error) {
                console.error(error);
                this.failModal.message = 'Failed to fetch RSVP list';
                this.failModal.show = true;
            } finally {
                this.loadingModal.show = false;
            }
        },

        async createReport() {
            this.loadingModal.show = true;
            this.errorMessage = '';

            try {
                const token = localStorage.getItem('token');
                const rentalResponse = await axios.get(`http://localhost:8080/api/admin/RSVPs/read/${this.selectedRental}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                const formattedDate = new Date(this.selectedDateAndTime).toISOString();
                const tempRental = {
                    rentalId: rentalResponse.data.id, // Add the rentalId
                    userId: rentalResponse.data.user.id, // Add the userId
                    eventId: rentalResponse.data.event.id, // Add the eventId
                    receiver: rentalResponse.data.receiver,
                    issuer: rentalResponse.data.issuer,
                    issuedDate: rentalResponse.data.issuedDate,
                    returnedDate: rentalResponse.data.returnedDate,

                    //fine: Math.floor(rentalResponse.fine),
                    // Add other properties as needed
                };
                const report = {
                    RSVP: tempRental,
                    dateAndTime: formattedDate,
                    location: this.location,
                    description: this.description,
                    repairCost: this.repairCost,
                };
                console.log('Report:', report);  // Check if the report is formed correctly


                await axios.post('http://localhost:8080/api/admin/damageReport/create', report, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });


                console.log('Damage report added successfully');
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 400) {
                    this.errorMessage = 'Invalid data. Please check the entered values.';
                    console.log(error.response.data);
                } else {
                    this.errorMessage = 'An error occurred while adding the Damage Report.';
                }
            } finally {
                this.resetForm();
                this.loadingModal.show = false;
            }
        },

        resetForm() {
            this.selectedRental = '';
            this.description = '';
            this.selectedDateAndTime = '';
            this.location = '';
            this.repairCost = 0;
        },

        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>

<style>
/* Add styles for the component here */
</style>
