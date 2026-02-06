export function InternalPage() {
  return (
    <div data-component='InternalPage' css={["padding-2xl"]}>
      <h1 css={["font-size-2xl", "text-bold", "margin-bottom-lg"]}>Internal</h1>
      <div css={["display-flex", "flex-column", "gap-lg"]}>
        <p>Internal page content. This page is hidden and lazy loaded.</p>
      </div>
    </div>
  );
}
