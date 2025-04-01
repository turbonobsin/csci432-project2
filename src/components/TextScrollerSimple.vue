<script setup lang="ts">
import { wait } from '@/util';
import { onMounted, ref, useTemplateRef } from 'vue';

const props = defineProps<{
    list:string[]
}>();
let current = ref(0);
let delay = 2000;

const cont = useTemplateRef("text-scroller-cont");

async function advance(){
    cont.value?.classList.add("move2");
    console.log("move");
    await wait(delay);
    return;
    cont.value?.classList.remove("move2");

    
    current.value++;
    if(current.value >= props.list.length) current.value = 0;
    console.log("inc");

    await wait(delay);

    advance();
}

onMounted(()=>{
    advance();
});

</script>

<template>
    <div ref="text-scroller-cont" class="text-scroller-cont">
        <div class="current">{{ props.list[current] }}</div>
        <div class="next">{{ props.list[(current+1) % props.list.length] }}</div>
    </div>
</template>

<style scoped>

.text-scroller-cont{
    /* overflow:hidden; */
    height:1.5em;
    line-height:1.5;
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

.text-scroller-cont{
    transform-style:preserve-3d;
    /* perspective:1000px; */
    position:relative;
    width:200px;
    height:200px;
    --ang:0deg;
    --ang2:45deg;

    /* transform:rotateX(45deg) rotateY(45deg) rotateZ(45deg); */
    animation:Rot3D forwards infinite 2s;
}

@keyframes Rot3D{
    0%{
        transform:rotateX(0deg);
        /* --ang:0deg; */
    }
    100%{
        transform:rotateX(360deg);
        /* --ang:360deg; */
    }
}

.text-scroller-cont > *{
    position:absolute;
    transition:all 2s;
    backface-visibility: visible;
    width:100px;
    height:100px;
}
.current{
    transform:rotateX(0deg) translateZ(100px);
    /* transform-origin:top; */
}
.next{
    transform:rotateX(180deg) translateZ(100px);
    /* transform-origin:top; */
}
.move2{

}

</style>