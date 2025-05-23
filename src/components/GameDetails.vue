<script setup lang="ts">
import { useSearchResultsStore } from '@/stores/search_results';
import { serverUrl, stringMatch, type Game, type GameDetails, type GameSimple, type Player, type PlayerDetails, type PlayerStat, type Team, type TeamDetails } from '@/util';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import Error from './Error.vue';
import { useRoute } from 'vue-router';
import Loading from './Loading.vue';
import RadioSwitcher from './RadioSwitcher.vue';

const route = useRoute();

const props = defineProps({
    gameId:{
        type:String,
        required:false
    },
    playerId:{
        type:String,
        required:false
    },
    playerName:{
        type:String,
        required:false,
    }
});
const search_res = useSearchResultsStore();
const error = useTemplateRef("error");

const details = ref({game:{},playerStats:[] as PlayerStat[]} as GameDetails);

async function getDetails(){
    let url = new URL(serverUrl+"/games/"+props.gameId);
    // url.searchParams.set("season");

    error.value?.clear();
    details.value.playerStats = null;

    let res = await fetch(url,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as GameDetails;
        console.log("game details",props.gameId,data);

        details.value.game = data.game;
        details.value.playerStats = data.playerStats;

        if(query.value != "" && props.playerId != null){
            let p = data.playerStats?.find(v=>v.player_name == props.playerName); // can't use id bc the player id on playerStats isn't correct
            if(p){
                playerTeamType.value!.i = (p.team == data.game.home_team ? 0 : 1);
            }
        }
        filterPlayerStats();
    }
    else{
        error.value?.alert("Failed to get game details with code: "+res.status+` (${res.statusText})`);
    }
}

function load(){
    // let existing = search_res.games.find(v=>v.id == parseInt(props.gameId)) as Game;
    // if(existing) details.value.game = existing;

    console.log("load");

    if(props.playerId != null){
        query.value = props.playerName ?? "";
    }

    getDetails();
}

const playerTeamType = useTemplateRef("player-team-type");

onMounted(()=>{
    load();

    playerTeamType.value?.onInput((i)=>{
        filterPlayerStats();
    });
});
watch(route,()=>{
    details.value = {game:{},playerStats:[] as PlayerStat[]} as GameDetails;
    load();
});

let query = ref("");
// const i_query = useTemplateRef("i-query");
let result = ref([] as PlayerStat[]);
function filterPlayerStats(){
    if(!playerTeamType.value){
        result.value = (details.value.playerStats ?? []) as PlayerStat[];
        return;
    }
    console.log(playerTeamType.value!.i,details.value.game.home_team,details.value.game.visitor_team);
    result.value = (details.value.playerStats ?? []).filter(v=>stringMatch(v.player_name,query.value) && v.team == [details.value.game.home_team,details.value.game.visitor_team][playerTeamType.value!.i]).sort((a,b)=>a.player_name.localeCompare(b.player_name)) as PlayerStat[];
}

</script>

<template>
    <div class="details game-details">
        <Error ref="error"></Error>
        <div v-if="details.game" class="team-details-info">
            <div class="flx-c sb">
                <h3 class="l-name">{{ details.game.home_team ?? "..." }} <br><span style="font-style:normal;color:var(--clr-primary-400)">versus</span><br> {{ details.game.visitor_team ?? "..." }}</h3>
            </div>
            <div class="flx-c sb" style="margin-block:var(--size-200)">
                <div v-if="details.playerStats">
                    <span v-if="details.game.status == 'Final'">
                        <span class="score" :win="details.game.home_team_score > details.game.visitor_team_score ? 1 : details.game.home_team_score == details.game.visitor_team_score ? 2 : 0">{{ details.game.home_team_score }}</span> / <span class="score" :win="details.game.home_team_score < details.game.visitor_team_score ? 1 : details.game.home_team_score == details.game.visitor_team_score ? 2 : 0">{{ details.game.visitor_team_score }}</span>
                    </span>
                    <span v-else>
                        <span>Upcoming</span>
                    </span>
                </div>
                <div v-if="details.game.date">{{ new Date(details.game.date).toLocaleString([],{dateStyle:"medium"}) }}</div>
            </div>

            <div class="info-cont">
                <div>
                    <div class="flx-c gap4">
                        <label>Home Team</label>
                        <div>{{ details.game.home_team }}</div>
                        <!-- <span class="score win" v-if="details.game.home_team_score > details.game.visitor_team_score">Winner</span> -->
                    </div>
                    <div class="flx-c gap4" v-show="details.game.status == 'Final'">
                        <label>Score</label>
                        <div>{{ details.game.home_team_score }}</div>
                    </div>
                </div>
                <div>
                    <div class="flx-c gap4">
                        <label>Visitor Team</label>
                        <div>{{ details.game.visitor_team }}</div>
                    </div>
                    <div class="flx-c gap4" v-show="details.game.status == 'Final'">
                        <label>Score</label>
                        <div>{{ details.game.visitor_team_score }}</div>
                    </div>
                </div>
            </div>
            <hr>
            <div v-if="details.game.date">
                <div class="flx-c gap4">
                    <label>Date</label>
                    <div>{{ new Date(details.game.date).toLocaleString([],{dateStyle:"full"}) }}</div>
                </div>
                <div class="flx-c gap4">
                    <label>Status</label>
                    <div>{{ details.game.status == "Final" ? details.game.status : "Upcoming" }}</div>
                </div>
            </div>
            <hr>

            <div v-show="details.playerStats">
                <!-- 3rd check is for not betting on old games -->
                <div v-if="props.gameId && props.playerId && details.game.status != 'Final'">
                    <label for="">Place bet on</label>
                    <div class="flx-c sb">
                        <div class="l-name">{{ props.playerName }}</div>
                        <RouterLink :to="`/placebet/${props.playerId}/${props.playerName}/${props.gameId}`" class="icon-btn accent3" style="--c:mediumslateblue">
                            <div class="icon">paid</div>
                            <div style="font-weight:bold">Place Bet</div>
                        </RouterLink>
                    </div>
                    <br>
                    <br>
                </div>
                
                <div v-show="details.game.status == 'Final'">
                    <div class="search-cont2">
                        <input ref="i-query" v-on:input="filterPlayerStats" style="width:100%;border-radius:50px" type="text" name="" class="i-query" @keydown="filterPlayerStats" placeholder="Filter by player..." v-model="query">
                    </div>
                    <br>
                    <div class="flx-c gap2">
                        <label>Team</label>
                        <RadioSwitcher ref="player-team-type" style="width:100%" name="player-stat-team" :options="['Home','Visitor']"></RadioSwitcher>
                    </div>
                    <br>

                    <h4 v-if="details.playerStats?.length == 0">No stats available.</h4>
                    <div v-for="stat in result">
                        <div class="player-ops flx-c sb">
                            <h3 class="player-title">{{ stat.player_name }}</h3>
                            <!-- some colors: deeppink, mediumslateblue -->
                            <!-- <RouterLink :to="`/placebet/${props.playerId}/${props.playerName}/${props.gameId}`" v-if="props.gameId && props.playerId && props.playerName?.toLowerCase().replace(/\s/g,'') == stat.player_name.toLowerCase().replace(/\s/g,'')" class="icon-btn accent3" style="--c:mediumslateblue">
                                <div class="icon">paid</div>
                                <div style="font-weight:bold">Place Bet</div>
                            </RouterLink> -->
                            <!-- <RouterLink v-else class="btn accent2 icon-btn" :to="`/byplayer/${stat.player_id}/${stat.player_name}/${props.gameId}`">
                                <span class="icon">link</span>
                                Games
                            </RouterLink> -->
                            <!-- <RouterLink v-else class="icon-btn accent3" :to="`/byplayer/${stat.player_id}/${stat.player_name}/${props.gameId}`">
                                <div class="icon">sports_esports</div>
                                <div style="font-weight:bold">Their Games</div>
                            </RouterLink> -->
                        </div>
                        <table class="tab">
                            <tr>
                                <th>Stat</th>
                                <th style="width:120px">Value</th>
                            </tr>
                            <tr>
                                <td>
                                    <div>Name</div>
                                </td>
                                <td>{{ stat.player_name }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Team</div>
                                </td>
                                <td>{{ stat.team }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Points</div>
                                </td>
                                <td>{{ stat.points }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Assists</div>
                                </td>
                                <td>{{ stat.assists }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Rebounds</div>
                                </td>
                                <td>{{ stat.rebounds }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Steals</div>
                                </td>
                                <td>{{ stat.steals }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Blocks</div>
                                </td>
                                <td>{{ stat.blocks }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Field Goal Percentage</div>
                                </td>
                                <td>{{ (stat.field_goal_percentage*100).toFixed(1) }}%</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Three-Point Percentage</div>
                                </td>
                                <td>{{ (stat.field_goal3_percentage*100).toFixed(1) }}%</td>
                            </tr>
                            <tr>
                                <td>
                                    <div>Free Throw Percentage</div>
                                </td>
                                <td>{{ (stat.freethrow_percentage*100).toFixed(1) }}%</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <Loading :loading="!details.playerStats"></Loading>
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
    width:100px;
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

.player-title{
    margin-block:var(--size-300);
}

.player-ops{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-block:var(--size-200);
    margin-top:var(--size-600);
}

</style>