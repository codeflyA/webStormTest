import { defineStore } from "pinia";

export const useCounterStore = defineStore(
  "counter",
  () => {
    const count = ref(0);
    function increment() {
      count.value++;
    }
    return { count, increment };
  },
  {
    persist: {
      pick: ["count"],
    },
  }
);

// import { useCounterStore } from '../../stores/counter'
//
// const counterStore = useCounterStore()
// counterStore.count // 0
// counterStore.increment()
// counterStore.count // 1
