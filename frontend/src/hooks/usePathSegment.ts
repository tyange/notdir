import { useLocation } from "react-router-dom";

export const usePathSegment = (segmentIndex = 1) => {
  const location = useLocation();

  // 루트 경로인 경우 "/"를 반환
  if (location.pathname === "/") {
    return "/";
  }

  // 그 외의 경우는 이전과 동일하게 처리
  const segments = location.pathname.split("/").filter(Boolean);

  return segments[segmentIndex - 1];
};
