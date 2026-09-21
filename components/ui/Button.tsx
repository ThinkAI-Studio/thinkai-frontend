import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warm' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
  error?: boolean;
  success?: boolean;
  iconOnly?: boolean;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '',
  loading = false,
  error = false,
  success = false,
  iconOnly = false,
  disabled,
  ...props 
}: ButtonProps) {
  const isDisabled = disabled || loading;
  
  return (
    <button 
      className={`
        ${styles.btn} 
        ${styles[variant]} 
        ${styles[size]} 
        ${error ? styles.error : ''}
        ${success ? styles.success : ''}
        ${loading ? styles.loading : ''}
        ${iconOnly ? styles.iconOnly : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" className={styles.spinnerSvg}>
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="30 10" />
          </svg>
        </span>
      )}
      {success && (
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
      )}
      <span className={loading ? styles.contentHidden : ''}>
        {children}
      </span>
    </button>
  );
}
