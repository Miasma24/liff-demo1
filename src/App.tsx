import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import "./App.css";
import TreasureChestClosed from "../images/sozai_image_103600.png";
import TreasureChestOpened from "../images/sozai_image_103598.png";

function App() {
  const [userName, setUserName] = useState("名無し");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alreadyOpened, setAlreadyOpened] = useState(false);
  // デバイスタイプを管理するstate
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const images = [
    "../images/sozai_image_103600.png", // 画像1
    "../images/sozai_image_103600.png", // 画像2
    "../images/sozai_image_103600.png", // 画像3
  ];
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [size, setSize] = useState<number>(150);
  const [alpha, setAlpha] = useState<number>(1.0);
  const [atarihazure, tyuusen] = useState<boolean | null>(null);
  const [isAnimEnd, setAnimState] = useState<boolean>(false);

  // LIFF初期化とユーザー情報取得
  useEffect(() => {
    liff
      .init({
        liffId: process.env.VITE_LIFF_ID || "",
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        console.log("init");
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          liff.getProfile().then((profile) => {
            setUserName(profile.displayName);
            const idToken = liff.getIDToken(); // IDトークンを取得
            checkUserToken(idToken); // サーバーにトークンを送信し確認
          });
        }
      })
      .catch(() => {
        console.log("init failed");
      });
  }, []);

  // 画面幅の変化を監視してデバイスタイプを更新
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // クリーンアップ関数でイベントリスナーを解除
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* スタイルの設定
  const backgroundStyle = {
    backgroundImage: 'url(/path/to/your/image.jpg)',
    backgroundSize: isMobile ? 'cover' : 'contain', // モバイルならcover、PCならcontain
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
  };*/

  // サーバーにIDトークンを送信して一日一回かどうかを確認する関数
  const checkUserToken = async (idToken: string | null) => {
    if (!idToken) return;
    try {
      const response = await fetch("https://samplegame1.onrender.com/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      const result = await response.json();
      if (result.alreadyOpened) {
        setAlreadyOpened(true); // すでに開いたユーザーの場合
      }
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  };

  const handleClick = (index: number) => {
    if (alreadyOpened) {
      return; // すでに開いた場合はクリックさせない
    }
    setSelectedImage(index);
    tyuusen(Math.random() * 3 < 1.0 ? true : false);

    // 拡大アニメーション
    const interval = setInterval(() => {
      setSize((prevSize) => {
        if (prevSize >= 400) {
          clearInterval(interval);
          setAnimState(true);
          return prevSize;
        }
        return prevSize + 10;
      });
      setAlpha((prevAlpha) => {
        if (prevAlpha <= 0) {
          clearInterval(interval);
          setAnimState(true);
          return prevAlpha;
        }
        return prevAlpha - 0.04;
      });
    }, 100);
  };

  //{isMobile ? "BG mobile" : "BG pc}>
  return (
    <div>
      <div className="BG">
        <div className="atarihazureText">
          {alreadyOpened ? (
            <center>
              <p>またきてね！</p>
            </center>
          ) : selectedImage === null ? (
            <center>
              <p>宝箱を一つ選んでタップしてね！</p>
            </center>
          ) : (
            <p></p>
          )}
          <div className="image-container">
            {!alreadyOpened &&
              (selectedImage === null ? (
                images.map((src, index) => (
                  <div
                    key={index}
                    className={index === 0 ? "image" : index === 1 ? "image2" : "image3"}
                  >
                    <img
                      src={TreasureChestClosed}
                      alt="閉じた宝箱"
                      onClick={() => handleClick(index)}
                      style={{
                        cursor: "pointer",
                        width: 100,
                        height: 100,
                      }}
                    />
                  </div>
                ))
              ) : isAnimEnd ? (
                <div className="atarihazureText">
                  <center>
                    {atarihazure ? (
                      <strong>
                        <p>
                          あたり！<br />
                          クーポン獲得！
                        </p>
                      </strong>
                    ) : (
                      <strong>
                        <p>
                          はずれ！<br />
                          また明日挑戦してね！
                        </p>
                      </strong>
                    )}
                    <button className="button" onClick={() => window.close()}>戻る</button>
                  </center>
                </div>
              ) : (
                <div
                  className={selectedImage === 0 ? "image" : selectedImage === 1 ? "image2" : "image3"}
                >
                  <img
                    src={TreasureChestOpened}
                    alt="開いた宝箱"
                    style={{ width: `${size}px`, height: `${size}px`, opacity: `${alpha}` }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
