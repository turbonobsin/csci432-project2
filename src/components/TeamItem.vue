<script setup lang="ts">
import type { Team } from '@/util';

defineProps<{
    team:Team;
}>();

</script>

<template>
    <div class="team-item">
        <div class="flx-c sb">
            <h3 class="l-name">{{ team.full_name }}</h3>
            <div>{{ team.division }}</div>
        </div>
        <div class="flx-c sb">
            <div>{{ team.abbreviation }}</div>
            <div>{{ team.conference }}</div>
        </div>
    </div>
</template>

<style scoped>

.l-name{
    /* font-size:20px; */
    font-size:16px;
    text-transform:uppercase;
    font-family:Boldonse;
}

.team-item{
    /* padding:var(--size-200) var(--size-400); */
    /* border-bottom:solid 1px var(--clr-neutral-300); */
    
    margin:var(--size-400);
    padding:var(--size-400);    
    border:solid 1px var(--clr-neutral-300);
    border-radius:var(--size-200);
    background-color:var(--clr-neutral-200);
}

</style>