<template>
  <q-layout ref="layout" view="hHh LpR lfr" class="bg-grey-4" :left-class="leftClass" :left-style="leftStyle">
    <!-- Header -->
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        龍達塑膠成型機生產管理系統
        <span slot="subtitle">Version 3.1</span>
      </q-toolbar-title>
    </q-toolbar>
    <div slot="left">
      <q-list separator>
        <!-- menu link -->
        <q-side-link item to="/test">
          <q-item-side class="fa fa-eye" />
          <q-item-main label="test" />
        </q-side-link>
        <q-side-link item to="/monitor">
          <q-item-side class="fa fa-eye" />
          <q-item-main label="機台監控" />
        </q-side-link>
        <q-collapsible label="生產報表">
          <q-item @open="showing = true">
            <q-item-side class="fa fa-table" />
            <q-item-main label="日" />
            <q-popover v-model="showing" touch-position style="width:80px;">
              <q-item to="/DailyReport" class="bg-blue">
                <font color="white">
                <q-item-side class="fa fa-table" />
                <q-item-main label="明細" />
                </font>
              </q-item>
              <q-item to="/IntegratedDailyReport" class="bg-blue">
                <font color="white">
                <q-item-side class="fa fa-table" />
                <q-item-main label="整合" />
                </font>
              </q-item>
            </q-popover>
          </q-item>
        </q-collapsible>
        <q-side-link item to="/ShiftTable1">
          <q-item-side class="fa fa-pencil" />
          <q-item-main label="班表" />
        </q-side-link>
        <q-side-link item to="/Register">
          <q-item-side class="fa fa-pencil" />
          <q-item-main label="資料登錄" />
        </q-side-link>
      </q-list>
    </div>
    <!-- Right Side Panel
    <div slot="right">
      Right Side of Layout
    </div>
    -->
    <!-- sub-routes get injected here: -->
    <router-view />
    <!-- Footer -->
    <!-- 
    <q-toolbar slot="footer">
      <q-toolbar-title>
        Layout Footer
      </q-toolbar-title>
    </q-toolbar>
    -->
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
      },
      showing: false
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
.q-item.router-link-active, .q-item:focus
  background: rgba(0,0,0,0);
.q-item-side
  color: white;
  min-width: 1em;
.layout-aside-left
  left: 0;
  width: 250px;
</style>