<script setup lang="ts">
import { ref } from 'vue';

let msg = ref("");

defineExpose({
    alert:(errorMsg:string)=>{
        msg.value = errorMsg;
    },
    linkInput:(inp:HTMLInputElement)=>{
        inp.addEventListener("keydown",e=>{
            msg.value = "";
            inp.classList.remove("invalid");
        });
    },
    clear:()=>{
        msg.value = "";
    }
});

</script>

<template>
    <div :hide="msg == ''" class="error">{{ msg }}</div>
</template>

<style scoped>

.error{
    color:var(--clr-error-400);
    font-size:14px;
    margin-block:var(--size-200);
}

</style>