import type { Game, Player, Team } from "@/util";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSearchResultsStore = defineStore("search_results",()=>{
    const teams = ref([] as Team[]);
    const games = ref([] as Game[]);
    const players = ref([] as Player[]);

    // try{
    //     let str = sessionStorage.getItem("search$teams");
    //     if(str) teams.value = JSON.parse(str);
    // }
    // catch(e){}

    // watch(teams,v=>{
    //     sessionStorage.setItem("search$teams",JSON.stringify(v));
    // });

    function setTeams(ar:Team[]){
        teams.value = ar;
    }
    function setGames(ar:Game[]){
        games.value = ar;
    }
    function setPlayers(ar:Player[]){
        players.value = ar;
    }
    // function setGames(ar:any[]){
    //     games.value = ar;
    // }
    // function setPlayers(ar:any[]){
    //     players.value = ar;
    // }

    function resetTeams(){
        teams.value = [];
    }
    function resetGames(){
        games.value = [];
    }
    function resetPlayers(){
        players.value = [];
    }

    function $reset(){
        teams.value = [];
        games.value = [];
        players.value = [];
    }

    return {
        teams,games,players,resetTeams,resetGames,resetPlayers,$reset,
        setTeams,setGames,setPlayers
    };
});