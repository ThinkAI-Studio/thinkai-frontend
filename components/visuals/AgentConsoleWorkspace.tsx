'use client';

import { useState } from 'react';
import styles from './AgentConsoleWorkspace.module.css';

interface AgentProfile {
  id: string;
  index: string;
  name: string;
  role: string;
  latency: string;
  specialty: string;
  sampleInput: string;
  thoughtChain: string[];
  output: string;
}

const AGENTS: AgentProfile[] = [
  {
    id: 'reading',
    index: '01',
    name: 'Reading Coach',
    role: 'Lexical Density & Inference Agent',
    latency: '18ms',
    specialty: 'Phân tích văn bản phức tạp Part 6 & 7, phát hiện từ đồng nghĩa bẫy.',
    sampleInput: 'Phân tích đoạn văn bản email tuyển dụng Part 7 và trích xuất yêu cầu kinh nghiệm ẩn.',
    thoughtChain: [
      '[1/3] Quét cấu trúc cú pháp đoạn 2: "minimum 3 years in commercial software".',
      '[2/3] Đối chiếu với câu hỏi trắc nghiệm Q178: Loại trừ bẫy "freelance project experience".',
      '[3/3] Trích xuất bằng chứng suy luận (Evidence span) tại dòng 14.'
    ],
    output: '✓ Đáp án C chính xác. Bằng chứng nằm ở cụm từ "proven track record in enterprise deployments", tương đương ngữ nghĩa với "commercial software experience".'
  },
  {
    id: 'grammar',
    index: '02',
    name: 'Grammar Critic',
    role: 'Syntactic Invariant Engine',
    latency: '8ms',
    specialty: 'Bắt bẫy cấu trúc câu Part 5: Bàng thái cách, đảo ngữ, rút gọn mệnh đề quan hệ.',
    sampleInput: 'Giải thích câu giả định thức: The manager insisted that he _______ on time.',
    thoughtChain: [
      '[1/3] Nhận diện động từ mệnh lệnh/yêu cầu: "insisted that".',
      '[2/3] Kiểm tra quy tắc bàng thái cách hiện tại: S + insist that + S + (should) + V-bare.',
      '[3/3] Loại bỏ biến thể chia thì "is" hoặc "was".'
    ],
    output: '✓ Đáp án: "be". Trong mệnh đề sau "insist that", động từ luôn ở dạng nguyên mẫu không "to", không phụ thuộc vào chủ ngữ ngôi thứ 3 số ít.'
  },
  {
    id: 'listening',
    index: '03',
    name: 'Listening Explainer',
    role: 'Acoustic Phoneme & Accent Engine',
    latency: '24ms',
    specialty: 'Giải mã hiện tượng nuốt âm (Elision), nối âm (Linking) và biến âm giữa các chất giọng.',
    sampleInput: 'Tại sao trong audio giọng Úc nghe "water" lại giống "wada"?',
    thoughtChain: [
      '[1/3] Trích xuất dạng sóng âm thanh tại 00:03: Âm /t/ nằm giữa 2 nguyên âm.',
      '[2/3] Nhận diện hiện tượng biến âm Flapped T (/ɾ/) trong ngữ điệu tự nhiên.',
      '[3/3] Tạo bài tập tương phản phát âm giữa giọng US, UK và AUS.'
    ],
    output: '✓ Hiện tượng Flapping: Âm /t/ khi đứng giữa 2 nguyên âm và không mang trọng âm sẽ được phát âm mềm như âm /d/ nhẹ trong tiếng Việt.'
  },
  {
    id: 'memory',
    index: '04',
    name: 'Cognitive Memory',
    role: 'Weakness Tracking & Spaced Repetition',
    latency: '12ms',
    specialty: 'Theo dõi chu kỳ quên Ebbinghaus, tự động đẩy bài tập bù đắp vào phiên học tiếp theo.',
    sampleInput: 'Tổng kết lỗ hổng kiến thức sau bài thi thử TOEIC Mini-Test #4.',
    thoughtChain: [
      '[1/3] Quét lịch sử 50 câu: Tỉ lệ sai tập trung 40% ở chuyên đề Mệnh đề quan hệ rút gọn.',
      '[2/3] Cập nhật Vector Memory: Gán nhãn điểm yếu "Reduced Relative Clauses".',
      '[3/3] Sinh danh sách 5 câu drill mục tiêu cho ngày mai.'
    ],
    output: '✓ Đã cập nhật hồ sơ học tập. Bạn có 3 câu sai thuộc bẫy phân từ quá khứ (V-ed). Hệ thống đã tự động lên lịch 5 câu luyện tập vào lúc 20:00 tối mai.'
  }
];

export default function AgentConsoleWorkspace() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('grammar');
  const [isExecuting, setIsExecuting] = useState(false);

  const activeAgent = AGENTS.find((a) => a.id === selectedAgentId) || AGENTS[0];

  const handleTrigger = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 600);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.sysTag}>[SYS.02] · AGENT WORKSPACE</span>
          <h3>Bàn Điều Khiển Đa Tác Nhân (Agent Console)</h3>
        </div>
        <div className={styles.telemetryStatus}>
          <span className={styles.statusDot} />
          <span>4 AGENTS ONLINE · LATENCY: {activeAgent.latency}</span>
        </div>
      </div>

      <div className={styles.workspaceGrid}>
        {/* Left: 4 Agent Cards */}
        <div className={styles.agentSelector}>
          {AGENTS.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            return (
              <div
                key={agent.id}
                className={`${styles.agentCard} ${isSelected ? styles.agentCardActive : ''}`}
                onClick={() => {
                  setSelectedAgentId(agent.id);
                  handleTrigger();
                }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.agentIndex}>{agent.index}</span>
                  <span className={styles.agentLatency}>{agent.latency}</span>
                </div>
                <h4 className={styles.agentName}>{agent.name}</h4>
                <p className={styles.agentRole}>{agent.role}</p>
                <span className={styles.agentSpecialty}>{agent.specialty}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Live Cognitive Terminal */}
        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalTabs}>
              <span className={styles.termTab}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginRight: '8px', verticalAlign: 'middle', boxShadow: '0 0 8px #10b981' }} />
                {activeAgent.name.toUpperCase()} · LIVE COGNITIVE TRACE
              </span>
            </div>
            <button
              type="button"
              className={styles.triggerBtn}
              onClick={handleTrigger}
              disabled={isExecuting}
            >
              {isExecuting ? 'Đang phân tích...' : 'Gửi Test Query →'}
            </button>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.queryRow}>
              <span className={styles.promptPrefix}>INPUT &gt;</span>
              <span className={styles.queryText}>{activeAgent.sampleInput}</span>
            </div>

            <div className={styles.thoughtSection}>
              <span className={styles.thoughtTitle}>CHAIN OF THOUGHT (SUY LUẬN NỘI TẠI):</span>
              <div className={styles.thoughtList}>
                {activeAgent.thoughtChain.map((step, idx) => (
                  <div key={idx} className={styles.thoughtStep}>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.outputSection}>
              <span className={styles.outputTitle}>RESPONSE DELTA (KẾT QUẢ SƯ PHẠM):</span>
              <p className={styles.outputText}>{activeAgent.output}</p>
            </div>
          </div>

          <div className={styles.terminalFooter}>
            <span>Model: ThinkAI-Harness-v3</span>
            <span>Zero-Hallucination: Verified ✓</span>
            <span>Format: Structured JSON / SSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
