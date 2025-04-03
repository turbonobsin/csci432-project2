<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    name:string;
    options:string[];
}>();

const i = ref(0);
let inpF = ref(null as ((i:number)=>void|Promise<void>)|null);

defineExpose({
    i,
    onInput:(f:(i:number)=>void|Promise<void>)=>{
        inpF.value = f;
    }
});

function changeValue(ind:number){
    let wasChange = (i.value != ind);
    i.value = ind;
    if(inpF.value) if(wasChange && ind != undefined){
        inpF.value(ind);
    }
}

</script>

<template>
    <div class="radio-switch-cont">
        <div class="op-cont" v-for="(op,ind) in props.options" @click="changeValue(ind)" :sel="ind == i">
            <!-- <input type="radio" :name="props.name" id="" :checked="ind == props.i"> -->
            <!-- <label for="">{{ op }}</label> -->

            <div>{{ op }}</div>
        </div>
    </div>
</template>

<style scoped>

.radio-switch-cont{
    display:flex;
    align-items:center;
    gap:var(--size-100);

    background-color:var(--clr-neutral-200);
    border:solid 1px var(--clr-neutral-300);
    border-radius:50px;

    padding:var(--size-100);

    --sel-bg:var(--clr-primary-400);
    --sel-text:var(--clr-neutral-100);
}
.op-cont{
    width:100%;
    user-select:none;
    -webkit-user-select:none;
    text-align:center;
    padding:var(--size-200);
    /* border-radius:var(--size-200); */
    border-radius:50px;
    cursor:pointer;
    font-size:14px;
    position:relative;
    /* transition:all 0.1s ease-out; */
}
.op-cont[sel=true]{
    background-color:var(--sel-bg);
    color:var(--sel-text);
}
.op-cont1[sel=true]::before{
    content:"";
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    background-color:var(--clr-primary-400);
    z-index:0;
}

</style>