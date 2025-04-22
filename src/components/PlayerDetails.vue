<script setup lang="ts">
import { useSearchResultsStore } from '@/stores/search_results';
import { favoritePlayer, getFavoritePlayers, removeFavoritePlayer, serverUrl, type Player, type PlayerDetails, type PlayerDetailsStat, type PlayerStat, type Team, type TeamDetails } from '@/util';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import Error from './Error.vue';
import { useRoute } from 'vue-router';
import Loading from './Loading.vue';

const route = useRoute();

const props = defineProps<{
    playerId:string;
    player?:Player;
}>();
const search_res = useSearchResultsStore();
const error = useTemplateRef("error");
const isFavorited = ref(false);
const newFavoriteChange = ref(false);

const year = ref(undefined as string|undefined);

const details = ref({player:props.player?{data:props.player}:{},stats:{}} as PlayerDetails);
const stats_list = ref([] as PlayerDetailsStat[]);

const loading = ref(false);

async function getDetails(season?:string){
    if(!season) loading.value = true;
    console.error("GETTING SEASON: ",season);

    let list:string[] = [];
    if(year.value){
        let listStr = year.value.toString();
        listStr = listStr.replace(/\s?[\,\s]\s?/g,",");
        list = listStr.split(",");
    }
    
    let url = new URL(serverUrl+"/players/"+props.playerId);
    if(year.value && (list.length > 0 || season)){
        console.log("list length",list.length);
        if(list.length == 1) url.searchParams.set("season",year.value);
        else if(season) url.searchParams.set("season",season);
    }
    if(!season) stats_list.value = [];

    if(!season) if(list.length > 1){
        // list.forEach(v=>url.searchParams.append("seasons[]",v)); // not sure how to get multiple to work with the endpoint yet (idk what format it's supposed to be) // fixed :D
        list.forEach(v=>getDetails(v));
    }

    if(!season){
        error.value?.clear();
        details.value.stats.data = undefined!;
    }

    let res = await fetch(url,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as PlayerDetails;
        console.log("player details",props.playerId,data);

        details.value.player = data.player;
        for(const n of data.stats.data){
            if(stats_list.value.some(v=>v.season == n.season)) continue;
            if(year.value) if(!list.includes(n.season.toString())) continue;
            stats_list.value.push(n);
        }
    } // 2025,2024,2023,1995,2005,2021
    else{
        error.value?.alert("Failed to get player details with code: "+res.status+` (${res.statusText})`);
    }
    if(!season) loading.value = false;
}

async function load(){
    let existing = search_res.players.find(v=>v.id == parseInt(props.playerId!)) as Player;
    if(existing) details.value.player.data = existing;

    console.log("load");

    getDetails();

    isFavorited.value = false;
    newFavoriteChange.value = false; // not as fun but...
    let fav = await getFavoritePlayers((res,text)=>{
        error.value?.alert(text);
    });
    if(fav) if(fav.includes(parseInt(props.playerId!))){
        isFavorited.value = true;
    }
}
onMounted(()=>{
    load();
});
watch(route,()=>{
    if(props.player) details.value.player.data = props.player;
    load();
});

async function toggleFavorite(){
    if(isFavorited.value){
        let res = await removeFavoritePlayer(parseInt(props.playerId!),(res,text)=>{
            error.value?.alert(text,2000);
        });
        if(res){
            isFavorited.value = false;
            newFavoriteChange.value = true;
        }
    }
    else{
        let res = await favoritePlayer(parseInt(props.playerId!),(res,text)=>{
            error.value?.alert(text,2000);
        });
        if(res){
            isFavorited.value = true;
            newFavoriteChange.value = true;
        }
    }
}

async function getStats(e:KeyboardEvent){
    if(e.key.toLowerCase() != "enter") return;
    getDetails();
}

</script>

<template>
    <div class="details">
        <Error ref="error"></Error>
        <div v-if="details.player.data" class="team-details-info">
            <div class="flx-c gap4">
                <h3 class="l-name">{{ details.player.data.first_name+" "+details.player.data.last_name }}</h3>
                <h3 class="l-name">
                    #{{ details.player.data.jersey_number }}
                </h3>
                <div class="icon click-icon margin-left-auto" :favorite="isFavorited" :new-change="newFavoriteChange" @click="toggleFavorite">favorite</div>
            </div>
            <div class="flx-c gap4">
                <label>Team</label>
                <div>{{ details.player.data.team.full_name }}</div>
            </div>

            <RouterLink class="icon-btn accent3" :to="`/byplayer/${props.playerId}/${details.player.data.first_name+' '+details.player.data.last_name}`">
                <div class="icon">sports_esports</div>
                <div style="font-weight:bold">Their Games</div>
            </RouterLink>

            <div class="info-cont">
                <div class="col2">
                    <div class="flx-c gap4">
                        <label>Country</label>
                        <div>{{ details.player.data.country }}</div>
                    </div>
                    <div class="flx-c gap4">
                        <label>College</label>
                        <div>{{ details.player.data.college }}</div>
                    </div>
                </div>
                <div class="col2">
                    <div class="flx-c gap4">
                        <label>Height</label>
                        <div>{{ details.player.data.height }}</div>
                    </div>
                    <div class="flx-c gap4">
                        <label>Weight</label>
                        <div>{{ details.player.data.weight }}</div>
                    </div>
                </div>
                <div class="col2">
                    <div class="flx-c gap4">
                        <label>Position</label>
                        <div>{{ details.player.data.position }}</div>
                    </div>
                    <div class="flx-c gap4">
                        <label>Jersy #</label>
                        <div>{{ details.player.data.jersey_number }}</div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="flx-c gap4 draft-cont">
                <label>Draft #</label>
                <div>{{ details.player.data.draft_number }}</div>
                <label>Round</label>
                <div>{{ details.player.data.draft_round }}</div>
                <label>Year</label>
                <div>{{ details.player.data.draft_year }}</div>
            </div>

            <hr>

            <div class="col2" style="align-items:center;">
                <h3>Stats</h3>
                <div>
                    <label style="text-align:right;float:right" for="">Season</label>
                    <br>
                    <input type="text" v-model="year" placeholder="2025, 2024, 2023, ..." @keydown="getStats" style="border-radius:50px">
                </div>
            </div>
            <!-- <div v-if="details.stats.data" v-for=""> -->
            <div style="max-height:calc(100vh - 520px);overflow-y:auto;overflow-x:hidden">
                <!-- <h4 v-if="details.stats.data.length == 0">No stats available.</h4> -->
                <h4 v-if="stats_list.length == 0 && !loading">No stats available.</h4>
                <div v-for="stat in stats_list">
                    <!-- <table class="tab" v-for="stat2 in details.stats.data"> -->
                    <table class="tab">
                        <tr>
                            <th>Stat</th>
                            <th style="width:120px">Value</th>
                        </tr>
                        <tr>
                            <td>
                                <div>Season</div>
                            </td>
                            <td>{{ stat.season }}</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Games Played</div>
                            </td>
                            <td>{{ stat.games_played }}</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Points</div>
                                <!-- <label>The total number of points a player scores.</label> -->
                            </td>
                            <td>{{ stat.pts }}</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Assists</div>
                                <!-- <label>The number of times a player passes the ball leading directly to a made basket.</label> -->
                            </td>
                            <td>{{ stat.ast }}</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Rebounds</div>
                                <!-- <label>The total number of times a player retrieves the ball after a missed shot.</label> -->
                            </td>
                            <td>{{ stat.reb }}</td>
                        </tr>
                        <tr>
                            <td>Offensive Rebounds</td>
                            <td>{{ stat.oreb }}</td>
                        </tr>
                        <tr>
                            <td>Defensive Rebounds</td>
                            <td>{{ stat.dreb }}</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Steals</div>
                                <!-- <label>The number of times a player takes the ball away from an opponent.</label> -->
                            </td>
                            <td>{{ stat.stl }}</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Blocks</div>
                                <!-- <label>The number of times a player prevents a shot from going in.</label> -->
                            </td>
                            <td>{{ stat.blk }}</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Field Goal Percentage</div>
                            </td>
                            <td>{{ (stat.fg_pct*100).toFixed(1) }}%</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Three-Point Percentage</div>
                            </td>
                            <td>{{ (stat.fg3_pct*100).toFixed(1) }}%</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Free Throw Percentage</div>
                            </td>
                            <td>{{ (stat.ft_pct*100).toFixed(1) }}%</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Turnovers</div>
                                <!-- <label>The number of times a player loses possession of the ball.</label> -->
                            </td>
                            <td>{{ stat.turnover }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <Loading :loading="loading"></Loading>
            <!-- <Loading :loading="!details.stats.data"></Loading> -->
            <!-- <div v-else> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<style scoped>

.draft-cont{
    display:grid;
    grid-template-columns:30px 1fr 30px 1fr 30px 1fr;
}

label{
    width:60px;
}

.tab{
    border-collapse:collapse;
    width:100%;
}
.tab th{
    background-color:var(--clr-neutral-900);
    color:var(--clr-neutral-100);
}
.tab td,
.tab th{
    border:solid 1px var(--clr-neutral-300);
    padding:var(--size-100);
    font-size:14px;
}
.tab tr:nth-child(odd){
    background-color:var(--clr-neutral-200);
}

.l-name{
    /* font-size:20px; */
    font-size:16px;
    text-transform:uppercase;
    font-family:Boldonse;
}

div.details{
    /* padding:var(--size-400); */
    margin-top:var(--size-600);
}

.team-details-info{
    display:flex;
    flex-direction:column;
    gap:var(--size-400);
}

</style>