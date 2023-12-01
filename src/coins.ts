import {
  engine,
  Transform,
  GltfContainer,
  VisibilityComponent,
  Schemas,
  AudioSource
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

import { StepsEnum, actionEvents, questProgress, currentStep } from '.'

export const Spinner = engine.defineComponent('spinner', { speed: Schemas.Number })

export function circularSystem(dt: number) {
  const entitiesWithSpinner = engine.getEntitiesWith(Spinner, Transform)
  for (const [entity, _spinner, _transform] of entitiesWithSpinner) {
    const mutableTransform = Transform.getMutable(entity)
    const spinnerData = Spinner.get(entity)

    mutableTransform.rotation = Quaternion.multiply(
      mutableTransform.rotation,
      Quaternion.fromAngleAxis(dt * spinnerData.speed, Vector3.Up()),
    )

    mutableTransform.rotation = Quaternion.multiply(
      mutableTransform.rotation,
      Quaternion.fromAngleAxis(dt * spinnerData.speed, Vector3.Left()),
    )
  }
}

export const PickableItem = engine.defineComponent('PickableItem', {
  id: Schemas.String,
  playerDetectionArea: Schemas.Vector3
})

let lastPlayerPos: Vector3 | undefined = undefined

function isPositionInsideArea(
  targetPosition: Vector3,
  detectionAreaCenter: Vector3,
  detectionAreaSize: Vector3
): boolean {
  const halfSize = Vector3.scale(detectionAreaSize, 0.5)
  const areaMinPosition = Vector3.create(
    detectionAreaCenter.x - halfSize.x,
    detectionAreaCenter.y - halfSize.y,
    detectionAreaCenter.z - halfSize.z
  )
  const areaMaxPosition = Vector3.create(
    detectionAreaCenter.x + halfSize.x,
    detectionAreaCenter.y + halfSize.y,
    detectionAreaCenter.z + halfSize.z
  )

  return (
    targetPosition.x > areaMinPosition.x &&
    targetPosition.y > areaMinPosition.y &&
    targetPosition.z > areaMinPosition.z &&
    targetPosition.x < areaMaxPosition.x &&
    targetPosition.y < areaMaxPosition.y &&
    targetPosition.z < areaMaxPosition.z
  )
}

export function itemPickupSystem() {
  
  if (currentStep !== StepsEnum.pick_up_coins) return
  if (!Transform.has(engine.PlayerEntity)) return

  const playerPos = Transform.get(engine.PlayerEntity).position
  const moved = playerPos != lastPlayerPos

  if (!moved) return
  for (const [entity] of engine.getEntitiesWith(PickableItem)) {
    const visibilityComp = VisibilityComponent.getMutable(entity)

    if (visibilityComp.visible) {
      const pickableItemComp = PickableItem.get(entity)
      const transformComp = Transform.get(entity)

      const detectionAreaCenter = transformComp.position
      const detectionAreaSize = pickableItemComp.playerDetectionArea
      if (isPositionInsideArea(playerPos, detectionAreaCenter, detectionAreaSize)) {
        // Pick item
        visibilityComp.visible = false
        AudioSource.getMutable(entity).playing = true

        actionEvents.emit('action', {
          type: 'CUSTOM',
          parameters: { id: pickableItemComp.id },
        })
      }
    }
  }

  lastPlayerPos = playerPos
}

function createCoin (id: string, pos: Vector3, speed: number = 50 ) {
  const entity = engine.addEntity()
  GltfContainer.create(entity, {
    src: 'models/Coin_01.glb'
  })

  VisibilityComponent.create(entity).visible = true

  Transform.create(entity, {
    position: pos,
    scale: Vector3.create(3,3,3)
  })

  AudioSource.create(entity, {
    audioClipUrl: 'sounds/menu_select.mp3',
    playing: false,
    loop: false
  })

    Spinner.create(entity, { speed: speed })


  PickableItem.create(entity, {
    id,
    playerDetectionArea: Vector3.create(1, 3, 1)
  })
}


function placeCoins() {
  engine.addSystem(circularSystem)
  engine.addSystem(itemPickupSystem)

  createCoin('coin1', Vector3.create(6,1,6))
  createCoin('coin2', Vector3.create(6,1,8), -60)
  createCoin('coin3', Vector3.create(6,1,10), 80)
  createCoin('coin4', Vector3.create(6,1,12), 20)
}

export function setupItems() {

  questProgress.on("step", (stepNumber: number) => {
    if (stepNumber == StepsEnum.pick_up_coins) {
      placeCoins()
    }
  })
}