import liff from "@line/liff";
import React, { useEffect, useState } from 'react';
import "./App.css";

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
            src={src}
            alt={`image-${index}`}
            className="image"
            onClick={() => handleClick(index)}
            style={{ cursor: "pointer" }}
          />
        ))
      ) : (
        <img
          src={images[selectedImage]}
          alt={`selected-image`}
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
