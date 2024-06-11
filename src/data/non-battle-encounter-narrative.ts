import { Type } from "./type";
import { Biome } from "./enums/biome";
import { PlayerPokemon, default as Pokemon } from "../field/pokemon";
import { NonBattleEncounterOutcomeType, NonBattleEncounterType } from "./enums/non-battle-encounter-type";
//import { Ability } from "./ability";
import { Abilities } from "./enums/abilities";
import { Moves } from "./enums/moves";
import { Nature, getNatureName } from "./nature";
import { AttackTypeBoosterModifierType, ModifierType, PokemonBaseStatBoosterModifierType, PokemonHeldItemModifierType, PokemonMoveModifierType, PokemonPpRestoreModifierType } from "../modifier/modifier-type.js";
//import PokemonData from "#app/system/pokemon-data.js";
import { Species } from "../data/enums/species";
import BattleScene from "../battle-scene";
//import { SchemeNeutral } from "@material/material-color-utilities";
import { OptionSelectItem } from "../ui/abstact-option-select-ui-handler.js";
import { TimeOfDay } from "./enums/time-of-day";
import { Status, StatusEffect } from "./status-effect";
import { EvolutionItem } from "./pokemon-evolutions";
import { FormChangeItem } from "./pokemon-forms";
import Trainer from "#app/field/trainer";
import PokemonSpecies, { PokemonForm, SpeciesFormKey } from "./pokemon-species";
import { GrowthRate } from "./exp";
import i18next from "i18next";
import { NewNonBattleEncounterPhase, SwitchBiomePhase } from "../phases";
import * as Utils from "../utils";
import { Stat } from "./pokemon-stat";
import { CommonAnim, CommonBattleAnim } from "./battle-anims";
import { Mode } from "#app/ui/ui";
import * as ModifierTypes from "../modifier/modifier-type";
import { Modifier, TurnHealModifier } from "#app/modifier/modifier";
import { PartyOption, PartyUiMode } from "#app/ui/party-ui-handler";



//EvolutionItemModifierType <- note to use this to generate evo item

export interface QueriedEventData {
    // the data we need to start the event
    reqsMet: boolean,
    protagonist?: PlayerPokemon,
    qualifiedProtagonists:PlayerPokemon[],
    supports: PlayerPokemon[]

}

export interface PokemonQuery {
    // Remember - a pokemon must fulfill ALL of these requirements to qualify (think of it like boolean AND)
    // But within each attribute with an array, the pokemon only needs to fulfill one of them (like boolean OR).
    // Ex. species: [Species.BULBASAUR, Species.CHARMANDER] will succeed if you have bulbasaur OR charmander
    // but species: [Species.BULBASAUR] with type: [Type.WATER] will fail because a pokemon can't be bulbasaur AND water type
    species?: Species[],
    minWeight?: integer,
    maxWeight?: integer,
    minFriendship?: integer,
    maxFriendship?: integer,
    minLevel?: integer,
    maxLevel?:integer,
    minHpRatio?: number,
    maxHPRatio?: number,
    requiresLead?: boolean, //only the first pokemon (usually on the field already) may be queried
    nature?: Nature[],
    type?: Type[],
    abilities?: Abilities[],
    moves?: Moves[],
    hasStatus?: Status[],
    canFormChangeWithItems?: FormChangeItem[],
    canEvoWithItems?: EvolutionItem[],
    numberOfQualifyingPokemonRequired?:integer // defaults to 1; at least one pokemon must qualify. don't set to zero, please.

}


export interface EventRequirements {
    modifier?: typeof ModifierType[], // AT LEAST ONE modifier in this list should be held by player in order for this event to occur
    pokemonQuery?: PokemonQuery, // ONE party member must adhere; those that do are added to a list and randomly selected as the queried pokemon

    // Additional way of querying other pokemon; this way you can require [Species.BULBASAUR] AND a different mon with [TYPE.water]
    // Note that the results will be mutually exclusive from the selected pokemon in pokemon query, so if you select
    // [Species.BULBASAUR] in the pokemonQuery and [Type.GRASS] in additionalQuery, if you don't have a second grass mon, the event fails to trigger.
    additionalQuery?: PokemonQuery,

    timeOfDay?: TimeOfDay[]

}


export interface NonBattleEncounterOptions extends OptionSelectItem {
    optionRequirements: EventRequirements
}
export interface NonBattleEncounterDetails {
    text: CallableFunction,
    sound?: string,
    pokemon?: PokemonSpecies,
    trainer?: Trainer,
    encounterPretext?: CallableFunction,
    biome?: Biome,
    pokemonLevel?: integer
}

export interface NonBattleEncounterOutcome {
    text: CallableFunction,
    sound?: string[],
    resultHandler: CallableFunction
}

export interface NonBattleEncounterEvent {
    eventRequirements: EventRequirements, // Required for event to occur (in addition to current biome in biomesearhc)
    narratorName:string, //If not null, what name shows up - for dialogue
    encounter:NonBattleEncounterDetails, // Encounter visual details + text
    options: NonBattleEncounterOptions[], // UI multi select  ????
    outcomes: {[a: NonBattleEncounterOutcomeType]: NonBattleEncounterOutcome} // handler functions that are called by options based on what occurs
}


export class NonBattleEncounterNarrative {
// PTS TODO: Add a custom object here with data I want to feed into this class
// probably track all the ones we've ran into and avoid those ones; we don't really want repeats


  constructor(scene: BattleScene) {
    this.scene = scene;
  }

  public setProtagonistPokemon(p : PlayerPokemon) {
    this.protagonistPokemon = p;
  }

  public setSupportPartyPokemon(p : PlayerPokemon[]) {
    this.supportPartyPokemon = p;
  }

  public setPhase(p: NewNonBattleEncounterPhase) {
    this.phase = p;
  }

  public setCurrentEvent(e: NonBattleEncounterEvent) {
    this.currentEvent = e;
  }

  public scene: BattleScene;
  public protagonistPokemon: PlayerPokemon;
  public supportPartyPokemon: PlayerPokemon[];
  public phase:NewNonBattleEncounterPhase;
  public currentEvent:NonBattleEncounterEvent;

  public biomeSearch = new Map<Biome, NonBattleEncounterType[]>([
    [Biome.TOWN, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE,
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
    [Biome.DOJO, [
      NonBattleEncounterType.AMBUSH_NATURE_CHANGE
    ]],
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


  // PTS TODO: Implement releasing, storing data to a modifier for persistent events, disallow repeat events
  //
  public narrativeDialogue = new Map<NonBattleEncounterType, NonBattleEncounterEvent>([
    [NonBattleEncounterType.AMBUSH_NATURE_CHANGE,
      {
        // you can't roll this encounter unless these requirements are met
        eventRequirements: {
          modifier: [], //typeof PersistentModifier
          additionalQuery: {

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
          text: (data) => {
            return i18next.t("nonBattleEncounter:ambushNatureChange", data);
          },
          trainer: null,
          pokemon: new PokemonSpecies(Species.GEODUDE, 1, false, false, false, "Rock Pokémon", Type.ROCK, Type.GROUND, 0.4, 20, Abilities.ROCK_HEAD, Abilities.STURDY, Abilities.SAND_VEIL, 300, 40, 80, 100, 30, 30, 20, 255, 70, 60, GrowthRate.MEDIUM_SLOW, 50, false),
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
              // Check if queried pokemon is ghost type. If it is, route it to secret outcome (change nature + player lose money)
              //this.queriedPokemon.damageAndUpdate()
              // can run animations and effects here too
              // choose outcome based on what should happen or queue battles, etc.
              // find corresponding outcome, roll which random sub-outcome, apply modifier rewards and then return true

              this.protagonistPokemon.damage(100);
              const statusEffect = this.protagonistPokemon.status;
              if (this.protagonistPokemon.hp <= 0 ) {
                this.protagonistPokemon.hp = 1;
                this.protagonistPokemon.trySetStatus(statusEffect.effect);

              }
              let maxStat:Stat;
              let max = 0;
              for (let i = 1; i <this.protagonistPokemon.stats.length; i++) {
                if (max < this.protagonistPokemon.stats[i]) {
                  max = this.protagonistPokemon.stats[i];
                  maxStat = i;
                }
              }
              let optimalNature;

              if (maxStat === Stat.ATK) {
                optimalNature = (Nature.BRAVE);
              } else if (maxStat === Stat.SPATK) {
                optimalNature = (Nature.RASH);
              } else if (maxStat === Stat.SPD) {
                optimalNature = (Nature.HASTY);
              } else if (maxStat === Stat.DEF) {
                optimalNature = (Nature.BOLD);
              } else if (maxStat === Stat.SPDEF) {
                optimalNature = (Nature.SASSY);
              }
              this.protagonistPokemon.setNature(optimalNature);

              this.protagonistPokemon.updateInfo();
              const bgmPlaying = this.scene.isBgmPlaying();
              if (bgmPlaying) {
                this.scene.fadeOutBgm(1000, false);
              }
              this.scene.ui.fadeOut(1500).then(() => {
                const p = this.scene.getEnemyField()[0];
                p.hideInfo();
                p.setVisible(false);

                const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.POKEMON_TANKS_SELFDESTRUCT];
                const message = outcome.text(  {pokemonName:this.protagonistPokemon.name, optimalNature: getNatureName(optimalNature)});
                this.scene.ui.setMode(Mode.MESSAGE);
                this.scene.load.audio("sd1", "audio/se/battle_anims/PRSFX- Selfdestruct1.wav");
                this.scene.load.audio("sd2", "audio/se/battle_anims/PRSFX- Selfedestruct2.wav");

                this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
                  this.showFinalMessage(message);
                  this.scene.ui.fadeIn(1000).then(() => {
                    outcome.resultHandler();
                    if (bgmPlaying) {
                      this.scene.playBgm();
                    }
                  });
                });
                if (!this.scene.load.isLoading()) {
                  this.scene.load.start();
                }
                return true;
              });
            }

          },
          {
            label: "No (lose money)",
            optionRequirements: {},
            handler: () => {
              this.scene.ui.setMode(Mode.MESSAGE);
              const lostMoney =  Math.floor(.2 *this.scene.money);
              this.scene.money -= lostMoney;
              this.scene.updateMoneyText();
              const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.HIT_BY_SELF_DESTRUCT];
              const message = outcome.text(  {pokemonName:this.protagonistPokemon.name, lostMoney:lostMoney});
              this.scene.ui.setMode(Mode.MESSAGE);

              const bgmPlaying = this.scene.isBgmPlaying();
              if (bgmPlaying) {
                this.scene.fadeOutBgm(1000, false);
              }
              this.scene.ui.fadeOut(1500).then(() => {
                const p = this.scene.getEnemyField()[0];
                p.hideInfo();
                p.setVisible(false);

                this.showFinalMessage(message);
                this.scene.ui.fadeIn(1000).then(() => {
                  outcome.resultHandler();
                  if (bgmPlaying) {
                    this.scene.playBgm();
                  }
                });
              });
              if (!this.scene.load.isLoading()) {
                this.scene.load.start();
              }
              return true;
            }
          },
          {
            label: "Teleport away! (gains speed)",
            optionRequirements: {
              modifier: [],
              pokemonQuery: {},
              additionalQuery: {
                species: [],
                minWeight: -1,
                maxWeight: -1,
                minFriendship: 10,
                maxFriendship: -1,
                requiresLead: false, //only the first pokemon may be queried
                nature: [],
                type: [], // at least one of these types
                abilities: [],
                moves: [Moves.TELEPORT, Moves.SHED_TAIL, Moves.SUBSTITUTE],
                minLevel : -1,
                maxLevel: -1
              }
            },
            handler: () => {
              const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.TELEPORTED_FROM_SELF_DESTRUCT];
              const fullParty:PlayerPokemon[] = [];
              fullParty.concat(this.protagonistPokemon);
              fullParty.push(this.protagonistPokemon);
              let otherPokemon;
              let move;
              for (const p of this.supportPartyPokemon) {

                for (const m of p.moveset) {
                  const movez = [Moves.PROTECT, Moves.DETECT, Moves.WIDE_GUARD, Moves.SPIKY_SHIELD, Moves.QUICK_GUARD, Moves.MAT_BLOCK, Moves.MAX_GUARD,
                    Moves.BANEFUL_BUNKER, Moves.BURNING_BULWARK, Moves.CRAFTY_SHIELD, Moves.KINGS_SHIELD, Moves.OBSTRUCT, Moves.SILK_TRAP];
                  const res = movez.indexOf(m.moveId);
                  if (res !== -1) {
                    otherPokemon = p.name;
                    move = m.getName();
                  }

                }
              }

              const message = outcome.text(  {otherPokemon:otherPokemon, move:move});


              this.scene.ui.setMode(Mode.MESSAGE);
              this.showFinalMessage(message);
              outcome.resultHandler();
              this.applyModifier(new PokemonBaseStatBoosterModifierType("Carbos", Stat.SPD).newModifier());
              this.scene.unshiftPhase(new SwitchBiomePhase(this.scene, Biome.DESERT));

              return true;

            }
          },
          {
            label: "Protect! (party levels up)",
            optionRequirements: {
              modifier: [],
              pokemonQuery: {},
              additionalQuery: {
                minFriendship: 20,
                moves: [Moves.PROTECT, Moves.DETECT, Moves.WIDE_GUARD, Moves.SPIKY_SHIELD, Moves.QUICK_GUARD, Moves.MAT_BLOCK, Moves.MAX_GUARD,
                  Moves.BANEFUL_BUNKER, Moves.BURNING_BULWARK, Moves.CRAFTY_SHIELD, Moves.KINGS_SHIELD, Moves.OBSTRUCT, Moves.SILK_TRAP]
              }
            },
            handler: () => {
              const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.PROTECTED_FROM_SELF_DESTRUCT];
              const fullParty:PlayerPokemon[] = [];
              fullParty.concat(this.protagonistPokemon);
              fullParty.push(this.protagonistPokemon);
              let otherPokemon;
              let move;
              for (const p of this.supportPartyPokemon) {

                for (const m of p.moveset) {
                  const movez = [Moves.PROTECT, Moves.DETECT, Moves.WIDE_GUARD, Moves.SPIKY_SHIELD, Moves.QUICK_GUARD, Moves.MAT_BLOCK, Moves.MAX_GUARD,
                    Moves.BANEFUL_BUNKER, Moves.BURNING_BULWARK, Moves.CRAFTY_SHIELD, Moves.KINGS_SHIELD, Moves.OBSTRUCT, Moves.SILK_TRAP];
                  const res = movez.indexOf(m.moveId);
                  if (res !== -1) {
                    otherPokemon = p.name;
                    move = m.getName();
                  }

                }
              }
              const message = outcome.text(  {otherPokemon:otherPokemon, move:move});


              this.scene.ui.setMode(Mode.MESSAGE);
              this.showFinalMessage(message);
              outcome.resultHandler();

              this.applyModifier( new ModifierTypes.AllPokemonLevelIncrementModifierType("modifierType:ModifierType.RARER_CANDY", "rarer_candy").newModifier());
              return true;
            }

          },

        ],
        outcomes:
            {
              [NonBattleEncounterOutcomeType.POKEMON_TANKS_SELFDESTRUCT]:{
                resultHandler: () => {
                  // this triggers after the user closes last dialogue, can be non-flavor results + actually executing
                  // and handling possible edge cases that arise.
                },
                text: (data) => {
                  return i18next.t("nonBattleEncounter:pokemonTanksSelfDestruct", data);
                },
                sound: [""]
              },
              [NonBattleEncounterOutcomeType.HIT_BY_SELF_DESTRUCT]: {
                resultHandler: () => {

                },
                text: (data) => {
                  return i18next.t("nonBattleEncounter:hitBySelfDestruct", data);
                },
                sound: [""]
              },
              [NonBattleEncounterOutcomeType.PROTECTED_FROM_SELF_DESTRUCT]: {
                resultHandler: () => {

                },
                text: (data) => {
                  return i18next.t("nonBattleEncounter:protectedFromSelfDestruct", data);
                },
                sound: [""]
              },
              [NonBattleEncounterOutcomeType.TELEPORTED_FROM_SELF_DESTRUCT]: {
                resultHandler: () => {

                },
                text: (data) => {
                  return i18next.t("nonBattleEncounter:teleportedFromSelfDestruct", data);
                },
                sound: [""]
              }
            }
      }],
    [NonBattleEncounterType.RIVER_RELEASE,
      {
        eventRequirements: {
          modifier: [], //typeof PersistentModifier
          additionalQuery: {},
          pokemonQuery: {
            type: [Type.WATER],
          }
        },
        narratorName: null, // if empty, showtext instead of showdialogue
        encounter: {
          text: (data) => {
            return i18next.t("nonBattleEncounter:riverRelease", data);
          },
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
              console.log(this.protagonistPokemon);
              // open release menu
              // do release
              // call the next outcome handler
              return true;
            }
          },
          {
            label: "No (deepen friendship)",
            optionRequirements: {},
            handler: () => {
              // call riverdontrelease outcome
              const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.RIVER_DONT_RELEASE];

              const message = outcome.text(  {pokemonName:this.protagonistPokemon.name});
              this.scene.ui.setMode(Mode.MESSAGE);
              this.showFinalMessage(message);
              outcome.resultHandler();
              this.protagonistPokemon.addFriendship(30);
              return true;
            }
          },
          {
            label: "Explore the river together (change biome, gain item)",
            optionRequirements: {
              pokemonQuery: {
                "minFriendship": 70
              }
            },
            handler: () => {
              // call riverReleasedBiomeSwitch outcome
              return true;
            }
          }
        ],
        outcomes: {
          [NonBattleEncounterOutcomeType.RIVER_RELEASE_POKEMON]: {
            text: (data) => {
              return i18next.t("nonBatteEncounter:riverReleasePokemon", data);
            },
            resultHandler: () => {
            // Release
            // add a modifier to the player inventory that is a prerequisite for the follow up event.
            // saving this pokemon may be difficult data-wise... I wonder if we can store the pokemon data in the modifier.
            },
            sound: [""]
          },
          [NonBattleEncounterOutcomeType.RIVER_DONT_RELEASE]: {
            text: (data) => {
              return i18next.t("nonBattleEncounter:riverDontRelease", data);
            },
            resultHandler: () => {

            // deepen friendship
            },

            sound: [""]
          },
          [NonBattleEncounterOutcomeType.RIVER_RELEASE_BIOME_SWITCH]: {
            text: (data) => {
              return i18next.t("nonBattleEncounter:riverReleaseBiomeSwitch", data);
            },
            resultHandler: () => {
            // switch biomes
            // give qp mystic water
              const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.WAIT_FOR_SNORLAX_LEFTOVERS];
              this.scene.ui.fadeOut(1000).then(() => {

                const pokemon = this.protagonistPokemon;
                pokemon.resetStatus();
                pokemon.updateInfo(true);
                this.scene.load.audio("item_fanfare", "audio/bgm/bw/item_fanfare.mp3");

                this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
                  this.scene.ui.fadeIn(500).then(() => {
                    const message = outcome.text({pokemonName: this.protagonistPokemon.name});
                    this.scene.ui.setMode(Mode.MESSAGE);
                    const callback = () => {
                      this.applyModifierWithMoreUI(
                        new AttackTypeBoosterModifierType(Type.WATER,20),this.scene.getParty());
                    };
                    this.scene.ui.showText(message, null, callback, null, true);
                    outcome.resultHandler();
                  });
                });
                if (!this.scene.load.isLoading()) {
                  this.scene.load.start();
                }
              });

            },

            sound: [""]
          }}

      }],
    [NonBattleEncounterType.SNORLAX_SLEEP_FIGHT,
      {
        eventRequirements: {
          modifier: [], //typeof PersistentModifier
          additionalQuery: {
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
          text: (data) => {
            return i18next.t("nonBattleEncounter:snorlaxSleeping", data);
          },
          trainer: null,
          pokemon:     new PokemonSpecies(Species.SNORLAX, 1, false, false, false, "Sleeping Pokémon", Type.NORMAL, null, 2.1, 460, Abilities.IMMUNITY, Abilities.THICK_FAT, Abilities.GLUTTONY, 540, 160, 110, 65, 65, 110, 30, 25, 50, 189, GrowthRate.SLOW, 87.5, false, true,
            new PokemonForm("Normal", "", Type.NORMAL, null, 2.1, 460, Abilities.IMMUNITY, Abilities.THICK_FAT, Abilities.GLUTTONY, 540, 160, 110, 65, 65, 110, 30, 25, 50, 189, false, null, true),
            new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.NORMAL, null, 35, 460, Abilities.IMMUNITY, Abilities.THICK_FAT, Abilities.GLUTTONY, 640, 200, 130, 85, 75, 130, 20, 25, 50, 189),
          ),
          biome: null,
          pokemonLevel:8,
          sound: ""
        },
        options:  [
          {
            label: "Attack (fight sleeping Snorlax)",
            optionRequirements: {},
            handler: () => {
              const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.FIGHT_SNORLAX];
              this.scene.getEnemyPokemon().trySetStatus(StatusEffect.SLEEP);

              new CommonBattleAnim(CommonAnim.POISON + (StatusEffect.SLEEP - 1), this.scene.getEnemyPokemon()).play(this.scene, () => {
                this.scene.getEnemyPokemon().updateInfo();
              });
              const message = outcome.text();
              this.scene.ui.setMode(Mode.MESSAGE);
              this.showFinalMessage(message, true);
              outcome.resultHandler();
              return true;
              // Transition straight to fight
            }
          },
          {
            label: "Wait (50/50 heal or falls asleep)",
            optionRequirements: {},
            handler: () => {

              const bgmPlaying = this.scene.isBgmPlaying();
              if (bgmPlaying) {
                this.scene.fadeOutBgm(1000, false);
              }
              let random:integer;

              this.scene.executeWithSeedOffset(() => {
                random = Utils.randSeedInt(100, 0);
              }, this.scene.currentBattle.waveIndex);
              if (random > 50) {
                const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.WAIT_FOR_SNORLAX_HEALED];

                this.scene.ui.fadeOut(1000).then(() => {
                  const p = this.scene.getEnemyField()[0];
                  p.hideInfo();
                  p.setVisible(false);
                  for (const pokemon of this.scene.getParty()) {
                    pokemon.hp = pokemon.getMaxHp();
                    pokemon.resetStatus();
                    for (const move of pokemon.moveset) {
                      move.ppUsed = 0;
                    }
                    pokemon.updateInfo(true);
                  }
                  const healSong = this.scene.playSoundWithoutBgm("heal");
                  this.scene.time.delayedCall(Utils.fixedInt(healSong.totalDuration * 1000), () => {
                    healSong.destroy();
                    if (bgmPlaying) {
                      this.scene.playBgm();
                    }
                    this.scene.ui.fadeIn(500);
                  });


                  const message = outcome.text(  {pokemonName:this.protagonistPokemon.name});
                  this.scene.ui.setMode(Mode.MESSAGE);
                  this.showFinalMessage(message);
                  outcome.resultHandler();
                });
              } else {
                const outcome = this.currentEvent.outcomes[NonBattleEncounterOutcomeType.WAIT_FOR_SNORLAX_LEFTOVERS];
                this.scene.ui.fadeOut(1000).then(() => {
                  const p = this.scene.getEnemyField()[0];
                  p.hideInfo();
                  p.setVisible(false);
                  const pokemon = this.protagonistPokemon;
                  pokemon.resetStatus();
                  pokemon.trySetStatus(StatusEffect.SLEEP);
                  pokemon.updateInfo(true);
                  this.scene.load.audio("item_fanfare", "audio/bgm/bw/item_fanfare.mp3");

                  this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
                    this.scene.ui.fadeIn(500).then(() => {
                      const message = outcome.text({pokemonName: this.protagonistPokemon.name});
                      this.scene.ui.setMode(Mode.MESSAGE);
                      const callback = () => {
                        this.applyModifierWithMoreUI(
                          new PokemonHeldItemModifierType(
                            "modifierType:ModifierType.LEFTOVERS",
                            "leftovers",
                            (type, args) => new TurnHealModifier(type, (args[0] as Pokemon).id)),
                          this.scene.getParty());

                      };
                      this.scene.ui.showText(message, null, callback, null, true);
                      outcome.resultHandler();
                    });
                  });
                  if (!this.scene.load.isLoading()) {
                    this.scene.load.start();
                  }
                });


              }


              return true;

              // call riverdontrelease outcome
            }
          }
        ],
        outcomes: {
          [NonBattleEncounterOutcomeType.FIGHT_SNORLAX]: {
            text: (data) => {
              return i18next.t("nonBattleEncounter:fightSnorlax", data);
            },
            resultHandler: () => {
            // Might not need to call this one, if we're transitioning straight to battle
            },
            sound: [""]
          },
          [NonBattleEncounterOutcomeType.WAIT_FOR_SNORLAX_LEFTOVERS]: {
            text: (data) => {
              return i18next.t("nonBattleEncounter:waitForSnorlaxLeftovers", data);
            },
            resultHandler: () => {
            // Put party to sleep but give them leftovers
            },

            sound: [""]
          },
          [NonBattleEncounterOutcomeType.WAIT_FOR_SNORLAX_HEALED]: {
            text: (data) => {
              return i18next.t("nonBattleEncounter:waitForSnorlaxHealed", data);
            },
            resultHandler: () => {
            // Simple heal party
            },

            sound: [""]
          }}

      }
    ]]);

  showFinalMessage(outcomeText?:string, battle:boolean = false, outcomeDialogue?: string) {
    const end = () => {
      console.log("original func called");

      if (!battle) {
        this.phase.cleanUpPeacefulSceneBeforeEnd();
      } else {
        this.phase.transitionToBattle();
      }
      this.phase.end();

    };
    if (this.currentEvent.narratorName && outcomeDialogue) {
      this.scene.ui.showDialogue(outcomeDialogue, this.currentEvent.narratorName, null, () => {
        if (outcomeText) {
          this.scene.ui.showText(outcomeText, null, end, null, true);
        } else {
          end();
        }
      });
    } else {
      this.scene.ui.showText(outcomeText, null, end, null, true);
    }

    //if (false && this.scene.currentBattle.trainer.config.hasCharSprite) {
    //    const originalFunc = showMessageOrEnd;
    //    showMessageOrEnd = () => this.scene.charSprite.hide().then(() => this.scene.hideFieldOverlay(250).then(() => originalFunc()));
    //    this.scene.showFieldOverlay(500).then(() => this.scene.charSprite.showCharacter(this.scene.currentBattle.trainer.getKey(), getCharVariantFromDialogue(victoryMessages[0])).then(() => showMessage()));


  }

  applyModifier(modifier: Modifier, playSound: boolean = false) {
    const result = this.scene.addModifier(modifier, false, playSound);
    const doEnd = () => {
      this.scene.ui.clearText();
      this.scene.ui.setMode(Mode.MESSAGE);
    };
    if (result instanceof Promise) {
      result.then(() => doEnd());
    } else {
      doEnd();
    }
  }

  applyModifierWithMoreUI(modifierType:ModifierType, party:PlayerPokemon[]) {
    if (modifierType instanceof ModifierTypes.PokemonModifierType) {
      if (modifierType instanceof ModifierTypes.FusePokemonModifierType) {
        this.scene.ui.setModeWithoutClear(Mode.PARTY, PartyUiMode.SPLICE, -1, (fromSlotIndex: integer, spliceSlotIndex: integer) => {
          if (spliceSlotIndex !== undefined && fromSlotIndex < 6 && spliceSlotIndex < 6 && fromSlotIndex !== spliceSlotIndex) {
            this.scene.ui.setMode(Mode.MODIFIER_SELECT, true).then(() => {
              const modifier = modifierType.newModifier(party[fromSlotIndex], party[spliceSlotIndex]);
              this.applyModifier(modifier, true);
              this.phase.cleanUpPeacefulSceneBeforeEnd();
              this.phase.end();
            });
          } else {
            this.scene.ui.setMode(Mode.CONFIRM,
              () => {

                this.applyModifierWithMoreUI(modifierType, party);
              } ,
              () => {
                this.phase.cleanUpPeacefulSceneBeforeEnd();
                this.phase.end();
              }

            );

            //this.scene.ui.setMode(Mode.MODIFIER_SELECT, this.isPlayer(), typeOptions, modifierSelectCallback, this.getRerollCost(typeOptions, this.scene.lockModifierTiers));
          }
        }, modifierType.selectFilter);
      } else {
        const pokemonModifierType = modifierType as ModifierTypes.PokemonModifierType;
        const isMoveModifier = modifierType instanceof PokemonMoveModifierType;
        const isTmModifier = modifierType instanceof ModifierTypes.TmModifierType;
        const isRememberMoveModifier = modifierType instanceof ModifierTypes.RememberMoveModifierType;
        const isPpRestoreModifier = (modifierType instanceof PokemonPpRestoreModifierType || modifierType instanceof ModifierTypes.PokemonPpUpModifierType);
        const partyUiMode = isMoveModifier ? PartyUiMode.MOVE_MODIFIER
          : isTmModifier ? PartyUiMode.TM_MODIFIER
            : isRememberMoveModifier ? PartyUiMode.REMEMBER_MOVE_MODIFIER
              : PartyUiMode.MODIFIER;
        const tmMoveId = isTmModifier
          ? (modifierType as ModifierTypes.TmModifierType).moveId
          : undefined;
        this.scene.ui.setModeWithoutClear(Mode.PARTY, partyUiMode, -1, (slotIndex: integer, option: PartyOption) => {
          if (slotIndex < 6) {
            this.scene.ui.setMode(Mode.MODIFIER_SELECT, true).then(() => {
              const modifier = !isMoveModifier
                ? !isRememberMoveModifier
                  ? modifierType.newModifier(party[slotIndex])
                  : modifierType.newModifier(party[slotIndex], option as integer)
                : modifierType.newModifier(party[slotIndex], option - PartyOption.MOVE_1);
              this.applyModifier(modifier, true);
              this.phase.cleanUpPeacefulSceneBeforeEnd();
              this.phase.end();

            });
          } else {
            // switch to a confirm? either move on or restart the event


            this.scene.ui.setMode(Mode.CONFIRM,
              () => {
                this.applyModifierWithMoreUI(modifierType, party);
              } ,
              () => {
                this.phase.cleanUpPeacefulSceneBeforeEnd();
                this.phase.end();
              }

            );


            //this.scene.ui.setMode(Mode.MODIFIER_SELECT, this.isPlayer(), typeOptions, modifierSelectCallback, this.getRerollCost(typeOptions, this.scene.lockModifierTiers));
          }
        }, pokemonModifierType.selectFilter, modifierType instanceof PokemonMoveModifierType ? (modifierType as PokemonMoveModifierType).moveSelectFilter : undefined, tmMoveId, isPpRestoreModifier);
      }
    } else {
      this.applyModifier(modifierType.newModifier());
    }
  }



}
