# Design · Pokémon Sprite Gallery

沿用 warm editorial 色彩、现有 Tailwind CSS 4 与 global.css 主题角色、像素图原比例、明显的可交互及选中反馈。保留语言切换、焦点与 reduced-motion 行为的检查，不把未实测改进写成已交付。

**Executable owner:** [global.css](../../src/styles/global.css) and [shared layout](../../src/layouts/BaseLayout.astro). Change shared semantic roles there rather than creating a duplicate global token table. Preserve existing ordinary-page hierarchy, readable line length, native links, visible focus, contrast, and responsive behavior. Test desktop 1440×900 and mobile 440×956 CSS pixels (DPR3/touch), including the actual primary controls; a simulator is not a physical-phone test. Check existing theme and image error/fallback behavior.

Read [Wish interpretation](../wish/DESIGN.md) before navigation/product changes. No approved aesthetic redesign is implied by this document.

Feature goals and current/better design: [Feature Design](features/README.md). This is part of Design, not a separate governance owner.
