<script setup lang="ts">
import Header from '@/components/Header.vue';
import Hero from '@/components/Hero.vue';
</script>

<template>
	<Header>
		<nav>
			<RouterLink class="button" to="">Link 1</RouterLink>
			<RouterLink to="">Link 2</RouterLink>
			<RouterLink to="">Link 3</RouterLink>
		</nav>
	</Header>
	<main id="main">
		<Hero></Hero>
	</main>
</template>

<style scoped>
</style>
