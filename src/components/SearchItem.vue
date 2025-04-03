<script setup lang="ts">
import type { Team } from '@/util';
import { ref } from 'vue';

const props = defineProps<{
    title:string;
    color:string;
}>();

</script>

<template>
    <div class="team-item" :style="{'--color':`${props.color}`}">
        <div class="label">{{ props.title }}</div>
        <slot></slot>
    </div>
</template>

<style scoped>

.team-item.hidden{
    opacity:0;
    translate:0px 3px;
}

.team-item{
    /* padding:var(--size-200) var(--size-400); */
    /* border-bottom:solid 1px var(--clr-neutral-300); */
    
    margin:var(--size-400);
    padding:var(--size-400);
    border:solid 1px var(--clr-neutral-300);
    border-radius:var(--size-200);
    background-color:var(--clr-neutral-200);

    overflow:hidden;
    position:relative;
    padding-top:var(--size-600);

    /* transition:opacity 0.2s ease-out; */
    /* transition:all 0.2s ease-out; */
    transition:all 0.2s ease;

    /* --color:gold; */
    --color:gold;
    /* --color:var(--clr-secondary-400); */
    /* --color:teal; */

    cursor:pointer;
}
.team-item::before{
    content:"";
    position:absolute;
    bottom:0px;
    left:0px;
    width:100%;
    height:3px;
    background-color:var(--color);
    transition:all 0.2s ease;
}
.team-item .label{
    content:"Team";
    position:absolute;
    /* top:3px; */
    top:8px;
    left:16px;
    font-size:12px;
    opacity:0.4;
    text-transform:uppercase;
    font-weight:bold;
}
.team-item::after{
    content:"";
    position:absolute;
    top:100%;
    left:50%;
    translate:-50% -50%;
    width:100%;
    height:200%;
    background: radial-gradient(var(--color) 0%, transparent 60%);
    opacity:0.05;
    /* opacity:0; */
    mix-blend-mode: hard-light;
    pointer-events:none;
}

.team-item:hover{
    translate:0px -3px;
    /* box-shadow:0px 5px 10px var(--color); */
    box-shadow:0px 5px 10px rgba(0,0,0,0.05);

    &::before{
        height:6px;
    }
}

</style>