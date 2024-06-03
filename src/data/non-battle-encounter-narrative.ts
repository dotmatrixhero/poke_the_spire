import { Type } from "./type";
import { Biome } from "./enums/biome";
import { default as Pokemon } from "../field/pokemon";
import { NonBattleEncounterType } from "./enums/non-battle-encounter-type";
//import { Ability } from "./ability";
import { Abilities } from "./enums/abilities";
import { Moves } from "./enums/moves";
import { Nature } from "./nature";
import { ModifierType } from "../modifier/modifier-type.js";
//import { PersistentModifier } from "#app/modifier/modifier.js";
//import i18next from "../plugins/i18n";
//import PokemonData from "#app/system/pokemon-data.js";
import { Species } from "../data/enums/species";
import BattleScene from "../battle-scene";
//import { SchemeNeutral } from "@material/material-color-utilities";
import { OptionSelectItem } from "../ui/abstact-option-select-ui-handler.js";
import { TimeOfDay } from "./enums/time-of-day";
import { Status } from "./status-effect";
import { EvolutionItem } from "./pokemon-evolutions";
import { FormChangeItem } from "./pokemon-forms";

//EvolutionItemModifierType <- note to use this to generate evo item


export interface PokemonQuery {
    species?: Species[],
    minWeight?: integer,
    maxWeight?: integer,
    minFriendship?: integer,
    maxFriendship?: integer,
    minLevel?: integer,
    maxLevel?:integer,
    requiresLead?: boolean, //only the first pokemon (usually on the field already) may be queried
    nature?: Nature[],
    type?: Type[], // at least one of these types
    abilities?: Abilities[],
    moves?: Moves[],
    hasStatus?: Status[],
    canFormChangeWithItems?: FormChangeItem[],
    canEvoWithItems?: EvolutionItem[]

}


export interface EventRequirements {
    modifier?: typeof ModifierType[], // AT LEAST ONE modifier in this list should be held by player in order for this event to occur
    pokemonQuery?: PokemonQuery, // ONE party member must adhere; those that do are added to a list and randomly selected as the queried pokemon
    party?: object, // ALL party members must adhere to whatever's here
    timeOfDay?: TimeOfDay[]

}

// Notice these are the same as EventRequirements; although the underlying data is currently the similar, the way it's used is different
// and may change further in the future.
export interface OptionRequrements {
    modifier?: typeof ModifierType[], //
    queriedPokemon?: PokemonQuery, //The already queried pokemon must have these more specific query items
    otherPartyPokemon?: PokemonQuery // ONE other party member must adhere
}

export interface NonBattleEncounterOptions extends OptionSelectItem {
    optionRequirements: object
}

export interface NonBattleEncounterEvent {
    eventRequirements: EventRequirements, // Required for event to occur (in addition to current biome in biomesearhc)
    narratorName:string, //If not null, what name shows up - for dialogue
    encounter:object, // Encounter visual details + text
    options: NonBattleEncounterOptions[], // UI multi select  ????
    outcomes: object // handler functions that are called by options based on what occurs
}


export class NonBattleEncounterNarrative {
// PTS TODO: Add a custom object here with data I want to feed into this class
// probably track all the ones we've ran into and avoid those ones; we don't really want repeats

  public tstoptions:OptionSelectItem[] = [
    // when options are loaded, scan for requirements. if not met, remove the option.
    // if they are, set then other party pokemon then add the option
    {
      label: "Yes (takes damage, changes nature)",

      handler: () => {
        return false;
        //this.queriedPokemon.damageAndUpdate()
        // can run animations and effects here too
        // choose outcome based on what should happen or queue battles, etc.
      } // find corresponding outcome, roll which random sub-outcome, apply modifier rewards and then return true
    },
    {
      label: "No (lose money)",
      handler: () => {
        return false;
      }
    },
    {
      label: "Teleport away! (party levels up)",

      handler: () => {
        return false;
      }
    },
    {
      label: "Protect! (party levels up)",

      handler: () => {
        return false;
      }
    }];

  constructor(scene: BattleScene) {
    this.scene = scene;
  }

  public setQueriedPokemon(p : Pokemon) {
    this.queriedPokemon = p;
  }

  public setOtherPartyPokemon(p : Pokemon) {
    this.otherPartyPokemon = p;
  }

  public scene: BattleScene;
  public queriedPokemon: Pokemon;
  public otherPartyPokemon: Pokemon;

  public biomeSearch = new Map<Biome, NonBattleEncounterType[]>([
    [Biome.TOWN, [
      NonBattleEncounterType.RIVER_RELEASE,
      NonBattleEncounterType.SNORLAX_SLEEP_FIGHT
    ]],
    [Biome.PLAINS,[
      NonBattleEncounterType.RIVER_RELEASE
    ]],
    [Biome.GRASS, [
      NonBattleEncounterType.RIVER_RELEASE
    ]],
    [Biome.TALL_GRASS, [
      NonBattleEncounterType.RIVER_RELEASE
    ]],
    [Biome.METROPOLIS, []],
    [Biome.FOREST, [
      NonBattleEncounterType.RIVER_RELEASE,
      NonBattleEncounterType.SNORLAX_SLEEP_FIGHT
    ]],
    [Biome.SEA, []],
    [Biome.SWAMP, [
      NonBattleEncounterType.RIVER_RELEASE
    ]],
    [Biome.BEACH, []],
    [Biome.LAKE, [
      NonBattleEncounterType.RIVER_RELEASE
    ]],
    [Biome.SEABED, []],
    [Biome.MOUNTAIN, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE,
      NonBattleEncounterType.RIVER_RELEASE,
      NonBattleEncounterType.SNORLAX_SLEEP_FIGHT
    ]],
    [Biome.BADLANDS, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE
    ]],
    [Biome.CAVE, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE,
      NonBattleEncounterType.SNORLAX_SLEEP_FIGHT
    ]],
    [Biome.DESERT, []],
    [Biome.ICE_CAVE, []],
    [Biome.MEADOW, [
      NonBattleEncounterType.RIVER_RELEASE
    ]],
    [Biome.POWER_PLANT, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE
    ]],
    [Biome.VOLCANO, []],
    [Biome.GRAVEYARD, []],
    [Biome.DOJO, []],
    [Biome.FACTORY, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE
    ]],
    [Biome.RUINS, [
      NonBattleEncounterType.SNORLAX_SLEEP_FIGHT
    ]],
    [Biome.WASTELAND, []],
    [Biome.ABYSS, []],
    [Biome.SPACE, []],
    [Biome.CONSTRUCTION_SITE, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE,
      NonBattleEncounterType.SNORLAX_SLEEP_FIGHT
    ]],
    [Biome.JUNGLE, [
      NonBattleEncounterType.RIVER_RELEASE
    ]],
    [Biome.FAIRY_CAVE, []],
    [Biome.TEMPLE, []],
    [Biome.SLUM, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE
    ]],
    [Biome.SNOWY_FOREST, []],
    [Biome.ISLAND, []],
    [Biome.LABORATORY, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE
    ]]
  ]);



  public narrativeDialogue = new Map<NonBattleEncounterType, NonBattleEncounterEvent>([
    [NonBattleEncounterType.AMBUSH_NATURE_CHANGE,
      {
        // you can't roll this encounter unless these requirements are met
        eventRequirements: {
          modifier: [], //typeof PersistentModifier
          party: {
            // all pokemon in party must be
            minLevel : -1,
            maxLevel: -1,
          },
          pokemonQuery: {
            // at least one pokemon must have all of the following; empty or -1 is means not a requirement
            species: [],
            minWeight: -1,
            maxWeight: -1,
            minFriendship: 70,
            maxFriendship: -1,
            requiresLead: false, //only the first pokemon may be queried
            nature: [Nature.TIMID, Nature.GENTLE, Nature.CAREFUL, Nature.QUIRKY, Nature.BASHFUL, Nature.DOCILE],
            type: [], // at least one of these types
            abilities: [],
            moves: [],
            minLevel : -1,
            maxLevel: -1
          }
        },
        narratorName: null, // if empty, showtext instead of showdialogue
        encounter: {
          text: "nonBattleEncounter:ambushNatureChange",
          trainer: null,
          pokemon: Species.GEODUDE,
          biome: null,
          sound: ""
        },
        options:  [
          // when options are loaded, scan for requirements. if not met, remove the option.
          // if they are, set then other party pokemon then add the option
          {
            label: "Yes (takes damage, changes nature)",
            optionRequirements: {
              // requirements for this option to be available

            },
            handler: () => {
              this.scene;
              console.log(this.queriedPokemon);
              return true;
              // Check if queried pokemon is ghost type. If it is, route it to secret outcome (change nature + player lose money)
              //this.queriedPokemon.damageAndUpdate()
              // can run animations and effects here too
              // choose outcome based on what should happen or queue battles, etc.
            } // find corresponding outcome, roll which random sub-outcome, apply modifier rewards and then return true
          },
          {
            label: "No (lose money)",
            optionRequirements: {},
            handler: () => {
              return true;

            }
          },
          {
            label: "Teleport away! (party levels up)",
            optionRequirements: {
              modifier: [],
              queriedPokemon: {},
              otherPartyPokemon: {
                species: [],
                minWeight: -1,
                maxWeight: -1,
                minFriendship: 10,
                maxFriendship: -1,
                requiresLead: false, //only the first pokemon may be queried
                nature: [],
                type: [], // at least one of these types
                abilities: [],
                moves: [Moves.TELEPORT],
                minLevel : -1,
                maxLevel: -1
              }
            },
            handler: () => {
              return true;

            }
          },
          {
            label: "Protect! (party levels up)",
            optionRequirements: {
              modifier: [],
              queriedPokemon: {},
              otherPartyPokemon: {
                species: [],
                minWeight: -1,
                maxWeight: -1,
                minFriendship: 20,
                maxFriendship: -1,
                requiresLead: false, //only the first pokemon may be queried
                nature: [],
                type: [], // at least one of these types
                abilities: [],
                moves: [Moves.PROTECT, Moves.DETECT, Moves.WIDE_GUARD, Moves.SPIKY_SHIELD, Moves.QUICK_GUARD, Moves.MAT_BLOCK, Moves.MAX_GUARD,
                  Moves.BANEFUL_BUNKER, Moves.BURNING_BULWARK, Moves.CRAFTY_SHIELD, Moves.KINGS_SHIELD, Moves.OBSTRUCT, Moves.SILK_TRAP],
                minLevel : -1,
                maxLevel: -1
              }
            },
            handler: () => {
              return true;
            }
          },

        ],
        outcomes: [{
          resultHandler: () => {
            // this triggers after the user closes last dialogue, can be non-flavor results + actually executing
            // and handling possible edge cases that arise.
          },
          text: ["nonBattleEncounter:pokemonTanksSelfDestruct"],
          sound: [""]
        }, {
          resultHandler: () => {

          },
          text: ["nonBattleEncounter:hitBySelfDestruct"],
          sound: [""]
        }]

      }],
    [NonBattleEncounterType.RIVER_RELEASE,
      {
        eventRequirements: {
          modifier: [], //typeof PersistentModifier
          party: {
            minLevel : -1,
            maxLevel: -1,
          },
          pokemonQuery: {
            minLevel : -1,
            maxLevel: -1,
            species: [],
            minWeight: -1,
            maxWeight: -1,
            minFriendship: 70,
            maxFriendship: -1,
            requiresLead: false,
            nature: [],
            type: [Type.WATER],
            abilities: [],
            moves: []
          }
        },
        narratorName: null, // if empty, showtext instead of showdialogue
        encounter: {
          text: "nonBattleEncounter:riverRelease",
          trainer: null,
          pokemon: null,
          biome: null,
          sound: ""
        },
        options:  [
          {
            label: "Yes (release)",
            optionRequirements: {},
            handler: () => {
              this.scene;
              console.log(this.queriedPokemon);
              // open release menu
              // do release
              // call the next outcome handler
              return true;
            }
          },
          {
            label: "No (deepens friendship)",
            optionRequirements: {},
            handler: () => {
              // call riverdontrelease outcome
              return true;
            }
          },
          {
            label: "Explore the river together (change biome, gain item)",
            optionRequirements: {
              queriedPokemon: {
                "minFriendship": 70
              }
            },
            handler: () => {
              // call riverReleasedBiomeSwitch outcome
              return true;
            }
          }
        ],
        outcomes: [{
          text: ["nonBatteEncounter:riverReleasePokemon"],
          resultHandler: () => {
            // Release
            // add a modifier to the player inventory that is a prerequisite for the follow up event.
            // saving this pokemon may be difficult data-wise... I wonder if we can store the pokemon data in the modifier.
          },
          sound: [""]
        },
        {
          text: ["nonBattleEncounter:riverDontRelease"],
          resultHandler: () => {

            // deepen friendship
          },

          sound: [""]
        },
        {
          text: ["nonBattleEncounter:riverReleaseBiomeSwitch"],
          resultHandler: () => {
            // switch biomes
            // give qp mystic water
          },

          sound: [""]
        }]

      }],
    [NonBattleEncounterType.SNORLAX_SLEEP_FIGHT,
      {
        eventRequirements: {
          modifier: [], //typeof PersistentModifier
          party: {
            minLevel : -1,
            maxLevel: -1,
          },
          pokemonQuery: {
            minLevel : -1,
            maxLevel: -1,
            species: [],
            minWeight: -1,
            maxWeight: -1,
            minFriendship: -1,
            maxFriendship: -1,
            requiresLead: false,
            nature: [],
            type: [],
            abilities: [],
            moves: []
          }
        },
        narratorName: null, // if empty, showtext instead of showdialogue
        encounter: {
          text: "nonBattleEncounter:snorlaxSleeping",
          trainer: null,
          pokemon: Species.SNORLAX,
          biome: null,
          sound: ""
        },
        options:  [
          {
            label: "Attack (fight sleeping Snorlax)",
            optionRequirements: {},
            handler: () => {
              this.scene;
              console.log(this.queriedPokemon);
              return true;
              // Transition straight to fight
            }
          },
          {
            label: "Wait (50/50 party heal or party falls asleep)",
            optionRequirements: {},
            handler: () => {
              return true;
              // call riverdontrelease outcome
            }
          }
        ],
        outcomes: [{
          text: ["nonBatteEncounter:fightSnorlax"],
          resultHandler: () => {
            // Might not need to call this one, if we're transitioning straight to battle
          },
          sound: [""]
        },
        {
          text: ["nonBattleEncounter:waitForSnorlaxLeftovers"],
          resultHandler: () => {
            // Put party to sleep but give them leftovers
          },

          sound: [""]
        },
        {
          text: ["nonBattleEncounter:waitForSnorlaxHealed"],
          resultHandler: () => {
            // Simple heal party
          },

          sound: [""]
        }]

      }]
  ]);

}
