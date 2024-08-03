import * as React from "react"
import { type ZodSchema } from "zod"

type EntityZodErrors<T> = Partial<Record<keyof T, string[] | undefined>>

export function useValidatedForm<Entity>(entityZodSchema: ZodSchema) {
  const [errors, setErrors] = React.useState<EntityZodErrors<Entity> | null>(
    null
  )
  const hasErrors =
    errors !== null &&
    Object.values(errors).some((error) => error !== undefined)

  const validateField = (field: keyof Entity, value: any) => {
    const result = entityZodSchema.safeParse({
      [field]: value,
    })
    const fieldError = result.success
      ? undefined
      : result.error.flatten().fieldErrors[field as string]

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError,
    }))
  }

  const handleChange = (field: keyof Entity, value: any) => {
    validateField(field, value)
  }

  const validateForm = (data: Partial<Entity>) => {
    const result = entityZodSchema.safeParse(data)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as EntityZodErrors<Entity>)
      return false
    }
    setErrors(null)
    return true
  }

  return { errors, setErrors, handleChange, hasErrors, validateForm }
}
