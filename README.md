# Portfolio Generator

A modern, feature-rich portfolio and resume builder application that helps developers create professional portfolios with ease. Built with Next.js, React, and shadcn/ui for a seamless user experience.

![Portfolio Generator Demo](public/og.jpg)

## ✨ Features

- **Resume Builder**: Create and customize professional resumes with multiple templates
- **ATS Score Checker**: Get your resume's ATS compatibility score and improvement suggestions
- **Portfolio Generation**: Generate a beautiful portfolio website from your resume
- **GitHub Integration**: Import your GitHub projects and contributions
- **Real-time Preview**: See changes as you build your portfolio
- **Responsive Design**: Looks great on all devices
- **Dark Mode**: Built-in dark theme support
- **PDF Export**: Download your resume as a PDF

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Firebase (Firestore & Storage)
- **PDF Generation**: React-PDF
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Deployment**: Vercel (recommended)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Firestore and Storage enabled
- GitHub OAuth credentials (for GitHub integration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/portfolio-generator.git
   cd portfolio-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # GitHub OAuth (optional)
   GITHUB_ID=your_github_oauth_id
   GITHUB_SECRET=your_github_oauth_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
portfolio-generator/
├── app/                    # App router pages
│   ├── api/                # API routes
│   ├── atsScore/           # ATS score checker
│   ├── auth/               # Authentication pages
│   ├── builder/            # Resume/portfolio builder
│   ├── contact/            # Contact page
│   ├── dashboard/          # User dashboard
│   ├── template/           # Resume templates
│   └── ...
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configurations
├── public/                 # Static files
└── styles/                 # Global styles
```

## 🎨 Customization

### Adding a New Template
1. Create a new template component in `app/template/components/`
2. Add your template to the template gallery in `app/template/page.tsx`
3. Update the template selection logic in the builder

### Theming
Edit the `tailwind.config.js` file to customize the color scheme and other design tokens.

## 🚀 Deployment to Vercel

This application is optimized for deployment on Vercel. Follow these steps to deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Create an account on [Vercel](https://vercel.com) if you don't have one
3. Click **Add New** > **Project** in the Vercel dashboard
4. Import your Git repository
5. Configure the following environment variables in the Vercel dashboard:
   - Firebase configuration
   - NextAuth configuration
   - Google OAuth credentials
   - Any other API keys used in your application
6. Click **Deploy**

For detailed deployment instructions, refer to the following guides in this repository:
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Complete deployment guide
- [PRODUCTION_AUTH_SETUP.md](PRODUCTION_AUTH_SETUP.md) - Authentication setup for production
- [FIREBASE_PRODUCTION_SETUP.md](FIREBASE_PRODUCTION_SETUP.md) - Firebase configuration for production
- [DEPLOYMENT_TESTING_CHECKLIST.md](DEPLOYMENT_TESTING_CHECKLIST.md) - Testing your deployed application

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services

---

Made with ❤️ by Shubh,Urjit,Vedant
