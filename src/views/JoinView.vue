<script setup lang="ts">
import Error from '@/components/Error.vue';
import Header from '@/components/Header.vue';
import { useUserStore } from '@/stores/user';
import { serverUrl, validateEmail, type User } from '@/util';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

let form = useTemplateRef("form");
let err = useTemplateRef("error");

let r_username = ref("");
let r_email = ref("");
let r_password = ref("");
let r_confirmPassword = ref("");
let r_rememberMe = ref(false);

const user = useUserStore();

const router = useRouter();

async function join(){
	if(!r_username.value || !r_email.value || !r_password.value || !r_confirmPassword.value){
		err.value?.alert("Please fill out all the fields.");
		return;
	}
	if(!validateEmail(r_email.value)){
		err.value?.alert("Please enter a valid email.");
		return;
	}
	if(r_password.value.length < 8){
		err.value?.alert("Password must be at least 8 characters.");
		return;
	}
	if(r_password.value != r_confirmPassword.value){
		err.value?.alert("Passwords don't match.");
		return;
	}

	console.log("join");

	let res = await fetch(serverUrl+"/user",{
		method:"POST",
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify({
			username:r_username.value,
			email:r_email.value,
			password:r_password.value
		})
	});

	if(res.ok){
		let data = await res.json() as User;
		console.log("successfully registered user:",data);
		console.log("remembered: ",r_rememberMe.value);
		user.setUser(data,r_rememberMe.value);

		router.push({name:"main"});
	}
	else{
		err.value?.alert("Failed to join with status code: "+res.status+` (${res.statusText})`);
		console.error("Failed to join",res.status,res.statusText);
	}
}

onMounted(()=>{
	form.value?.addEventListener("submit",e=>{
		e.preventDefault();
		join();
	});

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
			<h1>Make An Account</h1>
			<form ref="form">
				<div class="form-row">
					<label for="i-username">Username</label>
					<input type="text" name="username" id="i-username" v-model="r_username" tabindex="1">
				</div>
				<div class="form-row">
					<label for="i-email">Email</label>
					<input type="text" name="email" id="i-email" v-model="r_email" tabindex="1">
				</div>

				<div class="form-col2">
					<div class="form-row">
						<label for="i-password">Password</label>
						<input type="password" name="password" id="i-password" v-model="r_password" tabindex="2">
					</div>
					<div class="form-row">
						<label for="i-confirm-password">Confirm Password</label>
						<input type="password" name="confirm-password" id="i-confirm-password" v-model="r_confirmPassword" tabindex="3">
					</div>
				</div>

				<div class="remember-me-cont">
					<input type="checkbox" name="remember-me" id="i-remember-me" v-model="r_rememberMe" tabindex="4">
					<label for="i-remember-me">Remember Me?</label>
				</div>
				
				<Error ref="error"></Error>

				<div class="submit-cont">
					<!-- <div class="fill-line"></div> -->
					<RouterLink to="/login" class="link login-instead" tabindex="6">Login instead?</RouterLink>
					<button type="submit" id="i-submit" class="btn accent icon-cont" ref="i-submit" tabindex="5">
						<div class="material-icons">sports_basketball</div>
						Join
					</button>
				</div>
			</form>
		</div>
	</main>
</template>

<style scoped>

#main{
	display:flex;
	justify-content:center;
}

.login-cont{
	min-width:400px;
	border:solid 1px gainsboro;
	background-color:var(--clr-neutral-100);
	padding:var(--size-500) var(--size-800);
	border-radius:var(--size-200);
	box-shadow:0px 10px 5px rgba(0,0,0,0.03);
}

.login-cont > h1{
	font-size:22px;
}

form{
	margin-top:var(--size-600);
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


</style>
