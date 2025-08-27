//"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"
import { TransactionChart } from "@/components/transaction-chart"
import { CategoryChart } from "@/components/category-chart"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

interface ExchangeRates {
  [key: string]: number
}

const CATEGORIES = {
  income: ["Salary", "Freelance Work", "Side Hustle", "Investment Returns", "Gift Money", "Other"],
  expense: ["Groceries", "Gas & Transport", "Shopping", "Utilities", "Fun Stuff", "Medical", "Rent/Mortgage", "Other"],
}

// TODO: maybe add more currencies later?
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR"]

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentCurrency, setCurrentCurrency] = useState("USD") // renamed for more natural feel
  const [rates, setRates] = useState<ExchangeRates>({ USD: 1 }) // shortened variable name
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}) // more descriptive name

  // Quick income stuff - added this later for easier income entry
  const [quickIncome, setQuickIncome] = useState({
    amount: "",
    category: "Salary",
  })
  const [quickErrors, setQuickErrors] = useState<{ [key: string]: string }>({})

  // Load saved data when app starts
  useEffect(() => {
    const savedTransactions = localStorage.getItem("finance-transactions")
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
      } catch (e) {
        console.log("Error loading transactions:", e)
        // If data is corrupted, start fresh
        localStorage.removeItem("finance-transactions")
      }
    }
  }, [])

  // Auto-save transactions
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("finance-transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  // Get exchange rates from API
  useEffect(() => {
    const getRates = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        if (response.ok) {
          const data = await response.json()
          setRates(data.rates)
        }
      } catch (error) {
        console.log("Couldn't fetch exchange rates:", error)
        // Just use USD if API fails
      }
    }
    getRates()
  }, [])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    const amt = Number.parseFloat(formData.amount)
    if (!formData.amount || amt <= 0 || isNaN(amt)) {
      errors.amount = "Please enter a valid amount"
    }
    if (!formData.category) {
      errors.category = "Pick a category"
    }
    if (!formData.description?.trim()) {
      errors.description = "Add a quick description"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddTransaction = () => {
    if (!validateForm()) return

    const newTransaction: Transaction = {
      id: Date.now().toString(), // Simple ID generation
      type: formData.type,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date().toISOString().split("T")[0], // Just the date part
    }

    setTransactions([newTransaction, ...transactions]) // Add to beginning
    // Reset form
    setFormData({ type: "expense", amount: "", category: "", description: "" })
    setFormErrors({})
  }

  const validateQuickIncome = () => {
    const errors: { [key: string]: string } = {}
    const amt = Number.parseFloat(quickIncome.amount)

    if (!quickIncome.amount || amt <= 0 || isNaN(amt)) {
      errors.amount = "Enter amount"
    }

    setQuickErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleQuickIncome = () => {
    if (!validateQuickIncome()) return

    const incomeTransaction: Transaction = {
      id: Date.now().toString(),
      type: "income",
      amount: Number.parseFloat(quickIncome.amount),
      category: quickIncome.category,
      description: quickIncome.category, // Just use category as description
      date: new Date().toISOString().split("T")[0],
    }

    setTransactions([incomeTransaction, ...transactions])
    setQuickIncome({ amount: "", category: "Salary" }) // Reset to default
    setQuickErrors({})
  }

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const getBalance = () => {
    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount
      } else {
        totalExpenses += t.amount
      }
    })

    return totalIncome - totalExpenses
  }

  const convertToCurrentCurrency = (amount: number) => {
    const rate = rates[currentCurrency] || 1
    return (amount * rate).toFixed(2)
  }

  // For the pie chart
  const getExpensesByCategory = () => {
    const categoryTotals: { [key: string]: number } = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      })

    return categoryTotals
  }

  // Calculate totals
  const balance = getBalance()
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">My Finance Tracker</h1>
          <p className="text-muted-foreground">Keep track of your money stuff</p>
        </div>

        {/* Currency picker */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="currency">Currency:</Label>
              <Select value={currentCurrency} onValueChange={setCurrentCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick income entry - this makes it super easy to add income */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              Quick Add Income
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quick-amount">Amount (USD)</Label>
                <Input
                  id="quick-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={quickIncome.amount}
                  onChange={(e: { target: { value: any } }) => setQuickIncome({ ...quickIncome, amount: e.target.value })}
                  className={quickErrors.amount ? "border-destructive" : ""}
                />
                {quickErrors.amount && <p className="text-sm text-destructive">{quickErrors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-category">Category</Label>
                <Select
                  value={quickIncome.category}
                  onValueChange={(value) => setQuickIncome({ ...quickIncome, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.income.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleQuickIncome} className="w-full bg-green-600 hover:bg-green-700">
                  Add Income
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Money summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {currentCurrency} {convertToCurrentCurrency(balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {currentCurrency} {convertToCurrentCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {currentCurrency} {convertToCurrentCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Charts</TabsTrigger>
            <TabsTrigger value="add">Add Transaction</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "income" | "expense") =>
                        setFormData({ ...formData, type: value, category: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className={formErrors.amount ? "border-destructive" : ""}
                    />
                    {formErrors.amount && <p className="text-sm text-destructive">{formErrors.amount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className={formErrors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES[formData.type].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="What was this for?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={formErrors.description ? "border-destructive" : ""}
                    />
                    {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
                  </div>
                </div>

                <Button onClick={handleAddTransaction} className="w-full">
                  Add Transaction
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transactions yet. Start by adding some!</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                              {transaction.type}
                            </Badge>
                            <span className="font-medium">{transaction.category}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {currentCurrency} {convertToCurrentCurrency(transaction.amount)}
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => removeTransaction(transaction.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Where Your Money Goes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryChart
                    data={getExpensesByCategory()}
                    currency={currentCurrency}
                    exchangeRate={rates[currentCurrency] || 1}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Money Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionChart
                    transactions={transactions}
                    currency={currentCurrency}
                    exchangeRate={rates[currentCurrency] || 1}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
