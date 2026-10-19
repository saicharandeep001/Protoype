import katex from "katex";
export function MathFormula({ value }: { value: string }) {
  return (
    <div
      className="formula"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(value, {
          throwOnError: false,
          displayMode: true,
          output: "htmlAndMathml",
          trust: false,
        }),
      }}
    />
  );
}
