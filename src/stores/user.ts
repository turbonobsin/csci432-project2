import type { User } from "@/util";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUserStore = defineStore("user",()=>{
    let username = ref("");
    let email = ref("");
    let token = ref(localStorage.getItem("token") ?? "");
    let rememberMe = ref(false);

    // watch(username,v=>{
    //     if(v) localStorage.setItem("user$username",v);
    //     else localStorage.removeItem("user$username");
    // });
    // watch(email,v=>{
    //     if(v) localStorage.setItem("user$email",v);
    //     else localStorage.removeItem("user$email");
    // });
    watch(token,v=>{
        if(v){
            if(rememberMe.value) localStorage.setItem("token",v);
            else sessionStorage.setItem("token",v);
        }
        else{
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
        }
    });

    function makeUser(user:User,rememberMe1:boolean){
        username.value = user.user.username;
        email.value = user.user.email;
        token.value = user.token;
        rememberMe.value = rememberMe1;
    }

    function $reset(){
        username.value = "";
        email.value = "";
        token.value = "";
    }

    return {username,email,token,setUser: makeUser,$reset};
});