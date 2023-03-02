import ViewType from "@/constant/UI";
export enum ViewMode {
  FARMING = "FARMING",
  STAKING = "STAKING",
}
interface IState {
  viewType: ViewType;
  viewTypeStaking: ViewType;
  isLiveFarming: boolean;
  isLiveStaking: boolean;
  currentViewMode: ViewMode;
}
export const state = (): IState => ({
  viewType: ViewType.SQUARE,
  viewTypeStaking: ViewType.SQUARE,
  isLiveFarming: true,
  isLiveStaking: true,
  currentViewMode: ViewMode.FARMING,
});

export const mutations = {
  changeView(state: IState, viewType: ViewType) {
    state.viewType = viewType;
  },
  changeViewStaking(state: IState, viewType: ViewType) {
    state.viewTypeStaking = viewType;
  },
  switchLiveStatusFarming(state: IState, _isLiveFarming: boolean) {
    state.isLiveFarming = _isLiveFarming;
  },
  switchLiveStatusStaking(state: IState, _isLiveFarming: boolean) {
    state.isLiveStaking = _isLiveFarming;
  },
  switchViewMode(state: IState, _currentViewMode: ViewMode) {
    state.currentViewMode = _currentViewMode;
  },
};
