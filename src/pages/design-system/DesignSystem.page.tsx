import { useRef, useState } from "react";
import { Environment } from "@/utils/environment/Environment.util";
import { Icon } from "@/components/icon/Icon";
import { Tabs } from "@/components/tabs/Tabs";
import { useComponentDocs } from "@/hooks/use-component-docs/useComponentDocs.hook";
import { StylesView, StylesNav } from "./components/DSStylesView";
import { DSComponentViewer } from "./components/DSComponentViewer";
import { DSReadmesSidebar, DSReadmesContent } from "./components/DSReadmesView";
import "./DesignSystem.css";

import { Button } from "@/components/button/Button";
import { useTypedNavigate, useLocation } from "@/router/Router.utils";
import type { RouterTypedPath } from "@/router/router.types";

export function DesignSystem() {
  const navigate = useTypedNavigate();
  const location = useLocation();
  const returnTo = useRef(((location.state as { returnTo?: string })?.returnTo || "/") as RouterTypedPath);
  const componentDocs = useComponentDocs().sort((a, b) => a.name.localeCompare(b.name));
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponentDocs = componentDocs.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return doc.name.toLowerCase().includes(query) || doc.description?.toLowerCase().includes(query);
  });

  if (!Environment.isDevelopment() && !Environment.isStaging()) {
    return null;
  }

  return (
    <div className='design-system-container' css={["width-full", "height-viewport", "overflow-hidden", "background-light", "display-flex", "flex-column"]}>
      {/* Header */}
      <header css={["background-white", "border-bottom", "padding-md", "display-flex", "align-center", "justify-between"]}>
        <div css={["display-flex", "align-center", "gap-md"]}>
          <div css={["background-primary", "border-radius-md", "display-flex", "flex-center", "color-white"]} style={{ width: "40px", height: "40px" }}>
            <Icon icon='codeFrontend' size='lg' />
          </div>
          <h1 css={["font-size-lg", "text-bold"]}>Design System</h1>
        </div>
        <Button color='error' variant='outlined' onClick={() => navigate(returnTo.current)}>
          <Icon icon='logout' />
          Exit
        </Button>
      </header>

      {/* Main Content with Tabs */}
      <Tabs
        id='design-system-tabs'
        tabs={[
          { id: "styles", label: "Styles" },
          { id: "components", label: "Components" },
          { id: "doc", label: "Docs" },
        ]}
      >
        <div css={["display-flex", "flex-1", "height-full", "overflow-hidden"]}>
          {/* Sidebar */}
          <aside css={["width-300px", "background-white", "border-right", "display-flex", "flex-column"]}>
            <div css={["border-bottom", "padding-top-md"]}>
              <Tabs.Nav />
            </div>

            <Tabs.Item id='styles' css={["display-flex", "flex-column", "flex-1", "overflow-hidden"]}>
              <StylesNav />
            </Tabs.Item>

            <Tabs.Item id='components' css={["display-flex", "flex-column", "flex-1", "overflow-hidden"]}>
              <div css={["padding-sm", "border-bottom"]}>
                <input
                  type='text'
                  placeholder='Search components...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  css={["padding-sm", "border-radius-sm", "border", "width-full", "font-size-sm"]}
                />
              </div>
              <div css={["display-flex", "flex-column", "overflow-y-auto", "flex-1", "padding-sm"]}>
                {filteredComponentDocs.length === 0 ? (
                  <div css={["padding-md", "text-center", "color-typeface-light"]}>
                    <p>No components found</p>
                  </div>
                ) : (
                  filteredComponentDocs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedComponentId(doc.id)}
                      css={[
                        "padding-md",
                        "text-left",
                        "border-none",
                        "background-transparent",
                        "cursor-pointer",
                        "border-radius-sm",
                        "opacity-hover",
                        {
                          "background-primary-light": selectedComponentId === doc.id,
                          "color-primary": selectedComponentId === doc.id,
                        },
                      ]}
                    >
                      <span css={["text-bold", "display-block"]}>{doc.name}</span>
                      {doc.description && <span css={["font-size-xs", "color-typeface-light", "text-ellipsis", "display-block"]}>{doc.description}</span>}
                    </button>
                  ))
                )}
              </div>
            </Tabs.Item>

            <Tabs.Item id='doc' css={["display-flex", "flex-column", "flex-1", "overflow-hidden"]}>
              <DSReadmesSidebar />
            </Tabs.Item>
          </aside>

          {/* View Area */}
          <main css={["flex-1", "height-full", "overflow-auto", "position-relative"]}>
            <Tabs.Item id='styles'>
              <StylesView />
            </Tabs.Item>

            <Tabs.Item id='components' css={["height-full"]}>
              {selectedComponentId ? (
                <DSComponentViewer key={selectedComponentId} doc={componentDocs.find((d) => d.id === selectedComponentId)!} />
              ) : (
                <div css={["height-full", "display-flex", "flex-center", "flex-column", "gap-lg", "color-typeface-light"]}>
                  <Icon icon='codeFrontend' size='xl' />
                  <p>Select a component to view documentation</p>
                </div>
              )}
            </Tabs.Item>

            <Tabs.Item id='doc' css={["height-full"]}>
              <DSReadmesContent />
            </Tabs.Item>
          </main>
        </div>
      </Tabs>
    </div>
  );
}
