# HINCH Catalogs Web Application

A modern, responsive web application showcasing HINCH's premium laminates and materials catalog with an intuitive category-based filtering system.

## 🚀 Features

- **Real Catalog Data**: 3,000+ catalog items from actual CSV data
- **Category Tabs**: Pill-shaped category filters with item counts
- **Google Drive Integration**: Direct preview and download links
- **PDF Thumbnails**: First page thumbnails from Google Drive API
- **Responsive Design**: Works seamlessly on all devices
- **Search & Filter**: Advanced filtering by title, brand, and category
- **HINCH Branding**: Consistent orange color scheme and typography

## 🎯 Categories

The application organizes catalogs into the following categories (in priority order):

1. **Acrylic Laminates** - Premium acrylic surface materials
2. **Solid Colour Laminates** - Vibrant solid color options
3. **360 Louvers** - Complete louver systems
4. **Decorative Laminates** - Artistic and textured surfaces
5. **Doors** - Door solutions and hardware
6. **Edge Banding** - Edge finishing materials
7. **Hardware** - Installation and mounting hardware
8. **Liners** - Interior lining materials
9. **Louvers** - Ventilation and privacy louvers
10. **Mouldings** - Decorative trim and molding
11. **PVC Laminates** - Durable PVC surface materials
12. **Thermo Laminates** - Heat-resistant laminates
13. **Veneers** - Natural wood veneers
14. **Wall Panels** - Decorative wall covering solutions

## 🛠️ Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Google Drive API** - PDF thumbnails and file access
- **Responsive Design** - Mobile-first approach

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SujeethSoma/hinch-catalogs-web.git
cd hinch-catalogs-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

### Navigation
- **Home Page**: Click "View Catalogs" to access the main catalog interface
- **Category Filtering**: Use the pill-shaped category tabs to filter by material type
- **Search**: Use the search bar to find specific catalogs by title
- **Brand Filter**: Use the brand dropdown to filter by manufacturer

### Catalog Cards
- **Preview Mode**: Shows action buttons (Preview/Download) pinned to the bottom
- **Details Mode**: Shows catalog descriptions instead of action buttons
- **Thumbnails**: First page of each PDF catalog displayed as card cover
- **Actions**: Click Preview to view in Google Drive, Download for direct file access

## 🎨 Design System

### Colors
- **Primary**: #FF7A1A (HINCH Orange)
- **Primary Hover**: #FF8F40
- **Text**: #111827 (Dark Gray)
- **Muted Text**: #6B7280 (Medium Gray)
- **Background**: #F8FAFC (Light Gray)
- **Cards**: White with subtle shadows

### Typography
- **Headings**: Bold, dark gray
- **Body Text**: Regular weight, medium gray
- **Category Tabs**: Medium weight with counts

## 📊 Data Structure

The application uses a structured data model:

```typescript
interface CatalogItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  thumbnail?: string;
  previewUrl?: string;
  downloadUrl?: string;
  description?: string;
}
```

## 🔧 Development

### Project Structure
```
app/
├── catalogs/
│   ├── _components/     # React components
│   ├── _data/          # Data files and utilities
│   ├── _lib/           # Utility functions
│   ├── _types.ts       # TypeScript definitions
│   └── page.tsx        # Main catalog page
├── layout.tsx          # Root layout
└── page.tsx            # Home page
```

### Key Components
- **CategoryTabs**: Pill-shaped category filter with counts
- **CatalogCard**: Individual catalog display with actions
- **Toolbar**: Search, brand filter, and view toggle

## 📄 License

This project is proprietary to HINCH and contains confidential catalog data.

## 🤝 Contributing

This is a private project for HINCH. For internal development, please follow the established coding standards and ensure all changes are tested before deployment.

## 📞 Support

For technical support or questions about the catalog data, please contact the HINCH development team.