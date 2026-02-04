---
trigger: always_on
---

# Antigravity Rule: Components creation

1 - All React components uses typescript, if need styles uses css

2 - Always declare components using function, not const.

3 - Carefull with complexity, you might split work in another smaller components

4 - logic should be inside a customHook called use<ComponentName> inside a use<ComponentName>.ts

5 - Component file name should be formatted as <ComponentName>.ts
