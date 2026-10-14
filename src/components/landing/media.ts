import { placeholderPhoto } from "@/lib/placeholder";

/**
 * Landing imagery. Placeholders until the Figma assets are exported into
 * public/images/landing/ (swap each entry for its local path).
 */
export const LANDING_MEDIA = {
  hero: placeholderPhoto("hero-crew", 1920, 1280),
  lookingFor: [
    placeholderPhoto("theatre", 640, 720),
    placeholderPhoto("camera-operator", 640, 720),
    placeholderPhoto("street", 640, 720),
  ],
  offer: {
    location: placeholderPhoto("offer-location", 900, 1040),
    gear: placeholderPhoto("offer-gear", 900, 1040),
    talent: placeholderPhoto("offer-talent", 900, 1040),
  },
  planner: {
    cover: placeholderPhoto("fashion-hall", 1400, 500),
    location: placeholderPhoto("req-location", 400, 220),
    camera: placeholderPhoto("req-camera", 400, 220),
    lenses: placeholderPhoto("req-lenses", 400, 220),
    lighting: placeholderPhoto("req-lighting", 400, 220),
    audio: placeholderPhoto("req-audio", 400, 220),
    cast: placeholderPhoto("req-cast", 400, 220),
  },
  provider: placeholderPhoto("provider-market", 1920, 1200),
  about: placeholderPhoto("about-crew", 1200, 1500),
  cta: placeholderPhoto("cta-texture", 1600, 700),
} as const;
