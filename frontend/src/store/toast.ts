import { defineStore } from 'pinia';

type ToastType = 'success' | 'warning' | 'error';

interface State {
  message: string;
  type: ToastType;
  visible: boolean;
  _t?: ReturnType<typeof setTimeout>;
}

export const useToastStore = defineStore('toast', {
  state: (): State => ({ message: '', type: 'success', visible: false }),
  actions: {
    show(message: string, type: ToastType = 'success') {
      this.message = message;
      this.type = type;
      this.visible = true;
      if (this._t) clearTimeout(this._t);
      this._t = setTimeout(() => (this.visible = false), 2000);
    },
  },
});
