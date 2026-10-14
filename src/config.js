// ─────────────────────────────────────────────────────────────
//  EVERYTHING PERSONAL LIVES IN THIS FILE.
//
//  33 treasures: 32 chests along the road + Heart Castle at the end.
//  Each chest: a puzzle to open it, then a treasure (photo + memory)
//  that holds the clue for the next chest.
//
//  Photos: they live encrypted in public/photos and are referenced as
//  'photos/c01.jpg'. To change them, put the .jpg files in photos-src/
//  (kept out of git) and run: PHOTO_PASS='the passphrase' npm run photos
//
//  `landmark` picks the drawing next to the chest. Options:
//  palms, windmill, lighthouse, lake, falls, cottage, balloon, bench, cake, merlion
//
//  `habitat` picks the animals around it: garden, pond, pasture, farm, bees,
//  mud, beach, birds, fireflies, owl, bat, dragon, dino, pigeon, parrot,
//  tiger, lion, dog, cat. Owl and bat areas turn the map to night.
//
//  Answers are compared loosely: case, spaces and punctuation are ignored.
// ─────────────────────────────────────────────────────────────

export default {
  herName: 'Joy',
  fromName: 'Tan',
  daughterName: 'Innu',

  // The passphrase for the first screen is not stored here: it is the key
  // the photos are encrypted with (npm run photos, see scripts/encrypt-photos.mjs).

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
      'I love you, today and every day after. Yours, Tan',
    ],
    // The clue for the very first chest.
    firstClue: {
      text: "Every story starts somewhere, and yours starts on someone's lap: a tiny girl in a flowery sun hat, holding her sunglasses like a film star. Who is sitting right beside her? Head to Wood Apple Cove and tell the chest.",
      image: null,
    },
  },

  zones: [
    // ── 1 ─────────────────────────────
    {
      name: "Wood Apple Cove",
      landmark: 'palms',
      habitat: 'garden',
      puzzle: {
        type: 'text',
        prompt: "Who sat beside little you in your very first photo? One word, the way you call him.",
        answers: ["baba", "papa", "dad", "daddy", "father", "bapi", "babai"],
        hints: ["The man with the moustache, looking proud.", "What do you call your father? It starts with B."],
      },
      treasure: {
        title: "Where it all began",
        image: 'photos/c01.jpg',
        memory: "Tiny you in a flowery sun hat, sunglasses already in hand like a film star, and Baba right beside you trying very hard to look serious for the camera. Nobody could sit next to that face and stay serious for long.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Next stop: the Old Windmill. Remember when phones had buttons and every message took real effort? Spell the word TEXT the old way, one number per letter.",
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
        prompt: "Spell TEXT on an old phone keypad: one digit for each letter.",
        answer: "8398",
        hints: ["ABC is on 2, DEF is on 3, and so on up to WXYZ on 9.", "T is on 8 and E is on 3."],
      },
      treasure: {
        title: "Texting in sepia",
        image: 'photos/c02.jpg',
        memory: "The age of the sepia filter and the very serious phone face. Somewhere in that message there was a long paragraph, three emojis and a 'wait, calling you'. Some things never change.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Head to Lighthouse Point. Think of a night market, bright lights and a smile that could power the whole street. What was that pink cloud in your hand?",
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
        prompt: "What was the pink cloud in your hand at the night market?",
        options: [
          { label: "A balloon" },
          { label: "Candy floss" },
          { label: "Ice cream" },
          { label: "A bunch of flowers" },
        ],
        answer: 1, // index into options, starting at 0
        hints: ["It melts the second it touches your tongue.", "It is spun from sugar."],
      },
      treasure: {
        title: "Sugar rush",
        image: 'photos/c03.jpg',
        memory: "A night market, a fistful of sweets and the happiest grin on the street. Proof that you have always known what matters in life: sugar first, questions later.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Over to Crystal Lake. Your sign that day had the best science lesson ever: Fe is iron, male is man... so what are you? Unscramble it.",
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
        prompt: "Fe is iron, male is man, so a female is... Unscramble the letters.",
        answer: "IRONMAN",
        hints: ["Female = Fe + male.", "Tony Stark would agree."],
      },
      treasure: {
        title: "Science, but make it sassy",
        image: 'photos/c04.jpg',
        memory: "\"I am a female. Fe is iron, male is man, therefore I am Iron Man.\" Still the most accurate thing anyone has ever written on a piece of paper. You were a superhero long before you had a sidekick.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Whisper Falls is next. Someone turned one of your sunniest afternoons into a cartoon and cut it into pieces. Put the sky back together.",
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
        prompt: "Tap two tiles to swap them until the picture is whole.",
        image: "photos/c05-toon.jpg", // a cartoon of this chest's photo
        grid: 3,
        hints: ["Start with the blue sky in the corners.", "Your face is in the middle, looking up at the flowers."],
      },
      treasure: {
        title: "Looking up",
        image: 'photos/c05.jpg',
        memory: "Chin up, flowers in hand, blue sky everywhere. That is how you go through life: always looking for the bright bit, even on a cloudy day.",
        rune: "A", // a letter for the castle gate, or null
        clue: {
          text: "Off to Honey Cottage. A selfie, a hand pose straight out of a music video, and nails painted just for the occasion. What colour were they? One word.",
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
        prompt: "What colour were your nails in that selfie? One word.",
        answers: ["pink"],
        hints: ["Same colour as your lipstick that day.", "It rhymes with wink."],
      },
      treasure: {
        title: "The hand pose era",
        image: 'photos/c06.jpg',
        memory: "Every girl had a signature selfie pose, and this was yours: tilted head, fingers fanned out, pink nails and pink lips to match. Iconic. I would like it framed, please.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Balloon Meadow next. First job, first ID card, first office mirror selfie. Every office swears by the same hours. From what to what?",
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
        prompt: "Classic office hours: from ? to ?",
        answer: "95",
        hints: ["Dolly Parton sang about it.", "Nine, then five."],
      },
      treasure: {
        title: "First job, first ID card",
        image: 'photos/c07.jpg',
        memory: "Office lanyard, new handbag, and the confidence of someone who just got her first salary. The mirror selfie was compulsory, obviously. Look at her, about to conquer the world one meeting at a time.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Find the Moonlight Bench, where the owls keep watch. You were swinging off a gate in your favourite shirt that day. What pattern was on it?",
          image: null,
        },
      },
    },
    // ── 8 ─────────────────────────────
    {
      name: "Moonlight Bench",
      landmark: 'bench',
      habitat: 'owl',
      puzzle: {
        type: 'choice',
        prompt: "What pattern was on your shirt the day you swung off the gate?",
        options: [
          { label: "Polka dots" },
          { label: "Stripes" },
          { label: "Checks" },
          { label: "Flowers" },
        ],
        answer: 2, // index into options, starting at 0
        hints: ["Lots of little squares.", "Think picnic blanket."],
      },
      treasure: {
        title: "Hanging around",
        image: 'photos/c08.jpg',
        memory: "A check shirt, a big smile, and the only person I know who treats every railing like a playground. Grown-up on paper, ten years old at heart.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Climb Cake Hill, where the bats come out after dark. You in a saree, chin on your hand, eyes somewhere far away. What were you doing? Unscramble it.",
          image: null,
        },
      },
    },
    // ── 9 ─────────────────────────────
    {
      name: "Cake Hill",
      landmark: 'cake',
      habitat: 'bat',
      puzzle: {
        type: 'scramble',
        prompt: "Chin on your hand, eyes far away. What were you doing? Unscramble it.",
        answer: "DAYDREAM",
        hints: ["Thinking about anything but the here and now.", "Day + ..."],
      },
      treasure: {
        title: "Somewhere far away",
        image: 'photos/c09.jpg',
        memory: "A soft saree, chin on your hand and a faraway look. I would love to know what you were thinking about. I hope it was cake. It is usually cake.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Down to Sunset Beach. Rocks, waves and a cloudy sky, turned into a cartoon and scrambled. Rebuild the seaside.",
          image: null,
        },
      },
    },
    // ── 10 ─────────────────────────────
    {
      name: "Sunset Beach",
      landmark: 'palms',
      habitat: 'parrot',
      puzzle: {
        type: 'swap',
        prompt: "Tap two tiles to swap them until the picture is whole.",
        image: "photos/c10-toon.jpg", // a cartoon of this chest's photo
        grid: 3,
        hints: ["The sea runs across the middle.", "You are standing on the rocks in the centre."],
      },
      treasure: {
        title: "Rocks and waves",
        image: 'photos/c10.jpg',
        memory: "A grey sky, wild waves, and you on the rocks like you owned the whole coastline. Some people hide from the wind. You pose for it.",
        rune: "L", // a letter for the castle gate, or null
        clue: {
          text: "Sugar Mill next. A café, a pout and a chin on your hand, but something is missing from that photo. What did the filter steal? One word.",
          image: null,
        },
      },
    },
    // ── 11 ─────────────────────────────
    {
      name: "Sugar Mill",
      landmark: 'windmill',
      habitat: 'cat',
      puzzle: {
        type: 'text',
        prompt: "Something is missing from your café photo. What did the filter take away? One word.",
        answers: ["colour", "color", "colours", "colors"],
        hints: ["It is a black and white photo.", "It starts with C."],
      },
      treasure: {
        title: "Black and white mood",
        image: 'photos/c11.jpg',
        memory: "A black and white filter, a dramatic pout, a café table. You look like the poster for an art film nobody understood and everybody loved.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Starlight Tower, where the dogs hang out. You once held a fluffy pup like he was the most precious thing in the world. Count him: paws, then ears, then tail.",
          image: null,
        },
      },
    },
    // ── 12 ─────────────────────────────
    {
      name: "Starlight Tower",
      landmark: 'lighthouse',
      habitat: 'dog',
      puzzle: {
        type: 'code',
        prompt: "Count your fluffy friend: paws, then ears, then tail.",
        answer: "421",
        hints: ["Four paws to start.", "Four, two, one."],
      },
      treasure: {
        title: "Puppy love",
        image: 'photos/c12.jpg',
        memory: "That pup knew exactly whose arms were the safest in the room. So do I. So does Innu. You have that effect on everyone, furry or not.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Bubble Pond is next. Fairy lights behind you, a big smile and a saree the colour of fresh leaves. Which colour was it?",
          image: null,
        },
      },
    },
    // ── 13 ─────────────────────────────
    {
      name: "Bubble Pond",
      landmark: 'lake',
      habitat: 'fireflies',
      puzzle: {
        type: 'choice',
        prompt: "Which colour was your saree under the fairy lights?",
        options: [
          { label: "Red" },
          { label: "Green" },
          { label: "Blue" },
          { label: "Yellow" },
        ],
        answer: 1, // index into options, starting at 0
        hints: ["The colour of fresh leaves.", "Traffic lights say go."],
      },
      treasure: {
        title: "Festive glow",
        image: 'photos/c13.jpg',
        memory: "Fairy lights, a beautiful saree and that knowing smile. Every festival needs a main character, and you never miss your cue.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Up to Snowcap Peak, where the dragon lives. Hair everywhere, laughing so hard your eyes closed. What was messing up your hair? Unscramble it.",
          image: null,
        },
      },
    },
    // ── 14 ─────────────────────────────
    {
      name: "Snowcap Peak",
      landmark: 'falls',
      habitat: 'dragon',
      puzzle: {
        type: 'scramble',
        prompt: "Hair everywhere, eyes closed, laughing. What was messing up your hair? Unscramble it.",
        answer: "BREEZE",
        hints: ["Wind, but gentler.", "It starts with B."],
      },
      treasure: {
        title: "Wind in your hair",
        image: 'photos/c14.jpg',
        memory: "Messy hair, closed eyes, the biggest laugh. Not one strand in place and you have never looked happier. This is my favourite kind of you.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Cocoa Cabin next. A big piece of driftwood by the water and you sitting on it like a throne. It is a cartoon now, in pieces. Fix it.",
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
        prompt: "Tap two tiles to swap them until the picture is whole.",
        image: "photos/c15-toon.jpg", // a cartoon of this chest's photo
        grid: 3,
        hints: ["The water fills the top half.", "The driftwood runs along the bottom."],
      },
      treasure: {
        title: "Driftwood throne",
        image: 'photos/c15.jpg',
        memory: "A grey day, a lake, a fallen tree trunk, and you turned it into a photoshoot. You find the fun in everything, even a log.",
        rune: "W", // a letter for the castle gate, or null
        clue: {
          text: "Climb Kite Ridge, where the lion naps. A white saree with a red border, the one every Bengali girl owns. What do we call it? Two words.",
          image: null,
        },
      },
    },
    // ── 16 ─────────────────────────────
    {
      name: "Kite Ridge",
      landmark: 'balloon',
      habitat: 'lion',
      puzzle: {
        type: 'text',
        prompt: "A white saree with a red border. What do we call it? Two words.",
        answers: ["laal paar", "lal paar", "lal par", "laal par", "laal paad", "lal paad", "red border"],
        hints: ["It is named after its red edge.", "Laal ..."],
      },
      treasure: {
        title: "Laal paar",
        image: 'photos/c16.jpg',
        memory: "A white saree, a red border and a carved wooden door. Some looks never go out of style, and on you, this one never will.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Firefly Park, down by the mud where the frogs sing. You, a café, and something round and hard on the table that kept your head safe on the ride there. What was it?",
          image: null,
        },
      },
    },
    // ── 17 ─────────────────────────────
    {
      name: "Firefly Park",
      landmark: 'bench',
      habitat: 'mud',
      puzzle: {
        type: 'text',
        prompt: "What was on the café table that kept your head safe on the ride? One word.",
        answers: ["helmet", "a helmet", "bike helmet"],
        hints: ["You wear it on a bike.", "It starts with H."],
      },
      treasure: {
        title: "Ride, then coffee",
        image: 'photos/c17.jpg',
        memory: "A helmet on the table, coffee on the way, and the 'do not talk to me yet' face. Every ride needs a café stop, and every café needs you in it.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Cupcake Corner is next, where the bees buzz. A red saree, a balcony, an orange sky. What time of day was it?",
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
        prompt: "Red saree, balcony, orange sky. What time of day was it?",
        options: [
          { label: "Sunrise" },
          { label: "Midday" },
          { label: "Sunset" },
          { label: "Midnight" },
        ],
        answer: 2, // index into options, starting at 0
        hints: ["The sun is going down.", "Golden hour, at the end of the day."],
      },
      treasure: {
        title: "Golden hour",
        image: 'photos/c18.jpg',
        memory: "A red saree, a balcony and the sky putting on a show just for you. The sun was setting, but it was competing with you, and it lost.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Seashell Bay, where the fireflies glow. Little flames in a circle, marigolds in the middle, and you smiling over them. Which festival was it? Unscramble it.",
          image: null,
        },
      },
    },
    // ── 19 ─────────────────────────────
    {
      name: "Seashell Bay",
      landmark: 'palms',
      habitat: 'fireflies',
      puzzle: {
        type: 'scramble',
        prompt: "Little flames in a circle and marigolds in the middle. Which festival? Unscramble it.",
        answer: "DIWALI",
        hints: ["The festival of lights.", "D, I, W..."],
      },
      treasure: {
        title: "Festival of lights",
        image: 'photos/c19.jpg',
        memory: "Diyas lit, marigolds floating, and you glowing brighter than all of them. Our home always feels most like home when you are lighting it up.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Breezy Mill is next, where the pigeons gossip. A swing over the sea, splashes everywhere, a red zigzag dress. It is a cartoon now. Put it back together.",
          image: null,
        },
      },
    },
    // ── 20 ─────────────────────────────
    {
      name: "Breezy Mill",
      landmark: 'windmill',
      habitat: 'pigeon',
      puzzle: {
        type: 'swap',
        prompt: "Tap two tiles to swap them until the picture is whole.",
        image: "photos/c20-toon.jpg", // a cartoon of this chest's photo
        grid: 3,
        hints: ["The swing ropes run from top to bottom.", "Sea and sky fill the top."],
      },
      treasure: {
        title: "Swinging over the sea",
        image: 'photos/c20.jpg',
        memory: "A swing over the ocean, water splashing up, sunglasses on, full main-character energy. Some people take holidays. You become the holiday.",
        rune: "A", // a letter for the castle gate, or null
        clue: {
          text: "Lantern Rock, where the tiger prowls. It looked like snow, but it was warm under your feet. What were you standing on? One word.",
          image: null,
        },
      },
    },
    // ── 21 ─────────────────────────────
    {
      name: "Lantern Rock",
      landmark: 'lighthouse',
      habitat: 'tiger',
      puzzle: {
        type: 'text',
        prompt: "It looked like snow but was warm under your feet. What was it? One word.",
        answers: ["sand", "sand dunes", "dunes", "dune", "desert"],
        hints: ["You would find it on a beach.", "It starts with S."],
      },
      treasure: {
        title: "Not snow",
        image: 'photos/c21.jpg',
        memory: "White hills that looked like snow, a blue lake in the distance, and you on top like you had found a new planet. Explorer Joy, reporting for duty.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Swan Lake is next. Two silver towers, a sky bridge between them, and you smiling at their feet. How many floors does each tower have?",
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
        prompt: "How many floors does each Petronas Tower have?",
        answer: "88",
        hints: ["A lucky number, written twice.", "Eight and eight."],
      },
      treasure: {
        title: "Twin towers",
        image: 'photos/c22.jpg',
        memory: "Kuala Lumpur, the Petronas Towers, and you looking tiny and fabulous in front of them. Big city, bigger smile.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Rainbow Falls, where the dinosaur stomps. A sunny yellow kurti covered in delicate white flowers stitched by hand. What is that embroidery called?",
          image: null,
        },
      },
    },
    // ── 23 ─────────────────────────────
    {
      name: "Rainbow Falls",
      landmark: 'falls',
      habitat: 'dino',
      puzzle: {
        type: 'choice',
        prompt: "The white flowers stitched on your yellow kurti are called...",
        options: [
          { label: "Phulkari" },
          { label: "Chikankari" },
          { label: "Kantha" },
          { label: "Zardozi" },
        ],
        answer: 1, // index into options, starting at 0
        hints: ["It comes from Lucknow.", "Chikan..."],
      },
      treasure: {
        title: "Sunshine in a kurti",
        image: 'photos/c23.jpg',
        memory: "A yellow kurti, white chikankari, a little bindi and that calm, knowing look. You make 'I just threw this on' look like a magazine cover.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Cozy Cottage, where the cats nap. Head in your hands at a Korean restaurant, staring at an empty table. The food was late and you were... Unscramble it.",
          image: null,
        },
      },
    },
    // ── 24 ─────────────────────────────
    {
      name: "Cozy Cottage",
      landmark: 'cottage',
      habitat: 'cat',
      puzzle: {
        type: 'scramble',
        prompt: "The food was late and you were... Unscramble it.",
        answer: "HANGRY",
        hints: ["Hungry plus angry.", "H, A, N..."],
      },
      treasure: {
        title: "Where is the food?",
        image: 'photos/c24.jpg',
        memory: "The face of a woman who ordered twenty minutes ago. A gentle reminder to everyone: feed her first, talk later. Everyone's safety depends on it.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Sky Field is next. Brace yourself: it is that face. The scrunchiest, silliest face you have ever pulled, now a cartoon in pieces. Put it back.",
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
        prompt: "Tap two tiles to swap them until the picture is whole.",
        image: "photos/c25-toon.jpg", // a cartoon of this chest's photo
        grid: 3,
        hints: ["Start with the eyes, squeezed shut.", "The grin goes in the middle."],
      },
      treasure: {
        title: "That face",
        image: 'photos/c25.jpg',
        memory: "I married a woman who can pull this face on purpose. No filter, no warning, pure chaos. I love it more than any posed photo.",
        rune: "Y", // a letter for the castle gate, or null
        clue: {
          text: "Find the Sunset Bench, where the dogs play. You, laughing in the sunshine, legs crossed, in a little city garden. What were you sitting on? One word.",
          image: null,
        },
      },
    },
    // ── 26 ─────────────────────────────
    {
      name: "Sunset Bench",
      landmark: 'bench',
      habitat: 'dog',
      puzzle: {
        type: 'text',
        prompt: "Laughing in the sunshine in a little city garden. What were you sitting on? One word.",
        answers: ["bench", "a bench", "park bench", "garden bench"],
        hints: ["Look at the landmark next to this chest.", "It is wooden and has a backrest."],
      },
      treasure: {
        title: "Sunshine break",
        image: 'photos/c26.jpg',
        memory: "A little garden in the middle of the city, a wooden bench and the happiest laugh. Ten minutes of sun, all for you. More of these, please.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Now to the Sweet Spot. Red and gold, sindoor and a shola crown: the day you said yes to forever, and to me. What do we call that day? One word.",
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
        type: 'text',
        prompt: "Red and gold, sindoor and a shola crown. What do we call that day? One word.",
        answers: ["wedding", "biye", "bie", "biyer din", "shaadi", "shadi", "marriage", "wedding day"],
        hints: ["Red saree, lots of gold, lots of relatives.", "Biye! In English: W..."],
      },
      treasure: {
        title: "Our wedding",
        image: 'photos/c27.jpg',
        memory: "The day you became my wife. Red and gold, the mukut and the mehendi, and a smile that outshone every light in the room. From here on, we walk together. You have been stuck with me ever since.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Merlion Point is next. A city with a lion's head and a fish's tail, and a ship sitting on top of three towers. Where did we make our new home?",
          image: null,
        },
      },
    },
    // ── 28 ─────────────────────────────
    {
      name: "Merlion Point",
      landmark: 'merlion',
      habitat: 'beach',
      puzzle: {
        type: 'choice',
        prompt: "A lion's head, a fish's tail and a ship on three towers. Where did we make our new home?",
        options: [
          { label: "Kuala Lumpur" },
          { label: "Singapore" },
          { label: "Dubai" },
          { label: "Bangkok" },
        ],
        answer: 1, // index into options, starting at 0
        hints: ["The Lion City.", "Look at the statue spouting water."],
      },
      treasure: {
        title: "Hello, Singapore",
        image: 'photos/c28.jpg',
        memory: "A new country, a new home, Marina Bay Sands behind you and a whole new life ahead. You packed up everything, smiled, and made it ours.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Flour Mill Farm, where Old MacDonald lives. The two of us on a swinging bed, and behind us a mountain with fire inside. What was it? Unscramble it.",
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
        prompt: "The two of us on a giant swing, and behind us a mountain with fire inside. Unscramble it.",
        answer: "VOLCANO",
        hints: ["A mountain that breathes fire.", "V, O, L..."],
      },
      treasure: {
        title: "On top of the world",
        image: 'photos/c29.jpg',
        memory: "A giant swing, a volcano behind us, and you leaning into me like we had all the time in the world. Best seat in the house.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Climb Beacon Hill, where the parrots chatter. You in white, a hand on your belly, me beside you grinning like an idiot. It is a cartoon now. Put us back together.",
          image: null,
        },
      },
    },
    // ── 30 ─────────────────────────────
    {
      name: "Beacon Hill",
      landmark: 'lighthouse',
      habitat: 'parrot',
      puzzle: {
        type: 'swap',
        prompt: "Tap two tiles to swap them until the picture is whole.",
        image: "photos/c30-toon.jpg", // a cartoon of this chest's photo
        grid: 3,
        hints: ["Our two faces are at the top, looking at each other.", "Your hands rest in the middle."],
      },
      treasure: {
        title: "Waiting for her",
        image: 'photos/c30.jpg',
        memory: "You in white, glowing, our little secret growing under your hands. I have never been so proud, or so nervous, or so in love.",
        rune: "S", // a letter for the castle gate, or null
        clue: {
          text: "Wishing Pond is next. Sand, sea, white clothes, and a tiny someone in my arms with your eyes. Who is she? One word.",
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
        prompt: "Sand, sea, and a tiny someone in my arms with your eyes. Who is she? One word.",
        answers: ["innu", "inaaya", "inaya"],
        hints: ["Our daughter.", "I... nnu!"],
      },
      treasure: {
        title: "Then there were three",
        image: 'photos/c31.jpg',
        memory: "The beach, the three of us in white, and Innu in my arms looking for you, as always. Our whole world in one photo.",
        rune: null, // a letter for the castle gate, or null
        clue: {
          text: "Last chest: Misty Mountain. In a pink room full of mirrors, count the people in our selfie, then the phones held up to the glass. Put the two numbers side by side.",
          image: null,
        },
      },
    },
    // ── 32 ─────────────────────────────
    {
      name: "Misty Mountain",
      landmark: 'falls',
      habitat: 'pigeon',
      puzzle: {
        type: 'code',
        prompt: "In the mirror selfie: count the people, then the phones. Side by side.",
        answer: "32",
        hints: ["Three of us.", "Three, then two. Look at this chest's number."],
      },
      treasure: {
        title: "Us, right now",
        image: 'photos/c32.jpg',
        memory: "A room full of pink mirrors, two phones, three of us, and Innu stealing the show. This is what home looks like right now, and I would not trade it for anything.",
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
      'You made it to the castle. Thirty-three chests, one very determined birthday girl, and probably at least one moment where you told a puzzle "Wife is always right." (You were. You always are. I have learned this the hard way, and my ego still has the dent to prove it.)',
      "Here is the thing I don't say often enough: my life got so much better the day you walked into it. You turn ordinary days into little holidays. You laugh at my jokes, even the ones that really don't deserve it, and somehow you make a home out of every place we land.",
      "Did you notice the girl on this island? She started out crawling and grew a little with every chest. I only walked into the story partway through, around chest 27, and I'm still a tiny bit jealous of everyone who got to see the chapters before me. But I'm so grateful I got to take your hand and follow you around ever since. Honestly, following you around is still my favourite hobby. You lead, I carry the snacks.",
      'And then you became a mom, and I got to watch you become even more you. Innu is almost two now, and every bit of her sunshine is you: the giggles, the stubborn little frown, the way she runs to you first. You are not just a good mom, you are an extraordinary one. She is so lucky. So am I.',
      'I see what it costs you. The sleep you gave up. The plans you quietly put down. The hot coffees that became cold coffees, then forgotten coffees. The days you held everything together while I was still working out where the wipes are kept. I see every one of those sacrifices, even on the days I forget to say it, and I wish I could carry more of it for you. I promise to keep trying to be more useful than a slightly confused assistant with a beard.',
      "So here's what I'm promising for the next sixty-six: more dishes done without being asked, fewer \"where is the...?\" questions, dancing in the kitchen even when Innu is the only one clapping, and your hand in mine through all of it, the sleepless nights and the silly mornings alike. And when we're old and grey and arguing over a silly stupid argument, you will still win. Mostly because you'll be right.",
      'So today I salute you: the girl I fell for, the woman I married, the mother of our daughter, and the kindest, bravest person I know. Thank you for choosing me, for building this life with me, and for loving the two of us the way you do.',
      "And one wish, from me and from Innu's half-baked advanced vocab: sometimes, put yourself first. Take the nap. Eat the whole dessert. Go out to do your mani, pedi or hair colour. Take an extra fifteen minutes to explore the two other rows of the stationery shop, the ones you always skip because you're in a hurry to get back home. Read the book, do the thing that is only for you. You give us everything, and you deserve some of it back.",
      'Happy birthday, my love. Level 33 looks beautiful on you.',
    ],
    signature: 'Forever yours, Tan (and Innu)',
    // More of us, shown under the letter.
    album: [
      { image: 'photos/a01.jpg', caption: 'Feet in the sea' },
      { image: 'photos/a02.jpg', caption: 'Sunset, and you' },
      { image: 'photos/a03.jpg', caption: 'Pujo with my favourite person' },
      { image: 'photos/a04.jpg', caption: 'Black sand, blue sky' },
      { image: 'photos/a05.jpg', caption: 'Caught in the act' },
      { image: 'photos/a06.jpg', caption: 'Tokyo, with our little one' },
      { image: 'photos/a07.jpg', caption: 'Best mom ever. Official.' },
      { image: 'photos/a08.jpg', caption: 'Cuddles by the sea' },
      { image: 'photos/a09.jpg', caption: 'Twinning in pink' },
      { image: 'photos/a10.jpg', caption: 'Matching shirts, obviously' },
      { image: 'photos/a11.jpg', caption: 'Our girl turns one' },
    ],
  },

  // One small charm for every chest, kept in Joy's bag.
  charms: [
    { icon: '🐚', name: 'A tiny seashell', note: 'Hold it to your ear. It says happy birthday.' },
    { icon: '🍀', name: 'A four-leaf clover', note: "For luck. Not that you need it, you found me." },
    { icon: '🌟', name: 'A pocket star', note: 'For long nights. Recharges with hugs.' },
    { icon: '🦋', name: 'A butterfly', note: 'It landed on the chest and refused to leave. Relatable.' },
    { icon: '🍓', name: 'A strawberry', note: 'Sweet, like someone I know.' },
    { icon: '🎈', name: 'A little balloon', note: 'Guaranteed never to pop.' },
    { icon: '🧸', name: 'A tiny teddy', note: 'Approved by the toddler review board.' },
    { icon: '💌', name: 'A love note', note: "It only says: you're my favourite." },
    { icon: '🌙', name: 'A crescent moon', note: 'I love you to it and back.' },
    { icon: '🌈', name: 'A rainbow', note: 'After every storm, this. After every tantrum, a nap.' },
    { icon: '🍰', name: 'A slice of cake', note: "Calories don't count on birthdays. It's science." },
    { icon: '☕', name: 'A warm coffee', note: 'Finally, one that stayed hot.' },
    { icon: '🎀', name: 'A pink ribbon', note: 'Tied in a bow, like the best presents.' },
    { icon: '🐞', name: 'A ladybird', note: 'Good luck, with legs.' },
    { icon: '🌻', name: 'A sunflower', note: 'It always turns to face the sun. I always turn to face you.' },
    { icon: '🍩', name: 'A doughnut', note: 'It has a hole in the middle. My love for you does not.' },
    { icon: '🎵', name: 'A music note', note: 'Our song, on repeat.' },
    { icon: '🪁', name: 'A kite', note: 'For the days you want to fly a little.' },
    { icon: '🐣', name: 'A hatchling', note: 'New beginnings, extra fluffy.' },
    { icon: '🔑', name: 'A tiny key', note: "To my heart. You've had a copy for years." },
    { icon: '🦄', name: 'A unicorn', note: 'Rare and magical. Takes one to know one.' },
    { icon: '🕯️', name: 'A candle', note: 'Make a wish. Then make another one.' },
    { icon: '🍭', name: 'A lollipop', note: 'Do not share with the toddler. She will negotiate.' },
    { icon: '🌺', name: 'A hibiscus', note: 'For your hair or for the vase. Your call.' },
    { icon: '⭐', name: 'A gold star', note: 'For being an excellent grown-up. Officially awarded.' },
    { icon: '🧁', name: 'A cupcake', note: 'Smaller than cake, just as deserved.' },
    { icon: '👣', name: 'Two sets of footprints', note: 'From here on, we walk together.' },
    { icon: '🍯', name: 'A pot of honey', note: 'For my honey. Yes, I went there.' },
    { icon: '🐢', name: 'A little turtle', note: 'For slow mornings. You deserve more of them.' },
    { icon: '🧦', name: 'A tiny sock', note: 'Hmm. Who could this be for?' },
    { icon: '🍼', name: "Innu's bottle", note: 'The best adventure we ever started.' },
    { icon: '💖', name: 'A sparkling heart', note: 'The last charm, and the first thing I ever gave you.' },
  ],
};
