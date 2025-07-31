import React, { useState } from "react";
import { Palette } from "lucide-react";
import * as S from "./App.style";
import { sampleData } from "./sample";

// theme별 색상 매핑 (App.style.ts에서 import)
import { themeColors } from "./App.style";

function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(
    null
  );
  const [interactionResult, setInteractionResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string>("");

  // 인터랙션 버튼 데이터
  const interactionButtons = [
    {
      type: "antagonistic",
      label: "Antagonistic",
      emoji: "😤",
      description: "Challenge and question the data",
    },
    {
      type: "living-papers",
      label: "Living Papers",
      emoji: "📄",
      description: "Dynamic document generation",
    },
    {
      type: "living-codes",
      label: "Living Codes",
      emoji: "💻",
      description: "Interactive code exploration",
    },
    {
      type: "infinite-generation",
      label: "Infinite Generation",
      emoji: "∞",
      description: "Continuous data generation",
    },
  ];

  const handleItemClick = (idx: number) => {
    setSelectedIndex(idx);
    setSelectedInteraction(null);
    setInteractionResult("");
  };

  const handleInteractionClick = async (interactionType: string) => {
    if (selectedIndex === null) return;
    setLoading(true);
    setSelectedInteraction(interactionType);
    // 샘플 응답
    setTimeout(() => {
      setInteractionResult(
        `Result for [${interactionType}] on theme "${sampleData[selectedIndex].theme}":\n\n${sampleData[selectedIndex].rawTweet}\n\n${sampleData[selectedIndex].code}`
      );
      setLoading(false);
    }, 600);
  };

  return (
    <S.AppContainer>
      <S.Container>
        <S.Title>
          LLM + Qual Research Prototype (Tweets from US Election 2020)
        </S.Title>
        <S.RQ>
          RQ: How do users justify or defend their use of hate speech in tweets?
        </S.RQ>
        <S.Grid>
          {/* Left Panel - Data Items */}
          <S.Panel>
            <S.PanelTitle>Data Items</S.PanelTitle>
            <S.DataItemsContainer>
              {sampleData.map((item, idx) => (
                <S.DataItemCard
                  key={idx}
                  isSelected={selectedIndex === idx}
                  themeKey={item.theme}
                  onClick={() => handleItemClick(idx)}
                >
                  <S.ItemHeader>
                    <Palette size={20} />
                    <S.ItemType
                      style={{
                        color: themeColors[item.theme]?.color || "#fff",
                      }}
                    >
                      {item.theme}
                    </S.ItemType>
                  </S.ItemHeader>
                  <S.ItemTitle>{item.code}</S.ItemTitle>
                  <S.ItemDescription>{item.rawTweet}</S.ItemDescription>
                </S.DataItemCard>
              ))}
            </S.DataItemsContainer>
          </S.Panel>

          {/* Right Panel - Interactions */}
          <S.Panel>
            {/* Interaction Buttons */}
            <S.InteractionSection>
              <S.InteractionTitle>Choose Interaction Type</S.InteractionTitle>
              <S.InteractionGrid>
                {interactionButtons.map((button) => (
                  <S.InteractionButton
                    key={button.type}
                    isSelected={selectedInteraction === button.type}
                    disabled={loading}
                    onClick={() => handleInteractionClick(button.type)}
                  >
                    <S.ButtonContent>
                      <S.ButtonEmoji>{button.emoji}</S.ButtonEmoji>
                      <S.ButtonLabel>{button.label}</S.ButtonLabel>
                      <S.ButtonDescription>
                        {button.description}
                      </S.ButtonDescription>
                    </S.ButtonContent>
                  </S.InteractionButton>
                ))}
              </S.InteractionGrid>
            </S.InteractionSection>

            {/* Loading State */}
            {loading && (
              <S.LoadingState>
                <S.LoadingContent>
                  <S.Spinner />
                  <S.LoadingText>Processing interaction...</S.LoadingText>
                </S.LoadingContent>
              </S.LoadingState>
            )}

            {/* Error State */}
            {/* {error && (
                  <S.ErrorState>
                    <S.ErrorContent>
                      <AlertTriangle size={20} style={{ color: "#f87171" }} />
                      <S.ErrorText>{error}</S.ErrorText>
                    </S.ErrorContent>
                  </S.ErrorState>
                )} */}

            {/* Interaction Result */}
            {interactionResult && (
              <S.ResultSection>
                <S.ResultTitle>Interaction Result</S.ResultTitle>
                <S.ResultContent>
                  <S.ResultText>{interactionResult}</S.ResultText>
                </S.ResultContent>
              </S.ResultSection>
            )}
          </S.Panel>
        </S.Grid>
      </S.Container>
    </S.AppContainer>
  );
}

export default App;
