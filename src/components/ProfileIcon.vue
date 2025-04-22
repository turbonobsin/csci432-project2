<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { serverUrl } from '@/util';
import { onMounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const user = useUserStore();
const cont = useTemplateRef("cont");
const router = useRouter();

async function logout(){
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
    else if(res.status == 401){
		user.$reset();
		router.push({name:"home"}); // <-- we want to logout anyways
	}
	else{
		alert("Failed to logout with code: "+res.status+` (${res.statusText})`);
		console.error("Failed to logout with code: "+res.status+` (${res.statusText})`);
	}
}

onMounted(()=>{
    cont.value?.addEventListener("click",e=>{

    });
});

</script>

<template>
    <div class="profile-icon-cont" ref="cont">
        <div class="l-username" v-if="user.token">{{ user.user.username || "(Guest)" }}</div>
        <div class="profile-icon"></div>
        <!-- <div class="profile-icon icon">settings</div> -->

        <div class="profile-menu" v-if="user.token">
            <div>
                <div class="dd-icon-cont"><div class="icon">person</div></div>
                <RouterLink class="text" to="/profile">Profile</RouterLink>
            </div>
            <div>
                <div class="dd-icon-cont"><div class="icon">logout</div></div>
                <RouterLink class="text" to="/" @click.prevent="logout">Log Out</RouterLink>
            </div>
            <!-- <div>
                <div></div>
                <div>Item 2</div>
            </div> -->
            <!-- <div>
                <div></div>
                <div>Item 3</div>
            </div> -->
        </div>
    </div>
</template>

<style scoped>

.l-username{
    font-family:Boldonse;
    text-transform:uppercase;
}

.profile-icon-cont{
    display:flex;
    align-items:center;
    gap:var(--size-400);
    font-size:12px;
    margin-left:var(--size-100);
    user-select:none;
    -webkit-user-select:none;
    padding:var(--size-100) var(--size-300);
    position:relative;
    border-radius:var(--size-100);
}
.profile-icon-cont:hover{
    cursor:pointer;
    background-color:var(--clr-neutral-200);
    outline:solid 1px var(--clr-neutral-300);
}

.profile-menu{
    display:flex;
    flex-direction:column;
    position:absolute;
    /* padding-top:var(--size-200); */
    top:calc(100% + 10px);
    left:0px;
    width:100%;
    outline:solid 1px var(--clr-neutral-300);
    z-index:10;
    border-radius:var(--size-100);
    box-shadow:0px 5px 5px rgba(0,0,0,0.05);
    border-bottom:solid 4px var(--clr-primary-400);

    opacity:0;
    translate:0px -5px;
    pointer-events:none;
    transition:all 0.2s ease;
}
.profile-icon-cont:hover .profile-menu{
    opacity:1;
    translate:0px 0px;
    pointer-events:all;
}
.profile-menu::before{
    content:"";
    position:absolute;
    top:-20px;
    left:0px;
    width:100%;
    height:40px;
    z-index:-1;
}
.profile-menu > div{
    display:grid;
    grid-template-columns:34px 1fr;
    background-color:var(--clr-neutral-100);
}
.profile-menu > div:not(:last-child){
    border-bottom:solid 1px var(--clr-neutral-300);
}
.profile-menu > div:hover{
    background-color:var(--clr-neutral-200);
}
.profile-menu .icon{
    font-size:16px;
}
.profile-menu .text{
    padding:var(--size-200) var(--size-400);
    padding-left:0px;
}
.dd-icon-cont{
    display:flex;
    justify-content:center;
    align-items:center;
}

.profile-icon{
    width:35px;
    height:35px;
    background-color:gainsboro;
    border-radius:50%;

    /* font-size:22px;
    font-family:"Material Symbols Outlined";
    display:flex;
    justify-content:center;
    align-items:center; */
}

</style>