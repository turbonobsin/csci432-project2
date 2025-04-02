<script setup lang="ts">
import Header from '@/components/Header.vue';
import TeamItem from '@/components/TeamItem.vue';
import { useUserStore } from '@/stores/user';
import { serverUrl, type Team } from '@/util';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const user = useUserStore();
const router = useRouter();

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

let teams = ref([] as Team[]);
let query = ref("");

async function searchTeams(e?:KeyboardEvent){
	if(e) if(e.key.toLowerCase() != "enter") return;
	
	if(!user.token) return;
	
	let url = new URL(serverUrl+"/teams");
	if(query.value) url.searchParams.set("team-search",query.value);
	// url.searchParams.set("conference","east");

	console.log("search url",url.href);
	
	let res = await fetch(url.href,{
		method:"GET"
	});

	if(res.ok){
		let data = await res.json() as {
			data:Team[]
		};
		teams.value = data.data;
		console.log("team data:",data);
	}
	else{
		alert("Failed to get list of teams with code: "+res.status+` (${res.statusText})`);
		console.error("Failed to get list of teams with code: "+res.status+` (${res.statusText})`);
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

onMounted(()=>{
	searchTeams();

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
				<div class="search-cont2">
					<label for="">Search</label>
					<input type="text" name="" class="i-query" @keyup="searchTeams" placeholder="Search..." v-model="query">
					<div class="icon">search</div>
				</div>
			</div>
			<div class="result-cont">
				<TeamItem v-for="team in teams" :team="team"></TeamItem>
			</div>
			<div class="detail-cont">
				
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

.search-cont2{
	display:flex;
	align-items:center;
	/* width:100%; */
	gap:var(--size-200);
	/* grid-template-columns:1fr 40px; */
}
.i-query{
	width:300px;
}

:deep(header){
	background-color:var(--clr-neutral-100);
	/* border-bottom:solid 1px var(--clr-neutral-300); */
}
.header{
	background-color:var(--clr-neutral-100);
	margin:var(--size-300);
	position:sticky;
	top:0px;
	z-index:1;
	/* padding-top:30px; */
}
#main{
	display:grid;
	grid-template-rows:50px 1fr;
	height:calc(100vh - 75px);
	position:absolute;
	left:0px;
	width:100vw;
}
.search-cont{
	display:grid;
	grid-template-columns:300px 1fr 400px;
	position:relative;
	width:100vw;
	gap:var(--size-300);
}
.filter-cont{
	/* background-color:var(--clr-neutral-200); */
	position:sticky;
	top:0px;
	left:var(--size-400);
	/* border:solid 1px var(--clr-neutral-300); */
	height:calc(100vh - 150px);
	border-radius:var(--size-100);
}
.result-cont{
	/* background-color:var(--clr-neutral-200); */
	/* background-color:var(--clr-neutral-50); */
	/* border-top:solid 1px var(--clr-neutral-300); */
}
.detail-cont{
	/* border-left:solid 1px var(--clr-neutral-300); */
	/* border:solid 1px var(--clr-neutral-300); */
	/* background-color:var(--clr-neutral-100); */
	/* background-color:var(--clr-neutral-200); */
	position:sticky;
	top:0px;
	right:var(--size-400);
	margin:var(--size-100);
	height:calc(100vh - 150px);
	border-radius:var(--size-100);
}

</style>
