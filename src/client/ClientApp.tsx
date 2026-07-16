import { useState } from "react";
import { Device } from "../components/Device";
import {
  TodayScreen,
  SearchScreen,
  FiltersScreen,
  ResultsScreen,
  ItemScreen,
  AroundItemScreen,
  BasketScreen,
  BuilderScreen,
  VoiceScreen,
} from "./screens";
import { PlannerScreen, InsightsScreen } from "./screens2";
import { ShareScreen, VotingScreen, ProfileScreen } from "./screens3";
import { BasketProvider } from "./basket";

export function ClientApp({ initial }: { initial?: string }) {
  const [screen, setScreen] = useState(initial ?? "today");
  const [arg, setArg] = useState<string>("");

  const nav = (s: string, a?: string) => {
    setScreen(s);
    if (a) setArg(a);
  };

  return (
    <BasketProvider>
      <Device>
        {screen === "today" && <TodayScreen nav={nav} />}
        {screen === "search" && <SearchScreen nav={nav} />}
        {screen === "filters" && <FiltersScreen nav={nav} />}
        {screen === "results" && <ResultsScreen nav={nav} />}
        {screen === "item" && <ItemScreen nav={nav} id={arg} />}
        {screen === "around" && <AroundItemScreen nav={nav} id={arg} />}
        {screen === "basket" && <BasketScreen nav={nav} />}
        {screen === "builder" && <BuilderScreen nav={nav} />}
        {screen === "builder-empty" && <BuilderScreen nav={nav} empty />}
        {screen === "builder-shuffle" && <BuilderScreen nav={nav} shuffle />}
        {screen === "voice" && <VoiceScreen nav={nav} />}
        {screen === "planner" && <PlannerScreen nav={nav} />}
        {screen === "insights" && <InsightsScreen nav={nav} />}
        {screen === "share" && <ShareScreen nav={nav} />}
        {screen === "voting" && <VotingScreen nav={nav} />}
        {screen === "profile" && <ProfileScreen nav={nav} />}
      </Device>
    </BasketProvider>
  );
}
