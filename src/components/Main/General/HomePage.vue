<template>

    <div>
        <button @click="goToEvents">View Events</button>
        <button @click="goToCustomers">View Customers</button>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    methods: {
        goToEvents() {
            this.$router.push('/events');
        },
        goToCustomers() {
            this.$router.push('/customers');
        }
    }
}
</script>