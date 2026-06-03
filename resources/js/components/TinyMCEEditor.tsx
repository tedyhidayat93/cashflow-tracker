import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useConfig } from '@/utils/config';

// Get API key from environment
interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  menubar?: boolean;
  plugins?: string;
  toolbar?: string;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 400,
  menubar = true,
  plugins = 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
  toolbar = 'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code | fullscreen | help'
}) => {

  const { getConfig } = useConfig();

  const apikey = getConfig('tinymce_token', import.meta.env.VITE_JWT_TINYMCE);

  return (
    <Editor
      apiKey={apikey}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height,
        menubar,
        plugins,
        toolbar,
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
        branding: false,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true,
        paste_data_images: true,
        images_upload_handler: function (blobInfo: any, success: any) {
          // For now, just return the blob as a data URL
          const reader = new FileReader();
          reader.onload = function () {
            success(reader.result as string);
          };
          reader.readAsDataURL(blobInfo.files[0]);
        },
      }}
    />
  );
};

export default TinyMCEEditor;
