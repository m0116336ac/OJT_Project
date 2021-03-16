<template>
  <div id="overlay" v-on:click="clickEvent">
    <div id="content">
      <p></p>
      <button @click="clickEvent">キャンセル</button>
    </div>
  </div>
</template>


<script>
export default{
  methods: {
    clickEvent: function(){
      this.$emit('from-child')
    }
  }
}
</script>

<style scoped>
#form {
  margin-top: 15px;
}
#overlay{
  z-index:1;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}
#content{
  z-index:2;
  width:75%;
  height:60%;
  padding: 1em;
  background:#ffffff;
}
</style>