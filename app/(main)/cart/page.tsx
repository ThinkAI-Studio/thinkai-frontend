'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dashboardStyles from '../dashboard/page.module.css';
import MainSidebar from '../components/MainSidebar';
import styles from './page.module.css';
import PageState from '@/components/ui/PageState';
import Button from '@/components/ui/Button';
import { FadeIn } from '@/components/tai/FadeIn';
import { formatVnd } from '@/lib/utils/format';
import { getCart, removeFromCart, clearCart, createPaymentLink, type CartItem } from '@/services/courses';

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [cartNotice, setCartNotice] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (!cartNotice) return;
    const timer = setTimeout(() => setCartNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [cartNotice]);

  const loadCart = async () => {
    try {
      const cart = await getCart();
      setItems(cart.items || []);
      setSelectedItems(new Set((cart.items || []).map((item: CartItem) => item.courseId)));
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleToggleItem = (courseId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.courseId)));
    }
  };

  const handleRemove = async (courseId: number) => {
    setRemoving(courseId);
    try {
      const cart = await removeFromCart(courseId);
      setItems(cart.items || []);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
      setCartNotice({ type: 'info', text: 'Đã xóa khóa học khỏi giỏ hàng.' });
      await loadCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setCartNotice({ type: 'error', text: 'Không thể xóa khóa học khỏi giỏ. Vui lòng thử lại.' });
    } finally {
      setRemoving(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setItems([]);
      setSelectedItems(new Set());
      setCartNotice({ type: 'info', text: 'Đã làm trống giỏ hàng thành công.' });
    } catch (err) {
      console.error('Error clearing cart:', err);
      setCartNotice({ type: 'error', text: 'Không thể xóa toàn bộ giỏ hàng.' });
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      setCartNotice({ type: 'error', text: 'Vui lòng chọn ít nhất 1 khóa học để thanh toán.' });
      return;
    }

    setCheckingOut(true);
    try {
      const selectedCourseIds = Array.from(selectedItems);
      const firstCourseId = selectedCourseIds[0];

      const payment = await createPaymentLink(firstCourseId);

      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
        return;
      }

      if (payment.status === 'COMPLETED') {
        await loadCart();
        setCartNotice({ type: 'success', text: 'Khóa học đã được kích hoạt thành công.' });
        setTimeout(() => router.push(`/courses/${firstCourseId}`), 1200);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setCartNotice({ type: 'error', text: err.message || 'Có lỗi xảy ra khi tạo liên kết thanh toán.' });
    } finally {
      setCheckingOut(false);
    }
  };

  const selectedTotal = items
    .filter((item) => selectedItems.has(item.courseId))
    .reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return (
      <div className={dashboardStyles.container}>
        <MainSidebar active="cart" />
        <main className={`${dashboardStyles.main} ${styles.main}`}>
          <PageState type="loading" message="Đang tải giỏ hàng..." />
        </main>
      </div>
    );
  }

  const noticeClass =
    cartNotice?.type === 'error'
      ? `${styles.notice} ${styles.noticeError}`
      : cartNotice?.type === 'success'
        ? `${styles.notice} ${styles.noticeSuccess}`
        : `${styles.notice} ${styles.noticeInfo}`;

  return (
    <div className={dashboardStyles.container}>
      <MainSidebar active="cart" />
      <main className={`${dashboardStyles.main} ${styles.main}`}>
        <FadeIn>
          <section className={styles.hero}>
            <h1>
              Giỏ hàng
              <br />
              <em>của bạn</em>
            </h1>
            <p>Kiểm tra danh sách khóa học và tiến hành thanh toán an toàn qua PayOS.</p>
          </section>
        </FadeIn>

        {cartNotice && (
          <div className={noticeClass} role="status">
            <span>{cartNotice.text}</span>
            <button
              type="button"
              className={styles.noticeClose}
              onClick={() => setCartNotice(null)}
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <PageState
            type="empty"
            message="Giỏ hàng của bạn đang trống"
            actionLabel="Khám phá khóa học ngay"
            onAction={() => router.push('/courses')}
          />
        ) : (
          <div className={styles.layout}>
            {/* Left Items Section */}
            <div className={styles.itemsSection}>
              {/* Action Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <Button variant="secondary" size="sm" onClick={toggleSelectAll}>
                    {selectedItems.size === items.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                  <span className={styles.toolbarCount}>
                    Đã chọn <strong>{selectedItems.size}</strong> / {items.length} khóa học
                  </span>
                </div>
                <Button variant="secondary" size="sm" onClick={handleClearCart}>
                  Xóa tất cả
                </Button>
              </div>

              {/* Items List */}
              {items.map((item) => {
                const isSelected = selectedItems.has(item.courseId);
                return (
                  <div
                    key={item.courseId}
                    className={`${styles.cartItem} ${isSelected ? styles.cartItemSelected : ''}`}
                    onClick={() => handleToggleItem(item.courseId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleToggleItem(item.courseId);
                      }
                    }}
                  >
                    <div className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                      {isSelected ? '✓' : ''}
                    </div>

                    <div
                      className={styles.thumbnail}
                      style={
                        item.thumbnailUrl
                          ? {
                              backgroundImage: `url(${item.thumbnailUrl})`,
                            }
                          : undefined
                      }
                    >
                      {!item.thumbnailUrl && 'LUMINA'}
                    </div>

                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.courseTitle}</h3>
                      <p className={styles.itemInstructor}>Giảng viên: {item.instructorName || 'ThinkAI Team'}</p>
                      <p className={styles.itemPrice}>{formatVnd(item.price)}</p>
                    </div>

                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.courseId);
                      }}
                      disabled={removing === item.courseId}
                      title="Xóa khóa học khỏi giỏ"
                      aria-label={`Xóa khóa học ${item.courseTitle}`}
                    >
                      {removing === item.courseId ? '…' : '✕'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Sticky Checkout Summary */}
            <aside className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Tổng thanh toán</h2>

              <div className={styles.summaryRow}>
                <span>Số khóa học chọn:</span>
                <strong>{selectedItems.size} khóa</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Gia sư AI 24/7 kèm theo:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Bao gồm miễn phí</span>
              </div>

              <div className={styles.summaryDivider} />

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tổng cộng:</span>
                <span className={styles.totalValue}>{formatVnd(selectedTotal)}</span>
              </div>

              <button
                type="button"
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={checkingOut || selectedItems.size === 0}
              >
                {checkingOut ? (
                  'Đang xử lý kết nối...'
                ) : (
                  <>
                    <span>Thanh toán ngay ({selectedItems.size})</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <div className={styles.guarantee}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Thanh toán bảo mật chuẩn SSL qua PayOS</span>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
