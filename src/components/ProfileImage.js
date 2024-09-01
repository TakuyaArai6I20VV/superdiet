import { useState,useEffect } from 'react';
import axios from "axios";

export const ProfileImage = () => {
  const [image, setImage] = useState(null); // 初期値をnullに設定
  const [generatedImage, setGeneratedImage] = useState(null); // 生成された画像用のステート
  // コンポーネントの初期レンダリング時にLocalStorageから画像を取得
  useEffect(() => {
    const savedImage = localStorage.getItem('generatedImage');
    if (savedImage) {
      setGeneratedImage(savedImage);
    }
  }, []);
  // ファイルをBase64形式で読み込む関数
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);  // 成功時に結果を返す
      reader.onerror = (error) => reject(error);  // エラーが発生した場合
      reader.readAsDataURL(file);  // ファイルをBase64として読み込む
    });
  };
  const base64ToBlob = (base64, mime) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = mime || 'image/jpeg';
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // ファイルが選択されたときの処理
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await readFileAsDataURL(file); 
      setImage(base64Image); // 読み込んだ画像を設定
    }
  };

  // 生成ボタンが押されたときの処理
  const handleClick = async () => {
    const formData = new FormData();
    formData.append("prompt", "make the person funny");
    formData.append("output_format", "jpeg");
    formData.append("mode", "image-to-image");
    formData.append("strength", "0.7");
    if (image) {
        const blob = base64ToBlob(image, 'image/jpeg'); // Base64をBlobに変換
        formData.append("image", blob, 'image.jpg'); // BlobをFormDataに追加
    }    

    try {
      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        formData,
        {
          headers: { 
            Authorization: "sk-RqpQJJrkOq5oOIpzjShLKOfsLOJkyPRHTmREPXe8lfeBeArc", 
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const base64GeneratedImage = `data:image/jpeg;base64,${response.data.image}`; // Base64形式でレスポンスを受け取る
        localStorage.setItem('generatedImage', base64GeneratedImage);
        setGeneratedImage(base64GeneratedImage); // 生成された画像を設定
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during image generation:', error);
    }
  };

  return (
    <div>
      <input onChange={handleChange} type='file' />
      {image && <img src={image} alt="Uploaded" />} {/* アップロードされた画像を表示 */}
      <button onClick={handleClick}>
        生成！
      </button>
      {generatedImage && <img src={generatedImage} alt="Generated" />} {/* 生成された画像を表示 */}
    </div>
  );
};
