<script setup lang="ts">
import TextScroller from "./TextScroller.vue";

</script>

<template>
    <div class="hero-cont">
        <div class="glow"></div>
        <div class="glow glow2"></div>
        <div class="col2">
            <div class="title-cont">
                <div class="title">NBA Stats</div>
            </div>
            <div class="info-cont">
                <div class="info">
                    <TextScroller :list="['Search','Organize','Favorite','Betting','Search','Organize','Favorite','Betting']"></TextScroller>
                </div>
            </div>
        </div>

    </div>
    <div class="join-cont">
        <div class="fill-line"></div>
        <RouterLink to="/join" class="btn accent icon-cont b-get-started"><div class="material-icons">sports_basketball</div>Get Started</RouterLink>
        <div class="fill-line"></div>
        <!-- net underneath that ball from button drops into and then changes page -->
    </div>
</template>

<style scoped>

.join-cont{
    height:100px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:10px;
}
.b-get-started{
    width:max-content;
    flex-shrink:0;
}

.hero-cont{
    height:calc(100vh - var(--header-height) - 300px);
    max-height:600px;
    display:relative;
    display:grid;
    /* grid-template-rows: 1fr 300px; */
    font-family:Boldonse;
}
.title-cont{
    display:flex;
    justify-content:center;
    align-items:center;
}
.title{
    width:min-content;
    font-size:80px;
    border-left:solid 4px currentColor;
    padding-left:100px;
}
.info-cont{
    display:flex;
    justify-content:center;
    align-items:center;
}
.info{
    font-size:70px;
    /* width:100%; */
}
:deep(.text-scroller-cont){
    width:300px;
}

.glow{
    pointer-events:none;
    position:absolute;
    right:-70px;
    top:-150px;
    background:radial-gradient(red 0%, transparent 70%);
    opacity:0.1;
    width:700px;
    height:700px;
    mix-blend-mode:difference;
}
.glow2{
    left:-250px;
    top:300px;
}

</style>