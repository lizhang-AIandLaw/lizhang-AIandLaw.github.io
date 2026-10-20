// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import type { ComponentSlots } from './slots'
import { SlotContext } from './slotContext'

interface SlotProviderProps {
  slots: ComponentSlots
  children: ReactNode
}

export const SlotProvider = ({ slots, children }: SlotProviderProps) => (
  <SlotContext.Provider value={slots}>{children}</SlotContext.Provider>
)
