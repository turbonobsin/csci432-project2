<script setup lang="ts">
import { wait } from '@/util';
import { onMounted, ref, useTemplateRef, watch } from 'vue';


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

const fake = useTemplateRef("fake-knob");
const opCont = useTemplateRef("op-cont");
// const switchDelay = 80;
const switchDelay = 200;

function changeValue(ind:number){
    let lastI = i.value;
    let wasChange = (i.value != ind);
    i.value = ind;
    if(inpF.value) if(wasChange && ind != undefined){
        inpF.value(ind);
    }
    // updateFake(lastI,ind);
}

let movingRes:()=>void;
let movingProm:Promise<void>;

async function updateFake(lastI:number,ind:number){
    await movingProm;
    movingProm = new Promise<void>(resolve=>movingRes = resolve);
    
    if(fake.value && opCont.value){
        let c = opCont.value[ind];
        let len = (c.parentElement!.children.length-1);
        let w = 100/(len);
        function moveLeft(){
            // fake.value?.style.setProperty("--left",(c.offsetLeft)+"px");
            // fake.value?.style.setProperty("--left",(c.offsetLeft/c.parentElement!.offsetWidth*100)+"%");
            fake.value?.style.setProperty("--left",(ind/len*100)+"%");
        }
        function moveRight(){
            // let w = c.offsetWidth;
            // fake.value?.style.setProperty("--right",(c.offsetLeft+w)+"px");
            fake.value?.style.setProperty("--right",((ind/len*100)+w)+"%");
        }
        fake.value?.style.setProperty("--w",w+"%");
        if(ind >= lastI){
            moveRight();
            await wait(switchDelay);
            moveLeft();
        }
        else{
            moveLeft();
            await wait(switchDelay);
            moveRight();
        }
        movingRes();
    }
}

watch(i,(v,ov)=>{
    updateFake(ov,v);
});
onMounted(()=>{
    setTimeout(()=>{
        updateFake(i.value,i.value);
    },16);
});

</script>

<template>
    <div class="radio-switch-cont">
        <div class="fake-knob" ref="fake-knob"></div>
        <div class="op-cont" ref="op-cont" v-for="(op,ind) in props.options" @click="changeValue(ind)" :sel="ind == i">
            <!-- <input type="radio" :name="props.name" id="" :checked="ind == props.i"> -->
            <!-- <label for="">{{ op }}</label> -->

            <div>{{ op }}</div>
        </div>
    </div>
</template>

<style scoped>

.fake-knob{
    position:absolute;
    transition:all 0.2s ease-out;
    /* background-color:deeppink; */
    height:calc(100% - var(--size-200));
    /* height:100%; */
    width:50px;

    top:50%;
    translate:var(--size-100) -50%;

    --left:0px;
    --right:0px;
    left:var(--left);
    /* width:calc(var(--right) - var(--left)); */
    width:calc(var(--right) - var(--left) - var(--size-200));

    /*  */

    user-select:none;
    -webkit-user-select:none;
    text-align:center;
    padding:var(--size-200);
    border-radius:50px;
    cursor:pointer;
    font-size:14px;

    background-color:var(--sel-bg);
}
/* .fake-knob::before{
    content:"";
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    background-color:var(--clr-primary-400);
    z-index:0;
} */

.radio-switch-cont{
    display:flex;
    align-items:center;
    gap:var(--size-100);
    position:relative;

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
    /* background-color:var(--sel-bg); */
    color:var(--sel-text);
    transition:color 0.1s;
}
/*.op-cont1[sel=true]::before{
    content:"";
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    background-color:var(--clr-primary-400);
    z-index:0;
} */

.neutral-style{
    --sel-bg:var(--clr-neutral-300);
    --sel-text:var(--clr-neutral-900);
}

</style>