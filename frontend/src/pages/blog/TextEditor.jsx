import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function RichEditor(props) {
  const editorRef = useRef(null);

  const getAuthenticationParameters = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_IMAGEKIT_AUTH_ENDPOINT);
      if (!response.ok) {
        throw new Error('Failed to get authentication parameters');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching authentication parameters:', error);
      throw error;
    }
  };

  const uploadImageToImageKit = async (blobInfo, progress) => {
    try {
      const file = blobInfo.blob();
      const fileName = `${Date.now()}-${file.name}`;

      // Get authentication parameters
      const authParams = await getAuthenticationParameters();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('publicKey', process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY);
      formData.append('signature', authParams.signature);
      formData.append('token', authParams.token);
      formData.append('expire', authParams.expire);
      formData.append('useUniqueFileName', 'true');

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return (
    <Editor
      apiKey='i9lb54my2vxjsd3lq6vbp9407m5opijkqt4vs7ljvfnx5cat'
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={props.editorDefaultText || ""}
      onEditorChange={props.handleUpdate}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        images_upload_handler: uploadImageToImageKit,
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: (cb, value, meta) => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');

          input.onchange = function () {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = function () {
              const id = 'blobid' + (new Date()).getTime();
              const blobCache = editorRef.current.editorUpload.blobCache;
              const base64 = reader.result.split(',')[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              cb(blobInfo.blobUri(), { title: file.name });
            };
            reader.readAsDataURL(file);
          };

          input.click();
        }
      }}
    />
  );
}