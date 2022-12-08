<template>
  <div class="-enter-x p-[6px] min-w-[20px]">
    1. 
    <router-link :to="{ name: 'DownExcelOne' }"
                  tag="div"
                  class="bg-[pink]">
      导出Excel(无样式版)
    </router-link>
  </div>
  <div class="-enter-x p-[6px] min-w-[20px]">
    2. 
    <router-link :to="{ name: 'DownExcelTWO' }"
                  tag="div"
                  class="bg-[pink]">
      导出Excel(有样式版)
    </router-link>
  </div>
  <div class="-enter-x p-[6px] min-w-[20px]">
    3. 
    <router-link :to="{ name: 'Request' }"
                  tag="div"
                  class="bg-[pink]">
      Axios工厂
    </router-link>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>