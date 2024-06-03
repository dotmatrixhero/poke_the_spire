import { SimpleTranslationEntries } from "#app/plugins/i18n";

export const nonBattleEncounter: SimpleTranslationEntries = {
  "appeared":  "YOOOOO i'mma fuck u up bitch, ye ye ye wop wop wop wop wop tryna strike a chord and it's probably AAAAAAA $MINORRRRRRRRRRRRRRRRR ",
  "blockRecoilDamage" :
  ` {{pokemonName}}'s {{abilityName}} was a total pro gamer move, it was really really \ncool and actually
  $protected it from recoil! Believe it or not ye yey eyey eyeayay ayayay!!!!!!!
  $sucklemyducjke`,

  "ambushNatureChange":
  `As you make your way through the {{biome}},\na wild Geodude barrels at you with an intimidating growl.
  $A faint hum emanates from its body as it begins to self destruct!
  $Your normally {{nature}} {{pokemonName}} leaps in front to protect you!\nDo you let it take the hit for you?`,
  "pokemonTanksSelfDestruct":
  `Your {{pokemonName}} takes the brunt of the attack, getting damaged heavily in the process.
  $This act of selflessness has changed its nature to {{optimalNature}}!`,
  "hitBySelfDestruct":
  `You quickly recall your {{pokemonName}} just in time, and take the brunt of the destructive blast.
  $Your head slams against the wall, and you get knocked out.
  $When you come to, your head is hurting and some of your money is missing!\nSomeone must've stolen some of it!`,

  "riverRelease":
  `As you navigate the {{biome}}, your {{pokemonName}} seems to be drawn to a nearby river.
  $You sense that it wants to leave your party for a time. Do you let it go?`,
  "riverReleasePokemon":
  "You part ways here, but you get the feeling that your paths will cross again...",
  "riverDontRelease":
  `You can't bear to part ways with your {{pokemonName}}. 
  $Although it's saddened to miss its opportunity for adventure, it appreciates your relationship.
  $Your friendship with {{pokemonName}} grows deeper.`,
  "riverReleaseBiomeSwitch":
  `Although you choose not to part ways, you let your {{pokemonName}} lead you up the river for a time.
  $Soon, you find yourself at a vast, pristine lake!\nThe water here is special, as if bestowing power upon your {{pokemonName}}
  $You gain a mystic water!`,


  "snorlaxSleeping":
  `As you walk down a narrow pathway, you see a towering silhouette blocking your path.
  $You get closer to see a Snorlax sleeping peacefully.\nIt seems like there's no way around it.
  $Do you attack it to try and get it to move, or wait for it to wake up?`,
  "fightSnorlax":
  "You attack the sleeping Snorlax!",
  "waitForSnorlaxLeftovers":
  `You wait for a time, but the Snorlax's yawns make your party sleepy.\nAll your Pokémon fall asleep.
   $Your Pokémon are fast asleep!\nBut on the bright side, the Snorlax left something behind...`,
  "waitForSnorlaxHealed":
    `You wait for a time, but the Snorlax's yawns make your party sleepy.\nAll your Pokémon fall asleep.
    $When you all awaken, the Snorlax is no where to be found - but your Pokémon are all healed!`,



} as const;
