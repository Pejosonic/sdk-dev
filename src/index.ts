import { executeTask } from '@dcl/sdk/ecs'
import { QuestInstance, createQuestsClient } from '@dcl/quests-client'

import { hud, setupUi } from './ui'
import { setupNpc } from './npc'
import { setupItems } from './coins'
import { Action } from '@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen'
import mitt from 'mitt'

//quest on prod server
// const serviceUrl = 'wss://quests-rpc.decentraland.org'
// const QUEST_ID = '9f62c3db-6f0e-4b03-9085-fb68a342c87d'

//quest on dev server
const serviceUrl = 'wss://quests-rpc.decentraland.zone'
const QUEST_ID = 'db88a3de-0e6d-46a5-8294-d66c43e3e701'

export const actionEvents = mitt<{ action: Action }>()
export const questProgress = mitt<{ step: number }>()
export const startQuest = mitt()

export enum StepsEnum {
  start_talk,
  pick_up_coins,
  finish_talk,
  completed,
}

export let questStarted = false
export let currentStep = StepsEnum.start_talk

function updateInternalState(questInstance: QuestInstance) {
  const stepName = Object.keys(questInstance.state.currentSteps)[0]

  if (questInstance.state.stepsCompleted.includes('finish_talk')) {
    currentStep = StepsEnum.completed
    questProgress.emit("step", currentStep)
  } else if (stepName !== StepsEnum[currentStep]) {
    currentStep = StepsEnum[stepName as keyof typeof StepsEnum]
    questProgress.emit("step", currentStep)
  }
  
}



export function main() {

  executeTask(async () => {
    try {
      let questsClient = await createQuestsClient(serviceUrl, QUEST_ID)
      console.log("started Quest Client")

      questsClient.onStarted((questInstance: QuestInstance) => {
        hud.upsert(questInstance)
        questStarted = true
      })

      questsClient.onUpdate((questInstance) => {
        console.log("QUEST UPDATE ARRIVED ", questInstance)
        updateInternalState(questInstance)
        hud.upsert(questInstance)
      })

      const currentProgress = questsClient.getQuestInstance()

      if (currentProgress) {
        console.log("QUEST WAS ALREADY STARTED ", currentProgress)

        updateInternalState(currentProgress)
        hud.upsert(currentProgress)

      } else {
        console.log("NO PREVIOUS QUESTS")
        const startQuest = await questsClient.startQuest()
        console.log("STARTED QUEST: ", startQuest)
      }


      actionEvents.on('action', async (action: Action) => {
        console.log("SENDING QUEST ACTION TO SERVER, ", action)
        await questsClient.sendEvent({ action })
      })


    } catch (e) {
      console.error('Error on connecting to Quests Service')
    }
  })


  setupUi()
  setupNpc()
  setupItems()

}
