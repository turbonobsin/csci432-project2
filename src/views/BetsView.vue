<script setup lang="ts">
import BetItem from '@/components/BetItem.vue';
import Header from '@/components/Header.vue';
import Loading from '@/components/Loading.vue';
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { curBetGame, curBetLoading, curBetPlayer, serverUrl, type Bet, type GameDetails, type GameSimple, type Player, type PlayerDetails } from '@/util';
import { onMounted, ref } from 'vue';

const user = useUserStore();
const loading = ref(true);
const bets = ref([] as Bet[]);
const pendingBets = ref([] as Bet[]);
const completedBets = ref([] as Bet[]);
const curPage = ref(0);
const query = ref("");
const perPage = 50;
const sortedBets = ref([] as Bet[]);
const averageScore = ref("-");
const bestScore = ref("-");
const worstScore = ref("-");

function nextPage(){

}
function previousPage(){

}

async function eraseItems(){
    pendingBets.value = [];
    completedBets.value = [];
}

const playersLoaded = new Map<number,boolean>();
const gamesLoaded = new Map<number,boolean>();
const playerDetails = ref(new Map<number,Player>());
const gameDetails = ref(new Map<number,GameSimple>());

async function getGameDetails(bet:Bet){
	let existing = gameDetails.value.get(bet.gameId);
	if(existing){
		console.log("game was already loaded",existing);
		curBetGame.value = existing;
		await getPlayerDetails(bet.playerId);
		return;
	}
	if(gamesLoaded.has(bet.gameId)) return;
	gamesLoaded.set(bet.gameId,true);
    let url = new URL(serverUrl+"/games/"+bet.gameId);

    // error.value?.clear();
    gameDetails.value.delete(bet.gameId);

    let res = await fetch(url,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as GameDetails;

        // details.value.game = data.game;
        // details.value.playerStats = data.playerStats;
		console.log("game details",data.game);
		gameDetails.value.set(bet.gameId,data.game);
		if(curBetLoading.value) curBetGame.value = data.game;

        // filterPlayerStats();
        await getPlayerDetails(bet.playerId);
    }
    else{
        console.warn("Failed to get game details with code: "+res.status+` (${res.statusText})`);
    }
}

async function getPlayerDetails(playerId:number){
	let existing = playerDetails.value.get(playerId);
	if(existing){
		console.log("player was already loaded",existing);
		curBetPlayer.value = existing;
		return;
	}
	if(playersLoaded.has(playerId)) return;
	playersLoaded.set(playerId,true);
    let url = new URL(serverUrl+"/players/"+playerId);

    let res = await fetch(url,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as PlayerDetails;
        console.log("player details",playerId,data);
		if(curBetLoading.value) curBetPlayer.value = data.player.data;

        playerDetails.value.set(playerId,data.player.data);
    }
    else{
        console.warn("Failed to get player details with code: "+res.status+` (${res.statusText})`);
    }
}

async function runSearch(){
	if(!user.token) return;

	await eraseItems();

	loading.value = true;
	
	let url = new URL(serverUrl+"/bets");
	url.searchParams.set("limit",perPage.toString());
	url.searchParams.set("offset",(curPage.value*perPage).toString());
	
	let res = await fetch(url.href,{
		method:"GET",
        headers:{
            Authorization:`Bearer ${user.token}`
        }
	});

	if(res.ok){
		let data = await res.json() as Bet[];
		
        bets.value = data;
		completedBets.value = data.filter(v=>v.status != "pending");
		pendingBets.value = data.filter(v=>v.status == "pending");
        sortedBets.value = data.filter(v=>v.score != null).sort((a,b)=>a.score-b.score);
		console.log("bet data:",data);
	}
	else{
		alert("Failed to get list of teams with code: "+res.status+` (${res.statusText})`);
		console.error("Failed to get list of teams with code: "+res.status+` (${res.statusText})`);
		console.log(await res.text());
	}

	// let time = performance.now()-startTime;
	// // let minTime = 1500;
	// let minTime = 500;
	// if(time < minTime){
	// 	await wait(minTime-time);
	// }

	loading.value = false;

	for(const t of document.querySelectorAll(".result-cont .hidden")){
		t.classList.remove("hidden");
	}
}

onMounted(async ()=>{
    await runSearch();

    let avgTotal = 0;
	let total = 0;
    for(let i = 0; i < bets.value.length; i++){
        let b = bets.value[i];
		if(b.score == null) continue;
        avgTotal += b.score;
		total++;
    }
    averageScore.value = (avgTotal/total).toFixed(1).toString();
    
    let best = 999999;
    for(let i = 0; i < bets.value.length; i++){
        let b = bets.value[i];
		if(b.score == null) continue;
        if(b.score < best) best = b.score;
    }
    bestScore.value = best.toFixed(1).toString();

    let worst = -1;
    for(let i = 0; i < bets.value.length; i++){
        let b = bets.value[i];
		if(b.score == null) continue;
        if(b.score > worst) worst = b.score;
    }
    worstScore.value = worst.toFixed(1).toString();

	// 
	for(const b of bets.value){
		getGameDetails(b);
	}
});

async function fetchBet(bet:Bet){
	if(curBetLoading.value) return; // cancel new load when one is already loading?

	curBetPlayer.value = undefined;
	curBetGame.value = undefined;
	
	curBetLoading.value = true;
	await getGameDetails(bet);
	curBetLoading.value = false;
}

</script>

<template>
    <Header>
		<nav>
			<RouterLink to="/main">Search</RouterLink>
			<RouterLink to="/favorites">Favorites</RouterLink>
			<RouterLink to="/bets">Your Bets</RouterLink>
		</nav>
	</Header>
	<main id="main">
		<div class="search-cont">
			<div class="filter-cont">
				<!-- <h3>Filters</h3>
				<br>
				<hr>
				<br>
				<div class="search-cont2">
					<input type="text" name="" class="i-query" @keydown="runSearch" placeholder="Filter..." v-model="query">
					<div class="icon click-icon" @click="runSearch">search</div>
				</div>
				<br> -->
				<!-- <div v-show="searchType?.i == 0" class="flx-c sb">
					<label for="">Conference</label>
					<RadioSwitcher ref="conference-type" class="conference-type neutral-style" name="conference-type" :i="0" :options="['Either','East','West']"></RadioSwitcher>
				</div> -->

				<h3>Scoreboard</h3>
				<br>
                <!-- <br><br><br> -->
                <!-- <h3>Scoreboard</h3> -->
                <table class="tab">
                    <tr>
                        <th>Rank</th>
                        <th>Score</th>
                        <th>Goto</th>
                    </tr>
                    <tr v-for="(bet,i) in sortedBets">
                        <td>{{ i+1 }}</td>
                        <td>{{ bet.score }}</td>
                        <td>
                            <div class="flx-c" style="justify-content:center">
                                <RouterLink class="btn2 accent3" style="text-align:center;" :to="`/main/game/${bet.gameId}`">Goto Game</RouterLink>
                            </div>
                        </td>
                    </tr>
                </table>
                <br><br>
                <table class="tab">
                    <tr>
                        <th class="table2-th">Average</th>
                        <td>{{ averageScore }}</td>
                    </tr>
                    <tr>
                        <th class="table2-th">Best</th>
                        <td>{{ bestScore }}</td>
                    </tr>
                    <tr>
                        <th class="table2-th">Worst</th>
                        <td>{{ worstScore }}</td>
                    </tr>
                </table>
			</div>
			<div class="result-cont">
				<div class="flx-c sb" v-if="completedBets.length != 0">
					<h3>Completed <span>({{ completedBets.length }})</span></h3>
					<div class="nav-controls flx-c" style="gap:20px">
						<!-- <label class="label">Page</label> -->
						<!-- <div>{{ curPage+1 }}</div> -->
						<!-- <div class="icon click-icon" @click="previousPage">chevron_left</div> -->
						<!-- <div class="icon click-icon" @click="nextPage">chevron_right</div> -->
					</div>
				</div>
				<BetItem v-for="bet in completedBets" :bet="bet" @click="fetchBet(bet)" :game="gameDetails.get(bet.gameId)" :player="playerDetails.get(bet.playerId)"></BetItem>
				<div class="flx-c sb" v-if="pendingBets.length != 0">
					<h3>Pending <span>({{ pendingBets.length }})</span></h3>
					<div class="nav-controls flx-c" style="gap:20px">
						<!-- <label class="label">Page</label> -->
						<!-- <div>{{ curPage+1 }}</div> -->
						<!-- <div class="icon click-icon" @click="previousPage">chevron_left</div> -->
						<!-- <div class="icon click-icon" @click="nextPage">chevron_right</div> -->
					</div>
				</div>
				<BetItem v-for="bet in pendingBets" :bet="bet" @click="fetchBet(bet)" :game="gameDetails.get(bet.gameId)" :player="playerDetails.get(bet.playerId)"></BetItem>
				<Loading :loading="loading"></Loading>

				<!-- <div v-if="amt == 0 && !loading"> -->
				<h4 class="no-results" :show="bets.length == 0 && !loading">No results.</h4>
				<!-- </div> -->
			</div>
			<div class="detail-cont">
				<h3>Details</h3>
				<RouterView name="details"></RouterView>
			</div>
		</div>
    </main>
</template>

<style scoped>

.table2-th{
    width:100px;
}
.table2-th + td{
    text-align:right;
}

.no-results{
	margin-top:var(--size-400);
	opacity:0;
	/* transition-delay:0.5s; */
	/* transition:opacity 0.5s ease-out; */
	/* display:none; */
}
.no-results[show=true]{
	/* opacity:1; */
	animation-delay:0.5s;
	animation:ShowNoResults 0.5s forwards ease-out;
	/* display:block; */
}
@keyframes ShowNoResults{
	0%{
		opacity:0;
	}
	100%{
		opacity:1;
	}
}

.radio-switch-cont{
	/* margin-top:var(--size-200); */
	/* margin-bottom:var(--size-400); */
	width:100%;
	margin-left:var(--size-400);
}

h3{
	margin-block:var(--size-400);
}

.search-cont2{
	display:flex;
	align-items:center;
	/* width:100%; */
	gap:var(--size-200);
	/* grid-template-columns:1fr 40px; */
}
.i-query{
	width:300px;
	border-radius:50px;
}

:deep(header){
	background-color:var(--clr-neutral-100);
	/* border-bottom:solid 1px var(--clr-neutral-300); */
}
.header{
	background-color:var(--clr-neutral-100);
	margin:var(--size-300);
	/* position:sticky; */
	/* top:0px; */
	/* z-index:1; */
	/* padding-top:30px; */
}
#main{
	display:grid;
	grid-template-rows:50px 1fr;
	height:calc(100vh - 75px);
	/* position:absolute; */
	/* left:0px; */
	/* width:100vw; */
}
.search-cont{
	display:grid;
	grid-template-columns:300px 1fr 400px;
	position:relative;
	/* width:100vw; */
	/* gap:var(--size-300); */
	gap:var(--size-500);
}
.filter-cont{
	/* background-color:var(--clr-neutral-200); */
	position:sticky;
	top:0px;
	left:var(--size-400);
	/* border:solid 1px var(--clr-neutral-300); */
	height:calc(100vh - 150px);
	border-radius:var(--size-100);
	padding:var(--size-400);
}
.result-cont{
	padding:var(--size-400);
	/* background-color:var(--clr-neutral-200); */
	/* background-color:var(--clr-neutral-50); */
	/* border-top:solid 1px var(--clr-neutral-300); */
}
.detail-cont{
	/* border-left:solid 1px var(--clr-neutral-300); */
	/* border:solid 1px var(--clr-neutral-300); */
	/* background-color:var(--clr-neutral-100); */
	/* background-color:var(--clr-neutral-200); */
	/* position:sticky; */
	/* top:0px; */
	right:var(--size-400);
	padding:var(--size-400);
	height:calc(100vh - 150px);
	border-radius:var(--size-100);

	/* overflow-y:auto; */
    /* overflow-x:hidden; */
}
.detail-cont:not(:has(.game-details)){
	position:sticky;
	top:0px;
}

.player-item{
	border:solid 1px var(--clr-neutral-300);
	padding:var(--size-200) var(--size-400);
	border-radius:50px;
	margin-block:var(--size-200);
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

</style>