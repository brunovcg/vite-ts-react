import { Environment } from "@/utils/environment/Environment.util";
import { useNavigate } from "react-router-dom";
import { type ReactNode } from "react";
import { icons } from "@/components/icon/Icons";
import { Icon } from "@/components/icon/Icon";
import "./DesignSystem.css";

const SECTIONS = [
  { id: "animations", title: "Animations" },
  { id: "backgrounds", title: "Backgrounds" },
  { id: "borders", title: "Borders" },
  { id: "container-input", title: "Container Input" },
  { id: "cursors", title: "Cursors & Interaction" },
  { id: "flexbox", title: "Flex Box" },
  { id: "icons", title: "Icons" },
  { id: "overflow", title: "Overflow" },
  { id: "layout", title: "Position & Layout" },
  { id: "responsive", title: "Responsive" },
  { id: "sizing", title: "Sizing" },
  { id: "spacing", title: "Spacing" },
  { id: "text-max-lines", title: "Text Max Lines" },
  { id: "typography", title: "Typography" },
  { id: "colors", title: "Variables (Colors)" },
];

export function DesignSystem() {
  const navigate = useNavigate();

  if (!Environment.isDevelopment()) {
    return null;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add visual feedback here
  };

  return (
    <div className='design-system-container width-full height-viewport overflow-hidden background-light display-flex'>
      {/* Sidebar Navigation */}
      <aside className='width-quarter height-full overflow-hidden background-white border-right padding-lg shadow-sm z-index-drawer'>
        <div className='margin-bottom-xl'>
          <h1 className='font-size-xl text-text-bold color-primary margin-bottom-md'>Design System</h1>
          <button className='cursor-pointer padding-sm width-full background-error-light color-error border-none border-radius-md hover-opacity' onClick={() => navigate("/")}>
            Exit Design System
          </button>
        </div>

        <nav className='display-flex flex-column gap-sm'>
          {SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`} className='font-size-md color-typeface-medium hover-opacity padding-sm border-radius-sm' style={{ textDecoration: "none" }}>
              {section.title}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className='flex-1 height-full overflow-y-auto padding-2xl scroll-smooth'>
        <Section id='animations' title='Animations' description='Keyframe animations.'>
          <div className='display-flex gap-xl'>
            <div className='display-flex flex-column align-center gap-sm'>
              <div className='padding-xl background-primary border-radius-md animate-rotate'></div>
              <code className='font-size-sm'>.animate-rotate</code>
            </div>
            <div className='display-flex flex-column align-center gap-sm'>
              <div className='padding-xl background-success border-radius-md animate-blink'></div>
              <code className='font-size-sm'>.animate-blink</code>
            </div>
          </div>
        </Section>

        <Section id='backgrounds' title='Backgrounds' description='Background color utilities.'>
          <div className='display-flex gap-md flex-wrap'>
            <ColorSwatch className='background-primary color-white' label='.background-primary' />
            <ColorSwatch className='background-error color-white' label='.background-error' />
            <ColorSwatch className='background-success color-white' label='.background-success' />
            <ColorSwatch className='background-warning color-white' label='.background-warning' />
            <ColorSwatch className='background-light' label='.background-light' />
            <ColorSwatch className='background-dark color-white' label='.background-dark' />
          </div>
        </Section>

        <Section id='borders' title='Borders' description='Border styles, colors, and specific side borders.'>
          <div className='display-flex gap-md flex-wrap'>
            <div className='padding-lg border background-white'>.border</div>
            <div className='padding-lg border-top background-white'>.border-top</div>
            <div className='padding-lg border-bottom background-white'>.border-bottom</div>
            <div className='padding-lg border-primary background-white'>.border-primary</div>
            <div className='padding-lg border-error background-white'>.border-error</div>
            <div className='padding-lg border border-radius-md background-white'>.border-radius-md</div>
            <div
              className='padding-lg border border-radius-circle background-white width-third align-center display-flex justify-center'
              style={{ aspectRatio: "1/1", width: "50px", height: "50px" }}
            >
              Circle
            </div>
          </div>

          <div className='margin-top-lg'>
            <h3 className='text-text-bold margin-bottom-sm'>Border Radius</h3>
            <div className='display-flex flex-wrap gap-md'>
              <ClassDoc className='.border-radius-sm' description='4px' />
              <ClassDoc className='.border-radius-md' description='8px' />
              <ClassDoc className='.border-radius-lg' description='12px' />
              <ClassDoc className='.border-radius-circle' description='50%' />
            </div>
          </div>
        </Section>

        <Section id='container-input' title='Container Input' description='Styled form field containers.'>
          <div className='display-flex flex-column gap-md width-half'>
            <div className='container-input'>
              <label>Standard Input</label>
              <input type='text' placeholder='Type something...' />
            </div>
            <div className='container-input'>
              <label>Required Field</label>
              <input type='text' required placeholder='Required...' />
            </div>
            <div className='container-input'>
              <label>Disabled Input</label>
              <input type='text' disabled placeholder='Disabled' />
            </div>
          </div>
        </Section>

        <Section id='cursors' title='Cursors & Interaction' description='Cursor styles.'>
          <div className='display-flex flex-wrap gap-md'>
            {["pointer", "not-allowed", "wait", "text", "move", "help", "grab", "grabbing"].map((c) => (
              <div key={c} className={`cursor-${c} padding-md border background-white border-radius-sm`}>
                .cursor-{c}
              </div>
            ))}
          </div>
        </Section>

        <Section id='flexbox' title='Flex Box' description='Utilities for Flexbox layout control.'>
          <div className='display-flex flex-column gap-lg'>
            <ClassDoc className='.display-flex' description='display: flex' />
            <ClassDoc className='.flex-row' description='flex-direction: row' />
            <ClassDoc className='.flex-column' description='flex-direction: column' />
            <ClassDoc className='.flex-center' description='justify-content: center; align-items: center' />
            <ClassDoc className='.justify-between' description='justify-content: space-between' />
            <ClassDoc className='.gap-md' description='gap: 8px' />
          </div>

          <div className='margin-top-lg'>
            <h3 className='text-bold margin-bottom-sm'>Gap Sizes</h3>
            <div className='display-flex flex-wrap gap-md'>
              <ClassDoc className='.gap-xs' description='2px' />
              <ClassDoc className='.gap-sm' description='4px' />
              <ClassDoc className='.gap-md' description='8px' />
              <ClassDoc className='.gap-lg' description='16px' />
              <ClassDoc className='.gap-xl' description='24px' />
              <ClassDoc className='.gap-2xl' description='40px' />
            </div>
          </div>

          <div className='margin-top-lg'>
            <h3 className='text-bold margin-bottom-sm'>Flex Grow & Shrink</h3>
            <div className='display-flex flex-column gap-sm'>
              <ClassDoc className='.flex-1' description='flex: 1' />
              <ClassDoc className='.flex-grow' description='flex-grow: 1' />
              <ClassDoc className='.flex-shrink' description='flex-shrink: 1' />
              <ClassDoc className='.flex-wrap' description='flex-wrap: wrap' />
              <ClassDoc className='.flex-no-wrap' description='flex-wrap: nowrap' />
            </div>
          </div>
        </Section>

        <Section id='icons' title='Icons' description='Available SVG icons. Click to copy name.'>
          <div className='display-flex flex-wrap gap-lg'>
            {Object.keys(icons).map((iconName) => (
              <div
                key={iconName}
                className='display-flex flex-column align-center gap-sm cursor-pointer hover-opacity'
                style={{ width: "100px" }}
                onClick={() => handleCopy(iconName)}
                title='Click to copy'
              >
                <div className='padding-md border border-radius-md background-white display-flex flex-center shadow-sm' style={{ width: "48px", height: "48px" }}>
                  <Icon icon={iconName as keyof typeof icons} size='lg' />
                </div>
                <span className='font-size-xs color-typeface-light text-ellipsis width-full align-center display-inline-block'>{iconName}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id='overflow' title='Overflow' description='Scroll and overflow utilities.'>
          <div className='display-flex flex-wrap gap-md'>
            <ClassDoc className='.overflow-hidden' description='overflow: hidden' />
            <ClassDoc className='.overflow-auto' description='overflow: auto' />
            <ClassDoc className='.overflow-y-scroll' description='overflow-y: scroll' />
            <ClassDoc className='.overflow-x-hidden' description='overflow-x: hidden' />
          </div>
        </Section>

        <Section id='layout' title='Position & Layout' description='Positioning and display utilities.'>
          <div className='display-flex flex-wrap gap-lg'>
            <div className='width-half'>
              <h3 className='text-bold margin-bottom-sm'>Position</h3>
              <ClassDoc className='.position-relative' description='position: relative' />
              <ClassDoc className='.position-absolute' description='position: absolute' />
              <ClassDoc className='.position-fixed' description='position: fixed' />
              <ClassDoc className='.position-sticky' description='position: sticky' />
            </div>
            <div className='width-half'>
              <h3 className='text-bold margin-bottom-sm'>Display</h3>
              <ClassDoc className='.display-none' description='display: none' />
              <ClassDoc className='.display-inline' description='display: inline' />
              <ClassDoc className='.display-inline-block' description='display: inline-block' />
            </div>
          </div>
        </Section>

        <Section id='responsive' title='Responsive' description='Responsive utility classes.'>
          <ClassDoc className='mobile-only' description='Hidden on screens wider than 769px.' />
        </Section>

        <Section id='sizing' title='Sizing' description='Width and Height utilities.'>
          <div className='display-flex flex-column gap-sm width-full'>
            <SizeBar className='width-full' label='.width-full (100%)' />
            <SizeBar className='width-half' label='.width-half (50%)' />
            <SizeBar className='width-third' label='.width-third (33.33%)' />
            <SizeBar className='width-quarter' label='.width-quarter (25%)' />
          </div>
        </Section>

        <Section id='spacing' title='Spacing' description='Padding and Margin utilities. (xs, sm, md, lg, xl, 2xl, 3xl)'>
          <div className='margin-bottom-lg'>
            <h3 className='text-bold margin-bottom-sm'>Size Map</h3>
            <div className='display-flex flex-wrap gap-md font-size-sm font-mono'>
              <div className='padding-xs border background-light border-radius-sm'>xs: 2px</div>
              <div className='padding-xs border background-light border-radius-sm'>sm: 4px</div>
              <div className='padding-xs border background-light border-radius-sm'>md: 8px</div>
              <div className='padding-xs border background-light border-radius-sm'>lg: 16px</div>
              <div className='padding-xs border background-light border-radius-sm'>xl: 24px</div>
              <div className='padding-xs border background-light border-radius-sm'>2xl: 40px</div>
              <div className='padding-xs border background-light border-radius-sm'>3xl: 64px</div>
            </div>
          </div>
          <div className='display-flex flex-wrap gap-md'>
            <div className='background-white padding-md border border-radius-md'>
              <span className='text-bold'>Padding Examples:</span>
              <code className='display-block margin-top-sm'>.padding-md</code>
              <code className='display-block'>.padding-top-lg</code>
              <code className='display-block'>.padding-inline-sm</code>
            </div>
            <div className='background-white padding-md border border-radius-md'>
              <span className='text-bold'>Margin Examples:</span>
              <code className='display-block margin-top-sm'>.margin-md</code>
              <code className='display-block'>.margin-bottom-xl</code>
              <code className='display-block'>.margin-block-2xl</code>
            </div>
          </div>
        </Section>

        <Section id='text-max-lines' title='Text Max Lines' description='Classes to truncate text to specific number of lines.'>
          <div className='display-flex flex-column gap-md width-half'>
            {[1, 2, 3].map((lines) => (
              <div key={lines}>
                <div className={`text-max-lines-${lines} background-white padding-sm border border-radius-sm`} style={{ width: "100%" }}>
                  This is a long text that should be truncated after {lines} line(s). The quick brown fox jumps over the lazy dog repeatedly to ensure the text is long enough to
                  demonstrate the truncation effect propertly. The quick brown fox jumps over the lazy dog.
                </div>
                <code className='font-size-xs color-typeface-light margin-top-xs display-block'>.text-max-lines-{lines}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id='typography' title='Typography' description='Font styles, weights, and alignment utilities.'>
          <div className='display-flex flex-column gap-md'>
            <TypeSpecimen className='preset-title' label='.text-preset-title' />
            <TypeSpecimen className='preset-body' label='.text-preset-body' />
            <div className='separator border-bottom margin-block-lg'></div>
            <TypeSpecimen className='font-size-3xl' label='.font-size-3xl' />
            <TypeSpecimen className='font-size-2xl' label='.font-size-2xl' />
            <TypeSpecimen className='font-size-xl' label='.font-size-xl' />
            <TypeSpecimen className='font-size-lg' label='.font-size-lg' />
            <TypeSpecimen className='font-size-md' label='.font-size-md' />
            <TypeSpecimen className='font-size-sm' label='.font-size-sm' />
            <TypeSpecimen className='font-size-xs' label='.font-size-xs' />
            <div className='separator border-bottom margin-block-lg'></div>
            <TypeSpecimen className='text-bold' label='.text-bold' />
            <TypeSpecimen className='text-italic' label='.text-italic' />
            <TypeSpecimen className='text-underline' label='.text-underline' />
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
    <div id={id} className='section margin-bottom-3xl background-white padding-xl border-radius-lg border shadow-sm'>
      <h2 className='font-size-xl text-bold margin-bottom-sm color-primary'>{title}</h2>
      <p className='font-size-md color-typeface-medium margin-bottom-lg'>{description}</p>
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
    <div className='display-flex flex-wrap gap-lg'>
      {colors.map((c) => (
        <div key={c.name} className='display-flex flex-column align-center gap-xs'>
          <div className='border border-radius-circle shadow-sm' style={{ width: "64px", height: "64px", backgroundColor: c.var }} />
          <span className='font-size-xs text-bold'>{c.name}</span>
          <span className='font-size-xs color-typeface-light'>{c.hex}</span>
        </div>
      ))}
    </div>
  );
}

function TypeSpecimen({ className, label }: { className: string; label: string }) {
  return (
    <div className='display-flex align-center gap-md padding-bottom-sm border-bottom-dashed'>
      <span className='font-size-sm color-typeface-light width-third font-mono'>{label}</span>
      <span className={className}>The quick brown fox jumps over the lazy dog.</span>
    </div>
  );
}

function ClassDoc({ className, description }: { className: string; description: string }) {
  return (
    <div className='display-flex align-center gap-md padding-sm background-light border-radius-sm'>
      <code className='text-bold color-primary' style={{ minWidth: "150px" }}>
        {className}
      </code>
      <span className='font-size-md color-typeface-medium flex-1'>{description}</span>
    </div>
  );
}

function SizeBar({ className, label }: { className: string; label: string }) {
  return (
    <div className='width-full background-light border-radius-sm overflow-hidden margin-bottom-xs'>
      <div className={`${className} background-primary padding-xs color-white font-size-xs align-center white-space-nowrap`}>{label}</div>
    </div>
  );
}

function ColorSwatch({ className, label }: { className: string; label: string }) {
  return <div className={`${className} padding-lg border-radius-md display-flex center align-center border shadow-sm`}>{label}</div>;
}
