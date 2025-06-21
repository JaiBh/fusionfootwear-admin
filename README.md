# 🧩 FusionFootwear Admin Dashboard

A full-stack admin panel for managing the FusionFootwear e-commerce store. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **ShadCN UI**, and **Prisma**, this dashboard enables streamlined control over product listings, categories, and analytics.

### 🔗 Live Demo

👉 [fusionfootwear-admin.xyz](https://www.fusionfootwear-admin.xyz)

---

## 🚀 Features

- Full CRUD for products, categories, billboards, colors, and sizes
- Image upload with preview using Cloudinary
- Toggle featured and archived status for products
- Live inventory display
- Dashboard with visual metrics and insights
- Secure route protection with Clerk

---

## 🛠 Tech Stack

- **Framework:** Next.js 14, React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS, ShadCN UI
- **Auth:** Clerk
- **ORM:** Prisma
- **Database:** PostgreSQL (hosted on NeonDB)
- **Deployment:** Vercel

---

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/JaiBh/fusionfootwear-ecommerce-admin.git
cd fusionfootwear-ecommerce-admin
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
   Create a `.env` file using `.env.example` and fill in the required values (Clerk keys, database URL, etc).

4. **Run the dev server:**

```bash
npm run dev
```

---

## 📁 Project Structure

```
/
├── app/              # App routes and pages
├── components/       # UI components
├── lib/              # Helpers and config utils
├── prisma/           # Prisma schema and seed
├── middleware.ts     # Auth middleware with Clerk
```

---

## 🔒 Environment Variables

Create a `.env` file in the root directory and include:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
DATABASE_URL=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_USERID=...
STORE_ID=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_SECRET=...
STRIPE_API_KEY=...
FRONTEND_STORE_URL=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
```

---

## 📌 Roadmap

- [x] Product management UI
- [x] Billboard, category, color and size CRUD
- [x] Clerk auth integration
- [ ] Role-based admin access
- [ ] Live inventory management
- [ ] Advanced sales analytics (charts & trends)

---

## 🧑‍💻 Author

Built by [**Jai Bhullar**](https://jaibh-portfolio.vercel.app/) – aspiring front-end/full-stack developer based near London.

- 📫 Email: jaibhullar.developer@outlook.com
- 🔗 **LinkedIn:** [linkedin.com/in/jai-bhullar-dev](https://www.linkedin.com/in/jai-bhullar-dev)
- 📄 [View My CV](https://drive.google.com/file/d/1CTHnq0laeat8fFoE7rDsQGtSYJl-ILTk/view?usp=sharing)

---

## 📝 License

MIT License. Feel free to use, modify, or contribute!
