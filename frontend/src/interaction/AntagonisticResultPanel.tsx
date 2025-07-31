import { useMemo } from "react";
import * as S from "./AntagonisticResultPanel.style";

interface AntagonisticDataItem {
  mode: string;
  target: string;
  response: string;
}

interface Props {
  interactionResult: string;
}

const AntagonisticResultPanel = ({ interactionResult }: Props) => {
  const items: AntagonisticDataItem[] = useMemo(() => {
    try {
      return JSON.parse(interactionResult) as AntagonisticDataItem[];
    } catch {
      return [];
    }
  }, [interactionResult]);

  if (!items.length) {
    return (
      <S.Container>
        <S.EmptyState>Nothing to show yet 🙂</S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.List>
        {items.map(({ mode, target, response }, idx) => (
          <S.Bubble key={idx}>
            <S.Meta>
              {mode} · {target}
            </S.Meta>
            <S.Body>{response}</S.Body>
          </S.Bubble>
        ))}
      </S.List>
    </S.Container>
  );
};

export default AntagonisticResultPanel;
