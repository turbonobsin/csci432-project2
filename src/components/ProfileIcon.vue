<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, useTemplateRef } from 'vue';

const user = useUserStore();
const cont = useTemplateRef("cont");

async function logout(){
    
}

onMounted(()=>{
    cont.value?.addEventListener("click",e=>{

    });
});

</script>

<template>
    <div class="profile-icon-cont" ref="cont">
        <div v-if="user.token">{{ user.username || "(Guest)" }}</div>
        <div class="profile-icon"></div>
    </div>
</template>

<style scoped>
.profile-icon-cont{
    display:flex;
    align-items:center;
    gap:var(--size-400);
    font-size:12px;
    margin-left:var(--size-100);
    user-select:none;
    -webkit-user-select:none;
    padding:var(--size-100) var(--size-300);
    /* border-radius:var(--size-100); */
}
.profile-icon-cont:hover{
    cursor:pointer;
    background-color:var(--clr-neutral-200);
    outline:solid 1px var(--clr-neutral-300);
}

.profile-icon{
    width:35px;
    height:35px;
    background-color:gainsboro;
    border-radius:50%;
}

</style>