import React, { ReactNode, CSSProperties, memo } from "react";

type AnyLayer = {
  id?: string | number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
};

export interface ParallaxProps {
  // common prop names people use
  layers?: AnyLayer[];
  items?: AnyLayer[];
  sections?: AnyLayer[];
  slides?: AnyLayer[];
  data?: AnyLayer[];

  // sometimes nested under config/content
  config?: Partial<ParallaxProps>;
  content?: Partial<ParallaxProps>;

  // render + wrapper
  renderItem?: (layer: AnyLayer, index: number) => ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function firstArray<T = any>(...candidates: (T[] | undefined | null)[]): T[] {
  for (const c of candidates) {
    if (Array.isArray(c)) return c as T[];
  }
  return [];
}

function pickLayers(props: ParallaxProps): AnyLayer[] {
  return firstArray(
    props.layers,
    props.items,
    props.sections,
    props.slides,
    props.data,
    props.config?.layers,
    props.config?.items,
    props.config?.sections,
    props.config?.slides,
    props.config?.data,
    props.content?.layers,
    props.content?.items,
    props.content?.sections,
    props.content?.slides,
    props.content?.data,
  );
}

const DefaultItem = (layer: AnyLayer, idx: number) => {
  const Tag = (layer.as as any) || "div";
  const cls = ["parallax-layer", layer.className].filter(Boolean).join(" ");
  return <Tag key={layer.id ?? idx} className={cls} style={layer.style} data-index={idx} />;
};

const Parallax: React.FC<ParallaxProps> = memo((props) => {
  const Tag: any = props.as || "div";
  const layers = pickLayers(props);

  if (!layers || layers.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[Parallax] No array data found (layers/items/sections/slides/data). Rendering children only.");
    }
    return (
      <Tag className={props.className} style={props.style}>
        {props.children ?? null}
      </Tag>
    );
  }

  const render = props.renderItem ?? DefaultItem;

  return (
    <Tag className={props.className} style={props.style}>
      {layers.map((layer, index) => {
        try {
          return render(layer, index);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("[Parallax] renderItem failed at index", index, err);
          }
          return null;
        }
      })}
      {props.children}
    </Tag>
  );
});

export default Parallax;
