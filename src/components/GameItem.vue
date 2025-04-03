<script setup lang="ts">
import { ref } from 'vue';
import SearchItem from './SearchItem.vue';
import type { Game } from '@/util';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    game:Game;
}>();

function load(){
    router.push({path:"/main/game/"+props.game.id});
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