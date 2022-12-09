<template>
  <div>
    <ul class="m-[10px]">
      <li class="border-solid divide-y border-[1px] rounded-[4px] text-center"
          v-for="(song) of state.songs"
          :key="song.id">{{ song.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import axios from "api/index";
import { reactive, onMounted } from "vue";
const state: {
  songs: any[]
} = reactive({
  songs: []
});

axios.setConfig("test", [{
  key: "getAbc",
  url: "/search",
  method: "get",
  query: {
    abc: 1
  }
},{
  key: "getDef",
  url: "/search",
  method: "get",
  query: {
    abc: 1
  }
}]);
const methods = axios.create("test", ["getAbc"]);
console.log(methods);
onMounted(async () => { 
  const { data } = await methods.getAbc({
    query: { keywords: "北京" }
  });
  const { result } = data;
  state.songs = result.songs || [{ name: "北京" }];
})
</script>

<style lang="scss" scoped>

</style>