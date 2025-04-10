<script setup lang="ts">
import Error from '@/components/Error.vue';
import Header from '@/components/Header.vue';
import Loading from '@/components/Loading.vue';
import { useUserStore } from '@/stores/user';
import { serverUrl, validateEmail, wait, type GameDetails, type User } from '@/util';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

let form = useTemplateRef("form");

let r_points = ref(0);
let r_assists = ref(0);
let r_rebounds = ref(0);
let r_threes = ref(0);
let r_steals = ref(0);
let r_rememberMe = ref(false);

const error = useTemplateRef("error");

const props = defineProps<{
	playerId:string;
	playerName:string;
	gameId:string;
}>();

const user = useUserStore();

const router = useRouter();

const details = ref({} as GameDetails);
const loading = ref(true);

async function getDetails(){
    let url = new URL(serverUrl+"/games/"+props.gameId);

    error.value?.clear();

    let res = await fetch(url,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as GameDetails;
        console.log("game details",props.gameId,data);

		details.value = data;
    }
    else{
        error.value?.alert("Failed to get game details with code: "+res.status+` (${res.statusText})`);
    }

	loading.value = false;
}

async function placeBet(e:Event){
	e.preventDefault();

	let url = new URL(serverUrl+"/bets");

	error.value?.clear();

	let data = {
		gameId:parseInt(props.gameId),
		playerId:parseInt(props.playerId),
		predictions:{
			points:r_points.value,
			assists:r_assists.value,
			rebounds:r_rebounds.value,
			threes:r_threes.value,
			steals:r_steals.value
		}
	};
	console.log("data",data);

	let res = await fetch(url,{
		method:"POST",
		headers:{
			Authorization:`Bearer ${user.token}`,
			"Content-Type":"application/json"
		},
		body:JSON.stringify(data)
	});

	if(res.ok){
		console.log("post bet success");
		try{
			console.log(await res.json());
		}
		catch(e){console.warn("no json")}

		router.push({name:"bets"});
	}
	else{
		error.value?.alertLines([
			"Failed to post bet with code: "+res.status+` (${res.statusText})`,
			(await res.json())?.error
		]);
		// console.warn(await res.text());
	}
}

onMounted(()=>{
	// form.value?.addEventListener("submit",e=>{
		// e.preventDefault();
		// placeBet();
	// });

	document.querySelectorAll(".login-cont input").forEach(c=>{
		error.value?.linkInput(c as HTMLInputElement);
	});

	getDetails();
});

</script>

<template>
	<Header>
		<nav>
		</nav>
	</Header>
	<main id="main">
		<div class="login-cont">
			<div class="login-header">
				<span class="icon go-back-icon" @click="router.back()">west</span>
				<!-- <h1>Place Bet</h1> -->
				<!-- <span class="link" @click="router.back()">Go Back</span> -->
			</div>
			<br>
			<label for="">Place Bet For </label>
			<h3><span class="l-name" style="color:var(--clr-secondary-400)">{{ props.playerName }}</span></h3>
			<Loading :loading="loading"></Loading>
			<div v-if="!loading" class="" style="gap:var(--size-900)">
				<div>
					<br>
					<label for="">For</label>
					<h3><span class="l-name">{{ details.game.home_team }}<div style="color:var(--clr-primary-400)">versus</div> {{ details.game.visitor_team }}</span></h3>
					<br><br>
					<label for="">Starting</label>
					<h3 class="flx-c sb">
						<span>{{ new Date(details.game.date).toLocaleString([],{dateStyle:"medium"}) }}</span>
						<span>{{ new Date(details.game.date).toLocaleString([],{timeStyle:"short"}) }}</span>
					</h3>
				</div>
				<div>
					<br><br><hr><br>
					<h3 style="float:right">Predictions</h3>
					<form ref="form">
						<div class="form-row">
							<label for="i-points">Points</label>
							<input type="text" name="points" id="i-points" v-model="r_points" tabindex="1">
						</div>
						<div class="col2">
							<div class="flx-c gap4">
								<div class="form-row">
									<label for="i-assists">Assists</label>
									<input type="text" name="assists" id="i-assists" v-model="r_assists" tabindex="2">
								</div>
								<div class="form-row">
									<label for="i-rebounds">Rebounds</label>
									<input type="text" name="rebounds" id="i-rebounds" v-model="r_rebounds" tabindex="2">
								</div>
							</div>
							<br>
							<div class="flx-c gap4">
								<div class="form-row">
									<label for="i-threes">Threes</label>
									<input type="text" name="threes" id="i-threes" v-model="r_threes" tabindex="2">
								</div>
								<div class="form-row">
									<label for="i-steals">Steals</label>
									<input type="text" name="steals" id="i-steals" v-model="r_steals" tabindex="2">
								</div>
							</div>
						</div>
						<br><br>
						
						<Error ref="error"></Error>

						<div class="submit-cont">
							<!-- <RouterLink to="/join" class="link login-instead" tabindex="6">Join instead?</RouterLink> -->
							<button @click="placeBet" id="i-submit" class="fw btn2 accent3 icon-cont" ref="i-submit" tabindex="5" style="justify-content:center;gap:var(--size-300);--c:mediumslateblue">
								<div class="material-icons">send</div>
								Place Bet
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>

.l-name{
	font-weight:bold;
	font-family:Boldonse;
	font-size:16px;
	text-transform:uppercase;
	display:block;
}

/*  */

#main{
	display:flex;
	justify-content:center;
}

.login-cont{
	/* min-width:400px; */
	width:522px;
	border:solid 1px gainsboro;
	background-color:var(--clr-neutral-100);
	padding:var(--size-500) var(--size-800);
	border-radius:var(--size-200);
	box-shadow:0px 0px 2px rgba(0,0,0,0.01);
	animation:ShowLoginCont 0.5s forwards ease-out;
}

.login-cont > h1{
	font-size:22px;
}

form{
	margin-top:var(--size-700);
	display:flex;
	flex-direction:column;
	gap:var(--size-300);
}
.form-row{
	display:flex;
	flex-direction:column;
}

.form-col2{
	display:grid;
	grid-template-columns:1fr 1fr;
	gap:var(--size-300);
}

.remember-me-cont{
	margin-block:var(--size-400);
	display:flex;
	align-items:center;
	gap:var(--size-400);
	font-size:14px;
}

.submit-cont{
	/* display:flex; */
	/* align-items:center; */
	/* justify-content:space-between; */
}
#i-submit{
	/* width:max-content; */
	padding:var(--size-200) var(--size-600);
}
.login-instead{
	font-size:14px;
}
.login-header{
	display:flex;
	align-items:center;
	justify-content:space-between;
	margin-top:var(--size-400);
}

@keyframes ShowLoginCont{
	0%{
		box-shadow:0px 0px 2px rgba(0,0,0,0.01);
	}
	100%{
		box-shadow:0px 10px 5px rgba(0,0,0,0.03);
	}
}

</style>
