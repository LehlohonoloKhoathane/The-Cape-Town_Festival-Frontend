// rentalsApi.js

let rentalsDataPromise = null;
export function fetchRentalsData() {
    if (rentalsDataPromise) {
        return rentalsDataPromise;
    }

    rentalsDataPromise = new Promise(async (resolve, reject) => {
        try {
            const token = localStorage.getItem('token');// Retrieve the token
            const response = await fetch('http://localhost:8080/api/admin/RSVPs/list/all', {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the headers
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch RSVPs data');
            }
            const data = await response.json();
            let rentalsData;
            rentalsData = data; // Store the data
            resolve(data);
        } catch (error) {
            console.error('Error fetching RSVPs data:', error);
            // Handle error case
            reject(error);
        }
    });

    return rentalsDataPromise;
}

// Other functions related to RSVPs...

export async function fetchRentalById(rentalId) {
    // Implementation for fetching a RSVP by ID
}

export async function createRental(rentalData) {
    // Implementation for creating a new RSVP
}


