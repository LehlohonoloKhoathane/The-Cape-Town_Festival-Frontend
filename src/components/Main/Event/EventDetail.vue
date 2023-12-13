<template>
  <div class="content-container">
    <div>
        <h1>{{ event.name }}</h1>
        <p>{{ event.description }}</p>
        <p>Price: {{ event.pricegroup }}</p>

    </div>
  </div>

</template>

<script>


export default {
    name: 'EventDetail',
    components: {
        Carousel
    },
    data() {
        return {
            event: {
                id: 1,
                name: 'Jazz Concert',
                price: 2500,
                description: 'cape Town stadium',
                images: [
                    'https://via.placeholder.com/800x400/FF5733/FFFFFF?text=Image+1',
                    'https://via.placeholder.com/800x400/333333/FFFFFF?text=Image+2',
                    'https://via.placeholder.com/800x400/7B2FBE/FFFFFF?text=Image+3',
                    'https://via.placeholder.com/800x400/0099CC/FFFFFF?text=Image+4'
                ]
            }
        }
    }
};
</script>
