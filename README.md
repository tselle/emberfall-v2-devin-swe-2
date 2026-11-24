# Emberfall: The Emberwild Saga

A complete gold-box-style single-player party RPG that runs entirely in the
browser from `index.html` — no build step, no dependencies, vanilla JavaScript.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## Features

- **Raycast dungeon exploration** — software renderer, procedural wall
  textures, distance fog, billboard monsters/treasure/stairs, fog-of-war
  minimap and full-map screen.
- **Tactical combat** — 14×10 grid, initiative by DEX, move/attack/cast/item/
  flee, monster AI, spell effects, magic items, thief skills, lay on hands,
  turn undead, volley/hunt.
- **54 modules / 223 maps** — a 4-module hand-authored saga plus 50
  deterministically generated modules across 5 level bands (1–20).
- **Wilderness travel** — 1 tile = 1 mile, terrain costs, day/night cycle,
  randomized encounters, settlements, shrines, hermits, lairs.
- **Rules engine** — 4d6-drop-lowest ability scores, THAC0 vs descending AC,
  class groups (warrior/priest/thief/mage), spell slots by level, thief
  percentage skills, race/class/level restrictions.
- **Content** — ~400 monsters, ~75 spells, ~230 items (weapons, armor,
  potions, scrolls, wands, rods, staffs, orbs, ability books), shops, inns,
  temples, taverns, training halls.
- **Six pregens + hero creation** — human/dwarf/elf/gnome/half-elf/halfling,
  fighter/paladin/ranger/mage/cleric/thief with alignment rules.
- **Saves** — auto-save plus three manual slots in `localStorage`
  (`emberfall.save.auto`, `.1`, `.2`, `.3`).
- **Touch controls** — optional on-screen navpad.

## Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move forward |
| S / ↓ | Move back |
| A / ← , D / → | Turn left / right |
| Q / E | Strafe |
| F | Search (secret doors, traps) |
| R | Rest |
| P | Party drawer |
| M / J / B | Map / Journal / Bestiary |
| Esc | Menu |

In combat: click a tile to move (when prompted), click an enemy to attack,
Space = end turn, Q = auto-battle.

On the road: arrow keys or the navpad move N/S/E/W and diagonals.

## Layout

```
index.html          entry point (loads all scripts in order)
css/style.css       UI styling
js/rules.js         dice, races, classes, XP, THAC0, saves, slots, creation
js/data.js          items, spells, monsters, saga maps, quests, pregens
js/modules.js       module + campaign definitions
js/monsters.js      extended bestiary + leader name pools
js/wilds.js         wilderness encounter tables and site data
js/treasure.js      seeded weighted treasure generator
js/adventures.js    deterministic 50-module generator
js/figures.js       procedural figure/portrait rendering
js/view3d.js        raycaster renderer + minimap
js/ui.js            DOM screens, sheets, shops, services
js/combat.js        tactical battle engine
js/overland.js      wilderness map & travel
js/campaign.js      module transitions, quests, leveling, services
js/journal.js       quest log & rumors
js/map.js           full-screen maps
js/bestiary.js      monster encyclopedia
js/navpad.js        touch controls
js/watch.js         real-time day/night cycle
js/game.js          state, save/load, input, bootstrap
```

## License

MIT — see `LICENSE`.
