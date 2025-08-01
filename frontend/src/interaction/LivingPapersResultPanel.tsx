import { useMemo } from "react";
import * as S from "./LivingPapersResultPanel.style";

interface LivingPapersDataItem {
  author: string;
  title: string;
  target: string;
  sentiment_emoji: string;
  response: string;
}

interface Props {
  interactionResult: string;
}

const LivingPapersResultPanel = ({ interactionResult }: Props) => {
  const items: LivingPapersDataItem[] = useMemo(() => {
    try {
      return JSON.parse(interactionResult) as LivingPapersDataItem[];
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
        {items.map(({ author, title, sentiment_emoji, response }, idx) => (
          <S.Bubble key={idx}>
            <S.UpperPart>
              <S.Emoji>{sentiment_emoji}</S.Emoji>
              <S.MessagePart>
                <div className="name">{author}</div>
                <div className="message">{response}</div>
              </S.MessagePart>
            </S.UpperPart>
            <S.TitlePart>Paper: {title}</S.TitlePart>
          </S.Bubble>
        ))}
      </S.List>
    </S.Container>
  );
};

export default LivingPapersResultPanel;
