<script setup lang="ts">
import type { Player, Team } from '@/util';
import { ref } from 'vue';
import SearchItem from './SearchItem.vue';
import { useRouter } from 'vue-router';
import LoadingHorz from './LoadingHorz.vue';

const router = useRouter();

const props = defineProps<{
    player?:Player;
    onclick?:()=>void;
}>();

function load(){
    if(props.onclick){
        props.onclick();
        return;
    }
    if(props.player) router.push({path:"/main/player/"+props.player.id});
}

let icons = ref({
    "east":"arrow_right",
    "west":"arrow_left"
} as Record<string,string>);

</script>

<template>
    <SearchItem title="Player" color="var(--clr-secondary-400)" @click="load">
        <div class="flx-c sb">
            <h3 class="l-name">{{ player ? (player.first_name+" "+player.last_name) : "" }}</h3>
            <!-- <div>{{ team.division }}</div> -->
        </div>
        <LoadingHorz v-if="!player" :loading="true"></LoadingHorz>
        <div class="flx-c sb">
            <div style="opacity:0.6;font-size:14px;margin-top:4px">{{ player?.team.full_name ?? "" }}</div>
            <!-- <div class="flx-c">{{ team.conference }} <span class="icon">{{ team.conference.toLowerCase() }}</span></div> -->
            <!-- <div class="flx-c">{{ team.conference }} <span class="icon">{{ icons[team.conference.toLowerCase()] }}</span></div> -->
        </div>
    </SearchItem>
</template>

<style scoped>

:deep(.l-name){
    font-size:16px;
    text-transform:uppercase;
    font-family:Boldonse;
}

</style>