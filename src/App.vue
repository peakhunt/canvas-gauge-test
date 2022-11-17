<template>
  <v-app>
		<v-navigation-drawer 
     v-model="drawer"
     :mini-variant.sync="mini"
     permanent
     app
     dark
    >
			<v-list-item>
        <v-list-item-avatar>
          <v-img :src="require('@/assets/logo.svg')"/>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <strong class="mr-1 font-weight-black">Tester</strong>
          </v-list-item-title>
        </v-list-item-content>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider class="mx-3 mb-2" />

			<v-list
       expand
       nav
      >
        <v-list-item
         v-for="item in navItems"
         :key="item.title"
         :to="item.to"
         active-class="primary white--text"
         class="py-1"
        >
          <v-list-item-icon class="my-2 align-self-center">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider class="mx-3 mb-2" />
		</v-navigation-drawer>

		<v-app-bar
     app
     fixed
     elevate-on-scroll
     class="v-bar--underline"
     color="white"
     :clipped-left="$vuetify.rtl"
     :clipped-right="!$vuetify.rtl"
     outlined
     rounded
     elevation-13
    >
      <v-spacer/>
		</v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
// import {  ipcRenderer } from 'electron'

export default {
  name: 'App',

  data: () => ({
		drawer: true,
		mini: false,
		navItems: [
      {
        icon: 'mdi-view-dashboard',
        title: 'Home',
        to: '/',
      },
    ],
  }),
};
</script>
