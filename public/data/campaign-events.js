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
        condition: "If one faction has 3 or more total Power Level than each other faction across all districts, that faction is the dominant faction.",
        trigger: "Roll D6: on a 4+, generate one Hubris of the Mighty event.",
      },
      {
        name: "Check for Desperate Gambits",
        condition: "If one faction has 3 or less total Power Level than each other faction across all districts, that faction is the trailing faction.",
        trigger: "Roll D6: on a 4+, generate one Desperate Gambits event.",
      },
      {
        name: "Check for Underhive Upheaval",
        condition: "Always check.",
        trigger: "Roll D6, adding +1 if this is Campaign Phase 4 or later. On a 4+, generate one Underhive Upheaval event.",
      },
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
            Power Level. All factions reduce their Power Level in that district
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
            proceeding in descending order, each faction may remove their
            Stronghold racket from one district and immediately build it in
            another district where they have Power Level 1+.
          `,
        },
        {
          roll: "4",
          name: "Cred Drought",
          flavourText: "Economic collapse grips the underhive. Credits dry up and even the gangs feel the pinch.",
          effect: `
            In the next Campaign Phase: Gangs cannot declare Establish Racket
            operations. When a gang wins a battle, they may loot D6x10 points
            of equipment from the losing gang's roster (losing player chooses
            what to give up).
          `,
        },
        {
          roll: "5",
          name: "Factional Strife",
          flavourText: "Internal divisions threaten to tear factions apart as ambitious underbosses make their moves.",
          effect: `
            Each faction must secretly select one of their own gangs. Those
            gangs cannot be selected for any operations in the next Campaign
            Phase. If a faction only has one gang, they are immune to this event.
          `,
        },
        {
          roll: "6",
          name: "Archeotech Cache",
          flavourText: "Ancient technology has been unearthed in the deep foundations, drawing opportunists like flies.",
          effect: `
            The War Master selects the three districts with the lowest total
            Power Level. In the next Campaign Phase, any gang that wins a battle
            in one of these districts gains one piece of Rare equipment (up to
            50 pts) for free, added to their roster permanently.
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
            their highest Power Level (excluding their Stronghold district).
            Roll D6 for each Racket the dominant faction has in that district:
            on a 4+, that Racket is destroyed. Roll D6 for each Power Level
            the dominant faction has in that district: on a 5+, reduce their
            Power Level by 1.
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
            In the next Campaign Phase: Each gang belonging to the trailing
            faction may add one Hero model (up to 75 pts) to their roster for
            free. This model is removed from the roster at the end of the
            Campaign Phase.
          `,
        },
        {
          roll: "2",
          name: "Scorched Earth",
          flavourText: "If we can't hold it, no one will. Retreating gangers leave nothing but ashes behind.",
          effect: `
            The trailing faction may select up to two Rackets belonging to
            other factions and destroy them. For each Racket destroyed this
            way, the trailing faction may immediately build one Racket of any
            type (except Stronghold) in a district where they have Power Level 1+.
          `,
        },
        {
          roll: "3",
          name: "Underground Railroad",
          flavourText: "Hidden routes and smuggler contacts allow rapid redeployment of forces and assets.",
          effect: `
            The trailing faction may immediately: Move any number of their
            gangs to any districts (ignoring connection requirements). Relocate
            any number of their Rackets to different districts where they have
            Power Level 1+. Increase their Power Level by 1 in any two districts.
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
        The War Master redraws district connections. Some previously connected
        districts become disconnected, and some previously separate districts
        become connected. This affects all future operations.
      `,
      trigger: "War Master discretion at dramatic moments.",
    },
    {
      name: "The Purge",
      flavourText: "Inquisitorial forces descend upon the underhive, hunting for heretics with extreme prejudice.",
      effect: `
        For the next Campaign Phase, at the start of each battle, both players
        roll D6. On a 1, that player must remove one random model from their
        gang before deployment (Purge casualties). Models removed this way miss
        the next battle as well while recovering.
      `,
      trigger: "War Master discretion at dramatic moments.",
    },
    {
      name: "Guild War",
      flavourText: "The Merchant Guilds pick sides, flooding favored factions with resources while strangling others.",
      effect: `
        The War Master assigns each faction a Guild Favor rating from 1-3
        (based on narrative or random). In the next Campaign Phase: Factions
        with Favor 3 may build one free Racket. Factions with Favor 1 must pay
        double to build Rackets.
      `,
      trigger: "War Master discretion at dramatic moments.",
    },
  ],
};
