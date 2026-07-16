/* Lightweight outfit-basket state shared across client screens.
   The client adds pieces from item/wardrobe views, reviews the basket,
   adds a note to staff, and "creates" the outfit. */
import { createContext, useContext, useState, type ReactNode } from "react";

interface BasketCtx {
  items: string[];
  note: string;
  add: (id: string) => void;
  remove: (id: string) => void;
  setNote: (n: string) => void;
  clear: () => void;
}

const Ctx = createContext<BasketCtx | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  // seed with a couple of pieces so the demo basket isn't empty
  const [items, setItems] = useState<string[]>(["g1", "g3"]);
  const [note, setNote] = useState("");

  const add = (id: string) => setItems((s) => (s.includes(id) ? s : [...s, id]));
  const remove = (id: string) => setItems((s) => s.filter((x) => x !== id));
  const clear = () => setItems([]);

  return (
    <Ctx.Provider value={{ items, note, add, remove, setNote, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBasket() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBasket must be used within BasketProvider");
  return c;
}
