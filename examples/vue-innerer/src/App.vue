<template>
  <div id="app">

    <div style="width: auto; height: 900px;">SCROLL DOWN</div>

    <InnererExample />

    <div style="width: auto; height: 900px; display: flex; align-items: flex-end; justify-content: center;">SCROLL UP</div>

  </div>
</template>

<script>
  import InnererExample from "./components/InnererExample";
  export default {
    name: 'App',
    components: {
        InnererExample
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

</style>
