import { CDragonAsset } from '@/shared/types';

interface BlendedGridProps {
  images: CDragonAsset[];
  className?: string;
}

const BlendedGrid = ({ images, className = "" }: BlendedGridProps) => {
  const base = "absolute w-[70%] h-[70%] object-cover";

  return (
    <div className={`aspect-square overflow-hidden rounded-md relative ${className}`}>
      <img
        src={images[0] ?? ''}
        className={`${base} top-[-10%] left-[-10%] z-10`}
        style={{
          maskImage: "linear-gradient(to right, black 60%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <img
        src={images[1] ?? ''}
        className={`${base} top-[-10%] right-[-10%] z-5`}
        style={{
          maskImage: "linear-gradient(to left, black 60%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <img
        src={images[2] ?? ''}
        className={`${base} bottom-[-10%] left-[-10%] z-3`}
        style={{
          maskImage: "linear-gradient(to right, black 60%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <img
        src={images[3] ?? ''}
        className={`${base} bottom-[-10%] right-[-10%] z-1`}
        style={{
          maskImage: "linear-gradient(to left, black 60%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </div>
  );
};

export default BlendedGrid;
