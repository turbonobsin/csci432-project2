<script setup lang="ts">
import { useSearchResultsStore } from '@/stores/search_results';
import { favoriteTeam, getFavoritePlayers, getFavoriteTeams, removeFavoriteTeam, serverUrl, type Team, type TeamDetails } from '@/util';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import Error from './Error.vue';
import { useRoute } from 'vue-router';
import Loading from './Loading.vue';

const route = useRoute();

const props = defineProps<{
    teamId:string;
    team?:Team;
}>();
const search_res = useSearchResultsStore();
const error = useTemplateRef("error");
const isFavorited = ref(false);
const newFavoriteChange = ref(false);

const details = ref({team:(props.team??undefined)} as TeamDetails);

let icons = ref({
    "east":"arrow_right",
    "west":"arrow_left"
} as Record<string,string>);

async function getDetails(){
    let url = new URL(serverUrl+"/teams/"+props.teamId);
    // url.searchParams.set("season");

    error.value?.clear();
    details.value.standings = undefined!;

    let res = await fetch(url,{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as TeamDetails;
        console.log("team details",props.teamId,data);

        details.value.team = data.team;
        details.value.standings = data.standings;
    }
    else{
        error.value?.alert("Failed to get team details with code: "+res.status+` (${res.statusText})`);
    }
}

async function load(){
    let existing = search_res.teams.find(v=>v.id == parseInt(props.teamId)) as Team;
    if(existing) details.value.team = existing;

    console.log("load");

    getDetails();

    isFavorited.value = false;
    newFavoriteChange.value = false; // not as fun but...
    let fav = await getFavoriteTeams((res,text)=>{
        error.value?.alert(text);
    });
    if(fav) if(fav.includes(parseInt(props.teamId))){
        isFavorited.value = true;
    }
}
onMounted(async ()=>{
    load();
});
watch(route,()=>{
    if(props.team) details.value.team = props.team;
    load();
});

async function toggleFavorite(){
    if(isFavorited.value){
        let res = await removeFavoriteTeam(parseInt(props.teamId),(res,text)=>{
            error.value?.alert(text,2000);
        });
        if(res){
            isFavorited.value = false;
            newFavoriteChange.value = true;
        }
    }
    else{
        let res = await favoriteTeam(parseInt(props.teamId),(res,text)=>{
            error.value?.alert(text,2000);
        });
        if(res){
            isFavorited.value = true;
            newFavoriteChange.value = true;
        }
    }
}

</script>

<template>
    <div class="details">
        <Error ref="error"></Error>
        <div v-if="details.team" class="team-details-info">
            <div class="flx-c sb">
                <h3 class="l-name">{{ details.team.full_name }}</h3>
                <div class="icon click-icon" :favorite="isFavorited" :new-change="newFavoriteChange" @click="toggleFavorite">favorite</div>
            </div>
            <div class="flx-c sb">
                <div>{{ details.team.abbreviation }}</div>
            </div>

            <div>
                <div class="flx-c gap4">
                    <label style="width:80px">Division</label>
                    <div>{{ details.team.division }}</div>
                </div>
                <div class="flx-c gap4">
                    <label style="width:80px">Conference</label>
                    <div class="flx-c">{{ details.team.conference }} <span class="icon">{{ icons[details.team.conference.toLowerCase()] }}</span></div>
                </div>
            </div>

            <hr>

            <table class="tab" v-if="details.standings">
                <tr>
                    <th>Stat</th>
                    <th style="width:120px">Value</th>
                </tr>
                <tr>
                    <td>Season</td>
                    <td>{{ details.standings.season }}</td>
                </tr>
                <tr>
                    <td>Losses</td>
                    <td>{{ details.standings.losses }}</td>
                </tr>
                <tr>
                    <td>Wins</td>
                    <td>{{ details.standings.wins }}</td>
                </tr>
                <tr>
                    <td>Conference Rank</td>
                    <td>{{ details.standings.conference_rank }}</td>
                </tr>
                <tr>
                    <td>Conference Record</td>
                    <td>{{ details.standings.conference_record }}</td>
                </tr>
                <tr>
                    <td>Division Rank</td>
                    <td>{{ details.standings.division_rank }}</td>
                </tr>
                <tr>
                    <td>Division Record</td>
                    <td>{{ details.standings.division_record }}</td>
                </tr>
                <tr>
                    <td>Home Record</td>
                    <td>{{ details.standings.home_record }}</td>
                </tr>
                <tr>
                    <td>Road Record</td>
                    <td>{{ details.standings.road_record }}</td>
                </tr>
            </table>
            <Loading :loading="!details.standings"></Loading>
            <!-- <div v-else> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<style scoped>

.tab{
    border-collapse:collapse;
}
.tab th{
    background-color:var(--clr-neutral-900);
    color:var(--clr-neutral-100);
}
.tab td,
.tab th{
    border:solid 1px var(--clr-neutral-300);
    padding:var(--size-100);
    font-size:14px;
}
.tab td:last-child{
    /* text-align:center; */
}
.tab tr:nth-child(odd){
    background-color:var(--clr-neutral-200);
}

.l-name{
    /* font-size:20px; */
    font-size:16px;
    text-transform:uppercase;
    font-family:Boldonse;
}

div.details{
    /* padding:var(--size-400); */
    margin-top:var(--size-600);
}

.team-details-info{
    display:flex;
    flex-direction:column;
    gap:var(--size-400);
}

</style>