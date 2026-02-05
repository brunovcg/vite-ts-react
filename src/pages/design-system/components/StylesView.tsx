import { type ReactNode } from "react";
import { icons } from "@/components/icon/Icons";
import { Icon } from "@/components/icon/Icon";
import "../DesignSystem.css";
import type { Css } from "@/runtime/css.types";
import { mergeCss } from "@/utils/class-names/ClassNames.util";

const SECTIONS = [
  { id: "animations", title: "Animations" },
  { id: "backgrounds", title: "Backgrounds" },
  { id: "borders", title: "Borders" },
  { id: "cursors", title: "Cursors & Interaction" },
  { id: "flexbox", title: "Flex Box" },
  { id: "icons", title: "Icons" },
  { id: "overflow", title: "Overflow" },
  { id: "layout", title: "Position & Layout" },
  { id: "sizing", title: "Sizing" },
  { id: "spacing", title: "Spacing" },
  { id: "text-max-lines", title: "Text Max Lines" },
  { id: "typography", title: "Typography" },
  { id: "colors", title: "Variables (Colors)" },
];

export function StylesNav() {
  return (
    <nav css={["display-flex", "flex-column", "gap-sm", "padding-sm", "flex-1", "overflow-y-auto"]}>
      {SECTIONS.map((section) => (
        <a key={section.id} href={`#${section.id}`} css={["font-size-md", "color-typeface-medium", "opacity-hover", "padding-sm", "border-radius-sm"]}>
          {section.title}
        </a>
      ))}
    </nav>
  );
}

export function StylesView() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div css={["display-flex", "height-full", "width-full", "overflow-hidden"]}>
      <main css={["flex-1", "height-full", "overflow-y-auto", "padding-2xl", "scroll-smooth"]}>
        <Section id='animations' title='Animations' description='Keyframe animations.'>
          <div css={["display-flex", "gap-xl"]}>
            <div css={["display-flex", "flex-column", "align-center", "gap-sm"]}>
              <div css={["padding-xl", "background-primary", "border-radius-md", "animate-rotate"]}></div>
              <code css={["font-size-sm"]}>.animate-rotate</code>
            </div>
            <div css={["display-flex", "flex-column", "align-center", "gap-sm"]}>
              <div css={["padding-xl", "background-success", "border-radius-md", "animate-blink"]}></div>
              <code css={["font-size-sm"]}>.animate-blink</code>
            </div>
          </div>
        </Section>

        <Section id='backgrounds' title='Backgrounds' description='Background color utilities.'>
          <div css={["display-flex", "gap-md", "flex-wrap"]}>
            <ColorSwatch css={["background-primary", "color-white"]} label='.background-primary' />
            <ColorSwatch css={["background-error", "color-white"]} label='.background-error' />
            <ColorSwatch css={["background-success", "color-white"]} label='.background-success' />
            <ColorSwatch css={["background-warning", "color-white"]} label='.background-warning' />
            <ColorSwatch css={["background-light"]} label='.background-light' />
            <ColorSwatch css={["background-dark", "color-white"]} label='.background-dark' />
          </div>
        </Section>

        <Section id='borders' title='Borders' description='Border styles, colors, and specific side borders.'>
          <div css={["display-flex", "gap-md", "flex-wrap"]}>
            <div css={["padding-lg", "border", "background-white"]}>.border</div>
            <div css={["padding-lg", "border-top", "background-white"]}>.border-top</div>
            <div css={["padding-lg", "border-bottom", "background-white"]}>.border-bottom</div>
            <div css={["padding-lg", "border-primary", "background-white"]}>.border-primary</div>
            <div css={["padding-lg", "border-error", "background-white"]}>.border-error</div>
            <div css={["padding-lg", "border", "border-radius-md", "background-white"]}>.border-radius-md</div>
            <div
              css={["padding-lg", "border", "border-radius-circle", "background-white", "width-third", "align-center", "display-flex", "justify-center", "width-half", "height-half", "aspect-ratio-1"]}
              style={{ width: "50px", height: "50px" }}
            >
              Circle
            </div>
          </div>

          <div css={["margin-top-lg"]}>
            <h3 css={["text-bold", "margin-bottom-sm"]}>Border Radius</h3>
            <div css={["display-flex", "flex-wrap", "gap-md"]}>
              <ClassDoc css={["border-radius-sm"]} description='4px' />
              <ClassDoc css={["border-radius-md"]} description='8px' />
              <ClassDoc css={["border-radius-lg"]} description='12px' />
              <ClassDoc css={["border-radius-circle"]} description='50%' />
            </div>
          </div>
        </Section>

        <Section id='cursors' title='Cursors & Interaction' description='Cursor styles.'>
          <div css={["display-flex", "flex-wrap", "gap-md"]}>
            {(["pointer", "not-allowed", "wait", "text", "move", "help", "grab", "grabbing"] as const).map((c) => (
              <div key={c} css={["cursor-pointer", "padding-md", "border", "background-white", "border-radius-sm"]}>
                .cursor-{c}
              </div>
            ))}
          </div>
        </Section>

        <Section id='flexbox' title='Flex Box' description='Utilities for Flexbox layout control.'>
          <div css={["display-flex", "flex-column", "gap-lg"]}>
            <ClassDoc css={["display-flex"]} description='display: flex' />
            <ClassDoc css={["flex-row"]} description='flex-direction: row' />
            <ClassDoc css={["flex-column"]} description='flex-direction: column' />
            <ClassDoc css={["flex-center"]} description='justify-content: center; align-items: center' />
            <ClassDoc css={["justify-between"]} description='justify-content: space-between' />
            <ClassDoc css={["gap-md"]} description='gap: 8px' />
          </div>

          <div css={["margin-top-lg"]}>
            <h3 css={["text-bold", "margin-bottom-sm"]}>Gap Sizes</h3>
            <div css={["display-flex", "flex-wrap", "gap-md"]}>
              <ClassDoc css={["gap-xs"]} description='2px' />
              <ClassDoc css={["gap-sm"]} description='4px' />
              <ClassDoc css={["gap-md"]} description='8px' />
              <ClassDoc css={["gap-lg"]} description='16px' />
              <ClassDoc css={["gap-xl"]} description='24px' />
              <ClassDoc css={["gap-2xl"]} description='40px' />
            </div>
          </div>

          <div css={["margin-top-lg"]}>
            <h3 css={["text-bold", "margin-bottom-sm"]}>Flex Grow & Shrink</h3>
            <div css={["display-flex", "flex-column", "gap-sm"]}>
              <ClassDoc css={["flex-1"]} description='flex: 1' />
              <ClassDoc css={["flex-grow"]} description='flex-grow: 1' />
              <ClassDoc css={["flex-shrink"]} description='flex-shrink: 1' />
              <ClassDoc css={["flex-wrap"]} description='flex-wrap: wrap' />
              <ClassDoc css={["flex-no-wrap"]} description='flex-wrap: nowrap' />
            </div>
          </div>
        </Section>

        <Section id='icons' title='Icons' description='Available SVG icons. Click to copy name.'>
          <div css={["display-flex", "flex-wrap", "gap-lg"]}>
            {Object.keys(icons).map((iconName) => (
              <div
                key={iconName}
                css={["display-flex", "flex-column", "align-center", "gap-sm", "cursor-pointer", "opacity-hover"]}
                style={{ width: "100px" }}
                onClick={() => handleCopy(iconName)}
                title='Click to copy'
              >
                <div css={["padding-md", "border", "border-radius-md", "background-white", "display-flex", "flex-center"]} style={{ width: "48px", height: "48px" }}>
                  <Icon icon={iconName as keyof typeof icons} size='lg' />
                </div>
                <span css={["font-size-xs", "color-typeface-light", "text-ellipsis", "width-full", "text-center", "display-inline-block"]}>{iconName}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id='overflow' title='Overflow' description='Scroll and overflow utilities.'>
          <div css={["display-flex", "flex-wrap", "gap-md"]}>
            <ClassDoc css={["overflow-hidden"]} description='overflow: hidden' />
            <ClassDoc css={["overflow-auto"]} description='overflow: auto' />
            <ClassDoc css={["overflow-y-scroll"]} description='overflow-y: scroll' />
            <ClassDoc css={["overflow-x-hidden"]} description='overflow-x: hidden' />
          </div>
        </Section>

        <Section id='layout' title='Position & Layout' description='Positioning and display utilities.'>
          <div css={["display-flex", "flex-wrap", "gap-lg"]}>
            <div css={["width-half"]}>
              <h3 css={["text-bold", "margin-bottom-sm"]}>Position</h3>
              <div css={["display-flex", "flex-column", "gap-sm"]}>
                <ClassDoc className='.position-relative' description='position: relative' css={[]} />
                <ClassDoc className='.position-absolute' description='position: absolute' css={[]} />
                <ClassDoc className='.position-fixed' description='position: fixed' css={[]} />
                <ClassDoc className='.position-sticky' description='position: sticky' css={[]} />
              </div>
            </div>
            <div css={["width-half"]}>
              <h3 css={["text-bold", "margin-bottom-sm"]}>Display</h3>
              <div css={["display-flex", "flex-column", "gap-sm"]}>
                <ClassDoc className='.display-none' description='display: none' css={[]} />
                <ClassDoc className='.display-inline' description='display: inline' css={[]} />
                <ClassDoc className='.display-inline-block' description='display: inline-block' css={[]} />
              </div>
            </div>
          </div>
        </Section>

        <Section id='sizing' title='Sizing' description='Width and Height utilities.'>
          <div css={["display-flex", "flex-column", "gap-sm", "width-full"]}>
            <SizeBar css={["width-full"]} label='.width-full (100%)' />
            <SizeBar css={["width-half"]} label='.width-half (50%)' />
            <SizeBar css={["width-third"]} label='.width-third (33.33%)' />
            <SizeBar css={["width-quarter"]} label='.width-quarter (25%)' />
          </div>
        </Section>

        <Section id='spacing' title='Spacing' description='Padding and Margin utilities. (xs, sm, md, lg, xl, 2xl, 3xl)'>
          <div css={["margin-bottom-lg"]}>
            <h3 css={["text-bold", "margin-bottom-sm"]}>Size Map</h3>
            <div css={["display-flex", "flex-wrap", "gap-md", "font-size-sm", "font-family-monospace"]}>
              <div css={["padding-xs", "border", "background-light", "border-radius-sm"]}>xs: 2px</div>
              <div css={["padding-xs", "border", "background-light", "border-radius-sm"]}>sm: 4px</div>
              <div css={["padding-xs", "border", "background-light", "border-radius-sm"]}>md: 8px</div>
              <div css={["padding-xs", "border", "background-light", "border-radius-sm"]}>lg: 16px</div>
              <div css={["padding-xs", "border", "background-light", "border-radius-sm"]}>xl: 24px</div>
              <div css={["padding-xs", "border", "background-light", "border-radius-sm"]}>2xl: 40px</div>
              <div css={["padding-xs", "border", "background-light", "border-radius-sm"]}>3xl: 64px</div>
            </div>
          </div>
          <div css={["display-flex", "flex-wrap", "gap-md"]}>
            <div css={["background-white", "padding-md", "border", "border-radius-md"]}>
              <span css={["text-bold"]}>Padding Examples:</span>
              <code css={["display-block", "margin-top-sm"]}>.padding-md</code>
              <code css={["display-block"]}>.padding-top-lg</code>
              <code css={["display-block"]}>.padding-inline-sm</code>
            </div>
            <div css={["background-white", "padding-md", "border", "border-radius-md"]}>
              <span css={["text-bold"]}>Margin Examples:</span>
              <code css={["display-block", "margin-top-sm"]}>.margin-md</code>
              <code css={["display-block"]}>.margin-bottom-xl</code>
              <code css={["display-block"]}>.margin-block-2xl</code>
            </div>
          </div>
        </Section>

        <Section id='text-max-lines' title='Text Max Lines' description='Classes to truncate text to specific number of lines.'>
          <div css={["display-flex", "flex-column", "gap-md", "width-half"]}>
            {([1, 2, 3] as const).map((lines) => (
              <div key={lines}>
                <div css={[`text-max-lines-${lines}`, "background-white", "padding-sm", "border", "border-radius-sm"]} style={{ width: "100%" }}>
                  This is a long text that should be truncated after {lines} line(s). The quick brown fox jumps over the lazy dog repeatedly to ensure the text is long enough to demonstrate the
                  truncation effect propertly. The quick brown fox jumps over the lazy dog.
                </div>
                <code css={["font-size-xs", "color-typeface-light", "margin-top-xs", "display-block"]}>.text-max-lines-{lines}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id='typography' title='Typography' description='Font styles, weights, and alignment utilities.'>
          <div css={["display-flex", "flex-column", "gap-md"]}>
            <TypeSpecimen css={["text-preset-title"]} label='.text-preset-title' />
            <TypeSpecimen css={["text-preset-body"]} label='.text-preset-body' />
            <div css={["border-bottom", "margin-block-lg"]} />
            <TypeSpecimen css={["font-size-3xl"]} label='.font-size-3xl' />
            <TypeSpecimen css={["font-size-2xl"]} label='.font-size-2xl' />
            <TypeSpecimen css={["font-size-xl"]} label='.font-size-xl' />
            <TypeSpecimen css={["font-size-lg"]} label='.font-size-lg' />
            <TypeSpecimen css={["font-size-md"]} label='.font-size-md' />
            <TypeSpecimen css={["font-size-sm"]} label='.font-size-sm' />
            <TypeSpecimen css={["font-size-xs"]} label='.font-size-xs' />
            <div css={["border-bottom", "margin-block-lg"]} />
            <TypeSpecimen css={["text-bold"]} label='.text-bold' />
            <TypeSpecimen css={["text-italic"]} label='.text-italic' />
            <TypeSpecimen css={["text-underline"]} label='.text-underline' />
          </div>
        </Section>

        <Section id='colors' title='Variables (Colors)' description='Core color palette used throughout the application.'>
          <ColorGrid />
        </Section>
      </main>
    </div>
  );
}

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <div id={id} css={["margin-bottom-3xl", "background-white", "padding-xl", "border-radius-lg", "border"]}>
      <h2 css={["font-size-xl", "text-bold", "margin-bottom-sm", "color-primary"]}>{title}</h2>
      <p css={["font-size-md", "color-typeface-medium", "margin-bottom-lg"]}>{description}</p>
      {children}
    </div>
  );
}

function ColorGrid() {
  const colors = [
    { name: "--primary", var: "var(--primary)", hex: "#038fc6" },
    { name: "--primary-light", var: "var(--primary-light)", hex: "#e5f7ff", darkText: true },
    { name: "--success", var: "var(--success)", hex: "#179b03" },
    { name: "--success-light", var: "var(--success-light)", hex: "#e0ffdb", darkText: true },
    { name: "--warning", var: "var(--warning)", hex: "rgb(190, 156, 0)" },
    { name: "--warning-light", var: "var(--warning-light)", hex: "#fcfade", darkText: true },
    { name: "--error", var: "var(--error)", hex: "#e12f26" },
    { name: "--error-light", var: "var(--error-light)", hex: "#ffeaea", darkText: true },
    { name: "--typeface-dark", var: "var(--typeface-dark)", hex: "#1c1c1c" },
    { name: "--typeface-medium", var: "var(--typeface-medium)", hex: "#555555" },
    { name: "--typeface-light", var: "var(--typeface-light)", hex: "#777777" },
  ];

  return (
    <div css={["display-flex", "flex-wrap", "gap-lg"]}>
      {colors.map((c) => (
        <div key={c.name} css={["display-flex", "flex-column", "align-center", "gap-xs"]}>
          <div css={["border", "border-radius-circle"]} style={{ width: "64px", height: "64px", backgroundColor: c.var }} />
          <span css={["font-size-xs", "text-bold"]}>{c.name}</span>
          <span css={["font-size-xs", "color-typeface-light"]}>{c.hex}</span>
        </div>
      ))}
    </div>
  );
}

function TypeSpecimen({ className, label, css }: { className?: string; label: string; css: Css }) {
  return (
    <div css={mergeCss("display-flex", "align-center", "gap-md", "padding-bottom-sm", css)}>
      <span css={["font-size-sm", "color-typeface-light", "width-third", "font-family-monospace"]}>{label}</span>
      <span className={className}>The quick brown fox jumps over the lazy dog.</span>
    </div>
  );
}

function ClassDoc({ className, description, css }: { className?: string; description: string; css: Css }) {
  return (
    <div css={mergeCss(["display-flex", "align-center", "gap-md", "padding-sm", "background-light", "border-radius-sm"], css)}>
      <code css={["text-bold", "color-primary"]} style={{ minWidth: "150px" }}>
        {className}
      </code>
      <span css={["font-size-md", "color-typeface-medium", "flex-1"]}>{description}</span>
    </div>
  );
}

function SizeBar({ className, label, css }: { className?: string; label: string; css: Css }) {
  return (
    <div css={mergeCss(["width-full", "background-light", "border-radius-sm", "overflow-hidden", "margin-bottom-xs"], css)}>
      <div className={className} css={["background-primary", "padding-xs", "color-white", "font-size-xs", "align-center", "white-space-nowrap"]}>
        {label}
      </div>
    </div>
  );
}

function ColorSwatch({ className, label, css }: { className?: string; label: string; css: Css }) {
  return (
    <div className={className} css={mergeCss(["padding-lg", "border-radius-md", "display-flex", "flex-center", "align-center", "border"], css)}>
      {label}
    </div>
  );
}
