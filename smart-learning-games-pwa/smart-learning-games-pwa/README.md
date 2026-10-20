# Smart Learning Games

A complete, responsive, mobile-first educational gaming Progressive Web App (PWA) for students from Class 1 to Class 7.

## Features

### Core Features
- **5 Interactive Game Modes**: Math Master, Word Wizard, Science Explorer, Brain Battle, India Knowledge Quest
- **4 Language Support**: English, Hindi, Marathi, Urdu (with RTL support for Urdu)
- **Class-wise Difficulty**: Content adapts to Class 1-7 levels
- **Student Profiles**: Track progress, streaks, stars, and coins
- **Rewards System**: Earn badges, stars, and coins for achievements
- **Progress Tracking**: Monitor accuracy, sessions, and improvement

### Game Modes

#### 1. Math Master
- Number recognition and ordering
- Arithmetic (addition, subtraction, multiplication, division)
- Multiplication tables with voice support
- Advanced topics (fractions, decimals, geometry, etc.)

#### 2. Word Wizard
- Picture-to-word matching
- Word meaning and synonyms/antonyms
- Missing letter and jumbled word challenges
- Spelling and grammar exercises

#### 3. Science Explorer
- Solar system, human body, plants, animals
- Food and nutrition, water cycle, states of matter
- Environment, energy, and scientific discoveries
- Interactive quizzes with explanations

#### 4. Brain Battle
- Memory match games
- Pattern recognition
- Sequence solving
- Logic puzzles and reasoning challenges
- Visual focus exercises

#### 5. India Knowledge Quest
- Indian geography (states, capitals, rivers, monuments)
- Maharashtra-specific content
- Indian history and freedom movement
- Civics, constitution, and national symbols
- General knowledge and current affairs

### Technical Features

- **PWA Ready**: Installable on Android, iOS, and desktop browsers
- **Offline Support**: Works offline with cached content
- **Responsive Design**: Mobile-first with tablet and desktop support
- **Accessibility**: Keyboard navigation, focus states, high contrast support
- **Local Storage**: Persists student data across sessions
- **RTL Support**: Full right-to-left layout for Urdu

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **PWA**: Service worker, manifest, icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-learning-games
```

2. Install dependencies:
```bash
npm install
```

3. Set up database:
- Create a PostgreSQL database
- Update `.env` with your database URL:
```
DATABASE_URL=postgresql://user:password@localhost:5432/smart_learning_games
```

4. Apply database schema:
```bash
npx drizzle-kit push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles and Tailwind
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home dashboard
│   ├── games/
│   │   ├── layout.tsx        # Games layout
│   │   ├── page.tsx          # Games listing
│   │   └── [gameMode]/
│   │       └── page.tsx      # Generic game page
│   ├── profile/
│   │   └── page.tsx          # Student profile
│   └── api/
│       └── health/
│           └── route.ts       # Health check API
├── components/
│   └── LayoutClient.tsx      # Client-side layout component
├── data/
│   └── questions.ts          # Question bank for all games
├── db/
│   ├── index.ts              # Database connection
│   └── schema.ts             # Database schema
├── lib/
│   ├── gameEngine.ts        # Game engine logic
│   ├── registerSW.ts         # Service worker registration
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript type definitions

public/
├── icons/                   # PWA icons
├── manifest.json            # PWA manifest
└── sw.js                    # Service worker
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@127.0.0.1:5432/app_db |

### Game Configuration

Edit `src/lib/gameEngine.ts` to adjust:
- Points per correct answer
- Hint penalties
- Time per question
- Maximum hints
- Default number of questions

### Adding New Questions

Edit `src/data/questions.ts` to add more questions. Each question follows this structure:

```typescript
{
  id: string;
  gameMode: GameMode;
  subject: Subject;
  classLevel: ClassLevel;
  topic: string;
  language: Language;
  questionType: QuestionType;
  questionText: string;
  options?: AnswerOption[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: Difficulty;
  estimatedTime: number;
}
```

## Usage

### For Students

1. Create a profile with name, avatar, class, and language
2. Select a game mode from the home screen
3. Choose a topic or play all topics
4. Answer questions to earn points
5. Track progress in your profile

### For Teachers

The teacher dashboard (coming soon) will allow:
- Creating and managing classes
- Adding student profiles
- Viewing student progress
- Creating custom quizzes
- Exporting reports

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (Android, iOS)

## PWA Installation

The app can be installed as a PWA:
- Chrome: Click "Install" in the address bar
- Android: Add to Home Screen
- iOS: Share → Add to Home Screen
- Windows: Install from Edge

## License

MIT License

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Acknowledgments

- Built with Next.js and PostgreSQL
- Icons by Lucide
- Fonts by Google Fonts
- Inspired by educational games and learning platforms
