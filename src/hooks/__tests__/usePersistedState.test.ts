import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { usePersistedState } from '../usePersistedState';

describe('usePersistedState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default value when no stored value exists', () => {
    const { result } = renderHook(() => usePersistedState('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('initializes with stored value when it exists', () => {
    localStorage.setItem('test', JSON.stringify('stored'));
    const { result } = renderHook(() => usePersistedState('test', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates localStorage when state changes', () => {
    const { result } = renderHook(() => usePersistedState('test', 'default'));
    
    act(() => {
      result.current[1]('new value');
    });

    expect(localStorage.getItem('test')).toBe(JSON.stringify('new value'));
  });

  it('handles complex objects', () => {
    const initialValue = { foo: 'bar', count: 42 };
    const { result } = renderHook(() => usePersistedState('test', initialValue));
    
    const newValue = { foo: 'baz', count: 43 };
    act(() => {
      result.current[1](newValue);
    });

    expect(JSON.parse(localStorage.getItem('test')!)).toEqual(newValue);
  });

  it('handles null values', () => {
    const { result } = renderHook(() => usePersistedState('test', 'default'));
    
    act(() => {
      result.current[1](null as any);
    });

    expect(localStorage.getItem('test')).toBeNull();
  });

  it('uses custom serializer and deserializer', () => {
    const serialize = (value: number) => value.toString(16); // Convert to hex
    const deserialize = (value: string) => parseInt(value, 16); // Parse from hex
    
    const { result } = renderHook(() => 
      usePersistedState('test', 255, serialize, deserialize)
    );

    expect(result.current[0]).toBe(255);
    expect(localStorage.getItem('test')).toBe('ff');

    act(() => {
      result.current[1](128);
    });

    expect(localStorage.getItem('test')).toBe('80');
  });

  it('handles invalid stored JSON', () => {
    localStorage.setItem('test', 'invalid json');
    const { result } = renderHook(() => usePersistedState('test', 'default'));
    expect(result.current[0]).toBe('default');
  });
});