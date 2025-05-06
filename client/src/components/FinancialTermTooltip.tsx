import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'

// Financial terms glossary
const financialTerms: Record<string, string> = {
  // Investment avenues
  "Mutual Funds": "Investment vehicles that pool money from multiple investors to purchase securities like stocks and bonds.",
  "Equity": "Ownership in a company in the form of shares, which may increase in value and provide dividends.",
  "Gold": "A precious metal often used as a store of value and hedge against inflation.",
  "Fixed Deposits": "A savings account that pays a fixed rate of interest until a given maturity date.",
  "PPF": "Public Provident Fund - A government-backed long-term savings scheme with tax benefits.",
  
  // Investment objectives
  "Wealth Creation": "Growing your assets over time through investments that appreciate in value.",
  "Retirement": "Saving and investing to ensure financial security after you stop working.",
  "Tax Saving": "Reducing your tax liability through specific investments that offer tax benefits.",
  "Children's Education": "Saving for future educational expenses of your children.",
  "Emergency Fund": "Money set aside for unexpected expenses or financial hardships.",
  
  // Investment factors
  "Risk": "The potential for an investment to lose value or provide returns lower than expected.",
  "Liquidity": "How quickly an investment can be converted to cash without significant loss in value.",
  "Return": "The gain or loss on an investment, usually expressed as a percentage.",
  "Tax Benefit": "Advantages that reduce the amount of tax you pay on certain investments.",
  "Investment Tenure": "The length of time you plan to hold an investment before cashing out.",
  "Market Trends": "Patterns or tendencies in financial markets that may affect investment performance.",
  
  // Financial concerns
  "Market Volatility": "Rapid and significant price fluctuations in financial markets.",
  "Inflation": "The rate at which the general level of prices for goods and services rises.",
  "Unexpected Expenses": "Unforeseen costs that weren't budgeted for, like medical emergencies.",
  "Job Security": "The assurance that your employment will continue and provide stable income.",
  "Health Costs": "Expenses related to medical care, treatments, and insurance.",
  "Retirement Adequacy": "Having enough savings to maintain your lifestyle after retirement.",
  "Tax Burden": "The total amount of tax an individual or business must pay to the government.",
  "Debt Management": "Strategies to handle and reduce outstanding loans and credit obligations.",
  
  // Investment durations
  "< 1 year": "Short-term investments, typically more liquid but may offer lower returns.",
  "1-3 years": "Short to medium-term investments, balancing liquidity and returns.",
  "3-5 years": "Medium-term investments, allowing for some market fluctuations to even out.",
  "5+ years": "Long-term investments, generally allowing for higher risk tolerance and potentially higher returns.",
  
  // Expected returns
  "< 5%": "Conservative returns, typically from low-risk investments like fixed deposits.",
  "5%-10%": "Moderate returns, often from balanced investment portfolios.",
  "10%-15%": "Above-average returns, typically requiring moderate to high risk investments.",
  "> 15%": "High returns, usually associated with high-risk investments like equity or certain mutual funds.",
  
  // Monitoring frequency
  "Daily": "Checking your investments every day, suitable for active traders.",
  "Weekly": "Reviewing investments once a week, balancing awareness with avoiding overreaction.",
  "Monthly": "Monthly review of investments, good for long-term investors.",
  "Rarely": "Infrequent monitoring, typically for very long-term, set-and-forget investments.",
  
  // Knowledge levels
  "Beginner - New to investing": "Just starting to learn about investments with limited understanding of financial concepts.",
  "Basic - Understand fundamental concepts": "Familiar with basic investment types and simple financial principles.",
  "Intermediate - Comfortable with most investment products": "Good understanding of various investment options and strategies.",
  "Advanced - Understand complex investment strategies": "Deep knowledge of financial markets and sophisticated investment approaches.",
  "Expert - Professional experience in finance": "Professional-level understanding of investments, possibly with formal qualifications.",
}

interface FinancialTermTooltipProps {
  term: string
  children: React.ReactNode
}

export function FinancialTermTooltip({ term, children }: FinancialTermTooltipProps) {
  const explanation = financialTerms[term]
  
  if (!explanation) {
    return <>{children}</>
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help border-b border-dotted border-teal-400 dark:border-teal-600">
          {children}
          <InfoIcon className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-white dark:bg-zinc-900 p-2 text-xs">
        {explanation}
      </TooltipContent>
    </Tooltip>
  )
}
