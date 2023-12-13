import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    getItems() {
        return apiClient.get('/items');
    },

    getItem(id) {
        return apiClient.get(`/items/${id}`);
    },

    createItem(item) {
        return apiClient.post('/items', item);
    },

    updateItem(id, item) {
        return apiClient.put(`/items/${id}`, item);
    },

    deleteItem(id) {
        return apiClient.delete(`/items/${id}`);
    }
}


// const firebase = require('firebase/app');
// require('firebase/database');

// // Import Firebase configuration from firebaseConfig.js
// const firebaseConfig = require('./firebaseConfig');

// // Initialize Firebase with the configuration
// firebase.initializeApp(firebaseConfig);

// const db = firebase.database();

// module.exports = {
//     getItems() {
//         return db.ref('items').once('value');
//     },
//     getItem(id) {
//         return db.ref(`items/${id}`).once('value');
//     },
//     createItem(item) {
//         const newItemRef = db.ref('items').push();
//         return newItemRef.set(item);
//     },
//     updateItem(id, item) {
//         return db.ref(`items/${id}`).set(item);
//     },
//     deleteItem(id) {
//         return db.ref(`items/${id}`).remove();
//     }
// };
