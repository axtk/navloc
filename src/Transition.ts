export const Transition = {
    ASSIGN: 'assign',
    REPLACE: 'replace',
} as const;

export type TransitionType = typeof Transition[keyof typeof Transition];
