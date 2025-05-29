import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // 실제 연결용
import "./SettingsPage.css";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";

const SettingsPage = () => {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [editable, setEditable] = useState(false);
  const [referenceText, setReferenceText] = useState("");
  const [customText, setCustomText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const navigate = useNavigate();
  const user_id = user?.user_id || "local_test_user";

  const templateStyles = [
    {
      id: "style1",
      name: "밝고 경쾌한 문체",
      color: "yellow",
      text: "안녕! 나는 포미야! 반가워~",
    },
    {
      id: "style2",
      name: "감정적이고 서정적인 문체",
      color: "purple",
      text: "안녕하세요, 저는 포미라고 해요. 오늘도 당신의 하루가 따뜻하길 바라요.",
    },
    {
      id: "style3",
      name: "딱딱하고 형식적인 문체",
      color: "blue",
      text: "안녕하십니까. 제 이름은 포미입니다.",
    },
    {
      id: "style4",
      name: "귀엽고 아기자기한 문체",
      color: "pink",
      text: "안뇽! 포미 등장했뽀이~ 💛 나랑 놀자앙!",
    },
    {
      id: "style5",
      name: "유쾌하고 장난기 가득한 문체",
      color: "green",
      text: "야호~ 포미 입장! 심심한 사람, 여기 붙어라!",
    },
  ];

  useEffect(() => {
    if (!user_id) {
      navigate("/login");
      return;
    }

    // 👉 테스트용 시작
    const localData =
      JSON.parse(localStorage.getItem("fom_user_settings")) || {};
    setEmail(localData.email || "test@example.com");
    setPassword(localData.password || "password123");
    setOriginalEmail(localData.email || "test@example.com");
    setOriginalPassword(localData.password || "password123");
    const savedText = localData.reference_text || "";
    setReferenceText(savedText);

    if (!templateStyles.some((s) => s.text === savedText)) {
      setSelectedStyle("custom");
      setCustomText(savedText);
    } else {
      const matchedStyle = templateStyles.find((s) => s.text === savedText);
      if (matchedStyle) setSelectedStyle(matchedStyle.id);
    }
    // 👉 테스트용 끝
  }, [user_id, navigate]);

  const handleToggleEdit = () => {
    if (editable) {
      // 취소 → 원래 값 복구
      setEmail(originalEmail);
      setPassword(originalPassword);
      setEditable(false);
    } else {
      setEditable(true);
    }
  };

  const handleSaveUserInfo = async () => {
    // 👉 테스트용 시작
    localStorage.setItem(
      "fom_user_settings",
      JSON.stringify({
        email,
        password,
        reference_text:
          selectedStyle === "custom"
            ? customText
            : templateStyles.find((s) => s.id === selectedStyle)?.text,
      })
    );
    setEditable(false);
    setOriginalEmail(email);
    setOriginalPassword(password);
    alert("회원 정보가 로컬에 저장되었습니다.");
    // 👉 테스트용 끝

    /*
    // 👉 실제 axios 저장
    try {
      await axios.put(
        `https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/users/${user_id}`,
        { email, password }
      );
      setEditable(false);
      setOriginalEmail(email);
      setOriginalPassword(password);
      alert("회원 정보가 수정되었습니다.");
    } catch (error) {
      console.error("회원정보 수정 에러:", error);
      alert("회원정보 수정 실패");
    }
    */
  };

  const handleSaveStyle = async () => {
    const selectedText =
      selectedStyle === "custom"
        ? customText
        : templateStyles.find((s) => s.id === selectedStyle)?.text;

    // 👉 테스트용 시작
    const prev = JSON.parse(localStorage.getItem("fom_user_settings")) || {};
    localStorage.setItem(
      "fom_user_settings",
      JSON.stringify({
        ...prev,
        reference_text: selectedText,
      })
    );
    alert("문체가 로컬에 저장되었습니다.");
    // 👉 테스트용 끝
  };

  return (
    <div className="settings-container">
      <div className="top-buttons">
        <PreviousArrow />
        <h2 className="settings-title">설정</h2>
        <div className="right-buttons">
          <HomeButton />
        </div>
      </div>

      <div className="settings-wrapper">
        <div className="section-wrapper">
          <div className="section-title">사용자 정보</div>
          <div className="settings-box">
            <label className="label">이메일</label>
            <input
              className={editable ? "input editable" : "input"}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!editable}
            />
            <label className="label">비밀번호</label>
            <input
              className={editable ? "input editable" : "input"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              readOnly={!editable}
            />
            <div className="button-group">
              <button
                className="logout-button"
                onClick={() => navigate("/logout")}
              >
                로그아웃
              </button>
              {editable && (
                <button className="save-button" onClick={handleSaveUserInfo}>
                  저장하기
                </button>
              )}
              <button
                className={`edit-button ${editable ? "cancel" : ""}`}
                onClick={handleToggleEdit}
              >
                {editable ? "수정 취소" : "회원정보 수정"}
              </button>
            </div>
          </div>
        </div>

        <div className="section-wrapper">
          <div className="section-title">일기 문체</div>
          <div className="settings-box">
            <div className="style-options">
              {templateStyles.map((style) => (
                <div key={style.id} className="style-option">
                  <label className={`option-label ${style.color}`}>
                    <input
                      type="radio"
                      name="style"
                      value={style.id}
                      checked={selectedStyle === style.id}
                      onChange={() => setSelectedStyle(style.id)}
                    />
                    {style.name}
                  </label>
                  <p className="example-text">{style.text}</p>
                </div>
              ))}
              <div className="style-option">
                <label className="option-label brown">
                  <input
                    type="radio"
                    name="style"
                    value="custom"
                    checked={selectedStyle === "custom"}
                    onChange={() => setSelectedStyle("custom")}
                  />
                  사용자 지정 문체
                </label>
                {selectedStyle === "custom" && (
                  <textarea
                    className="custom-textbox"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="문체를 입력하세요..."
                  />
                )}
              </div>
            </div>
            <div className="style-save">
              <button onClick={handleSaveStyle}>저장하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
