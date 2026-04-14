'use client';

import React from 'react';
import { inputStyle, fonts, colors } from '@/lib/styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 4,
            fontFamily: fonts.body,
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          ...inputStyle,
          borderColor: error ? colors.danger : colors.border,
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 12, color: colors.danger, marginTop: 2 }}>
          {error}
        </span>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, style, ...props }: TextareaProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 4,
            fontFamily: fonts.body,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        style={{
          ...inputStyle,
          minHeight: 80,
          resize: 'vertical',
          borderColor: error ? colors.danger : colors.border,
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 12, color: colors.danger, marginTop: 2 }}>
          {error}
        </span>
      )}
    </div>
  );
}
