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

// removed collenctionName, collectionId, flip, hflip, vflip, downloadUrl 6:48 01/07/25
// removed url, iconName, size, rotate - 01/10/25
export const iconManagerSchema = z.object({
  icon: z.string(),
  metadata: z.object({
    inlineSvg: z.string().optional(),
    color: iconManagerColorSchema.optional(),
  }),
})

export type IconManagerType = z.infer<typeof iconManagerSchema>

export const iconManagerPartialSchema = iconManagerSchema
  .deepPartial()
  .extend({ _type: z.literal('icon.manager') })

export type IconManagerPartialType = z.infer<typeof iconManagerPartialSchema>
