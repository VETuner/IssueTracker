# VETuner Issue Tracker

A public place to raise bugs, ask questions and suggest features for
[vetuner.co.uk](https://vetuner.co.uk).

This is an **intake point**, not the project backlog. Issues raised here are
reviewed and, where they need engineering work, transferred into the main
development tracker. You may see an issue close here with a link to where the
work continues — that is normal, not a dismissal.

## Reporting a bug

**If the app runs, please use the in-app "Report Bug" button instead.**

It attaches your ECU signature, INI file, diagnostics snapshot, console log and
a screenshot automatically, and delivers them privately. That is dramatically
more useful than anything you can paste into a web form, and it usually saves a
round of "can you send me your INI?".

Use this tracker when:

- you want a **public** discussion, so others can follow or contribute
- you need to **attach files** yourself (datalogs, tunes, screenshots)
- the app **will not start**, so the in-app button is unavailable
- you have a **question** rather than a defect

## What makes a useful report

The single most useful thing you can include is **the exact INI and firmware
signature** you are running — for example `speeduino 202501` or
`MS3 Format 0601.16`. Behaviour differs between definitions, and a report
without one often cannot be reproduced.

After that, in rough order of value:

1. **Steps to reproduce**, if the problem is repeatable
2. **How you connect** — USB (WebSerial on desktop), USB (WebUSB on Android),
   or Bluetooth. Connection problems behave very differently on each.
3. **The build you are on** — the short commit hash shown in the footer
4. **Browser and OS**
5. **Screenshots of the whole window**, not crops — surrounding state often
   explains the symptom

## Please do not paste

- Your full MSQ or INI **inline** — attach it as a file instead, and remove
  anything you would not want public. Tunes can contain location names, vehicle
  details or notes.
- Passwords, API keys, or session tokens.
- Personal data that is not needed to reproduce the problem.

If you would rather not share something publicly, use the in-app reporter — it
delivers the same information privately.

## What to expect

This is a small project. Issues are triaged when time allows; a considered reply
may take a while, and a fix longer. Clear reports genuinely get looked at
sooner.

Feature requests are welcome, but please describe the **problem** you are trying
to solve. It usually leads somewhere better than a prescribed solution.
