import type { ReferredScript } from '../types';

export const state = () => ({
  referredScripts: [] as ReferredScript[],
});

export const mutations = {
  setReferredScripts(state: { referredScripts: ReferredScript[]; }, next: ReferredScript[]) {
      state.referredScripts = next
  },
}