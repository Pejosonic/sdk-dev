This is repository is an excercise according to this [document.](https://decentraland.notion.site/SDK-Developer-Content-Team-Exercise-64dea67dd9644ef882078b7ed490987a)

This scene was made using as a base the examples scenes:

- [Quests Scene - SDK7](https://github.com/decentraland/pickup-quest-scene)
- [Quest: The Drink of the Gods](https://github.com/nearnshaw/Quest-drink-of-the-gods-2023)

## Running
Run it by using the Decentrland SDK7 extension for VS Code.

## General Description:

- The experience is runing on a land parcel (not across the entire Decentraland map).
- The quest starts when loading the scene.
- The first step of the quest is acomplished by talking to the NPC character and answering YES to the first question.
- By the completion of the first step, there are created four golden coins inside the scene.
- The second step is completed by when the user pick up the four coins.
- The last step is to talk again to the NPC in order to claim the reward.
- The progress of the quest is displayed on a simple dashboard on the right side of the screen.

## Quest Definition

```json
{
    "name": "PickupCoins",
    "description": "Add kind to the firs action",
    "definition": {
        "steps": [
            {
                "id": "start_talk",
                "description": "Talk to the NPC",
                "tasks": [
                    {
                        "id": "start_quest",
                        "description": "Start the quest",
                        "actionItems": [
                            {
                                "type": "CUSTOM",
                                "parameters": {
                                    "id": "user_ok"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "id": "pick_up_coins",
                "description": "Pickups all coins",
                "tasks": [
                    {
                        "id": "coin_1",
                        "description": "Pickup coin 1",
                        "actionItems": [
                            {
                                "type": "CUSTOM",
                                "parameters": {
                                    "id": "coin1"
                                }
                            }
                        ]
                    },
                    {
                        "id": "coin_2",
                        "description": "Pickup coin 2",
                        "actionItems": [
                            {
                                "type": "CUSTOM",
                                "parameters": {
                                    "id": "coin2"
                                }
                            }
                        ]
                    },
                    {
                        "id": "coin_3",
                        "description": "Pickup coin 3",
                        "actionItems": [
                            {
                                "type": "CUSTOM",
                                "parameters": {
                                    "id": "coin3"
                                }
                            }
                        ]
                    },
                    {
                        "id": "coin_4",
                        "description": "Pickup coin 4",
                        "actionItems": [
                            {
                                "type": "CUSTOM",
                                "parameters": {
                                    "id": "coin4"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "id": "finish_talk",
                "description": "Talk again to the NPC",
                "tasks": [
                    {
                        "id": "end_talk",
                        "description": "Talk",
                        "actionItems": [
                            {
                                "type": "CUSTOM",
                                "parameters": {
                                    "id": "receive_reward"
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        "connections": [
            {
                "stepFrom": "start_talk",
                "stepTo": "pick_up_coins"
            },
            {
                "stepFrom": "pick_up_coins",
                "stepTo": "finish_talk"
            }
        ]
    },
    "imageUrl": "https://avatars.githubusercontent.com/u/36207937?v=4"
}
```

## Final words about this experience

### Requeriments that where not delivered 

They wheren't included due to lack of time for researching:

- Wearable reward item after completing the quest.

- Spreading quest pickup items around locations over the DCL map.

### Learnings

This excercise has pushed me to get involved with many new tools and technologies. Some of them where Decentraland specific libraries that involved a lot of try catch testing in order to understand the expected behaviour.

It took some days to get the Decentraland explorer working in order to complete the development environment. Still not knowing why it's not working on the default configuration inside VS Code nor Chrome. 
In order to get it working had to set in `chrome://flags/` the key `Choose ANGLE graphics backend` to `METAL`

The most challenging and time consumming item was getting involved with the quest server.
After a lot of testing and reverse engineering I have arrived to some insigths that later where reported to the people behind this feature:

- A quest `Step` could not containt more than one `Action`
- The main quest server stoped working while developing this excersise (nov 30), involving a lot of debugging in order to arrive to this insight.
- Outdated Quest example on Awesome Repository using actions of type PickUp, not able to create quests with the same structure.


This exercise was the first time working on an event emitter based logic, took some time to understand the best code structure and defining each different module (npc, coins, UI).

### Final thoughts
My bottom line after this experience is that I would love to colaborate on scenes that have already built the features that I wasn't able to develop, in order to learn from working examples and get confident for developing new feature richfull scenes.