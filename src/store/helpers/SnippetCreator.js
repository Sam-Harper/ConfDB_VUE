/* eslint-disable no-unused-vars */
export default {
  buildRecursiveVPSetParameter(parameters, level) {
    let vPSetParameterText = ''
    let firstRow = true
    let cmsType = ''
    let tab = '&emsp;'

    if (JSON.stringify(parameters) != '[{}]' && firstRow) {
      vPSetParameterText += '</br>' + tab.repeat(level)
    }
    let paramCounter = 0

    for (const [key, value] of Object.entries(parameters)) {
      if (Object.entries(parameters).length > 1) {
        if (paramCounter == 0) {
          vPSetParameterText += 'cms.PSet(</br>' //nested no named PSet
          level++
          vPSetParameterText += tab.repeat(level)
        } else {
          vPSetParameterText += tab.repeat(level) + 'cms.PSet(</br>' //nested no named PSet
          level++
        }
      }
      paramCounter++

      for (const [key1, value1] of Object.entries(value)) {
        if (!firstRow) vPSetParameterText += tab.repeat(level)
        else firstRow = false

        vPSetParameterText += key1 + ' = '

        for (const [key2, value2] of Object.entries(value1)) {
          if (key2 == 'type') {
            cmsType = value2 //remember cms type for sets
            vPSetParameterText += value2 + '( '
          } else {
            if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
              if (cmsType == 'cms.string' || cmsType == 'cms.InputTag')
                vPSetParameterText += '"' + value2 + '" )</br>'
              else vPSetParameterText += value2 + ' )</br>'
            } else {
              //complicated set type needs deconstructing
              vPSetParameterText += this.buildRecursiveVPSetParameter(
                value2,
                level + 1
              )
            }
          }
        }
      }
      if (Object.entries(parameters).length > 1) {
        level--
        vPSetParameterText += tab.repeat(level) + ')</br>'
      }
    }

    vPSetParameterText += tab.repeat(level - 1) + ')' + '</br>'
    return vPSetParameterText
  },
  getModuleSnippet(moduleName, moduleParams) {
    let moduleSnippet = moduleName + ' = '
    let innerParameterText = ''
    let cmsType = ''
    let cType = ''

    for (const [key, value] of Object.entries(moduleParams)) {
      if (key == 'pytype') {
        moduleSnippet += 'cms.' + value + '( '
      } else if (key == 'params') {
        for (const [key1, value1] of Object.entries(value)) {
          innerParameterText += '&emsp;' + key1 + ' = ' //parameter name

          for (const [key2, value2] of Object.entries(value1)) {
            if (key2 == 'type') {
              cmsType = value2 //remember cms type for sets
              innerParameterText += value2 + '( '
            } else if (key2 == 'value') {
              if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
                if (cmsType == 'cms.string' || cmsType == 'cms.InputTag')
                  innerParameterText += '"' + value2 + '" )</br>'
                else innerParameterText += value2 + ' )</br>'
              } else {
                //complicated set type needs deconstructing
                innerParameterText += this.buildRecursiveVPSetParameter(
                  value2,
                  2
                )
              }
            }
          }
        }
      } else if (key == 'ctype') cType = '"' + value + '",</br>'
    }
    moduleSnippet = moduleSnippet + cType + innerParameterText
    moduleSnippet += ' )'

    return moduleSnippet
  },
  getPathSnippet(pathName, pathParams) {
    //console.log(path)
    //console.log(pathParams)
    //console.log('getPathSnippet CALLED!')
    let pathSnippet = pathName + ' = cms.Path('
    pathParams.forEach((val, key, pathParams) => {
      if (Object.is(pathParams.length - 1, key)) {
        pathSnippet += ' ' + val[1] + ' )'
      } else {
        pathSnippet += ' ' + val[1] + ' + '
      }
    })
    //console.log(pathSnippet)
    return pathSnippet
    //return JSON.stringify(pathParams)
  },
  getSequenceSnippet(sequenceName, sequenceParams) {
    //console.log(sequence)
    //console.log(sequenceParams)
    //console.log('getSequenceSnippet CALLED!')
    let sequenceSnippet = sequenceName + ' = cms.Sequence('
    if (sequenceParams.length == 0) sequenceSnippet += ')'
    else
      sequenceParams.forEach((val, key, sequenceParams) => {
        if (Object.is(sequenceParams.length - 1, key)) {
          sequenceSnippet += ' ' + val[1] + ' )'
        } else {
          sequenceSnippet += ' ' + val[1] + ' + '
        }
      })
    return sequenceSnippet
    //return JSON.stringify(sequenceParams)
  },
  getPSetSnippet(psetName, psetParams) {
    //console.log(psetName)
    //console.log(JSON.stringify(psetParams))
    //console.log('getPSetSnippet CALLED!')
    let psetSnippet = psetName + ' = '
    let innerParameterText = ''
    let cmsType = ''
    let cType = 'cms.PSet(</br>'

    /*     for (const [key, value] of Object.entries(psetParams)) {
      if (key == 'pytype') {
        psetSnippet += 'cms.' + value + '( '
      } else if (key == 'params') { */
    for (const [key1, value1] of Object.entries(psetParams)) {
      innerParameterText += '&emsp;' + key1 + ' = ' //parameter name

      for (const [key2, value2] of Object.entries(value1)) {
        if (key2 == 'type') {
          cmsType = value2 //remember cms type for sets
          innerParameterText += value2 + '( '
        } else if (key2 == 'value') {
          if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
            if (cmsType == 'cms.string' || cmsType == 'cms.InputTag')
              innerParameterText += '"' + value2 + '" )</br>'
            else innerParameterText += value2 + ' )</br>'
          } else {
            //complicated set type needs deconstructing
            innerParameterText += this.buildRecursiveVPSetParameter(value2, 2)
          }
        }
      }
      /*         }
      } else if (key == 'ctype') cType = '"' + value + '",</br>' */
    }
    psetSnippet = psetSnippet + cType + innerParameterText
    psetSnippet += ' )'

    return psetSnippet
  },
}
