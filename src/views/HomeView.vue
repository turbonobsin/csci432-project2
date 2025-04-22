<script setup lang="ts">
import Header from '@/components/Header.vue';
import Hero from '@/components/Hero.vue';
</script>

<template>
	<Header>
		<nav>
			<RouterLink to="/join">Join</RouterLink>
		</nav>
	</Header>
	<main id="main">
		<Hero></Hero>
	</main>
</template>

<style scoped>
body{
	/* background:repeating-linear-gradient(whitesmoke 0px, whitesmoke 1px, transparent 1px, transparent 20px); */
	/* background-repeat: repeat; */
}
</style>
