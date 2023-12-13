<template>
  <div class="home">
    <div class="jumbotron">
      <!-- Jumbotron content -->
      <h1 class="display-4"><i class="fas fa-gem"></i></h1>
      <h1 class="display-4"> Welcome The Cape Town Festival</h1>
      <p class="lead">Explore, Engage and Experience</p>
      <hr class="my-4">
      <p>Explore our wide range of Events and book yours today.</p>
      <!-- Link to view all events -->
      <div class="button-container button-container-margin">
        <router-link :to="{ name: 'EventList', params: { category: 'all', available: true } }" class="custom-button">
          <i class="fas fa-search"></i> View details
        </router-link>
      </div>
    </div>
    <div class="container">
      <h2 class="content-header display-4">Our Services</h2>
      <div class="row">
        <div class="col-md-4">
          <div class="card mb-4 shadow-lg">
            <div class="card-body box-shadow">
              <h3 class="card-title content-header"><i class="fas fa-gem"></i> Cultural Festivals</h3>
              <p class="card-text">Events that showcase & Celebrate traditions.</p>
              <p class="card-text mt-2">Starting at {{ currencyData.currencySymbol }} R 10.00/day</p>
              <div class="justify-content-between align-items-center">
                <!-- Link to view available economy events -->
                <div class="button-container button-container-margin" >
                  <router-link :to="{ name: 'EventList', params: { category: 'economy', available: true } }" class="custom-button">
                    <i class="fas fa-info-circle"></i> View
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <div class="card-body box-shadow">
              <h3 class="card-title content-header"><i class="fas fa-gem"></i> Art Festivals</h3>
              <p class="card-text">Experience the Celebrations of visual arts including exhibitions.</p>
              <p class="card-text mt-2">Starting at {{ currencyData.currencySymbol }}100.00/day</p>
              <div class="justify-content-between align-items-center">
                <!-- Link to view available luxury events -->
                <div class="button-container button-container-margin">
                  <router-link :to="{ name: 'EventList', params: { category: 'luxury', available: true } }"
                              class="custom-button">
                    <i class="fas fa-info-circle"></i> View
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <div class="card-body box-shadow">
              <h3 class="card-title content-header"><i class="fas fa-gem"></i> Music Festivals</h3>
              <p class="card-text"> Celebrations centered around live music perfomances.</p>
              <p class="card-text mt-2">Starting at {{ currencyData.currencySymbol }}50.00/day </p>
              <div class="justify-content-between align-items-center">
                <!-- Link to view available special events -->
                <div class="button-container button-container-margin">
                  <router-link :to="{ name: 'EventList', params: { category: 'special', available: true } }"
                              class="custom-button button">
                    <i class="fas fa-info-circle"></i> View
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import store, {currencySymbol} from "@/store/store";
/*import {currencySymbol} from "@/store/currencyStore";*/

export default {
  name: 'Home',
  props: ['currencyData'],
  mounted() {
    console.log("Current token:  " + store.state.token); // Output the value of the token

    console.log("Currency Symbol : " + currencySymbol.value); // Output the value of the currency symbol
  }

};
</script>

<style>
.jumbotron {
  background-image: url('../../../assets/Images/Background/backgrounds.png');
  background-size: cover;
  height: 500px;
  display: flex;
  font-weight: 700;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: 10px;
  margin-top: .2rem;
}

.card {
  min-height: 250px;
  background: #a5a1ff;
  background-color: #a5a1ff;
  --bs-card-bg: #a5a1ff !important;
}

.custom-button {

  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  text-decoration: none;

}

.custom-button:hover {
  background-color: #0069d9;
}

.custom-button i {
  margin: 0.5rem;
}
.button-container-margin{
  margin: 1rem;


}
</style>
