// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Component slot context.
 *
 * Provides a React context so any component in the tree can
 * resolve the active variant for a given slot via `useSlot()`.
 *
 * Resolution order:
 * 1. User overrides from site.json `components` field
 * 2. Template default slots
 */

import { useContext } from 'react'
import type { ComponentSlots, SlotName } from './slots'

import { SlotContext } from './slotContext'
export { SlotProvider } from './SlotProvider'

export type VariantRegistry = { [K in SlotName]?: Record<string, ComponentSlots[K]> }

/**
 * Get the active component for a slot.
 *
 * @example
 * const Hero = useSlot('hero')
 * return <Hero title="Hi" avatar="me.jpg" />
 */
export function useSlot<K extends SlotName>(name: K): ComponentSlots[K] {
  const slots = useContext(SlotContext)
  if (!slots) {
    throw new Error(`useSlot("${name}") must be used within a <SlotProvider>`)
  }
  return slots[name]
}

/**
 * Merge template default slots with user-selected variant overrides.
 *
 * @param templateSlots - Default slot implementations from the template
 * @param variantRegistry - All registered variants keyed by `slotName.variantId`
 * @param userOverrides - User selections from site.json `components` field
 */
export function resolveSlots(
  templateSlots: ComponentSlots,
  variantRegistry: VariantRegistry,
  userOverrides?: Record<string, string>,
): ComponentSlots {
  if (!userOverrides) return templateSlots

  const resolved = { ...templateSlots }

  const applyOverride = <K extends SlotName>(slotName: K, variantId: string) => {
    const component = variantRegistry[slotName]?.[variantId]
    if (component) resolved[slotName] = component
  }

  for (const [slotName, variantId] of Object.entries(userOverrides)) {
    if (Object.prototype.hasOwnProperty.call(resolved, slotName)) {
      applyOverride(slotName as SlotName, variantId)
    }
  }

  return resolved
}
