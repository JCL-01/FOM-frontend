// 🔽 기존 import 유지
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Gallery.module.css";
import PreviousArrow from "../components/PreviousArrow";
import Settings from "../components/Settings";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext";
// import axios from "axios"; // 🔹 실제 백엔드 연동 시 사용
// 샘플 이미지 import -> 나중에 삭제
import sample1 from "../assets/images/sample1.jpg";
import sample2 from "../assets/images/sample2.jpg";
import sample3 from "../assets/images/sample3.jpg";
import sample4 from "../assets/images/sample4.jpg";
import sample5 from "../assets/images/sample5.jpg";
import sample6 from "../assets/images/sample6.jpg";
import TrashIcon from "../assets/images/trash.png"; // ✅ 삭제 아이콘
import Smiley from "../assets/images/image-50.png"; // ✅ 공유 확인 팝업 이미지

const Gallery = () => {
  const navigate = useNavigate();
  const { user, setIsLoading } = useContext(UserContext);

  const [selectedTab, setSelectedTab] = useState("my");
  const [myGallery, setMyGallery] = useState([]);
  const [sharedGallery, setSharedGallery] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmShare, setConfirmShare] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);
      try {
        // 🔽 테스트 코드 시작
        const sampleImages1 = [
          sample1,
          sample2,
          sample3,
          sample4,
          sample5,
          sample6,
        ];
        const mockGallery = sampleImages1.map((img, i) => ({
          photo: img,
          created_at: `2025-06-0${i + 1}T10:00:00`,
          summary: `나의 일기 내용 ${i + 1}`,
          diary_id: i + 1,
          isShared: false, // 🔄 초기에는 공유되지 않은 상태로 설정
        }));
        setMyGallery(mockGallery);
        setSharedGallery([]); // 🔄 초기에는 공유된 항목 없음
        // 🔼 테스트 코드 끝
      } catch (error) {
        console.error("❌ 갤러리 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGallery();
  }, [user]);

  const handleGoToDiaryList = () => {
    setIsLoading(true);
    navigate("/diarylist");
  };

  const handleDeletePhoto = async (diary_id) => {
    setIsLoading(true);
    setMyGallery((prev) => prev.filter((item) => item.diary_id !== diary_id));
    setSharedGallery((prev) =>
      prev.filter((item) => item.diary_id !== diary_id)
    ); // 🔄 공유된 항목도 제거
    // 🔒 실제 API 예시
    // await axios.delete(`/api/diary/delete?diary_id=${diary_id}`);
    // await axios.delete(`/api/share/delete?diary_id=${diary_id}`); // 🔒 공유 테이블에서 삭제
    setPopupData(null);
    setIsLoading(false);
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    setMyGallery((prev) =>
      prev.filter((item) => !selectedIds.includes(item.diary_id))
    );
    setSharedGallery((prev) =>
      prev.filter((item) => !selectedIds.includes(item.diary_id))
    ); // 🔄 공유된 항목도 함께 제거
    // 🔒 실제 삭제 API 연동
    // for (const id of selectedIds) {
    //   await axios.delete(`/api/diary/delete?diary_id=${id}`);
    //   await axios.delete(`/api/share/delete?diary_id=${id}`);
    // }
    setSelectedIds([]);
    setIsDeleteMode(false);
    setIsLoading(false);
  };

  const handleShareConfirm = async () => {
    setIsLoading(true);
    // 🔽 테스트 코드 시작
    const newEntry = {
      diary_id: popupData.diary_id,
      user_id: user?.user_id,
      photo: popupData.photo,
      anonymous_summary: `익명화된 요약: ${popupData.summary}`,
      created_at: new Date().toISOString(),
    };
    setSharedGallery((prev) => [...prev, newEntry]);
    setMyGallery((prev) =>
      prev.map((item) =>
        item.diary_id === popupData.diary_id
          ? { ...item, isShared: true }
          : item
      )
    );
    // 🔼 테스트 코드 끝

    // 🔒 실제 API 연동 예시
    /*
    const response = await axios.post("/api/share", {
      user_id: user.user_id,
      diary_id: popupData.diary_id,
      photo: popupData.photo,
      anonymous_summary: await autoGen(popupData.summary),
      created_at: new Date(),
    });
    */

    setConfirmShare(false);
    setPopupData(null);
    setIsLoading(false);
  };

  const handleCancelShare = async () => {
    setIsLoading(true);
    setSharedGallery((prev) =>
      prev.filter((item) => item.diary_id !== popupData.diary_id)
    );
    setMyGallery((prev) =>
      prev.map((item) =>
        item.diary_id === popupData.diary_id
          ? { ...item, isShared: false }
          : item
      )
    );
    // 🔒 실제 API 연동 예시
    /*
    await axios.delete(`/api/share/delete?diary_id=${popupData.diary_id}`);
    */
    setPopupData(null);
    setIsLoading(false);
  };

  const currentGallery =
    selectedTab === "my"
      ? myGallery
      : sharedGallery.filter((item) => {
          const today = new Date();
          const createdAt = new Date(item.created_at);
          const diff = (today - createdAt) / (1000 * 60 * 60 * 24);
          return diff <= 1;
        });

  const placeholders =
    6 - currentGallery.length > 0 ? 6 - currentGallery.length : 0;

  return (
    <div className={styles["gallery-page"]}>
      {/* 🔹 상단 네비게이션 */}
      <div className={styles["top-bar"]}>
        <div className={styles["back-button"]}>
          <PreviousArrow />
        </div>
        <div className={styles["right-buttons"]}>
          <Settings />
          <HomeButton />
        </div>
      </div>

      {/* 🔹 탭 메뉴 */}
      <div className={styles["tab-menu"]}>
        <button
          className={`${styles["tab-btn"]} ${
            selectedTab === "my" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("my")}
        >
          나의 감정갤러리
        </button>
        <button
          className={`${styles["tab-btn"]} ${
            selectedTab === "shared" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("shared")}
        >
          마음 갤러리
        </button>
      </div>

      {/* 🔹 갤러리 박스 */}
      <div className={styles["gallery-box"]}>
        {currentGallery.length === 0 && selectedTab === "my" && (
          <div className={styles["no-image-message"]}>
            갤러리가 비어있습니다.
          </div>
        )}
        {currentGallery.map((entry, idx) => (
          <div
            key={idx}
            className={styles["gallery-item"]}
            onClick={() => !isDeleteMode && setPopupData(entry)}
          >
            <img
              src={entry.photo}
              alt={`감정 이미지 ${idx + 1}`}
              className={styles["gallery-img"]}
            />
            {/* 🔹 공유된 이미지 좌측 상단 체크 표시 */}
            {selectedTab === "my" && entry.isShared && (
              <div className={styles["shared-check"]}>✅</div>
            )}
            {/* 🔹 삭제 선택 버튼 */}
            {isDeleteMode && selectedTab === "my" && (
              <button
                className={`${styles["select-circle"]} ${
                  selectedIds.includes(entry.diary_id) ? styles["selected"] : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(entry.diary_id);
                }}
              />
            )}
          </div>
        ))}
        {Array.from({ length: placeholders }).map((_, idx) => (
          <div key={`empty-${idx}`} className={styles["gallery-item"]}></div>
        ))}
      </div>

      {/* 🔹 하단 버튼 */}
      <div className={styles["bottom-btn-wrapper"]}>
        {selectedTab === "my" && isDeleteMode && (
          <>
            <button
              className={styles["delete-count-button"]}
              onClick={handleBulkDelete}
            >
              {selectedIds.length}개 항목 삭제
            </button>
            <button
              className={styles["cancel-delete-button"]}
              onClick={toggleDeleteMode}
            >
              취소
            </button>
          </>
        )}
        {selectedTab === "my" && !isDeleteMode && (
          <button className={styles["trash-button"]} onClick={toggleDeleteMode}>
            <img src={TrashIcon} alt="삭제 모드" />
          </button>
        )}
        <button
          className={styles["go-generate-btn"]}
          onClick={handleGoToDiaryList}
        >
          이미지 만들러가기
        </button>
      </div>

      {/* 🔹 공유 확인 팝업 */}
      {confirmShare && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setConfirmShare(false)}
        >
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={Smiley}
              alt="공유 아이콘"
              className={styles["popup-image"]}
            />
            <div className={styles["popup-info"]}>
              <span className={styles["popup-message"]}>
                정말정말 공유 할까요?
              </span>
            </div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn"]}
                onClick={handleShareConfirm}
              >
                예
              </button>
              <button
                className={styles["popup-btn"]}
                onClick={() => setConfirmShare(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 상세 이미지 팝업 ― 박스 없는 형식으로 변경 */}
      {popupData && !confirmShare && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setPopupData(null)}
        >
          <div
            className={styles["popup-float-container"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={popupData.photo}
              alt="선택 이미지"
              className={styles["popup-large-img"]}
            />
            <div className={styles["popup-info-bar"]}>
              <span className={styles["popup-date"]}>
                {new Date(popupData.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </span>
              {selectedTab === "my" && (
                <div className={styles["popup-actions"]}>
                  <button
                    className={styles["popup-btn"]}
                    onClick={() => handleDeletePhoto(popupData.diary_id)}
                  >
                    🗑️
                  </button>
                  {!popupData.isShared ? (
                    <button
                      className={styles["popup-btn"]}
                      onClick={() => setConfirmShare(true)}
                    >
                      🔗
                    </button>
                  ) : (
                    <button
                      className={styles["popup-btn"]}
                      onClick={handleCancelShare}
                    >
                      공유 취소
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={styles["popup-summary"]}>
              {selectedTab === "shared"
                ? popupData.anonymous_summary
                : popupData.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
