'use client';

import { useState } from 'react';
import styles from './HarnessPipelineVisualizer.module.css';

interface PipelineStep {
  id: number;
  label: string;
  sublabel: string;
  latency: string;
  detail: string;
}

const STEPS: PipelineStep[] = [
  { id: 1, label: 'User Query', sublabel: 'Tokenized Context', latency: '0.2ms', detail: 'Token hóa câu hỏi, trích xuất mã bài học và mức CEFR hiện tại của học viên.' },
  { id: 2, label: 'Intent Router', sublabel: 'Hybrid Classification', latency: '3.4ms', detail: 'Phân luồng tự động tới Grammar Coach, Reading Assistant hoặc Exam Analyst.' },
  { id: 3, label: 'Semantic Cache', sublabel: 'Redis Vector Match', latency: '8.1ms', detail: 'Quét kho đệm tri thức. Cache Hit rút ngắn 90% thời gian phản hồi.' },
  { id: 4, label: 'Agent Orchestration', sublabel: 'Multi-Turn State Machine', latency: '42.0ms', detail: 'Nạp bộ nhớ lịch sử lỗi sai cá nhân hóa và áp dụng quy tắc sư phạm.' },
  { id: 5, label: 'Critic & Validator', sublabel: 'Pedagogical Verification', latency: '12.5ms', detail: 'Kiểm duyệt chất lượng giải thích, chống ảo giác kiến thức (Anti-hallucination).' },
  { id: 6, label: 'SSE UI Stream', sublabel: 'Structured Response', latency: 'Stream', detail: 'Truyền tải từng khối ngữ pháp, đáp án và bài tập gợi ý về màn hình.' },
];

export default function HarnessPipelineVisualizer() {
  const [activeStep, setActiveStep] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('Giải thích bẫy giả định thức trong đề TOEIC #104');

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let current = 1;
    setActiveStep(1);

    const interval = setInterval(() => {
      current += 1;
      if (current > 6) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStep(current);
      }
    }, 450);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.badge}>8-STATE HARNESS ENGINE</span>
          <h3>Trình Phân Luồng AI Đa Tác Nhân Theo Thời Gian Thực</h3>
        </div>
        <button
          type="button"
          className={styles.simButton}
          onClick={runSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <span className={styles.spinner} />
              <span>Đang truyền xung...</span>
            </>
          ) : (
            <>
              <span>▶</span>
              <span>Chạy thử mô phỏng Prompt</span>
            </>
          )}
        </button>
      </div>

      <div className={styles.promptBar}>
        <span className={styles.promptLabel}>Prompt mẫu:</span>
        <input
          type="text"
          value={selectedPrompt}
          onChange={(e) => setSelectedPrompt(e.target.value)}
          className={styles.promptInput}
          placeholder="Nhập prompt để thử nghiệm luồng xử lý..."
        />
      </div>

      <div className={styles.pipelineTrack}>
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isPassed = activeStep > step.id;
          let nodeClass = styles.node;
          if (isActive) nodeClass += ` ${styles.nodeActive}`;
          if (isPassed) nodeClass += ` ${styles.nodePassed}`;

          return (
            <div
              key={step.id}
              className={nodeClass}
              onClick={() => setActiveStep(step.id)}
            >
              <div className={styles.nodeHeader}>
                <span className={styles.nodeNumber}>0{step.id}</span>
                <span className={styles.nodeLatency}>{step.latency}</span>
              </div>
              <div className={styles.nodeName}>{step.label}</div>
              <div className={styles.nodeSub}>{step.sublabel}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.detailBox}>
        <div className={styles.detailHeader}>
          <strong>Trạng thái Node {activeStep}: {STEPS[activeStep - 1].label}</strong>
          <span className={styles.detailLatency}>Độ trễ: {STEPS[activeStep - 1].latency}</span>
        </div>
        <p className={styles.detailText}>{STEPS[activeStep - 1].detail}</p>
      </div>
    </div>
  );
}
