<script setup lang="ts">
import GameItem from '@/components/GameItem.vue';
import Header from '@/components/Header.vue';
import Loading from '@/components/Loading.vue';
import PlayerItem from '@/components/PlayerItem.vue';
import RadioSwitcher from '@/components/RadioSwitcher.vue';
import TeamItem from '@/components/TeamItem.vue';
import { useSearchResultsStore } from '@/stores/search_results';
import { useUserStore } from '@/stores/user';
import { serverUrl, wait, type SearchGamesRes, type SearchMeta, type SearchPlayerRes, type Team } from '@/util';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const user = useUserStore();
const router = useRouter();
const route = useRoute();

async function logOut(e:Event){
	e.preventDefault();

	if(!user.token) return;

	let res = await fetch(serverUrl+"/user/logout",{
		method:"POST",
		headers:{
			Authorization:`Bearer ${user.token}`
		}
	});

	if(res.ok){
		user.$reset();
		router.push({name:"home"});
	}
	else{
		alert("Failed to logout with code: "+res.status+` (${res.statusText})`);
		console.error("Failed to logout with code: "+res.status+` (${res.statusText})`);
	}
}

// let teams = ref([] as Team[]);
let search_res = useSearchResultsStore();
let query = ref("");
let loading = ref(false);
let amt = ref(0);
let activeType = ref(0);
let pages = ref([] as (number|null)[]); // list of cursors
let curCursor = ref(0 as number|null); // cursor
let curPageI = ref(0);
let curSearchMeta = null as SearchMeta|null;

const searchType = useTemplateRef("search-type");
const conferenceType = useTemplateRef("conference-type");

async function eraseItems(){
	// let speed = 5;
for(const t of document.querySelectorAll(".result-cont > *")){
		t.classList.add("hidden");
		// speed *= 0.99;
		// await wait(5);
		await wait(0);
	}
}

async function searchTeams(e?:KeyboardEvent){
	if(e) if(e.key.toLowerCase() != "enter") return;
	
	if(!user.token) return;

	onStartSearch();
	let startTime = performance.now();

	search_res.resetGames();
	search_res.resetPlayers();
	await eraseItems();
	amt.value = 0;

	loading.value = true;
	
	let url = new URL(serverUrl+"/teams");
	if(query.value) url.searchParams.set("team-search",query.value);
	let conference = [null,"east","west"][conferenceType.value?.i ?? 0];
	if(conference) url.searchParams.set("conference",conference);
	
	let res = await fetch(url.href,{
		method:"GET"
	});

	if(res.ok){
		let data = await res.json() as {
			data:Team[]
		};
		
		search_res.setTeams(data.data);
		amt.value = data.data.length;
		// console.log("team data:",data);
	}
	else{
		alert("Failed to get list of teams with code: "+res.status+` (${res.statusText})`);
		console.error("Failed to get list of teams with code: "+res.status+` (${res.statusText})`);
	}

	let time = performance.now()-startTime;
	// let minTime = 1500;
	let minTime = 500;
	if(time < minTime){
		await wait(minTime-time);
	}

	loading.value = false;
	onEndSearch();

	for(const t of document.querySelectorAll(".result-cont .hidden")){
		t.classList.remove("hidden");
		// await wait(5);
	}
}

async function searchPlayers(nextCursor?:number|null){
	if(!user.token) return;

	onStartSearch();
	let startTime = performance.now();

	search_res.resetTeams();
	search_res.resetGames();
	await eraseItems();
	amt.value = 0;

	loading.value = true;
	
	let url = new URL(serverUrl+"/players");
	if(query.value) url.searchParams.set("name-search",query.value);
	// if(nextCursor != null) url.searchParams.set("cursor",nextCursor.toString());
	if(curCursor.value) url.searchParams.set("cursor",curCursor.value.toString());
	
	// url.searchParams.set("conference","east");
	
	let res = await fetch(url.href,{
		method:"GET"
	});

	if(res.ok){
		let data = await res.json() as SearchPlayerRes;
		
		search_res.setPlayers(data.data);
		console.log("player data:",data);
		amt.value = data.data.length;

		curSearchMeta = data.meta;

		pages.value.push(data.meta.next_cursor);
		console.log("push next:",data.meta.next_cursor,[...pages.value],curCursor.value);

		// curPage.value = 
		// curPage.value = pages.value[pages.value.length-1];
		// pages.value.push(data.meta.next_cursor);
		// curPageI.value = Math.max(pages.value.indexOf(curPage.value),0);
	}
	else{
		alert("Failed to get list of players with code: "+res.status+` (${res.statusText})`);
		console.error("Failed to get list of players with code: "+res.status+` (${res.statusText})`);
	}

	let time = performance.now()-startTime;
	let minTime = 500;
	if(time < minTime){
		await wait(minTime-time);
	}

	loading.value = false;
	onEndSearch();
	for(const t of document.querySelectorAll(".result-cont .hidden")){
		t.classList.remove("hidden");
	}
}

async function searchGames(){
	if(!user.token) return;

	onStartSearch();
	let startTime = performance.now();

	search_res.resetTeams();
	search_res.resetPlayers();
	await eraseItems();
	amt.value = 0;

	loading.value = true;
	
	let url = new URL(serverUrl+"/games");
	// if(query.value) url.searchParams.set("name-search",query.value);
	// if(nextCursor != null) url.searchParams.set("cursor",nextCursor.toString());
	if(curCursor.value) url.searchParams.set("cursor",curCursor.value.toString());
	
	let res = await fetch(url.href,{
		method:"GET"
	});

	if(res.ok){
		let data = await res.json() as SearchGamesRes;
		
		search_res.setGames(data.data);
		console.log("games data:",data);
		amt.value = data.data.length;

		curSearchMeta = data.meta;

		pages.value.push(data.meta.next_cursor);
		console.log("push next:",data.meta.next_cursor,[...pages.value],curCursor.value);
	}
	else{
		alert("Failed to get list of games with code: "+res.status+` (${res.statusText})`);
		console.error("Failed to get list of games with code: "+res.status+` (${res.statusText})`);
	}

	let time = performance.now()-startTime;
	let minTime = 500;
	if(time < minTime){
		await wait(minTime-time);
	}

	loading.value = false;
	onEndSearch();
	for(const t of document.querySelectorAll(".result-cont .hidden")){
		t.classList.remove("hidden");
	}
}

async function getPlayer(playerID:number){
	let url = new URL(serverUrl+"/players/"+playerID);
	let res = await fetch(url.href,{
		method:"GET"
	});

	if(res.ok){
		console.log("get player",await res.json());
	}
	else{
		alert("Error getting player information with code: "+res.status+` (${res.statusText})`);
	}
}

function runSearch(e?:Event){
	if(e instanceof KeyboardEvent){
		if(e) if(e.key.toLowerCase() != "enter") return;
	}

	pages.value = [0];
	curCursor.value = 0;
	curPageI.value = 0;

	runSearchSub();
}
function runSearchSub(){
	scrollTo(0,0);
	
	if(searchType.value){
		let i = searchType.value.i;
		if(i == 0) searchTeams();
		else if(i == 1) searchGames();
		else if(i == 2) searchPlayers();
	}
}

function onStartSearch(){
	let n = searchType.value!.i;
	if(activeType.value != n){
		pages.value = [0];
		// curCursor.value = 0;
		// curPageI.value = 0;
		curCursor.value = 0;
		curPageI.value = 0;
	}
	activeType.value = n;
	
	// curPageI.value = Math.max(pages.value.indexOf(curPage.value),0);
	curSearchMeta = null;
	// curPageI.value = Math.floor(curCursor.value/25);
	curPageI.value = pages.value.indexOf(curCursor.value);
}
function onEndSearch(){
	// console.log([...pages.value],curCursor.value,curPageI.value);
}
function previousPage(){
	if(loading.value) return;
	if(!curSearchMeta) return;
	if(!curCursor.value) return;
	if(curCursor.value <= 0) return;

	let ind = pages.value.indexOf(curCursor.value);
	if(ind == -1){
		curCursor.value = 0;
		pages.value = [0];
	}
	else{
		curCursor.value = pages.value[ind-1];
		if(!curCursor.value) curCursor.value = 0;
		pages.value.pop();
		pages.value.pop();
	}
	
	runSearchSub();
}
function nextPage(){
	if(loading.value) return;
	if(!curSearchMeta) return;
	if(curSearchMeta.next_cursor == null) return;
	curCursor.value = curSearchMeta.next_cursor;

	runSearchSub();
}

onMounted(()=>{
	searchType.value?.onInput((i)=>{
		router.push({path:[
			"/main",
			"/main/game",
			"/main/player"
		][i]});
		runSearch();
	});
	conferenceType.value?.onInput((i)=>{
		runSearch();
	});
	
	if(searchType.value){
		searchType.value.i = (route.meta.typeI as number ?? 0);
		activeType.value = searchType.value.i;
		console.log("set current page search type: ",searchType.value.i);
	}
	runSearch();

	// getPlayer(8);
});

</script>

<template>
	<Header>
		<nav>
			<!-- <RouterLink class="button" to="">Link 1</RouterLink> -->
			<!-- <input type="text" name="" id=""> -->
			<RouterLink to="/search">Search</RouterLink>
			<RouterLink to="/favorites">Favorites</RouterLink>
			<RouterLink to="" @click="logOut">Log Out</RouterLink>
		</nav>
	</Header>
	<main id="main">
		<div class="header">
			
		</div>
		<div class="search-cont">
			<div class="filter-cont">
				<h3>Filters</h3>
				<div class="flx-c sb">
					<label for="">Type</label>
					<RadioSwitcher ref="search-type" class="radio-search-type" name="search-type" :i="0" :options="['Teams','Games','Players']"></RadioSwitcher>
				</div>
				<br>
				<hr>
				<br>
				<div class="search-cont2" v-show="searchType?.i == 0 || searchType?.i == 2">
					<!-- <label for="">Search</label> -->
					<input type="text" name="" class="i-query" @keydown="runSearch" placeholder="Search..." v-model="query">
					<div class="icon click-icon" @click="runSearch">search</div>
				</div>
				<br>
				<div v-show="searchType?.i == 0" class="flx-c sb">
					<label for="">Conference</label>
					<!-- <RadioSwitcher ref="conference-type" class="conference-type" name="conference-type" :i="0" :options="['Either','East','West']" style="--sel-bg:var(--clr-neutral-900);--sel-text:var(--clr-neutral-100)"></RadioSwitcher> -->
					<RadioSwitcher ref="conference-type" class="conference-type" name="conference-type" :i="0" :options="['Either','East','West']" style="--sel-bg:var(--clr-neutral-300);--sel-text:var(--clr-neutral-900)"></RadioSwitcher>
				</div>
				<div v-show="searchType?.i == 1">

				</div>
				<div v-show="searchType?.i == 2">

				</div>
			</div>
			<div class="result-cont">
				<div v-if="activeType == 0">
					<h3>Results <span v-if="amt != 0">({{ amt }})</span></h3>
				</div>
				<div v-if="activeType == 1" class="flx-c sb">
					<h3>Results <span v-if="amt != 0">({{ amt }})</span></h3>
					<div class="nav-controls flx-c" style="gap:20px">
						<label class="label">Page</label>
						<div>{{ curPageI+1 }}</div>
						<div class="icon click-icon" @click="previousPage">chevron_left</div>
						<div class="icon click-icon" @click="nextPage">chevron_right</div>
					</div>
				</div>
				<div v-if="activeType == 2" class="flx-c sb">
					<h3>Results <span v-if="amt != 0">({{ amt }})</span></h3>
					<div class="nav-controls flx-c" style="gap:20px">
						<label class="label">Page</label>
						<div>{{ curPageI+1 }}</div>
						<div class="icon click-icon" @click="previousPage">chevron_left</div>
						<div class="icon click-icon" @click="nextPage">chevron_right</div>
					</div>
				</div>
				<Loading :loading="loading"></Loading>
				<TeamItem v-for="team in search_res.teams" :team="team"></TeamItem>
				<GameItem v-for="game in search_res.games" :game="game"></GameItem>
				<PlayerItem v-for="player in search_res.players" :player="player"></PlayerItem>

				<!-- <div v-if="amt == 0 && !loading"> -->
				<h4 class="no-results" :show="amt == 0 && !loading">No results.</h4>
				<!-- </div> -->
			</div>
			<div class="detail-cont">
				<h3>Details</h3>
				<RouterView name="details"></RouterView>
			</div>
		</div>
	</main>
</template>

<style>
body{
	background:var(--clr-neutral-100);
	/* background:red; */
}
</style>
<style scoped>

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

</style>
