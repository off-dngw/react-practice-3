// 커스텀훅 만들기

import { useCallback, useState } from "react";

function useAsync(asyncFunction) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  // 네트워크 req 보낼때 사용할 함수

  const wrappedFunction = useCallback(
    async (...args) => {
      /*
    try catch 문에서 비동기 처리를 하면서 asyncFunction 함수를 실행 시킵니다.
    asyncFunction은 기존에 우리가 사용하던 api 함수에 해당된다고 생각하시면 됩니다.
    asyncFunction은 실제로 req를 보내는 함수가 됩니다.
    asyncFunction의 리턴값을 그대로 return 해줍니다. 
    우리가 원하는 기능을 덮어씌우는 함수라는 의미에서 wrappedFunction이라는 이름으로 지었습니다.
    wrappedFunction 에서는 로딩과 에러처리를 해주기 때문에 우리가 따로 처리해주지 않아도 되는 장점이 있습니다
    */

      try {
        setError(null);
        setPending(true);
        return await asyncFunction(...args);
      } catch (error) {
        setError(error);
      } finally {
        setPending(false);
      }
    },
    [asyncFunction]
  );
  return [pending, error, wrappedFunction];
}

export default useAsync;
