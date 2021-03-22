import Vue from 'vue'
import Vuex from 'vuex'
import { MainVuexState } from '../types'
import * as sequence from '@/store/modules/sequence.js'
import * as path from '@/store/modules/path.js'
import * as module from '@/store/modules/module.js'
import * as pset from '@/store/modules/pset.js'
import Utils from '@/lib/utils.ts'

Vue.use(Vuex)

/* async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
} */

const state: MainVuexState = {
  //selected node information
  selectedNodeType: '',
  selectedNodeName: '',
  selectedNodeId: -1,
  selectedNodeParamLength: 0,
  selectedNodeParentId: 0,
  //node ID to Object map containing (type, name, itemChildrenLength, parentNodeId) with node id as key
  nodeIDToVuexObjectMap: {},
  //node ID to Object map containing all information about every node in the configuration tree
  nodeIDToNodeObjectMap: {},
  //arrays with node id's - open nodes and forced open nodes
  openNodeIds: [],
  forcedOpenNodeIds: [],
  forcedActiveNodeId: 0,
  //content of the opened JSON file
  openFileContent: '',
  darkMode: false,
  //global node ID counter
  idCounter: 0,
  //snackbar variables
  snackBarOpen: false,
  snackBarText: '',
  snackBarColor: '',
  token: ''
}

export default new Vuex.Store({
  modules: {
    sequence,
    path,
    module,
    pset,
  },
  state,	
  mutations: {
    SET_SELECTED_NODE_VIA_ID(state, payload) {
      //console.log('SELECTED NODE ID: ' + payload.selectedNodeId)
      state.selectedNodeId = payload.selectedNodeId //get all info just via ID
      //console.log(typeof state.selectedNodeId)
      console.log(
        'state.nodeIDToVuexObjectMap[payload.selectedNodeId]' +
          JSON.stringify(state.nodeIDToVuexObjectMap[payload.selectedNodeId])
      )
      state.selectedNodeType =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].type
      state.selectedNodeName =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].name
      console.log('state.selectedNodeName ' + state.selectedNodeName)
      state.selectedNodeParamLength =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].itemChildrenLength
      state.selectedNodeParentId =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].parentNodeId
      let forceOpenNode = payload.forceOpenNode //if node is opened by foce open it's parent as well

      console.log('FORCED OPEN NODE: ' + forceOpenNode)
      if (forceOpenNode) {
        state.forcedActiveNodeId = state.selectedNodeId
        //console.log('FORCED NODE ID: ' + state.forcedActiveNodeId)
      }
      //TODO FIX LEAF SEQUENCE DISPLAYING
      /*    if (state.selectedNodeParamLength == 0) {
        console.log('ITEM CHILDREN ZERO!')
        return
      } */

      let idIndex = state.openNodeIds.indexOf(payload.selectedNodeId)
      //console.log('SELECTED NODE ID: ' + state.selectedNodeId)
      //console.log('OPEN NODES BEFORE: ' + state.openNodeIds)
      //console.log('IDINDEX: ' + idIndex)

      if (idIndex == -1) {
        //console.log('OVDE USAO')
        if (forceOpenNode) {
          //if force is enwoked both node and it's parent have to be opened
          //console.log('SELECTED NODE TYPE: ' + state.selectedNodeType)

          //console.log('PARENT NODE ID: ' + state.selectedNodeParentId)
          let parentNodeIndex = state.openNodeIds.indexOf(
            state.selectedNodeParentId
          )
          console.log('PARENT NODE INDEX: ' + parentNodeIndex)
          if (parentNodeIndex == -1) {
            //push parent node on array as well
            state.openNodeIds.push(state.selectedNodeParentId)
          }
          //else do nothing (TODO MAYBE FOCUS OR ACTIVATE)
        }
        state.openNodeIds.push(state.selectedNodeId)
      } else {
        if (forceOpenNode) {
          //if force is enwoked both node and it's parent have to be opened
          //console.log('PARENT NODE ID: ' + state.selectedNodeParentId)

          let parentNodeIndex = state.openNodeIds.indexOf(
            state.selectedNodeParentId
          )
          console.log('PARENT NODE INDEX: ' + parentNodeIndex)
          if (parentNodeIndex == -1) {
            //push parent node on array as well
            state.openNodeIds.push(state.selectedNodeParentId)
          }
          //else do nothing (both nodes are already open - TODO MAYBE FOCUS OR ACTIVATE)
        }
        //console.log('SPLICE')
        state.openNodeIds.splice(idIndex, 1) //close the node if already open
      }

      //console.log('OPEN NODES AFTER: ' + state.openNodeIds)
      if (forceOpenNode) {
        //console.log('FORCED OPEN!')
        state.forcedOpenNodeIds = [...state.openNodeIds] //cannot assign by reference, but copy whole array
      }
      //state.openNodeIds = [1]
    },
    SET_ID_TO_VUEX_OBJECT_MAP(state, payload) {
      state.nodeIDToVuexObjectMap = payload
      /*      console.log(
        'nodeIDToVuexObjectMap:' + JSON.stringify(state.nodeIDToVuexObjectMap)
      ) */
    },
    SET_ID_TO_NODE_OBJECT_MAP(state, payload) {
      state.nodeIDToNodeObjectMap = payload
    },
    CREATE_NODE_ID_TO_OBJECT_REFERENCES(state) {
      console.log('CREATING REFERENCES')
      //now pass through all the parameters of
      for (const [key, value] of Object.entries(state.nodeIDToNodeObjectMap)) {
        if (Number.parseInt(key) < 100) {
          if (value) console.log('KEY: ' + key)
          console.log('VALUE: ' + JSON.stringify(value))
        }
      }
    },
    APPEND_ID_TO_OBJECT_MAP(state, payload) {
      /* console.log('APPEND_ID_TO_OBJECT_MAP')
      console.log(
        'payload.nodeIDToObject' + JSON.stringify(payload.nodeIDToObject)
      )
      console.log('payload.id ' + payload.id) */
      state.nodeIDToVuexObjectMap[payload.id] = payload.nodeIDToObject
      /*   console.log(
        'nodeIDToVuexObjectMap:' + JSON.stringify(state.nodeIDToVuexObjectMap)
      ) */
    },
    REMOVE_ID_OBJECT_FROM_MAP(state, payload) {
      delete state.nodeIDToVuexObjectMap[payload]
    },
    SET_INITIAL_ID_COUNTER(state, payload) {
      console.log('SETTING INITIAL ID COUNTER: ' + payload)
      state.idCounter = payload
    },
    INCREMENT_ID_COUNTER(state) {
      console.log('INCREMENTING ID COUNTER')
      state.idCounter++
    },
    SET_OPEN_FILE_CONTENT(state, payload) {
      //console.log('SETTING OPEN FILE CONTENT:')
      state.openFileContent = payload
      //console.log('OPEN FILE CONTENT SET:' + payload)
    },
    SET_DARK_MODE(state, payload) {
      state.darkMode = payload
    },
    SET_TOKEN(state, payload) {
      state.token = payload
    },
    SET_SNACKBAR_TEXT(state, payload) {
      state.snackBarOpen = true
      console.log('SNACKBAR COLOR: ' + payload.snackBarColor)
      state.snackBarText = payload.snackBarText
      state.snackBarColor = payload.snackBarColor
      Utils.sleep(4000).then(() => {
        state.snackBarOpen = false
      })
    },
    SET_SNACKBAR_OPEN(state, payload) {
      state.snackBarOpen = payload
    },
  },
  actions: {
    createNodeIDToVuexObjectMap({ commit }, nodeIDToVuexObjectMap) {
      commit('SET_ID_TO_VUEX_OBJECT_MAP', nodeIDToVuexObjectMap)
    },
    createNodeIDToNodeObjectMap({ commit }, nodeIDToNodeObjectMap) {
      commit('SET_ID_TO_NODE_OBJECT_MAP', nodeIDToNodeObjectMap)
      commit('CREATE_NODE_ID_TO_OBJECT_REFERENCES')
    },
    createObjectReferences({ commit }) {
      commit('CREATE_NODE_ID_TO_OBJECT_REFERENCES')
    },
    appendNodeIDToObjectMap({ commit }, nodeIDToObject) {
      commit('APPEND_ID_TO_OBJECT_MAP', nodeIDToObject)
    },
    removeNodeIDObjectFromMap({ commit }, payload) {},
    setSelectedNodeViaID({ commit }, payload) {
      commit('SET_SELECTED_NODE_VIA_ID', payload)
    },
    setInitialIDCounter({ commit }, payload) {
      commit('SET_INITIAL_ID_COUNTER', payload)
    },
    incrementIDCounter({ commit }) {
      commit('INCREMENT_ID_COUNTER')
    },
    setOpenFileContent({ commit }, payload) {
      commit('SET_OPEN_FILE_CONTENT', payload)
    },
    setDarkMode({ commit }, payload) {
      commit('SET_DARK_MODE', payload)
    },
    setToken({ commit }, payload) {
      commit('SET_TOKEN', payload)
    },
    setSnackBarText({ commit }, payload) {
      commit('SET_SNACKBAR_TEXT', payload)
    },
    setSnackBarOpen({ commit }, payload) {
      console.log('CLOSING SNACKBAR')
      commit('SET_SNACKBAR_OPEN', payload)
    },
  },
  getters: {
    getSelectedNodeType(state) {
      return state.selectedNodeType
    },
    getSelectedNodeName(state) {
      return state.selectedNodeName
    },
    getSelectedNodeId(state) {
      return state.selectedNodeId
    },
    getSelectedNodeParamLength(state) {
      return state.selectedNodeParamLength
    },
    getNodeIDToVuexObjectMap(state) {
      return state.nodeIDToVuexObjectMap
    },
    getIDCounter(state) {
      return state.idCounter
    },
    getOpenNodeIds(state) {
      //console.log('openNodeIds FIRED')
      //console.log('openNodeIds:' + state.openNodeIds)
      //sleep(2000).then(() => {
      //have a little delay to avoid race condition
      //console.log('DELAY CALLED')
      return state.openNodeIds
      //})
    },
    getForcedOpenNodeIds(state) {
      return state.forcedOpenNodeIds
    },
    getForcedActiveNodeId(state) {
      return state.forcedActiveNodeId
    },
    getOpenNodeIdsLength(state) {
      //console.log('openNodeIds.length FIRED')
      //console.log('openNodeIds:' + state.openNodeIds)
      return state.openNodeIds.length
    },
    getOpenFileContent(state) {
      //console.log('GET OPEN FILE CONTENT: ' + state.getOpenFileContent)
      return state.openFileContent
    },
    getDarkMode(state) {
      return state.darkMode
    },
    getSnackBarOpen(state) {
      return state.snackBarOpen
    },
    getSnackBarText(state) {
      return state.snackBarText
    },
    getSnackBarColor(state) {
      //console.log('SNACKBAR COLOR: ' + state.snackBarColor)
      return state.snackBarColor
    },
    getToken(state) {
      return state.token
    },
  },
})
