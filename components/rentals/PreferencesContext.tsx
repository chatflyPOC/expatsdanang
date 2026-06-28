'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'vi'
export type Currency = 'usd' | 'vnd'

interface Prefs {
  lang: Lang
  currency: Currency
  toggleLang: () => void
  toggleCurrency: () => void
}

const Ctx = createContext<Prefs>({
  lang: 'en', currency: 'usd',
  toggleLang: () => {}, toggleCurrency: () => {},
})

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const [currency, setCurrency] = useState<Currency>('usd')

  useEffect(() => {
    const l = localStorage.getItem('lang') as Lang | null
    const c = localStorage.getItem('currency') as Currency | null
    if (l === 'en' || l === 'vi') setLang(l)
    if (c === 'usd' || c === 'vnd') setCurrency(c)
  }, [])

  const toggleLang = () => setLang(l => {
    const n: Lang = l === 'en' ? 'vi' : 'en'
    localStorage.setItem('lang', n)
    return n
  })

  const toggleCurrency = () => setCurrency(c => {
    const n: Currency = c === 'usd' ? 'vnd' : 'usd'
    localStorage.setItem('currency', n)
    return n
  })

  return (
    <Ctx.Provider value={{ lang, currency, toggleLang, toggleCurrency }}>
      {children}
    </Ctx.Provider>
  )
}

export const usePrefs = () => useContext(Ctx)
