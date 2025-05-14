'use client'

import React, { createContext, useContext } from 'react'
import { Category } from '@/types/Category'
import useFetch from '@/hooks/useFetch'
import { CategoriesContextType } from '@/types/CategoriesContext'

const CategoriesContext = createContext<CategoriesContextType>({
   categories: [],
   categoriesMap: {},
   loading: false,
   error: null,
})

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const { data: categories, loading, error } = useFetch<Category>('/api/categories', {}, false, true)

   const safeCategories = Array.isArray(categories) ? categories : []

   const categoriesMap = safeCategories.reduce(
      (acc, category) => {
         acc[category.id] = category.name
         return acc
      },
      {} as Record<number, string>,
   )

   return (
      <CategoriesContext.Provider value={{ categories: safeCategories, categoriesMap, loading, error }}>
         {children}
      </CategoriesContext.Provider>
   )
}

export const useCategories = () => useContext(CategoriesContext)
