interface IState {
  isCompleted: boolean;
}
export const state = (): IState => ({
  isCompleted: false,
});

export const mutations = {
  setCompleteStatus(state: IState, _isCompleted: boolean) {
    state.isCompleted = _isCompleted;
  },
};
