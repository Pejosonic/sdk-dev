import {
  Entity,
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import *  as  npc from 'dcl-npc-toolkit'

import { StepsEnum, actionEvents, questProgress, currentStep } from '.'
import { Action } from '@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen'

let aisha: Entity

export let AishaScript: npc.Dialog[] = [
  {
    name: 'start_talk',
    text: "Hi multiverse traveller",
    skipable: true,
  },
  {
    text: `Would you like to play a game?`,
    isQuestion: true,
    buttons: [
      {
        label: 'YES',
        goToDialog: 3,
        triggeredActions: () => {

          const action: Action = {
            type: 'CUSTOM',
            parameters: {
              id: "user_ok"
            }
          }

          actionEvents.emit('action', action)

          npc.playAnimation(aisha, 'Excited', false)
        },
      },
      {
        label: 'NO', goToDialog: 2
      },
    ],
  },
  {
    name: 'next_time',
    text: "I understand that you are tired from your journey. Please relax and come tome whenever you feel it's time to rock.",
    isEndOfDialog: true,
    triggeredByNext: () => npc.playAnimation(aisha, 'Idle'),
  },
  {
    name: 'game_rules',
    text: "Nice to hear that!",
    isEndOfDialog: true,
    triggeredByNext: () => npc.playAnimation(aisha, 'Idle'),
  },
  {
    name: 'pick_up_coins',
    text: "You will have to walk thru this map and pickup 4 coins that are well hidden.",
    isEndOfDialog: true,
    triggeredByNext: () => npc.playAnimation(aisha, 'Idle'),
  },
  {
    name: 'claim_reward',
    text: "Hey traveller, you made it! You found the 4 hidden coins.",
  },
  {
    text: "Please come here so i can give you your reward.",
    isEndOfDialog: true,
  },
  {
    name: 'finish_talk',
    text: "It's time for you to get your reward."
  },
  {
    text: "Now we will pretend that you received your reward and just mark this quest as completed  ; )",
    isEndOfDialog: true,
    triggeredByNext: () => {
      npc.playAnimation(aisha, 'Idle')

      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: 'receive_reward' },
      })
    },
  },
  {
    name: 'completed',
    text: "You have already completed your quest.",
    isEndOfDialog: true,
    triggeredByNext: () => {
      npc.playAnimation(aisha, 'Idle')
    },
  },
]

export function setupNpc() {

  questProgress.on("step", (stepNumber: number) => {

    switch (stepNumber) {
      case StepsEnum.pick_up_coins:
        npc.talk(aisha, AishaScript, StepsEnum[currentStep])
        break
      case StepsEnum.finish_talk:
        npc.talk(aisha, AishaScript, 'claim_reward')
        break

    }
  })

  aisha = npc.create(
    { position: Vector3.create(13, 0, 13), rotation: Quaternion.create(0, 180, 0), scale: Vector3.create(1, 1, 1) },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/aisha.glb',
      portrait: { path: 'images/Aisha.png', offsetY: -20 },
      faceUser: true,
      reactDistance: 3,
      idleAnim: 'Idle',
      onActivate: () => {

        npc.playAnimation(aisha, 'Talking')
        npc.talk(aisha, AishaScript, StepsEnum[currentStep])
      }
    }
  )
}
