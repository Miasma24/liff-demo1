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

    // 拡大アニメーション
    const interval = setInterval(() => {
      setSize((prevSize) => {
        if (prevSize >= 400) {
          clearInterval(interval);
          return prevSize;
        }
        return prevSize + 10;
      });
    }, 100);
  };

  return (
    <div className="image-container">
      {selectedImage === null ? (
        images.map((src, index) => (
          <img
            key={index}
            src={TreasureChestClosed}
            alt="../images/sozai_image_103600.png"
            className="image"
            onClick={() => handleClick(index)}
            style={{
              cursor: "pointer",
              width: 100,
              height: 100
            }}
          />
        ))
      ) : (
        <img
          src={TreasureChestOpened}
          alt="../images/sozai_image_103598.png"
          className="image"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      )}
    </div>
  );
};
//return <h1>{isLoggedIn ? `こんにちは、${userName}さん` : "Loading..."}</h1>;
//}

export default App;
