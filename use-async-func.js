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

const useAsyncFn = (fn, fnArgs = [], initialData) => {

  // useState to manage the async func arguments.
  // useEffect will consider `args` when deciding whether to skip a re-render
  const [args, setArgs] = useState(fnArgs);

  // useReducer to manage the local complex state of the async func hook lifecycle
  const [state, dispatch] = useReducer(asyncReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const callAsyncFn = async () => {
      // Begin each async func call with a clean slate.
      dispatch({ type: 'ASYNC_INIT' });

      try {
        // Because this is a generic hook for any async func, just call the function with the args!
        const result = await fn(...args);

        // Set success with result
        if (!didCancel) {
          dispatch({ type: 'ASYNC_SUCCESS', payload: result });
        }
      } catch (error) {
        // Otherwise, set failure
        if (!didCancel) {
          dispatch({ type: 'ASYNC_FAILURE' });
        }
      }
    };

    // Actual invocation
    callAsyncFn();

    // Cleanup function to optionally prevent setting state for unmounted component.
    // Ref: https://reactjs.org/docs/hooks-effect.html#example-using-hooks-1
    // Ref: https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component
    return () => {
      didCancel = true;
    };

    // Skip re-render if args do not change.
  }, [args]);

  return [state, setArgs];
};

export default useAsyncFn;
