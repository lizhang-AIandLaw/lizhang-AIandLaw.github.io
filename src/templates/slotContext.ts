// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { createContext } from 'react'
import type { ComponentSlots } from './slots'

export const SlotContext = createContext<ComponentSlots | null>(null)
