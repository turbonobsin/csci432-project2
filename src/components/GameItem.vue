<script setup lang="ts">
import { ref } from 'vue';
import SearchItem from './SearchItem.vue';
import { Game } from '@/util';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    game:Game,
    playerId?:string,
    playerName?:string
}>();

function load(){
    console.warn("----PROPS:",props.playerId,props.playerName,props.game.id);
    if(props.playerId) router.push({path:`/byplayer/${props.playerId}/${props.playerName}/${props.game.id}`});
    else router.push({path:"/main/game/"+props.game.id});
}

</script>

<template>
    <SearchItem title="Game" color="teal" @click="load">
        <div class="flx-c sb">
            <h3 class="l-name">{{ game.home_team.full_name }} / {{ game.visitor_team.name }}</h3>
        </div>
        <div class="flx-c sb" style="margin-block:var(--size-200)">
            <div><span class="score" :win="game.home_team_score > game.visitor_team_score ? 1 : game.home_team_score == game.visitor_team_score ? 2 : 0">{{ game.home_team_score }}</span> / <span class="score" :win="game.home_team_score < game.visitor_team_score ? 1 : game.home_team_score == game.visitor_team_score ? 2 : 0">{{ game.visitor_team_score }}</span></div>
            <div>{{ new Date(game.date).toLocaleString([],{dateStyle:"medium"}) }}</div>
            <!-- <div>{{ game.season }}</div> -->
        </div>
    </SearchItem>
</template>

<style scoped>

:deep(.l-name){
    font-size:13px;
    text-transform:uppercase;
    font-family:Boldonse;
}

</style>