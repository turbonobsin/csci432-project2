<script setup lang="ts">
</script>

<template>
    <div class="header-cont">
        <header class="flex ac">
            <div>
                <!-- icon -->
                <img class="logo" src="../assets/nba-logo.svg" alt="NBA Logo">
            </div>
            <nav>
                <RouterLink class="button" to="">Link 1</RouterLink>
                <RouterLink to="">Link 2</RouterLink>
                <RouterLink to="">Link 3</RouterLink>
            </nav>
            <div>
                <!-- profile -->
                <div class="profile-icon"></div>
            </div>
        </header>
    </div>
</template>

<style scoped>

.logo{
    /* width:40px; */
    /* height:100px; */
    /* margin-top:40px; */
    height:60px;
}

.profile-icon{
    width:40px;
    height:40px;
    background-color:gainsboro;
    border-radius:50%;
}

nav{
    margin-left:auto;
    margin-right:var(--size-400);
    display:flex;
    align-items:center;
    gap:var(--size-500);
    padding:var(--size-400);
}
nav > *{
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

</style>