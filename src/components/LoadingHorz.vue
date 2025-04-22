<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

let props = defineProps<{
    loading:boolean;
}>();
let iconRef = useTemplateRef("loading-icon");
let prog = 0;
let y = 0;
let vy = 0;
let rot = 0;
let vrot = 30;

let speed = 1;

function run(){
    // if(!props.loading) return;
    let icon = iconRef.value;
    if(!icon) return;

    // prog = Math.sin(performance.now()/750)/2; // 500 for timing before but maybe a little too fast
    // prog = Math.sin(inc/100)/2; // 500 for timing before but maybe a little too fast
    // prog = Math.sqrt(inc/60);
    // prog += speed;
    // speed *= 0.95;
    // if(prog > 2) prog = 0;

    // prog = ; // 0 to 2

    if(speed < 0.1){
        speed = -1;
        vrot = -30;
    }

    speed *= 0.97;
    if(prog > 2){
        prog = 0;
    }
    else if(prog < 0){
        prog = 0;
        speed = 1;
        vrot = 30;
    }

    icon.style.setProperty("--x",(prog*200)+"px");
    icon.style.scale = `${1} ${1}`;
    icon.style.rotate = `${rot}deg`;

    // rot += (prog-0.5)*2;
    // rot += (prog-0.5)*20;
    // vrot += (prog-0.2+0.4)*1.1;
    rot += vrot;

    vrot *= 0.97;
}

function update(){
    requestAnimationFrame(update);
    prog += 0.01*speed;
}
update();

onMounted(()=>{
    setInterval(()=>{
        run();
    },50);
});

</script>

<template>
    <!-- <div class="loading-cont" v-if="props.loading"> -->
    <div class="loading-cont" :loading="props.loading">
        <div class="icon loading-icon" ref="loading-icon">sports_basketball</div>
    </div>
</template>

<style scoped>

.loading-cont{
    /* margin-top:100px; */
    display:flex;
    align-items:center;
    /* justify-content:center; */
    overflow:hidden;
    opacity:0;
    height:0px;
    /* position:absolute; */
}
.loading-icon{
    font-size:30px;
    /* animation:LoadingAnim 2s alternate infinite; */
    transition:all 0.1s;

    --x:0px;
    --y:0px;

    translate:var(--x) var(--y);
    transform-origin:center center;
    width:max-content;
}

[loading=true]{
    animation:LoadingAnim 0.5s;
    opacity:1;
    /* display:flex; */
    /* height:150px; */
    /* margin-top:100px; */
    height:40px;
}
[loading=false]{
    animation:LoadingAnim 0.5s reverse;
    opacity:0;
    /* display:none; */
    height:0px;
    /* margin-top:0px; */
}

@keyframes LoadingAnim{
    0%{
        opacity:0;
        /* height:0px; */
        /* margin-top:0px; */
        /* display:none; */
        /* translate:0px 0px; */
    }
    100%{
        opacity:1;
        /* height:150px; */
        /* margin-top:100px; */
        /* display:flex; */
        /* translate:100px 0px; */
    }
}

</style>