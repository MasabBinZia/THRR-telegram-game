export const riddles: Riddle[] = [
  {
    question: 'I speak without a mouth and hear without ears. What am I?',
    options: ['Echo', 'Wind', 'Water', 'Shadow'],
    answer: 'Echo',
  },
  {
    question: "What has keys but can't open locks?",
    options: ['Piano', 'Map', 'Lock', 'Door'],
    answer: 'Piano',
  },
  {
    question: 'What has to be broken before you can use it?',
    options: ['Egg', 'Promise', 'Silence', 'Seal'],
    answer: 'Egg',
  },
  {
    question: 'I’m tall when I’m young, and I’m short when I’m old. What am I?',
    options: ['Candle', 'Tree', 'Building', 'Person'],
    answer: 'Candle',
  },
  {
    question: 'What has hands but can’t clap?',
    options: ['Clock', 'Robot', 'Doll', 'Chair'],
    answer: 'Clock',
  },
  {
    question: 'What can travel around the world while staying in a corner?',
    options: ['Stamp', 'Bird', 'Airplane', 'Map'],
    answer: 'Stamp',
  },
  {
    question: 'What begins with T, ends with T, and has T in it?',
    options: ['Teapot', 'Tent', 'Table', 'Toast'],
    answer: 'Teapot',
  },
  {
    question: 'What has a heart that doesn’t beat?',
    options: ['Artichoke', 'Stone', 'Tree', 'Book'],
    answer: 'Artichoke',
  },
  {
    question: 'I have branches, but no fruit, trunk, or leaves. What am I?',
    options: ['Bank', 'Tree', 'Library', 'Map'],
    answer: 'Bank',
  },
  {
    question: 'What can you catch but not throw?',
    options: ['Cold', 'Ball', 'Fish', 'Shadow'],
    answer: 'Cold',
  },
];

export interface Riddle {
  question: string;
  options: string[];
  answer: string;
}
