import axios from "axios";
import { useRef, useEffect, useState } from "react";
import Editor from "suneditor-react";

export default function TestSunEditorJsx({value , onChange}) {
  const editor = useRef();
  const [isUploading, setIsUploading] = useState(false); // State for managing upload status

  useEffect(() => {
    return () => {
      editor.current = null;
    };
  }, []);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const handleEditorChange = (content) => {
    onChange(content); // Call the onChange prop with updated content
  };

  const getAuthenticationParameters = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_IMAGEKIT_AUTH_ENDPOINT);
      if (!response.ok) {
        throw new Error("Failed to get authentication parameters");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching authentication parameters:", error);
      throw error;
    }
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    if (isUploading) return; // Prevent multiple uploads
    setIsUploading(true);

    const uploadImage = async () => {
      try {
        // Fetch authentication parameters
        const authParams = await getAuthenticationParameters();

        // Prepare form data for the image upload
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("publicKey", process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY);
        formData.append("signature", authParams.signature);
        formData.append("token", authParams.token);
        formData.append("expire", authParams.expire);
        formData.append("fileName", files[0].name);
        formData.append("alt", String(info?.alt) || "NoAltTextSpecified");
        formData.append("title", files[0].name);

        // Make the POST request to ImageKit's upload endpoint
        const response = await axios.post(
          "https://upload.imagekit.io/api/v1/files/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { url } = response.data; // Get the URL of the uploaded image
        console.log("Uploaded image URL:", url);

        // Call uploadHandler to insert the uploaded image URL into the editor
        uploadHandler({
          result: [
            {
              url, // Image URL from ImageKit
              name: files[0].name,
              size: files[0].size,
            },
          ],
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
        // Inform the editor that the upload failed
        uploadHandler({ result: [] });
      } finally {
        setIsUploading(false); // Reset upload status
      }
    };

    uploadImage();
  };

  return (
    <Editor
      getSunEditorInstance={getSunEditorInstance}
      onImageUploadBefore={handleImageUploadBefore} // Use the handler with isUploading control
      onChange={handleEditorChange}
      setContents={value} // Set the initial value
      setDefaultStyle="font-size:18px;"
      setOptions={{
        buttonList: [
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['font', 'fontSize', 'formatBlock','textStyle','paragraphStyle','hiliteColor'],
          ['align', 'horizontalRule', 'list', 'table'],
          ['link', 'image'],
          ['fullScreen', 'showBlocks', 'codeView']
        ],
        imageUploadUrl: `${process.env.REACT_APP_IMAGEKIT_UPLOAD_URL}`, // Set this to your API endpoint for direct uploads
      }}
      height="100vh"
    />
  );
}
