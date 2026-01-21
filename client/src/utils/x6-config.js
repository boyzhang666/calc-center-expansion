// X6 图形编辑器配置
import { Graph, Shape } from '@antv/x6'
import { NODE_TYPES } from '../templates/formulas'

// 注册自定义节点
export function registerCustomNodes() {
  // 输入输出块节点
  Graph.registerNode('op-rect-io', {
    inherit: 'rect',
    width: 180,
    height: 36,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        rx: 6,
        ry: 6
      },
      text: {
        fontSize: 12,
        fill: '#262626'
      }
    },
    ports: {
      groups: {
        in: {
          position: 'right',
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
          position: 'left',
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
    }
  }, true)

  // 运算块节点
  Graph.registerNode('op-rect', {
    inherit: 'rect',
    width: 80,
    height: 50,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        rx: 6,
        ry: 6
      },
      text: {
        fontSize: 12,
        fill: '#262626'
      }
    },
    ports: {
      groups: {
        in: {
          position: 'left',
          label: {
            position: {
              name: 'inside',
              args: {
                attrs: {
                  text: {
                    refX: 7,
                    fontSize: 10
                  }
                }
              }
            }
          },
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
          position: 'right',
          label: {
            position: {
              name: 'inside',
              args: {
                attrs: {
                  text: {
                    refX: -7,
                    fontSize: 10
                  }
                }
              }
            }
          },
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
    }
  }, true)
}

// 创建图形实例配置
export function getGraphConfig(container) {
  return {
    container,
    width: '100%',
    height: '100%',
    background: {
      color: '#f8fafc'
    },
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee',
          thickness: 1
        },
        {
          color: '#ddd',
          thickness: 1,
          factor: 4
        }
      ]
    },
    panning: {
      enabled: true,
      eventTypes: ['rightMouseDown', 'mouseWheel'],  // 改为右键拖拽画布，左键用于选中
      modifiers: 'shift'  // 或按住 Shift + 左键拖拽
    },
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3
    },
    connecting: {
      router: {
        name: 'manhattan',
        args: {
          padding: 1
        }
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          },
          zIndex: 0
        })
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF'
          }
        }
      }
    }
    // 注意：selecting, snapline, keyboard 需要通过插件方式启用
  }
}

// 根据节点类型创建节点配置
export function createNodeConfig(nodeType, templateNode) {
  const typeConfig = NODE_TYPES[nodeType]
  if (!typeConfig) return null

  const isIONode = typeConfig.shape === 'op-rect-io'
  const isOperator = typeConfig.shape === 'op-rect'

  // 计算节点高度（根据端口数量）
  const portCount = typeConfig.ports.length
  const nodeHeight = isOperator ? Math.max(50, portCount * 20 + 10) : 36

  // 创建端口配置
  const ports = typeConfig.ports.map((port, index) => {
    const actualGroup = isIONode ? (port.kind === 'in' ? 'out' : 'in') : (port.kind === 'in' ? 'in' : 'out')

    return {
      group: actualGroup,
      attrs: {
        text: {
          text: port.name
        }
      },
      data: {
        dataType: port.dataType,
        desc: port.desc,
        dv: port.dv || '',
        kind: port.kind,
        name: port.name
      }
    }
  })

  // 构建节点标签
  let label = templateNode?.label || typeConfig.sysmbol
  if (templateNode?.value) {
    label = templateNode.value
  }

  return {
    shape: typeConfig.shape,
    width: isIONode ? 180 : 80,
    height: nodeHeight,
    attrs: {
      body: {
        fill: `${typeConfig.color}15`,
        stroke: typeConfig.color
      },
      text: {
        text: label
      }
    },
    ports: {
      items: ports
    },
    data: {
      model: typeConfig.model,
      modelId: typeConfig.modelId,
      name: typeConfig.name,
      sysmbol: typeConfig.sysmbol,
      extends: templateNode?.tagTemplate ? {
        category: '',
        tag: templateNode.tagTemplate,
        desc: ''
      } : undefined,
      value: templateNode?.value,
      fixedIndex: templateNode?.fixedIndex,
      fixedTag: templateNode?.fixedTag
    }
  }
}

// 导出 JSON 格式化的节点数据
export function formatNodeForExport(node, sn) {
  const nodeData = node.getData() || {}
  const position = node.getPosition()
  const size = node.getSize()
  const ports = node.getPorts()

  return {
    position: {
      x: position.x,
      y: position.y
    },
    size: {
      width: size.width,
      height: size.height
    },
    attrs: {
      text: {
        text: node.attr('text/text') || ''
      },
      sncircle: {
        r: 0
      }
    },
    visible: true,
    shape: nodeData.model === '算术运算' ? 'op-rect' : 'op-rect-io',
    resize: nodeData.model !== '算术运算',
    ports: {
      groups: {
        in: {
          position: nodeData.model === '算术运算' ? 'left' : 'right',
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
          position: nodeData.model === '算术运算' ? 'right' : 'left',
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
      },
      items: ports.map(p => ({
        group: p.group,
        attrs: {
          text: {
            text: p.data?.name || ''
          }
        },
        data: {
          dataType: p.data?.dataType || 'Double',
          desc: p.data?.desc || '',
          dv: p.data?.dv || '',
          kind: p.data?.kind || 'out',
          name: p.data?.name || ''
        },
        id: p.id
      }))
    },
    id: node.id,
    desc: '',
    data: {
      id: '',
      model: nodeData.model,
      modelId: nodeData.modelId,
      name: nodeData.name,
      sysmbol: nodeData.sysmbol,
      extends: nodeData.extends ? {
        category: nodeData.extends.category || '',
        tag: nodeData.extends.tag || '',
        desc: nodeData.extends.desc || ''
      } : undefined,
      sn1: null,
      sn: sn,
      isEnabled: (nodeData.model === '输入块' || nodeData.model === '输出块') ? false : undefined
    },
    zIndex: sn
  }
}

// 导出边数据
export function formatEdgeForExport(edge) {
  const source = edge.getSourceCell()
  const target = edge.getTargetCell()
  const sourcePort = edge.getSourcePortId()
  const targetPort = edge.getTargetPortId()

  return {
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
    id: edge.id,
    zIndex: 0,
    source: {
      cell: source?.id,
      port: sourcePort
    },
    target: {
      cell: target?.id,
      port: targetPort
    }
  }
}
