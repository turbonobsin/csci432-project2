<script setup lang="ts">
import { useSearchResultsStore } from '@/stores/search_results';
import { curBetGame, curBetLoading, curBetPlayer, serverUrl, stringMatch, tmpBet, type Bet, type Game, type GameDetails, type GameSimple, type Player, type PlayerDetails, type PlayerStat, type Team, type TeamDetails } from '@/util';
import { onMounted, ref, useTemplateRef, watch, type Ref } from 'vue';
import Error from './Error.vue';
import { useRoute } from 'vue-router';
import Loading from './Loading.vue';
import RadioSwitcher from './RadioSwitcher.vue';

// const error = useTemplateRef("error");

let bet = tmpBet;
// let playerData = ref(undefined as Player|undefined);

// const details = ref({game:{},playerStats:[] as PlayerStat[]} as GameDetails);
// function resetDetails(){
    // details.value = {game:{},playerStats:[] as PlayerStat[]} as GameDetails;
// }

// onMounted(()=>{
    // getDetails();
// });
// watch(tmpBet,()=>{
    // resetDetails();
    // playerData.value = undefined;
    // getDetails();
// });

watch(curBetGame!,(v)=>{
    console.log("game changed",v?.home_team);
});

</script>

<template>
    <div class="details bet-details">
        <Error ref="error"></Error>
        <div v-if="bet" class="team-details-info">
            <div class="flx-c sb">
                <h3 class="l-name">{{ curBetGame?.home_team ?? "..." }} <br><span style="font-style:normal;color:var(--clr-primary-400)">versus</span><br> {{ curBetGame?.visitor_team ?? "..." }}</h3>
            </div>
            <div>
                <label style="width:unset">Betting on</label>
                <h3 class="l-name" style="font-size:13px">{{ curBetPlayer ? (curBetPlayer.first_name+" "+curBetPlayer.last_name) : "..." }}</h3>
            </div>

            <div class="flx-c sb" style="margin-block:var(--size-200)">
                <label style="margin:0px">Game Date</label>
                <div v-if="curBetGame?.date">{{ new Date(curBetGame.date).toLocaleString([],{dateStyle:"medium"}) }}</div>
            </div>

            <div class="info-cont" v-if="curBetGame">
                <div>
                    <div class="flx-c gap4">
                        <label>Home Team</label>
                        <div>{{ curBetGame.home_team }}</div>
                        <!-- <span class="score win" v-if="details.game.home_team_score > details.game.visitor_team_score">Winner</span> -->
                    </div>
                    <div class="flx-c gap4" v-if="curBetGame.status == 'Final'">
                        <label>Score</label>
                        <div>{{ curBetGame.home_team_score }}</div>
                    </div>
                </div>
                <div>
                    <div class="flx-c gap4">
                        <label>Visitor Team</label>
                        <div>{{ curBetGame.visitor_team }}</div>
                    </div>
                    <div class="flx-c gap4" v-if="curBetGame.status == 'Final'">
                        <label>Score</label>
                        <div>{{ curBetGame.visitor_team_score }}</div>
                    </div>
                </div>
            </div>
            <hr>
            <div v-if="curBetGame?.date">
                <div class="flx-c gap4">
                    <label>Date</label>
                    <div>{{ new Date(curBetGame.date).toLocaleString([],{dateStyle:"full"}) }}</div>
                </div>
                <div class="flx-c gap4">
                    <label>Status</label>
                    <div>{{ curBetGame.status == "Final" ? curBetGame.status : "Upcoming" }}</div>
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
            <div v-show="curBetGame">
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

            <Loading :loading="curBetLoading"></Loading>
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