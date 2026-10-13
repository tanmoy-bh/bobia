// ─────────────────────────────────────────────────────────────
//  EVERYTHING PERSONAL LIVES IN THIS FILE.
//
//  33 treasures: 32 chests along the road + Heart Castle at the end.
//  Each chest: a puzzle to open it, then a treasure (photo + memory)
//  that holds the clue for the next chest.
//
//  Images: drop files into /public/images and reference them as
//  'images/your-file.jpg'. Leave `image: null` to show a placeholder.
//
//  `landmark` picks the drawing next to the chest. Options:
//  palms, windmill, lighthouse, lake, falls, cottage, balloon, bench, cake
//
//  Answers are compared loosely: case, spaces and punctuation are ignored.
//  "(While testing: …)" text in the clues is there so you can play
//  through. Replace every clue before the big day.
// ─────────────────────────────────────────────────────────────

export default {
  herName: 'Joy',
  fromName: 'Tanmoy',

  // Typed on the first screen to enter (case doesn't matter).
  passphrase: 'HBDJoy',

  // HUD: she starts at level 32 and levels up to 33 at the very end.
  startLevel: 32,
  endLevel: 33,

  // Gems pay for wizard hints. Every chest she opens adds a few more.
  startGems: 33,
  hintCost: 3,
  gemsPerChest: 1,

  intro: {
    title: "Joy's Birthday Island",
    subtitle: '33 treasures for 33 years, hidden across one island.',
    letter: [
      'Happy birthday, Joy. This island is yours.',
      'Clouds hide most of it. Walk the road, open each chest, and every treasure inside holds the clue for the next one. There are 33 in all, one for every year.',
      'I built this little world for you, one chest at a time, thinking of all the years that made you the person I love. Take your time, smile at the silly bits, and know that every road here leads back to me.',
      'I love you, today and every day after. Yours, Tanmoy',
    ],
    // The clue for the very first chest.
    firstClue: {
      text: 'Start where the palm trees lean and the waves come to say hello. Sand between your toes, sun on your face. Where are you? One word.',
      image: null,
    },
  },

  zones: [
    // ── 1 ─────────────────────────────
    {
      name: "Palm Cove",
      landmark: 'palms',
      habitat: 'garden', // garden, pond, pasture, farm, bees, mud, beach, birds or fireflies
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. What is it?',
        answers: ["beach"],
        hints: ['Read your clue again.', 'It starts with "B".'],
      },
      treasure: {
        title: '[Memory #1 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #1, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Old Windmill] (While testing: the code is 2274)",
          image: null,
        },
      },
    },
    // ── 2 ─────────────────────────────
    {
      name: "Old Windmill",
      landmark: 'windmill',
      habitat: 'farm',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the chest shut.',
        answer: '2274',
        hints: ['Think of a date: day then month.', 'It starts with 22.'],
      },
      treasure: {
        title: '[Memory #2 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #2, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Lighthouse Point] (While testing: pick Option D)",
          image: null,
        },
      },
    },
    // ── 3 ─────────────────────────────
    {
      name: "Lighthouse Point",
      landmark: 'lighthouse',
      habitat: 'beach',
      puzzle: {
        type: 'choice',
        prompt: 'Which one is it?',
        options: [
          { label: 'Option A', image: null },
          { label: 'Option B', image: null },
          { label: 'Option C', image: null },
          { label: 'Option D', image: null },
        ],
        answer: 3, // index into options, starting at 0
        hints: ['Trust your first instinct.', 'It is option D.'],
      },
      treasure: {
        title: '[Memory #3 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #3, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Crystal Lake] (While testing: the word is JOYFUL)",
          image: null,
        },
      },
    },
    // ── 4 ─────────────────────────────
    {
      name: "Crystal Lake",
      landmark: 'lake',
      habitat: 'pond',
      puzzle: {
        type: 'scramble',
        prompt: 'Unscramble the letters.',
        answer: 'JOYFUL',
        hints: ['Say the letters out loud.', 'It starts with JOY.'],
      },
      treasure: {
        title: '[Memory #4 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #4, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Whisper Falls] (While testing: rebuild the picture, sun top-left)",
          image: null,
        },
      },
    },
    // ── 5 ─────────────────────────────
    {
      name: "Whisper Falls",
      landmark: 'falls',
      habitat: 'birds',
      puzzle: {
        type: 'swap',
        prompt: 'Tap two tiles to swap them until the picture is whole.',
        image: null, // a square photo works best
        grid: 3,
        hints: ['Start with the corners.', 'The sun sits in the top-left corner.'],
      },
      treasure: {
        title: '[Memory #5 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #5, in two or three sentences.]',
        rune: "A", // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Honey Cottage] (While testing: the answer is: coffee)",
          image: null,
        },
      },
    },
    // ── 6 ─────────────────────────────
    {
      name: "Honey Cottage",
      landmark: 'cottage',
      habitat: 'bees',
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. What is it?',
        answers: ["coffee"],
        hints: ['Read your clue again.', 'It starts with "C".'],
      },
      treasure: {
        title: '[Memory #6 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #6, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Balloon Meadow] (While testing: the code is 2959)",
          image: null,
        },
      },
    },
    // ── 7 ─────────────────────────────
    {
      name: "Balloon Meadow",
      landmark: 'balloon',
      habitat: 'pasture',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the chest shut.',
        answer: '2959',
        hints: ['Think of a date: day then month.', 'It starts with 29.'],
      },
      treasure: {
        title: '[Memory #7 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #7, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Moonlight Bench] (While testing: pick Option A)",
          image: null,
        },
      },
    },
    // ── 8 ─────────────────────────────
    {
      name: "Moonlight Bench",
      landmark: 'bench',
      habitat: 'fireflies',
      puzzle: {
        type: 'choice',
        prompt: 'Which one is it?',
        options: [
          { label: 'Option A', image: null },
          { label: 'Option B', image: null },
          { label: 'Option C', image: null },
          { label: 'Option D', image: null },
        ],
        answer: 0, // index into options, starting at 0
        hints: ['Trust your first instinct.', 'It is option A.'],
      },
      treasure: {
        title: '[Memory #8 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #8, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Cake Hill] (While testing: the word is PANCAKES)",
          image: null,
        },
      },
    },
    // ── 9 ─────────────────────────────
    {
      name: "Cake Hill",
      landmark: 'cake',
      habitat: 'bees',
      puzzle: {
        type: 'scramble',
        prompt: 'Unscramble the letters.',
        answer: 'PANCAKES',
        hints: ['Say the letters out loud.', 'It starts with PAN.'],
      },
      treasure: {
        title: '[Memory #9 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #9, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Sunset Beach] (While testing: rebuild the picture, sun top-left)",
          image: null,
        },
      },
    },
    // ── 10 ─────────────────────────────
    {
      name: "Sunset Beach",
      landmark: 'palms',
      habitat: 'beach',
      puzzle: {
        type: 'swap',
        prompt: 'Tap two tiles to swap them until the picture is whole.',
        image: null, // a square photo works best
        grid: 3,
        hints: ['Start with the corners.', 'The sun sits in the top-left corner.'],
      },
      treasure: {
        title: '[Memory #10 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #10, in two or three sentences.]',
        rune: "L", // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Sugar Mill] (While testing: the answer is: rain)",
          image: null,
        },
      },
    },
    // ── 11 ─────────────────────────────
    {
      name: "Sugar Mill",
      landmark: 'windmill',
      habitat: 'farm',
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. What is it?',
        answers: ["rain"],
        hints: ['Read your clue again.', 'It starts with "R".'],
      },
      treasure: {
        title: '[Memory #11 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #11, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Starlight Tower] (While testing: the code is 3644)",
          image: null,
        },
      },
    },
    // ── 12 ─────────────────────────────
    {
      name: "Starlight Tower",
      landmark: 'lighthouse',
      habitat: 'fireflies',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the chest shut.',
        answer: '3644',
        hints: ['Think of a date: day then month.', 'It starts with 36.'],
      },
      treasure: {
        title: '[Memory #12 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #12, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Bubble Pond] (While testing: pick Option B)",
          image: null,
        },
      },
    },
    // ── 13 ─────────────────────────────
    {
      name: "Bubble Pond",
      landmark: 'lake',
      habitat: 'pond',
      puzzle: {
        type: 'choice',
        prompt: 'Which one is it?',
        options: [
          { label: 'Option A', image: null },
          { label: 'Option B', image: null },
          { label: 'Option C', image: null },
          { label: 'Option D', image: null },
        ],
        answer: 1, // index into options, starting at 0
        hints: ['Trust your first instinct.', 'It is option B.'],
      },
      treasure: {
        title: '[Memory #13 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #13, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Snowcap Peak] (While testing: the word is SUNSHINE)",
          image: null,
        },
      },
    },
    // ── 14 ─────────────────────────────
    {
      name: "Snowcap Peak",
      landmark: 'falls',
      habitat: 'birds',
      puzzle: {
        type: 'scramble',
        prompt: 'Unscramble the letters.',
        answer: 'SUNSHINE',
        hints: ['Say the letters out loud.', 'It starts with SUN.'],
      },
      treasure: {
        title: '[Memory #14 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #14, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Cocoa Cabin] (While testing: rebuild the picture, sun top-left)",
          image: null,
        },
      },
    },
    // ── 15 ─────────────────────────────
    {
      name: "Cocoa Cabin",
      landmark: 'cottage',
      habitat: 'garden',
      puzzle: {
        type: 'swap',
        prompt: 'Tap two tiles to swap them until the picture is whole.',
        image: null, // a square photo works best
        grid: 3,
        hints: ['Start with the corners.', 'The sun sits in the top-left corner.'],
      },
      treasure: {
        title: '[Memory #15 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #15, in two or three sentences.]',
        rune: "W", // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Kite Ridge] (While testing: the answer is: paris)",
          image: null,
        },
      },
    },
    // ── 16 ─────────────────────────────
    {
      name: "Kite Ridge",
      landmark: 'balloon',
      habitat: 'pasture',
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. What is it?',
        answers: ["paris"],
        hints: ['Read your clue again.', 'It starts with "P".'],
      },
      treasure: {
        title: '[Memory #16 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #16, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Firefly Park] (While testing: the code is 4329)",
          image: null,
        },
      },
    },
    // ── 17 ─────────────────────────────
    {
      name: "Firefly Park",
      landmark: 'bench',
      habitat: 'fireflies',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the chest shut.',
        answer: '4329',
        hints: ['Think of a date: day then month.', 'It starts with 43.'],
      },
      treasure: {
        title: '[Memory #17 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #17, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Cupcake Corner] (While testing: pick Option C)",
          image: null,
        },
      },
    },
    // ── 18 ─────────────────────────────
    {
      name: "Cupcake Corner",
      landmark: 'cake',
      habitat: 'bees',
      puzzle: {
        type: 'choice',
        prompt: 'Which one is it?',
        options: [
          { label: 'Option A', image: null },
          { label: 'Option B', image: null },
          { label: 'Option C', image: null },
          { label: 'Option D', image: null },
        ],
        answer: 2, // index into options, starting at 0
        hints: ['Trust your first instinct.', 'It is option C.'],
      },
      treasure: {
        title: '[Memory #18 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #18, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Seashell Bay] (While testing: the word is COFFEE)",
          image: null,
        },
      },
    },
    // ── 19 ─────────────────────────────
    {
      name: "Seashell Bay",
      landmark: 'palms',
      habitat: 'beach',
      puzzle: {
        type: 'scramble',
        prompt: 'Unscramble the letters.',
        answer: 'COFFEE',
        hints: ['Say the letters out loud.', 'It starts with COF.'],
      },
      treasure: {
        title: '[Memory #19 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #19, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Breezy Mill] (While testing: rebuild the picture, sun top-left)",
          image: null,
        },
      },
    },
    // ── 20 ─────────────────────────────
    {
      name: "Breezy Mill",
      landmark: 'windmill',
      habitat: 'farm',
      puzzle: {
        type: 'swap',
        prompt: 'Tap two tiles to swap them until the picture is whole.',
        image: null, // a square photo works best
        grid: 3,
        hints: ['Start with the corners.', 'The sun sits in the top-left corner.'],
      },
      treasure: {
        title: '[Memory #20 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #20, in two or three sentences.]',
        rune: "A", // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Lantern Rock] (While testing: the answer is: sunset)",
          image: null,
        },
      },
    },
    // ── 21 ─────────────────────────────
    {
      name: "Lantern Rock",
      landmark: 'lighthouse',
      habitat: 'mud',
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. What is it?',
        answers: ["sunset"],
        hints: ['Read your clue again.', 'It starts with "S".'],
      },
      treasure: {
        title: '[Memory #21 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #21, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Swan Lake] (While testing: the code is 5014)",
          image: null,
        },
      },
    },
    // ── 22 ─────────────────────────────
    {
      name: "Swan Lake",
      landmark: 'lake',
      habitat: 'pond',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the chest shut.',
        answer: '5014',
        hints: ['Think of a date: day then month.', 'It starts with 50.'],
      },
      treasure: {
        title: '[Memory #22 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #22, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Rainbow Falls] (While testing: pick Option D)",
          image: null,
        },
      },
    },
    // ── 23 ─────────────────────────────
    {
      name: "Rainbow Falls",
      landmark: 'falls',
      habitat: 'mud',
      puzzle: {
        type: 'choice',
        prompt: 'Which one is it?',
        options: [
          { label: 'Option A', image: null },
          { label: 'Option B', image: null },
          { label: 'Option C', image: null },
          { label: 'Option D', image: null },
        ],
        answer: 3, // index into options, starting at 0
        hints: ['Trust your first instinct.', 'It is option D.'],
      },
      treasure: {
        title: '[Memory #23 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #23, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Cozy Cottage] (While testing: the word is KITTEN)",
          image: null,
        },
      },
    },
    // ── 24 ─────────────────────────────
    {
      name: "Cozy Cottage",
      landmark: 'cottage',
      habitat: 'garden',
      puzzle: {
        type: 'scramble',
        prompt: 'Unscramble the letters.',
        answer: 'KITTEN',
        hints: ['Say the letters out loud.', 'It starts with KIT.'],
      },
      treasure: {
        title: '[Memory #24 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #24, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Sky Field] (While testing: rebuild the picture, sun top-left)",
          image: null,
        },
      },
    },
    // ── 25 ─────────────────────────────
    {
      name: "Sky Field",
      landmark: 'balloon',
      habitat: 'pasture',
      puzzle: {
        type: 'swap',
        prompt: 'Tap two tiles to swap them until the picture is whole.',
        image: null, // a square photo works best
        grid: 3,
        hints: ['Start with the corners.', 'The sun sits in the top-left corner.'],
      },
      treasure: {
        title: '[Memory #25 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #25, in two or three sentences.]',
        rune: "Y", // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Sunset Bench] (While testing: the answer is: mango)",
          image: null,
        },
      },
    },
    // ── 26 ─────────────────────────────
    {
      name: "Sunset Bench",
      landmark: 'bench',
      habitat: 'garden',
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. What is it?',
        answers: ["mango"],
        hints: ['Read your clue again.', 'It starts with "M".'],
      },
      treasure: {
        title: '[Memory #26 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #26, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Sweet Spot] (While testing: the code is 5699)",
          image: null,
        },
      },
    },
    // ── 27 ─────────────────────────────
    {
      name: "Sweet Spot",
      landmark: 'cake',
      habitat: 'birds',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the chest shut.',
        answer: '5699',
        hints: ['Think of a date: day then month.', 'It starts with 56.'],
      },
      treasure: {
        title: '[Memory #27 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #27, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Coconut Corner] (While testing: pick Option A)",
          image: null,
        },
      },
    },
    // ── 28 ─────────────────────────────
    {
      name: "Coconut Corner",
      landmark: 'palms',
      habitat: 'beach',
      puzzle: {
        type: 'choice',
        prompt: 'Which one is it?',
        options: [
          { label: 'Option A', image: null },
          { label: 'Option B', image: null },
          { label: 'Option C', image: null },
          { label: 'Option D', image: null },
        ],
        answer: 0, // index into options, starting at 0
        hints: ['Trust your first instinct.', 'It is option A.'],
      },
      treasure: {
        title: '[Memory #28 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #28, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Flour Mill Farm] (While testing: the word is RAINBOW)",
          image: null,
        },
      },
    },
    // ── 29 ─────────────────────────────
    {
      name: "Flour Mill Farm",
      landmark: 'windmill',
      habitat: 'farm',
      puzzle: {
        type: 'scramble',
        prompt: 'Unscramble the letters.',
        answer: 'RAINBOW',
        hints: ['Say the letters out loud.', 'It starts with RAI.'],
      },
      treasure: {
        title: '[Memory #29 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #29, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Beacon Hill] (While testing: rebuild the picture, sun top-left)",
          image: null,
        },
      },
    },
    // ── 30 ─────────────────────────────
    {
      name: "Beacon Hill",
      landmark: 'lighthouse',
      habitat: 'pasture',
      puzzle: {
        type: 'swap',
        prompt: 'Tap two tiles to swap them until the picture is whole.',
        image: null, // a square photo works best
        grid: 3,
        hints: ['Start with the corners.', 'The sun sits in the top-left corner.'],
      },
      treasure: {
        title: '[Memory #30 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #30, in two or three sentences.]',
        rune: "S", // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Wishing Pond] (While testing: the answer is: music)",
          image: null,
        },
      },
    },
    // ── 31 ─────────────────────────────
    {
      name: "Wishing Pond",
      landmark: 'lake',
      habitat: 'mud',
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. What is it?',
        answers: ["music"],
        hints: ['Read your clue again.', 'It starts with "M".'],
      },
      treasure: {
        title: '[Memory #31 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #31, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "[Placeholder clue for Misty Mountain] (While testing: the code is 6384)",
          image: null,
        },
      },
    },
    // ── 32 ─────────────────────────────
    {
      name: "Misty Mountain",
      landmark: 'falls',
      habitat: 'pond',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the chest shut.',
        answer: '6384',
        hints: ['Think of a date: day then month.', 'It starts with 63.'],
      },
      treasure: {
        title: '[Memory #32 title]',
        image: null,
        memory: '[Placeholder: the story behind memory #32, in two or three sentences.]',
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "You have every rune now. Follow the road to Heart Castle and arrange them at the gate.",
          image: null,
        },
      },
    },
  ],

  // Treasure 33. She arranges the runes from the chests into this word.
  castle: {
    name: 'Heart Castle',
    puzzle: {
      type: 'runes',
      prompt: 'The gate has a slot for every rune you found. Put them in the right order.',
      answer: 'ALWAYS',
      hints: ['How long you will be loved.', 'A, L, W, A, Y, S.'],
    },
  },

  finale: {
    levelUpText: 'Level 33 unlocked',
    letterTitle: 'Happy 33rd birthday',
    letter: [
      '[Placeholder: your letter to Joy. Write as many paragraphs as you like.]',
      '[Each item in this list becomes its own paragraph.]',
      '[End with something only the two of you would understand.]',
    ],
    signature: 'Tanmoy',
  },
};
