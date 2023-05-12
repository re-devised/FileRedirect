<template>
  <div class="fixed right-8 bottom-8">
      <button class="btn w-48 lg:text-sm text-center focus:outline-none
      bg-accent1-200 text-gray-800 shadow transform hover:scale-110 hover:bg-accent1-100 
      transition ease-out duration-300" @click="emitButtonClicked" :disabled="running">
      Redirect</button>
  </div>
</template>

<script>
export default {
  props: {
    running: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitButtonClicked(){
      this.$emit('buttonClicked')
    }
  }
}
</script>