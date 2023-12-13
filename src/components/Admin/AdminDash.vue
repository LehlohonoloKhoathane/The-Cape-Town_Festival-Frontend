<script setup>



import RentalDurations from "@/components/Admin/Charts/RentalDurations.vue";
</script>

<template>
  <div class="content-container">
    <div>
      <h1>Admin DashBoard</h1>
    </div>

    <div class="graph-container">
      <h1>Event Type </h1>
      <RentalDurations/>
    </div>

    <div class="graph-container">
      <h1>Event Price Groups </h1>
      <RentalDurations/>
    </div>


    <div class="graph-container">
      <h1>Event Durations </h1>
      <RentalDurations/>
    </div>
    


  </div>


</template>

<style scoped>
.graph-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 80%;
  margin: 2rem;
}


</style>