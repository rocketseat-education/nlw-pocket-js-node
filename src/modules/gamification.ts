const BASE_EXPERIENCE = 20
const EXPERIENCE_FACTOR = 1.3

export function calculateLevelFromExperience(experience: number) {
  return (
    Math.floor(
      Math.log((experience / BASE_EXPERIENCE) * (EXPERIENCE_FACTOR - 1) + 1) /
        Math.log(EXPERIENCE_FACTOR)
    ) + 1
  )
}

export function calculateExperienceToLevel(level: number) {
  if (level === 1) return 0 // Nível 1 começa com 0 XP adicional

  return Math.floor(BASE_EXPERIENCE * EXPERIENCE_FACTOR ** (level - 1))
}

export function calculateTotalExperienceForLevel(level: number): number {
  if (level === 1) return calculateExperienceToLevel(1) // Nível 1 começa com 0 XP adicional

  return (
    calculateExperienceToLevel(level) +
    calculateTotalExperienceForLevel(level - 1)
  )
}
