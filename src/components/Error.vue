<script setup lang="ts">
import { ref } from 'vue';

let msg = ref("");
let msgLines = ref([] as string[]);

defineExpose({
    alert:(errorMsg:string)=>{
        msg.value = errorMsg;
    },
    alertLines:(errorMsgs:string[])=>{
        msgLines.value = errorMsgs;
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
    <div v-if="msgLines.length" v-for="msg in msgLines" :hide="msg == ''" class="error">{{ msg }}</div>
</template>

<style scoped>

.error{
    color:var(--clr-error-400);
    font-size:14px;
    margin-block:var(--size-200);
}

</style>