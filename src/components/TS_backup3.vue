<script setup lang="ts">
import { wait } from '@/util';
import { onMounted, ref, useTemplateRef } from 'vue';

const props = defineProps<{
    list:string[]
}>();
let current = ref(0);
let inc = ref(0);
let delay = 2000;

const cont = useTemplateRef("text-scroller-cont");

async function advance(){
    cont.value?.classList.add("move2");
    await wait(delay);
    cont.value?.classList.remove("move2");
    
    current.value++;
    inc.value++;
    if(current.value >= props.list.length) current.value = 0;

    await wait(delay);

    advance();
}

onMounted(async ()=>{
    await wait(delay);
    advance();
});

</script>

<template>
    <div ref="text-scroller-cont" class="text-scroller-cont">
        <div class="test"></div>
        <div v-for="(item,i) in props.list" :style="{'--ang':((i - inc)/props.list.length*360)+'deg'}" :active="current == i">
            <div>{{ item }}</div>
        </div>
    </div>
</template>

<style scoped>

.text-scroller-cont{
    /* overflow:hidden; */
    height:1.5em;
    line-height:1.5;

    /* vvv - fun little glitch with white lines that looks good */
    /* font-size:100px; */
}
.move > *{
    animation:Move forwards 750ms;
}
@keyframes Move{
    0%{
        translate:0px 0px;
    }
    100%{
        translate:0px -1.5em;
    }
}

.test{
    position:absolute;
    top:-50px;
    left:-1000px;
    height:2px;
    width:1500px;
    background-color:var(--clr-primary-400);
}

.text-scroller-cont{
    transform-style:preserve-3d;
    /* perspective:1000px; */
    position:relative;
    /* width:200px; */
    /* aspect-ratio:1; */

    animation:Rot3D forwards 2s;
}

@keyframes Rot3D{
    0%{
        transform:rotateX(0deg) rotateZ(25deg) rotateY(20deg);
        /* --ang:0deg; */
    }
    100%{
        transform:rotateX(360deg) rotateZ(25deg) rotateY(20deg);
        /* --ang:360deg; */
    }
}

.text-scroller-cont > *{
    position:absolute;
    /* transition:transform 1.5s, opacity 1s ease-out, color 1s ease-out; */
    transition:all 1.5s;
    /* backface-visibility: hidden; */
    backface-visibility: visible;
    --ang:0deg;
    transform:rotateX(var(--ang)) translateZ(calc(100px + var(--extend)));
    /* opacity:0; */
    /* background-color: white; */

    --extend:0px;

    height:1.5em;
    transform-style: preserve-3d;

    &::before{
        content:"Organize";
        position:absolute;
        top:50%;
        left:50%;
        width:100%;
        height:100%;
        /* background-color:black; */
        opacity:0.2;
        filter:blur(5px);
        translate:-50% -50%;
        transform:translateZ(-5px);
    }
    &::after{
        content:"";
        position:absolute;
        top:50%;
        left:50%;
        width:100%;
        height:100%;
        background-color:rgba(255,255,255,1);
        opacity:0.9;
        translate:-50% -50%;
        transform:translateZ(-10px);
    }
}
.text-scroller-cont > *[active=true]{
    color:var(--clr-primary-400);
    opacity:1;
    --extend:30px;
}

</style>