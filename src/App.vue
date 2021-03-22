<template>
  <v-app>   
    <v-container>
      <v-toolbar :dark="getDarkMode">
        <v-app-bar-nav-icon> </v-app-bar-nav-icon>
        <v-file-input
          v-model="file"
          label="Select config file..."
        ></v-file-input>
        <v-btn color="primary" @click="onUpload">Open</v-btn>

        <v-spacer></v-spacer>
        <v-toolbar-title>ConfDB</v-toolbar-title>

        <v-switch
          :value="getDarkMode"
          :label="`Dark mode`"
          @click="switchDarkMode"
        ></v-switch>
      </v-toolbar>
      <v-row>
        <v-col>
          <v-card
            class="v-card-treeview"
            ref="mainTreeView"
            outlined
            tile
            :dark="getDarkMode"
          >
            <TreeView />
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="pa-2, v-card-tableview"
            ref="mainTableView"
            outlined
            tile
            :dark="getDarkMode"
          >
            <TableView />
          </v-card>
          <v-divider></v-divider>
          <v-card
            class="pa-2, v-card-snippetview"
            ref="mainSnippetView"
            outlined
            tile
            :dark="getDarkMode"
          >
            <SnippetView />
          </v-card>
        </v-col>
      </v-row>
      <v-btn small @click="testFunctionMA()">Test function main APP</v-btn>
      <NotificationSnackBar />
      
    </v-container>
  </v-app> 
</template>

<script lang="ts">
import TreeView from './components/TreeView.vue'
import TableView from './components/TableView.vue'
import SnippetView from './components/SnippetView.vue'
import NotificationSnackBar from './components/NotificationSnackBar.vue'
import FileUploadService from '@/services/FileUploadService.js'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      getDarkMode: 'getDarkMode',
    }),
  },
  components: {
    TreeView,
    TableView,
    SnippetView,
    NotificationSnackBar,  
  },
})
export default class App extends Vue {
  @Prop(Object) readonly keycloak: Record<string, any> | undefined	
  private name: any = 'App'
  private file: any = null
  private fileContent: any = null
  //private darkMode: boolean = true
  private getDarkMode!: any[]

  public mounted() {}

  public onUpload() {
    //console.log(this.file)
//   console.log('HOME RECEIVED KEYTOKEN: ' + JSON.stringify(this.$store.getters.getToken));
     console.log('HOME RECEIVED KEYTOKEN: ' + JSON.stringify(this.keycloak));
    FileUploadService.uploadFile(this.file,this.keycloak.idToken) 
  }

  public switchDarkMode() {
    let darkMode = this.getDarkMode
    this.$store.dispatch('setDarkMode', !darkMode)
  }

  public testFunctionMA() {
    //@ts-ignore
    this.$refs.mainTreeView.$el.scrollTop = 300
    //@ts-ignore
    console.log(this.$refs.mainTreeView.$el)
  }
}
</script>

<style lang="scss" scoped>
[confdb] {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;

  [workspace] {
    flex: 1;
    overflow: auto; // fixes bug where resizing to smaller size malfunctions in goldenlayout
  }
}
.v-card-treeview {
  overflow: auto;
  max-height: 1000px;
  height: 1000px;
  //max-width: 750px;
}
.v-card-tableview {
  overflow: auto;
  max-height: 500px;
  height: 500px;
  //max-width: 750px;
}
.v-card-snippetview {
  overflow: auto;
  max-height: 490px;
  height: 490px;
  margin-top: 10px;
  //max-width: 750px;
}
</style>
