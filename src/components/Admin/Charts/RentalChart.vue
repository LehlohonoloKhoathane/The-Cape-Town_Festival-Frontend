<template>
  <div class="chart">
    <LoadingModalSection :show="isLoading"> Loading chart... </LoadingModalSection>
    <Bar v-if="!isLoading && chartData" :data="chartData" :options="chartOptions"/>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import LoadingModalSection from "@/components/Main/Modals/LoadingModalSection.vue";
import { fetchRentalsData } from './rentalsApi';

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: {
    Bar,
    LoadingModalSection,
  },
  data() {
    return {
      chartData: null,
      chartOptions: {
        responsive: true,
      },
      isLoading: false,
    };
  },
  async mounted() {
    try {
      this.isLoading = true; // Show loading modal
      const RSVPs = await fetchRentalsData();
      if (RSVPs) {
        const rentalCounts = {}; // Object to store RSVP counts for each date
        RSVPs.forEach((RSVP) => {
          const issuedDate = RSVP.issuedDate.split('T')[0]; // Extract date from timestamp
          if (rentalCounts[issuedDate]) {
            rentalCounts[issuedDate]++;
          } else {
            rentalCounts[issuedDate] = 1;
          }
        });

        const labels = Object.keys(rentalCounts);
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Rentals',
              backgroundColor: '#f87979',
              data: labels.map((label) => rentalCounts[label]),
            },
          ],
        };
        this.chartData = chartData;
      } else {
        // Handle error case
        console.error('Error fetching RSVPs history data');
      }
    } catch (error) {
      console.error('Error fetching RSVPs history data:', error);
      // Handle error case
    } finally {
      this.isLoading = false; // Hide loading modal
    }
  },
};
</script>

<style>
</style>