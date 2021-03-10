import { useState, useEffect, useReducer } from "react"

// Reducer helps manage complex local state.
const asyncReducer = (state, action) => {
  switch (action.type) {
    case 'ASYNC_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'ASYNC_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'ASYNC_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const useAsyncFunc = (fn, fnArgs = [], initialData) => {
  const [args, setArgs] = useState(fnArgs);

  const [state, dispatch] = useReducer(asyncReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const callAsyncFn = async () => {
      dispatch({ type: 'ASYNC_INIT' });

      try {
        const result = await fn(...args);

        if (!didCancel) {
          dispatch({ type: 'ASYNC_SUCCESS', payload: result });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'ASYNC_FAILURE' });
        }
      }
    };

    callAsyncFn();

    return () => {
      didCancel = true;
    };

  }, [fn, args]);

  return [state, setArgs];
};

export default useAsyncFunc;
