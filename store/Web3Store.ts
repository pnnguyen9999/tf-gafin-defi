interface IState {
  checkAllowanceSingleToken: object;
}
export const state = (): IState => ({
  checkAllowanceSingleToken: {
    token: "",
    status: false,
  },
});

export const mutations = {
  setAllowanceSingleToken(
    state: IState,
    payload: { TOKEN_ADDRESS: string; status: boolean }
  ) {
    state.checkAllowanceSingleToken = {
      token: payload.TOKEN_ADDRESS,
      status: payload.status,
    };
  },
};
