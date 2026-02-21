import { useState, useEffect, useRef } from "react";
import { useReadmeFiles } from "@/hooks/use-readme-files/useReadmeFiles.hook";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Icon } from "@/components/icon/Icon";

function getPageFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("page");
}

function setPageInUrl(pageName: string) {
  const params = new URLSearchParams(window.location.search);
  params.set("page", pageName);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function DSReadmesSidebar() {
  const readmes = useReadmeFiles();
  const [selectedPage, setSelectedPage] = useState<string | null>(() => getPageFromUrl() || readmes[0]?.name || null);

  useEffect(() => {
    const handlePopState = () => {
      setSelectedPage(getPageFromUrl() || readmes[0]?.name || null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [readmes]);

  useEffect(() => {
    if (!getPageFromUrl() && readmes[0]) {
      setPageInUrl(readmes[0].name);
    }
  }, [readmes]);

  return (
    <>
      <div css={["padding-sm", "border-bottom"]}>
        <input
          type='search'
          placeholder='Search documentation...'
          css={["width-full", "padding-sm", "border", "border-radius-sm", "font-size-sm"]}
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            const firstMatch = readmes.find((r) => r.name.toLowerCase().includes(query) || r.content.toLowerCase().includes(query));
            if (firstMatch) {
              setPageInUrl(firstMatch.name);
            }
          }}
        />
      </div>

      <div css={["display-flex", "flex-column", "flex-1", "overflow-y-auto"]}>
        {readmes.length === 0 ? (
          <div css={["padding-md", "text-center", "color-typeface-light"]}>
            <p>No documentation files found</p>
          </div>
        ) : (
          readmes.map((readme) => (
            <button
              key={readme.path}
              onClick={() => setPageInUrl(readme.name)}
              css={[
                "padding-md",
                "text-left",
                "border-none",
                "background-transparent",
                "cursor-pointer",
                "border-bottom",
                "opacity-hover",
                {
                  "background-primary-light": selectedPage === readme.name,
                  "color-primary": selectedPage === readme.name,
                },
              ]}
            >
              <div css={["display-flex", "align-center", "gap-sm"]}>
                <Icon icon='file' size='sm' />
                <div css={["flex-1"]}>
                  <div css={["text-bold", "font-size-sm"]}>{readme.name}</div>
                  <div css={["font-size-xs", "color-typeface-light"]}>{readme.path.split("/").slice(-2, -1).join("/") || "root"}</div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
}

export function DSReadmesContent() {
  const readmes = useReadmeFiles();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(() => getPageFromUrl() || readmes[0]?.name || null);

  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromUrl() || readmes[0]?.name || null;
      setSelectedPage(page);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [readmes]);

  useEffect(() => {
    if (!getPageFromUrl() && readmes[0]) {
      setPageInUrl(readmes[0].name);
    }
  }, [readmes]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && containerRef.current) {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement && containerRef.current) {
          const containerTop = containerRef.current.offsetTop;
          const elementTop = targetElement.offsetTop;
          containerRef.current.scrollTo({
            top: elementTop - containerTop - 100,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    setTimeout(handleHashChange, 100);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [selectedPage]);

  const currentReadme = readmes.find((r) => r.name === selectedPage);

  return (
    <div ref={containerRef} css={["padding-2xl", "height-full", "overflow-auto"]}>
      {currentReadme ? (
        <div css={["background-white", "border-radius-md", "max-width-full"]} style={{ maxWidth: "900px", margin: "0 auto", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div css={["padding-2xl", "border-bottom"]}>
            <h1 css={["font-size-2xl", "text-bold", "margin-bottom-sm"]}>{currentReadme.name}</h1>
            <p css={["font-size-sm", "color-typeface-light"]}>
              <code css={["background-primary-light", "padding-xs", "border-radius-sm", "font-family-monospace"]}>{currentReadme.path}</code>
            </p>
          </div>
          <MarkdownRenderer content={currentReadme.content} />
        </div>
      ) : (
        <div css={["height-full", "display-flex", "flex-center", "flex-column", "gap-lg", "color-typeface-light"]}>
          <Icon icon='file' size='xl' />
          <p>Select a documentation file to view</p>
        </div>
      )}
    </div>
  );
}
