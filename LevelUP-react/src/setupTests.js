// src/setupTests.js
import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extender los matchers de Vitest con los de testing-library
expect.extend(matchers)

// Limpiar después de cada test
afterEach(() => {
	cleanup()
	vi.clearAllMocks()
})
