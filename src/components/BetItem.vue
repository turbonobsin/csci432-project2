<script setup lang="ts">
import { serverUrl, tmpBet, wait, type Bet, type GameDetails, type PlayerDetails, type PlayerStat, type Team } from '@/util';
import { onMounted, ref } from 'vue';
import SearchItem from './SearchItem.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    bet:Bet;
}>();

const details = ref({game:{},playerStats:[] as PlayerStat[]} as GameDetails);
const player = ref({} as PlayerStat);

async function getDetails(){
    let url = new URL(serverUrl+"/games/"+props.bet.gameId);

    // error.value?.clear();
    details.value.playerStats = null;

    let res = await fetch(url.href,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as GameDetails;
        console.log("game details",props.bet.gameId,data);

        details.value.game = data.game;
        details.value.playerStats = data.playerStats;
        
        player.value = details.value.playerStats?.find(v=>v.player_id == props.bet.playerId) as PlayerStat;
        console.log("stats",details.value.playerStats?.find(v=>v.player_id == props.bet.playerId),props.bet.playerId);

        // filterPlayerStats();
    }
    else{
        // error.value?.alert("Failed to get game details with code: "+res.status+` (${res.statusText})`);
        alert("Failed to get game details with code: "+res.status+` (${res.statusText})`);
        // console.warn(await res.text());
    }
}

const playerDetails = ref({player:{},stats:{}} as PlayerDetails);

async function getPlayerDetails(){
    let url = new URL(serverUrl+"/players/"+props.bet.playerId);

    // error.value?.clear();

    let res = await fetch(url.href,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as PlayerDetails;
        // console.log("player details",props.playerId,data);

        // details.value.player = data.player;
        // details.value.stats = data.stats;

        playerDetails.value = data;
    }
    else{
        // error.value?.alert("Failed to get player details with code: "+res.status+` (${res.statusText})`);
    }
}

function load(){
    tmpBet.value = props.bet;
    router.push({path:"/bets/details"});
}

// let icons = ref({
//     "east":"arrow_right",
//     "west":"arrow_left"
// } as Record<string,string>);

// onMounted(async ()=>{
//     await wait(Math.random()*200+100);
//     await getDetails();
// });

</script>

<template>
    <SearchItem title="Bet" color="mediumslateblue" @click="load" v-if="player">
        <div class="flx-c sb">
            <!-- <h3 class="l-name">{{ playerDetails.player.data.first_name+" "+playerDetails.player.data.last_name }}</h3> -->
            <div class="l-name">Score: {{ bet.score ?? "?" }}</div>
            <br><br>
            <!-- <RouterLink style="font-weight:normal;font-family:'Material Symbols Outlined';font-size:28px" class="icon click-icon" :to="`/main/game/${bet.gameId}`">sports_esports</RouterLink> -->
        </div>
        <div class="flx-c sb">
            <div style="font-weight:bold;text-transform:uppercase">{{ bet.status }}</div>
            <!-- <div class="flx-c">{{ team.conference }} <span class="icon">{{ team.conference.toLowerCase() }}</span></div> -->
            <!-- <div class="flx-c">{{ team.conference }} <span class="icon">{{ icons[team.conference.toLowerCase()] }}</span></div> -->
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