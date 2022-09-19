import ViewType from "@/constant/UI";

interface IState {
  viewType: ViewType;
}
export const state = (): IState => ({
  viewType: ViewType.SQUARE,
});

export const mutations = {
  changeView(state: IState, viewType: ViewType) {
    state.viewType = viewType;
  },
};
