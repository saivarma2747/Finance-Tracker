# Finance-Tracker

# 💰 Personal Finance Tracker (React + Shadcn UI)
> A modern, client-side finance tracker to log income/expenses, visualize trends, and view spending by category with live currency conversion.

![Tech Stack](https://img.shields.io/badge/Tech-React|TypeScript|Shadcn_UI|Vite-blue)
![Charts](https://img.shields.io/badge/Charts-Custom_Charts|Category_Chart|Transaction_Chart-purple)
![API](https://img.shields.io/badge/API-Exchange_Rates_API-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 📌 Overview
This project is a **lightweight personal finance tracker** built with React and Shadcn UI components that lets users add transactions, categorize them, track balance over time, and analyze spending via charts. Data is persisted in the browser using `localStorage`, and currency values can be viewed in multiple currencies using live exchange rates.  

**Why it’s useful:**
- Saves time by simplifying daily expense/income tracking with a clean UX and quick-add flow.  
- Offers **instant analytics** with category breakdown and transaction trends via charts.  
- Supports **multi-currency viewing** using exchange rates for global usability.  

**Who it’s for:**
- Students and professionals managing monthly budgets.  
- Developers learning state management and UI patterns with React + Shadcn.  
- Anyone needing a fast, privacy-friendly tracker without a backend.  

## ✨ Features
- ✅ **Quick Add Income** with validation and default categories.  
- ✅ **Add Transactions** with type, amount, category, and description.  
- ✅ **Currency Selector** to switch display currency instantly.  
- ✅ **Local Persistence** using `localStorage` for offline-first usage.  
- ✅ **Live Exchange Rates** via public exchange rate API (base USD).  
- ✅ **Charts**:  
  - Category distribution pie chart.  
  - Transaction timeline flow chart.  
- ✅ **Responsive UI** with Shadcn components and Lucide icons.
- 

### Dashboard Snapshots
- Currency picker with live conversion  
- Summary cards for Balance, Income, and Expenses  
- Recent Transactions list with delete option  
- Charts: Category breakdown and Money Flow  


## ⚙️ Tech Stack
- **Frontend**: React, TypeScript  
- **UI**: Shadcn UI (Card, Button, Input, Select, Tabs, Badge, Label)  
- **Icons**: Lucide React  
- **State**: React hooks 
- **Data**: localStorage (client-side persistence)  
- **Charts**: Custom `TransactionChart`, `CategoryChart` components  
- **API**: Exchangerate-API

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js   
- npm or yarn or pnpm  
- Modern browser

## 📦 Installation

### 1) Clone the repository
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker

### 2) Install dependencies
npm install
 or
yarn
 or
pnpm install

### 3) Start the development server
npm run dev
 or
yarn dev
 or
pnpm dev



## 🧩 Key Components

- `FinanceTracker.tsx`: Main app page that manages state, forms, tabs, currency, and persistence.  
- `TransactionChart.tsx`: Line/area chart of transaction flow over time.  
- `CategoryChart.tsx`: Pie/donut chart of expenses by category.  
- Shadcn UI components: Card, Tabs, Select, Button, Input, Label, Badge.  

## 📈 How It Works

1. **State & Persistence**: Transactions are stored in React state and synced to `localStorage` under the key `finance-transactions`.  
2. **Exchange Rates**: On load, the app fetches USD-based rates and stores them in state. All displayed values convert using the selected currency rate.  
3. **Validation**: Forms validate amount, category, and description to prevent invalid entries.  
4. **Analytics**:  
   - Balance = total income − total expenses.  
   - Category totals sum only expense transactions for the pie chart.  
   - Transaction timeline visualizes cash flow trends.

## 🛠️ Use Cases

- **Budgeting**: Track monthly spending vs income with quick visual summaries.  
- **Multi-currency View**: Instantly see balances in INR/EUR/GBP and more.  
- **Spending Insights**: Identify top expense categories to optimize costs.  
- **Learning Project**: Demonstrates practical React patterns with UI and charts.

## 🔐 Privacy

- All data is stored in the browser via `localStorage`.  
- No server-side storage is used by default.

## 🙌 Author
**Nagendra Varma**  
- 📧 Email: saivarma2747@gmail.com 
- 🔗 LinkedIn: https://linkedin.com/in/nagendravarma7
