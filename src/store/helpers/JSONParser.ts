import { NodeObject } from '@/types'
import Utils from '@/lib/utils'
//const stringifyObject = require('stringify-object')

/*
  id: number
  name: string
  type: string
  globalType: string
  children: Array<NodeObject>
  parentNodeId: number //parent node ID of current node
  rootNodeId: number //ID of the root node that references this node
  referencedByIds: Array<number>
  iconType: string
  iconColor: string
  paremeterJSONValue: any //valid only for parameter nodes
  ctype: string
  ptype: string
*/
export default {
  parseMapToJSON(nodeIDToNodeObjectMap: Map<number, NodeObject>): string {
    let savedFileContentObject: Object = {
      configuration: {
        seqs: {},
        paths: {},
        mods: {},
        psets: {},
      },
    }
    let sequencesObject: Object = {}
    let pathsObject: Object = {}
    let modulesObject: Object = {}
    let psetsObject: Object = {}

    //parse the map here
    for (const [nodeId, nodeObject] of Object.entries(
      nodeIDToNodeObjectMap as Map<number, NodeObject>
    )) {
      /*      console.log('OUTER KEY: ' + nodeId)
      console.log('VALUE ID: ' + value.id) */
      if (
        nodeIDToNodeObjectMap[nodeId].globalType == 'sequenceNode' //main sequence node
      ) {
        sequencesObject[nodeIDToNodeObjectMap[nodeId].name] = []
        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[nodeId].children
        )) {
          let childrenObject = Array()
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].type)
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].name)
          sequencesObject[nodeIDToNodeObjectMap[nodeId].name].push(
            childrenObject
          )
        }
      } else if (
        nodeIDToNodeObjectMap[nodeId].globalType == 'pathNode' //main path node
      ) {
        pathsObject[nodeIDToNodeObjectMap[nodeId].name] = []
        //now go through all path children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[nodeId].children
        )) {
          let childrenObject = Array()
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].type)
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].name)
          pathsObject[nodeIDToNodeObjectMap[nodeId].name].push(childrenObject)
        }
      } else if (
        nodeIDToNodeObjectMap[nodeId].globalType == 'moduleNode' //main module node
      ) {
        let moduleObject: Object = { params: {}, ctype: '', pytype: '' }

        //now go through all module children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[nodeId].children
        )) {
          let paramObject: Object = {}
          paramObject['type'] =
            nodeIDToNodeObjectMap[nodeId].children[key1].type
          if (
            paramObject['type'] == 'cms.VPSet' ||
            paramObject['type'] == 'cms.PSet'
          ) {
            //parse children here recursivly to elementary parameter objects
            this.parseRecursiveVPSetObject(
              paramObject,
              nodeIDToNodeObjectMap[nodeId].children[key1].children
            )
            moduleObject['params'][
              nodeIDToNodeObjectMap[nodeId].children[key1].name
            ] = paramObject
          } else {
            paramObject['value'] =
              nodeIDToNodeObjectMap[nodeId].children[key1].paremeterJSONValue

            moduleObject['params'][
              nodeIDToNodeObjectMap[nodeId].children[key1].name.substring(
                0,
                nodeIDToNodeObjectMap[nodeId].children[key1].name.length - 3
              )
            ] = paramObject
          }
        }
        moduleObject['ctype'] = nodeIDToNodeObjectMap[nodeId].ctype
        moduleObject['pytype'] = nodeIDToNodeObjectMap[nodeId].pytype
        modulesObject[nodeIDToNodeObjectMap[nodeId].name] = moduleObject
      } else if (
        nodeIDToNodeObjectMap[nodeId].globalType == 'psetNode' //main module node
      ) {
        let psetObject: Object = {}
        //now go through all module children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[nodeId].children
        )) {
          let paramObject: Object = {}
          paramObject['type'] =
            nodeIDToNodeObjectMap[nodeId].children[key1].type
          if (
            paramObject['type'] == 'cms.VPSet' ||
            paramObject['type'] == 'cms.PSet'
          ) {
            //parse children here recursivly to elementary parameter objects
            this.parseRecursiveVPSetObject(
              paramObject,
              nodeIDToNodeObjectMap[nodeId].children[key1].children
            )
            psetObject[
              nodeIDToNodeObjectMap[nodeId].children[key1].name
            ] = paramObject
          } else {
            paramObject['value'] =
              nodeIDToNodeObjectMap[nodeId].children[key1].paremeterJSONValue

            psetObject[
              nodeIDToNodeObjectMap[nodeId].children[key1].name
            ] = paramObject
          }
        }
        psetsObject[nodeIDToNodeObjectMap[nodeId].name] = psetObject
      }
    }

    savedFileContentObject['configuration']['seqs'] = sequencesObject
    savedFileContentObject['configuration']['paths'] = pathsObject
    savedFileContentObject['configuration']['mods'] = modulesObject
    savedFileContentObject['configuration']['psets'] = psetsObject
    let savedFileContent = JSON.stringify(savedFileContentObject, undefined, 2)
    return savedFileContent
  },
  parseRecursiveVPSetObject(
    parameterObject: Object,
    children: Array<NodeObject>
  ) {
    if (children.length == 0) {
      if (parameterObject['type'] == 'cms.PSet') parameterObject['value'] = [{}]
      else if (parameterObject['type'] == 'cms.VPSet')
        parameterObject['value'] = []
      return
    }
    let vpSetObjectArray: Array<Object> = []

    let vpSetObject: Object = {}
    //console.log('children.length' + children.length)

    for (const [key, childObject] of Object.entries(children)) {
      //console.log('KEY:' + key)
      //console.log('VALUE : ' + JSON.stringify(childObject))
      let vPSetParamObject: Object = {}
      if (childObject.name == 'PSet') {
        //no named PSets
        this.parseRecursiveVPSetObject(vPSetParamObject, childObject.children)
        vpSetObjectArray.push(vPSetParamObject)
      } else {
        vPSetParamObject['type'] = childObject.type
        if (
          vPSetParamObject['type'] == 'cms.VPSet' ||
          vPSetParamObject['type'] == 'cms.PSet'
        ) {
          this.parseRecursiveVPSetObject(vPSetParamObject, childObject.children)
          vpSetObject[childObject.name] = vPSetParamObject
        } else {
          //basic types
          vPSetParamObject['value'] = childObject.paremeterJSONValue
          vpSetObject[
            childObject.name.substring(0, childObject.name.length - 3)
          ] = vPSetParamObject
        }
      }
    }
    if (parameterObject['type'] != undefined) {
      //if it's not empty PSet push object in array
      if (!Utils.isEmpty(vpSetObject)) vpSetObjectArray.push(vpSetObject)
      parameterObject['value'] = vpSetObjectArray
    } else {
      parameterObject = Object.assign(parameterObject, vpSetObject) //oterwise just assign object
    }
  },
}
