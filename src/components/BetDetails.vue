<script setup lang="ts">
import { useSearchResultsStore } from '@/stores/search_results';
import { serverUrl, stringMatch, tmpBet, type Game, type GameDetails, type GameSimple, type Player, type PlayerDetails, type PlayerStat, type Team, type TeamDetails } from '@/util';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import Error from './Error.vue';
import { useRoute } from 'vue-router';
import Loading from './Loading.vue';
import RadioSwitcher from './RadioSwitcher.vue';

const route = useRoute();

// const error = useTemplateRef("error");

let bet = tmpBet;

let query = ref("");

const details = ref({game:{},playerStats:[] as PlayerStat[]} as GameDetails);

async function getDetails(){
    let url = new URL(serverUrl+"/games/"+bet.value.gameId);

    // error.value?.clear();
    details.value.playerStats = null;

    let res = await fetch(url,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as GameDetails;
        // console.log("game details",props.gameId,data);

        details.value.game = data.game;
        details.value.playerStats = data.playerStats;

        // filterPlayerStats();
    }
    else{
        alert("Failed to get game details with code: "+res.status+` (${res.statusText})`);
    }
}

onMounted(()=>{
    getDetails();
});

</script>

<template>
    <div class="details game-details">
        <Error ref="error"></Error>
        <div v-if="details.game" class="team-details-info">
            <div class="flx-c sb">
                <h3 class="l-name">{{ details.game.home_team }} <br><span style="font-style:normal;color:var(--clr-primary-400)">versus</span><br> {{ details.game.visitor_team }}</h3>
            </div>
            <div class="flx-c sb" style="margin-block:var(--size-200)">
                <label style="margin:0px">Game Date</label>
                <div v-if="details.game.date">{{ new Date(details.game.date).toLocaleString([],{dateStyle:"medium"}) }}</div>
            </div>

            <div class="info-cont">
                <div>
                    <div class="flx-c gap4">
                        <label>Home Team</label>
                        <div>{{ details.game.home_team }}</div>
                        <!-- <span class="score win" v-if="details.game.home_team_score > details.game.visitor_team_score">Winner</span> -->
                    </div>
                    <div class="flx-c gap4">
                        <label>Score</label>
                        <div>{{ details.game.home_team_score }}</div>
                    </div>
                </div>
                <div>
                    <div class="flx-c gap4">
                        <label>Visitor Team</label>
                        <div>{{ details.game.visitor_team }}</div>
                    </div>
                    <div class="flx-c gap4">
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
                    <div>{{ details.game.status }}</div>
                </div>
            </div>
            <hr><br>

            <div class="col2 fw">
                <div>
                    <label for="">Placed at</label>
                    <h4>{{ new Date(bet.createdAt).toLocaleString([],{dateStyle:"medium"}) }}</h4>
                </div>
                <div style="text-align:right;">
                    <label for="">Updated at</label>
                    <h4>{{ new Date(bet.updatedAt).toLocaleString([],{dateStyle:"medium"}) }}</h4>
                </div>
            </div>

            <label for="">Results</label>
            <div v-show="details.playerStats">
                <div>
                    <h4 v-if="bet.status != 'completed'">The results are not in yet.</h4>
                    <table v-else class="tab">
                        <tr>
                            <th>Stat</th>
                            <th>Your Guess</th>
                            <th>Actual</th>
                        </tr>
                        <tr>
                            <th>Points</th>
                            <td>{{ bet.predictions.points }}</td>
                            <td>{{ bet.actualStats.points }}</td>
                        </tr>
                        <tr>
                            <th>Assists</th>
                            <td>{{ bet.predictions.assists }}</td>
                            <td>{{ bet.actualStats.assists }}</td>
                        </tr>
                        <tr>
                            <th>Rebounds</th>
                            <td>{{ bet.predictions.rebounds }}</td>
                            <td>{{ bet.actualStats.rebounds }}</td>
                        </tr>
                        <tr>
                            <th>Threes</th>
                            <td>{{ bet.predictions.threes }}</td>
                            <td>{{ bet.actualStats.threes }}</td>
                        </tr>
                        <tr>
                            <th>Steals</th>
                            <td>{{ bet.predictions.steals }}</td>
                            <td>{{ bet.actualStats.steals }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <br>
            <h4 v-if="bet.score != null" class="l-name">Your final score: <span style="margin-left:var(--size-300)">{{ bet.score }}</span></h4>

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