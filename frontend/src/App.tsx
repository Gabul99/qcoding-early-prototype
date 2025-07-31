import React, { useState } from "react";
import { Palette } from "lucide-react";
import * as S from "./App.style";
import { sampleData } from "./sample";

// theme별 색상 매핑 (App.style.ts에서 import)
import { themeColors } from "./App.style";
import AntagonisticResultPanel from "./interaction/AntagonisticResultPanel";

const sampleResult = [
  {
    mode: "Criticize the RQ",
    target: "RQ",
    response:
      "Your RQ assumes users consciously justify hate speech. How about exploring unconscious drivers or network influences? The current question feels narrow and teleological.",
  },
  {
    mode: "Disagree with theme",
    target: "Theme: Emotional justification",
    response:
      "Calling tweets ‘Emotional justification’ reduces complex identity performance to mere feelings. Isn’t this more about collective venting rituals or moral grandstanding rather than simple ‘justification’?",
  },
  {
    mode: "Disagree with code",
    target: "Code: ‘moron’ under incompetence",
    response:
      "Lumping ‘moron’ into competence-based denigration misses the condescending humor element. Doesn’t this code belong in an ‘undermining through ridicule’ category instead?",
  },
  {
    mode: "Suggest new qualitative model",
    target: "overall analysis",
    response:
      "Why not apply discursive psychology to reveal how hate speech functions in interaction sequences rather than thematic abstraction? This could unearth dynamic rhetorical strategies you’re overlooking.",
  },
  {
    mode: "Personal shame",
    target: "overall analysis",
    response:
      "Wow, four themes and zero nuance—did you use a random theme generator? This feels like a first-year undergrad attempt at coding qualitative data.",
  },
];

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
    setLoading(true);
    setSelectedInteraction(interactionType);
    const response = await fetch(
      `http://localhost:8000/api/interactions/${interactionType}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    setInteractionResult(`${data.result}`);
    // setInteractionResult(JSON.stringify(sampleResult));
    setLoading(false);
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
              <S.ResultArea>
                {selectedInteraction === "antagonistic" && (
                  <AntagonisticResultPanel
                    interactionResult={interactionResult}
                  />
                )}
                {selectedInteraction !== "antagonistic" && (
                  <S.ResultSection>
                    <S.ResultTitle>Interaction Result</S.ResultTitle>
                    <S.ResultContent>
                      <S.ResultText>{interactionResult}</S.ResultText>
                    </S.ResultContent>
                  </S.ResultSection>
                )}
              </S.ResultArea>
            )}
          </S.Panel>
        </S.Grid>
      </S.Container>
    </S.AppContainer>
  );
}

export default App;
