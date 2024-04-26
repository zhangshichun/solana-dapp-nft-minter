import { forwardRef, useState, useImperativeHandle } from "react";
import FileUploader from "./FileUploader";
import URLInput from "./URLInput";
enum URLGetMode {
  UPLOAD = "upload",
  INPUT = "input",
}

export type FileURLSelectorRef = {
  getValue: () => string;
};

const FileURLSelector = (props, ref) => {
  const [mode, setMode] = useState<URLGetMode>(URLGetMode.INPUT);
  const [url, setUrl] = useState<string | null>(null);
  const onRadioChange = (e) => {
    const value = e.target.value;
    setMode(value as URLGetMode);
  };

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        if (!url) {
          throw new Error("URL invalid");
        }
        return url;
      },
    };
  });
  return (
    <div>
      <div>
        <input
          type="radio"
          checked={mode === URLGetMode.UPLOAD}
          value={URLGetMode.UPLOAD}
          name="mode"
          id="mode-upload"
          onChange={onRadioChange}
        />
        <label for="mode-upload">Upload a File</label>
      </div>
      <div>
        <input
          type="radio"
          checked={mode === URLGetMode.INPUT}
          value={URLGetMode.INPUT}
          name="mode"
          id="mode-input"
          onChange={onRadioChange}
        />
        <label for="mode-input">Input the URL</label>
      </div>
      {mode === URLGetMode.UPLOAD && <FileUploader />}
      {mode === URLGetMode.INPUT && <URLInput onChange={setUrl} value={url} />}
    </div>
  );
};

export default forwardRef(FileURLSelector);
