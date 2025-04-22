<script setup lang="ts">
import type { Player, Team } from '@/util';
import TeamDetails from './TeamDetails.vue';
import PlayerDetails from './PlayerDetails.vue';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
    team?:Team;
    player?:Player;
    loading?:boolean;
}>();

</script>

<template>
    <div>
        <TeamDetails v-if="props.team" :team-id="props.team.id.toString()" :team="props.team"></TeamDetails>
        <PlayerDetails v-if="props.player" :player-id="props.player.id.toString()" :player="props.player"></PlayerDetails>
    </div>
</template>

<style scoped>
</style>