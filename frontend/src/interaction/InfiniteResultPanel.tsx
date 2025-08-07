import { useCallback, useEffect, useRef, useState } from "react";
import type { SampleData } from "../sample";
import type { InfiniteItem } from "../types/InfiniteItem";
import * as S from "./InfiniteResultPanel.style";

interface FloatingIdea extends InfiniteItem {
  id: string;
  x: number;
  y: number;
  remaining: number;
}

interface Props {
  selectedItem: SampleData | null;
  ideas: InfiniteItem[];
  onStart: () => void;
  onStop: () => void;
  streaming: boolean;
}

const FADE_DURATION = 1000; // fade-out duration in ms
const VISIBLE_DURATION = 8000; // time before fade starts
const TOTAL_LIFE = VISIBLE_DURATION + FADE_DURATION;
const FPS = 60;

const InfiniteResultPanel = ({
  selectedItem,
  ideas,
  onStart,
  onStop,
  streaming,
}: Props) => {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [floats, setFloats] = useState<FloatingIdea[]>([]);
  const [pinned, setPinned] = useState<FloatingIdea[]>([]);
  // track seen items to add only new ones
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!streaming) return;
    const zone = zoneRef.current;
    if (!zone) return;

    const rect = zone.getBoundingClientRect();
    const newFloats: FloatingIdea[] = [];

    ideas.forEach((item) => {
      const key = `${item.mode}|${item.response}|${item.reason}`;
      if (seenRef.current.has(key)) return; // already added
      seenRef.current.add(key);

      let x: number;
      let y: number;
      let attempts = 0;
      do {
        x = Math.random() * (rect.width - 150);
        y = Math.random() * (rect.height - 40);
        attempts++;
      } while (
        floats.some(
          (f) => x < f.x + 150 && x + 150 > f.x && y < f.y + 40 && y + 40 > f.y
        ) &&
        attempts < 10
      );

      newFloats.push({
        ...item,
        id: key + Date.now(),
        x,
        y,
        remaining: TOTAL_LIFE,
      });
    });

    if (newFloats.length) {
      setFloats((prev) => [...prev, ...newFloats]);
    }
  }, [ideas, streaming]);

  // Lifecycle ticker
  useEffect(() => {
    if (!streaming) return;
    let animationId: number;
    const tick = () => {
      setFloats((prev) =>
        prev
          .map((f) => ({
            ...f,
            remaining: f.remaining - 1000 / FPS,
          }))
          .filter((f) => f.remaining > 0)
      );
      animationId = requestAnimationFrame(tick);
    };
    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [streaming]);

  const handleFloatClick = useCallback((item: FloatingIdea) => {
    setPinned((prev) => [...prev, item]);
    setFloats((prev) => prev.filter((f) => f.id !== item.id));
  }, []);

  const handleUnpin = useCallback((id: string) => {
    setPinned((prev) => prev.filter((item) => item.id !== id));
  }, []);

  if (!selectedItem) {
    return (
      <S.Container>
        ⬅️ Please select data item in the left side panel.
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.TopBar>
        {!streaming && <>Selected code: {selectedItem.code}</>}
        {streaming && (
          <>
            <S.Spinner />
            Selected code: {selectedItem.code}
          </>
        )}
        <div className="control-panel">
          <div
            className={"control" + (streaming ? " selected" : "")}
            onClick={onStart}
          >
            Start
          </div>
          <div
            className={"control" + (streaming ? "" : " selected")}
            onClick={onStop}
          >
            Stop
          </div>
        </div>
      </S.TopBar>
      <S.ItemsZone ref={zoneRef}>
        {floats.map((item) => {
          // calculate opacity: full until fade start, then fade
          const opacity =
            item.remaining > FADE_DURATION ? 1 : item.remaining / FADE_DURATION;
          return (
            <S.Idea
              key={item.id}
              style={{ left: item.x, top: item.y, opacity }}
              remaining={item.remaining}
              onClick={() => handleFloatClick(item)}
            >
              {item.response}
            </S.Idea>
          );
        })}
      </S.ItemsZone>

      <S.PinnedArea>
        {pinned.map((item) => (
          <S.PinnedItem key={item.id}>
            <div className="header">
              <strong>{item.response}</strong>
              <div className="icon" onClick={() => handleUnpin(item.id)}>
                X
              </div>
            </div>
            <p>{item.reason}</p>
          </S.PinnedItem>
        ))}
      </S.PinnedArea>
    </S.Container>
  );
};

export default InfiniteResultPanel;
