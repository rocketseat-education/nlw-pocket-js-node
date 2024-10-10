import { expect, test } from 'vitest'
import {
  calculateExperienceToNextLevel,
  calculateLevelFromExperience,
} from './gamification'

test('experience to level', () => {
  const experienceToLevel1 = calculateExperienceToNextLevel(1)
  const experienceToLevel2 = calculateExperienceToNextLevel(2)
  const experienceToLevel5 = calculateExperienceToNextLevel(4)

  expect(experienceToLevel1).toEqual(0)
  expect(experienceToLevel2).toEqual(26)
  expect(experienceToLevel5).toEqual(43)
})

test('level from experience', () => {
  const level1 = calculateLevelFromExperience(10)
  const level2 = calculateLevelFromExperience(26)
  const level5 = calculateLevelFromExperience(43 + 33 + 26)

  expect(level1).toEqual(1)
  expect(level2).toEqual(2)
  expect(level5).toEqual(4)
})
