<script setup>
//import HelloWorld from './components/HelloWorld.vue'
import Carrusel from './components/Carrusel.vue'
import Inicio from './components/Inicio.vue'
import Footer from './components/Footer.vue'
//import Products from './components/Products.vue'
</script>

<template>
<div>
  <div>
    <Carrusel />
  </div>
    <router-view></router-view> 
  <div>
    <Products />
  </div>  
  <div>
    <Footer />
  </div>
  
</div>

</template>



