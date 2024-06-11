import { SimpleTranslationEntries } from "#app/plugins/i18n";

export const nonBattleEncounter: SimpleTranslationEntries = {

  "ambushNatureChange":
  `As you make your way through the {{biome}},\na wild Geodude barrels at you with an intimidating growl.
  $A faint hum emanates from its body as it begins to self destruct!
  $Your normally {{nature}} {{pokemonName}} leaps in front to protect you!\nDo you let it take the hit for you?`,
  "pokemonTanksSelfDestruct":
  `@d{32}@s{sd1}Your {{pokemonName}}@d{32}@s{sd2} takes the brunt of the attack, getting damaged heavily in the process.
  $This act of selflessness has changed its nature to {{optimalNature}}!`,
  "hitBySelfDestruct":
  `@d{32}@s{sd1}You quickly recall your {{pokemonName}} just in time,@d{32}@s{sd2} and take the brunt of the destructive blast.
  $Your head slams against the wall, and you get knocked out.
  $When you come to, your head is hurting and some of your money is missing!\nSomeone must've stolen some of it!
  $You lost ₽{{lostMoney}}.`,
  "teleportedFromSelfDestruct":
  `Just as you're about to be hit by the self destruct, your {{otherPokemon}} suddenly uses {{move}}!
   $You and your party are moved to safety. As you get ahold of your bearings, you find yourself in a barren desert!
   $@s{item_fanfare}Your {{otherPokemon}} finds a Carbos in the sand - a fitting reward for its fast reflexes.\nApply it to one of your Pokémon.`,
  "protectedFromSelfDestruct":
  `Just as you're about to be hit by the self destruct, your {{otherPokemon}} suddenly uses {{move}}!
  $You're perfectly protected from the attack.\nYour entire team levels up!`,

  "riverRelease":
  `As you navigate the {{biome}}, your {{pokemonName}} seems to be drawn to a nearby river.
  $You sense that it wants to leave your party for a time. Do you let it go?`,
  "riverReleasePokemon":
  "You part ways here, but you get the feeling that your paths will cross again...",
  "riverDontRelease":
  `You can't bear to part ways with your {{pokemonName}}. 
  $Although {{pokemonName}} is saddened to miss its opportunity for adventure, it appreciates your relationship.
  $Your friendship with {{pokemonName}} grows deeper.`,
  "riverReleaseBiomeSwitch":
  `Although you choose not to part ways, you let your {{pokemonName}} lead you up the river for a time.
  $Soon, you find yourself at a vast, pristine lake!
  $The water here is special, as if bestowing power upon your {{pokemonName}}
  $@s{item_fanfare}You gained a Mystic Water!\nApply it to one of your Pokémon.`,


  "snorlaxSleeping":
  `As you walk down a narrow pathway, you see a towering silhouette blocking your path.
  $You get closer to see a Snorlax sleeping peacefully.\nIt seems like there's no way around it.
  $Do you attack it to try and get it to move, or wait for it to wake up?`,
  "fightSnorlax":
  "You attack the sleeping Snorlax!",
  "waitForSnorlaxLeftovers":
  `You wait for a time, but the Snorlax's yawns make your party sleepy.\n 
   $Your {{pokemonName}} falls asleep.
   $But on the bright side, the Snorlax left something behind...
   $@s{item_fanfare}You gained a Leftovers!\nApply it to one of your Pokémon.`,
  "waitForSnorlaxHealed":
    `You wait for a time, but the Snorlax's yawns make your party sleepy.\nAll your Pokémon fall asleep.
    $When you all awaken, the Snorlax is no where to be found - but your Pokémon are all healed!`,


  "abandonedMachine":
    `As you navigate the abandoned {{biome}}, you stumble upon a large mechanical device hooked up to a computer.
    $It looks like with some elbow grease, you can start it up. But on the other hand...
    $You could probably just break it open and scrap it for parts.
    $Do you try to start up the machine?`,
  "abandonedMachineStartMegaBracelet":
    `After you reconnect some wires, your {{pokemonName}} delivers a jolt of electricity to the machine with {{move}}!
    $The machine stirs to life, with the distinct sounds of hammering pistons and hissing air emanating from within.
    $Finally, it spits out a Mega Bracelet on the ground!`,
  "abandonedMachineStartDynamaxBand":
    `It seems like the machine needs a good kick to start up. Your {{pokemonName}} hits it with a {{move}}!
    $You hear the whirring of bobbins, the hum of a motor and a distinct clicking of a needle.
    $As you watch, the machine create a Dynamax Band before your eyes!`,
  "abandonedMachineStartTeraOrb":
    `Your {{pokemonName}}'s steel type allows it to locate the screws, bolts, and blades that the machine requires.
    $Soon, you're able to get the machine working, and it begins to carve an intricate orb with an empty socket.
    $The machine's blades and gears retract, as it presents you with a shiny new Tera Orb!`,
  "abandonedMachineStartEggVoucher":
    `You boot up the computer, and find yourself attempting to decipher a strange language.
    $You can barely make heads or tails of it, but with some fiddling and copy and pasting, you can get it to run.
    $new ModifierRewardPhase(this.scene, [ modifierTypes.VOUCHER ])
    $You got an Egg Voucher!`,
  "abandonedMachineScrap":
    `You break open the machine with some effort and find several valuable parts.
    $It takes you some time to find buyers, but you're able to turn a tidy profit.
    $You gained ₽{{money}}!`,


  "caveSlip":
    `You find it increasingly harder to see in the depths of the cave. 
    $You make the mistake of stepping on a particularly slippery rock, only to find yourself suddenly tumbling into a ravine.
    $You desperately grab at whatever you can, and your fingers find a particularly thick root to hold on to.
    $It seems very unlikely that you'll be able to pull yourself up, given how slippery everything is. 
    $Do you attempt to pull yourself up despite the odds,\nor do you try to lower yourself down to the bottom?`,
  "caveSlipPullYourselfUp":
    `Somehow, you manage to pull yourself back up to the top of the ravine. 
    $The Pokémon in your party are both relieved and impressed at your strength! 
    $It inspires them to train a bit harder! Apply a permanent 20% ATK boost to one of your Pokémon.`,
  "caveSlipFailFall":
    `You find it difficult to pull yourself up! After failing to climb up, your arms run out of strength...
    $You plummet to the bottom of the ravine! Your {{pokemonName}} takes damage in the fall!
    $You find yourself in a dark abyss.`,
  "caveSlipLowerSlowly":
    `You choose to lower yourself slowly to the bottom of the ravine. As you carefully plant your feet on the wall
    $for added traction, you notice that some of coins fall out of your pocket!
    $You lost ₽{{lostMoney}}. \nEven when you make it to the bottom, the pitch black darkness makes the coins impossible to find.`,
  "caveSlipFly": //make sure it's only if you have compatible pokemon
    `Your {{pokemonName}} emerges and helps bring you safely back up to the cave. 
    $The experience inspires your Pokémon to learn Fly!\nTeach Fly to a member of your party?`,


  //noxious gas in slum, swamp, wasteland
  // gain poison


  // bellossom in secret garden

  // Secret club learn dance
  "dragonClubPretext":
    "You notice a small figure skulking in front of a tree. When you look closer, you see a kid standing in front of a ladder.",
  "dragonClubDialogue":
    "You can't enter our club unless you know our SECRET dance!\n@d{64}Well? Let's see it!",
  // use dragon dance
  "dragonClubJoinReaction":
    `WOW! You know it! Welcome to the Dragon Club!
    $To be honest, we're still constructing our clubhouse,\nbut here's a welcome gift for new recruits.`,
  "dragonClubJoinOutcome":
    "$@s{item_fanfare}You gained a Dragon Fang! Apply it to a Pokémon.",
  // use other dance
  "dragonClubOtherDanceReaction":
    `{{move}}, huh? @d{64}Not bad!!! 
    $You've got some potential, buddy.\nMaybe I'll teach you our secret dance!.`,
  "dragonClubOtherDanceOutcome":
    "Tom wants to teach Dragon Dance to a member of your party.\nDo you want to teach Dragon Dance to your party?",
  // no dance
  "dragonClubDontDanceReaction":
    `Well, I respect that. The secret DANCE of the DRAGON Club is for members only! 
    $Come back when if you manage to learn it!`,
  //succeed in bluffing
  "dragonClubBluffSuccess":
    "Hm... Not quite right. I can teach one of your Pokémon to do it correctly.",
  // fail to bluff your way in
  "dragonClubBluffFailure":
    `You attempt to do a dance, gesturing vaguely at the trees around you and shuffling your feet.
    $Tom is not impressed.\nHe turns away from you in disgust.
    $You shrug and go on your way.`,

  "dragonClub2Pretext":
    `You see a familiar lad examining a section of the cave wall. You approach him and recognize him as Tom
    $from the Dragon Club!\nYour{{pokemonName}} uses Dragon Dance to signify your place in the Dragon Club.`,
  "dragonClub2":
    `Hello comrade! I'm scouting out sites for our next hideout. I think this will be a good spot,
    $but I'm not sure how to start the excavation. Do ya think you can lend me a hand?`,
  // dragon club helpGround
  "dragonClub2GroundMoveReaction":
    `Wow, your {{pokemonName}}'s {{move}} carved out an opening for us! Thank you!
    $This will be a perfect spot for a base. Why not stop and rest here for a bit?`,
  "dragonClub2GroundMoveOutcome":
    "Your Pokémon are fully healed!",
  // dragon club generic
  "dragonClub2NoAction":
    `No problem, comrade. Hmmm.@d{64}.@d{64}.@d{64}.\nI'll just have to figure something else out.
    $In the mean time, I have some items for you to check out. Take a look!`,
  "dragonClub2NoActionOutcome":
    "Tom pulls out some items, and offers you one for free.",
  // dragon club learn dragon claw
  "dragonClub2Weird":
    `Ha ha ha. I love your Dragon Spirit, comrade!!!
    $After this, let me teach you a move fitting for you!`,
  "dragonClub2WeirdOutcome":
    `Tom joins you as you attempt to dig out the cave wall with your bare hands. It takes you some time, but you're
    $able to make a dent in the wall. Your hands ache, though.
    $Tom wants to teach Dragon Claw to a member of your party.\nDo you want to teach Dragon Dance to your party?`,


  "dragonClub3Pretext":
  "As you make your way through the {{biome}}, you hear a whisper from a familiar voice.",
  "dragonClub3":
  `You know the dance.
  $Comrade. Follow me.\nFollow the call of the Dragons.
  $Which path will you walk??`,
  "dragonClub3Bagon":
  "You choose the path of Bagon.",
  "dragonClub3Dratini":
  "You choose the path of Dratini.",
  "dragonClub3Gible":
  "You choose the path of Gible.",






} as const;
