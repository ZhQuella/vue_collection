<template>
  <div>
    <n-button class="mx-auto block mt-[20px]"
              @click="onDownExcel">导出Excel</n-button>
  </div>
</template>

<script setup lang="ts">
import DownExcelNotStyle from "utils/DownExcel/DownExcelNotStyle";

const onDownExcel = () => { 
  const downExcelNotStyle: DownExcelNotStyle = new DownExcelNotStyle({
    header: [{
      field: "c1",
      title: "c111",
      children: [{
        field: "c2",
        title: "c222",
        children: [{
          field: "c5",
          title: "c555",
        },
        {
          field: "c6",
          title: "c666",
        }]
      }, {
        field: "c3",
        title: "c333"
      }, {
        field: "c4",
        title: "c444"
      }]
    },{
      field: "c7",
      title: "c777"
    }, {
      field: "c8",
      title: "c888"
    }]
  });

  let result: any[] = [];
  for (let i = 0; i <= 100; i++) { 
    const value = `数据${i}`;
    result.push({
      c2: value,
      c3: value,
      c4: value,
      c5: value,
      c6: value,
      c7: value,
      c8: value
    });
  };
  downExcelNotStyle.down(`${+new Date()}`, result);
};

</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DownExcel_ONE"
});
</script>