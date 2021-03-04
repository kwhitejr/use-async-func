import { renderHook } from '@testing-library/react-hooks'

import useAsyncFn from '../use-async-func';

describe('useAsyncFn', () => {
  it('should provide initial and success state', async () => {
    const mockAsyncFn = () => {
      setTimeout(() => { }, 500);
      return Promise.resolve('foo');
    };
    const { result, waitForNextUpdate } = renderHook(() => useAsyncFn(mockAsyncFn));
    // useAsyncFn returns [state, setArgs]
    expect(result.current[0]).toMatchObject({
      isLoading: true,
      isError: false,
      data: undefined
    });
    await waitForNextUpdate();
    expect(result.current[0]).toMatchObject({
      isLoading: false,
      isError: false,
      data: 'foo'
    });
  });

  it('should resolve async function that accepts arguments', async () => {
    const mockAsyncIncrementFn = (int) => {
      setTimeout(() => { }, 500);
      return Promise.resolve(++int);
    };
    const { result, waitForNextUpdate } = renderHook(() => useAsyncFn(mockAsyncIncrementFn, [5]));
    expect(result.current[0]).toMatchObject({
      isLoading: true,
      isError: false,
      data: undefined
    });
    await waitForNextUpdate();
    expect(result.current[0]).toMatchObject({
      isLoading: false,
      isError: false,
      data: 6
    });
  });

  it('should accept default data', async () => {
    const mockAsyncFnWithError = jest.fn().mockImplementation(() => Promise.reject());
    const { result, waitForNextUpdate } = renderHook(() => useAsyncFn(mockAsyncFnWithError));
    expect(result.current[0]).toMatchObject({
      isLoading: true,
      isError: false,
      data: undefined
    });
    await waitForNextUpdate();
    expect(result.current[0]).toMatchObject({
      isLoading: false,
      isError: true,
      data: undefined
    });
  });
})