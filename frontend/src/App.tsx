import { useRef, useState } from "react";
import * as S from "./App.style";
import { sampleData } from "./sample";
import { themeColors } from "./App.style";
import AntagonisticResultPanel from "./interaction/AntagonisticResultPanel";
import LivingPapersResultPanel from "./interaction/LivingPapersResultPanel";
import type { InfiniteItem } from "./types/InfiniteItem";
import InfiniteResultPanel from "./interaction/InfiniteResultPanel";
import LivingCodesResultPanel from "./interaction/LivingCodesResultPanel";

const API_ENDPOINT = "https://image-538250612271.asia-northeast3.run.app";
const WS_ENDPOINT = "wss://image-538250612271.asia-northeast3.run.app";
// const API_ENDPOINT = "http://localhost:8000";
// const WS_ENDPOINT = "ws://localhost:8000";

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
    if (idx === 3) setInteractionResult("");
    setIdeas([]);
  };

  const handleInteractionClick = async (interactionType: string) => {
    setLoading(true);
    setSelectedInteraction(interactionType);

    if (interactionType === "living-codes") {
      setInteractionResult("");
    } else if (interactionType === "infinite-generation") {
      setWsConnected(false);
      console.log(wsConnected);
    } else {
      const response = await fetch(
        `${API_ENDPOINT}/api/interactions/${interactionType}`,
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
      `${WS_ENDPOINT}/ws/interactions/infinite-generation`
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
            <S.PanelTitle>Current Analysis</S.PanelTitle>
            <S.DataItemsContainer>
              {sampleData.map((item, idx) => (
                <S.DataItemCard
                  key={idx}
                  isSelected={selectedIndex === idx}
                  themeKey={item.theme}
                  onClick={() => handleItemClick(idx)}
                >
                  <S.ItemHeader>
                    <S.ItemSubTitle>Theme</S.ItemSubTitle>
                    <S.ItemType
                      style={{
                        color: themeColors[item.theme]?.color || "#fff",
                      }}
                    >
                      {item.theme}
                    </S.ItemType>
                  </S.ItemHeader>
                  <S.ItemCodeHeader>
                    <S.ItemSubTitle>Code</S.ItemSubTitle>
                    <S.ItemTitle>{item.code}</S.ItemTitle>
                  </S.ItemCodeHeader>

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
            {selectedInteraction === "living-codes" && (
              <LivingCodesResultPanel />
            )}
          </S.Panel>
        </S.Grid>
      </S.Container>
    </S.AppContainer>
  );
}

export default App;
