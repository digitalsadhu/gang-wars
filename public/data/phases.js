// Campaign Phases - the sequence of steps in each campaign round

export default {
  title: "Campaign Phases",
  description: "Each Campaign Phase follows this sequence:",

  phases: [
    {
      number: 1,
      name: "Select Operations",
      description: `
        In this step, each player selects one Campaign Operation. Players should
        work together with other members of their Alliance to build a strategy.
        Players then inform the Gamemaster of their decisions. Some Campaign
        Operations will require additional information; for example, a Turf war
        Operation will require the player to decide which type of Turf war
        Operation they wish to initiate, and where and who they wish to attack.
      `,
    },
    {
      number: 2,
      name: "Reveal Operations",
      description: `
        Once all operations have been selected and sent to the Gamemaster, the
        Gamemaster reveals all chosen Operations.
      `,
    },
    {
      number: 3,
      name: "Resolve Establish Racket Operations",
      description: `
        Players who selected Establish Racket do so now. If multiple players
        targeted the same district with the same racket, a Turf War battle must
        be fought (choose the turf war type based on the type of racket) to determine
        who establishes the racket. Place a new racket marker of the correct type in the target district.
      `,
    },
    {
      number: 4,
      name: "Resolve Turf War Operations",
      description: `
        Players who selected the Turf War operation attack enemy positions based
        on which district they targeted and which type of Turf War they selected.
        The attacker chooses which theatre the turf war takes place in out of the
        available theatres in that district unless the defender has an informant
        network in that district or they or an ally at this location have taken
        the "Home Turf Advantage" operation in which case the defender chooses
        the theatre. The winner applies the Campaign Outcomes for that battle
        as described in the mission description.
      `,
    },
    {
      number: 5,
      name: "Resolve Relocate Operations",
      description: `
        Players who selected the Relocate operation move their gang marker to an
        adjacent district.
      `,
    },
    {
      number: 6,
      name: "Resolve Subvert Influence Operations",
      description: `
        The Gamemaster rolls to see which Subvert Influence Operations succeed
        and reduces gang Power Levels accordingly.
      `,
    },
    {
      number: 7,
      name: "Campaign Events",
      description: `
        The Gamemaster rolls on the Campaign Events table to determine what
        external factors affect the campaign this phase.
      `,
    },
    {
      number: 8,
      name: "Relocate",
      description: `
        Each player may move their gang to an adjacent district on the map.
      `,
    },
    {
      number: 9,
      name: "Establish Racket",
      description: `
        Each alliance may establish one racket in one district where an alliance
        gang is currently located. If multiple players target the same district
        with the same racket, a Turf War battle must be fought (choose the turf war type based on the type of racket)
        to determine who establishes the racket. Place a new racket marker of the correct type in
        the target district.
      `,
    },
  ],
};
