<script setup lang="ts">
import type { Team } from '@/util';
import { ref } from 'vue';
import SearchItem from './SearchItem.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    team:Team;
}>();

function load(){
    router.push({path:"/main/team/"+props.team.id});
}

let icons = ref({
    "east":"arrow_right",
    "west":"arrow_left"
} as Record<string,string>);

</script>

<template>
    <SearchItem title="Team" color="gold" @click="load">
        <div class="flx-c sb">
            <h3 class="l-name">{{ team.full_name }}</h3>
            <div>{{ team.division }}</div>
        </div>
        <div class="flx-c sb">
            <div>{{ team.abbreviation }}</div>
            <!-- <div class="flx-c">{{ team.conference }} <span class="icon">{{ team.conference.toLowerCase() }}</span></div> -->
            <div class="flx-c">{{ team.conference }} <span class="icon">{{ icons[team.conference.toLowerCase()] }}</span></div>
        </div>
    </SearchItem>
</template>

<style scoped>

:deep(.l-name){
    /* font-size:20px; */
    font-size:16px;
    text-transform:uppercase;
    font-family:Boldonse;
}

</style>