import { renderHook } from '@testing-library/react-hooks'

import useAsyncFunc from '../use-async-func';

describe('useAsyncFunc', () => {
  it('should provide initial and success state', async () => {
    const mockAsyncFn = () => {
      setTimeout(() => { }, 500);
      return Promise.resolve('foo');
    };
    const { result, waitForNextUpdate } = renderHook(() => useAsyncFunc(mockAsyncFn));
    // useAsyncFunc returns [state, setArgs]
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
    const { result, waitForNextUpdate } = renderHook(() => useAsyncFunc(mockAsyncIncrementFn, [5]));
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

  it.skip('should accept default data', async () => {
    //
  });

  it('should return an error state upon failure', async () => {
    const mockAsyncFnWithError = jest.fn().mockImplementation(() => Promise.reject());
    const { result, waitForNextUpdate } = renderHook(() => useAsyncFunc(mockAsyncFnWithError));
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