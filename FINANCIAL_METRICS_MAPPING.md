# 💰 Financial Metrics Mapping - TingaTalk Admin

## Dashboard Display → Firestore Fields

### Revenue Overview Cards

| Dashboard Label | Firestore Path | Field Name | Description |
|----------------|----------------|------------|-------------|
| **🪙 Coin Revenue** | `/admin_analytics/financial_stats` | `totalRevenue` | Total coins purchased by male users (INR) |
| **💰 Net Profit** | `/admin_analytics/financial_stats` | `netProfit` | Revenue minus completed payouts |
| **⏳ Pending Payouts** | `/admin_analytics/financial_stats` | `pendingPayouts` | Female earnings not yet withdrawn |
| **💎 Actual Profit** | `/admin_analytics/financial_stats` | `trueProfit` | Revenue minus pending payouts (real profit) |

---

## Detailed Explanation

### 🪙 Coin Revenue (totalRevenue)
- **What it is**: Total amount of money received from male users purchasing coins
- **Formula**: Sum of all coin purchase transactions
- **Example**: If males bought ₹396 worth of coins, this shows ₹396
- **Use case**: Track total incoming revenue

### 💰 Net Profit (netProfit)
- **What it is**: Profit after paying out completed withdrawals
- **Formula**: `totalRevenue - totalPayouts`
- **Example**: ₹396 revenue - ₹0 payouts = ₹396 net profit
- **Use case**: Track profit after actual withdrawals

### ⏳ Pending Payouts (pendingPayouts)
- **What it is**: Money owed to female users but not yet withdrawn
- **Formula**: Sum of all female `availableBalanceINR` fields
- **Example**: If females earned ₹35.4 but haven't withdrawn, this shows ₹35.4
- **Use case**: Track liability/money owed to users

### 💎 Actual Profit (trueProfit)
- **What it is**: Real profit accounting for pending obligations
- **Formula**: `totalRevenue - pendingPayouts`
- **Example**: ₹396 revenue - ₹35.4 pending = ₹360.6 actual profit
- **Use case**: Most accurate profit metric for business decisions
- **Note**: Falls back to `netProfit` if `trueProfit` doesn't exist

---

## Current Values (as of last check)

```javascript
{
  totalRevenue: 396,      // ₹396 Coin Revenue
  netProfit: 396,         // ₹396 Net Profit
  pendingPayouts: 35.4,   // ₹35.4 Pending Payouts
  trueProfit: 360.6       // ₹360.6 Actual Profit
}
```

---

## Financial Flow

```
Male User Purchases Coins (₹396)
         ↓
   totalRevenue: ₹396
         ↓
Male Uses Coins for Calls
         ↓
Female Earns Money (₹35.4)
         ↓
   pendingPayouts: ₹35.4
         ↓
   trueProfit: ₹360.6 (396 - 35.4)
         ↓
Female Withdraws Money
         ↓
   totalPayouts: ₹35.4
   pendingPayouts: ₹0
         ↓
   netProfit: ₹360.6 (396 - 35.4)
```

---

## Why These Metrics Matter

### For Business Decisions
- **Coin Revenue**: Shows total sales/income
- **Actual Profit**: Shows real money you can use
- **Pending Payouts**: Shows how much you need to keep liquid
- **Net Profit**: Shows profit after fulfilling obligations

### For Financial Planning
- Keep enough cash to cover `pendingPayouts`
- Use `trueProfit` for investment decisions
- Track `totalRevenue` growth over time
- Monitor `netProfit` after withdrawal spikes

---

## Code Implementation

### In analyticsService.ts
```typescript
const result: AnalyticsData = {
  totalEarnings: financialStats.totalRevenue,        // Coin Revenue
  audioCallEarnings: financialStats.netProfit,       // Net Profit
  videoCallEarnings: financialStats.pendingPayouts,  // Pending Payouts
  coinPurchaseEarnings: financialStats.trueProfit,   // Actual Profit
  // ... other fields
};
```

### In AnalyticsDashboard.tsx
```typescript
const earningsStats: EarningsStat[] = [
  {
    label: 'Coin Revenue',
    amount: analyticsData.totalEarnings,  // totalRevenue
    icon: '🪙'
  },
  {
    label: 'Net Profit',
    amount: analyticsData.audioCallEarnings,  // netProfit
    icon: '💰'
  },
  {
    label: 'Pending Payouts',
    amount: analyticsData.videoCallEarnings,  // pendingPayouts
    icon: '⏳'
  },
  {
    label: 'Actual Profit',
    amount: analyticsData.coinPurchaseEarnings,  // trueProfit
    icon: '💎'
  }
];
```

---

## Testing

Open `test-analytics-connection.html` to verify:
1. All four metrics display correctly
2. Values match Firestore data
3. Icons and labels are correct
4. Calculations are accurate

---

## Notes

- All values are in INR (Indian Rupees)
- Values are rounded to 2 decimal places
- `trueProfit` is the most important metric for business health
- `pendingPayouts` should be monitored to ensure liquidity
- These metrics update in real-time via Cloud Functions
