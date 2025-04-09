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

const router = createRouter({
	// history: createWebHistory(import.meta.env.BASE_URL),
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/join",
			name: "join",
			component: JoinView
		},
		{
			path: "/login",
			name: "login",
			component: LogInView
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
		}
	],
})

export default router;
