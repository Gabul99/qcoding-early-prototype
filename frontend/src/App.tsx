import React, { useState } from "react";
import { Palette } from "lucide-react";
import * as S from "./App.style";
import { sampleData } from "./sample";

// theme별 색상 매핑 (App.style.ts에서 import)
import { themeColors } from "./App.style";
import AntagonisticResultPanel from "./interaction/AntagonisticResultPanel";
import LivingPapersResultPanel from "./interaction/LivingPapersResultPanel";

const sampleResult = [
  {
    author: "Gustavo Morales",
    title:
      "From deliberation to acclamation: how did Twitter’s algorithms foster polarized communities and undermine democracy in the 2020 US presidential election",
    target: "theme",
    sentiment_emoji: "😐",
    response:
      "Your themes focus on direct insults and violence, but our work examines algorithm-mediated mixed-reality practices. How do you link these personal hate-speech themes back to acclamation vs. deliberation or the co-retweet network structure that amplifies them?",
  },
  {
    author: "Akshay Verma",
    title: "How U.S. Presidential elections strengthen global hate networks",
    target: "RQ",
    sentiment_emoji: "😕",
    response:
      "Your analysis categorizes individual tweets but misses our network-of-networks view and Telegram’s binding role. How does your framing address cross-platform link dynamics or the clustering metrics (e.g. assortativity, clustering coefficient) we identified around election events?",
  },
  {
    author: "Nina Gorenc",
    title: "Hate speech or free speech: an ethical dilemma?",
    target: "RQ",
    sentiment_emoji: "😟",
    response:
      "You highlight insult patterns, but don’t address the tension between free expression and protecting human dignity. How would you justify legal limits on violent or dehumanizing metaphors in light of the EU’s hate-speech definitions and our survey’s finding of widespread under-recognition?",
  },
  {
    author: "Lara Grimminger",
    title:
      "Hate Towards the Political Opponent: A Twitter Corpus Study of the 2020 US Elections on the Basis of Offensive Speech and Stance Detection",
    target: "raw data",
    sentiment_emoji: "😊",
    response:
      "Great identification of insult themes—but did you map these onto our stance labels (Favor, Against, Neither, Mixed, Neutral)? For instance, how do your ‘moron’ or ‘wipe’ examples correlate with ‘Against’ vs. ‘Mixed’ stance in our corpus?",
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
            {!loading && interactionResult && (
              <S.ResultArea>
                {selectedInteraction === "antagonistic" && (
                  <AntagonisticResultPanel
                    interactionResult={interactionResult}
                  />
                )}
                {selectedInteraction === "living-papers" && (
                  <LivingPapersResultPanel
                    interactionResult={interactionResult}
                  />
                )}
                {selectedInteraction !== "antagonistic" &&
                  selectedInteraction !== "living-papers" && (
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
