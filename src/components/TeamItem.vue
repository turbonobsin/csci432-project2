<script setup lang="ts">
import type { Team } from '@/util';
import { ref } from 'vue';
import SearchItem from './SearchItem.vue';
import { useRouter } from 'vue-router';
import Loading from './Loading.vue';
import LoadingHorz from './LoadingHorz.vue';

const router = useRouter();

const props = defineProps<{
    team?:Team;
    onclick?:()=>void;
}>();

function load(){
    if(props.onclick){
        props.onclick();
        return;
    }
    if(props.team) router.push({path:"/main/team/"+props.team.id});
}

let icons = ref({
    "east":"arrow_right",
    "west":"arrow_left"
} as Record<string,string>);

</script>

<template>
    <SearchItem title="Team" color="gold" @click="load">
        <div class="flx-c sb">
            <h3 v-if="team" class="l-name">{{ team?.full_name ?? "" }}</h3>
            <div>{{ team?.division ?? "" }}</div>
        </div>
        <LoadingHorz v-if="!team" :loading="true"></LoadingHorz>
        <!-- <LoadingHorz v-if="true" :loading="true"></LoadingHorz> -->
        <div class="flx-c sb">
            <div>{{ team?.abbreviation ?? "" }}</div>
            <!-- <div class="flx-c">{{ team.conference }} <span class="icon">{{ team.conference.toLowerCase() }}</span></div> -->
            <div class="flx-c">{{ team?.conference ?? "" }} <span class="icon" v-if="team">{{ icons[team.conference.toLowerCase()] }}</span></div>
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