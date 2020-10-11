<template>
  <div class="home">
    11111
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  async mounted () {
    await this.$http.post('/api/user/add_location',
      {
        location: '1'
      },
      {})
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>

</style>