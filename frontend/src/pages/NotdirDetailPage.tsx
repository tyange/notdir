import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { NotdirFileOpen } from "../../wailsjs/go/main/App";

import NotdirDetail from "../components/NotdirDetail/NotdirDetail";
import Loading from "../components/Loading/Loading";
import ResultState from "../components/ResultState/ResultState";

const NotdirDetailPage = () => {
  const { id } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["notdirDetail", id],
    queryFn: () => NotdirFileOpen(id),
  });

  if (isPending) return <Loading />;

  if (!data || isError) return <ResultState message="에러가 발생했습니다!" />;

  return <NotdirDetail notdir={data} />;
};

export default NotdirDetailPage;
