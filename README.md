# 📚 اردو فلیپ بوک پلیٹ فارم | Urdu Flipbook Platform

A professional, full-stack web-based digital Urdu flipbook platform with realistic page-flipping animations, RTL support, and an intuitive admin panel.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 📖 Reader Experience
- **Realistic Book-Style Page Flipping** - Smooth 3D flip animations with page-turn sound effects
- **Table of Contents** - Dynamic, clickable navigation to jump to any topic
- **Page Numbers** - Visible on all content pages
- **RTL Urdu Support** - Full right-to-left layout with Noto Nastaliq Urdu font
- **Mobile-First Design** - Fully responsive with touch swipe gestures
- **Keyboard Navigation** - Use arrow keys to flip pages
- **Elegant Minimal Design** - Clean, distraction-free reading experience

### 🔐 Admin Panel
- **Secure Authentication** - Single admin user with hashed passwords (bcrypt)
- **Book Management** - Create, edit, delete books with draft/publish toggle
- **Topic Management** - Add, edit, delete topics with auto-generated pages
- **Auto Page Generation** - Intelligently splits content into pages (90 words/page, 11 lines/page)
- **Real-Time Preview** - See content before publishing
- **Draft/Published Status** - Control visibility of your books

### 🎨 Design & UX
- **Noto Nastaliq Urdu Font** - Beautiful, professional typography
- **Warm Color Scheme** - Cream pages (#fff8f0) for comfortable reading
- **Page Shadows & Texture** - Realistic book aesthetics
- **Smooth Animations** - Professional micro-interactions
- **Custom Scrollbars** - Styled for TOC panels
- **Loading States** - Better user experience during data fetching

## 🚀 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for server-side logic
- **Prisma ORM** for database operations
- **SQLite** database (production-ready for PostgreSQL migration)
- **bcryptjs** for password hashing

### Database
- **SQLite** (easy to migrate to PostgreSQL)
- Prisma schema with proper relationships
- Cascading deletes for data integrity

## 📦 Project Structure

```
/home/z/my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page (book library)
│   │   ├── layout.tsx                  # Root layout with Urdu font
│   │   ├── globals.css                 # Flipbook styles
│   │   ├── book/[id]/page.tsx          # Book reader with flipbook
│   │   ├── admin/
│   │   │   ├── page.tsx                # Admin portal
│   │   │   ├── login/page.tsx          # Admin login
│   │   │   ├── setup/page.tsx          # Create admin user
│   │   │   └── dashboard/page.tsx      # Book & topic management
│   │   └── api/
│   │       ├── books/                   # Public book API
│   │       └── admin/
│   │           ├── login/               # Auth endpoints
│   │           ├── auth/session/        # Session verification
│   │           ├── logout/              # Logout
│   │           ├── init/                # Create admin
│   │           ├── books/               # Book CRUD
│   │           └── topics/              # Topic CRUD
│   ├── lib/
│   │   ├── db.ts                       # Prisma client
│   │   ├── utils.ts                    # Utilities
│   │   └── page-generator.ts           # Auto page generation
│   └── components/ui/                  # shadcn/ui components
├── prisma/
│   └── schema.prisma                   # Database schema
├── public/
│   ├── page-flip.mp3                   # Page flip sound (ADD THIS)
│   └── ASSETS_README.md                # Audio instructions
├── db/
│   └── custom.db                       # SQLite database
└── worklog.md                          # Development log
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Basic knowledge of Next.js and TypeScript

### Installation

1. **Clone or navigate to the project**
```bash
cd /home/z/my-project
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up the database**
```bash
bun run db:push
```

4. **Add the page-flip sound** (Important!)
   - Download a soft, paper-like page-flip sound effect (0.5-1 second)
   - Place it as `/public/page-flip.mp3`
   - See `/public/ASSETS_README.md` for details

5. **Start the development server**
```bash
bun run dev
```

6. **Open your browser**
   - Home page: http://localhost:3000
   - Admin portal: http://localhost:3000/admin

## 📖 Usage Guide

### First-Time Setup

1. **Create Admin Account**
   - Go to http://localhost:3000/admin/setup
   - Enter username and password (minimum 6 characters)
   - Click "اکاؤنٹ بنائیں" (Create Account)

2. **Login to Admin Dashboard**
   - Go to http://localhost:3000/admin/login
   - Enter your credentials
   - Access the dashboard

### Managing Books

1. **Create a New Book**
   - In the admin dashboard, click "نئی کتاب" (New Book)
   - Enter book title in Urdu
   - Add a description (optional)
   - Set status to "ڈرافٹ" (Draft) or "شائع شدہ" (Published)
   - Click "محفوظ کریں" (Save)

2. **Edit/Delete Books**
   - Click on a book to select it
   - Use the edit (pencil) or delete (trash) icons
   - Confirm deletion when prompted

### Managing Topics

1. **Create a New Topic**
   - Select a book from the left panel
   - Click "نیا موضوع" (New Topic)
   - Enter topic title in Urdu
   - Set the order (e.g., 1, 2, 3...)
   - Paste or type Urdu content (pages auto-generate!)
   - Click "محفوظ کریں" (Save)

2. **Edit/Delete Topics**
   - Click the edit or delete icons next to each topic
   - Content updates will regenerate pages automatically

### Publishing Books

1. Set book status to "شائع شدہ" (Published)
2. The book will appear on the public home page
3. Click "کتاب دیکھیں" (View Book) to preview

### Reading Books

1. Visit the home page at http://localhost:3000
2. Click on any published book
3. **Navigation:**
   - Click "پچھلا" (Previous) or "اگلا" (Next) buttons
   - Use keyboard arrow keys
   - Swipe on mobile/touch devices
   - Click TOC button to jump to topics
4. Enjoy the realistic page-flip animation!

## 🎨 Customization

### Change Page Flip Sound
Replace `/public/page-flip.mp3` with your own sound file

### Adjust Page Generation
Edit `/src/lib/page-generator.ts`:
```typescript
const wordsPerPage = 90;  // Adjust word count
const linesPerPage = 11;  // Adjust line count
```

### Change Colors
Edit `/src/app/globals.css`:
```css
:root {
  --page-width: 460px;      // Adjust page width
  --page-height: 650px;     // Adjust page height
  --page-bg: #fff8f0;       // Change page color
}
```

### Switch to PostgreSQL
1. Update `DATABASE_URL` in `.env`
2. Run `bun run db:push`
3. No code changes needed!

## 🔧 API Endpoints

### Public APIs
- `GET /api/books` - List all published books
- `GET /api/books/[id]` - Get book with all pages for reading

### Admin APIs
- `POST /api/admin/login` - Admin login
- `GET /api/admin/auth/session` - Verify session
- `POST /api/admin/logout` - Logout
- `POST /api/admin/init` - Create admin user

### Book Management
- `GET /api/admin/books` - List all books
- `POST /api/admin/books` - Create book
- `GET /api/admin/books/[id]` - Get book details
- `PUT /api/admin/books/[id]` - Update book
- `DELETE /api/admin/books/[id]` - Delete book

### Topic Management
- `GET /api/admin/topics?bookId=...` - List topics for a book
- `POST /api/admin/topics` - Create topic (auto-generates pages)
- `GET /api/admin/topics/[id]` - Get topic details
- `PUT /api/admin/topics/[id]` - Update topic
- `DELETE /api/admin/topics/[id]` - Delete topic

## 📊 Database Schema

```prisma
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // Hashed with bcrypt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Book {
  id          String    @id @default(cuid())
  title       String    // Urdu title
  description String?   // Urdu description
  status      String    @default("draft") // draft/published
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  topics      Topic[]
}

model Topic {
  id        String    @id @default(cuid())
  bookId    String
  title     String    // Urdu title
  content   String    // Long Urdu text
  order     Int       // Topic order
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  book      Book      @relation(fields: [bookId], references: [id])
  pages     Page[]
}

model Page {
  id          String   @id @default(cuid())
  topicId     String
  pageNumber  Int      // Page number within topic
  content     String   // Page content
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  topic       Topic    @relation(fields: [topicId], references: [id])
}
```

## 🐛 Troubleshooting

### Page flip sound not playing
- Ensure `/public/page-flip.mp3` exists
- Check browser console for errors
- Browser may block autoplay - user interaction required first

### Urdu text not displaying correctly
- Check that Noto Nastaliq Urdu font is loading
- Verify RTL direction in layout: `<html lang="ur" dir="rtl">`

### Admin login not working
- Clear browser cookies
- Recreate admin via `/admin/setup`
- Check console for error messages

### Database errors
- Run `bun run db:push` to sync schema
- Check `DATABASE_URL` in `.env`
- Ensure database file exists in `/db/`

## 🚀 Deployment

### Production Build
```bash
bun run build
bun start
```

### Environment Variables
```env
DATABASE_URL="file:./db/custom.db"
NODE_ENV="production"
```

### Hosting Recommendations
- **Vercel** - Best for Next.js projects
- **Railway** - Easy PostgreSQL deployment
- **Render** - Full-stack hosting
- **Docker** - For containerized deployment

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the worklog at `/worklog.md`
3. Open an issue on GitHub

## 🙏 Acknowledgments

- **Noto Nastaliq Urdu Font** - Google Fonts
- **shadcn/ui** - Beautiful component library
- **Prisma** - Modern ORM
- **Next.js Team** - Amazing framework

---

Built with ❤️ for the Urdu reading community

**اُردو فلیپ بوک پلیٹ فارم** - Professional Digital Reading Experience
