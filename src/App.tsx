import liff from "@line/liff";
import React, { useEffect, useState } from 'react';
import "./App.css";
import TreasureChestClosed from "../images/sozai_image_103600.png";
import TreasureChestOpened from "../images/sozai_image_103598.png";

function App() {
  const [userName, setUserName] = useState("名無し");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  useEffect(() => {
    liff
      .init({
        liffId: process.env.VITE_LIFF_ID || "",
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        console.log("init");
        liff.getProfile().then((profile) => {
          console.log("get profile");
          setIsLoggedIn(liff.isLoggedIn());
          setUserName(profile.displayName);
        }).catch(() => { console.log("get profile failed"); });
      })
      .catch(() => {
        console.log("init failed");
      });
  }, []);

  const handleClick = (index: number) => {
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

  return (
    <div>
      <div className="BG">
        <div className="atarihazureText">
          {selectedImage === null ?
            <center>
              <p>
                宝箱を一つ選んでタップしてね！
              </p>
            </center>
            :
            <p>
            </p>
          }
          <div className="image-container">
            {selectedImage === null ? (
              images.map((src, index) => (
                <div className={index === 0 ? "image" : index === 1 ? "image2" : "image3"}>
                  <img
                    key={index}
                    src={TreasureChestClosed}
                    alt="閉じた宝箱"
                    //className={index === 0 ? "image" : index === 1 ? "image2" : "image3"}
                    onClick={() => handleClick(index)}
                    style={{
                      cursor: "pointer",
                      width: 100,
                      height: 100
                    }}
                  />
                </div>
              ))
            ) : isAnimEnd ? (
              <div className="atarihazureText">
                <center>
                  {atarihazure ?
                    <strong>
                      <p>
                        あたり！<br />
                        クーポン獲得！
                      </p>
                    </strong>
                    :
                    <strong>
                      <p>
                        はずれ！<br />
                        また明日挑戦してね！
                      </p>
                    </strong>
                  }
                  <button
                    onClick={() => window.close()}>
                    戻る
                  </button>
                </center>
              </div>
            ) : (
              <div className={selectedImage === 0 ? "image" : selectedImage === 1 ? "image2" : "image3"}>
                <img
                  src={TreasureChestOpened}
                  alt="開いた宝箱"
                  className="image"
                  style={{ width: `${size}px`, height: `${size}px`, opacity: `${alpha}` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
//return <h1>{isLoggedIn ? `こんにちは、${userName}さん` : "Loading..."}</h1>;
//}

export default App;
