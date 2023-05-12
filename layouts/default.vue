<template>
  <div>
    <Nuxt :class="cssClass"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cssClass: 'text-primary-200 font-body bg-background min-h-screen max-h-full'
    }
  },
}
</script>

<style>
/*html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}*/
</style>
