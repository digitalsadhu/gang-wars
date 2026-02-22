// Campaign Operations - actions players can take each campaign phase
// Each player selects one operation per phase

export default {
  operations: [
    {
      name: "Turf War",
      type: "common",
      description: `
        When selecting this campaign operation, select one of the campaign attack
        types, select this gang's district or one adjacent district, then select
        one opposing faction. In the resolve battle operations stage, each faction
        will select players from their faction to defend against the turf war
        operations that have been declared against them. For each of those turf
        war operations, a player from that faction can be selected to play against
        the player whose gang declared it.
      `,
    },
    {
      name: "Relocate",
      type: "common",
      description: "Move this gang to one adjacent district on the map.",
    },
    {
      name: "Establish Racket",
      type: "common",
      description: `
        Establish a racket in this gang's district. You may not select the same
        racket twice in the same district, but you may select the same racket in
        different districts. Rackets provide ongoing benefits to the controlling
        faction as long as they remain established. You may not select the
        stronghold racket.
      `,
    },
    {
      name: "Home Turf Advantage",
      type: "common",
      description: `
        For this phase, each time this gang's faction is attacked on this district
        or one connected to it, the player from this faction fighting the battle
        can choose the theatre instead of the player from the attacking faction.
      `,
    },
    {
      name: "Subvert Influence",
      type: "common",
      description: `
        Select this gang's district or one beside it. For each opposing faction,
        the war master rolls one D6; on a 5+, that faction's power level is
        reduced by 1.
      `,
    },
  ],
};
