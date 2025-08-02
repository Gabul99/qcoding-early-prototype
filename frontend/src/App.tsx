import React, { useRef, useState } from "react";
import { Palette } from "lucide-react";
import * as S from "./App.style";
import { sampleData } from "./sample";
import { themeColors } from "./App.style";
import AntagonisticResultPanel from "./interaction/AntagonisticResultPanel";
import LivingPapersResultPanel from "./interaction/LivingPapersResultPanel";
import type { InfiniteItem } from "./types/InfiniteItem";
import InfiniteResultPanel from "./interaction/InfiniteResultPanel";

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
  const [wsConnected, setWsConnected] = useState(false);
  const [ideas, setIdeas] = useState<InfiniteItem[]>([]);
  const [streaming, setStreaming] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
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
    setInteractionResult("");
    setIdeas([]);
  };

  const handleInteractionClick = async (interactionType: string) => {
    setLoading(true);
    setSelectedInteraction(interactionType);

    if (interactionType === "infinite-generation") {
      setWsConnected(false);
    } else {
      const response = await fetch(
        `http://localhost:8000/api/interactions/${interactionType}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setInteractionResult(`${data.result}`);
      // setInteractionResult(JSON.stringify(sampleResult));
    }

    setLoading(false);
  };

  const openWebSockerForInfiniteGeneration = () => {
    /** 1-a. 이미 열려 있던 소켓 닫기 */
    if (wsRef.current) {
      wsRef.current.close();
    }

    /** 1-b. 새 소켓 연결 */
    const socket = new WebSocket(
      "ws://localhost:8000/ws/interactions/infinite-generation"
    );
    wsRef.current = socket;

    socket.onopen = () => {
      setWsConnected(true); // 상태표시용
      setStreaming(true);
      console.log("connected");
      if (selectedIndex === null) return;

      // 선택된 데이터로 start 메시지 전송
      const sel = sampleData[selectedIndex];
      socket.send(
        JSON.stringify({
          cmd: "start",
          selection: {
            raw: sel.rawTweet,
            code: sel.code,
            theme: sel.theme,
          },
        })
      );
    };

    // ⚠️ 다음 단계에서 onmessage·pause/resume 처리 예정
    socket.onmessage = (e) => {
      console.log("WS message:", e.data);
      const obj = JSON.parse(e.data);
      setIdeas((prev) => [...prev, obj]);
    };
    socket.onclose = () => setWsConnected(false);
    socket.onerror = () => setWsConnected(false);

    return; // fetch 로직 건너뜀
  };

  const stopInfiniteGeneration = () => {
    if (!wsRef.current) return;

    // 서버에 “stop” 알림
    wsRef.current.send(JSON.stringify({ cmd: "stop" }));
    setTimeout(() => wsRef.current?.close(), 200);

    // UI 상태 리셋
    setStreaming(false);
    setWsConnected(false);
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
                {selectedInteraction === "living-codes" && (
                  <S.ResultSection>
                    <S.ResultTitle>Interaction Result</S.ResultTitle>
                    <S.ResultContent>
                      <S.ResultText>{interactionResult}</S.ResultText>
                    </S.ResultContent>
                  </S.ResultSection>
                )}
              </S.ResultArea>
            )}
            {selectedInteraction === "infinite-generation" && (
              <InfiniteResultPanel
                selectedItem={
                  selectedIndex === null ? null : sampleData[selectedIndex]
                }
                ideas={ideas}
                onStart={() => openWebSockerForInfiniteGeneration()}
                onStop={() => stopInfiniteGeneration()}
                streaming={streaming}
              />
            )}
          </S.Panel>
        </S.Grid>
      </S.Container>
    </S.AppContainer>
  );
}

export default App;
