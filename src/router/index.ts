import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import JoinView from "@/views/JoinView.vue";
import LogInView from "@/views/LogInView.vue";
import MainView from "@/views/MainView.vue";
import Hero from "@/components/Hero.vue";
import TeamDetails from "@/components/TeamDetails.vue";
import Empty from "@/components/Empty.vue";
import PlayerDetails from "@/components/PlayerDetails.vue";
import GameDetails from "@/components/GameDetails.vue";
import ProfileView from "@/views/ProfileView.vue";
import PlaceBetView from "@/views/PlaceBetView.vue";
import BetsView from "@/views/BetsView.vue";
import BetDetails from "@/components/BetDetails.vue";
import { useUserStore } from "@/stores/user";
import FavoritesView from "@/views/FavoritesView.vue";
import DetailsPanelWrapper from "@/components/DetailsPanelWrapper.vue";

const router = createRouter({
	// history: createWebHistory(import.meta.env.BASE_URL),
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
			meta:{
				noAuth:true
			}
		},
		{
			path: "/join",
			name: "join",
			component: JoinView,
			meta:{
				noAuth:true
			}
		},
		{
			path: "/login",
			name: "login",
			component: LogInView,
			meta:{
				noAuth:true
			}
		},
		{	
			path:"/profile",
			name:"profile",
			component: ProfileView
		},
		{
			path: "/main",
			component: MainView,
			props:true,
			children:[
				{
					path:"team/:teamId",
					components:{
						details:TeamDetails
					},
					props:true,
					meta:{
						typeI:0
					}
				},
				{
					path:"game/:gameId",
					components:{
						details:GameDetails
					},
					props:true,
					meta:{
						typeI:1
					}
				},
				{
					path:"/byplayer/:playerId/:playerName/",
					components:{
						details:Empty
					},
					props:true,
					meta:{
						typeI:1
					}
				},
				{
					path:"/byplayer/:playerId/:playerName/:gameId",
					components:{
						details:GameDetails
					},
					props:true,
					meta:{
						typeI:1
					}
				},
				{
					path:"player/:playerId",
					components:{
						details:PlayerDetails
					},
					props:true,
					meta:{
						typeI:2
					}
				},
				{
					path:"",
					name: "main",
					components:{
						details:Empty
					},
					meta:{
						typeI:0
					}
				},
				{
					path:"game",
					components:{
						details:Empty
					},
					meta:{
						typeI:1
					}
				},
				{
					path:"player",
					components:{
						details:Empty
					},
					meta:{
						typeI:2
					}
				}
			]
		},
		{
			path:"/placebet/:playerId/:playerName/:gameId",
			name:"placebet",
			component:PlaceBetView,
			props:true
		},
		{
			path:"/bets",
			name:"bets",
			component:BetsView,
			children:[
				{
					path:"details",
					name:"betdetails",
					components:{
						details:BetDetails
					}
				}
			]
		},
		{
			path:"/favorites",
			// name:"favorites",
			component:FavoritesView,
			redirect:{name:"favorites"},
			children:[
				{
					path:"team",
					name:"favorites",
					components:{
						details:DetailsPanelWrapper
					},
					meta:{
						typeI:0
					}
				},
				{
					path:"team/:teamId",
					components:{
						details:DetailsPanelWrapper
					},
					meta:{
						typeI:0
					},
					props:true
				},
				{
					path:"player",
					components:{
						details:DetailsPanelWrapper
					},
					meta:{
						typeI:1
					}
				},
				{
					path:"player/:playerId",
					components:{
						details:DetailsPanelWrapper
					},
					meta:{
						typeI:1
					},
					props:true
				}
			]
		}
	],
})

export default router;

export function registerRouterGuards(){
	const userStore = useUserStore();

	// global nav guard
	router.beforeEach(async (to,from)=>{
		// 404 to home
		if(to.matched.length == 0){
			if(userStore.token){
				return "/main";
			}
			return "/";
		}
		
		if(!to.meta.noAuth){ // no auth to home
			if(userStore.token) return;
			return "/";
		}
		else{ // auth to main
			if(userStore.token) return "/main";
			return;
		}
	});
}