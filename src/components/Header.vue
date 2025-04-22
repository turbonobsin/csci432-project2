<script setup lang="ts">
import ProfileIcon from './ProfileIcon.vue';

</script>

<template>
    <div class="header-cont">
        <header class="flex ac">
            <RouterLink to="/" class="flx-c gap4">
                <!-- icon -->
                <!-- <img class="logo-img" src="../assets/nba-logo.svg" alt="NBA Logo"> -->
                <div class="material-icons logo">sports_basketball</div>
                <div class="l-name">NBA Stats</div>
            </RouterLink>
            <slot class="nav"></slot>
            <ProfileIcon></ProfileIcon>
        </header>
    </div>
</template>

<style scoped>

.l-name{
    font-size:14px;
    text-transform:uppercase;
    font-family:Boldonse;
}
.logo-img{
    /* width:40px; */
    /* height:100px; */
    /* margin-top:40px; */
    height:60px;
}
.logo{
    font-size:30px;
    user-select:none;
    -webkit-user-select:none;
    transition:all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.logo:hover{
    rotate:180deg;
}

:slotted(nav){
    margin-left:auto;
    margin-right:var(--size-400);
    display:flex;
    align-items:center;
    gap:var(--size-500);
    padding:var(--size-400);
}
:slotted(nav) > *{
    margin:0px var(--size-100);
}

header{
    max-width:var(--page-max-width);
    margin:0px auto;
    height:var(--header-height);
    padding:0px var(--size-500);
}
.header-cont{
    /* background-color:whitesmoke; */
}

:deep(a.router-link-active){
    /* color:var(--clr-neutral-700); */
    /* border-bottom:solid 3px currentColor */
    border-bottom:solid 3px var(--clr-neutral-300);
    line-height:1.8;
}

</style>