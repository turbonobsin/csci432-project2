<script setup lang="ts">
import Error from '@/components/Error.vue';
import Header from '@/components/Header.vue';
import { useUserStore } from '@/stores/user';
import { serverUrl, validateEmail, type User } from '@/util';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

let form = useTemplateRef("form");
let err = useTemplateRef("error");

let r_email = ref("");
let r_password = ref("");
let r_rememberMe = ref(false);

const user = useUserStore();

const router = useRouter();

async function login(){
	form.value?.querySelectorAll("input.invalid").forEach(c=>{
		c.classList.remove("invalid");
	});
	
	if(!r_email.value || !r_password.value){
		err.value?.alert("Please fill out all the fields.");
		form.value?.querySelectorAll("input").forEach(c=>{
			c.classList.add("invalid");
		});
		return;
	}
	if(!validateEmail(r_email.value)){
		err.value?.alert("Please enter a valid email.");
		form.value?.querySelector("#i-email")?.classList.add("invalid");
		return;
	}
	if(r_password.value.length < 8){
		err.value?.alert("Password must be at least 8 characters.");
		form.value?.querySelector("#i-password")?.classList.add("invalid");
		return;
	}

	console.log("login");

	let res = await fetch(serverUrl+"/user/login",{
		method:"POST",
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify({
			email:r_email.value,
			password:r_password.value
		})
	});

	if(res.ok){
		let data = await res.json() as User;
		console.log("successfully logged in user:",data);
		console.log("remembered: ",r_rememberMe.value);
		user.setUser(data,r_rememberMe.value);

		router.push({name:"main"});
	}
	else{
		err.value?.alert("Failed to login with status code: "+res.status+` (${res.statusText})`);
		console.error("Failed to login",res.status,res.statusText);
	}
}

onMounted(()=>{
	form.value?.addEventListener("submit",e=>{
		e.preventDefault();
		login();
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
			<div class="login-header">
				<span class="icon go-back-icon" @click="router.back()">west</span>
				<h1>Log Back In</h1>
				<!-- <span class="link" @click="router.back()">Go Back</span> -->
			</div>
			<form ref="form">
				<div class="form-row">
					<label for="i-email">Email</label>
					<input type="text" name="email" id="i-email" v-model="r_email" tabindex="1">
				</div>

				<div class="form-row">
					<label for="i-password">Password</label>
					<input type="password" name="password" id="i-password" v-model="r_password" tabindex="2">
				</div>

				<div class="remember-me-cont">
					<input type="checkbox" name="remember-me" id="i-remember-me" v-model="r_rememberMe" tabindex="4">
					<label for="i-remember-me">Remember Me?</label>
				</div>
				
				<Error ref="error"></Error>

				<div class="submit-cont">
					<RouterLink to="/join" class="link login-instead" tabindex="6">Join instead?</RouterLink>
					<button type="submit" id="i-submit" class="btn accent2 icon-cont" ref="i-submit" tabindex="5">
						<div class="material-icons">sports_basketball</div>
						Log In
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
