import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import JoinView from "@/views/JoinView.vue";
import LogInView from "@/views/LogInView.vue";
import MainView from "@/views/MainView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
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
			path: "/main",
			name: "main",
			component: MainView
		}
	],
})

export default router;
