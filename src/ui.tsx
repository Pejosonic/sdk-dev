import { Color4 } from '@dcl/sdk/math'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { createQuestHUD } from '@dcl/quests-client/dist/hud'

import { NpcUtilsUi } from 'dcl-npc-toolkit'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(() => [
    NpcUtilsUi(),
    questComponent()
  ])
}

export const hud = createQuestHUD({
  autoRender: true,
  leftSidePanel: {
    position: {
      top: 60,
      right: 10
    },
  },
  questBox: {
    uiTransform: {
      width: 300
    },
    uiBackground: {
      textureMode: 'nine-slices',
      texture: {
        src: 'images/bg.png',
      },
      color: Color4.Gray()
    }
  },
  stepsContainer: {
    uiTransform: {}, 
    showTasksButton: {
      buttonUiEntity: {
        display: 'none'
      }
    }
  },
  nextSteps: {
    nextTitleUiEntity: {
      display: 'none'
    }
  },
  questCompletionLabel: {
    uiTransform: {
      display: 'none'
    }
  },
  showHideToggleButton: {
    value: '',
    uiTransform: {
      display: 'none'
    }
  }
})

const questComponent = hud.getHUDComponent()
