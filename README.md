# GateFul - Blockful's Portal

A modern Blockful's portal built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4, providing essential internal management features for companies.

## 🚀 Features

### ✅ Implemented

- **Dashboard**: Overview with statistics and quick actions
- **Reimbursement System**: Complete form with validation and file upload
- **OOO (Out of Office) Status**: Absence configuration with personalized messages
- **Internal Messaging**: Chat system between employees
- **Blockful News Portal**: News feed with filters and categories
- **Calendar**: Event visualization with Google Calendar integration
- **Responsive Header**: Adaptive navigation for desktop and mobile
- **Dark/Light Theme**: Theme switching with smooth transitions
- **Sound Effects**: Interactive audio feedback using Howler.js
- **Authentication**: NextAuth.js integration with GitHub OAuth

### 🔧 Technologies Used

- **Next.js 15**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript**: Static typing for JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation
- **Lucide React**: Modern icon library
- **date-fns**: Date manipulation utilities
- **Howler.js**: Audio library for sound effects
- **NextAuth.js**: Authentication solution
- **Next Themes**: Theme management

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd portal
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
portal/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main dashboard
│   │   ├── reimbursement/
│   │   │   └── page.tsx                # Reimbursement form
│   │   ├── ooo/
│   │   │   └── page.tsx                # OOO status configuration
│   │   ├── messages/
│   │   │   └── page.tsx                # Internal messaging system
│   │   ├── news/
│   │   │   └── page.tsx                # Blockful news portal
│   │   ├── calendar/
│   │   │   └── page.tsx                # Event calendar
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts        # NextAuth API routes
│   │   ├── shared/
│   │   │   ├── libs/
│   │   │   │   └── cn.ts               # Utility functions
│   │   │   └── server/
│   │   │       └── auth.ts             # Server-side auth utilities
│   │   ├── globals.css                 # Global styles
│   │   └── layout.tsx                  # Root layout
│   └── components/
│       ├── Header.tsx                  # Responsive header component
│       ├── ThemeSwitch.tsx             # Theme toggle component
│       └── ui/                         # Reusable UI components
├── public/
│   └── sounds/                         # Audio files for interactions
├── package.json
└── README.md
```

## 📱 Pages and Features

### 🏠 Dashboard (`/`)

- Overview statistics and metrics
- Quick action cards for main features
- Recent activity display
- Responsive grid layout
- Dark/light theme support

### 💰 Reimbursement System (`/reimbursement`)

- Complete form with Zod validation
- File upload for receipts and documents
- Expense categorization
- Real-time form validation
- Responsive design with accessibility features

### 🏖️ OOO Status (`/ooo`)

- Absence period configuration
- Customizable absence messages
- Emergency contact information
- Active/inactive status toggle
- Date range validation

### 💬 Internal Messaging (`/messages`)

- Real-time chat interface
- Contact list with online status
- Message search functionality
- Unread message indicators
- Responsive chat layout

### 📰 Blockful News (`/news`)

- News feed with categories
- Search and filtering options
- Important news highlighting
- Tag-based categorization
- Read/unread status tracking

### 📅 Calendar (`/calendar`)

- Monthly event visualization
- Event details and descriptions
- Color-coded event categories
- Navigation between months
- Google Calendar integration ready

## 🎨 UI/UX Features

### Theme System

- Seamless dark/light theme switching
- Persistent theme preferences
- Smooth color transitions
- Consistent design language

### Sound Effects

- Interactive audio feedback
- Gaming-inspired sound design
- Configurable audio settings
- Enhanced user experience

### Responsive Design

- Mobile-first approach
- Adaptive navigation
- Touch-friendly interfaces
- Cross-device compatibility

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# GitHub OAuth (for authentication)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Google Calendar (for future integration)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Authentication Setup

1. **Create a GitHub OAuth App**

   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Set callback URL to `http://localhost:3000/api/auth/callback/github`

2. **Configure NextAuth**
   - Update environment variables with your GitHub credentials
   - Customize authentication providers as needed

# GitHub API Configuration

# Get your token from: https://github.com/settings/tokens

# Required scopes: read:org, read:user

## 📋 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 📞 Support

For questions or support:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ to enhance employee experience and productivity**
