import { ref, watch } from "vue";
import { useUserStore } from "./stores/user";

export const serverUrl = "https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net";

export type TeamSearchRes = {
    data:{
        abbreviation:string;
        city:string;
        conference:string;
        division:string;
        full_name:string;
        id:number;
        name:string;
    }[];
};

async function searchTeams(){
    let res = await fetch(serverUrl+"/teams",{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as TeamSearchRes;
        console.log(data);
    }
    else{
        alert("error code: "+res.status);
    }
}

export function wait(delay:number){
    return new Promise<void>(resolve=>{
        setTimeout(()=>{
            resolve();
        },delay);
    });
}

export function validateEmail(email:string){
    return email.match(/.+@.+\..+/);
}

export type UserData = {
    username:string;
    email:string;
    favoriteTeams:string[];
    favoritePlayers:string[];
    betIds:string[];
    createdAt:string;
    updatedAt:string;
    _id:string;
};
export type User = {
    user:UserData;
    token:string;
};

export type Team = {
    abbreviation:string;
    city:string;
    conference:string;
    division:string;
    full_name:string;
    id:number;
    name:string;
};
export type TeamDetails = {
    standings:{
        conference_rank:number;
        conference_record:string;
        division_rank:number;
        division_record:string;
        home_record:string;
        road_record:string;
        season:number; // 2024
        losses:number;
        wins:number;
    };
    team:Team;
};

export type Player = {
    college:string;
    country:string;
    draft_number:number;
    draft_round:number;
    draft_year:number;
    first_name:string;
    height:string;
    id:number;
    jersey_number:string;
    last_name:string;
    position:string;
    weight:string;
    team:Team;
}
export type SearchMeta = {
    next_cursor:number;
    per_page:number;
};
export type SearchPlayerRes = {
    data:Player[];
    meta:SearchMeta;
};

export class Game{
    date!:string;
    datetime!:never;
    home_team!:Team;
    home_team_score!:number;
    period!:number;
    postseason!:boolean;
    season!:number;
    status!:string; // Final
    time!:never;
    visitor_team!:Team;
    visitor_team_score!:number;
    id!:number;
};
export type SearchGamesRes = {
    data:Game[];
    meta:SearchMeta;
};

export type PlayerDetails = {
    player:{
        data:Player;
    }
    stats:{
        data:{
            ast:number;
            blk:number;
            dreb:number;
            fg3_pct:number;
            fg3a:number;
            fg3m:number;
            fg_pct:number;
            fga:number;
            fgm:number;
            ft_pct:number;
            fta:number;
            ftm:number;
            games_played:number;
            min:string;
            oreb:number;
            pf:number;
            player_id:number;
            pts:number;
            reb:number;
            season:number;
            stl:number;
            turnover:number;
        }[];
    }
};

export type GameDetails = {
    game:GameSimple;
    playerStats:PlayerStat[]|null;
};

export type GameSimple = {
    date:string;
    home_team:string;
    home_team_score:number;
    id:number;
    status:string; // Final
    visitor_team:string;
    visitor_team_score:number;
};

export type PlayerStat = {
    assists:number;
    blocks:number;
    field_goal3_percentage:number;
    field_goal_percentage:number;
    field_goals3_attempt:number;
    field_goals3_made:number;
    field_goals_attempt:number;
    field_goals_made:number;
    freethrow_percentage:number;
    freethrows_attempt:number;
    freethrows_made:number;
    player_id:number;
    player_name:string;
    points:number;
    rebounds:number;
    steals:number;
    team:string;
};

export function stringMatch(s1:string,s2:string){
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    return (s1.includes(s2) || s2.includes(s1));
}

export function getLocalNowDate(){
    let date = new Date();
	let zone = date.toLocaleDateString();
	date = new Date(zone);
    return date;
}

export type Bet = {
    _id:string;
    actualStats:{
        assists:number;
        points:number;
        rebounds:number;
        steals:number;
        threes:number;
    };
    createdAt:string;
    gameId:number;
    playerId:number;
    predictions:{
        assists:number;
        points:number;
        rebounds:number;
        steals:number;
        threes:number;
    };
    score:number;
    status:string;
    updatedAt:string;
    userId:string;
};

// 
let tmpBetData = {};
try{
    tmpBetData = JSON.parse(localStorage.getItem("tmpBet")??"{}");
}
catch(e){}
export let tmpBet = ref(tmpBetData as Bet);
watch(tmpBet,(v,ov)=>{
    localStorage.setItem("tmpBet",JSON.stringify(tmpBet.value));
});

// global endpoints
export async function favoritePlayer(player_id:number,onerr?:(res:Response,text:string)=>void){
    let token = useUserStore()?.token;
    if(!token) return;
    
    let res = await fetch(serverUrl+"/favorite-players",{
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            player_id
        })
    });

    if(res.ok){
        return true;
    }
    else{
        console.warn(`Error ${res.status} ${res.statusText} while trying to favorite player with id `+player_id);
        if(onerr) onerr(res,`Error while trying to favorite player; ${res.status} ${res.statusText}`);
        return false;
    }
}
export async function removeFavoritePlayer(player_id:number,onerr?:(res:Response,text:string)=>void){
    let token = useUserStore()?.token;
    if(!token) return;
    
    let res = await fetch(serverUrl+"/favorite-players/"+player_id,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    if(res.ok){
        return true;
    }
    else{
        console.warn(`Error ${res.status} ${res.statusText} while trying to remove favorite player with id `+player_id);
        if(onerr) onerr(res,`Error while trying to remove favorite player; ${res.status} ${res.statusText}`);
        return false;
    }
}
export async function getFavoritePlayers(onerr?:(res:Response,text:string)=>void){
    let token = useUserStore()?.token;
    if(!token) return [];
    
    let res = await fetch(serverUrl+"/favorite-players",{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    if(res.ok){
        let data = await res.json();
        console.log("favorite players",data?.favoritePlayers);
        return (data.favoritePlayers as number[]).map(Number);
    }
    else{
        console.warn(`Error ${res.status} ${res.statusText} while trying to get favorite players`);
        if(onerr) onerr(res,`Error while trying to get favorite players; ${res.status} ${res.statusText}`);
    }
    return [];
}
export async function favoriteTeam(team_id:number,onerr?:(res:Response,text:string)=>void){
    let token = useUserStore()?.token;
    if(!token) return;
    
    let res = await fetch(serverUrl+"/favorite-teams",{
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            team_id
        })
    });

    if(res.ok){
        return true;
    }
    else{
        console.warn(`Error ${res.status} ${res.statusText} while trying to favorite team with id `+team_id);
        if(onerr) onerr(res,`Error while trying to favorite team; ${res.status} ${res.statusText}`);
        return false;
    }
}
export async function removeFavoriteTeam(team_id:number,onerr?:(res:Response,text:string)=>void){
    let token = useUserStore()?.token;
    if(!token) return;
    
    let res = await fetch(serverUrl+"/favorite-teams/"+team_id,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    if(res.ok){
        return true;
    }
    else{
        console.warn(`Error ${res.status} ${res.statusText} while trying to remove favorite team with id `+team_id);
        if(onerr) onerr(res,`Error while trying to remove favorite team; ${res.status} ${res.statusText}`);
        return false;
    }
}
export async function getFavoriteTeams(onerr?:(res:Response,text:string)=>void){
    let token = useUserStore()?.token;
    if(!token) return [];
    
    let res = await fetch(serverUrl+"/favorite-teams",{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    if(res.ok){
        let data = await res.json();
        console.log("favorite teams",data?.favoriteTeams);
        return (data.favoriteTeams as string[]).map(Number);
    }
    else{
        console.warn(`Error ${res.status} ${res.statusText} while trying to get favorite teams`);
        if(onerr) onerr(res,`Error while trying to get favorite teams; ${res.status} ${res.statusText}`);
    }
    return [];
}