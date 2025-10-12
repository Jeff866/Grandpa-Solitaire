
import React from "react";
import { create } from "zustand";
import seedrandom from "seedrandom";
import { nanoid } from "nanoid";

import { Button } from "@/components/ui/button";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SUITS = ["♠","♥","♦","♣"];
const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const suitColor = (s) => (s === "♥" || s === "♦" ? "red" : "black");

function makeDeck(deckNo) {
  const cards = [];
  for (const s of SUITS) for (const r of RANKS)
    cards.push({ id: `${deckNo}-${s}-${r}-${nanoid(6)}`, suit: s, rank: r, color: suitColor(s), faceUp: false, deckNo });
  return cards;
}
function shuffle(arr, seed = "") {
  const rng = seedrandom(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function rankIndex(r) { return RANKS.indexOf(r); }
function clonePile(p) { return { ...p, cards: p.cards.map(c => ({ ...c })) }; }

function canPlaceInAscending(card, piles) {
  const lane = piles.filter(p => p.id.startsWith(`score-up-${card.suit}-`)).sort((a,b)=>a.label.localeCompare(b.label));
  const idx = lane.findIndex(p => p.cards.length === 0);
  if (idx === -1) return null;
  const need = RANKS[idx];
  return card.rank === need ? lane[idx].id : null;
}
function canPlaceInDescending(card, piles) {
  const lane = piles.filter(p => p.id.startsWith(`score-down-${card.suit}-`)).sort((a,b)=>a.label.localeCompare(b.label));
  const idx = lane.findIndex(p => p.cards.length === 0);
  if (idx === -1) return null;
  const need = RANKS[12 - idx];
  return card.rank === need ? lane[idx].id : null;
}
function nextScoreTargetId(card, piles) { return canPlaceInAscending(card, piles) || canPlaceInDescending(card, piles); }
function isVictory(piles) {
  let full = 0;
  for (const s of SUITS) {
    const upFull = RANKS.every((_,i)=> (piles.find(p=>p.id===`score-up-${s}-${i}`)?.cards.length||0)===1); if (upFull) full++;
    const dnFull = RANKS.every((_,i)=> (piles.find(p=>p.id===`score-down-${s}-${i}`)?.cards.length||0)===1); if (dnFull) full++;
  }
  return full === 8;
}

function dealNewGame() {
  const shuffled = shuffle([...makeDeck(1), ...makeDeck(2)], "fresh-seed");
  const piles = [];
  piles.push({ id: "stock", type: "stock", label: "Stock", cards: shuffled.map(c => ({...c, faceUp:false})) });
  piles.push({ id: "waste", type: "waste", label: "Waste", cards: [] });
  for (let i=0;i<13;i++) piles.push({ id: `count-${i}`, type: "count", label: RANKS[i], cards: [] });
  piles.push({ id: "penalty", type: "penalty", label: "Face-down pile", cards: [] });
  for (const s of SUITS) for (let i=0;i<13;i++) piles.push({ id: `score-up-${s}-${i}`, type: "foundation", label: `${s} ↑ ${RANKS[i]}`, cards: [] });
  for (const s of SUITS) for (let i=0;i<13;i++) piles.push({ id: `score-down-${s}-${i}`, type: "foundation", label: `${s} ↓ ${RANKS[12-i]}`, cards: [] });
  return { piles, phase:"deal", round:0, countIndex:0, hand:[], handSourcePileId:null, showIntro:true, finalPileIndex:0 };
}

const useGame = create((set,get)=>({
  ...dealNewGame(),
  reset: ()=> set(s=>dealNewGame()),
  dismissIntro: ()=> set({ showIntro:false }),

  countingDealOne: ()=> set((s)=>{
    if (s.phase!=="deal") return s;
    const piles = s.piles.map(clonePile);
    const stock = piles.find(p=>p.id==="stock"); if (!stock || !stock.cards.length) return s;
    const card = stock.cards.pop();
    const idx = s.countIndex;
    const target = piles.find(p=>p.id===`count-${idx}`);
    const placed = { ...card, faceUp:true }; target.cards.push(placed);
    let penaltyAdd = 0;
    if (placed.rank === RANKS[idx]) penaltyAdd += 2;
    if (placed.rank === "A") penaltyAdd += 1;
    const penalty = piles.find(p=>p.id==="penalty");
    for (let k=0;k<penaltyAdd;k++) if (stock.cards.length) penalty.cards.push({ ...stock.cards.pop(), faceUp:false });
    const next = (s.countIndex+1)%13; let ns = { ...s, piles, countIndex: next };
    if (next===0 && stock.cards.length) penalty.cards.push({ ...stock.cards.pop(), faceUp:false });
    if (stock.cards.length===0) ns.phase = "setup";
    return ns;
  }),
  countingDealRound: ()=> { for (let i=0;i<13;i++){ const before=useGame.getState(); useGame.setState(st=>useGame.getState().countingDealOne()); const after=useGame.getState(); if (after===before||after.phase!=="deal") break; } },
  finishDealingEnterSetup: ()=> set(s=>({ ...s, phase:"setup" })),

  startRound: ()=> set((s)=>{
    if (s.phase!=="setup" && s.phase!=="round") return s;
    const piles = s.piles.map(clonePile);
    const penalty = piles.find(p=>p.id==="penalty");
    if (!penalty || !penalty.cards.length) return { ...s, phase:"final", finalPileIndex:0 };
    const flip = { ...penalty.cards.pop(), faceUp:true };
    const rIdx = RANKS.indexOf(flip.rank);
    const pile = piles.find(p=>p.id===`count-${rIdx}`);
    const hand = pile.cards.slice(); pile.cards = [];
    return { ...s, piles, phase:"round", round:s.round+1, hand, handSourcePileId:`count-${rIdx}` };
  }),
  endRound: ()=> set((s)=>{
    if (s.phase!=="round") return s;
    const piles = s.piles.map(clonePile);
    if (s.handSourcePileId) { const p = piles.find(pp=>pp.id===s.handSourcePileId); if (p) p.cards = s.hand.slice(); }
    const penalty = piles.find(p=>p.id==="penalty");
    const nextPhase = (penalty && penalty.cards.length===0) ? "final" : "round";
    return { ...s, piles, hand:[], handSourcePileId:null, phase: nextPhase };
  }),

  playFromHand: (i)=> set((s)=>{
    if ((s.phase!=="round" && s.phase!=="final") || i<0 || i>=s.hand.length) return s;
    const piles = s.piles.map(clonePile);
    const card = s.hand[i];
    const tId = nextScoreTargetId(card, piles); if (!tId) return s;
    piles.find(p=>p.id===tId).cards.push({ ...card, faceUp:true });
    const hand = s.hand.slice(0,i).concat(s.hand.slice(i+1));
    return { ...s, piles, hand };
  }),
  playTopOfCountPile: (rankIdx)=> set((s)=>{
    if (s.phase!=="round" && s.phase!=="final") return s;
    const piles = s.piles.map(clonePile);
    const pile = piles.find(p=>p.id===`count-${rankIdx}`);
    if (!pile || !pile.cards.length) return s;
    const card = pile.cards[pile.cards.length-1]; if (!card.faceUp) return s;
    const tId = nextScoreTargetId(card, piles); if (!tId) return s;
    piles.find(p=>p.id===tId).cards.push({ ...card, faceUp:true });
    pile.cards = pile.cards.slice(0,-1);
    return { ...s, piles };
  }),

  startFinalPile: ()=> set((s)=>{
    if (s.phase!=="final") return s;
    const piles = s.piles.map(clonePile);
    let i=s.finalPileIndex; for (; i<13; i++){ const p = piles.find(pp=>pp.id===`count-${i}`); if (p && p.cards.length) break; }
    if (i>=13) return s;
    const pile = piles.find(pp=>pp.id===`count-${i}`);
    const hand = pile.cards.slice(); pile.cards = [];
    return { ...s, piles, hand, handSourcePileId:`count-${i}`, finalPileIndex:i };
  }),
  endFinalPile: ()=> set((s)=>{
    if (s.phase!=="final") return s;
    const piles = s.piles.map(clonePile);
    if (s.handSourcePileId) { const p = piles.find(pp=>pp.id===s.handSourcePileId); if (p) p.cards = s.hand.slice(); }
    let i=s.finalPileIndex+1; for (; i<13; i++){ const p = piles.find(pp=>pp.id===`count-${i}`); if (p && p.cards.length) break; }
    return { ...s, piles, hand:[], handSourcePileId:null, finalPileIndex:i };
  }),
}));

function PlayingCard({ card }) {
  return (
    <div className={`w-16 h-24 rounded-2xl shadow-sm border flex items-center justify-center text-xl font-semibold select-none ${card.faceUp ? (card.color==="red" ? "bg-white text-red-600" : "bg-white text-black") : "bg-slate-800 text-slate-200"}`}>
      {card.faceUp ? (
        <div className="w-full h-full p-2 relative">
          <div className="absolute top-1 left-2 text-sm">{card.rank}</div>
          <div className="absolute bottom-1 right-2 text-sm">{card.suit}</div>
          <div className="flex items-center justify-center h-full text-3xl">{card.suit}</div>
        </div>
      ) : (
        <div className="w-full h-full grid place-items-center">
          <div className="w-10 h-14 border-2 border-dashed rounded-xl" />
        </div>
      )}
    </div>
  );
}
function PileView({ pile }) {
  return (
    <div className="relative w-16 sm:w-20 md:w-24 min-h-[6rem] md:min-h-[8rem] rounded-2xl border-2 border-dashed p-1 border-slate-300">
      <div className="relative w-full h-full min-h-[96px] grid place-items-center">
        {pile.cards.length ? <PlayingCard card={pile.cards[pile.cards.length - 1]} /> : <span className="text-xs text-slate-400">{pile.label}</span>}
      </div>
      {pile.type === "penalty" && (<div className="absolute -top-2 -right-2 text-[10px] bg-slate-900 text-white rounded-full px-2 py-0.5">{pile.cards.length}</div>)}
    </div>
  );
}

function IntroRulesModal() {
  const open = useGame(s=>s.showIntro);
  const dismiss = () => useGame.getState().dismissIntro();
  return (
    <Dialog open={open} onOpenChange={(v)=>{ if(!v) dismiss(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Solitaire 104 — How to Play</DialogTitle></DialogHeader>
        <div className="space-y-4 text-sm text-slate-700">
          <section><h3 className="font-medium">Deck & Layout</h3><ul className="list-disc ml-5">
            <li>Two standard decks (104 cards).</li>
            <li>13 face-up dealt piles labeled A,2,…,K.</li>
            <li>One face-down discard pile (built during dealing).</li>
            <li>8 scoring rows by suit: 4 ascending (A→K) and 4 descending (K→A).</li>
          </ul></section>
          <section><h3 className="font-medium">Dealing (A→K with penalties)</h3><ul className="list-disc ml-5">
            <li>Deal face-up onto A,2,…,K in order.</li>
            <li>If rank matches the pile label: add two face-down to the discard.</li>
            <li>If an Ace is dealt: add one face-down to the discard.</li>
            <li>At the end of each 13-card round: add one more face-down to the discard.</li>
          </ul></section>
          <section><h3 className="font-medium">Setup (optional)</h3><p>After dealing, you may start the 8 suit scoring rows by dragging eligible cards.</p></section>
          <section><h3 className="font-medium">Rounds</h3><ul className="list-disc ml-5">
            <li>Flip the top of the face-down discard; its rank selects the matching dealt pile.</li>
            <li>Pick up that entire pile into your Hand (order locked).</li>
            <li>Play any/none from Hand to scoring rows; also play top cards from other piles.</li>
            <li>End the round to return any unplayed Hand cards back to their dealt pile (same order).</li>
          </ul></section>
          <section><h3 className="font-medium">Final Round</h3><p>When the discard is empty, go pile-by-pile A→K: pick up, make plays, return, next pile.</p></section>
          <section><h3 className="font-medium">Win / Lose</h3><p><b>Win</b> if all 8 suit scoring rows are complete. Otherwise, you <b>lose</b>. No points.</p></section>
        </div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={dismiss}>Start Game</Button></div>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const s = useGame();
  const piles = s.piles;
  const stock = piles.find(p=>p.id==="stock"); const waste = piles.find(p=>p.id==="waste"); const penalty = piles.find(p=>p.id==="penalty");
  const countPiles = RANKS.map((_,i)=>piles.find(p=>p.id===`count-${i}`));
  const completeFinal = s.phase==="final" && s.hand.length===0 && s.finalPileIndex>=13;
  const victory = completeFinal && isVictory(piles);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <UICard className="px-3 py-2">
            <div className="font-bold">Solitaire 104</div>
            <div className="text-xs text-slate-500">Two decks • Counting deal • A→K piles</div>
          </UICard>
          {victory && <span className="text-emerald-700 text-sm font-semibold">You Win!</span>}
        </div>
        <div className="flex items-center gap-2"><Button variant="outline" onClick={s.reset}>New Deal</Button></div>
      </header>

      <div className="mt-6 space-y-3">
        <UICard><CardContent className="p-3 flex flex-wrap items-center gap-3">
          <div className="text-sm">Phase: <b>{s.phase}</b>{s.phase!=="deal" && <span className="ml-2 text-xs text-slate-500">Round: {s.round}</span>}</div>
          {s.phase==="deal" && (<><Button size="sm" variant="outline" onClick={s.countingDealOne}>Deal one</Button><Button size="sm" variant="outline" onClick={s.countingDealRound}>Deal a round (13)</Button><Button size="sm" onClick={s.finishDealingEnterSetup}>Finish dealing → Setup</Button><div className="text-xs text-slate-500">Stock: {stock?.cards.length??0} • Discard: {penalty?.cards.length??0}</div></>)}
          {s.phase==="setup" && (<><div className="text-xs text-slate-500">Drag from A..K piles to start suit scoring rows if you like.</div><Button size="sm" onClick={s.startRound}>Start Round</Button></>)}
          {s.phase==="round" && (<><div className="text-xs text-slate-500">Play from Hand and top cards of other piles into scoring rows.</div><Button size="sm" variant="outline" onClick={s.endRound}>End Round</Button><Button size="sm" onClick={s.startRound}>Next Round</Button></>)}
          {s.phase==="final" && (<><div className="text-xs text-slate-500">Final Round: work through A→K piles.</div><Button size="sm" variant="outline" onClick={s.startFinalPile}>Start/Next Pile</Button><Button size="sm" onClick={s.endFinalPile}>End This Pile</Button></>)}
        </CardContent></UICard>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-3">
          {countPiles.map((cp, i) => (
            <UICard key={cp.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-slate-500">{cp.label}</div>
                  {(s.phase==="round" || s.phase==="final") && (<Button size="xs" variant="ghost" onClick={()=>s.playTopOfCountPile(i)}>Play top</Button>)}
                </div>
                <PileView pile={cp} />
              </CardContent>
            </UICard>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-xl">
          <UICard><CardContent className="p-3"><div className="text-xs text-slate-500 mb-1">Stock (dealing)</div><PileView pile={stock} /></CardContent></UICard>
          <UICard><CardContent className="p-3"><div className="text-xs text-slate-500 mb-1">Face-down pile (rounds)</div><PileView pile={penalty} /></CardContent></UICard>
          <UICard><CardContent className="p-3"><div className="text-xs text-slate-500 mb-1">(Unused) Waste</div><PileView pile={waste} /></CardContent></UICard>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-1">Scoring: Ascending (A→K) by suit</div>
          <div className="grid grid-cols-13 gap-2">{["♠","♥","♦","♣"].map(suit => RANKS.map((_,i)=>(<PileView key={`up-${suit}-${i}`} pile={piles.find(p=>p.id===`score-up-${suit}-${i}`)} />)))}</div>
          <div className="text-xs text-slate-500 mt-4 mb-1">Scoring: Descending (K→A) by suit</div>
          <div className="grid grid-cols-13 gap-2">{["♠","♥","♦","♣"].map(suit => RANKS.map((_,i)=>(<PileView key={`down-${suit}-${i}`} pile={piles.find(p=>p.id===`score-down-${suit}-${i}`)} />)))}</div>
        </div>

        {(s.phase==="round" || s.phase==="final") && (
          <UICard className="max-w-4xl">
            <CardContent className="p-3">
              <div className="text-sm font-medium mb-2">Hand (picked-up pile)</div>
              <div className="flex flex-wrap gap-2">
                {s.hand.length===0 && <div className="text-xs text-slate-500">(Empty)</div>}
                {s.hand.map((c, idx)=>(
                  <div key={c.id} className="flex flex-col items-center gap-1">
                    <PlayingCard card={{...c, faceUp:true}} />
                    <Button size="xs" variant="outline" onClick={()=>useGame.getState().playFromHand(idx)}>Play</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </UICard>
        )}
      </div>

      {s.phase && <IntroRulesModal />}

      {(() => {
        const show = completeFinal;
        const [dismissed, setDismissed] = React.useState(false);
        const open = show && !dismissed;
        return (
          <Dialog open={open} onOpenChange={(v)=> { if (!v) setDismissed(true); }}>
            <DialogContent className="max-w-sm text-center">
              <DialogHeader>
                <DialogTitle className={`text-2xl ${victory ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {victory ? 'You Win!' : 'You Lose'}
                </DialogTitle>
              </DialogHeader>
              <div className="text-sm text-slate-600">
                {victory ? 'All 8 scoring suits are complete.' : 'Not all 8 scoring suits were completed.'}
              </div>
              <div className="flex justify-center gap-2 pt-3">
                <Button variant="outline" onClick={() => setDismissed(true)}>Watch Board</Button>
                <Button onClick={() => useGame.getState().reset()}>New Deal</Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}

      <footer className="mt-8 text-xs text-slate-400">Solitaire 104 • counting deal • A→K piles • final pass A→K • win by completing all 8 suit rows.</footer>
    </div>
  );
}
