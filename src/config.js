// ─────────────────────────────────────────────────────────────
//  EVERYTHING PERSONAL LIVES IN THIS FILE.
//  Swap the [placeholders] for real names, memories, clues and photos.
//
//  Images: drop files into /public/images and reference them as
//  'images/your-file.jpg'. Leave `image: null` to show a placeholder.
//
//  Answers are compared loosely: case, spaces and punctuation are ignored.
// ─────────────────────────────────────────────────────────────

export default {
  herName: '[Her name]',
  fromName: '[Your name]',

  // HUD: she starts at level 32 and levels up to 33 at the very end.
  startLevel: 32,
  endLevel: 33,

  // Gems pay for wizard hints.
  startGems: 33,
  hintCost: 3,

  intro: {
    title: "[Her name]'s Island",
    subtitle: '33 years of treasure, hidden across one island.',
    // Shown as a scroll right after she taps Start.
    letter: [
      'Chief, the island has been waiting for you.',
      'Clouds hide most of it. Every chest you open clears the way to the next one, and every treasure inside holds the clue you will need next.',
      '[Placeholder: a short, warm note from you to kick things off.]',
    ],
    // The clue for the very first puzzle.
    firstClue: {
      text: '[Placeholder clue] Where did it all begin? (While testing, the answer is: beach)',
      image: null,
    },
  },

  // The zones she unlocks, in order. The landmark art and map position are
  // fixed per slot: cove, windmill, lighthouse, lake, falls.
  zones: [
    {
      id: 'cove',
      name: 'Palm Cove',
      puzzle: {
        type: 'text',
        prompt: 'The chest is locked with a word. Where did it all begin?',
        answers: ['beach', 'the beach'],
        hints: [
          'Read your first clue again. It is in the scroll at the bottom.',
          'It has sand and waves.',
        ],
      },
      treasure: {
        title: '[Memory #1 title]',
        image: null,
        memory: '[Placeholder: tell the story of this moment in two or three sentences.]',
        rune: 'S',
        clue: {
          text: '[Placeholder clue] The windmill lock wants a date: the day and month we met. (While testing: 1402)',
          image: null,
        },
      },
    },
    {
      id: 'windmill',
      name: 'Old Windmill',
      puzzle: {
        type: 'code',
        prompt: 'A four-dial lock holds the windmill door shut.',
        answer: '1402',
        hints: ['Day first, then month.', 'It starts with 14.'],
      },
      treasure: {
        title: '[Memory #2 title]',
        image: null,
        memory: '[Placeholder: the story behind this memory.]',
        rune: 'M',
        clue: {
          text: '[Placeholder clue] The lighthouse keeper asks which trip came first. (While testing: Option C)',
          image: null,
        },
      },
    },
    {
      id: 'lighthouse',
      name: 'Lighthouse Point',
      puzzle: {
        type: 'choice',
        prompt: 'The keeper only opens up for the right answer. Which trip came first?',
        options: [
          { label: 'Option A', image: null },
          { label: 'Option B', image: null },
          { label: 'Option C', image: null },
          { label: 'Option D', image: null },
        ],
        answer: 2, // index into options, starting at 0
        hints: ['It was not A.', 'Third time lucky.'],
      },
      treasure: {
        title: '[Memory #3 title]',
        image: null,
        memory: '[Placeholder: the story behind this memory.]',
        rune: 'I',
        clue: {
          text: '[Placeholder clue] A photo at the lake fell to pieces. Put it back together. (While testing: the sun goes top-left)',
          image: null,
        },
      },
    },
    {
      id: 'lake',
      name: 'Crystal Lake',
      puzzle: {
        type: 'swap',
        prompt: 'Tap two tiles to swap them until the picture is whole.',
        image: null, // a square photo works best
        grid: 3,
        hints: ['Start with the corners.', 'The sun sits in the top-left corner and the heart in the middle.'],
      },
      treasure: {
        title: '[Memory #4 title]',
        image: null,
        memory: '[Placeholder: the story behind this memory.]',
        rune: 'L',
        clue: {
          text: '[Placeholder clue] The waterfall spirit scrambled your favourite breakfast. (While testing: PANCAKES)',
          image: null,
        },
      },
    },
    {
      id: 'falls',
      name: 'Whisper Falls',
      puzzle: {
        type: 'scramble',
        prompt: 'Unscramble the word to calm the falls.',
        answer: 'PANCAKES',
        hints: ['Best with syrup.', 'It starts with PAN.'],
      },
      treasure: {
        title: '[Memory #5 title]',
        image: null,
        memory: '[Placeholder: the story behind this memory.]',
        rune: 'E',
        clue: {
          text: 'You hold five runes now. Arrange them at the castle gate.',
          image: null,
        },
      },
    },
  ],

  // The final gate. She arranges the runes from every treasure into this word.
  castle: {
    id: 'castle',
    name: 'Heart Castle',
    puzzle: {
      type: 'runes',
      prompt: 'The gate has a slot for every rune you found. Put them in the right order.',
      answer: 'SMILE',
      hints: ['It is the thing you do best.', 'S, M, I, L, E.'],
    },
  },

  finale: {
    levelUpText: 'Level 33 unlocked',
    letterTitle: 'Happy 33rd birthday',
    letter: [
      '[Placeholder: your letter to her. Write as many paragraphs as you like.]',
      '[Each item in this list becomes its own paragraph.]',
      '[End with something only the two of you would understand.]',
    ],
    signature: '[Your name]',
  },
};
