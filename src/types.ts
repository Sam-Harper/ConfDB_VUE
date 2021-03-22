export interface MainVuexState {
  selectedNodeType: string
  selectedNodeName: string
  selectedNodeId: number
  selectedNodeParamLength: number
  selectedNodeParentId: number
  nodeIDToVuexObjectMap: Object
  nodeIDToNodeObjectMap: Object
  openNodeIds: Array<number>
  forcedOpenNodeIds: Array<number>
  forcedActiveNodeId: number
  openFileContent: string
  darkMode: boolean
  idCounter: number
  snackBarOpen: boolean
  snackBarText: string
  snackBarColor: string
  token : string
}
//TODO
export interface NodeObject {}
