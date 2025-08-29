
# Avatar Clip Matrix (Photoreal Video Rigs)

## Healing Rig
States (loops vs actions):
- **idle** (loop) → `/public/assets/avatars/healing/idle/{webm,mp4}/idle.{webm,mp4}`
- **walk** (loop) → `/public/assets/avatars/healing/walk/{webm,mp4}/walk.{webm,mp4}`
- **stretch** (action) → `/public/assets/avatars/healing/stretch/{webm,mp4}/stretch.{webm,mp4}`
- **drink** (action) → `/public/assets/avatars/healing/drink/{webm,mp4}/drink.{webm,mp4}`
- **sit_pray** (loop) → `/public/assets/avatars/healing/sit_pray/{webm,mp4}/sit_pray.{webm,mp4}`
- **pick_eat_fruit** (action) → `/public/assets/avatars/healing/pick_eat_fruit/{webm,mp4}/pick_eat_fruit.{webm,mp4}`

## Journey Rig
- **idle** (loop) → `/public/assets/avatars/journey/idle/{webm,mp4}/idle.{webm,mp4}`
- **walk** (loop) → `/public/assets/avatars/journey/walk/{webm,mp4}/walk.{webm,mp4}`
- **reflect** (action) → `/public/assets/avatars/journey/reflect/{webm,mp4}/reflect.{webm,mp4}`
- **read_devotional** (loop) → `/public/assets/avatars/journey/read_devotional/{webm,mp4}/read_devotional.{webm,mp4}`
- **pray** (loop) → `/public/assets/avatars/journey/pray/{webm,mp4}/pray.{webm,mp4}`
- **kneel** (action) → `/public/assets/avatars/journey/kneel/{webm,mp4}/kneel.{webm,mp4}`

**Encoding**
- Provide both: `webm (VP9)` and `mp4 (H.264/AVC)`.
- Trim to seamless loops; color grade consistent across states.
- Action clips return to prior or idle on complete; crossfade ~600–900ms.

**QA**
- No visible stutter on loop edges.
- Audio is not embedded (visual-only). Atmos is mixed separately.
