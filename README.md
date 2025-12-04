# Barsense - Modern E-commerce Application

A full-featured, production-ready e-commerce application built with React, TypeScript, Tailwind CSS, and Zustand for state management.

## 🚀 Features

### Pages & Functionality
- **Onboarding** - Welcome screen with intro slides
- **Home Page** - Hero banner, categories, featured products
- **Product Page** - Detailed product view with image gallery, variants, ratings
- **Category Pages** - Filterable and sortable product listings
- **Search** - Full-text product search
- **Cart** - Add/remove items, quantity management, discount codes
- **Checkout** - Multi-step checkout with address and payment
- **Order Confirmation** - Order summary and details
- **User Profile** - Profile management and order history
- **Wishlist** - Save favorite products
- **Authentication** - Login system

### State Management
- **Cart Store** - Full cart logic with localStorage persistence
  - Add/remove items
  - Update quantities
  - Auto-calculate subtotal, tax, and total
  - Apply discount codes (try: SAVE10, SAVE20, WELCOME)
  
- **Auth Store** - User authentication and profile management
  - Login/logout
  - Profile updates
  - Address management
  - Order history

- **Wishlist Store** - Save and manage favorite products

### UI/UX Features
- Modern, clean design with Tailwind CSS
- Fully responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states
- Empty states with helpful CTAs
- Reusable component library
- Consistent color palette and typography
- Professional shadows and rounded corners

## 📦 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Component Library

### UI Components
- `Button` - Variants: primary, secondary, outline, ghost, danger
- `Input` - Text inputs with labels and error states
- `Rating` - Star ratings with reviews count
- `Loading` - Spinner, screen, and card loading states
- `EmptyState` - Empty state messages with actions

### Feature Components
- `ProductCard` - Product display with wishlist and cart actions
- `CategoryCard` - Category display with image overlay
- `Header` - Navigation with search, cart, wishlist, user menu
- `Footer` - Site footer with links
- `Layout` - Page wrapper with header and footer

## 🗂️ Project Structure

```
src/
├── components/
│   ├── category/
│   │   └── CategoryCard.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── product/
│   │   └── ProductCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── EmptyState.tsx
│       ├── Input.tsx
│       ├── Loading.tsx
│       └── Rating.tsx
├── data/
│   └── mockData.ts
├── pages/
│   ├── CartPage.tsx
│   ├── CategoryPage.tsx
│   ├── CheckoutPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── OnboardingPage.tsx
│   ├── OrderConfirmationPage.tsx
│   ├── OrdersPage.tsx
│   ├── ProductPage.tsx
│   ├── ProfilePage.tsx
│   ├── SearchPage.tsx
│   └── WishlistPage.tsx
├── store/
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── wishlistStore.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🎯 Key Features Explained

### Cart Logic
- Items persist in localStorage
- Automatic price calculations
- Tax calculation (10%)
- Discount code system
- Quantity management
- Variant support (size, color)

### Filtering & Sorting
- Price range filter
- Size and color filters
- Rating filter
- Sort by: popular, newest, price (low/high), rating

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Adaptive navigation
- Touch-friendly UI

## 🔑 Demo Credentials

**Login:** Use any email and password to login (demo mode)

**Discount Codes:**
- SAVE10 - $10 off
- SAVE20 - $20 off
- WELCOME - $15 off

## 🎨 Design System

**Colors:**
- Primary: Blue (#0ea5e9)
- Success: Green
- Error: Red
- Warning: Yellow

**Typography:**
- Font: Inter
- Sizes: Responsive scale from sm to 5xl

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Performance Optimizations

- Code splitting with React lazy loading
- Image optimization
- Memoized computations
- Efficient re-renders with Zustand
- LocalStorage for persistence

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
