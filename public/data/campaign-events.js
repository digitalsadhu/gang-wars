// Campaign Events - external factors that shake up the campaign
// Generated based on faction power levels and campaign phase

export default {
  title: "Underhive Upheaval",
  description: `
    As the gang war intensifies, the hive itself reacts to the violence.
    Authorities crack down, old factions shatter, and the desperate masses
    become pawns in the struggle for dominance.
  `,

  generationRules: {
    description: "At the end of each Campaign Phase, during the Campaign Events step, the War Master does the following in order:",
    steps: [
      {
        name: "Check for Hubris of the Mighty",
        condition: "If one faction has 3 or more total Power Level more than each other faction across all districts, that faction is the dominant faction.",
        trigger: "Roll D6: on a 4+, generate one Hubris of the Mighty event.",
      },
      {
        name: "Check for Desperate Gambits",
        condition: "If one faction has 3 or more total Power Level less than each other faction across all districts, that faction is the trailing faction.",
        trigger: "Roll D6: on a 4+, generate one Desperate Gambits event.",
      },
      {
        name: "Check for Underhive Upheaval",
        condition: "Always check.",
        trigger: "Roll D6, adding +1 if this is Campaign Phase 3. On a 4+, generate one Underhive Upheaval event.",
      },
      {
        name: "Check for Special Event",
        condition: "Always check after resolving all generated events above.",
        trigger: "Roll D6. On a 6, generate one Special Event. Roll D3 to determine which Special Event is used this phase.",
      },
    ],
    tieBreakers: [
      "If multiple factions are tied for dominant or trailing status, no Hubris or Desperate Gambits event is generated this phase.",
      "If an event requires selecting a district and multiple districts are tied, randomly determine the district among tied candidates.",
      "If an event has already been rolled in a previous phase, re-roll it.",
    ],
  },

  eventTables: [
    {
      name: "Underhive Upheaval",
      dieType: "D6",
      description: "General events that shake up the campaign.",
      events: [
        {
          roll: "1",
          name: "Enforcer Crackdown",
          flavourText: "Arbites patrols flood the districts, forcing gangs to scatter and lie low.",
          effect: `
            In the next Campaign Phase: Gangs cannot declare Turf War operations
            in districts where they have a Racket. All Toll Gate rackets are
            temporarily inactive.
          `,
        },
        {
          roll: "2",
          name: "Toxic Spill",
          flavourText: "A catastrophic chemical leak renders entire sectors uninhabitable, forcing desperate relocations.",
          effect: `
            The War Master selects the district with the lowest total combined
            Power Level (if tied, random among tied districts).
            All factions reduce their Power Level in that district
            to 0. Each gang currently in that district must immediately Relocate
            to a connected district (controlling player's choice).
          `,
        },
        {
          roll: "3",
          name: "Turf Reshuffle",
          flavourText: "Old territorial claims mean nothing as power shifts reshape the underhive's boundaries.",
          effect: `
            Starting with the faction with the highest total Power Level and
            proceeding in descending order (random among tied factions), each
            faction may remove their Stronghold racket from one district and
            immediately build it in another district where they have Power Level 1+.
          `,
        },
        {
          roll: "4",
          name: "Cred Drought",
          flavourText: "Economic collapse grips the underhive. Credits dry up and even the gangs feel the pinch.",
          effect: `
            In the next Campaign Phase: Gangs cannot declare Establish Racket
            operations, and factions cannot establish free Rackets during the
            Faction Racket step. The first time each faction wins a battle that
            phase,
            that faction gains +1 Power Level in the battle's district
            (maximum 4).
          `,
        },
        {
          roll: "5",
          name: "Factional Strife",
          flavourText: "Internal divisions threaten to tear factions apart as ambitious underbosses make their moves.",
          effect: `
            Each faction must secretly select one of their own gangs. Those
            gangs cannot be selected for any operations in the next Campaign
            Phase. (But they may still be selected to defend against Turf War operations declared by other factions.)
          `,
        },
        {
          roll: "6",
          name: "Archeotech Cache",
          flavourText: "Ancient technology has been unearthed in the deep foundations, drawing opportunists like flies.",
          effect: `
            The War Master selects the three districts with the lowest total
            Power Level (if tied, random among tied districts until three are
            selected). In the next Campaign Phase, the first gang from each
            faction that wins a battle in one of these districts grants their
            faction one Archeotech Claim (maximum one claim per faction). During
            that phase's Faction Racket step, each claim may be spent to
            establish one additional free non-Stronghold Racket in a district
            where that faction has a gang.
          `,
        },
      ],
    },
    {
      name: "Hubris of the Mighty",
      dieType: "D3",
      description: "Events that punish the dominant faction for overreaching.",
      events: [
        {
          roll: "1",
          name: "Uprising",
          flavourText: "The oppressed masses rise against their overlords, sabotaging operations and burning strongholds.",
          effect: `
            The War Master selects one district where the dominant faction has
            their highest Power Level, excluding their Stronghold district
            (if tied, random among tied districts). Roll D6 for each
            Racket the dominant faction has in that district: on a 4+, that
            Racket is destroyed. Roll D6 for each Power Level the dominant
            faction has in that district: on a 5+, reduce their Power Level by
            1 (minimum 0).
          `,
        },
        {
          roll: "2",
          name: "Coordinated Resistance",
          flavourText: "Rival factions set aside their differences to oppose the common threat.",
          effect: `
            In the next Campaign Phase: When any gang fights a battle against
            the dominant faction, they may treat their faction's Power Level
            in that district as 1 higher for Mission Rules and Campaign Outcomes.
            Gangs from non-dominant factions gain +1 to hit in the first round
            of any battle against the dominant faction.
          `,
        },
        {
          roll: "3",
          name: "Exposed Operations",
          flavourText: "Spies have infiltrated the dominant faction's command structure, revealing their plans.",
          effect: `
            In the next Campaign Phase: During the Select Operations step,
            the dominant faction must declare and reveal all of their gang's
            operations before other factions declare theirs.
          `,
        },
      ],
    },
    {
      name: "Desperate Gambits",
      dieType: "D3",
      description: "Events that give the trailing faction a chance to recover.",
      events: [
        {
          roll: "1",
          name: "Borrowed Muscle",
          flavourText: "Desperate times call for desperate measures. Mercenaries, pit fighters, and hired guns flock to the cause.",
          effect: `
            In the next Campaign Phase, each gang belonging to the trailing
            faction may exceed the selected mission battle size by:
            +25pts in 100pt missions, +40pts in 200pt missions, or +50pts in
            500pt missions. Extra points may only be spent on non-Hero units.
          `,
        },
        {
          roll: "2",
          name: "Scorched Earth",
          flavourText: "If we can't hold it, no one will. Retreating gangers leave nothing but ashes behind.",
          effect: `
            The trailing faction may select up to two enemy Rackets in
            districts where the trailing faction has Power Level 1+.
            Roll D6 for each selected Racket: on a 4+, that Racket is
            destroyed. For each Racket destroyed this way, the trailing faction
            may immediately build one non-Stronghold Racket in a district where
            they have Power Level 1+ (maximum one built per district).
          `,
        },
        {
          roll: "3",
          name: "Underground Railroad",
          flavourText: "Hidden routes and smuggler contacts allow rapid redeployment of forces and assets.",
          effect: `
            The trailing faction may immediately choose up to two of the
            following options (each option may be chosen once):
            (a) Move up to two of their gangs to any districts (ignoring
            connection requirements).
            (b) Relocate one of their Rackets to a different district where
            they have Power Level 1+.
            (c) Increase their Power Level by 1 in one district (maximum 4).
          `,
        },
      ],
    },
  ],

  specialEvents: [
    {
      name: "Hive Quake",
      flavourText: "The ancient foundations shudder and collapse, reshaping the underhive's geography.",
      effect: `
        Randomly select two currently connected district pairs and remove those
        connections. Re-roll any impossible result.
        This affects all future operations.
      `,
      trigger: "Only when the Special Event check succeeds and this event is randomly rolled on D3.",
    },
    {
      name: "The Purge",
      flavourText: "Inquisitorial forces descend upon the underhive, hunting for heretics with extreme prejudice.",
      effect: `
        For the next Campaign Phase, at the start of each battle, both players
        roll D6. On a 1-2, that player must remove one random model from their
        battle roster before deployment (Purge casualties).
      `,
      trigger: "Only when the Special Event check succeeds and this event is randomly rolled on D3.",
    },
    {
      name: "Guild War",
      flavourText: "The Merchant Guilds pick sides, flooding favored factions with resources while strangling others.",
      effect: `
        Each faction rolls D3 to determine its Guild Favor rating (1-3). In
        the next Campaign Phase: Factions
        with Favor 3 may establish one additional free non-Stronghold Racket
        during the Faction Racket step. Factions with Favor 1 cannot declare
        Establish Racket operations and cannot establish free Rackets during
        the Faction Racket step.
      `,
      trigger: "Only when the Special Event check succeeds and this event is randomly rolled on D3.",
    },
  ],
};
