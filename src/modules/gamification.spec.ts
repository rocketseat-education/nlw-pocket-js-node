import { expect, test } from 'vitest'
import {
  calculateExperienceToLevel,
  calculateLevelFromExperience,
  calculateTotalExperienceForLevel,
} from './gamification'

test('experience to level', () => {
  const exp1 = calculateExperienceToLevel(1)
  const exp2 = calculateExperienceToLevel(2)
  const exp4 = calculateExperienceToLevel(4)

  expect(exp1).toEqual(0)
  expect(exp2).toEqual(26)
  expect(exp4).toEqual(43)
})

test('total experience to level', () => {
  const exp1 = calculateTotalExperienceForLevel(1)
  const exp2 = calculateTotalExperienceForLevel(2)
  const exp3 = calculateTotalExperienceForLevel(3)
  const exp4 = calculateTotalExperienceForLevel(4)

  expect(exp1).toEqual(0)
  expect(exp2).toEqual(26)
  expect(exp3).toEqual(26 + 33)
  expect(exp4).toEqual(26 + 33 + 43)
})

test('level from experience', () => {
  const lev1 = calculateLevelFromExperience(10)
  const lev2 = calculateLevelFromExperience(27)
  const lev5 = calculateLevelFromExperience(26 + 33 + 43)

  expect(lev1).toEqual(1)
  expect(lev2).toEqual(2)
  expect(lev5).toEqual(4)
})
