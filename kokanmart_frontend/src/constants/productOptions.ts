export const DEFAULT_CATEGORIES = [
  'Mangoes',
  'Cashews',
  'Kokum',
  'Spices',
  'Coconut',
  'Honey',
  'Pickles',
  'Dry Fruits',
  'Other',
]

export const PRODUCT_UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'piece', label: 'Piece' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'litre', label: 'Litre' },
  { value: 'pack', label: 'Pack' },
  { value: 'box', label: 'Box' },
]

export function buildCategoryOptions(existing: string[] = []) {
  const merged = [...new Set([...DEFAULT_CATEGORIES, ...existing])].sort()
  return [
    { value: '', label: 'Select category' },
    ...merged.map((c) => ({ value: c, label: c })),
  ]
}

export const UNIT_OPTIONS = [
  { value: '', label: 'Select unit' },
  ...PRODUCT_UNITS,
]
