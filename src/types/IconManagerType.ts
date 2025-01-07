import { z } from 'zod'

export const iconManagerColorSchema = z
  .object({
    hex: z.string(),
    rgba: z.object({
      r: z.number(),
      g: z.number(),
      b: z.number(),
      a: z.number(),
    }),
  })
  .nullable()

export type IconManagerColor = z.infer<typeof iconManagerColorSchema>

export const iconManagerSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

export type IconManagerSize = z.infer<typeof iconManagerSizeSchema>

export const iconManagerSchema = z.object({
  icon: z.string(),
  metadata: z.object({
    url: z.string(),
    inlineSvg: z.string().optional(),
    iconName: z.string(),
    size: iconManagerSizeSchema,
    rotate: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
    color: iconManagerColorSchema.optional(),
  }),
})

export type IconManagerType = z.infer<typeof iconManagerSchema>

export const iconManagerPartialSchema = iconManagerSchema
  .deepPartial()
  .extend({ _type: z.literal('icon.manager') })

export type IconManagerPartialType = z.infer<typeof iconManagerPartialSchema>
