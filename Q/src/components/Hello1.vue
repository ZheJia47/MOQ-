<template>
  <q-layout ref="layout" view="hHh LpR lfr" class="bg-grey-4" :left-class="leftClass" :left-style="leftStyle">
    <!-- Header -->
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        龍達塑膠成型機生產管理系統
        <span slot="subtitle">Version 3.0</span>
      </q-toolbar-title>
    </q-toolbar>
    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->
<!--
      <q-list no-border link inset-delimiter>-->
		<q-list separator>
        <q-list-header>Essential Links</q-list-header>
		<q-side-link item to="/ShiftTable1">
          <q-item-side class="fa fa-pencil" />
          <q-item-main label="班表" />
        </q-side-link>
        <q-item @click="launch('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click="launch('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click="launch('https://gitter.im/quasarframework/Lobby')">
          <q-item-side icon="chat" />
          <q-item-main label="Gitter Channel" sublabel="Quasar Lobby" />
        </q-item>
        <q-item @click="launch('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item>
      </q-list>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <div class="layout-padding logo-container non-selectable no-pointer-events">
      <div class="logo" :style="position">
        <img src="~assets/quasar-logo-full.svg">
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      leftClass: {
        'bg-dark': true,
        'text-white': true
      },
      leftStyle: {
        'width': '10em'
      },
      sideBarShow: {
        report: false
      }
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="stylus">
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
</style>
