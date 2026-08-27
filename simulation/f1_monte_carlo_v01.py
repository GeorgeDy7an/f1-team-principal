"""Extremely lightweight F1 season Monte Carlo simulator (V0.1).

No lap simulation. A race is strength + noise + optional event effects + DNF.
Run: python f1_monte_carlo_v01.py --seasons 10000 --seed 2026
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import random
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

POINTS = (25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
RACES = 24
EVENT_PROBS = (("Normal", .80), ("Eventful", .17), ("Chaos", .03))
LABELS = {
    "Eventful": ("Changeable Conditions", "Late Safety Car", "Opening Lap Incident", "Strategy Gamble"),
    "Chaos": ("Changeable Conditions", "Red Flag", "Multi-car Incident", "Strategy Gamble"),
}

@dataclass(frozen=True)
class Car:
    team: str; performance: int; reliability: int; tyre: int

@dataclass(frozen=True)
class Driver:
    name: str; team: str; pace: int; racecraft: int; consistency: int; tyre_mgmt: int
    @property
    def rating(self):
        return .50*self.pace + .25*self.racecraft + .15*self.consistency + .10*self.tyre_mgmt

CARS = {
    c.team: c for c in (
        Car("Mercedes",96,90,88), Car("Ferrari",93,87,90), Car("McLaren",89,92,95),
        Car("Red Bull",86,85,84), Car("Racing Bulls",75,88,80), Car("Alpine",73,83,82),
        Car("Haas",66,84,74), Car("Audi",63,82,76), Car("Williams",61,80,72),
        Car("Aston Martin",55,81,79), Car("Cadillac",50,77,69))
}

DRIVERS = [
    Driver("Max Verstappen","Red Bull",97,97,95,92), Driver("Kimi Antonelli","Mercedes",95,88,96,72),
    Driver("Charles Leclerc","Ferrari",94,90,79,80), Driver("George Russell","Mercedes",93,91,88,89),
    Driver("Lewis Hamilton","Ferrari",92,94,93,93), Driver("Lando Norris","McLaren",91,89,90,87),
    Driver("Oscar Piastri","McLaren",88,86,84,81), Driver("Fernando Alonso","Aston Martin",86,93,91,94),
    Driver("Pierre Gasly","Alpine",84,80,86,83), Driver("Isack Hadjar","Red Bull",81,78,77,69),
    Driver("Liam Lawson","Racing Bulls",80,76,80,68), Driver("Carlos Sainz","Williams",78,83,82,85),
    Driver("Alexander Albon","Williams",76,72,75,74), Driver("Oliver Bearman","Haas",74,67,68,66),
    Driver("Arvid Lindblad","Racing Bulls",72,65,63,60), Driver("Esteban Ocon","Haas",70,74,73,78),
    Driver("Gabriel Bortoleto","Audi",68,64,65,64), Driver("Nico Hulkenberg","Audi",67,69,71,70),
    Driver("Franco Colapinto","Alpine",65,62,61,62), Driver("Valtteri Bottas","Cadillac",63,66,67,76),
    Driver("Sergio Perez","Cadillac",61,70,70,95), Driver("Lance Stroll","Aston Martin",58,59,58,58),
]

def choose_event(rng):
    x = rng.random(); total = 0
    for name, p in EVENT_PROBS:
        total += p
        if x < total: return name
    return "Chaos"

def weighted_sample_without_replacement(items, weights, k, rng):
    pool, ws, out = list(items), list(weights), []
    for _ in range(min(k, len(pool))):
        pick = rng.choices(range(len(pool)), weights=ws, k=1)[0]
        out.append(pool.pop(pick)); ws.pop(pick)
    return out

def simulate_race(rng, season_frailty, season_team_form):
    event = choose_event(rng)
    noise_sd = {"Normal":2.25, "Eventful":5.5, "Chaos":9.5}[event]
    scores = {}
    for d in DRIVERS:
        car = CARS[d.team]
        # Performance defines car class; tyre efficiency is only a small race-day correction.
        car_score = car.performance + season_team_form[d.team] + .06*(car.tyre-80)
        base = .65*car_score + .35*d.rating
        consistency_scale = 1 + (80-d.consistency)*.007
        score = base + rng.gauss(0, noise_sd*consistency_scale)
        if event != "Normal" and rng.random() < ({"Eventful":.20,"Chaos":.38}[event]):
            score += rng.gauss(0, 5 if event == "Eventful" else 9)
        scores[d] = score

    # DNF totals match the agreed race bands; selection mixes incidents and reliability.
    dnf_n = rng.choices(
        {"Normal":(0,1,2),"Eventful":(1,2,3,4),"Chaos":(3,4,5,6,7)}[event],
        weights={"Normal":(35,48,17),"Eventful":(15,38,32,15),"Chaos":(10,22,30,23,15)}[event], k=1)[0]
    dnf_weights = []
    for d in DRIVERS:
        car = CARS[d.team]
        mechanical = .45 + (95-car.reliability)*.055
        incident = .65 + (90-d.consistency)*.018
        dnf_weights.append((mechanical+incident)*season_frailty[d.name])
    dnfs = set(weighted_sample_without_replacement(DRIVERS, dnf_weights, dnf_n, rng))
    finishers = sorted((d for d in DRIVERS if d not in dnfs), key=scores.get, reverse=True)

    # Rare-result valves: weighted candidates, never a random P11-P22 winner.
    upset = None
    if event in ("Eventful", "Chaos") and rng.random() < ({"Eventful":.035,"Chaos":.21}[event]):
        mids = [d for d in finishers if 70 <= CARS[d.team].performance <= 79]
        if mids:
            winner = rng.choices(mids, weights=[max(1, scores[d]-55)**2 for d in mids], k=1)[0]
            finishers.remove(winner); finishers.insert(0,winner); upset = "midfield"
    # Bottom-team miracles are deliberately independent and extremely rare.
    if event == "Chaos" and rng.random() < .070:
        tails = [d for d in finishers if CARS[d.team].performance < 70]
        if tails:
            winner = rng.choices(tails, weights=[max(1, scores[d]-45)**3 for d in tails], k=1)[0]
            finishers.remove(winner); finishers.insert(0,winner); upset = "tail"
    return event, (None if event == "Normal" else rng.choice(LABELS[event])), finishers, dnfs, upset

def simulate_season(rng, keep_races=False):
    points=Counter(); wins=Counter(); podiums=Counter(); dnfs=Counter(); events=Counter(); upsets=Counter(); actual_upset_wins=Counter(); logs=[]
    # Persistent season frailty creates 0-DNF drivers and occasional 4+ DNF drivers.
    frailty={d.name: math.exp(rng.gauss(-.10,.48)) for d in DRIVERS}
    # A small shared, season-long car-development/form outcome. This preserves the
    # database hierarchy but gives close rivals a real championship tail. In the
    # game, player decisions can add to or subtract from this value.
    season_team_form={team:rng.gauss(0,1.25) for team in CARS}
    for rnd in range(1,RACES+1):
        event,label,finishers,retired,upset=simulate_race(rng,frailty,season_team_form)
        events[event]+=1
        if upset: upsets[upset]+=1
        winner_perf=CARS[finishers[0].team].performance
        if 70 <= winner_perf <= 79: actual_upset_wins["midfield"]+=1
        elif winner_perf < 70: actual_upset_wins["tail"]+=1
        for pos,d in enumerate(finishers):
            if pos < 10: points[d.name]+=POINTS[pos]
            if pos == 0: wins[d.name]+=1
            if pos < 3: podiums[d.name]+=1
        for d in retired: dnfs[d.name]+=1
        if keep_races: logs.append({"round":rnd,"event":event,"label":label,"winner":finishers[0].name,"winner_team":finishers[0].team,"dnfs":[d.name for d in retired]})
    order=sorted(DRIVERS,key=lambda d:(points[d.name],wins[d.name]),reverse=True)
    teams=Counter()
    for d in DRIVERS: teams[d.team]+=points[d.name]
    return {"points":points,"wins":wins,"podiums":podiums,"dnfs":dnfs,"events":events,"upsets":upsets,"actual_upset_wins":actual_upset_wins,"order":order,"teams":teams,"logs":logs}

def aggregate(seasons, seed):
    rng=random.Random(seed); sums={k:Counter() for k in ("points","wins","podiums","dnfs")}
    champ=Counter(); team_champ=Counter(); upset_seasons=Counter(); event_totals=Counter(); sample=None
    for i in range(seasons):
        s=simulate_season(rng, keep_races=(i==0)); sample=sample or s
        for k in sums: sums[k].update(s[k])
        champ[s["order"][0].name]+=1
        tc=max(s["teams"],key=s["teams"].get); team_champ[tc]+=1
        event_totals.update(s["events"])
        if s["actual_upset_wins"]["midfield"]: upset_seasons["midfield"]+=1
        if s["actual_upset_wins"]["tail"]: upset_seasons["tail"]+=1
    rows=[]
    for d in sorted(DRIVERS,key=lambda x:sums["points"][x.name],reverse=True):
        rows.append({"driver":d.name,"team":d.team,"avg_points":sums["points"][d.name]/seasons,
            "avg_wins":sums["wins"][d.name]/seasons,"avg_podiums":sums["podiums"][d.name]/seasons,
            "avg_dnfs":sums["dnfs"][d.name]/seasons,"title_pct":100*champ[d.name]/seasons})
    team_rows=[]
    for team in CARS:
        ds=[d for d in DRIVERS if d.team==team]
        team_rows.append({"team":team,"avg_points":sum(sums["points"][d.name] for d in ds)/seasons,
            "title_pct":100*team_champ[team]/seasons})
    team_rows.sort(key=lambda x:x["avg_points"],reverse=True)
    summary={"seasons":seasons,"seed":seed,"races_per_season":RACES,
        "event_pct":{k:100*v/(seasons*RACES) for k,v in event_totals.items()},
        "midfield_win_season_pct":100*upset_seasons["midfield"]/seasons,
        "tail_win_season_pct":100*upset_seasons["tail"]/seasons,
        "seasons_per_midfield_win_season":seasons/max(1,upset_seasons["midfield"]),
        "seasons_per_tail_win_season":seasons/max(1,upset_seasons["tail"]),
        "avg_dnf_per_driver":sum(sums["dnfs"].values())/(seasons*len(DRIVERS))}
    return rows,team_rows,summary,sample

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--seasons",type=int,default=10000); ap.add_argument("--seed",type=int,default=2026); ap.add_argument("--out",default=None)
    a=ap.parse_args(); out=Path(a.out) if a.out else Path(__file__).with_name("simulation_results")
    out.mkdir(parents=True,exist_ok=True); rows,teams,summary,sample=aggregate(a.seasons,a.seed)
    for name,data in (("drivers.csv",rows),("teams.csv",teams)):
        with (out/name).open("w",newline="",encoding="utf-8-sig") as f:
            w=csv.DictWriter(f,fieldnames=data[0].keys()); w.writeheader(); w.writerows(data)
    (out/"summary.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf-8")
    (out/"sample_season.json").write_text(json.dumps(sample["logs"],ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({"top_drivers":rows[:10],"teams":teams,"summary":summary},ensure_ascii=False,indent=2))

if __name__ == "__main__": main()
