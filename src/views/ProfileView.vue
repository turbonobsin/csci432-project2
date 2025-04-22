<script setup lang="ts">
import Error from '@/components/Error.vue';
import Header from '@/components/Header.vue';
import Loading from '@/components/Loading.vue';
import { useUserStore } from '@/stores/user';
import { serverUrl, validateEmail, type User, type UserData } from '@/util';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

let form = useTemplateRef("form");
let err = useTemplateRef("error");
let success = useTemplateRef("success");

const user = useUserStore();
const router = useRouter();

let loading = ref(false);

async function getProfile(){
	if(editMode.value) return;

	let url = new URL(serverUrl+"/user/me");
	let res = await fetch(url.href,{
		method:"GET",
		headers:{
			Authorization:`Bearer ${user.token}`
		}
	});

	if(res.ok){
		let data = await res.json() as UserData;
		user.setUser({
			user:data,
			token:user.token
		},user.getRememberMe());

		username.value = data.username;
		email.value = data.email;
	}
	else{
		err.value?.alert("Failed to get user profile with status code: "+res.status+` (${res.statusText})`);
		console.error("Failed to get user profile",res.status,res.statusText);
	}
}

async function saveProfile(){
	if(!editMode.value) return;
	
	form.value?.querySelectorAll("input.invalid").forEach(c=>{
		c.classList.remove("invalid");
	});
	
	if(!username.value || !email.value){
		err.value?.alert("Please fill out all the fields.");
		form.value?.querySelectorAll("input").forEach(c=>{
			c.classList.add("invalid");
		});
		return;
	}
	if(!validateEmail(email.value)){
		err.value?.alert("Please enter a valid email.");
		form.value?.querySelector("#i-email")?.classList.add("invalid");
		return;
	}

	loading.value = true;

	let data = {
		username:username.value,
		email:email.value,
	} as any;
	if(password.value) data.password = password.value;
	console.log("new password",password.value);

	let res = await fetch(serverUrl+"/user/me",{
		method:"PATCH",
		headers:{
			Authorization:`Bearer ${user.token}`,
			"Content-Type":"application/json"
		},
		body:JSON.stringify(data)
	});

	if(res.ok){
		let data = await res.json() as UserData;
		console.log("successfully updated user profile:",data);
		user.setUser({
			user:data,
			token:user.token
		},user.getRememberMe());

		editMode.value = false;
	}
	else{
		err.value?.alert("Failed to update user profile with status code: "+res.status+` (${res.statusText})`);
		console.error("Failed to update user profile",res.status,res.statusText);
	}

	loading.value = false;
}

let editMode = ref(false);
let username = ref(user.user.username);
let email = ref(user.user.email);
let password = ref("");

function hasUnsavedChanges(){
	if(username.value != user.user.username) return true;
	if(email.value != user.user.email) return true;
	return false;
}
function toggleEditMode(){
	console.log("toggle");
	if(hasUnsavedChanges()){
		if(!confirm("You have unsaved changes, do you wish to delete your changes?")) return;
		else{
			username.value = user.user.username;
			email.value = user.user.email;
		}
	}
	editMode.value = !editMode.value;
}

async function deleteAccount(){
	if(!confirm("Are you sure you want to delete your account?\n\nThis action cannot be reversed!")) return;
	
	let url = new URL(serverUrl+"/user/me");
	let res = await fetch(url.href,{
		method:"DELETE",
		headers:{
			Authorization:`Bearer ${user.token}`
		}
	});

	if(res.ok){
		user.$reset();
		router.push({path:"/"});
	}
	else{
		err.value?.alert("Failed to delete account with status code: "+res.status+` (${res.statusText})`);
		console.error("Failed to delete account",res.status,res.statusText);
	}
}
async function clearFavorites(){
	if(!confirm("Are you sure you want to clear all your favorite teams and players?\n\nThis action cannot be reversed!")) return;
	
	let url = new URL(serverUrl+"/user/me");
	let res = await fetch(url.href,{
		method:"PATCH",
		headers:{
			Authorization:`Bearer ${user.token}`
		},
		body:JSON.stringify({
			favoriteTeams:[],
			favoritePlayers:[]
		})
	});

	if(res.ok){
		success.value?.alert("Successfully cleared all favorites.",4000);
	}
	else{
		err.value?.alert("Failed to clear favorites with status code: "+res.status+` (${res.statusText})`);
		console.error("Failed to clear favorites",res.status,res.statusText);
	}
}

onMounted(()=>{
	getProfile(); // just in case
	document.querySelectorAll(".login-cont input").forEach(c=>{
		err.value?.linkInput(c as HTMLInputElement);
	});
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
				<div class="flx-c" style="gap:26px">
					<h1>Profile</h1>
					<h1 class="icon click-icon" @click="toggleEditMode">edit</h1>
				</div>
			</div>
			<div ref="form" class="form">
				<div class="form-row">
					<label for="i-username">Username</label>
					<input v-if="editMode" type="text" name="username" id="i-username" v-model="username" tabindex="1">
					<h2 v-else class="l-name">{{ user.user.username }}</h2>
				</div>
				<div class="form-row">
					<label for="i-email">Email</label>
					<input v-if="editMode" type="text" name="email" id="i-email" v-model="email" tabindex="1">
					<h4 v-else>{{ user.user.email }}</h4>
				</div>
				<div class="form-row" v-if="editMode">
					<label for="i-password">New Password</label>
					<input type="password" name="email" id="i-password" v-model="password" tabindex="1">
				</div>

				<Error ref="error"></Error>
				<Error ref="success" style="color:limegreen"></Error>
				<!-- <Loading :loading="loading"></loading> -->

				<br><br><br>
				<div class="submit-cont flx-c gap4" style="justify-content:center;" :graydisable="!editMode">
					<button class="btn accent2 icon-cont" ref="i-cancel" tabindex="4" @click="toggleEditMode">
						<div class="material-icons">close</div>
						Cancel
					</button>
					<button type="submit" id="i-submit" class="btn accent icon-cont" ref="i-submit" tabindex="5" @click="saveProfile">
						<div class="material-icons">check</div>
						Save Changes
					</button>
				</div>

				<br><br><hr><br>
				<div class="flx-c sb">
					<button v-if="false" class="btn accent2 icon-cont" tabindex="6" @click="clearFavorites" style="width:max-content;">
						<div class="material-icons">close</div>
						Clear Favorites
					</button>
					<button class="btn accent2 icon-cont" tabindex="6" @click="deleteAccount" style="width:max-content">
						<div class="material-icons">delete</div>
						<!-- <div class="material-icons">warning</div> -->
						Delete Account
					</button>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>

.l-name{
    /* font-size:20px; */
    font-size:16px;
    text-transform:uppercase;
    font-family:Boldonse;
}

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

div.form{
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

label{
	font-size:12px;
	margin-block:var(--size-200);
	opacity:0.6;
}

.remember-me-cont{
	margin-block:var(--size-400);
	display:flex;
	align-items:center;
	gap:var(--size-400);
	font-size:14px;
}

.submit-cont{
	display:flex;
	align-items:center;
	justify-content:space-between;
}
#i-submit{
	width:max-content;
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
