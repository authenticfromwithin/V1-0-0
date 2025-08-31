export type JourneyState = 'idle'|'walk'|'sit_pray'|'stretch'|'drink'|'pick_eat_fruit';

export function decideJourneyState(input: { intention?: 'reflect'|'move'|'pray'; mood?: number }): JourneyState{
  const m = input.mood ?? 0;
  if (input.intention === 'pray') return 'sit_pray';
  if (input.intention === 'move') return m > 0 ? 'walk' : 'stretch';
  // reflect
  return m < -0.5 ? 'pick_eat_fruit' : 'idle';
}


