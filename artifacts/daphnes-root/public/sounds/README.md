# Daphne's Root — Sound Files

Drop your `.mp3`, `.ogg`, or `.wav` files here.

Then open `src/config/soundConfig.ts` and set the `src` field
for the event you want to play it on. That file has full instructions.

## Sound Events

| Event key        | When it fires                                    |
|------------------|--------------------------------------------------|
| `click`          | Every sprite click (can be rapid — keep volume low) |
| `upgrade`        | Any upgrade purchased (unless overridden)        |
| `refugit`        | The Refugit (heat-pushback) upgrade is purchased |
| `heatWarning`    | Heat first crosses the penalty threshold (75%)   |
| `heatPenaltyLoop`| Repeats every 8 s while heat stays above 75%     |
| `heatDanger`     | Heat enters the danger zone (90%+)               |
| `apolloAppears`  | Apollo becomes visible for the first time        |
| `triumph`        | The final upgrade is purchased — triumph screen  |
| `reset`          | Player resets / abandons the transformation      |

## Per-Upgrade Overrides

To give a specific line its own sound, add it to `UPGRADE_SOUND_OVERRIDES`
in `soundConfig.ts`:

```ts
"line_556": { src: "oscula.mp3", volume: 1.0, enabled: true },
```

## Tips

- Use short (< 2 s) one-shot clips for click / upgrade events.
- Keep `heatPenaltyLoop` subtle (volume ≤ 0.3) — it repeats.
- MP3 files compress well and are universally supported.
- Set `enabled: false` to mute any event without removing the filename.
- Set `SOUND_ENABLED = false` at the top of `soundConfig.ts` to mute everything.
