// Rackets - persistent territorial assets that provide ongoing benefits
// Factions can establish rackets in districts where they have presence

export default {
  rackets: [
    {
      name: "Stronghold",
      description: `
        Each time a gang from this faction wins a battle at this or a connected
        district, they can treat their faction's Power Level at that district
        as 1 higher or lower than it actually is for the purposes of that
        battle and that battle's Campaign Outcomes.
      `,
    },
    {
      name: "Fortifications",
      description: `
        Increase the Power Level of this faction in this district
        by 1. The first time a rule would reduce the faction's Power Level by 1, 
        the Fortifications in that district is destroyed instead.
      `,
    },
    {
      name: "Smuggling Route",
      description: `
        Once per campaign phase, a gang from this faction may use the Relocate
        operation to move to this district, even
        if they have already selected a different operation this phase.
      `,
    },
    {
      name: "Informant Network",
      description: `
        During the Reveal Operations step, the faction that owns this racket may look at one
        opposing faction's selected operations before revealing their own and 1 player from that faction may
        change their selected operation. This benefit may only be applied once per phase regardless of how many
        Informant Network rackets a faction has.
        Additionally, when defending a Turf War in this district, the defender
        chooses the theatre instead of the attacker.
      `,
    },
    {
      name: "Fighting Pit",
      description: `
        During any battle in this district, the faction owning this racket may
        add one basic fighter of up to 30 pts to their gang roster for that battle.
      `,
    },
    {
      name: "Toll Gate",
      description: `
        Enemy factions treat this district as not connected to adjacent districts
        for the purposes of declaring Turf War operations.
      `,
    },
    {
      name: "Safe House",
      description: `
        When a gang from this faction loses a battle in this district,
        their controlling player may choose to have that gang 'go to
        ground.' If they do, ignore all negative Campaign Outcomes from that
        battle, after that, the safe house is destroyed.
      `,
    },
  ],
};
