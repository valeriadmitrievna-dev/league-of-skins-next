import { ComponentProps, CSSProperties, FC, PropsWithChildren } from "react";

import CornerLeftBottomIcon from "@/assets/corner-left-bottom.svg";
import CornerLeftTopIcon from "@/assets/corner-left-top.svg";
import CornerRightBottomIcon from "@/assets/corner-right-bottom.svg";
import CornerRightTopIcon from "@/assets/corner-right-top.svg";
import { cn } from "@/shared/cn";

interface OrnateBlockProps extends PropsWithChildren<ComponentProps<"div">> {
  color?: string;
}

const OrnateBlock: FC<OrnateBlockProps> = ({ children, className, color, ...props }) => {
  return (
    <div
      role="ornate-block"
      className={cn("p-6 relative min-h-11 min-w-11 w-fit h-fit", className)}
      style={{ "--ornate-color": color ?? "var(--color-primary)" } as CSSProperties}
      {...props}
    >
      <CornerLeftTopIcon role="ornate-corner" className="absolute left-0 top-0 text-(--ornate-color)" />
      <CornerLeftBottomIcon role="ornate-corner" className="absolute left-0 bottom-0 text-(--ornate-color)" />
      <CornerRightTopIcon role="ornate-corner" className="absolute right-0 top-0 text-(--ornate-color)" />
      <CornerRightBottomIcon role="ornate-corner" className="absolute right-0 bottom-0 text-(--ornate-color)" />

      <div role="ornate-line" className="absolute bg-(--ornate-color) h-1 left-2.5 right-2.5 top-0" />
      <div role="ornate-line" className="absolute bg-(--ornate-color) h-1 left-2.5 right-2.5 bottom-0" />
      <div role="ornate-line" className="absolute bg-(--ornate-color) w-1 top-5 bottom-5 left-0" />
      <div role="ornate-line" className="absolute bg-(--ornate-color) w-1 top-5 bottom-5 right-0" />

      {children}
    </div>
  );
};

export default OrnateBlock;
