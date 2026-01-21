// JSON 生成器 - 将 X6 图形数据转换为兼容格式的 JSON
import { nanoid } from 'nanoid'
import { NODE_TYPES } from '../templates/formulas'

/**
 * 生成完整的 JSON 配置
 * @param {Object} graphData - X6 图形数据 { nodes, edges }
 * @param {Object} pointConfigs - 点名配置 { nodeConfigs, numberConfig }
 * @param {Number} deviceCount - 设备数量
 * @param {Object} template - 当前使用的模板
 * @returns {Object} - 生成的 JSON 数据
 */
export function generateJSON(graphData, pointConfigs, deviceCount, template) {
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return { cells: [] }
  }

  const cells = []
  let globalSn = 1
  const yOffset = 500 // 每组设备的垂直间距

  // 如果是求和模板，只生成一次
  if (template?.isSingleOutput) {
    const result = generateSingleGroup(graphData, pointConfigs, globalSn, { x: 0, y: 0 })
    return { cells: result.cells }
  }

  // 批量生成
  for (let i = 0; i < deviceCount; i++) {
    const deviceNumber = (pointConfigs.numberConfig?.start || 1) + i
    const offset = { x: 0, y: i * yOffset }

    const result = generateSingleGroup(
      graphData,
      pointConfigs,
      globalSn,
      offset,
      deviceNumber,
      pointConfigs.numberConfig?.digits || 3
    )

    cells.push(...result.cells)
    globalSn = result.nextSn
  }

  return { cells }
}

/**
 * 生成单组设备的节点和连线
 */
function generateSingleGroup(graphData, pointConfigs, startSn, offset, deviceNumber, digits = 3) {
  const cells = []
  const idMap = {} // 原始ID -> 新ID
  const portIdMap = {} // 原始端口ID -> 新端口ID
  let sn = startSn

  // 格式化设备编号
  const paddedNumber = deviceNumber ? String(deviceNumber).padStart(digits, '0') : ''

  // 先生成所有节点
  graphData.nodes.forEach(node => {
    const newNodeId = nanoid()
    idMap[node.id] = newNodeId

    const nodeCell = createNodeCell(node, newNodeId, sn, offset, paddedNumber, pointConfigs)

    // 建立端口ID映射
    if (node.ports) {
      node.ports.forEach((port, index) => {
        const newPortId = nanoid()
        portIdMap[port.id] = newPortId
        if (nodeCell.ports?.items?.[index]) {
          nodeCell.ports.items[index].id = newPortId
        }
      })
    }

    cells.push(nodeCell)
    sn++
  })

  // 再生成所有连线（放在节点前面，zIndex: 0）
  const edges = []
  graphData.edges.forEach(edge => {
    const newEdgeId = nanoid()
    const sourceNodeId = idMap[edge.source]
    const targetNodeId = idMap[edge.target]
    const sourcePortId = portIdMap[edge.sourcePort]
    const targetPortId = portIdMap[edge.targetPort]

    if (sourceNodeId && targetNodeId && sourcePortId && targetPortId) {
      edges.push({
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8
            }
          }
        },
        id: newEdgeId,
        zIndex: 0,
        source: {
          cell: sourceNodeId,
          port: sourcePortId
        },
        target: {
          cell: targetNodeId,
          port: targetPortId
        }
      })
    }
  })

  // 边放在前面
  return {
    cells: [...edges, ...cells],
    nextSn: sn
  }
}

/**
 * 创建节点 cell 数据
 */
function createNodeCell(node, newId, sn, offset, paddedNumber, pointConfigs) {
  const nodeData = node.data || {}
  const nodeConfig = pointConfigs.nodeConfigs?.[node.id] || {}
  const typeConfig = NODE_TYPES[nodeData.sysmbol] || {}

  // 计算实际位置
  const position = {
    x: (node.position?.x || 0) + offset.x,
    y: (node.position?.y || 0) + offset.y
  }

  // 处理点名
  let tag = nodeConfig.tagTemplate || nodeData.extends?.tag || ''
  if (tag && paddedNumber && !nodeConfig.fixedTag) {
    // 如果节点有固定编号，使用固定编号
    if (nodeConfig.fixedIndex) {
      const fixedPaddedNumber = String(nodeConfig.fixedIndex).padStart(pointConfigs.numberConfig?.digits || 3, '0')
      tag = tag.replace(/{N}/g, fixedPaddedNumber)
    } else {
      tag = tag.replace(/{N}/g, paddedNumber)
    }
  }

  // 生成显示文本
  let displayText = tag || nodeData.value || nodeData.sysmbol || ''
  if (tag) {
    displayText = `${tag}-${sn}`
  } else if (nodeData.value) {
    displayText = `${nodeData.value}-${sn}`
  } else {
    displayText = `${nodeData.sysmbol}-${sn}`
  }

  // 构建节点数据
  const isOperator = nodeData.model === '算术运算'
  const isInput = nodeData.model === '输入块'
  const isOutput = nodeData.model === '输出块'

  // 端口配置
  const portsConfig = buildPortsConfig(node, isOperator, isInput, isOutput, typeConfig)

  const cell = {
    position,
    size: {
      width: node.size?.width || (isOperator ? 80 : 100),
      height: node.size?.height || (isOperator ? 42 : 22)
    },
    attrs: {
      text: {
        text: displayText
      },
      sncircle: {
        r: 0
      }
    },
    visible: true,
    shape: isOperator ? 'op-rect' : 'op-rect-io',
    resize: !isOperator,
    ports: portsConfig,
    id: newId,
    desc: '',
    data: {
      id: '',
      model: nodeData.model,
      modelId: nodeData.modelId,
      name: nodeData.name,
      sysmbol: nodeData.sysmbol,
      sn1: null,
      sn: sn
    },
    zIndex: sn
  }

  // 输入输出块添加 extends
  if (isInput || isOutput) {
    cell.data.extends = {
      category: '',
      tag: tag,
      desc: ''
    }
    cell.data.isEnabled = false
  }

  return cell
}

/**
 * 构建端口配置
 */
function buildPortsConfig(node, isOperator, isInput, isOutput, typeConfig) {
  const groups = {
    in: {
      position: isOperator ? 'left' : 'right',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#31d0c6',
          fill: '#fff',
          strokeWidth: 2
        }
      }
    },
    out: {
      position: isOperator ? 'right' : 'left',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#31d0c6',
          fill: '#fff',
          strokeWidth: 2
        }
      }
    }
  }

  // 添加 label position 配置（运算块需要）
  if (isOperator) {
    groups.in.label = {
      position: {
        name: 'inside',
        args: {
          attrs: {
            text: {
              refX: 7,
              fontSize: 12
            }
          }
        }
      }
    }
    groups.out.label = {
      position: {
        name: 'inside',
        args: {
          attrs: {
            text: {
              refX: -7,
              fontSize: 12
            }
          }
        }
      }
    }
  }

  // 端口项
  const items = (node.ports || []).map(port => {
    const portData = port.data || {}
    return {
      group: isOperator
        ? (portData.kind === 'in' ? 'in' : 'out')
        : (portData.kind === 'in' ? 'out' : 'in'),
      attrs: {
        text: {
          text: portData.name || ''
        }
      },
      data: {
        dataType: portData.dataType || 'Double',
        desc: portData.desc || '',
        dv: portData.dv || '',
        kind: portData.kind || 'out',
        name: portData.name || ''
      },
      id: port.id // 这个会被外层替换
    }
  })

  return { groups, items }
}

/**
 * 验证图形数据是否有效
 */
export function validateGraphData(graphData) {
  const errors = []

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    errors.push('请先添加节点')
    return { valid: false, errors }
  }

  // 检查是否有输出节点
  const hasOutput = graphData.nodes.some(n => n.data?.sysmbol === 'MagusAO')
  if (!hasOutput) {
    errors.push('缺少输出节点 (MagusAO)')
  }

  // 检查是否有输入节点
  const hasInput = graphData.nodes.some(n =>
    n.data?.sysmbol === 'MagusAI' || n.data?.sysmbol === 'AIEXP'
  )
  if (!hasInput) {
    errors.push('缺少输入节点')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
