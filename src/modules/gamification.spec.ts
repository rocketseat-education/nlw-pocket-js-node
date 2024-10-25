import { expect, test } from 'vitest'
import {
  calculateExperienceForNextLevel,
  calculateLevelFromExperience,
} from './gamification'

test('total experience to level', () => {
  const exp1 = calculateExperienceForNextLevel(1)
  const exp2 = calculateExperienceForNextLevel(2)
  const exp3 = calculateExperienceForNextLevel(3)

  expect(exp1).toEqual(20)
  expect(exp2).toEqual(20 + 26)
  expect(exp3).toEqual(20 + 26 + 33)
})

test('level from experience', () => {
  const lev1 = calculateLevelFromExperience(5)
  const lev2 = calculateLevelFromExperience(20)
  const lev5 = calculateLevelFromExperience(20 + 26 + 33 + 43)

  expect(lev1).toEqual(1)
  expect(lev2).toEqual(2)
  expect(lev5).toEqual(4)
})
