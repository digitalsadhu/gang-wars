// Campaign Missions - battle scenarios for Turf War operations
// Each mission is tied to a battle size and rewards a specific Racket type
// 100pts = Covert Ops, 200pts = Tactical Raids, 500pts = All-Out Assault

export default {
  title: "Underhive Operations",
  description: `
    When gangs clash in the underhive, the stakes are never merely survival.
    Territory, resources, and reputation hang in the balance. The mission you undertake determines what 
    size battle you fight - from small covert teams to full-scale assaults.
  `,

  missionSelection: {
    description: "When a Turf War operation results in a battle, the attacker chooses the mission:",
    rules: [
      "The attacker chooses the mission based on what they want to achieve. Each mission has an associated battle size (100, 200, or 500 points).",
      "A mission can only be chosen if the defender has the associated Racket in the district (e.g., Sabotage Run requires the defender to have Fortifications). Total War is the exception and can always be chosen.",
      "Both gangs must field a roster matching the mission's battle size.",
      "The attacker chooses the Theatre for the battle.",
      "If the defender has an Informant Network in the district, OR if any gang in the defender's faction selected the Home Turf Advantage operation in this district this phase, the defender chooses the Theatre instead.",
      "Winning a mission allows the attacker to take over the defender's associated Racket - it is removed from the defender and the attacker gains it in that district.",
    ],
  },

  powerLevelRules: {
    description: "Power Level changes when the attacker wins a battle:",
    rules: [
      "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
      "Then the attacker gains 1 Power Level in that district (maximum 4).",
    ],
  },

  battleSizes: [
    {
      points: 100,
      name: "Covert Operations",
      description: `
        Small strike teams of fighters sent on high-risk, high-reward
        missions. Speed, stealth, and precision are essential - there's no
        backup coming if things go wrong.
      `,
    },
    {
      points: 200,
      name: "Tactical Raids",
      description: `
        Balanced strike forces conducting focused operations with clear
        objectives. Enough fighters to hold ground, but not so many that
        stealth is impossible.
      `,
    },
    {
      points: 500,
      name: "All-Out Assault",
      description: `
        Major operations with full gang commitment. These are decisive battles
        that can reshape the balance of power in a district. High stakes,
        high casualties, high rewards.
      `,
    },
  ],

  missions: [
    // =========================================================================
    // 100 POINTS - COVERT OPERATIONS
    // =========================================================================
    {
      id: "sabotage-run",
      name: "Sabotage Run",
      battleSize: 100,
      racketReward: "Fortifications",
      flavourText: `
        A small demolition team infiltrates enemy territory to destroy
        defensive emplacements. Plant the charges, get out alive, and watch
        their carefully constructed defenses crumble.
      `,
      objectives: [
        {
          name: "Plant the Charges",
          type: "Progressive",
          description: "Each defensive position must be rigged for destruction.",
          scoring: `
            A model in base contact with an objective marker may rig it
            instead of taking a normal action (Move/Rush/Charge/Hold). Once
            rigged, the Attacker scores 3VP. A marker cannot be rigged again.
          `,
        },
        {
          name: "Clean Extraction",
          type: "End Game",
          description: "The charges are set - now get out before everything blows.",
          scoring: `
            During round 4, Attacker models that move off any table edge are
            removed from play. At the end of round 4, score 1VP for each
            model that exited this way.
          `,
        },
      ],
      winConditions: {
        attacker: "7+ VP (rig at least 2 objectives and extract some models, or rig all 3)",
        defender: "4 VP or less (attacker rigged at most 1 objective)",
        draw: "5-6 VP",
      },
      missionRules: [
        {
          name: "Demolition Targets",
          description: `
            The Defender places 3 objective markers representing defensive
            structures. Markers must be placed in the Defender's half of the
            battlefield, more than 6" from each other, and more than 6" from
            any table edge.
          `,
        },
        {
          name: "Defender Deployment",
          description: `
            The Defender deploys first, within 6" of their table edge.
          `,
        },
        {
          name: "Skeleton Crew",
          description: `
            The Defender deploys only 50pts of models initially. At the start
            of round 2, the remaining models arrive from any point on the
            Defender's table edge.
          `,
        },
        {
          name: "Infiltration",
          description: `
            The Attacker deploys second but takes the first turn. Attacker
            models may deploy anywhere on the battlefield more than 9" from
            any Defender model and more than 6" from any objective marker.
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district,
            they may choose one Attacker model after deployment to make a
            free 6" move (must end more than 9" from enemy models).
            If the Defender's faction has Power Level 3+ in this district,
            they deploy 25 additional points during Skeleton Crew setup
            (75pts total in round 1 instead of 50pts).
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            The explosions echo through the hab-stacks as defensive positions
            crumble. The enemy's fortifications are nothing but rubble now.
          `,
          effects: [
            "The Attacker takes over the Defender's Fortifications racket in this district.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The saboteurs are caught before they can complete their mission.
            The defenses stand, and the attackers pay the price for failure.
          `,
          effects: [
            "The Defender retains their Fortifications.",
            "Add 1 to the Defending faction's Power Level at this district (maximum 4).",
          ],
        },
        draw: {
          flavourText: "Some charges detonate, others are defused. The damage is done, but not decisively.",
          effects: [
            "The Defender retains their Fortifications, but roll D6: on 4+, it is destroyed.",
            "No Power Level changes occur.",
          ],
        },
      },
    },

    {
      id: "flip-the-asset",
      name: "Flip the Asset",
      battleSize: 100,
      racketReward: "Informant Network",
      flavourText: `
        Intelligence reports indicate a double agent is ready to defect -
        but the enemy knows too. Both sides race to reach the informant
        first. Whoever secures them gains invaluable intelligence.
      `,
      objectives: [
        {
          name: "Secure the Informant",
          type: "Progressive",
          description: "The informant will join whoever reaches them first.",
          scoring: `
            The first model to move into base contact with the Informant
            'secures' them - that player scores 5VP immediately. The Informant
            then moves with that model (4" movement, no actions).
          `,
        },
        {
          name: "Extract the Asset",
          type: "End Game",
          description: "Getting the informant is only half the battle.",
          scoring: `
            If the Informant is carried off a player's deployment zone edge,
            that player scores 8VP. If the model carrying the Informant is
            killed, the Informant is 'dropped' and can be secured again by
            any model moving into base contact.
          `,
        },
      ],
      missionRules: [
        {
          name: "The Informant",
          description: `
            Place a neutral 'Informant' model at the center of the battlefield.
            The Informant cannot be targeted by attacks until secured. Once
            secured, the Informant can be targeted normally - if reduced to
            0 wounds, both players lose (the asset is dead).
          `,
        },
        {
          name: "Covert Approach",
          description: `
            Both players deploy within 6" of opposite battlefield edges.
            All models gain Stealth until they make an attack or secure
            the Informant.
          `,
        },
        {
          name: "Valuable Cargo",
          description: `
            A model carrying the Informant reduces their movement by 2" (minimum 3").
          `,
        },
        {
          name: "Time Pressure",
          description: `
            The battle lasts only 3 rounds. At the end of round 3, if the
            Informant has not been extracted, the player whose model is
            closest to the Informant scores 3VP.
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district,
            they may make one free 6" move with a single model after
            deployment (must end more than 9" from enemy models).
            If the Defender's faction has Power Level 3+ in this district,
            the Defender chooses the Informant's starting position anywhere
            within 6" of the battlefield center instead of exactly at center.
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            The informant is secured and spirited away. Their knowledge of
            enemy movements and plans will prove invaluable in battles to come.
          `,
          effects: [
            "The Attacker takes over the Defender's Informant Network racket in this district.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The informant is recovered - and will be made an example of.
            The enemy's intelligence networks are compromised.
          `,
          effects: [
            "If the Attacker has an Informant Network in an adjacent district, it is destroyed (attackers choice which if multiple exist).",
            "Add 1 to the Defending faction's Power Level at this district. (maximum 4).",
          ],
        },
        draw: {
          flavourText: "The informant escapes in the chaos, their loyalties and location now unknown.",
          effects: [
            "The Defender retains their Informant Network.",
            "Both gangs that participated lose 1 Power Level in this district.",
          ],
        },
      },
    },

    {
      id: "dead-drop",
      name: "Dead Drop",
      battleSize: 100,
      racketReward: "Safe House",
      flavourText: `
        A hidden cache has been located - supplies, weapons, and a secure
        bolt-hole for operations. But which of the three locations is real?
        Find it before the enemy, and secure a vital safe house.
      `,
      objectives: [
        {
          name: "Search the Locations",
          type: "Progressive",
          description: "Only one cache is real. The others are decoys or traps.",
          scoring: `
            At the end of each round, if a player controls an unrevealed
            marker, they search it. For the first marker searched, roll D3:
            on a 1, it's the real cache. For the second marker, roll D2: on
            a 1, it's the real cache. If the real cache is not found in the
            first two searches, the third marker is automatically the real cache.
            The player who finds the real cache scores 5VP.
            Finding a decoy scores 1VP and the marker is removed.
          `,
        },
        {
          name: "Secure the Cache",
          type: "End Game",
          description: "Once found, the cache must be held against all comers.",
          scoring: `
            At the end of round 4, the player controlling the revealed cache
            scores 6VP.
          `,
        },
      ],
      winConditions: {
        attacker: "More VP than Defender",
        defender: "More VP than Attacker",
        draw: "Equal VP",
      },
      missionRules: [
        {
          name: "Hidden Caches",
          description: `
            The Defender places 3 face-down objective markers anywhere on the
            battlefield more than 9" from either deployment zone and more than
            6" from each other. Neither player knows which marker is real -
            this is determined by die roll when searched.
          `,
        },
        {
          name: "Searching",
          description: `
            At the end of each round, a marker is searched if a unit is within
            3" of it while enemies aren't. If units from both sides are within
            3", the marker is contested and cannot be searched.
          `,
        },
        {
          name: "Booby Traps",
          description: `
            When a decoy is revealed, roll D3. On a 1, the marker was
            booby-trapped: the nearest model to the marker takes a hit
            with AP(1).
          `,
        },
        {
          name: "Small Teams",
          description: `
            Both players deploy within 6" of opposite battlefield corners
            (diagonally opposite). The small battlefield and scattered
            objectives reward splitting forces.
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district,
            they may reroll one Search roll each round.
            If the Defender's faction has Power Level 3+ in this district,
            the first decoy marker they reveal each battle automatically
            triggers a booby trap (no D3 roll required).
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            The safe house is yours. A hidden bolt-hole where your gang can
            lie low, store supplies, and escape the consequences of failure.
          `,
          effects: [
            "The Attacker takes over the Defender's Safe House racket in this district.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The cache remains in friendly hands. The enemy's search was for
            nothing, and your faction's hidden resources stay hidden.
          `,
          effects: [
            "The Defender retains their Safe House.",
            "Add 1 to the Defending faction's Power Level at this district. (maximum 4).",
          ],
        },
        draw: {
          flavourText: "Both sides withdraw, the cache's true location still contested.",
          effects: [
            "The Defender retains their Safe House.",
            "No Power Level changes occur.",
          ],
        },
      },
    },

    // =========================================================================
    // 200 POINTS - TACTICAL RAIDS
    // =========================================================================
    {
      id: "run-the-gauntlet",
      name: "Run the Gauntlet",
      battleSize: 200,
      racketReward: "Smuggling Route",
      flavourText: `
        A smuggling corridor runs through this district - whoever controls
        the checkpoints controls the flow of contraband. The defenders have
        their routes established. The attackers must seize them.
      `,
      objectives: [
        {
          name: "Secure the Checkpoints",
          type: "Progressive",
          description: "Each checkpoint must be held to control the route.",
          scoring: `
            At the end of each round (starting round 2), score 1VP for each
            objective marker you control. Score a 3VP bonus if you control
            all three simultaneously.
          `,
        },
        {
          name: "Lock Down the Route",
          type: "End Game",
          description: "Total control means total profit.",
          scoring: `
            At the end of round 4, score 5VP if you control all three
            objective markers. Score 2VP if you control more markers than
            your opponent.
          `,
        },
      ],
      winConditions: {
        attacker: "More VP than Defender",
        defender: "More VP than Attacker",
        draw: "Equal VP",
      },
      missionRules: [
        {
          name: "The Corridor",
          description: `
            Place three objective markers in a line down the center of the
            battlefield, each 12" apart. These represent the smuggling
            checkpoints. Terrain should create a 'corridor' feel with
            approaches from both sides.
          `,
        },
        {
          name: "Established Routes",
          description: `
            The Defender controls the center checkpoint at the start of the
            game. Additionally, the Defender deploys first, within 6" of the
            center line (not their table edge). The Attacker then deploys
            within 9" of either long table edge.
          `,
        },
        {
          name: "Smuggler's Shortcut",
          description: `
            Once per battle, at the start of any round after round 1, a
            player may remove one of their models within 3" of a checkpoint
            they control. Immediately place that model within 3" of a
            different checkpoint (at least 1" from enemies). The model may
            activate normally this round.
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district,
            the Attacker may use Smuggler's Shortcut one additional time
            this battle.
            If the Defender's faction has Power Level 3+ in this district,
            the Defender may use Smuggler's Shortcut once during round 1
            (instead of after round 1).
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            The smuggling route is yours. Contraband, weapons, and fighters
            can now move freely through this district under your control.
          `,
          effects: [
            "The Attacker takes over the Defender's Smuggling Route racket in this district.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The smuggling route remains secure. The attackers are driven off,
            and your faction's supply lines continue uninterrupted.
          `,
          effects: [
            "The Defender retains their Smuggling Route and may immediately move one gang belonging to themselves or a faction member from an adjacent district to this district for free.",
            "Add 1 to the Defending faction's Power Level at this district.",
          ],
        },
        draw: {
          flavourText: "The checkpoints change hands multiple times. Neither side can claim clear control.",
          effects: [
            "The Defender retains their Smuggling Route.",
            "No change to either the Defender's Power or the Attacker's Power Level.",
          ],
        },
      },
    },

    {
      id: "blood-sport",
      name: "Blood Sport",
      battleSize: 200,
      racketReward: "Fighting Pit",
      flavourText: `
        An underground fighting ring operates in this district. Take over
        the pit by killing the Pit Boss and proving your gang's dominance
        in brutal close-quarters combat.
      `,
      objectives: [
        {
          name: "Kill the Pit Boss",
          type: "Immediate",
          description: "The Pit Boss controls the venue. Kill them and take over.",
          scoring: `
            A neutral 'Pit Boss' model starts in the center of the pit.
            The player who removes the Pit Boss as a casualty scores 6VP
            immediately. The Pit Boss activates at the end of each round,
            attacking the nearest model.
          `,
        },
        {
          name: "Dominate the Pit",
          type: "Progressive",
          description: "The crowd respects only strength. Prove yours.",
          scoring: `
            At the end of each round (starting round 2), score 2VP if you have
            more models within 6" of the pit center than your opponent.
            Score 1VP for each enemy model killed inside the pit by your
            models that are also in the pit (maximum 2VP per round from these kills).
          `,
        },
      ],
      winConditions: {
        attacker: "More VP than Defender",
        defender: "More VP than Attacker",
        draw: "Equal VP",
      },
      missionRules: [
        {
          name: "The Pit",
          description: `
            The center of the battlefield is a sunken fighting pit (6" radius
            circle). Models can draw line of sight normally across the pit edge.
            The pit edge is difficult terrain.
          `,
        },
        {
          name: "The Pit Boss",
          description: `
            The Pit Boss is a Q4+ model with 3 wounds (Tough(3)), and a
            brutal melee weapon (A3, AP(1)). They are hostile to all gangs.
            At the end of each round, the Pit Boss charges the nearest model
            within 12" (or moves toward the nearest model if none in range).
          `,
        },
        {
          name: "Thrown into the Pit",
          description: `
            A model that wins melee against an enemy within 3" of the pit
            edge may push them into the pit instead of dealing damage.
            The pushed model takes a hit with AP(0) from the fall.
          `,
        },
        {
          name: "Kill Credit",
          description: `
            For VP scoring, a model that is destroyed by fall damage after being
            pushed counts as killed by the model that pushed it. Models removed
            by the Pit Boss do not award VP to either player.
          `,
        },
        {
          name: "Crowd Favorite",
          description: `
            Models in the pit gain +1 to hit in melee. Models outside the
            pit suffer -1 to hit when shooting at models inside the pit
            (crowd interference).
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district,
            Attacker models in the pit score +1VP the first time each round
            they remove an enemy model as a casualty (maximum +1VP per round).
            If the Defender's faction has Power Level 3+ in this district,
            the Pit Boss does not target Defender models in rounds 1-2 unless
            no Attacker model is within 12".
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            The Pit Boss falls, and your gang claims the fighting ring. Fresh
            recruits, hardened by the pit, will flock to your banner.
          `,
          effects: [
            "The Attacker takes over the Defender's Fighting Pit racket in this district.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The attackers are thrown into the pit and torn apart by its
            defenders. The Fighting Pit remains under your faction's control.
          `,
          effects: [
            "Add 1 to the Defending faction's Power Level at this district (maximum 4).",
          ],
        },
        draw: {
          flavourText: "Both gangs retreat battered and bloody, neither able to claim the pit.",
          effects: [
            "The Defender retains their Fighting Pit.",
            "No Power Level changes occur.",
          ],
        },
      },
    },

    // =========================================================================
    // 500 POINTS - ALL-OUT ASSAULT
    // =========================================================================
    {
      id: "chokepoint",
      name: "Chokepoint",
      battleSize: 500,
      racketReward: "Toll Gate",
      flavourText: `
        A critical passage between districts - whoever controls this crossing
        controls all movement through the area. The defenders have fortified
        heavily. The attackers must break through at any cost.
      `,
      objectives: [
        {
          name: "Break the Line",
          type: "Progressive",
          description: "The defensive line must be breached before the gate can be seized.",
          scoring: `
            At the end of each round (starting round 2):
            - The Attacker scores 2VP if they control at least one Breach marker.
            - The Attacker scores +1VP if they control both Breach markers.
            - The Attacker scores +1VP if at least one non-Shaken Attacker unit
              is wholly within the Defender's zone.
            - The Defender scores 2VP if they control at least one Breach marker,
              the Attacker controls no Breach markers, and the Attacker has no
              non-Shaken units wholly within the Defender's zone.
            A marker is controlled if one player has one or more non-Shaken
            units within 3" of it and the other player has none.
          `,
        },
        {
          name: "Seize the Gate",
          type: "End Game",
          description: "The toll gate itself is the prize.",
          scoring: `
            An objective marker represents the Toll Gate in the center of
            the Defender's zone. At the end of round 5, the player controlling
            the gate scores 8VP. If contested, no one scores.
            The Attacker may only control the Toll Gate if they control at
            least one Breach marker.
          `,
        },
      ],
      winConditions: {
        attacker: "More VP than Defender",
        defender: "More VP than Attacker",
        draw: "Equal VP",
      },
      missionRules: [
        {
          name: "Fortified Crossing",
          description: `
            Split the battlefield into three equal zones between the Attacker's
            table edge and the Defender's table edge: Attacker's zone,
            No-Man's Land, and Defender's zone.
            The Defender places the Toll Gate objective in the center of
            their zone. Place 2 Breach markers on the boundary line between
            No-Man's Land and the Defender's zone, each 12" from a side
            table edge. The Defender may place up to 4 barricade terrain
            pieces anywhere in No-Man's Land or their zone.
          `,
        },
        {
          name: "Assault Deployment",
          description: `
            The Defender deploys first, and all Defender units must deploy
            wholly within the Defender's zone. The Attacker deploys second,
            and all Attacker units must deploy wholly within the Attacker's
            zone. The Attacker takes the first turn in round 1.
          `,
        },
        {
          name: "Numerical Superiority",
          description: `
            The Attacker has committed everything to this assault. The
            Attacker may field 550pts instead of 500pts.
          `,
        },
        {
          name: "Defensive Positions",
          description: `
            Defender models wholly within their deployment zone gain +1 to
            Defense rolls during rounds 1 and 2.
          `,
        },
        {
          name: "Grinding Assault",
          description: `
            This battle lasts 5 rounds instead of 4. Reinforcements matter:
            at the start of round 3, each player may return one destroyed
            non-Hero unit worth 50pts or less from their starting roster, at
            full original composition and equipment. The returned unit is
            placed wholly within 6" of that player's table edge, in coherency,
            and more than 9" from all enemy units.
          `,
        },
        {
          name: "No Retreat",
          description: `
            Neither side can afford to give ground. Models automatically pass
            Morale tests while within their own deployment zone.
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district,
            they may field 575pts instead of 550pts.
            If the Defender's faction has Power Level 3+ in this district,
            they choose one:
            (a) place 1 additional barricade, or
            (b) Defensive Positions lasts through round 3 instead of round 2.
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            The defensive line crumbles. Your gang surges through the
            chokepoint, claiming control of all traffic through this corridor.
          `,
          effects: [
            "The Attacker takes over the Defender's Toll Gate racket in this district.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The assault breaks against your fortifications. The chokepoint
            holds, and the enemy retreats leaving their dead behind.
          `,
          effects: [
            "The Defender retains their Toll Gate, and it cannot be destroyed by any means next Campaign Phase.",
            "The Attacking gang that participated cannot declare Turf War operations next Campaign Phase.",
            "Add 1 to the Defending faction's Power Level at this district (maximum 4).",
          ],
        },
        draw: {
          flavourText: "The battle grinds to a stalemate. The chokepoint remains contested.",
          effects: [
            "The Defender retains their Toll Gate.",
            "Both factions reduce their Power Level in this district by 1 (casualties and exhaustion).",
          ],
        },
      },
    },

    {
      id: "storm-the-gates",
      name: "Storm the Gates",
      battleSize: 500,
      racketReward: "Stronghold",
      flavourText: `
        A full-scale assault on a faction's seat of power. The defenders
        fight for everything they've built. The attackers seek to tear it
        all down. This is the endgame.
      `,
      objectives: [
        {
          name: "Breach the Defenses",
          type: "Progressive",
          description: "The Stronghold has multiple defensive layers.",
          scoring: `
            Three objective markers are placed in a line leading to the
            Stronghold (Outer Gate, Inner Courtyard, Command Center). The
            Attacker scores 3VP the first time they seize each marker from
            the Defender. Markers must be captured in order.
          `,
        },
        {
          name: "Take the Stronghold",
          type: "End Game",
          description: "The Command Center is the heart of enemy operations.",
          scoring: `
            At the end of round 5, the player controlling the Command Center
            marker scores 10VP. The Defender scores 5VP if the Attacker scored
            0VP from Breach the Defenses.
          `,
        },
      ],
      winConditions: {
        attacker: "More VP than Defender",
        defender: "More VP than Attacker",
        draw: "Equal VP",
      },
      missionRules: [
        {
          name: "Fortified Stronghold",
          description: `
            The Defender places their Stronghold terrain near the center line
            of their half of the battlefield. Place the Command Center marker
            on the center line, 6" from the Defender table edge (inside the
            Stronghold terrain if possible). Place the Inner Courtyard marker
            on the same center line, 12" from the Defender table edge. Place
            the Outer Gate marker on the same center line, 18" from the
            Defender table edge.
          `,
        },
        {
          name: "Siege Deployment",
          description: `
            The Defender chooses one table edge as their deployment edge. The
            Attacker deploys from the opposite edge. The Defender deploys
            first, with all units wholly within 12" of their table edge. The
            Attacker deploys second, with all units wholly within 12" of their
            table edge. The Attacker takes the first turn in round 1.
          `,
        },
        {
          name: "Layered Capture",
          description: `
            The Defender starts the battle controlling all three objective
            markers. The Attacker may only seize the Inner Courtyard while
            controlling the Outer Gate, and may only seize the Command Center
            while controlling the Inner Courtyard.
          `,
        },
        {
          name: "Layered Defense",
          description: `
            Each objective marker provides benefits while controlled by the
            Defender: Outer Gate - models within 6" gain +1 to Defense rolls
            against shooting attacks. Inner
            Courtyard - models within 6" gain +1 to hit. Command Center -
            models within 6" automatically pass Morale tests.
          `,
        },
        {
          name: "All In",
          description: `
            Both sides have committed everything. This battle lasts 5 rounds.
            No models may voluntarily leave the battlefield.
          `,
        },
        {
          name: "Desperate Defense",
          description: `
            The first time each round that the Defender loses control of an
            objective marker, this effect is set to trigger. At the start of
            the next round, before the first activation, one non-Shaken
            Defender Hero may make a free 6" move (must end more than 1" from
            enemy models). This effect may trigger only once per round.
          `,
        },
        {
          name: "Total Commitment",
          description: `
            Both sides have committed major forces. The Attacker may field up
            to 550pts. The Defender may field up to 550pts.
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district,
            one Attacker unit may make a free 6" move after deployment
            (must end more than 9" from enemy models).
            If the Defender's faction has Power Level 3+ in this district,
            they may field up to 575pts instead of 550pts.
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            The Stronghold falls. Your gang plants their banner in the
            smoldering ruins of enemy command. Their power in this district
            is broken utterly.
          `,
          effects: [
            "The Attacker takes over the Defender's Stronghold racket in this district.",
            "Destroy all other Defender Rackets in this district.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The assault is repelled. Your Stronghold stands bloodied but
            unbroken, a testament to your faction's strength.
          `,
          effects: [
            "The Defender retains their Stronghold.",
            "Add 1 to the Defending faction's Power Level at this district (maximum 4).",
          ],
        },
        draw: {
          flavourText: "The battle rages to exhaustion. The Stronghold stands, but barely.",
          effects: [
            "The Defender retains their Stronghold, but it is damaged",
            "Both factions reduce their Power Level in this district by 1.",
          ],
        },
      },
    },

    {
      id: "total-war",
      name: "Total War",
      battleSize: 500,
      racketReward: null,
      flavourText: `
        No objectives. No tricks. This is a battle of annihilation - drive
        the enemy from this district entirely, or be driven out yourself.
        Only one faction walks away.
      `,
      objectives: [
        {
          name: "Annihilation",
          type: "Progressive",
          description: "Every enemy fighter removed is a step toward total victory.",
          scoring: `
            Score 1VP for each enemy model removed as a casualty. Score 2VP
            instead for Heroes and 3VP for the enemy Leader.
          `,
        },
        {
          name: "Break Their Spirit",
          type: "End Game",
          description: "When a gang breaks, they lose everything.",
          scoring: `
            If one gang is completely wiped out, the other player scores 10VP.
            If the battle reaches the end of round 4, the player with more
            surviving models scores 5VP.
          `,
        },
      ],
      winConditions: {
        attacker: "More VP than Defender",
        defender: "More VP than Attacker",
        draw: "Equal VP",
      },
      missionRules: [
        {
          name: "No Quarter",
          description: `
            This is a battle of annihilation fought on a standard 4'x4'
            battlefield. There are no objective markers.
            The Defender chooses one table edge as their deployment edge. The
            Attacker deploys from the opposite edge. The Defender deploys
            first, with all units wholly within 12" of their table edge. The
            Attacker deploys second, with all units wholly within 12" of their
            table edge. The Attacker takes the first turn in round 1.
          `,
        },
        {
          name: "Blood Frenzy",
          description: `
            From round 3 onwards, all models gain +1 to hit in melee.
            The battle grows more desperate as it continues.
          `,
        },
        {
          name: "Decisive Battle",
          description: `
            This battle lasts until one side is wiped out, or 4 rounds have
            passed, whichever comes first.
          `,
        },
        {
          name: "Power Level Advantage (3+)",
          description: `
            If the Attacker's faction has Power Level 3+ in this district
            one Attacker unit may make a free 6" move after deployment
            (must end more than 9" from enemy models).
            If the Defender's faction has Power Level 3+ in this district,
            once per battle, after failing a Morale test, one Defender unit
            may treat that test as passed instead.
          `,
        },
      ],
      campaignOutcome: {
        attackerWins: {
          flavourText: `
            Total victory. The defenders are broken, scattered, driven into
            the depths. This district belongs to your faction now.
          `,
          effects: [
            "One gang from the defending faction in the contested district must relocate to an adjacent district chosen by the Defending faction.",
            "If the defender's Power Level in the district is less than or equal to the attacker's Power Level, the defender loses 1 Power Level first.",
            "Then the attacker gains 1 Power Level in that district (maximum 4).",
          ],
        },
        defenderWins: {
          flavourText: `
            The assault is crushed utterly. The attackers retreat in disarray,
            their ambitions in this district shattered.
          `,
          effects: [
            "Reduce the Attacking faction's Power Level in this district by 1 (minimum 0).",
            "Add 1 to the Defending faction's Power Level at this district (maximum 4).",
          ],
        },
        draw: {
          flavourText: "Both sides are bled white. The battle solves nothing, but at terrible cost.",
          effects: [
            "Both factions reduce their Power Level in this district by 1.",
          ],
        },
      },
    },
  ],
};
