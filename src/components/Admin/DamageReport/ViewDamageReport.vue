<template>
    <div class="card-container">
        <div class="form-container">
        <div class="report-profile">
            <h1>Damage Report Profile</h1>
            <hr>
            <div class="profile-details" v-if="damageReport && RSVP">
                <div class="section">
                    <h3>Report Details:</h3>
                    <hr>
                    <div class="detail-row">
                        <div>
                            <label>Damage Report ID:</label>
                            <span>{{ damageReport.id }}</span>
                        </div>
                        <div>
                            <label>Description:</label>
                            <span>{{ damageReport.description }}</span>
                        </div>
                        <div>
                            <label>Date & Time:</label>
                            <span>{{ damageReport.dateAndTime }}</span>
                        </div>
                        <div>
                            <label>Location:</label>
                            <span>{{ damageReport.location }}</span>
                        </div>
                        <div>
                            <label>Repair Cost:</label>
                            <span>{{ damageReport.repairCost }}</span>
                        </div>
                    </div>
                    <div class="section">
                        <h3>Rental Details:</h3>
                        <hr>
                        <div class="detail-row">
                        <div v-if="damageReport.RSVP">
                            <div>
                                <label>Rental ID:</label>
                                <span>{{ damageReport.RSVP.rentalId }}</span>
                            </div>
                    <div>
                    <label>Issuer:</label>
                    <span>{{ damageReport.RSVP.issuer }}</span>
                </div>
                            <div>
                                <label>First Name:</label>
                                <span>{{ damageReport.RSVP.user.firstName }}</span>
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <span>{{ damageReport.RSVP.user.lastName }}</span>
                            </div>
                            <div>
                                <label>Email:</label>
                                <span>{{ damageReport.RSVP.user.userName }}</span>
                            </div>
                            <div>
                                <label>Rental Date:</label>
                                <span>{{ damageReport.RSVP.issuedDate }}</span>
                            </div>
                            <div>
                                <label>Return Date:</label>
                                <span>{{ damageReport.RSVP.returnedDate }}</span>
                            </div>
                            <div>
                            <label>Fine:</label>
                            <span>{{ damageReport.RSVP.fine }}</span>
                        </div>
                        </div>
                            <div v-if="damageReport.RSVP.event">
                            <div class="section">
                                <h3>Event Details:</h3>
                                <hr>
                                <div class="detail-row">
                            <div>
                                <label>Event Make:</label>
                                <span>{{ damageReport.RSVP.event.name }}</span>
                            </div>
                            <div>
                                <label>Event Model:</label>
                                <span>{{ damageReport.RSVP.event.model }}</span>
                            </div>
                            <div>
                                <label>Event Year:</label>
                                <span>{{ damageReport.RSVP.event.startTime }}</span>
                            </div>
                            <div>
                                <label>Event Category:</label>
                                <span>{{ damageReport.RSVP.event.category }}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
            <div v-else>
                <p>Loading report profile...</p>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ViewDamageReport',
    data() {
        return {
            damageReport: null,
            RSVP: null,
            //user: null,
            event: null,
        };
    },
    mounted() {
        console.log('ViewDamageReport component is mounted');
        this.fetchReportProfile();
    },
    methods: {

        async fetchReportProfile() {
            const damageReportId = this.$route.params.id;

            console.log('Fetching damage report...');

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/admin/damageReport/read/${damageReportId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                this.damageReport = response.data;
                console.log('Damage Report:', this.damageReport);

                // Now that we have the damage report, let's fetch the RSVP profile
                await this.fetchRentalProfile();
            } catch (error) {
                console.error('Error fetching damage report:', error);
            }
        },

        async fetchRentalProfile() {
            //if (this.damageReport && this.damageReport.RSVP) {
                const rentalId = this.damageReport.RSVP.id;

                console.log('Fetching RSVP profile...');

                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:8080/api/admin/RSVPs/read/${rentalId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });


                    this.RSVP = response.data;
                    console.log('Rental Profile:', this.RSVP);
                } catch (error) {
                    console.error('Error fetching RSVP profile:', error);
                }
            //}
            },
        },
};
</script>


<style>
.card-container {
    display: flex;
    padding: 50px;
    justify-content: center;

}
.report-profile {
    margin-top: 20px;
}

.report-profile h1 {
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



