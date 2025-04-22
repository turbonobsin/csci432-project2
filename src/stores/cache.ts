import type { Game, Player, Team } from "@/util";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCacheStore = defineStore("cache",()=>{
    const teams = ref(new Map<number,Team>());
    const games = ref(new Map<number,Game>());
    const players = ref(new Map<number,Player>());

    function $reset(){
        teams.value.clear();
        games.value.clear();
        players.value.clear();
    }

    return {
        teams,games,players,$reset
    };
});