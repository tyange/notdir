import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ShowMessageDialog, GetInitialData } from "../../wailsjs/go/main/App";
import { main, frontend } from "../../wailsjs/go/models";

import NotdirBox from "../components/NotdirBox/NotdirBox";
import NotdirsContainer from "../components/NotdirsContainer/NotdirsContainer";
import Loading from "../components/Loading/Loading";
import ResultState from "../components/ResultState/ResultState";
import DraggableItems from "../components/DraggableItems/DraggableItems";
import { useNotdirBasesStore } from "../stores/useNotdirBasesStore";

const NotdirListPage = () => {
  const { notdirBases, isEdit, setNotdirBases, updateNotdirBases } =
    useNotdirBasesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const onClickNotdirHandler = async (notdirBase: main.NotdirBase) => {
    if (!notdirBase.Id || notdirBase.Id === "") {
      await ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Message: "notdir의 ID가 없거나, 빈 문자열입니다.",
          Type: "warning",
        })
      );
      return;
    }

    try {
      navigate(`/notdir/${notdirBase.Id}`);
    } catch (err) {
      await ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Message: err,
          Type: "warning",
        })
      );
      console.error(err);
    }
  };

  const fetchInitialData = async () => {
    setIsLoading(true);

    try {
      const result = await GetInitialData();

      if (result) {
        setNotdirBases(result);
      }
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      console.error(err);
      setIsLoading(false);
    }
  };

  const renderItem = (notdirBase: main.NotdirBase, isDragging: boolean) => {
    return (
      <NotdirBox
        key={notdirBase.Id}
        onClick={() => onClickNotdirHandler(notdirBase)}
        notdir={notdirBase}
      />
    );
  };

  const handleNotdirBasesChange = (notdirBases: main.NotdirBase[]) => {
    updateNotdirBases(notdirBases);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ResultState message="에러가 발생했습니다!" />;
  }

  if (notdirBases && notdirBases.length === 0) {
    return <ResultState message="아직 열린 Notdir가 없어요!" />;
  }

  return (
    <NotdirsContainer>
      <DraggableItems<main.NotdirBase>
        draggableItems={notdirBases}
        setDraggableItems={handleNotdirBasesChange}
        renderItem={renderItem}
        isDisabledDrag={isEdit}
      />
    </NotdirsContainer>
  );
};

export default NotdirListPage;
