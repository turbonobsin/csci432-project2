<script setup lang="ts">
import GameItem from '@/components/GameItem.vue';
import Header from '@/components/Header.vue';
import Loading from '@/components/Loading.vue';
import PlayerItem from '@/components/PlayerItem.vue';
import RadioSwitcher from '@/components/RadioSwitcher.vue';
import TeamDetails from '@/components/TeamDetails.vue';
import TeamItem from '@/components/TeamItem.vue';
import router from '@/router';
import { useSearchResultsStore } from '@/stores/search_results';
import { useUserStore } from '@/stores/user';
import { getFavoritePlayers, getFavoriteTeams, getLocalNowDate, getPlayerDetails, getTeamDetails, serverUrl, stringMatch, wait, type Player, type SearchGamesRes, type SearchMeta, type SearchPlayerRes, type Team } from '@/util';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

let query = ref("");
let loading = ref(false);
const favoriteTeamsIds = ref([] as number[]);
const favoritePlayerIds = ref([] as number[]);
const favoriteTeams = ref(new Map<number,Team>());
const favoritePlayers = ref(new Map<number,Player>());

const curTeam = ref(undefined as Team|undefined);
const curPlayer = ref(undefined as Player|undefined);

const searchType = useTemplateRef("search-type");
const activeType = ref(route.meta.typeI);

async function searchTeams(){
    let res = await getFavoriteTeams();
    if(res) favoriteTeamsIds.value = res;

    for(const id of [...res]){
        let existing = favoriteTeams.value.get(id);
        if(existing){
            if(query.value){
                if(!stringMatch(query.value,existing.full_name)){
                    let ind = favoriteTeamsIds.value.indexOf(existing.id);
                    if(ind != -1) favoriteTeamsIds.value.splice(ind,1);
                }
            }
            continue;
        }
        (async ()=>{
            let data = await getTeamDetails(id);
            if(data){
				favoriteTeams.value.set(id,data);
				if(!curTeam.value && (route.params.teamId as string|number) == data.id) curTeam.value = data;
			}

            if(data) if(query.value){
                if(!stringMatch(query.value,data.full_name)){
                    let ind = favoriteTeamsIds.value.indexOf(data.id);
                    if(ind != -1) favoriteTeamsIds.value.splice(ind,1);
                }
            }
        })();
    }
    loading.value = false;
}
async function searchPlayers(){
    let res = await getFavoritePlayers();
    if(res) favoritePlayerIds.value = res;

    for(const id of [...res]){
        let existing = favoritePlayers.value.get(id);
        if(existing){
            if(query.value){
                if(!stringMatch(query.value,existing.first_name+" "+existing.last_name)){
                    let ind = favoritePlayerIds.value.indexOf(existing.id);
                    if(ind != -1) favoritePlayerIds.value.splice(ind,1);
                }
            }
            continue;
        }
        (async ()=>{
            let data = await getPlayerDetails(id);
            if(data){
				favoritePlayers.value.set(id,data);
				if(!curPlayer.value && (route.params.playerId as string|number) == data.id) curPlayer.value = data;
			}

            if(data) if(query.value){
                if(!stringMatch(query.value,data.first_name+" "+data.last_name)){
                    let ind = favoritePlayerIds.value.indexOf(data.id);
                    if(ind != -1) favoritePlayerIds.value.splice(ind,1);
                }
            }
        })();
    }
    loading.value = false;
}

function runSearch(e?:Event){    
	if(e instanceof KeyboardEvent){
		if(e) if(e.key.toLowerCase() != "enter") return;
	}

	runSearchSub();
}
function runSearchSub(){
    favoriteTeamsIds.value = [];
    favoritePlayerIds.value = [];
	scrollTo(0,0);
    loading.value = true;
	
	if(searchType.value){
		let i = searchType.value.i;
		if(i == 0) searchTeams();
		else if(i == 1) searchPlayers();
	}
}

function init(){
	let needsSearchAgain = false;
	if(searchType.value){
		let lastI = searchType.value.i;
		searchType.value.i = (route.meta.typeI as number ?? 0);
		if(searchType.value.i != lastI){
			needsSearchAgain = true;
		}
		activeType.value = searchType.value.i;
		console.log("set current page search type: ",searchType.value.i);
	}
	if(needsSearchAgain) runSearch();
}

onMounted(()=>{
	// if(searchType.value) searchType.value.i = route.meta.type as number;
	
	// console.log("type",route.meta.type);
	// activeType.value = route.meta.type;
	
	searchType.value?.onInput((i)=>{
		if(activeType.value == 0 && i == 1){
			curTeam.value = undefined;
		}
		else if(activeType.value == 1 && i == 0){
			curPlayer.value = undefined;
		}
        activeType.value = i;
        query.value = "";
		router.push({
			path:"/favorites/"+(i == 0 ? "team" : "player")+(curTeam.value?("/"+curTeam.value.id):"")+(curPlayer.value?("/"+curPlayer.value.id):""),
		});
		runSearch();
	});
	
	init();
	runSearch();
});

function load(type:number,id:number){
    curTeam.value = undefined;
    curPlayer.value = undefined;
    if(type == 0){
		curTeam.value = favoriteTeams.value.get(id);
		console.log("set cur team value",curTeam.value?.name);
		router.push({
			path:"/favorites/team/"+id
		});
	}
    else if(type == 1){
		curPlayer.value = favoritePlayers.value.get(id);
		console.log("set cur player value",curPlayer.value?.first_name);
		router.push({
			path:"/favorites/player/"+id
		});
	}
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
		<div class="header">
			
		</div>
		<div class="search-cont">
			<div class="filter-cont">
				<h3>Filters</h3>
				<div class="flx-c sb">
					<label for="">Type</label>
					<RadioSwitcher ref="search-type" class="radio-search-type" name="search-type" :i="0" :options="['Teams','Players']"></RadioSwitcher>
				</div>
				<br>
				<hr>
				<br>
				<div class="search-cont2">
					<input type="text" name="" class="i-query" @keydown="runSearch" placeholder="Search..." v-model="query">
					<div class="icon click-icon" @click="runSearch">search</div>
				</div>
				<br>
			</div>
			<div class="result-cont">
				<div v-if="activeType == 0">
					<h3>Results <span v-if="favoriteTeamsIds.length != 0">({{ favoriteTeamsIds.length }})</span></h3>
				</div>
				<div v-if="activeType == 1" class="flx-c sb">
					<h3>Results <span v-if="favoritePlayerIds.length != 0">({{ favoritePlayerIds.length }})</span></h3>
				</div>
				<Loading :loading="loading"></Loading>
				<TeamItem v-for="teamId in favoriteTeamsIds" :team="favoriteTeams.get(teamId)" :onclick="()=>{load(0,teamId)}"></TeamItem>
				<PlayerItem v-for="playerId in favoritePlayerIds" :player="favoritePlayers.get(playerId)" :onclick="()=>{load(1,playerId)}"></PlayerItem>

				<h4 v-if="activeType == 0" class="no-results" :show="favoriteTeamsIds.length == 0 && !loading">No results.</h4>
				<h4 v-else class="no-results" :show="favoritePlayerIds.length == 0 && !loading">No results.</h4>
			</div>
			<div class="detail-cont">
				<h3>Details</h3>
				<!-- vvv - this whole thing is insane, blows my mind, DetailsWrapper with passing props through a RouterView just works -->
				<RouterView name="details" :team="curTeam" :player="curPlayer" :loading="loading"></RouterView>
                <!-- <TeamDetails v-if="curTeam" :team-id="curTeam.id.toString()"></TeamDetails> -->
				
			</div>
		</div>
	</main>
</template>

<style>
body{
	background:var(--clr-neutral-100);
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

.player-item{
	border:solid 1px var(--clr-neutral-300);
	padding:var(--size-200) var(--size-400);
	border-radius:50px;
	margin-block:var(--size-200);
}

</style>
