import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="ThinkAI Logo" className={styles.brandLogo} />
              <span className={styles.logoText}>
                ThinkAI<span className={styles.brandSup}>®</span>
              </span>
            </div>
            <p className={styles.tagline}>
              Nền tảng luyện thi TOEIC & IELTS thông minh với AI Tutor đa tác nhân và phân tích lỗ hổng kiến thức thời gian thực.
            </p>
            <Link href="/maintenance" className={styles.statusBadge}>
              <span className={styles.statusDot} style={{ background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
              <span>Thông báo: Tạm dừng dịch vụ</span>
            </Link>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h4>Học Tập</h4>
              <ul>
                <li><Link href="/courses">Khóa học</Link></li>
                <li><Link href="/exams">Luyện thi mô phỏng</Link></li>
                <li><Link href="/ai-tutor">AI Tutor 24/7</Link></li>
                <li><Link href="/payment">Gói thành viên</Link></li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <h4>Nền Tảng</h4>
              <ul>
                <li><Link href="/dashboard">Bảng điều khiển</Link></li>
                <li><Link href="/teacher">Khu vực Giảng viên</Link></li>
                <li><Link href="/profile">Hồ sơ năng lực</Link></li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <h4>Hỗ Trợ & Pháp Lý</h4>
              <ul>
                <li><Link href="/maintenance">Thông báo bảo trì</Link></li>
                <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
                <li><Link href="/privacy">Chính sách bảo mật</Link></li>
                <li><Link href="/terms">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p>© 2026 ThinkAI Learning Platform. Engineered with Spring Boot 3, Next.js & Kubernetes.</p>
        </div>
      </div>
    </footer>
  );
}
