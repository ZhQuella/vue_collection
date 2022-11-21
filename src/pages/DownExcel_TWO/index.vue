<template>
  <div>
    <n-button class="mx-auto block mt-[20px]"
              @click="onDownExcel">导出Excel</n-button>
  </div>
</template>

<script setup lang="ts">

const onDownExcel = () => { 
  console.log(12312);
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DownExcel_TWO"
});
</script>
