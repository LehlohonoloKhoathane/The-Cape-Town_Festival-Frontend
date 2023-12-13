
/*filename: RentalsHistoryChartConfig.js*/
import axios from 'axios';


export async function fetchRentalsHistoryData() {
    try {
        const response = await axios.get('http://localhost:8080/api/admin/RSVPs/list/all');
        console.log('Response data:', response.data);

        const RSVPs = response.data;
        console.log('Rentals:', RSVPs);

        // Count the number of RSVPs issued on each date
        const rentalCounts = {};
        RSVPs.forEach((RSVP) => {
            const issuedDate = RSVP.issuedDate.split('T')[0]; // Extract date from timestamp
            if (rentalCounts[issuedDate]) {
                rentalCounts[issuedDate]++;
            } else {
                rentalCounts[issuedDate] = 1;
            }
        });

        const labels = Object.keys(rentalCounts);
        console.log('Labels:', labels);

        const data = labels.map((label) => rentalCounts[label]);
        console.log('Data:', data);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Rentals Issued',
                    backgroundColor: '#f87979',
                    data: data
                }
            ]
        };
    } catch (error) {
        console.error('Error fetching RSVPs history data:', error);
        return null;
    }
}
