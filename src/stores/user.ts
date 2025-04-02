import type { User, UserData } from "@/util";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUserStore = defineStore("user",()=>{
    let userStorage = localStorage.getItem("user$user");
    let user = ref(((userStorage ? JSON.parse(userStorage) : null) ?? {}) as UserData);
    let token = ref(localStorage.getItem("token") ?? "");
    let rememberMe = ref(false);

    watch(user,v=>{
        if(v) localStorage.setItem("user$user",JSON.stringify(v));
        else localStorage.removeItem("user$user");
    });
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

    function makeUser(data:User,rememberMe1:boolean){
        user.value = data.user;
        token.value = data.token;
        rememberMe.value = rememberMe1;
    }

    function $reset(){
        user.value = {} as UserData;
        token.value = "";
    }

    return {user,token,setUser: makeUser,$reset};
});